"use client";

import { useAmodStay } from "@/components/amod/amod-stay-context";
import { useBookingStore } from "@/store/useBookingStore";
import { formatInr } from "@/lib/formatInr";
import { cn } from "@/lib/utils";

type MealKey = "breakfast" | "lunch" | "dinner";

function MealToggle({
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
        "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-2 text-center transition-all duration-300 hover:scale-[1.02] motion-reduce:transform-none sm:min-h-12",
        active
          ? "border-primary/40 bg-primary/8 text-foreground"
          : "border-border/70 bg-background/80 text-muted-foreground hover:border-border",
        disabled && "pointer-events-none opacity-45"
      )}
    >
      <span className="font-label text-[10px] font-medium uppercase tracking-[0.18em]">
        {label}
      </span>
      <span className="font-body text-xs tabular-nums text-muted-foreground">
        +{formatInr(price)} / guest / night
      </span>
    </button>
  );
}

export function MealSelection() {
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

  const anyPrice = items.some((i) => i.price != null);
  if (!anyPrice) return null;

  return (
    <section className="border-t border-border/40 bg-background px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h3 className="font-serif-display text-xl font-normal text-foreground sm:text-2xl">
          Meals
        </h3>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          Optional add-ons (per guest, per night). Toggle what you would like
          included in your estimate.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          {items.map(({ key, label, price }) => (
            <MealToggle
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
    </section>
  );
}
