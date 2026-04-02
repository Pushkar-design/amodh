import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";
import { isAdminAuthenticated } from "@/lib/supabaseServerAuth";

const ROOM_SELECT =
  "id, name, price_per_night, is_available, image_url, description, max_occupancy, extra_bed_note";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("rooms")
      .select(ROOM_SELECT)
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
