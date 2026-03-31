import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SelectedRoom = { id: string; name: string };

type BookingState = {
  checkInDate: string | null;
  checkOutDate: string | null;
  selectedRooms: SelectedRoom[];
  isEntireProperty: boolean;
  guestCount: number;
  setCheckInDate: (v: string | null) => void;
  setCheckOutDate: (v: string | null) => void;
  toggleRoom: (room: SelectedRoom) => void;
  setEntireProperty: (on: boolean) => void;
  setGuestCount: (n: number) => void;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      checkInDate: null,
      checkOutDate: null,
      selectedRooms: [],
      isEntireProperty: false,
      guestCount: 2,

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
          set({ selectedRooms: [...selectedRooms, room] });
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
    }),
    { name: "amodh-booking" }
  )
);
