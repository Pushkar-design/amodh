"use client";

import { useMemo } from "react";
import { useAmodStay } from "@/components/amod/amod-stay-context";
import {
  CONTACT_ADDRESS,
  CONTACT_MAP_EMBED_URL,
} from "@/lib/contact-info";
import { resolvePublicContact } from "@/lib/contactFromSettings";

export function HomeContactSection() {
  const { hotelSettings } = useAmodStay();

  const contact = useMemo(
    () => resolvePublicContact(hotelSettings),
    [hotelSettings]
  );

  return (
    <section
      id="contact"
      className="scroll-mt-28 border-y border-[#e3dcd2] bg-[#faf7f2] px-4 py-14 sm:px-8 sm:py-20 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-3 block font-label text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6b6348]">
          Reach us
        </span>
        <h2 className="text-balance font-serif-display text-4xl font-normal leading-tight tracking-tight text-[#252218] sm:text-5xl md:text-6xl lg:text-7xl">
          Contact
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty font-body text-base leading-relaxed text-[#5c554a] sm:text-lg">
          We respond quickly on WhatsApp. For other requests, call or write.
        </p>

        <address className="mt-8 not-italic sm:mt-10">
          <p className="text-balance font-body text-base font-medium text-[#252218] sm:text-lg">
            {CONTACT_ADDRESS}
          </p>
        </address>

        <div className="mt-8 flex w-full max-w-xl flex-col items-stretch justify-center gap-3 sm:mx-auto sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          <a
            href={contact.telHref}
            className="inline-flex min-h-12 w-full min-w-0 items-center justify-center rounded-full border border-primary/30 bg-primary px-6 py-3 font-label text-[10px] font-medium uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-95 sm:w-auto sm:px-8 sm:text-xs"
          >
            Call {contact.phoneButtonLabel}
          </a>
          <a
            href={contact.mailtoHref}
            className="inline-flex min-h-12 w-full min-w-0 items-center justify-center rounded-full border border-[#e3dcd2] bg-background/80 px-6 py-3 font-body text-sm text-[#252218] transition-colors hover:border-[#8a7a62] sm:w-auto sm:px-8"
          >
            {contact.emailLabel}
          </a>
          <a
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full min-w-0 items-center justify-center rounded-full border border-[#e3dcd2] bg-background/80 px-6 py-3 font-body text-sm text-[#252218] transition-colors hover:border-[#8a7a62] sm:w-auto sm:px-8"
          >
            {contact.whatsappButtonLabel}
          </a>
        </div>
      </div>

      <div
        id="contact-map"
        className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-[#e3dcd2] bg-background shadow-sm sm:mt-14"
      >
        <iframe
          title="Amod location"
          src={CONTACT_MAP_EMBED_URL}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="min-h-[220px] w-full sm:min-h-[320px] md:min-h-[400px]"
        />
      </div>
    </section>
  );
}
