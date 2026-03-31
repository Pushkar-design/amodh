import Link from "next/link";
import { HotelAmodhHeader } from "@/components/HotelAmodhHeader";

const ADDRESS = "12 Hillside Lane, Quiet Valley, 00000";
const PHONE = "+1 (555) 010-2030";
const PHONE_TEL = "+15550102030";
const EMAIL = "stay@amodh.hotel";
const WHATSAPP_DISPLAY = "+1 555 123 4567";
const WHATSAPP_LINK = "https://wa.me/15551234567";

export default function ContactPage() {
  return (
    <>
      <HotelAmodhHeader />
      <main className="flex-1 bg-surface px-6 pt-28 pb-12 sm:px-10 sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-3xl">
          <span className="mb-3 block font-label text-xs uppercase tracking-[0.25em] text-primary">
            Reach us
          </span>
          <h1 className="font-headline text-4xl text-on-surface sm:text-5xl md:text-6xl">
            Contact
          </h1>
          <p className="mt-4 font-body text-on-surface-variant">
            We respond quickly on WhatsApp. For other requests, call or write.
          </p>

          <address className="mt-10 not-italic font-body text-on-surface">
            <p className="text-lg font-medium">{ADDRESS}</p>
          </address>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-8 py-3 font-label text-sm font-medium text-on-primary transition-opacity hover:opacity-95"
            >
              Call
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-outline-variant px-8 py-3 font-body text-on-surface transition-colors hover:border-primary"
            >
              Email
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-outline-variant px-8 py-3 font-body text-on-surface transition-colors hover:border-primary"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-xl border border-outline-variant/40 shadow-sm">
          <iframe
            title="Amodh location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184132576894!2d-73.98811768459398!3d40.75889597932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-[280px] w-full sm:min-h-[400px]"
          />
        </div>

        <div className="mx-auto mt-10 flex justify-center pb-8">
          <Link
            href="/"
            className="font-body text-primary underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </main>
    </>
  );
}
