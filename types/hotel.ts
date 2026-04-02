export type Room = {
  id: string;
  name: string;
  price_per_night: number;
  is_available: boolean;
  image_url: string | null;
  description: string | null;
  max_occupancy: number;
  extra_bed_note: string | null;
};

/** Public-facing hotel settings from GET /api/settings */
export type PublicHotelSettings = {
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  meals_enabled: boolean;
  meal_breakfast_pp_night: number | null;
  meal_lunch_pp_night: number | null;
  meal_dinner_pp_night: number | null;
};

/** Public availability uses only scheduling fields; admin responses include guest_* */
export type Booking = {
  id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  guest_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  notes?: string | null;
};

export type BookingWithRoom = Booking & {
  rooms: Pick<Room, "name"> | null;
};
