import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * True if another booking exists for this room overlapping [startDate, endDate]
 * (inclusive), matching public availability query semantics.
 */
export async function roomHasBookingOverlap(
  supabase: SupabaseClient,
  roomId: string,
  startDate: string,
  endDate: string,
  excludeBookingId?: string
): Promise<boolean> {
  let q = supabase
    .from("bookings")
    .select("id")
    .eq("room_id", roomId)
    .lte("start_date", endDate)
    .gte("end_date", startDate);
  if (excludeBookingId) {
    q = q.neq("id", excludeBookingId);
  }
  const { data, error } = await q.limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
