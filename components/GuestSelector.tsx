"use client";

import { useBookingStore } from "@/store/useBookingStore";

export function GuestSelector() {
  const guestCount = useBookingStore((s) => s.guestCount);
  const setGuestCount = useBookingStore((s) => s.setGuestCount);

  return (
    <section className="border-t border-outline-variant/40 bg-surface px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-headline text-2xl text-on-surface sm:text-3xl">
          Guests
        </h2>
        <p className="mt-2 font-body text-sm text-on-surface-variant">
          How many guests will be staying?
        </p>
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            aria-label="Decrease guests"
            disabled={guestCount <= 1}
            onClick={() => setGuestCount(guestCount - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest font-body text-xl text-on-surface transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[3ch] text-center font-headline text-3xl text-on-surface">
            {guestCount}
          </span>
          <button
            type="button"
            aria-label="Increase guests"
            disabled={guestCount >= 20}
            onClick={() => setGuestCount(guestCount + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest font-body text-xl text-on-surface transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}
