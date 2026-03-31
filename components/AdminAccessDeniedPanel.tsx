"use client";

import Link from "next/link";
import { AdminSignOutButton } from "@/components/AdminSignOutButton";

type Props = {
  email: string | undefined;
};

export function AdminAccessDeniedPanel({ email }: Props) {
  return (
    <main className="mx-auto max-w-md flex-1 px-4 pt-28 pb-16">
      <h1 className="font-serif text-3xl text-[#36454F]">Access denied</h1>
      <p className="mt-3 text-sm text-[#36454F]/75">
        You are signed in as{" "}
        <span className="font-medium">{email ?? "this account"}</span>, but
        this account is not allowed to use the dashboard. In production, add
        this email to{" "}
        <code className="rounded bg-[#36454F]/10 px-1">ADMIN_ALLOWED_EMAILS</code>{" "}
        in your deployment environment (comma-separated list).
      </p>
      <AdminSignOutButton />
      <Link href="/" className="mt-6 block text-center text-[#8A9A5B]">
        ← Home
      </Link>
    </main>
  );
}
