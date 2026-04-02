import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SelectedRoom = {
  id: string;
  name: string;
  /** Per-night price when selected; used for estimates and WhatsApp copy */
  price_per_night?: number;
};

export type MealToggles = {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
};

type BookingState = {
  checkInDate: string | null;
  checkOutDate: string | null;
  selectedRooms: SelectedRoom[];
  isEntireProperty: boolean;
  guestCount: number;
  mealToggles: MealToggles;
  setCheckInDate: (v: string | null) => void;
  setCheckOutDate: (v: string | null) => void;
  toggleRoom: (room: SelectedRoom) => void;
  setEntireProperty: (on: boolean) => void;
  setGuestCount: (n: number) => void;
  setMealToggle: (meal: keyof MealToggles, on: boolean) => void;
  clearEnquiry: () => void;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      checkInDate: null,
      checkOutDate: null,
      selectedRooms: [],
      isEntireProperty: false,
      guestCount: 2,
      mealToggles: { breakfast: false, lunch: false, dinner: false },

      setCheckInDate: (v) => set({ checkInDate: v }),
      setCheckOutDate: (v) => set({ checkOutDate: v }),

      toggleRoom: (room) => {
        const { selectedRooms, isEntireProperty } = get();
        if (isEntireProperty) return;
        const exists = selectedRooms.some((r) => r.id === room.id);
        if (exists) {
          set({
            selectedRooms: selectedRooms.filter((r) => r.id !== room.id),
          });
        } else {
          set({
            selectedRooms: [
              ...selectedRooms,
              {
                id: room.id,
                name: room.name,
                price_per_night: room.price_per_night,
              },
            ],
          });
        }
      },

      setEntireProperty: (on) => {
        if (on) {
          set({ isEntireProperty: true, selectedRooms: [] });
        } else {
          set({ isEntireProperty: false });
        }
      },

      setGuestCount: (n) => {
        const clamped = Math.min(20, Math.max(1, Math.round(n)));
        set({ guestCount: clamped });
      },

      setMealToggle: (meal, on) =>
        set((s) => ({
          mealToggles: { ...s.mealToggles, [meal]: on },
        })),

      clearEnquiry: () =>
        set({
          checkInDate: null,
          checkOutDate: null,
          selectedRooms: [],
          isEntireProperty: false,
          guestCount: 2,
          mealToggles: { breakfast: false, lunch: false, dinner: false },
        }),
    }),
    {
      name: "amodh-booking",
      merge: (persisted, current) => {
        const p = persisted as Partial<BookingState> | undefined;
        return {
          ...current,
          ...p,
          mealToggles: {
            breakfast: p?.mealToggles?.breakfast ?? false,
            lunch: p?.mealToggles?.lunch ?? false,
            dinner: p?.mealToggles?.dinner ?? false,
          },
        };
      },
    }
  )
);
