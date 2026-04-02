"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { BookingWithRoom, Room } from "@/types/hotel";
import { HotelAmodhHeader } from "@/components/HotelAmodhHeader";
import { AdminAccessDeniedPanel } from "@/components/AdminAccessDeniedPanel";
import { AdminRoomCard } from "@/components/AdminRoomCard";
import { AdminRoomImageField } from "@/components/AdminRoomImageField";
import { createClient } from "@/lib/supabaseClient";
import { normalizeRoom } from "@/lib/normalizeRoom";
import { isDateOverlap } from "@/utils/dateOverlap";

type AdminGate = "unknown" | "allowed" | "denied" | "error";

type AdminBookingRow = BookingWithRoom & {
  rooms: { name: string } | null;
};

export default function AdminPage() {
  const [bootstrapped, setBootstrapped] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetSending, setResetSending] = useState(false);
  const [bookingActionError, setBookingActionError] = useState<string | null>(
    null
  );
  const [roomActionError, setRoomActionError] = useState<string | null>(null);
  const [settingsActionError, setSettingsActionError] = useState<string | null>(
    null
  );
  const [gate, setGate] = useState<AdminGate>("unknown");
  const [accessCheckError, setAccessCheckError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [mealsEnabled, setMealsEnabled] = useState(false);
  const [mealBreakfast, setMealBreakfast] = useState("");
  const [mealLunch, setMealLunch] = useState("");
  const [mealDinner, setMealDinner] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [newBooking, setNewBooking] = useState({
    room_id: "",
    start_date: "",
    end_date: "",
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    notes: "",
  });

  const [editingBooking, setEditingBooking] = useState<{
    id: string;
    room_id: string;
    start_date: string;
    end_date: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    notes: string;
  } | null>(null);
  const [savingBookingId, setSavingBookingId] = useState<string | null>(null);

  const [newRoom, setNewRoom] = useState<{
    name: string;
    price_per_night: string;
    max_occupancy: string;
    extra_bed_note: string;
    description: string;
    image_url: string | null;
  }>({
    name: "",
    price_per_night: "",
    max_occupancy: "2",
    extra_bed_note: "",
    description: "",
    image_url: null,
  });
  const [creatingRoom, setCreatingRoom] = useState(false);

  const dashboardStats = useMemo(() => {
    function localYmd(d: Date): string {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    const today = new Date();
    const windowEnd = new Date(today);
    windowEnd.setDate(windowEnd.getDate() + 30);
    const ws = localYmd(today);
    const we = localYmd(windowEnd);
    const roomPrice: Record<string, number> = {};
    for (const r of rooms) roomPrice[r.id] = Number(r.price_per_night);

    let bookingsTouchingWindow = 0;
    let nightsInWindow = 0;
    let revenueInWindow = 0;

    for (const b of bookings) {
      if (!isDateOverlap(ws, we, b.start_date, b.end_date)) continue;
      bookingsTouchingWindow += 1;
      const clipStart = b.start_date > ws ? b.start_date : ws;
      const clipEnd = b.end_date < we ? b.end_date : we;
      const s = new Date(`${clipStart}T12:00:00`);
      const e = new Date(`${clipEnd}T12:00:00`);
      const nightCount =
        Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000)) + 1;
      nightsInWindow += nightCount;
      revenueInWindow += nightCount * (roomPrice[b.room_id] ?? 0);
    }

    return { bookingsTouchingWindow, nightsInWindow, revenueInWindow };
  }, [bookings, rooms]);

  const loadProtected = useCallback(async () => {
    setAccessCheckError(null);
    let bRes: Response;
    let rRes: Response;
    let sRes: Response;
    try {
      [bRes, rRes, sRes] = await Promise.all([
        fetch("/api/admin/bookings", { credentials: "same-origin" }),
        fetch("/api/admin/rooms", { credentials: "same-origin" }),
        fetch("/api/settings", { credentials: "same-origin" }),
      ]);
    } catch {
      setGate("error");
      setAccessCheckError(
        "Could not reach the admin API. Check your network or try again."
      );
      setBookings([]);
      setRooms([]);
      return;
    }

    if (bRes.status === 401 || rRes.status === 401) {
      setGate("denied");
      setBookings([]);
      setRooms([]);
      return;
    }

    if (!bRes.ok) {
      setGate("error");
      let detail = "";
      try {
        const j = (await bRes.json()) as { error?: string };
        if (j.error) detail = ` ${j.error}`;
      } catch {
        /* ignore */
      }
      setAccessCheckError(
        `Admin API returned ${bRes.status}.${detail} If this is a new deploy, confirm SUPABASE_SERVICE_ROLE_KEY is set on the server.`
      );
      setBookings([]);
      setRooms([]);
      return;
    }

    setGate("allowed");
    const bJson = await bRes.json();
    const rJson = await rRes.json();
    const sJson = await sRes.json();
    if (bRes.ok) setBookings(bJson.bookings ?? []);
    if (rRes.ok)
      setRooms((rJson.rooms ?? []).map(normalizeRoom));
    if (sRes.ok) {
      setWhatsapp(
        typeof sJson.whatsapp_number === "string" ? sJson.whatsapp_number : ""
      );
      setContactPhone(
        typeof sJson.contact_phone === "string" ? sJson.contact_phone : ""
      );
      setContactEmail(
        typeof sJson.contact_email === "string" ? sJson.contact_email : ""
      );
      setMealsEnabled(Boolean(sJson.meals_enabled));
      setMealBreakfast(
        sJson.meal_breakfast_pp_night != null &&
          sJson.meal_breakfast_pp_night !== ""
          ? String(sJson.meal_breakfast_pp_night)
          : ""
      );
      setMealLunch(
        sJson.meal_lunch_pp_night != null && sJson.meal_lunch_pp_night !== ""
          ? String(sJson.meal_lunch_pp_night)
          : ""
      );
      setMealDinner(
        sJson.meal_dinner_pp_night != null && sJson.meal_dinner_pp_night !== ""
          ? String(sJson.meal_dinner_pp_night)
          : ""
      );
    }
  }, []);

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch (e) {
      setConfigError(
        e instanceof Error
          ? e.message
          : "Missing Supabase browser configuration."
      );
      setBootstrapped(true);
      return;
    }

    let cancelled = false;

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) await loadProtected();
      if (!cancelled) setBootstrapped(true);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) await loadProtected();
      else {
        setBookings([]);
        setRooms([]);
        setGate("unknown");
        setAccessCheckError(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProtected]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setLoginError(error.message);
        return;
      }
      setPassword("");
      await loadProtected();
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setBookings([]);
    setRooms([]);
    setGate("unknown");
  }

  async function addBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookingActionError(null);
    if (!newBooking.room_id || !newBooking.start_date || !newBooking.end_date)
      return;
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        room_id: newBooking.room_id,
        start_date: newBooking.start_date,
        end_date: newBooking.end_date,
        guest_name: newBooking.guest_name.trim() || null,
        guest_email: newBooking.guest_email.trim() || null,
        guest_phone: newBooking.guest_phone.trim() || null,
        notes: newBooking.notes.trim() || null,
      }),
    });
    if (res.ok) {
      setNewBooking({
        room_id: "",
        start_date: "",
        end_date: "",
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        notes: "",
      });
      await loadProtected();
      return;
    }
    let msg = `Could not add booking (${res.status})`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    setBookingActionError(msg);
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking?")) return;
    setBookingActionError(null);
    const res = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (res.ok) {
      await loadProtected();
      return;
    }
    let msg = `Could not delete booking (${res.status})`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    setBookingActionError(msg);
  }

  async function saveBookingEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBooking) return;
    setBookingActionError(null);
    setSavingBookingId(editingBooking.id);
    try {
      const res = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          room_id: editingBooking.room_id,
          start_date: editingBooking.start_date,
          end_date: editingBooking.end_date,
          guest_name: editingBooking.guest_name.trim() || null,
          guest_email: editingBooking.guest_email.trim() || null,
          guest_phone: editingBooking.guest_phone.trim() || null,
          notes: editingBooking.notes.trim() || null,
        }),
      });
      if (res.ok) {
        setEditingBooking(null);
        await loadProtected();
        return;
      }
      let msg = `Could not save booking (${res.status})`;
      try {
        const j = (await res.json()) as { error?: string };
        if (j.error) msg = j.error;
      } catch {
        /* ignore */
      }
      setBookingActionError(msg);
    } finally {
      setSavingBookingId(null);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetMessage(null);
    setResetSending(true);
    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        {
          redirectTo: `${origin}/auth/callback?next=/admin`,
        }
      );
      if (error) {
        setResetMessage(error.message);
        return;
      }
      setResetMessage(
        "Check your email for a reset link. You can close this panel and sign in after updating your password."
      );
    } finally {
      setResetSending(false);
    }
  }

  async function addRoom(e: React.FormEvent) {
    e.preventDefault();
    setRoomActionError(null);
    const name = newRoom.name.trim();
    const price = Number(newRoom.price_per_night);
    const maxOcc = Math.round(Number(newRoom.max_occupancy));
    if (
      !name ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(maxOcc) ||
      maxOcc < 1
    )
      return;
    setCreatingRoom(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name,
          price_per_night: price,
          max_occupancy: maxOcc,
          extra_bed_note: newRoom.extra_bed_note.trim() || null,
          description: newRoom.description.trim() || null,
          is_available: true,
          image_url: newRoom.image_url,
        }),
      });
      if (res.ok) {
        setNewRoom({
          name: "",
          price_per_night: "",
          max_occupancy: "2",
          extra_bed_note: "",
          description: "",
          image_url: null,
        });
        await loadProtected();
        return;
      }
      let msg = `Could not create room (${res.status})`;
      try {
        const j = (await res.json()) as { error?: string };
        if (j.error) msg = j.error;
      } catch {
        /* ignore */
      }
      setRoomActionError(msg);
    } finally {
      setCreatingRoom(false);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsActionError(null);
    setSettingsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          whatsapp_number: whatsapp,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          meals_enabled: mealsEnabled,
          meal_breakfast_pp_night:
            mealBreakfast.trim() === "" ? null : Number(mealBreakfast),
          meal_lunch_pp_night:
            mealLunch.trim() === "" ? null : Number(mealLunch),
          meal_dinner_pp_night:
            mealDinner.trim() === "" ? null : Number(mealDinner),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWhatsapp(data.whatsapp_number ?? whatsapp);
        setContactPhone(
          typeof data.contact_phone === "string" ? data.contact_phone : contactPhone
        );
        setContactEmail(
          typeof data.contact_email === "string" ? data.contact_email : contactEmail
        );
        setMealsEnabled(Boolean(data.meals_enabled));
        setMealBreakfast(
          data.meal_breakfast_pp_night != null
            ? String(data.meal_breakfast_pp_night)
            : ""
        );
        setMealLunch(
          data.meal_lunch_pp_night != null ? String(data.meal_lunch_pp_night) : ""
        );
        setMealDinner(
          data.meal_dinner_pp_night != null
            ? String(data.meal_dinner_pp_night)
            : ""
        );
        return;
      }
      let msg = `Could not save settings (${res.status})`;
      try {
        const j = (await res.json()) as { error?: string };
        if (j.error) msg = j.error;
      } catch {
        /* ignore */
      }
      setSettingsActionError(msg);
    } finally {
      setSettingsSaving(false);
    }
  }

  if (!bootstrapped) {
    return (
      <>
        <HotelAmodhHeader />
        <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-20">
          <p className="text-[#36454F]/60">Loading…</p>
        </main>
      </>
    );
  }

  if (configError) {
    return (
      <>
        <HotelAmodhHeader />
        <main className="mx-auto max-w-lg flex-1 px-4 pt-28 pb-16">
          <h1 className="font-serif text-2xl text-[#36454F]">
            Sign-in unavailable
          </h1>
          <p className="mt-3 text-sm text-[#36454F]/75">{configError}</p>
          <p className="mt-2 text-sm text-[#36454F]/65">
            Add the same public Supabase variables you use on the server to your
            deployment (they must start with{" "}
            <code className="rounded bg-[#36454F]/10 px-1">NEXT_PUBLIC_</code>
            ), then redeploy.
          </p>
          <Link href="/" className="mt-8 block text-center text-[#8A9A5B]">
            ← Home
          </Link>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <HotelAmodhHeader />
        <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 pt-28 pb-16">
          <h1 className="font-serif text-3xl text-[#36454F]">Admin</h1>
          <p className="mt-2 text-sm text-[#36454F]/70">
            Sign in with the hotel Supabase account (email and password).
          </p>
          {!showForgotPassword ? (
            <form
              onSubmit={(e) => void handleLogin(e)}
              className="mt-8 flex flex-col gap-4"
            >
              <label className="flex flex-col gap-2 text-sm text-[#36454F]">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-12 rounded-lg border border-[#36454F]/20 px-4"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-[#36454F]">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-12 rounded-lg border border-[#36454F]/20 px-4"
                  autoComplete="current-password"
                  required
                />
              </label>
              {loginError && (
                <p className="text-sm text-red-700" role="alert">
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                disabled={loggingIn}
                className="min-h-12 rounded-full bg-[#8A9A5B] text-white disabled:opacity-50"
              >
                {loggingIn ? "Signing in…" : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setResetEmail(email.trim());
                  setResetMessage(null);
                }}
                className="text-sm text-[#8A9A5B] underline-offset-2 hover:underline"
              >
                Forgot password?
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => void handleForgotPassword(e)}
              className="mt-8 flex flex-col gap-4"
            >
              <p className="text-sm text-[#36454F]/70">
                We will email you a link to reset your password (configure the
                redirect URL in Supabase Auth for your site origin).
              </p>
              <label className="flex flex-col gap-2 text-sm text-[#36454F]">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="min-h-12 rounded-lg border border-[#36454F]/20 px-4"
                  required
                />
              </label>
              {resetMessage && (
                <p
                  className={`text-sm ${resetMessage.startsWith("Check") ? "text-[#36454F]/80" : "text-red-700"}`}
                  role="status"
                >
                  {resetMessage}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={resetSending}
                  className="min-h-12 rounded-full bg-[#8A9A5B] px-6 text-white disabled:opacity-50"
                >
                  {resetSending ? "Sending…" : "Send reset link"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage(null);
                  }}
                  className="min-h-12 rounded-full border border-[#36454F]/20 px-6"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}
          <Link href="/" className="mt-8 text-center text-[#8A9A5B]">
            ← Home
          </Link>
        </main>
      </>
    );
  }

  if (gate === "denied") {
    return (
      <>
        <HotelAmodhHeader />
        <AdminAccessDeniedPanel email={user.email} />
      </>
    );
  }

  if (gate === "error") {
    return (
      <>
        <HotelAmodhHeader />
        <main className="mx-auto max-w-lg flex-1 px-4 pt-28 pb-16">
          <h1 className="font-serif text-2xl text-[#36454F]">
            Could not load admin
          </h1>
          <p className="mt-3 text-sm text-[#36454F]/75">
            {accessCheckError ??
              "Something went wrong while checking your access."}
          </p>
          <button
            type="button"
            className="mt-6 min-h-12 rounded-full bg-[#8A9A5B] px-6 text-white"
            onClick={() => void loadProtected()}
          >
            Try again
          </button>
          <Link href="/" className="mt-6 block text-center text-[#8A9A5B]">
            ← Home
          </Link>
        </main>
      </>
    );
  }

  if (gate === "unknown") {
    return (
      <>
        <HotelAmodhHeader />
        <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-20">
          <p className="text-[#36454F]/60">Verifying access…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <HotelAmodhHeader />
      <main className="mx-auto max-w-5xl flex-1 px-4 pt-28 pb-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[#36454F]">Dashboard</h1>
            <p className="mt-1 text-sm text-[#36454F]/60">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="min-h-11 self-start rounded-lg border border-[#36454F]/20 px-4 py-2 text-sm"
          >
            Sign out
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#36454F]/10 bg-white/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#36454F]/50">
              Next 30 days
            </p>
            <p className="mt-1 font-serif text-2xl text-[#36454F]">
              {dashboardStats.bookingsTouchingWindow}
            </p>
            <p className="text-sm text-[#36454F]/65">Bookings touching window</p>
          </div>
          <div className="rounded-xl border border-[#36454F]/10 bg-white/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#36454F]/50">
              Room-nights (est.)
            </p>
            <p className="mt-1 font-serif text-2xl text-[#36454F]">
              {dashboardStats.nightsInWindow}
            </p>
            <p className="text-sm text-[#36454F]/65">Nights in same window</p>
          </div>
          <div className="rounded-xl border border-[#36454F]/10 bg-white/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#36454F]/50">
              Revenue (est.)
            </p>
            <p className="mt-1 font-serif text-2xl text-[#36454F]">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(dashboardStats.revenueInWindow)}
            </p>
            <p className="text-sm text-[#36454F]/65">
              Nights × nightly rate, clipped to window
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[#36454F]/10 bg-white/50 p-6">
          <h2 className="font-serif text-xl text-[#8A9A5B]">Rooms</h2>
          <p className="mt-2 text-sm text-[#36454F]/70">
            Green means the room is available on the site; red means it is
            hidden from the public gallery. Edits save to Supabase and appear on
            the homepage after refresh.
          </p>

          <form
            onSubmit={(e) => void addRoom(e)}
            className="mt-8 rounded-xl border border-dashed border-[#36454F]/20 bg-[#F5F5DC]/40 p-4"
          >
            <p className="text-sm font-medium text-[#36454F]">Add a room</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm">
                Name
                <input
                  value={newRoom.name}
                  onChange={(e) =>
                    setNewRoom((s) => ({ ...s, name: e.target.value }))
                  }
                  className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                  placeholder="The Sage Suite"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Price / night (USD)
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={newRoom.price_per_night}
                  onChange={(e) =>
                    setNewRoom((s) => ({
                      ...s,
                      price_per_night: e.target.value,
                    }))
                  }
                  className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Max guests
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={newRoom.max_occupancy}
                  onChange={(e) =>
                    setNewRoom((s) => ({ ...s, max_occupancy: e.target.value }))
                  }
                  className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                  required
                />
              </label>
            </div>
            <label className="mt-4 flex flex-col gap-1 text-sm">
              Extra bed note (optional)
              <input
                value={newRoom.extra_bed_note}
                onChange={(e) =>
                  setNewRoom((s) => ({ ...s, extra_bed_note: e.target.value }))
                }
                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                placeholder="e.g. One rollaway on request — …"
              />
            </label>
            <label className="mt-4 flex flex-col gap-1 text-sm">
              Description (optional)
              <textarea
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom((s) => ({ ...s, description: e.target.value }))
                }
                rows={2}
                className="resize-y rounded-lg border border-[#36454F]/20 px-3 py-2"
              />
            </label>
            <div className="mt-4">
              <AdminRoomImageField
                value={newRoom.image_url}
                onChange={(url) =>
                  setNewRoom((s) => ({ ...s, image_url: url }))
                }
                disabled={creatingRoom}
                label="Room photo (optional)"
              />
            </div>
            <button
              type="submit"
              disabled={creatingRoom}
              className="mt-4 min-h-11 rounded-full bg-[#36454F] px-6 text-white disabled:opacity-50"
            >
              {creatingRoom ? "Creating…" : "Create room"}
            </button>
            {roomActionError && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                {roomActionError}
              </p>
            )}
          </form>

          <ul className="mt-8 flex flex-col gap-3">
            {rooms.map((r) => (
              <AdminRoomCard key={r.id} room={r} onChanged={loadProtected} />
            ))}
          </ul>
          {rooms.length === 0 && (
            <p className="mt-6 text-[#36454F]/50">No rooms yet. Add one above.</p>
          )}
        </section>

        <section className="mt-12 rounded-2xl border border-[#36454F]/10 bg-white/50 p-6">
          <h2 className="font-serif text-xl text-[#8A9A5B]">
            Bookings management
          </h2>
          <form
            onSubmit={(e) => void addBooking(e)}
            className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="flex flex-col gap-1 text-sm">
              Room
              <select
                value={newBooking.room_id}
                onChange={(e) =>
                  setNewBooking((s) => ({ ...s, room_id: e.target.value }))
                }
                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                required
              >
                <option value="">Select…</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Start
              <input
                type="date"
                value={newBooking.start_date}
                onChange={(e) =>
                  setNewBooking((s) => ({ ...s, start_date: e.target.value }))
                }
                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              End
              <input
                type="date"
                value={newBooking.end_date}
                onChange={(e) =>
                  setNewBooking((s) => ({ ...s, end_date: e.target.value }))
                }
                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                required
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="min-h-11 w-full rounded-full bg-[#36454F] text-white"
              >
                Add booking
              </button>
            </div>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Guest name (optional)
              <input
                value={newBooking.guest_name}
                onChange={(e) =>
                  setNewBooking((s) => ({ ...s, guest_name: e.target.value }))
                }
                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Guest email (optional)
              <input
                type="email"
                value={newBooking.guest_email}
                onChange={(e) =>
                  setNewBooking((s) => ({ ...s, guest_email: e.target.value }))
                }
                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Guest phone (optional)
              <input
                type="tel"
                value={newBooking.guest_phone}
                onChange={(e) =>
                  setNewBooking((s) => ({ ...s, guest_phone: e.target.value }))
                }
                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-4">
              Notes (optional)
              <textarea
                value={newBooking.notes}
                onChange={(e) =>
                  setNewBooking((s) => ({ ...s, notes: e.target.value }))
                }
                rows={2}
                className="resize-y rounded-lg border border-[#36454F]/20 px-3 py-2"
              />
            </label>
            {bookingActionError && (
              <p
                className="sm:col-span-2 lg:col-span-4 text-sm text-red-700"
                role="alert"
              >
                {bookingActionError}
              </p>
            )}
          </form>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#36454F]/15 text-[#36454F]/60">
                  <th className="py-2 pr-4 font-medium">Room</th>
                  <th className="py-2 pr-4 font-medium">Start</th>
                  <th className="py-2 pr-4 font-medium">End</th>
                  <th className="py-2 pr-4 font-medium">Guest</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <Fragment key={b.id}>
                    <tr className="border-b border-[#36454F]/10">
                      <td className="py-3 pr-4">{b.rooms?.name ?? "—"}</td>
                      <td className="py-3 pr-4">{b.start_date}</td>
                      <td className="py-3 pr-4">{b.end_date}</td>
                      <td className="py-3 pr-4 text-[#36454F]/80">
                        {b.guest_name?.trim() ||
                          b.guest_email?.trim() ||
                          "—"}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingBooking({
                                id: b.id,
                                room_id: b.room_id,
                                start_date: b.start_date,
                                end_date: b.end_date,
                                guest_name: b.guest_name ?? "",
                                guest_email: b.guest_email ?? "",
                                guest_phone: b.guest_phone ?? "",
                                notes: b.notes ?? "",
                              })
                            }
                            className="text-[#8A9A5B] underline-offset-2 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteBooking(b.id)}
                            className="text-red-700 underline-offset-2 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {editingBooking?.id === b.id && (
                      <tr className="border-b border-[#36454F]/10">
                        <td colSpan={5} className="bg-[#F5F5DC]/35 p-4">
                          <form
                            onSubmit={(e) => void saveBookingEdit(e)}
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                          >
                            <label className="flex flex-col gap-1 text-sm">
                              Room
                              <select
                                value={editingBooking.room_id}
                                onChange={(e) =>
                                  setEditingBooking((s) =>
                                    s
                                      ? { ...s, room_id: e.target.value }
                                      : s
                                  )
                                }
                                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                                required
                              >
                                {rooms.map((r) => (
                                  <option key={r.id} value={r.id}>
                                    {r.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="flex flex-col gap-1 text-sm">
                              Start
                              <input
                                type="date"
                                value={editingBooking.start_date}
                                onChange={(e) =>
                                  setEditingBooking((s) =>
                                    s
                                      ? { ...s, start_date: e.target.value }
                                      : s
                                  )
                                }
                                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                                required
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-sm">
                              End
                              <input
                                type="date"
                                value={editingBooking.end_date}
                                onChange={(e) =>
                                  setEditingBooking((s) =>
                                    s
                                      ? { ...s, end_date: e.target.value }
                                      : s
                                  )
                                }
                                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                                required
                              />
                            </label>
                            <div className="flex flex-wrap items-end gap-2">
                              <button
                                type="submit"
                                disabled={savingBookingId === editingBooking.id}
                                className="min-h-11 rounded-full bg-[#36454F] px-5 text-white disabled:opacity-50"
                              >
                                {savingBookingId === editingBooking.id
                                  ? "Saving…"
                                  : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingBooking(null)}
                                className="min-h-11 rounded-full border border-[#36454F]/20 px-5"
                              >
                                Cancel
                              </button>
                            </div>
                            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                              Guest name
                              <input
                                value={editingBooking.guest_name}
                                onChange={(e) =>
                                  setEditingBooking((s) =>
                                    s
                                      ? { ...s, guest_name: e.target.value }
                                      : s
                                  )
                                }
                                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                              Guest email
                              <input
                                type="email"
                                value={editingBooking.guest_email}
                                onChange={(e) =>
                                  setEditingBooking((s) =>
                                    s
                                      ? { ...s, guest_email: e.target.value }
                                      : s
                                  )
                                }
                                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                              Guest phone
                              <input
                                type="tel"
                                value={editingBooking.guest_phone}
                                onChange={(e) =>
                                  setEditingBooking((s) =>
                                    s
                                      ? { ...s, guest_phone: e.target.value }
                                      : s
                                  )
                                }
                                className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-4">
                              Notes
                              <textarea
                                value={editingBooking.notes}
                                onChange={(e) =>
                                  setEditingBooking((s) =>
                                    s ? { ...s, notes: e.target.value } : s
                                  )
                                }
                                rows={2}
                                className="resize-y rounded-lg border border-[#36454F]/20 px-3 py-2"
                              />
                            </label>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <p className="mt-4 text-[#36454F]/50">No bookings yet.</p>
            )}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[#36454F]/10 bg-white/50 p-6">
          <h2 className="font-serif text-xl text-[#8A9A5B]">Settings</h2>
          <form onSubmit={saveSettings} className="mt-6 max-w-xl space-y-6">
            <label className="flex flex-col gap-2 text-sm text-[#36454F]">
              WhatsApp number (with country code, e.g. 15551234567)
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="min-h-12 rounded-lg border border-[#36454F]/20 px-4"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#36454F]">
              Public phone (shown on Contact; optional — leave blank for site
              default)
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="min-h-12 rounded-lg border border-[#36454F]/20 px-4"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#36454F]">
              Public email (optional — leave blank for site default)
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="stay@example.com"
                className="min-h-12 rounded-lg border border-[#36454F]/20 px-4"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-[#36454F]">
              <input
                type="checkbox"
                checked={mealsEnabled}
                onChange={(e) => setMealsEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-[#36454F]/30"
              />
              Show meal add-ons on the site
            </label>
            <p className="text-xs text-[#36454F]/65">
              Per guest, per night. Leave blank to hide that meal from guests.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm text-[#36454F]">
                Breakfast (optional)
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={mealBreakfast}
                  onChange={(e) => setMealBreakfast(e.target.value)}
                  className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                  placeholder="—"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-[#36454F]">
                Lunch (optional)
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={mealLunch}
                  onChange={(e) => setMealLunch(e.target.value)}
                  className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                  placeholder="—"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-[#36454F]">
                Dinner (optional)
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={mealDinner}
                  onChange={(e) => setMealDinner(e.target.value)}
                  className="min-h-11 rounded-lg border border-[#36454F]/20 px-3"
                  placeholder="—"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={settingsSaving}
              className="mt-4 min-h-11 rounded-full bg-[#8A9A5B] px-6 text-white disabled:opacity-50"
            >
              {settingsSaving ? "Saving…" : "Save"}
            </button>
            {settingsActionError && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                {settingsActionError}
              </p>
            )}
          </form>
        </section>

        <p className="mt-12 pb-8 text-center text-sm text-[#36454F]/50">
          Bulk edits: Supabase Table Editor for{" "}
          <code className="rounded bg-[#36454F]/10 px-1">rooms</code>,{" "}
          <code className="rounded bg-[#36454F]/10 px-1">bookings</code>, or{" "}
          <code className="rounded bg-[#36454F]/10 px-1">admin_emails</code> (staff
          allowlist).{" "}
          <Link href="/" className="text-[#8A9A5B]">
            View site
          </Link>
        </p>
      </main>
    </>
  );
}
