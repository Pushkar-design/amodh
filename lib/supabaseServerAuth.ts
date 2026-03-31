import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { isEmailAdminAllowed } from "@/lib/adminAllowlist";
import { createClient } from "@/utils/supabase/server";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

export { isEmailAdminAllowed } from "@/lib/adminAllowlist";

/**
 * Returns the current Supabase user if they are allowed to use the admin API.
 * Access if email is in ADMIN_ALLOWED_EMAILS or in the admin_emails table
 * (Supabase SQL). In development, if ADMIN_ALLOWED_EMAILS is unset, any
 * signed-in user may access admin. In production with unset env, only admin_emails
 * rows grant access.
 */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user?.email) return null;
  if (!(await isEmailAdminAllowed(user.email))) return null;
  return user;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const user = await getAdminUser();
  return user !== null;
}
