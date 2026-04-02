"use client";

import { useMemo } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { useAmodStay } from "@/components/amod/amod-stay-context";
import { useSelection } from "@/hooks/amod/useSelection";
import {
  buildAmodEnquiryMessage,
  normalizeWhatsAppNumber,
  whatsappEnquiryUrl,
} from "@/lib/whatsapp";
import { formatInr } from "@/lib/formatInr";
import { WhatsAppEnquiryButton } from "@/components/amod/WhatsAppEnquiryButton";
import { MealTogglesInline } from "@/components/amod/MealTogglesInline";
import { Button } from "@/components/ui/button";

function formatDisplayDate(iso: string) {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function SelectionBar() {
  const { rooms, hotelSettings, mealsUiVisible } = useAmodStay();
  const checkInDate = useBookingStore((s) => s.checkInDate);
  const checkOutDate = useBookingStore((s) => s.checkOutDate);
  const guestCount = useBookingStore((s) => s.guestCount);
  const isEntireProperty = useBookingStore((s) => s.isEntireProperty);
  const selectedRooms = useBookingStore((s) => s.selectedRooms);
  const clearEnquiry = useBookingStore((s) => s.clearEnquiry);

  const {
    roomOnlyTotal,
    mealNightlyAddon,
    estimatedTotalNightly,
    anyMealSelected,
    selectionLinesForWhatsapp,
    selectedMealLabels,
  } = useSelection(rooms, hotelSettings);

  const datesOk =
    checkInDate && checkOutDate && checkOutDate > checkInDate;

  const selectionOk = isEntireProperty || selectedRooms.length > 0;

  const visible = Boolean(datesOk && selectionOk);

  const whatsapp = hotelSettings.whatsapp_number;
  const numberOk = normalizeWhatsAppNumber(whatsapp).length >= 8;

  const message = useMemo(
    () =>
      buildAmodEnquiryMessage({
        checkIn: formatDisplayDate(checkInDate!),
        checkOut: formatDisplayDate(checkOutDate!),
        guestCount,
        isEntireProperty,
        selectionLines: selectionLinesForWhatsapp,
        mealsEnabled: mealsUiVisible,
        selectedMealLabels,
        roomOnlyTotalLabel: formatInr(roomOnlyTotal),
        withMealsTotalLabel:
          anyMealSelected && mealsUiVisible
            ? formatInr(estimatedTotalNightly)
            : undefined,
      }),
    [
      checkInDate,
      checkOutDate,
      guestCount,
      isEntireProperty,
      selectionLinesForWhatsapp,
      mealsUiVisible,
      selectedMealLabels,
      roomOnlyTotal,
      anyMealSelected,
      estimatedTotalNightly,
    ]
  );

  const href = numberOk ? whatsappEnquiryUrl(whatsapp, message) : undefined;

  const summaryLabel = isEntireProperty
    ? "Entire Villa"
    : selectedRooms.map((r) => r.name).join(" · ");

  if (!visible) return null;

  return (
    <footer className="animate-in slide-in-from-bottom fade-in fixed bottom-0 left-0 right-0 z-50 max-h-[min(92dvh,calc(100dvh-4rem))] duration-300">
      <div className="mx-2 mb-3 max-h-[inherit] overflow-y-auto overscroll-contain rounded-2xl border border-border/60 bg-background/95 px-3 py-3 shadow-lg backdrop-blur-md sm:mx-auto sm:mb-5 sm:max-w-2xl sm:px-5 sm:py-4">
        <p className="mb-2 font-label text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Amod · your enquiry
        </p>

        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <div className="min-w-0 border-l-2 border-primary/50 pl-3 sm:pl-4">
            <p className="truncate font-body text-base font-semibold text-foreground sm:text-lg">
              {summaryLabel}
            </p>
            <p className="mt-1 font-body text-sm leading-snug text-muted-foreground">
              <span className="text-foreground">Room-only</span>{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {formatInr(roomOnlyTotal)}
              </span>
              <span className="whitespace-nowrap"> / night</span>
            </p>
            {mealsUiVisible ? (
              <p className="mt-1 font-body text-sm leading-snug">
                <span className="text-muted-foreground">Meals selected:</span>{" "}
                {selectedMealLabels.length > 0 ? (
                  <span className="font-semibold text-primary">
                    {selectedMealLabels.join(" · ")}
                  </span>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </p>
            ) : null}
            {mealsUiVisible && anyMealSelected && mealNightlyAddon > 0 ? (
              <p className="mt-1 font-body text-sm leading-snug">
                <span className="text-muted-foreground">Total with meals</span>{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {formatInr(estimatedTotalNightly)}
                </span>
                <span className="whitespace-nowrap"> / night</span>
              </p>
            ) : null}
            <p className="mt-1.5 font-body text-xs text-muted-foreground sm:text-sm">
              {formatDisplayDate(checkInDate!)} –{" "}
              {formatDisplayDate(checkOutDate!)} · {guestCount} guest
              {guestCount === 1 ? "" : "s"}
            </p>
            {!numberOk && (
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                WhatsApp number not configured
              </p>
            )}
          </div>

          {mealsUiVisible ? (
            <MealTogglesInline className="border-t border-border/50 pt-3" />
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 w-full shrink-0 rounded-xl font-label text-xs uppercase tracking-wider sm:order-1 sm:w-auto"
              onClick={() => clearEnquiry()}
            >
              Clear
            </Button>
            <WhatsAppEnquiryButton href={href} disabled={!href} />
          </div>
        </div>
      </div>
    </footer>
  );
}
