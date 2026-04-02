"use client";

import { useBookingStore } from "@/store/useBookingStore";

type DateGuestPickerProps = {
  /** When true, render heading + intro (standalone section). When false, compact block for rooms section. */
  showIntro?: boolean;
};

export function DateGuestPicker({ showIntro = true }: DateGuestPickerProps) {
  const checkInDate = useBookingStore((s) => s.checkInDate);
  const checkOutDate = useBookingStore((s) => s.checkOutDate);
  const guestCount = useBookingStore((s) => s.guestCount);
  const setCheckInDate = useBookingStore((s) => s.setCheckInDate);
  const setCheckOutDate = useBookingStore((s) => s.setCheckOutDate);
  const setGuestCount = useBookingStore((s) => s.setGuestCount);

  const invalidRange =
    checkInDate && checkOutDate && checkOutDate <= checkInDate;

  return (
    <div>
      {showIntro ? (
        <>
          <span className="mb-2 block font-label text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Your stay
          </span>
          <h2 className="font-serif-display text-4xl font-normal text-foreground sm:text-5xl">
            Dates &amp; guests
          </h2>
          <p className="mt-2 max-w-xl font-body text-sm text-muted-foreground">
            Choose dates to see availability. Guest count shapes meal estimates
            when add-ons are on.
          </p>
        </>
      ) : (
        <>
          <h3 className="font-serif-display text-2xl font-normal text-[#252218] sm:text-3xl">
            Dates &amp; guests
          </h3>
          <p className="mt-2 max-w-xl font-body text-sm text-[#5c554a]">
            Set dates and guest count before selecting the villa or rooms.
          </p>
        </>
      )}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-6 sm:flex-row sm:gap-6">
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="font-label text-xs font-medium text-foreground">
              Check-in
            </span>
            <input
              type="date"
              value={checkInDate ?? ""}
              onChange={(e) => setCheckInDate(e.target.value || null)}
              className="min-h-12 w-full rounded-xl border border-border/80 bg-background px-4 font-body text-foreground transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="font-label text-xs font-medium text-foreground">
              Check-out
            </span>
            <input
              type="date"
              value={checkOutDate ?? ""}
              onChange={(e) => setCheckOutDate(e.target.value || null)}
              className="min-h-12 w-full rounded-xl border border-border/80 bg-background px-4 font-body text-foreground transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        <div className="flex shrink-0 flex-col gap-2 lg:w-48">
          <span className="font-label text-xs font-medium text-foreground">
            Guests
          </span>
          <div className="flex h-12 items-center justify-between rounded-xl border border-border/80 bg-background px-2">
            <button
              type="button"
              aria-label="Decrease guests"
              disabled={guestCount <= 1}
              onClick={() => setGuestCount(guestCount - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
            >
              −
            </button>
            <span className="min-w-[2ch] text-center font-body text-lg tabular-nums text-foreground">
              {guestCount}
            </span>
            <button
              type="button"
              aria-label="Increase guests"
              disabled={guestCount >= 20}
              onClick={() => setGuestCount(guestCount + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
            >
              +
            </button>
          </div>
        </div>
      </div>
      {invalidRange && (
        <p className="mt-4 font-body text-sm text-destructive" role="alert">
          Check-out must be after check-in.
        </p>
      )}
    </div>
  );
}
