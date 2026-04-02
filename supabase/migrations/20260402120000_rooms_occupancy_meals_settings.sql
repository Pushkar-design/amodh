-- Room occupancy & extra bed; global meal add-ons (per person per night)

alter table public.rooms
  add column if not exists max_occupancy integer not null default 2,
  add column if not exists extra_bed_note text;

alter table public.hotel_settings
  add column if not exists meals_enabled boolean not null default false,
  add column if not exists meal_breakfast_pp_night numeric(10, 2),
  add column if not exists meal_lunch_pp_night numeric(10, 2),
  add column if not exists meal_dinner_pp_night numeric(10, 2);

comment on column public.rooms.max_occupancy is 'Maximum guests for this room; villa total is sum of all listed rooms.';
comment on column public.rooms.extra_bed_note is 'Short guest-facing note about extra bed (optional).';
comment on column public.hotel_settings.meals_enabled is 'When false, hide meal toggles on the marketing site.';
comment on column public.hotel_settings.meal_breakfast_pp_night is 'Add-on per guest per night; null = not offered.';
comment on column public.hotel_settings.meal_lunch_pp_night is 'Add-on per guest per night; null = not offered.';
comment on column public.hotel_settings.meal_dinner_pp_night is 'Add-on per guest per night; null = not offered.';
