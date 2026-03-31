/** Single booking row (no join). */
export const BOOKING_ROW_SELECT =
  "id, room_id, start_date, end_date, guest_name, guest_email, guest_phone, notes";

/** Admin list: row + room name. */
export const ADMIN_BOOKING_SELECT = `${BOOKING_ROW_SELECT}, rooms(name)`;
