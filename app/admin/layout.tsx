import type { Metadata } from "next";
import {
  createSupabaseServerClient,
  getAdminUser,
} from "@/lib/supabaseServerAuth";
import { HotelAmodhHeader } from "@/components/HotelAmodhHeader";
import { AdminAccessDeniedPanel } from "@/components/AdminAccessDeniedPanel";
import {
  getSupabaseAnonOrPublishableKey,
  getSupabaseUrl,
} from "@/lib/supabasePublicEnv";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Amodh",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!getSupabaseUrl() || !getSupabaseAnonOrPublishableKey()) {
    return (
      <>
        <HotelAmodhHeader />
        <main className="mx-auto max-w-lg flex-1 px-4 pt-28 pb-16">
          <h1 className="font-serif text-2xl text-[#36454F]">
            Admin is not configured
          </h1>
          <p className="mt-3 text-sm text-[#36454F]/75">
            Set{" "}
            <code className="rounded bg-[#36454F]/10 px-1">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and either{" "}
            <code className="rounded bg-[#36454F]/10 px-1">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            or{" "}
            <code className="rounded bg-[#36454F]/10 px-1">
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
            </code>{" "}
            in your deployment environment (e.g. Vercel Project Settings →
            Environment Variables), then redeploy.
          </p>
        </main>
      </>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return (
        <>
          <HotelAmodhHeader />
          <AdminAccessDeniedPanel email={user.email} />
        </>
      );
    }
  }

  return children;
}
