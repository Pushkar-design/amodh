"use client";

import { useBookingStore } from "@/store/useBookingStore";

export function DateSelection() {
  const checkInDate = useBookingStore((s) => s.checkInDate);
  const checkOutDate = useBookingStore((s) => s.checkOutDate);
  const setCheckInDate = useBookingStore((s) => s.setCheckInDate);
  const setCheckOutDate = useBookingStore((s) => s.setCheckOutDate);

  const invalidRange =
    checkInDate && checkOutDate && checkOutDate <= checkInDate;

  return (
    <section
      id="book"
      className="scroll-mt-28 border-t border-outline-variant/40 bg-surface-container-low px-6 py-14 sm:px-10"
    >
      <div className="mx-auto max-w-3xl">
        <span className="mb-2 block font-label text-xs uppercase tracking-[0.3em] text-primary">
          Your stay
        </span>
        <h2 className="font-serif-display text-3xl text-on-surface sm:text-4xl">
          Select dates
        </h2>
        <p className="mt-2 font-body text-on-surface-variant">
          Select dates to see room availability. We confirm everything over
          WhatsApp.
        </p>
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-2">
            <span className="font-label text-sm font-medium text-on-surface">
              Check-in
            </span>
            <input
              type="date"
              value={checkInDate ?? ""}
              onChange={(e) => setCheckInDate(e.target.value || null)}
              className="min-h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 font-body text-on-surface shadow-sm transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="flex flex-1 flex-col gap-2">
            <span className="font-label text-sm font-medium text-on-surface">
              Check-out
            </span>
            <input
              type="date"
              value={checkOutDate ?? ""}
              onChange={(e) => setCheckOutDate(e.target.value || null)}
              className="min-h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 font-body text-on-surface shadow-sm transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
        </div>
        {invalidRange && (
          <p className="mt-4 font-body text-sm text-error" role="alert">
            Check-out must be after check-in.
          </p>
        )}
      </div>
    </section>
  );
}
