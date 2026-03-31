"use client";

import { useEffect, useState } from "react";
import type { Room } from "@/types/hotel";
import { AdminRoomImageField } from "@/components/AdminRoomImageField";

function formatMoney(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

type Props = {
  room: Room;
  onChanged: () => void;
};

export function AdminRoomCard({ room, onChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(room.name);
  const [imageUrl, setImageUrl] = useState<string | null>(room.image_url);
  const [price, setPrice] = useState(String(room.price_per_night));
  const [description, setDescription] = useState(room.description ?? "");
  const [available, setAvailable] = useState(room.is_available);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setName(room.name);
    setImageUrl(room.image_url);
    setPrice(String(room.price_per_night));
    setDescription(room.description ?? "");
    setAvailable(room.is_available);
  }, [room]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setActionError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: name.trim(),
          image_url: imageUrl,
          price_per_night: Number(price),
          description: description.trim() || null,
          is_available: available,
        }),
      });
      if (res.ok) {
        onChanged();
        return;
      }
      let msg = `Could not save (${res.status})`;
      try {
        const j = (await res.json()) as { error?: string };
        if (j.error) msg = j.error;
      } catch {
        /* ignore */
      }
      setActionError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete “${room.name}”? This cannot be undone.`)) return;
    setActionError(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        onChanged();
        return;
      }
      let msg = `Could not delete (${res.status})`;
      try {
        const j = (await res.json()) as { error?: string };
        if (j.error) msg = j.error;
      } catch {
        /* ignore */
      }
      setActionError(msg);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li className="overflow-hidden rounded-xl border border-[#36454F]/10 bg-white/80">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[#36454F]/5"
        aria-expanded={open}
      >
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{
            backgroundColor: room.is_available ? "#6b9f6b" : "#c45c5c",
          }}
          title={room.is_available ? "Available" : "Unavailable"}
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[#36454F]">{room.name}</p>
          <p className="text-sm text-[#36454F]/65">
            {formatMoney(Number(room.price_per_night))} / night
          </p>
        </div>
        <span className="text-[#36454F]/40">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <form
          onSubmit={(e) => void save(e)}
          className="space-y-4 border-t border-[#36454F]/10 px-4 py-4"
        >
          <label className="flex flex-col gap-2 text-sm text-[#36454F]">
            Room name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-12 rounded-lg border border-[#36454F]/20 px-4"
              required
            />
          </label>

          <AdminRoomImageField
            value={imageUrl}
            onChange={setImageUrl}
            disabled={saving}
          />

          <label className="flex flex-col gap-2 text-sm text-[#36454F]">
            Price per night (USD)
            <input
              type="number"
              min={0}
              step={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="min-h-12 rounded-lg border border-[#36454F]/20 px-4"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-[#36454F]">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-y rounded-lg border border-[#36454F]/20 px-4 py-3"
              placeholder="Room vibe, amenities, notes for guests…"
            />
          </label>

          <label className="group flex cursor-pointer items-center gap-3 text-sm text-[#36454F]">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="sr-only"
            />
            <span className="relative inline-flex h-7 w-12 shrink-0 rounded-full bg-[#36454F]/25 transition-colors group-has-[:checked]:bg-[#6b9f6b]">
              <span className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform group-has-[:checked]:translate-x-[1.25rem]" />
            </span>
            <span>Available</span>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="min-h-11 rounded-full bg-[#8A9A5B] px-6 text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => void remove()}
              className="min-h-11 rounded-full border border-red-200 px-6 text-red-800 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete room"}
            </button>
          </div>
          {actionError && (
            <p className="text-sm text-red-700" role="alert">
              {actionError}
            </p>
          )}
        </form>
      )}
    </li>
  );
}
