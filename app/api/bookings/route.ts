import { NextRequest, NextResponse } from "next/server";
import { BOOKING_ROW_SELECT } from "@/lib/bookingSelect";
import { roomHasBookingOverlap } from "@/lib/bookingConflicts";
import { createServiceClient } from "@/lib/supabaseServer";
import { isAdminAuthenticated } from "@/lib/supabaseServerAuth";

export async function GET(request: NextRequest) {
  const checkIn = request.nextUrl.searchParams.get("checkIn");
  const checkOut = request.nextUrl.searchParams.get("checkOut");

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: "checkIn and checkOut query parameters are required" },
      { status: 400 }
    );
  }

  if (checkOut <= checkIn) {
    return NextResponse.json(
      { error: "checkOut must be after checkIn" },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("id, room_id, start_date, end_date")
      .lte("start_date", checkOut)
      .gte("end_date", checkIn);

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

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    room_id?: string;
    start_date?: string;
    end_date?: string;
    guest_name?: string | null;
    guest_email?: string | null;
    guest_phone?: string | null;
    notes?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { room_id, start_date, end_date } = body;
  if (!room_id || !start_date || !end_date) {
    return NextResponse.json(
      { error: "room_id, start_date, and end_date are required" },
      { status: 400 }
    );
  }

  if (end_date < start_date) {
    return NextResponse.json(
      { error: "end_date must be on or after start_date" },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();
    const overlaps = await roomHasBookingOverlap(
      supabase,
      room_id,
      start_date,
      end_date
    );
    if (overlaps) {
      return NextResponse.json(
        { error: "That room is already booked for overlapping dates" },
        { status: 409 }
      );
    }

    const insertRow: Record<string, unknown> = {
      room_id,
      start_date,
      end_date,
    };
    if (body.guest_name !== undefined) {
      insertRow.guest_name =
        body.guest_name === null ? null : String(body.guest_name).trim() || null;
    }
    if (body.guest_email !== undefined) {
      insertRow.guest_email =
        body.guest_email === null ? null : String(body.guest_email).trim() || null;
    }
    if (body.guest_phone !== undefined) {
      insertRow.guest_phone =
        body.guest_phone === null ? null : String(body.guest_phone).trim() || null;
    }
    if (body.notes !== undefined) {
      insertRow.notes =
        body.notes === null ? null : String(body.notes).trim() || null;
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert(insertRow)
      .select(BOOKING_ROW_SELECT)
      .single();

    if (error) throw error;
    return NextResponse.json({ booking: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 503 }
    );
  }
}
