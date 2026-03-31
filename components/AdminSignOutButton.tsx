"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function AdminSignOutButton({ className, children }: Props) {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void signOut()}
      className={
        className ??
        "mt-8 min-h-11 rounded-full border border-[#36454F]/20 px-6 disabled:opacity-50"
      }
    >
      {busy ? "Signing out…" : (children ?? "Sign out")}
    </button>
  );
}
