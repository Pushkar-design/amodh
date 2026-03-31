import Image from "next/image";
import Link from "next/link";
import { HotelAmodhHeader } from "@/components/HotelAmodhHeader";

const IMG_SPA =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAOcn8LBJ_eY7T4AVUbTyOxD_GspgFCkMFvHW5stHmEilJ0Pa1X8r6aEfxiigrNttG86EJf7hE9W1ZCb5hdLc_i8oFSYLC7u7la3NKQ8STyg5W76MOJY7LcfedhXD_P3b7qFw7Awam4naKwyIgMG9MhjWQYY6R9RwNv5ioIsQId_m2yYKGBB8LJMdhz-tHd0GSyfC58QEWF783LcC_qlERM-4C3WUPgEcz-bye373btPx6e7tRMFX6b9uN1hGach2YU6RlI_HYo-2o";

const IMG_DINING =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBGxCC8EGkPvQbtHwwBGfwN4vzlflOVlgeANfQR842gPSQjBJWXYLn1NArWQhVTtGbwL91i6s3ZRHSiKI5piL0NhQjV9pDkKvgZ0Z4Dm5eO2NSVUqwymyixl4zMTIMq8xki8Ckhzc-RPEinsAvFm0DXJ28IMbAVwunX4ht5IyYYb4f6W9XbQtXHRrxFnfNLmJlWXWqtfYIaQaTujb9TNimqsKLofqCXTSrLNlxTo4D92fRhC8BhaJ_cV1MEz9oiOgo2ffmCFisteGo";

const IMG_POOL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWL-a4k9iqWXEbQsDGS2xN4UXAHnhqcZJH81F2zt9w8qaP89abO2a8J6nCb4tvDK3zDW2HekDlU-pm7YnlXBlSfkbGLf0itbtfRxGV-p5nlEmU1r1oPR_i_uY5IYzXQ24C1QVuUc-s8g2ok42cDbjHy7MOuqf_SisGhtR7BVA_Eu6hQmATz3Bone2PcKyb-yZIaihTa9jrTE2iwJk3S1izOAlvhTR7nhJKWa3qqCAVWRaVGVJWPmr-mqtyXBeyg_RDq5FDamDWLwk";

export default function ServicesPage() {
  return (
    <>
      <HotelAmodhHeader />
      <main className="flex-1 bg-surface pb-24 pt-28 sm:pt-32">
        <header className="mx-auto mb-20 max-w-7xl px-6 text-center sm:mb-24 sm:px-10">
          <span className="mb-4 inline-block font-label text-[0.7rem] uppercase tracking-[0.3em] text-primary">
            Curated Experiences
          </span>
          <h1 className="font-headline text-4xl leading-tight tracking-tight text-on-surface sm:text-6xl md:text-7xl">
            Amenities &amp; Services
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-body text-lg font-light italic text-secondary">
            A sanctuary designed for restoration, where the boundaries between
            nature and luxury dissolve.
          </p>
        </header>

        <section className="mx-auto max-w-screen-2xl space-y-32 px-6 sm:space-y-40 sm:px-10">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="group relative overflow-hidden md:col-span-7">
              <Image
                src={IMG_SPA}
                alt="Spa setting"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
            <div className="z-10 bg-surface-container-highest p-10 shadow-sm sm:p-12 md:col-span-5 md:-ml-24 lg:p-16">
              <span className="mb-6 block font-label text-xs uppercase tracking-widest text-primary">
                Wellness
              </span>
              <h2 className="mb-6 font-headline text-4xl text-on-surface">
                The Earth Spa
              </h2>
              <p className="mb-8 font-body font-light leading-relaxed text-on-surface-variant">
                Holistic treatments rooted in ancient botanical wisdom.
                Rejuvenate your essence in our private forest pavilions.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 font-body font-medium text-primary"
              >
                Discover Rituals
                <span
                  className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="order-2 z-10 bg-surface-container p-10 shadow-sm sm:p-12 md:order-1 md:col-span-5 md:-mr-24 lg:p-16">
              <span className="mb-6 block font-label text-xs uppercase tracking-widest text-primary">
                Gastronomy
              </span>
              <h2 className="mb-6 font-headline text-4xl text-on-surface">
                Saffron &amp; Stone
              </h2>
              <p className="mb-8 font-body font-light leading-relaxed text-on-surface-variant">
                A farm-to-table journey celebrating seasonal harvests.
                Experience contemporary fine dining under a canopy of stars.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 font-body font-medium text-primary"
              >
                View the Menu
                <span
                  className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="order-1 overflow-hidden md:order-2 md:col-span-7">
              <Image
                src={IMG_DINING}
                alt="Fine dining"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
          </div>

          <div className="relative min-h-[380px] py-16 sm:min-h-[480px] sm:py-24">
            <div className="absolute inset-0 z-0 px-0 sm:px-10 md:px-20">
              <Image
                src={IMG_POOL}
                alt="Infinity pool"
                fill
                className="object-cover opacity-90"
                sizes="100vw"
              />
            </div>
            <div className="relative z-10 mx-auto mr-6 max-w-xl bg-surface/90 p-10 shadow-2xl backdrop-blur-md sm:mr-10 md:ml-auto md:mr-32 md:p-12">
              <span className="mb-6 block font-label text-xs uppercase tracking-widest text-primary">
                Leisure
              </span>
              <h2 className="mb-6 font-headline text-4xl text-on-surface">
                Azure Horizon
              </h2>
              <p className="mb-8 font-body font-light leading-relaxed text-on-surface-variant">
                Our heated infinity pool offers an uninterrupted gaze into the
                valley. A place where the sky meets the water.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-primary px-10 py-3 font-label text-sm tracking-widest text-on-primary"
              >
                PRIVATE LOUNGE
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col justify-center bg-surface-container-low p-10 sm:p-16 md:col-span-2">
              <span className="mb-6 block font-label text-xs uppercase tracking-widest text-primary">
                Service
              </span>
              <h2 className="mb-8 font-headline text-4xl leading-tight text-on-surface sm:text-5xl">
                Bespoke Concierge
              </h2>
              <p className="max-w-lg font-body text-xl font-light italic text-secondary">
                &ldquo;Your every desire, anticipated and curated with invisible
                precision.&rdquo;
              </p>
            </div>
            <div className="flex min-h-[320px] flex-col justify-between bg-primary-container p-10 text-on-primary-container sm:min-h-[400px] sm:p-12">
              <span className="material-symbols-outlined text-4xl" aria-hidden>
                concierge
              </span>
              <div>
                <h3 className="mb-4 font-headline text-2xl">
                  Tailored Journeys
                </h3>
                <p className="font-body text-sm font-light leading-relaxed opacity-90">
                  From private helicopter charters to clandestine mountain
                  picnics, our team crafts experiences that exist nowhere else.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
