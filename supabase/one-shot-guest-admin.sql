-- Run once in Supabase Dashboard → SQL Editor (or: npm run db:apply with DATABASE_URL set).
-- Adds guest fields on bookings + admin_emails allowlist table.

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_name TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_phone TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE TABLE IF NOT EXISTS admin_emails (
  email TEXT PRIMARY KEY
);

ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
