import { NextResponse } from "next/server";
import { ADMIN_BOOKING_SELECT } from "@/lib/bookingSelect";
import { createServiceClient } from "@/lib/supabaseServer";
import { isAdminAuthenticated } from "@/lib/supabaseServerAuth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("bookings")
      .select(ADMIN_BOOKING_SELECT)
      .order("start_date", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ bookings: data ?? [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load bookings", bookings: [] },
      { status: 503 }
    );
  }
}
