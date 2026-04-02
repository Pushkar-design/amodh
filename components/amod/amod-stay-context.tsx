"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useRooms } from "@/hooks/amod/useRooms";
import type { Booking, PublicHotelSettings, Room } from "@/types/hotel";
import { isDateOverlap } from "@/utils/dateOverlap";
import { useBookingStore } from "@/store/useBookingStore";

const DEFAULT_HOTEL_SETTINGS: PublicHotelSettings = {
  whatsapp_number: "",
  contact_phone: "",
  contact_email: "",
  meals_enabled: false,
  meal_breakfast_pp_night: null,
  meal_lunch_pp_night: null,
  meal_dinner_pp_night: null,
};

export type AmodStayContextValue = {
  rooms: Room[];
  loadingRooms: boolean;
  roomsError: string | null;
  refetchRooms: () => void;
  loadingBookings: boolean;
  bookingsError: string | null;
  refetchBookings: () => void;
  unavailableByRoomId: Map<string, boolean>;
  datesReady: boolean;
  canPickRooms: boolean;
  hotelSettings: PublicHotelSettings;
  loadingSettings: boolean;
  settingsError: string | null;
  refetchSettings: () => void;
  /** Show meal toggles: enabled in admin and at least one meal price set */
  mealsUiVisible: boolean;
};

const AmodStayContext = createContext<AmodStayContextValue | null>(null);

function parsePublicSettings(data: Record<string, unknown>): PublicHotelSettings {
  return {
    whatsapp_number:
      typeof data.whatsapp_number === "string" ? data.whatsapp_number : "",
    contact_phone:
      typeof data.contact_phone === "string" ? data.contact_phone : "",
    contact_email:
      typeof data.contact_email === "string" ? data.contact_email : "",
    meals_enabled: Boolean(data.meals_enabled),
    meal_breakfast_pp_night:
      data.meal_breakfast_pp_night != null &&
      Number.isFinite(Number(data.meal_breakfast_pp_night))
        ? Number(data.meal_breakfast_pp_night)
        : null,
    meal_lunch_pp_night:
      data.meal_lunch_pp_night != null &&
      Number.isFinite(Number(data.meal_lunch_pp_night))
        ? Number(data.meal_lunch_pp_night)
        : null,
    meal_dinner_pp_night:
      data.meal_dinner_pp_night != null &&
      Number.isFinite(Number(data.meal_dinner_pp_night))
        ? Number(data.meal_dinner_pp_night)
        : null,
  };
}

export function AmodStayProvider({ children }: { children: ReactNode }) {
  const checkInDate = useBookingStore((s) => s.checkInDate);
  const checkOutDate = useBookingStore((s) => s.checkOutDate);
  const debouncedIn = useDebouncedValue(checkInDate, 450);
  const debouncedOut = useDebouncedValue(checkOutDate, 450);

  const {
    rooms,
    loading: loadingRooms,
    error: roomsError,
    refetch: refetchRooms,
  } = useRooms();

  const [hotelSettings, setHotelSettings] = useState<PublicHotelSettings>(
    DEFAULT_HOTEL_SETTINGS
  );
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true);
    setSettingsError(null);
    try {
      const res = await fetch("/api/settings");
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) throw new Error(String(data.error || "Failed to load settings"));
      setHotelSettings(parsePublicSettings(data));
    } catch (e) {
      setSettingsError(
        e instanceof Error ? e.message : "Could not load settings"
      );
      setHotelSettings(DEFAULT_HOTEL_SETTINGS);
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const mealsUiVisible = useMemo(() => {
    if (!hotelSettings.meals_enabled) return false;
    return (
      hotelSettings.meal_breakfast_pp_night != null ||
      hotelSettings.meal_lunch_pp_night != null ||
      hotelSettings.meal_dinner_pp_night != null
    );
  }, [hotelSettings]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const datesReady = Boolean(
    debouncedIn && debouncedOut && debouncedOut > debouncedIn
  );

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
    void fetchBookings();
  }, [fetchBookings]);

  const unavailableByRoomId = useMemo(() => {
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
  const canPickRooms = Boolean(
    datesSelected && checkOutDate && checkInDate && checkOutDate > checkInDate
  );

  const value = useMemo<AmodStayContextValue>(
    () => ({
      rooms,
      loadingRooms,
      roomsError: roomsError ?? null,
      refetchRooms,
      loadingBookings,
      bookingsError,
      refetchBookings: fetchBookings,
      unavailableByRoomId,
      datesReady,
      canPickRooms,
      hotelSettings,
      loadingSettings,
      settingsError,
      refetchSettings: fetchSettings,
      mealsUiVisible,
    }),
    [
      rooms,
      loadingRooms,
      roomsError,
      refetchRooms,
      loadingBookings,
      bookingsError,
      fetchBookings,
      unavailableByRoomId,
      datesReady,
      canPickRooms,
      hotelSettings,
      loadingSettings,
      settingsError,
      fetchSettings,
      mealsUiVisible,
    ]
  );

  return (
    <AmodStayContext.Provider value={value}>
      {children}
    </AmodStayContext.Provider>
  );
}

export function useAmodStay(): AmodStayContextValue {
  const ctx = useContext(AmodStayContext);
  if (!ctx) {
    throw new Error("useAmodStay must be used within AmodStayProvider");
  }
  return ctx;
}
