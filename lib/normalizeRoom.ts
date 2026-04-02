import type { Room } from "@/types/hotel";

export function normalizeRoom(raw: unknown): Room {
  const r = raw as Partial<Room>;
  const mo = Number(r.max_occupancy);
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    price_per_night: Number(r.price_per_night ?? 0),
    is_available: Boolean(r.is_available),
    image_url: r.image_url ?? null,
    description: r.description ?? null,
    max_occupancy:
      Number.isFinite(mo) && mo >= 1 && mo <= 50 ? Math.round(mo) : 2,
    extra_bed_note:
      r.extra_bed_note != null && String(r.extra_bed_note).trim()
        ? String(r.extra_bed_note).trim()
        : null,
  };
}
