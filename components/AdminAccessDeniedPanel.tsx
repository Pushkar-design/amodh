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
        this account is not allowed to use the dashboard. Fix it in one of
        these ways:
      </p>
      <ul className="mt-3 list-inside list-disc text-sm text-[#36454F]/75">
        <li className="mt-1">
          Add this exact email to{" "}
          <code className="rounded bg-[#36454F]/10 px-1">
            ADMIN_ALLOWED_EMAILS
          </code>{" "}
          in your host (e.g. Vercel env vars, comma-separated), then redeploy.
        </li>
        <li className="mt-1">
          Or insert it in Supabase (SQL editor), using your real address:{" "}
          <code className="mt-1 block break-all rounded bg-[#36454F]/10 px-2 py-1 text-xs">
            {`INSERT INTO admin_emails (email) VALUES ('${(email ?? "you@example.com").replace(/'/g, "''")}') ON CONFLICT (email) DO NOTHING;`}
          </code>
        </li>
        <li className="mt-1">
          For the table check to work,{" "}
          <code className="rounded bg-[#36454F]/10 px-1">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          must be set on the server (never expose it to the browser).
        </li>
      </ul>
      <AdminSignOutButton />
      <Link href="/" className="mt-6 block text-center text-[#8A9A5B]">
        ← Home
      </Link>
    </main>
  );
}
