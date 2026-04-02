"use client";

import { Banknote, DoorOpen, Home, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type StayMetricsStripProps = {
  guestsLabel: string;
  spaceLabel: string;
  priceFormatted: string;
  variant: "villa" | "room";
  className?: string;
};

export function StayMetricsStrip({
  guestsLabel,
  spaceLabel,
  priceFormatted,
  variant,
  className,
}: StayMetricsStripProps) {
  const isVilla = variant === "villa";

  const chip = isVilla
    ? "border-white/[0.14] bg-white/[0.06] text-white/[0.9] shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.06)]"
    : "border-border/50 bg-muted/40 text-foreground shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.5)]";

  const iconClass = isVilla
    ? "text-white/50"
    : "text-muted-foreground";

  const SpaceIcon = isVilla ? Home : DoorOpen;

  return (
    <div
      className={cn(
        "flex flex-wrap items-stretch gap-2 sm:gap-2.5 md:gap-3",
        className
      )}
      role="list"
    >
      <div
        className={cn(
          "inline-flex min-h-[2.25rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 sm:min-h-0 sm:px-3 sm:py-2",
          chip
        )}
        role="listitem"
      >
        <Users
          className={cn("size-3.5 shrink-0 sm:size-4", iconClass)}
          strokeWidth={1.75}
          aria-hidden
        />
        <span className="font-body text-[12px] leading-tight tabular-nums sm:text-[13px]">
          {guestsLabel}
        </span>
      </div>
      <div
        className={cn(
          "inline-flex min-h-[2.25rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 sm:min-h-0 sm:px-3 sm:py-2",
          chip
        )}
        role="listitem"
      >
        <SpaceIcon
          className={cn("size-3.5 shrink-0 sm:size-4", iconClass)}
          strokeWidth={1.75}
          aria-hidden
        />
        <span className="font-body text-[12px] leading-tight sm:text-[13px]">
          {spaceLabel}
        </span>
      </div>
      <div
        className={cn(
          "inline-flex min-h-[2.25rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 sm:min-h-0 sm:px-3 sm:py-2",
          chip
        )}
        role="listitem"
      >
        <Banknote
          className={cn("size-3.5 shrink-0 sm:size-4", iconClass)}
          strokeWidth={1.75}
          aria-hidden
        />
        <span className="font-body text-[12px] leading-tight tabular-nums sm:text-[13px]">
          <span
            className={cn(
              "font-serif-display text-sm font-normal sm:text-base",
              isVilla ? "text-[hsl(42_28%_96%)]" : "text-foreground"
            )}
          >
            {priceFormatted}
          </span>
          <span
            className={cn(
              "ml-1 text-[11px] font-normal sm:text-[12px]",
              isVilla ? "text-white/50" : "text-muted-foreground"
            )}
          >
            / night
          </span>
        </span>
      </div>
    </div>
  );
}
