-- Amodh: full database bootstrap (run once per Supabase project).
-- Option A — Dashboard: Supabase → SQL Editor → New query → paste this file → Run.
-- Option B — From repo: add DATABASE_URL to .env.local, then `npm run db:apply`.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price_per_night NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT
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
  whatsapp_number TEXT NOT NULL DEFAULT ''
);

INSERT INTO hotel_settings (whatsapp_number)
SELECT '15551234567'
WHERE NOT EXISTS (SELECT 1 FROM hotel_settings LIMIT 1);

INSERT INTO rooms (name, price_per_night, is_available, image_url)
SELECT name, price_per_night, is_available, image_url
FROM (
  VALUES
    ('Garden Suite', 420.00::numeric, true, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'),
    ('Terrace Room', 310.00::numeric, true, 'https://images.unsplash.com/photo-1611892440504-42a792e54d34?w=800&q=80'),
    ('Penthouse', 680.00::numeric, true, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80')
) AS v(name, price_per_night, is_available, image_url)
WHERE (SELECT COUNT(*) FROM rooms) = 0;

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read rooms" ON rooms;
DROP POLICY IF EXISTS "Allow public read bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public read settings" ON hotel_settings;

CREATE POLICY "Allow public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Allow public read settings" ON hotel_settings FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS admin_emails (
  email TEXT PRIMARY KEY
);

ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- Marketing copy column (matches supabase/migrations/20260331120000_rooms_description.sql)
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS description TEXT;

COMMENT ON COLUMN public.rooms.description IS 'Marketing / vibe copy shown on the public site and editable in the admin dashboard.';

-- Occupancy, extra bed, global meals (matches migrations/20260402120000_rooms_occupancy_meals_settings.sql)
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS max_occupancy INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS extra_bed_note TEXT;

ALTER TABLE public.hotel_settings
  ADD COLUMN IF NOT EXISTS meals_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS meal_breakfast_pp_night NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS meal_lunch_pp_night NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS meal_dinner_pp_night NUMERIC(10, 2);

-- Ensure no public SELECT on bookings (matches migrations/bookings_rls)
DROP POLICY IF EXISTS "Allow public read bookings" ON bookings;

-- Storage: admin-uploaded room photos (matches migrations/20260331200000_room_images_bucket.sql)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Anyone can read room images" ON storage.objects;
CREATE POLICY "Anyone can read room images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'room-images');
