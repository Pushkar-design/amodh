-- Amodh hotel — run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price_per_night NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  max_occupancy INTEGER NOT NULL DEFAULT 2,
  extra_bed_note TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  notes TEXT,
  CONSTRAINT bookings_dates_chk CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS hotel_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whatsapp_number TEXT NOT NULL DEFAULT '',
  contact_phone TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  meals_enabled BOOLEAN NOT NULL DEFAULT false,
  meal_breakfast_pp_night NUMERIC(10, 2),
  meal_lunch_pp_night NUMERIC(10, 2),
  meal_dinner_pp_night NUMERIC(10, 2)
);

-- Single settings row pattern
INSERT INTO hotel_settings (whatsapp_number)
SELECT '15551234567'
WHERE NOT EXISTS (SELECT 1 FROM hotel_settings LIMIT 1);

-- Seed rooms (replace image URLs with your Supabase Storage URLs in production)
INSERT INTO rooms (name, price_per_night, is_available, image_url)
SELECT name, price_per_night, is_available, image_url
FROM (
  VALUES
    ('Garden Suite', 420.00::numeric, true, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'),
    ('Terrace Room', 310.00::numeric, true, 'https://images.unsplash.com/photo-1611892440504-42a792e54d34?w=800&q=80'),
    ('Penthouse', 680.00::numeric, true, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80')
) AS v(name, price_per_night, is_available, image_url)
WHERE (SELECT COUNT(*) FROM rooms) = 0;

-- RLS: enable and allow service role full access via API; for anon client reads you can add policies later.
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read rooms" ON rooms;
DROP POLICY IF EXISTS "Allow public read bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public read settings" ON hotel_settings;

CREATE POLICY "Allow public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Allow public read settings" ON hotel_settings FOR SELECT USING (true);

-- Bookings: no public SELECT — reads go through API routes with service role only
-- (see migration 20260331140000_bookings_rls_no_public_select.sql).

-- Inserts/updates/deletes go through server API with service role (bypasses RLS).
-- Optional: add authenticated policies for direct client access later.

-- Emails allowed admin access when not listed in ADMIN_ALLOWED_EMAILS (service role only).
CREATE TABLE IF NOT EXISTS admin_emails (
  email TEXT PRIMARY KEY
);

ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
