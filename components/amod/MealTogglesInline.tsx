"use client";

import { useAmodStay } from "@/components/amod/amod-stay-context";
import { useBookingStore } from "@/store/useBookingStore";
import { formatInr } from "@/lib/formatInr";
import { cn } from "@/lib/utils";

type MealKey = "breakfast" | "lunch" | "dinner";

function MealChip({
  label,
  price,
  active,
  disabled,
  onToggle,
}: {
  label: string;
  price: number | null;
  active: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  if (price == null) return null;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "min-h-10 flex-1 rounded-lg border px-2 py-1.5 text-center transition-colors sm:min-h-9 sm:px-3",
        active
          ? "border-primary bg-primary/15 text-foreground"
          : "border-border/70 bg-background/90 text-muted-foreground hover:border-border",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      <span className="block font-label text-[9px] font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className="block font-body text-[10px] tabular-nums text-muted-foreground sm:text-xs">
        +{formatInr(price)}
      </span>
    </button>
  );
}

type MealTogglesInlineProps = {
  className?: string;
};

export function MealTogglesInline({ className }: MealTogglesInlineProps) {
  const { mealsUiVisible, hotelSettings } = useAmodStay();
  const mealToggles = useBookingStore((s) => s.mealToggles);
  const setMealToggle = useBookingStore((s) => s.setMealToggle);

  if (!mealsUiVisible) return null;

  const { meal_breakfast_pp_night, meal_lunch_pp_night, meal_dinner_pp_night } =
    hotelSettings;

  const items: { key: MealKey; label: string; price: number | null }[] = [
    { key: "breakfast", label: "Breakfast", price: meal_breakfast_pp_night },
    { key: "lunch", label: "Lunch", price: meal_lunch_pp_night },
    { key: "dinner", label: "Dinner", price: meal_dinner_pp_night },
  ];

  if (!items.some((i) => i.price != null)) return null;

  return (
    <div className={cn("w-full min-w-0", className)}>
      <p className="mb-1.5 font-label text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Meals (per guest / night)
      </p>
      <div className="flex gap-1.5 sm:gap-2">
        {items.map(({ key, label, price }) => (
          <MealChip
            key={key}
            label={label}
            price={price}
            active={mealToggles[key]}
            disabled={false}
            onToggle={() => setMealToggle(key, !mealToggles[key])}
          />
        ))}
      </div>
    </div>
  );
}
