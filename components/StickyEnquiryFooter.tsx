"use client";

import { useEffect, useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import {
  buildEnquiryMessage,
  normalizeWhatsAppNumber,
  whatsappEnquiryUrl,
} from "@/lib/whatsapp";

function formatDisplayDate(iso: string) {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function StickyEnquiryFooter() {
  const checkInDate = useBookingStore((s) => s.checkInDate);
  const checkOutDate = useBookingStore((s) => s.checkOutDate);
  const selectedRooms = useBookingStore((s) => s.selectedRooms);
  const isEntireProperty = useBookingStore((s) => s.isEntireProperty);
  const guestCount = useBookingStore((s) => s.guestCount);

  const [whatsapp, setWhatsapp] = useState("");
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (!cancelled) {
          if (!res.ok) throw new Error(data.error || "Failed");
          setWhatsapp(data.whatsapp_number ?? "");
          setSettingsError(null);
        }
      } catch {
        if (!cancelled) {
          setSettingsError("Could not load WhatsApp number");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const datesOk =
    checkInDate && checkOutDate && checkOutDate > checkInDate;

  const selectionOk = isEntireProperty || selectedRooms.length > 0;

  const visible = Boolean(datesOk && selectionOk);

  if (!visible) return null;

  const message = buildEnquiryMessage({
    checkIn: formatDisplayDate(checkInDate!),
    checkOut: formatDisplayDate(checkOutDate!),
    guestCount,
    isEntireProperty,
    roomNames: selectedRooms.map((r) => r.name),
  });

  const numberOk = normalizeWhatsAppNumber(whatsapp).length >= 8;
  const href = numberOk
    ? whatsappEnquiryUrl(whatsapp, message)
    : undefined;

  const summaryLine = isEntireProperty
    ? "Entire property"
    : selectedRooms.map((r) => r.name).join(" · ");

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center bg-primary-container shadow-[0_-10px_40px_rgba(27,29,14,0.06)] dark:bg-primary">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 sm:px-10">
        <div className="min-w-0 flex-1 flex-col text-white">
          <div className="flex flex-wrap items-center gap-2 font-body font-bold text-white">
            <span className="material-symbols-outlined shrink-0 text-lg" aria-hidden>
              bed
            </span>
            <span className="font-sans text-[10px] uppercase tracking-widest">
              Selected
            </span>
            {!isEntireProperty && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 font-sans text-[10px]">
                {selectedRooms.length}
              </span>
            )}
          </div>
          <p className="mt-1 truncate font-body text-[10px] text-stone-100">
            {summaryLine} · {formatDisplayDate(checkInDate!)} –{" "}
            {formatDisplayDate(checkOutDate!)} · {guestCount} guest
            {guestCount !== 1 ? "s" : ""}
          </p>
          {settingsError && (
            <p className="mt-1 text-[10px] text-amber-200">{settingsError}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center gap-2 rounded bg-[#56642b] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-white transition-transform hover:brightness-110 active:scale-[0.98] dark:bg-[#404c1e]"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden>
                chat
              </span>
              Book via WhatsApp
            </a>
          ) : (
            <span className="flex cursor-not-allowed flex-row items-center gap-2 rounded bg-on-surface/30 px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-white/70">
              <span className="material-symbols-outlined text-lg" aria-hidden>
                chat
              </span>
              Book via WhatsApp
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
