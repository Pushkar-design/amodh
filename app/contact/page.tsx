"use client";

import { useEffect } from "react";
import { HotelAmodhHeader } from "@/components/HotelAmodhHeader";

/**
 * /contact is deprecated: all details live on the home page (#contact).
 * Preserve the route for bookmarks and external links.
 */
export default function ContactPage() {
  useEffect(() => {
    window.location.replace("/#contact");
  }, []);

  return (
    <>
      <HotelAmodhHeader />
      <main className="flex min-h-[50vh] flex-1 items-center justify-center bg-[#faf7f2] px-6 pt-28">
        <p className="font-body text-sm text-muted-foreground">
          Taking you to contact…
        </p>
      </main>
    </>
  );
}
