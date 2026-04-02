import { NextRequest, NextResponse } from "next/server";
import { parseImageUrlForDb } from "@/lib/imageUrl";
import { createServiceClient } from "@/lib/supabaseServer";
import { isAdminAuthenticated } from "@/lib/supabaseServerAuth";

const ROOM_SELECT =
  "id, name, price_per_night, is_available, image_url, description, max_occupancy, extra_bed_note";

/** Public list: only rooms shown on the marketing site. */
export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("rooms")
      .select(ROOM_SELECT)
      .eq("is_available", true)
      .order("name");

    if (error) throw error;
    return NextResponse.json({ rooms: data ?? [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load rooms", rooms: [] },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    name?: string;
    price_per_night?: number;
    description?: string | null;
    is_available?: boolean;
    image_url?: string | null;
    max_occupancy?: number;
    extra_bed_note?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const price = Number(body.price_per_night);
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json(
      { error: "price_per_night must be a non-negative number" },
      { status: 400 }
    );
  }

  const description =
    body.description === undefined || body.description === null
      ? null
      : String(body.description);
  const is_available =
    typeof body.is_available === "boolean" ? body.is_available : true;
  const imageParsed = parseImageUrlForDb(body.image_url);
  if (!imageParsed.ok) {
    return NextResponse.json({ error: imageParsed.error }, { status: 400 });
  }
  const image_url = imageParsed.url;

  let max_occupancy = 2;
  if (body.max_occupancy !== undefined) {
    const m = Math.round(Number(body.max_occupancy));
    if (!Number.isFinite(m) || m < 1 || m > 50) {
      return NextResponse.json(
        { error: "max_occupancy must be between 1 and 50" },
        { status: 400 }
      );
    }
    max_occupancy = m;
  }

  const extra_bed_note =
    body.extra_bed_note === undefined || body.extra_bed_note === null
      ? null
      : String(body.extra_bed_note).trim() || null;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("rooms")
      .insert({
        name,
        price_per_night: price,
        description,
        is_available,
        image_url,
        max_occupancy,
        extra_bed_note,
      })
      .select(ROOM_SELECT)
      .single();

    if (error) throw error;
    return NextResponse.json({ room: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 503 }
    );
  }
}
