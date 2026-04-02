-- Public contact lines for marketing site (phone + email); WhatsApp remains primary for enquiries

alter table public.hotel_settings
  add column if not exists contact_phone text not null default '',
  add column if not exists contact_email text not null default '';

comment on column public.hotel_settings.contact_phone is 'Display / tel: link (e.g. +91 98765 43210 or +15550102030). Empty = use site fallback.';
comment on column public.hotel_settings.contact_email is 'Public contact email. Empty = use site fallback.';
