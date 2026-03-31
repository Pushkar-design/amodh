import { createServerClient } from "@supabase/ssr";
import type { cookies } from "next/headers";
import {
  getSupabaseAnonOrPublishableKey,
  getSupabaseUrl,
} from "@/lib/supabasePublicEnv";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export function createClient(cookieStore: CookieStore) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonOrPublishableKey();
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a public key (NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)"
    );
  }
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          /* Server Component: ignore if cookies are read-only; middleware refreshes session */
        }
      },
    },
  });
}
