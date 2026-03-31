import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";
import { isAdminAuthenticated } from "@/lib/supabaseServerAuth";

const BUCKET = "room-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller" },
      { status: 400 }
    );
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Use JPEG, PNG, WebP, or GIF" },
      { status: 400 }
    );
  }

  const ext = EXT[type] ?? "bin";
  const path = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const supabase = createServiceClient();
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: type,
        upsert: false,
      });

    if (upErr) {
      console.error(upErr);
      return NextResponse.json(
        { error: "Upload failed. Create the “room-images” bucket in Supabase (see migration) or check logs." },
        { status: 503 }
      );
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: pub.publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 503 });
  }
}
