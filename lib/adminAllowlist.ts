import { createServiceClient } from "@/lib/supabaseServer";

async function isInAdminEmailsTable(emailLower: string): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("admin_emails")
      .select("email")
      .eq("email", emailLower)
      .maybeSingle();
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}

/**
 * Whether an email may use admin APIs and /admin (same rules as getAdminUser).
 * Allowed if listed in ADMIN_ALLOWED_EMAILS (comma-separated) OR present in
 * public.admin_emails (managed in Supabase). In development, if ADMIN_ALLOWED_EMAILS
 * is unset, any signed-in user is allowed. In production, if ADMIN_ALLOWED_EMAILS is
 * unset, only admin_emails rows grant access.
 */
export async function isEmailAdminAllowed(email: string): Promise<boolean> {
  const lower = email.trim().toLowerCase();
  const raw = process.env.ADMIN_ALLOWED_EMAILS?.trim();
  if (raw) {
    const allowed = raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.includes(lower)) return true;
  }
  if (await isInAdminEmailsTable(lower)) return true;
  if (process.env.NODE_ENV !== "production" && !raw) return true;
  return false;
}
