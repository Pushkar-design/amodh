"use client";

import Image from "next/image";
import type { Room } from "@/types/hotel";
import { formatInr } from "@/lib/formatInr";
import {
  isGoogleDriveImageHost,
  resolveDisplayImageUrl,
} from "@/lib/imageUrl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StayMetricsStrip } from "@/components/amod/StayMetricsStrip";
import { cn } from "@/lib/utils";

type RoomCardProps = {
  room: Room;
  unavailable: boolean;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
};

export function RoomCard({
  room,
  unavailable,
  selected,
  disabled,
  onSelect,
}: RoomCardProps) {
  const imageSrc = resolveDisplayImageUrl(room.image_url);
  const price = Number(room.price_per_night);
  const maxOcc = room.max_occupancy ?? 2;

  return (
    <Card
      className={cn(
        "border border-border/50 bg-card p-3 py-0 pb-3 shadow-none transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] hover:border-border motion-reduce:transform-none",
        unavailable && "pointer-events-none opacity-45 hover:scale-100",
        selected && "ring-1 ring-primary/40"
      )}
    >
      <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            unoptimized={isGoogleDriveImageHost(imageSrc)}
            className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center font-body text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <CardHeader className="px-1 pt-5">
        <CardTitle className="font-serif-display text-xl font-normal text-foreground">
          {room.name}
        </CardTitle>
        <StayMetricsStrip
          variant="room"
          guestsLabel={`Up to ${maxOcc} guests`}
          spaceLabel="1 room"
          priceFormatted={formatInr(price)}
          className="mt-3"
        />
        {room.extra_bed_note ? (
          <p className="mt-3 border-l-2 border-primary/30 pl-3 font-body text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium uppercase tracking-wider text-foreground/80">
              Extra bed
            </span>
            <br />
            {room.extra_bed_note}
          </p>
        ) : null}
        <p
          className={cn(
            "mt-2 text-xs font-medium tracking-wide",
            unavailable ? "text-muted-foreground" : "text-primary/80"
          )}
        >
          {unavailable
            ? room.is_available === false
              ? "Unavailable"
              : "Unavailable for these dates"
            : "Available"}
        </p>
      </CardHeader>
      {room.description ? (
        <CardContent className="px-1 pt-0">
          <p className="line-clamp-3 font-body text-sm leading-relaxed text-muted-foreground">
            {room.description}
          </p>
        </CardContent>
      ) : null}
      <CardFooter className="border-t-0 bg-transparent px-1 pt-1">
        <Button
          type="button"
          variant={selected ? "secondary" : "default"}
          size="lg"
          className="h-11 w-full rounded-full border-0 font-label text-xs font-medium uppercase tracking-[0.18em] disabled:opacity-50"
          disabled={disabled}
          onClick={onSelect}
        >
          {unavailable ? "Unavailable" : selected ? "Deselect" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}
