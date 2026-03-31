-- Run in Supabase SQL editor or via CLI if you use migrations.
-- Adds optional long-form copy for each room (editable in /admin).

alter table public.rooms
  add column if not exists description text;

comment on column public.rooms.description is 'Marketing / vibe copy shown on the public site and editable in the admin dashboard.';
