"use client";

import { useMemo } from "react";
import { formatInr } from "@/lib/formatInr";
import type { PublicHotelSettings, Room } from "@/types/hotel";
import { useBookingStore } from "@/store/useBookingStore";

function mealNightlyAddonPp(settings: PublicHotelSettings, toggles: {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}): number {
  if (!settings.meals_enabled) return 0;
  let sum = 0;
  if (toggles.breakfast && settings.meal_breakfast_pp_night != null) {
    sum += Number(settings.meal_breakfast_pp_night);
  }
  if (toggles.lunch && settings.meal_lunch_pp_night != null) {
    sum += Number(settings.meal_lunch_pp_night);
  }
  if (toggles.dinner && settings.meal_dinner_pp_night != null) {
    sum += Number(settings.meal_dinner_pp_night);
  }
  return sum;
}

export function useSelection(
  rooms: Room[],
  hotelSettings: PublicHotelSettings
) {
  const selectedRooms = useBookingStore((s) => s.selectedRooms);
  const isEntireProperty = useBookingStore((s) => s.isEntireProperty);
  const guestCount = useBookingStore((s) => s.guestCount);
  const mealToggles = useBookingStore((s) => s.mealToggles);

  const roomById = useMemo(() => {
    const m = new Map<string, Room>();
    for (const r of rooms) m.set(r.id, r);
    return m;
  }, [rooms]);

  const roomOnlyTotal = useMemo(() => {
    if (isEntireProperty) {
      return rooms.reduce((sum, r) => sum + Number(r.price_per_night), 0);
    }
    return selectedRooms.reduce((sum, r) => {
      const p =
        r.price_per_night ??
        Number(roomById.get(r.id)?.price_per_night ?? 0);
      return sum + p;
    }, 0);
  }, [isEntireProperty, rooms, selectedRooms, roomById]);

  const mealAddonPerGuestNight = useMemo(
    () => mealNightlyAddonPp(hotelSettings, mealToggles),
    [hotelSettings, mealToggles]
  );

  const mealNightlyAddon = useMemo(
    () => guestCount * mealAddonPerGuestNight,
    [guestCount, mealAddonPerGuestNight]
  );

  const estimatedTotalNightly = useMemo(
    () => roomOnlyTotal + mealNightlyAddon,
    [roomOnlyTotal, mealNightlyAddon]
  );

  const anyMealSelected = useMemo(
    () =>
      mealToggles.breakfast || mealToggles.lunch || mealToggles.dinner,
    [mealToggles]
  );

  const selectionLinesForWhatsapp = useMemo(() => {
    if (isEntireProperty) {
      return [
        `Entire Villa (room-only est. ${formatInr(roomOnlyTotal)} / night)`,
      ];
    }
    return selectedRooms.map((r) => {
      const p =
        r.price_per_night ??
        Number(roomById.get(r.id)?.price_per_night ?? 0);
      return `${r.name} (${formatInr(p)} / night room-only)`;
    });
  }, [isEntireProperty, roomOnlyTotal, selectedRooms, roomById]);

  const selectedMealLabels = useMemo(() => {
    const labels: string[] = [];
    if (mealToggles.breakfast) labels.push("Breakfast");
    if (mealToggles.lunch) labels.push("Lunch");
    if (mealToggles.dinner) labels.push("Dinner");
    return labels;
  }, [mealToggles]);

  return {
    selectedRooms,
    isEntireProperty,
    roomOnlyTotal,
    mealNightlyAddon,
    estimatedTotalNightly,
    anyMealSelected,
    selectionLinesForWhatsapp,
    selectedMealLabels,
    mealAddonPerGuestNight,
  };
}
