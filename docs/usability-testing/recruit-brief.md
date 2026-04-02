# Usability testing — participant recruit brief (Amod)

## Study overview

We are running **5–8 moderated, think-aloud sessions** (30–45 minutes each) on the **Amod** boutique stay website. Sessions are **remote** (video call + screen share). We record screen and audio with consent.

**Product context:** The site is **not** instant checkout. Guests choose dates, optional meals, and rooms (or the entire villa), then **send an enquiry via WhatsApp** with a pre-filled summary. There is also a separate **Contact** page with phone, email, and WhatsApp.

## Who we need

- Adults who have **booked travel or boutique accommodation online** in the last few years (OTA, hotel site, or messaging-based enquiry).
- Mix of **mobile and desktop** comfort; at least **2–3 sessions on a phone** if possible.
- **Not** required: familiarity with Amod or this codebase.

**Exclusions (optional):** Employees of the property, people who built this site, or professional UX researchers (unless you want a pilot).

## Incentive & scheduling

- State your incentive in the screener (e.g. gift card, cash equivalent, or volunteer).
- Send calendar links; buffer **15 minutes** between sessions.

## Consent (cover verbally + written)

- Sessions recorded for internal product improvement only.
- Participants may stop at any time.
- No need to use a real phone number in WhatsApp during the test; **use a test number or stop before sending** if you prefer participants not to message production.

## Technical setup for participants

- Stable internet, **Chrome or Safari** (recent).
- **Quiet space**; headphones help.
- **Preview URL** you provide (e.g. Vercel preview or `http://localhost:3000` for staff-only pilots).

## What you send them (one paragraph)

> You’ll open a new hotel website and try to find availability and start a booking the way you normally would. We’ll ask you to think out loud. There are no wrong answers—we’re testing the site, not you. The site sends requests through WhatsApp rather than taking payment online; we’ll tell you when to stop before actually sending a message if needed.

## Moderator-only: environment checklist

Before sessions:

1. Database bootstrapped (`supabase/complete-setup.sql` or equivalent).
2. Run [`supabase/usability-test-seed.sql`](../../supabase/usability-test-seed.sql) for **meals + WhatsApp settings + one overlapping booking** (so one room shows unavailable for May 2026 test dates).
3. `NEXT_PUBLIC_SUPABASE_*` and `SUPABASE_SERVICE_ROLE_KEY` set so the home page loads rooms and settings.
4. Optional: deploy **preview** and share URL; **preview route** on the app is `/preview-amod` (same flow, correct in-page anchors).
5. Optional: `NEXT_PUBLIC_SHOW_ADMIN_LINK=true` only if you want participants to see Admin (usually **off**).
