# Usability synthesis & prioritized recommendations (Amod)

This document ties **planned test hypotheses** to **evidence** and **recommended fixes**. After live sessions, add a **“Participant evidence”** column to each row with quotes and counts.

## Summary hypothesis list (from product plan)

| ID | Hypothesis |
|----|------------|
| H1 | Hero **Book Your Stay** / header **Reserve** jump to `#rooms` while **dates** live in `#book` above → users miss the dates step. |
| H2 | After valid dates, **no primary “continue”** → hesitation / extra scrolling. |
| H3 | **Meals** sit between dates and rooms → users mis-model when meal toggles affect price. |
| H4 | **Contact** WhatsApp is **hardcoded**; home enquiry uses **`/api/settings`** → inconsistent number or expectations. |
| H5 | On **/services** or **/contact**, **no enquiry bar** despite persisted store → loss of continuity. |
| H6 | **Empty rooms** copy suggests enquiry after dates only; **SelectionBar** still needs room or entire villa → dead end or **₹0** villa total if no rooms. |
| H7 | **Disabled Select** without strong explanation → confusion. |
| H8 | **Room images** use empty `alt` → weak screen-reader experience. |

## Prioritized recommendations (implement after testing)

Priority reflects **severity if hypotheses confirm** plus **engineering cost**.

### P0 — Blockers / trust

1. **Align primary CTAs with the first required step (H1)**  
   - Point **Hero** and **Reserve** to `#book` (dates), or use a two-step anchor (e.g. `#book` with visible “Next: choose room” scroll to `#rooms`).  
   - Files: [`components/Hero.tsx`](../../components/Hero.tsx), [`components/HotelAmodhHeader.tsx`](../../components/HotelAmodhHeader.tsx).

2. **Single source of truth for WhatsApp on Contact (H4)**  
   - Load `whatsapp_number` from the same public settings API or shared constant used by [`SelectionBar`](../../components/amod/SelectionBar.tsx) / [`lib/whatsapp.ts`](../../lib/whatsapp.ts).  
   - File: [`app/contact/page.tsx`](../../app/contact/page.tsx).

3. **Fix empty-inventory messaging vs SelectionBar rules (H6)**  
   - Either allow enquiry with dates-only when `rooms.length === 0`, or change copy in [`AmodRoomsSection`](../../components/amod/AmodRoomsSection.tsx) and disable/hide misleading **Entire Villa** when total is 0.

### P1 — Major friction

4. **Post-dates progression (H2)**  
   - After valid range, show an inline success + **“Choose your room”** button scrolling to `#rooms`, or move dates adjacent to rooms.

5. **Cross-page continuity (H5)**  
   - Lightweight **persistent strip** on marketing routes (services/contact) when store has dates+selection, linking back to `/#book` or `/#rooms`, or re-wrap those layouts with a read-only summary component.

6. **Meal section clarity (H3)**  
   - Short line under **Meals**: “Shown in your enquiry summary after you pick a room or the villa.” Or reorder: rooms → meals.

### P2 — Polish / accessibility

7. **Disabled room controls (H7)**  
   - `aria-describedby` linking to “Select dates above” text; or tooltip on disabled **Select**.

8. **Room card images (H8)**  
   - Meaningful `alt` from `room.name` or “Photo of {name}”.

## Metrics to aggregate after sessions

- Task **completion rate** and **time** (dates → room selected → WhatsApp click).  
- Count of **unprompted scroll-up** from `#rooms` to dates (proxy for H1).  
- **SUS** or 1–5 clarity scores from session guide.

## Environment reference

- Seed SQL: [`supabase/usability-test-seed.sql`](../../supabase/usability-test-seed.sql)  
- Preview route: `/preview-amod`  
- Recruit + script: [`recruit-brief.md`](./recruit-brief.md), [`session-guide.md`](./session-guide.md)

## Pilot evidence (2026-04-02, pre-participant)

- **Build / routes:** `npm run build` succeeded; `/`, `/preview-amod`, `/services`, `/contact` respond **200** on local dev.
- **H4 / H5:** Settings API returns live `whatsapp_number` (differs from hardcoded Contact page — hypothesis remains for user perception testing).
- **Overlap scenario:** Apply [`usability-test-seed.sql`](../../supabase/usability-test-seed.sql) in Supabase (SQL Editor or **Supabase MCP `execute_sql`**) before Task 2; seed blocks **Garden Suite** for **2026-05-10 … 2026-05-22**.

_Add participant quotes and failure counts after moderated sessions._
