# Usability testing — moderator script & observation log

Use with the **recruit brief** and post-study **synthesis** doc in this folder.

## Pre-session (2 min)

- Confirm recording consent.
- “Please share your screen. Open the link I sent; maximize the window.”
- “As you go, say what you’re thinking and what you expect to happen.”

## Warm-up (2 min)

- “In one sentence, how do you usually book a small hotel or guesthouse?”

## Tasks (verbatim prompts)

Time each task from **prompt** to **participant says they’re done** or **5 min cap** (then prompt: “What would you do next?”).

| # | Prompt |
|---|--------|
| 1 — Discovery | “You want to stay here next month for two guests. Find how to check availability and start a booking.” |
| 2 — Dates-first | “Choose check-in and check-out, then add a room and send your request the way the site suggests.” |
| 3 — Villa | “Book the entire property instead of individual rooms.” |
| 4 — Navigation | “From the home page, open Experiences, then go back and continue your booking.” |
| 5 — Contact | “Imagine you prefer WhatsApp from the Contact page—find it and compare that to booking from the home page.” |
| 6 — Edge (optional) | If inventory is empty: “What would you do next?” Otherwise skip or run on a stripped DB clone. |

## Post-task questions (5 min)

1. “On a scale of 1–5, how clear was **what to do next** after choosing dates?”
2. “On a scale of 1–5, how clear was **pricing**?”
3. “Anything confusing or missing?”

## Observation log (copy per participant)

| Field | Notes |
|-------|--------|
| Participant ID | P___ |
| Date | |
| Device | desktop / mobile / tablet |
| Browser | |
| Task 1 | pass / partial / fail — time: ___ — notes |
| Task 2 | pass / partial / fail — time: ___ — notes |
| Task 3 | pass / partial / fail — time: ___ — notes |
| Task 4 | pass / partial / fail — time: ___ — notes |
| Task 5 | pass / partial / fail — time: ___ — notes |
| Task 6 | pass / partial / fail — time: ___ — notes |
| Quotes | |
| Severity tags | blocker / major / minor |

**Suggested test dates (with default seed):** check-in **2026-05-14**, check-out **2026-05-19** — one room should show **Unavailable for these dates**; pick **Terrace Room** or **Penthouse** to complete Task 2.

---

## Appendix A — Pilot / heuristic run (internal)

Use when live participants are not yet scheduled: one moderator walks the site using the same tasks and fills one log row. Document environment (URL, seed applied or not).

---

## Appendix B — Pilot / smoke log (internal, 2026-04-02)

_Agent run: `npm run build` (pass); HTTP smoke on `localhost:3000` (dev already running)._

| Task | Result | Time | Notes |
|------|--------|------|-------|
| 1 Discovery | Pass (smoke) | — | Home and `/preview-amod` return **200**; primary flow sections present in app source (`#book`, `#rooms`, `SelectionBar`). |
| 2 Dates-first | Pass (after MCP seed) | — | [`usability-test-seed.sql`](../../supabase/usability-test-seed.sql) applied via **Supabase MCP** (`execute_sql`): **Garden Suite** has seed booking **2026-05-10 → 2026-05-22**. Use check-in **2026-05-14**, check-out **2026-05-19** to see that room **unavailable**; other rooms should stay available. |
| 3 Villa | Not executed | — | Code path: `VillaCard` + `setEntireProperty` in `AmodRoomsSection`. |
| 4 Navigation | Pass (smoke) | — | `/services` and `/contact` return **200**; no `SelectionBar` on those routes (expected gap H5). |
| 5 Contact | Pass (smoke) | — | Contact page loads; WhatsApp link remains hardcoded vs `/api/settings` (gap H4). |

**Follow-up for live sessions:** Re-run smoke after seed; optionally capture screen recording while moderator completes Tasks 1–5 once.
