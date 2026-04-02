"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function showAdminNavLink(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.NEXT_PUBLIC_SHOW_ADMIN_LINK === "true";
}

type MarketingNavKey = "home" | "rooms" | "services" | "contact";

function docOffsetTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
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
      className={cn(
        "border-b-2 border-transparent pb-0.5 font-label text-sm font-medium tracking-tight transition-colors duration-300",
        isActive
          ? "border-primary/60 text-primary"
          : "text-muted-foreground hover:border-border/40 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function HotelAmodhHeader() {
  const pathname = usePathname();
  const showAdmin = showAdminNavLink();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMarketing, setActiveMarketing] =
    useState<MarketingNavKey>("home");

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const marketingHome =
    pathname === "/" || pathname === "/preview-amod";
  const basePath = pathname === "/preview-amod" ? "/preview-amod" : "/";
  const homeHref = basePath === "/" ? "/" : basePath;
  const roomsHref = `${basePath}#rooms`;
  const experiencesHref = `${basePath}#experiences`;
  const contactHref = `${basePath}#contact`;

  const isServices = pathname === "/services";
  const isContact = pathname === "/contact";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!marketingHome) return;

    const OFFSET = 120;

    const compute = () => {
      const y = window.scrollY + OFFSET;
      const contact = document.getElementById("contact");
      const experiences = document.getElementById("experiences");
      const rooms = document.getElementById("rooms");

      const cTop = contact ? docOffsetTop(contact) : Infinity;
      const eTop = experiences ? docOffsetTop(experiences) : Infinity;
      const rTop = rooms ? docOffsetTop(rooms) : Infinity;

      if (y >= cTop - 2) setActiveMarketing("contact");
      else if (y >= eTop - 2) setActiveMarketing("services");
      else if (y >= rTop - 2) setActiveMarketing("rooms");
      else setActiveMarketing("home");
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [marketingHome, pathname]);

  const isHomeNavActive =
    marketingHome && activeMarketing === "home";
  const isRoomsNavActive =
    marketingHome && activeMarketing === "rooms";
  const isServicesNavActive =
    (marketingHome && activeMarketing === "services") || isServices;
  const isContactNavActive =
    (marketingHome && activeMarketing === "contact") || isContact;

  /** On standalone pages, deep-link to home sections (full site is one scroll on `/`). */
  const experiencesNavHref = marketingHome
    ? experiencesHref
    : pathname === "/services"
      ? "/services"
      : "/#experiences";
  /** Contact content lives in #contact on the marketing home; never open a separate page. */
  const contactNavHref = marketingHome ? contactHref : "/#contact";
  const roomsNavHref = marketingHome ? roomsHref : "/#rooms";
  const homeNavHref = homeHref;

  return (
    <nav
      className="glass-nav fixed top-0 left-0 right-0 z-50 w-full"
      data-scrolled={scrolled ? "true" : "false"}
      aria-label="Primary"
    >
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3.5 sm:flex-nowrap sm:gap-y-0 sm:px-6 sm:py-4 md:px-8 lg:px-10 lg:py-5">
        <Link
          href={homeHref}
          className="min-w-0 shrink-0 font-serif-display text-lg tracking-tight text-foreground sm:text-xl md:text-2xl"
          onClick={closeMobile}
        >
          Amod
          <sup className="ml-0.5 text-[0.55em] font-normal opacity-80">®</sup>
        </Link>

        <div className="hidden items-center gap-6 lg:gap-8 xl:gap-10 md:flex">
          <HotelNavLink href={homeNavHref} isActive={isHomeNavActive}>
            Home
          </HotelNavLink>
          <HotelNavLink href={roomsNavHref} isActive={isRoomsNavActive}>
            Rooms
          </HotelNavLink>
          <HotelNavLink
            href={experiencesNavHref}
            isActive={isServicesNavActive}
          >
            Services
          </HotelNavLink>
          <HotelNavLink href={contactNavHref} isActive={isContactNavActive}>
            Contact
          </HotelNavLink>
          {showAdmin && (
            <Link
              href="/admin"
              className="font-label text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 md:ml-0">
          <Link
            href={roomsNavHref}
            className="inline-flex max-w-[min(100%,11rem)] items-center justify-center truncate rounded-full border border-primary/25 bg-primary/90 px-3.5 py-2 font-label text-[10px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-300 hover:scale-[1.02] motion-reduce:transform-none sm:max-w-none sm:px-6 sm:py-2.5 sm:text-xs sm:tracking-[0.2em] md:px-7 md:py-3"
            onClick={closeMobile}
          >
            Book your stay
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-foreground hover:bg-muted/80 md:hidden"
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
        className={`${mobileOpen ? "flex" : "hidden"} flex-col gap-0 border-t border-border/60 bg-background/95 px-6 py-4 backdrop-blur-md md:hidden`}
        role="dialog"
        aria-label="Site menu"
      >
        <Link
          href={homeNavHref}
          className={`border-b border-border/50 py-3 font-label text-sm ${
            isHomeNavActive ? "font-medium text-primary" : "text-foreground"
          }`}
          onClick={closeMobile}
        >
          Home
        </Link>
        <Link
          href={roomsNavHref}
          className={`border-b border-border/50 py-3 font-label text-sm ${
            isRoomsNavActive ? "font-medium text-primary" : "text-foreground"
          }`}
          onClick={closeMobile}
        >
          Rooms
        </Link>
        <Link
          href={experiencesNavHref}
          className={`border-b border-border/50 py-3 font-label text-sm ${
            isServicesNavActive
              ? "font-medium text-primary"
              : "text-foreground"
          }`}
          onClick={closeMobile}
        >
          Services
        </Link>
        <Link
          href={contactNavHref}
          className={`py-3 font-label text-sm ${
            isContactNavActive ? "font-medium text-primary" : "text-foreground"
          }`}
          onClick={closeMobile}
        >
          Contact
        </Link>
        {showAdmin && (
          <Link
            href="/admin"
            className="border-t border-border/50 py-3 font-label text-sm text-foreground"
            onClick={closeMobile}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
