-- Bookings are read only through Next.js API routes (service role).
-- Drop anon/public SELECT so the anon key cannot enumerate all bookings via PostgREST.
DROP POLICY IF EXISTS "Allow public read bookings" ON bookings;
