"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function showAdminNavLink(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.NEXT_PUBLIC_SHOW_ADMIN_LINK === "true";
}

function HotelNavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-serif tracking-tight transition-colors duration-300 ${
        isActive
          ? "border-b-2 border-primary pb-1 font-medium text-primary dark:text-primary-container"
          : "font-medium text-stone-600 hover:text-primary-container dark:text-stone-400"
      }`}
    >
      {children}
    </Link>
  );
}

export function HotelAmodhHeader() {
  const pathname = usePathname();
  const showAdmin = showAdminNavLink();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(typeof window !== "undefined" ? window.location.hash : "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isHome = pathname === "/";
  const isRoomsSection = isHome && hash === "#rooms";
  const isServices = pathname === "/services";
  const isContact = pathname === "/contact";

  return (
    <nav
      className="glass-nav fixed top-0 left-0 right-0 z-50 w-full"
      aria-label="Primary"
    >
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-5 py-4 sm:px-10 sm:py-6">
        <Link
          href="/"
          className="shrink-0 font-serif-display text-xl italic text-primary dark:text-primary-container sm:text-2xl"
          onClick={closeMobile}
        >
          Hotel Amodh
        </Link>

        <div className="hidden items-center gap-12 md:flex">
          <HotelNavLink href="/" isActive={isHome && !isRoomsSection}>
            Home
          </HotelNavLink>
          <HotelNavLink href="/#rooms" isActive={isRoomsSection}>
            Rooms
          </HotelNavLink>
          <HotelNavLink href="/services" isActive={isServices}>
            Services
          </HotelNavLink>
          <HotelNavLink href="/contact" isActive={isContact}>
            Contact
          </HotelNavLink>
          {showAdmin && (
            <Link
              href="/admin"
              className="font-serif tracking-tight text-stone-600 transition-colors hover:text-primary-container dark:text-stone-400"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 font-label text-xs font-bold uppercase tracking-widest text-on-primary shadow-sm transition-transform duration-300 active:scale-95 sm:px-8 sm:py-3"
            onClick={closeMobile}
          >
            Book Now
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-primary hover:bg-stone-200/60 dark:hover:bg-stone-800/60 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="site-mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="material-symbols-outlined" aria-hidden>
              menu
            </span>
          </button>
        </div>
      </div>

      <div
        id="site-mobile-nav"
        className={`${mobileOpen ? "flex" : "hidden"} flex-col gap-0 border-t border-stone-200/60 bg-stone-50/95 px-6 py-4 shadow-lg dark:border-stone-700/50 dark:bg-stone-900/95 md:hidden`}
        role="dialog"
        aria-label="Site menu"
      >
        <Link
          href="/"
          className={`border-b border-stone-200/50 py-3 font-serif font-medium dark:border-stone-700/50 ${
            isHome && !isRoomsSection ? "text-primary" : "text-stone-700 dark:text-stone-200"
          }`}
          onClick={closeMobile}
        >
          Home
        </Link>
        <Link
          href="/#rooms"
          className={`border-b border-stone-200/50 py-3 font-serif dark:border-stone-700/50 ${
            isRoomsSection ? "font-medium text-primary" : "text-stone-700 dark:text-stone-200"
          }`}
          onClick={closeMobile}
        >
          Rooms
        </Link>
        <Link
          href="/services"
          className={`border-b border-stone-200/50 py-3 font-serif dark:border-stone-700/50 ${
            isServices ? "font-medium text-primary" : "text-stone-700 dark:text-stone-200"
          }`}
          onClick={closeMobile}
        >
          Services
        </Link>
        <Link
          href="/contact"
          className={`py-3 font-serif ${
            isContact ? "font-medium text-primary" : "text-stone-700 dark:text-stone-200"
          }`}
          onClick={closeMobile}
        >
          Contact
        </Link>
        {showAdmin && (
          <Link
            href="/admin"
            className="border-t border-stone-200/50 py-3 font-serif text-stone-700 dark:border-stone-700/50 dark:text-stone-200"
            onClick={closeMobile}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
