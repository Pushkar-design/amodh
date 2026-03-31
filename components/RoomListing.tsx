"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Booking, Room } from "@/types/hotel";
import { isDateOverlap } from "@/utils/dateOverlap";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useBookingStore } from "@/store/useBookingStore";
import {
  isGoogleDriveImageHost,
  resolveDisplayImageUrl,
} from "@/lib/imageUrl";

function formatMoney(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function RoomListing() {
  const checkInDate = useBookingStore((s) => s.checkInDate);
  const checkOutDate = useBookingStore((s) => s.checkOutDate);
  const selectedRooms = useBookingStore((s) => s.selectedRooms);
  const isEntireProperty = useBookingStore((s) => s.isEntireProperty);
  const toggleRoom = useBookingStore((s) => s.toggleRoom);

  const debouncedIn = useDebouncedValue(checkInDate, 450);
  const debouncedOut = useDebouncedValue(checkOutDate, 450);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const datesReady =
    debouncedIn && debouncedOut && debouncedOut > debouncedIn;

  const fetchRooms = useCallback(async () => {
    setLoadingRooms(true);
    setRoomsError(null);
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load rooms");
      setRooms(data.rooms ?? []);
    } catch (e) {
      setRoomsError(e instanceof Error ? e.message : "Something went wrong");
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!datesReady || !debouncedIn || !debouncedOut) {
      setBookings([]);
      return;
    }
    setLoadingBookings(true);
    setBookingsError(null);
    try {
      const q = new URLSearchParams({
        checkIn: debouncedIn,
        checkOut: debouncedOut,
      });
      const res = await fetch(`/api/bookings?${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load bookings");
      setBookings(data.bookings ?? []);
    } catch (e) {
      setBookingsError(
        e instanceof Error ? e.message : "Something went wrong"
      );
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [datesReady, debouncedIn, debouncedOut]);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const unavailableByRoom = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!datesReady || !debouncedIn || !debouncedOut) return map;
    for (const b of bookings) {
      if (
        isDateOverlap(b.start_date, b.end_date, debouncedIn, debouncedOut)
      ) {
        map.set(b.room_id, true);
      }
    }
    return map;
  }, [bookings, datesReady, debouncedIn, debouncedOut]);

  const datesSelected = Boolean(checkInDate && checkOutDate);
  const canPickRooms = datesSelected && checkOutDate! > checkInDate!;

  const noRoomsListed = !loadingRooms && rooms.length === 0 && !roomsError;

  return (
    <section
      id="rooms"
      className="scroll-mt-28 border-t border-outline-variant/40 bg-surface px-6 py-14 sm:px-10 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 text-center sm:mb-20">
          <p className="mb-4 font-label text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            The Curated Sanctuary
          </p>
          <h2 className="mb-6 font-headline text-4xl tracking-tight text-on-surface sm:text-6xl md:text-7xl">
            Accommodations
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
            Select from our collection of bespoke suites. Each space is
            designed with intentionality, blending earthen textures with modern
            luxury.
          </p>
        </header>

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {roomsError && (
            <button
              type="button"
              onClick={() => void fetchRooms()}
              className="self-start rounded-md border border-primary px-4 py-2 font-label text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Retry rooms
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
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg bg-secondary-fixed p-4 font-body text-on-secondary-fixed">
            <span>Could not refresh availability.</span>
            <button
              type="button"
              onClick={() => void fetchBookings()}
              className="min-h-10 rounded-md bg-primary px-4 py-2 font-label text-sm text-on-primary"
            >
              Retry
            </button>
          </div>
        )}

        {loadingRooms && (
          <p className="mb-8 font-body text-on-surface-variant">
            Loading rooms…
          </p>
        )}

        {noRoomsListed && (
          <p className="mb-8 font-body text-on-surface-variant">
            No rooms are configured yet. You can still send an enquiry on
            WhatsApp once you have selected dates and an option below.
          </p>
        )}

        <ul className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const booked = unavailableByRoom.get(room.id) ?? false;
            const inactive = !room.is_available;
            const unavailable = inactive || booked;
            const checked = selectedRooms.some((r) => r.id === room.id);
            const disabled = !canPickRooms || isEntireProperty || unavailable;

            const imageSrc = resolveDisplayImageUrl(room.image_url);
            return (
              <li key={room.id} className="group relative">
                <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-lg bg-surface-container-high">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      unoptimized={isGoogleDriveImageHost(imageSrc)}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full min-h-[280px] items-center justify-center bg-surface-container-highest font-body text-on-surface-variant">
                      No image
                    </div>
                  )}
                  <label
                    className={`absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-white ${
                      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() =>
                        toggleRoom({ id: room.id, name: room.name })
                      }
                      className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                  </label>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-headline text-2xl text-on-surface">
                      {room.name}
                    </h3>
                    <p className="mt-1 font-label text-sm text-on-surface-variant">
                      {inactive
                        ? "Currently unavailable"
                        : booked
                          ? "Unavailable for these dates"
                          : "Available"}
                    </p>
                  </div>
                  <span className="shrink-0 font-headline text-xl text-primary">
                    {formatMoney(Number(room.price_per_night))}
                  </span>
                </div>
                {room.description ? (
                  <p className="mt-4 line-clamp-3 font-body text-sm leading-relaxed text-on-surface-variant">
                    {room.description}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2 font-body text-xs text-on-surface-variant">
                  {loadingBookings && datesReady && (
                    <span className="rounded-full bg-secondary-fixed px-3 py-1 font-label text-[10px] uppercase tracking-widest text-on-secondary-fixed-variant">
                      Checking availability…
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {!canPickRooms && datesSelected && (
          <p className="mt-8 font-body text-sm text-error" role="alert">
            Fix your dates before selecting rooms.
          </p>
        )}
        {!datesSelected && (
          <p className="mt-8 font-body text-sm text-on-surface-variant">
            Select check-in and check-out to enable room selection.
          </p>
        )}
      </div>
    </section>
  );
}
