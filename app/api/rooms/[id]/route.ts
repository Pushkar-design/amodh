import { NextRequest, NextResponse } from "next/server";
import { parseImageUrlForDb } from "@/lib/imageUrl";
import { createServiceClient } from "@/lib/supabaseServer";
import { isAdminAuthenticated } from "@/lib/supabaseServerAuth";

const ROOM_SELECT =
  "id, name, price_per_night, is_available, image_url, description";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body: {
    name?: string;
    image_url?: string | null;
    is_available?: boolean;
    price_per_night?: number;
    description?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) {
      return NextResponse.json({ error: "name cannot be empty" }, { status: 400 });
    }
    updates.name = name;
  }

  if (body.image_url !== undefined) {
    const parsed = parseImageUrlForDb(body.image_url);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    updates.image_url = parsed.url;
  }

  if (body.is_available !== undefined) {
    if (typeof body.is_available !== "boolean") {
      return NextResponse.json(
        { error: "is_available must be a boolean" },
        { status: 400 }
      );
    }
    updates.is_available = body.is_available;
  }

  if (body.price_per_night !== undefined) {
    const n = Number(body.price_per_night);
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json(
        { error: "price_per_night must be a non-negative number" },
        { status: 400 }
      );
    }
    updates.price_per_night = n;
  }

  if (body.description !== undefined) {
    updates.description =
      body.description === null ? null : String(body.description);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("rooms")
      .update(updates)
      .eq("id", id)
      .select(ROOM_SELECT)
      .single();

    if (error) throw error;
    return NextResponse.json({ room: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 503 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 503 }
    );
  }
}
