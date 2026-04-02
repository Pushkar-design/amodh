"use client";

import { useCallback, useEffect, useState } from "react";
import type { Room } from "@/types/hotel";
import { normalizeRoom } from "@/lib/normalizeRoom";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load rooms");
      setRooms((data.rooms ?? []).map(normalizeRoom));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { rooms, loading, error, refetch };
}
