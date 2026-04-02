-- Amodh — usability / moderated testing seed (Supabase SQL Editor)
-- Prerequisites: schema + rooms exist (run complete-setup.sql or schema + migrations first).
--
-- What this does:
-- 1) Sets hotel_settings for WhatsApp enquiry + visible meal add-ons (matches home /api/settings).
-- 2) Removes any previous seed bookings (notes = 'amod-usability-seed').
-- 3) Inserts one overlapping booking on "Garden Suite", or the first room by name if renamed.
--
-- Suggested participant dates (overlap the seed booking): check-in 2026-05-14, check-out 2026-05-19.
-- Pick dates outside 2026-05-10 .. 2026-05-22 if you need every room available.

UPDATE hotel_settings
SET
  whatsapp_number = '15551234567',
  meals_enabled = true,
  meal_breakfast_pp_night = 450,
  meal_lunch_pp_night = 650,
  meal_dinner_pp_night = 950
WHERE id = (SELECT id FROM hotel_settings LIMIT 1);

INSERT INTO hotel_settings (whatsapp_number, meals_enabled, meal_breakfast_pp_night, meal_lunch_pp_night, meal_dinner_pp_night)
SELECT '15551234567', true, 450, 650, 950
WHERE NOT EXISTS (SELECT 1 FROM hotel_settings LIMIT 1);

DELETE FROM bookings WHERE notes = 'amod-usability-seed';

INSERT INTO bookings (room_id, start_date, end_date, guest_name, notes)
SELECT
  COALESCE(
    (SELECT id FROM rooms WHERE name = 'Garden Suite' LIMIT 1),
    (SELECT id FROM rooms ORDER BY name ASC LIMIT 1)
  ),
  DATE '2026-05-10',
  DATE '2026-05-22',
  'Usability seed guest',
  'amod-usability-seed'
WHERE EXISTS (SELECT 1 FROM rooms LIMIT 1);
