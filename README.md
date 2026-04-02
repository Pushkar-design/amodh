# Amodh hotel site

Next.js app with a public marketing site and a single-page **`/admin`** dashboard (rooms, bookings, WhatsApp settings). Data lives in [Supabase](https://supabase.com/) (Postgres + Auth).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy anon key (browser + server cookie client) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Newer publishable key (use this **or** anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (API routes only; never expose to the client) |
| `ADMIN_ALLOWED_EMAILS` | Optional comma-separated emails allowed to use admin after sign-in |

**Admin access:** An email is allowed if it appears in `ADMIN_ALLOWED_EMAILS` **or** in the `admin_emails` table (lowercase). In **development**, if `ADMIN_ALLOWED_EMAILS` is unset, any signed-in user can open admin. In **production**, if `ADMIN_ALLOWED_EMAILS` is unset, only rows in `admin_emails` grant access.

## Supabase Auth: password reset

1. In the Supabase dashboard: **Authentication → URL configuration**, add your site URLs to **Redirect URLs**, including:
   - `http://localhost:3000/auth/callback` (local)
   - `https://<your-production-domain>/auth/callback`
2. The admin login screen uses **Forgot password?** with `redirectTo` set to `{origin}/auth/callback?next=/admin`.
3. Ensure the **Reset password** email template is enabled.

## Database

**Fastest (new project):** run everything in one go.

1. **Supabase Dashboard → SQL Editor → New query**, paste [`supabase/complete-setup.sql`](supabase/complete-setup.sql), then **Run**.  
   This creates `rooms`, `bookings`, `hotel_settings`, `admin_emails`, seeds three rooms, sets RLS, and adds `rooms.description`.

2. **Or from your machine:** add `DATABASE_URL` to `.env.local` (Supabase → **Project Settings → Database → Connection string → URI**, with your DB password), then:

   ```bash
   npm run db:apply
   ```

Incremental / older setups can still use [`supabase/schema.sql`](supabase/schema.sql) plus [`supabase/migrations/`](supabase/migrations/) or [`supabase/one-shot-guest-admin.sql`](supabase/one-shot-guest-admin.sql) as before.

Invite staff in **Authentication → Users**, then either add their email to `ADMIN_ALLOWED_EMAILS` or insert into `admin_emails`:

```sql
INSERT INTO admin_emails (email) VALUES ('name@example.com')
ON CONFLICT (email) DO NOTHING;
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

## Usability testing

Materials for moderated studies (recruit brief, moderator script, observation log, synthesis template) live in [`docs/usability-testing/`](docs/usability-testing/).

1. Bootstrap the DB ([`supabase/complete-setup.sql`](supabase/complete-setup.sql) or existing migrations).
2. In **Supabase → SQL Editor**, run [`supabase/usability-test-seed.sql`](supabase/usability-test-seed.sql) to enable meals + WhatsApp settings and add a **seed booking** that blocks one room for mid–May 2026 (use suggested dates in the script comments).
3. Share **`/preview-amod`** if you need correct in-page anchors on a non-root deploy path. See [`.env.example`](.env.example) notes under “Usability / moderated testing”.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
