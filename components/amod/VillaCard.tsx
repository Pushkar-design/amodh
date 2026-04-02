"use client";

import { StayMetricsStrip } from "@/components/amod/StayMetricsStrip";
import { formatInr } from "@/lib/formatInr";
import { cn } from "@/lib/utils";

type VillaCardProps = {
  estimatedNightlyTotal: number;
  maxOccupancyTotal: number;
  extraBedSummary: string | null;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
};

export function VillaCard({
  estimatedNightlyTotal,
  maxOccupancyTotal,
  extraBedSummary,
  selected,
  disabled,
  onToggle,
}: VillaCardProps) {
  return (
    <div className="villa-frost-stage w-full">
      <article
        className={cn(
          "group/villa w-full rounded-xl border border-white/[0.12] bg-black/55 px-4 py-4 text-[hsl(40_22%_96%)] shadow-[0_14px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl backdrop-saturate-150 transition-[transform,box-shadow,background-color,border-color] duration-500 ease-out motion-reduce:transition-none sm:rounded-2xl sm:px-6 sm:py-4 md:px-8 md:py-4",
          "[-webkit-backdrop-filter:blur(20px)_saturate(1.15)]",
          "hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-black/60 hover:shadow-[0_18px_48px_-12px_rgba(0,0,0,0.7)]",
          selected &&
            "border-white/[0.32] bg-black/62 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.72)]",
          disabled &&
            !selected &&
            "opacity-60 hover:translate-y-0 hover:border-white/[0.12] hover:bg-black/55 hover:shadow-[0_14px_40px_-12px_rgba(0,0,0,0.65)]"
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0 shrink-0 lg:max-w-[min(100%,17rem)] xl:max-w-[19rem]">
            <p className="mb-1 font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-white/45">
              Entire Villa
            </p>
            <h3 className="font-serif-display text-xl font-normal leading-[1.2] tracking-tight text-[hsl(42_30%_98%)] sm:text-2xl md:text-[1.65rem] lg:text-[1.5rem] xl:text-[1.65rem]">
              A home where every corner belongs to you.
            </h3>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center lg:flex-1 lg:justify-end xl:gap-10">
            <StayMetricsStrip
              variant="villa"
              guestsLabel={`Up to ${maxOccupancyTotal} guests`}
              spaceLabel="All rooms"
              priceFormatted={formatInr(estimatedNightlyTotal)}
              className="lg:justify-center"
            />

            <button
              type="button"
              disabled={!selected && disabled}
              onClick={onToggle}
              className={cn(
                "liquid-glass w-full shrink-0 rounded-full px-6 py-2.5 font-label text-[10px] font-semibold uppercase tracking-[0.2em] sm:w-auto sm:px-7 sm:py-3 sm:text-[11px]",
                "disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none",
                selected &&
                  "!scale-100 !bg-white/[0.14] text-[hsl(42_30%_98%)] hover:!scale-100 hover:!bg-white/[0.18]"
              )}
            >
              {selected ? "Deselect Villa" : "Select Villa"}
            </button>
          </div>
        </div>

        {extraBedSummary ? (
          <p className="mt-3 font-body text-[11px] leading-snug text-white/45 sm:text-xs">
            {extraBedSummary}
          </p>
        ) : null}
      </article>
    </div>
  );
}
