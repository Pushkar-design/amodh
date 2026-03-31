import type { Metadata } from "next";
import {
  createSupabaseServerClient,
  getAdminUser,
} from "@/lib/supabaseServerAuth";
import { HotelAmodhHeader } from "@/components/HotelAmodhHeader";
import { AdminAccessDeniedPanel } from "@/components/AdminAccessDeniedPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Amodh",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
