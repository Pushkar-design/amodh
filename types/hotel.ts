export type Room = {
  id: string;
  name: string;
  price_per_night: number;
  is_available: boolean;
  image_url: string | null;
  description: string | null;
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
