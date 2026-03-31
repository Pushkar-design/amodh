/**
 * Browser/server public Supabase config. Supports legacy anon key or newer
 * publishable key (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY).
 */
export function getSupabaseUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return u || undefined;
}

export function getSupabaseAnonOrPublishableKey(): string | undefined {
  const a = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const p = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim();
  return a || p || undefined;
}
