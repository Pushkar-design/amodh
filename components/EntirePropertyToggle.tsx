"use client";

import { useBookingStore } from "@/store/useBookingStore";

export function EntirePropertyToggle() {
  const isEntireProperty = useBookingStore((s) => s.isEntireProperty);
  const setEntireProperty = useBookingStore((s) => s.setEntireProperty);

  return (
    <section className="border-t border-outline-variant/40 bg-surface px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-surface-container-low p-8 md:flex-row">
          <div>
            <h2 className="font-headline text-2xl text-on-surface">
              Experience the Entire Estate
            </h2>
            <p className="mt-1 font-body text-sm text-on-surface-variant">
              Book all rooms for exclusive access to the property and staff.
              When on, individual room selection is cleared.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isEntireProperty}
            onClick={() => setEntireProperty(!isEntireProperty)}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border border-outline-variant/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isEntireProperty ? "bg-primary" : "bg-surface-container-highest"
            }`}
          >
            <span
              className={`pointer-events-none absolute top-0.5 left-[4px] inline-block h-6 w-6 rounded-full border border-stone-300 bg-white shadow transition-transform ${
                isEntireProperty ? "translate-x-7" : "translate-x-0"
              }`}
              aria-hidden
            />
            <span className="sr-only">
              {isEntireProperty ? "Entire property on" : "Entire property off"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
