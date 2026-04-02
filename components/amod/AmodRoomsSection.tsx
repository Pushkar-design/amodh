"use client";

import { useBookingStore } from "@/store/useBookingStore";
import { useAmodStay } from "@/components/amod/amod-stay-context";
import { useMemo } from "react";
import { DateGuestPicker } from "@/components/DateSelection";
import { RoomCard } from "@/components/amod/RoomCard";
import { VillaCard } from "@/components/amod/VillaCard";

export function AmodRoomsSection() {
  const {
    rooms,
    loadingRooms,
    roomsError,
    refetchRooms,
    loadingBookings,
    bookingsError,
    refetchBookings,
    unavailableByRoomId,
    datesReady,
    canPickRooms,
  } = useAmodStay();

  const checkInDate = useBookingStore((s) => s.checkInDate);
  const checkOutDate = useBookingStore((s) => s.checkOutDate);
  const selectedRooms = useBookingStore((s) => s.selectedRooms);
  const isEntireProperty = useBookingStore((s) => s.isEntireProperty);
  const toggleRoom = useBookingStore((s) => s.toggleRoom);
  const setEntireProperty = useBookingStore((s) => s.setEntireProperty);

  const villaEstimatedTotal = useMemo(
    () => rooms.reduce((s, r) => s + Number(r.price_per_night), 0),
    [rooms]
  );

  const villaMaxOccupancy = useMemo(
    () => rooms.reduce((s, r) => s + (r.max_occupancy ?? 2), 0),
    [rooms]
  );

  const villaExtraBedSummary = useMemo(() => {
    const notes = rooms
      .map((r) => r.extra_bed_note?.trim())
      .filter(Boolean) as string[];
    const uniq = [...new Set(notes)];
    if (uniq.length === 0) return null;
    if (uniq.length <= 2) return uniq.join(" · ");
    return "Extra beds vary by room — see each listing below.";
  }, [rooms]);

  const noRoomsListed = !loadingRooms && rooms.length === 0 && !roomsError;

  const datesSelected = Boolean(checkInDate && checkOutDate);

  return (
    <section
      id="rooms"
      className="scroll-mt-28 bg-gradient-to-b from-[#f5f0e8] via-[#faf8f4] to-surface px-6 py-16 sm:px-10 sm:py-20 sm:pb-28"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center sm:mb-14 md:mb-16">
          <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6b6348] sm:mb-4">
            Choose your space
          </p>
          <h2 className="mb-4 font-serif-display text-[2.75rem] font-normal leading-none tracking-tight text-[#252218] sm:mb-5 sm:text-6xl md:text-7xl">
            Amod
          </h2>
          <p className="mx-auto max-w-xl text-pretty px-1 font-body text-base leading-relaxed text-[#5c554a] sm:px-0 sm:text-lg">
            Select your stay from the spaces below.
          </p>
        </header>

        <div className="mb-12 w-full rounded-2xl border border-[#e3dcd2] bg-[#faf7f2]/90 p-6 shadow-sm sm:p-8">
          <DateGuestPicker showIntro={false} />
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          {roomsError && (
            <button
              type="button"
              onClick={() => void refetchRooms()}
              className="rounded-md border border-primary px-4 py-2 font-label text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Retry rooms
            </button>
          )}
          {bookingsError && (
            <button
              type="button"
              onClick={() => void refetchBookings()}
              className="rounded-md border border-outline-variant px-4 py-2 font-label text-sm text-on-surface"
            >
              Retry availability
            </button>
          )}
        </div>

        {roomsError && (
          <p
            className="mb-6 rounded-lg bg-error-container p-4 font-body text-on-error-container"
            role="alert"
          >
            {roomsError}
          </p>
        )}

        {bookingsError && (
          <p
            className="mb-6 rounded-lg bg-secondary-fixed p-4 font-body text-on-secondary-fixed"
            role="alert"
          >
            {bookingsError}
          </p>
        )}

        {loadingRooms && (
          <p className="mb-8 animate-pulse font-body text-on-surface-variant">
            Loading rooms…
          </p>
        )}

        {noRoomsListed && (
          <p className="mb-8 font-body text-on-surface-variant">
            No rooms are listed yet. You can still send an enquiry once dates
            are set.
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 lg:col-span-3">
            <VillaCard
              estimatedNightlyTotal={villaEstimatedTotal}
              maxOccupancyTotal={villaMaxOccupancy}
              extraBedSummary={villaExtraBedSummary}
              selected={isEntireProperty}
              disabled={
                !canPickRooms ||
                (selectedRooms.length > 0 && !isEntireProperty)
              }
              onToggle={() => setEntireProperty(!isEntireProperty)}
            />
          </div>

          {rooms.map((room, index) => {
            const booked = unavailableByRoomId.get(room.id) ?? false;
            const inactive = !room.is_available;
            const unavailable = inactive || booked;
            const selected = selectedRooms.some((r) => r.id === room.id);
            const disabled =
              !canPickRooms || isEntireProperty || unavailable;

            return (
              <div
                key={room.id}
                className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700"
                style={{ animationDelay: `${80 + index * 60}ms` }}
              >
                <RoomCard
                  room={room}
                  unavailable={unavailable}
                  selected={selected}
                  disabled={disabled}
                  onSelect={() =>
                    toggleRoom({
                      id: room.id,
                      name: room.name,
                      price_per_night: Number(room.price_per_night),
                    })
                  }
                />
                {loadingBookings && datesReady && !unavailable && (
                  <p className="mt-2 text-center font-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    Checking availability…
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!canPickRooms && checkInDate && checkOutDate && (
          <p className="mt-8 font-body text-sm text-error" role="alert">
            Fix your dates before selecting rooms or the villa.
          </p>
        )}
        {!datesSelected && (
          <p className="mt-8 font-body text-sm text-on-surface-variant">
            Select check-in and check-out in this section to enable selection.
          </p>
        )}
      </div>
    </section>
  );
}
