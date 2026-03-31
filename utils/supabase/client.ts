import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabaseAnonOrPublishableKey,
  getSupabaseUrl,
} from "@/lib/supabasePublicEnv";

export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonOrPublishableKey();
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a public key (NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)"
    );
  }
  return createBrowserClient(url, key);
}
