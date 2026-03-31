import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getSupabaseAnonOrPublishableKey,
  getSupabaseUrl,
} from "@/lib/supabasePublicEnv";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (!code) {
    return NextResponse.redirect(`${origin}/admin?error=auth`);
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonOrPublishableKey();
  if (!url || !key) {
    return NextResponse.redirect(`${origin}/admin?error=config`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
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
          /* ignore when cookies are read-only */
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/admin?error=auth`);
  }

  const dest = next.startsWith("/") ? next : "/admin";
  return NextResponse.redirect(`${origin}${dest}`);
}
