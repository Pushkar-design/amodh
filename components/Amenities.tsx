import Image from "next/image";

const IMG_DINING =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA_HGNE5gsmetI_I68QiqqIHPUX2l0UOohu9_JrzlPNCbQ0Okbafv-PmMU21EDhe_MaQdFeRnNUDhj46x14dqJokegw0OnOTSlBzwGzRmfvMKx7_wOjbVNAQI-cpjjO4Bos4oiXiVFy49dc-kcZLH4L3G8tD4W4wG-ZMR82H2J2ADPegdI9kOS9SKbkEQZkC-0qXhcn59VFv-K_eXac3PpsYiZU-MJxBw95myqNYSnJ8qqkNfNEVta27dvQRRvG-BHDhjUZuMVfbtQ";

const IMG_POOL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDmdGyC6k4f3hEqlLm4I1pwnfqM0KqGQx5w9w_VfJwiZBQiAH0bkSMw5PNeNVH_5HQPYSsm_QL1KwNP-S4FSbSwfncUDdZoSPFQfOwehXA9C036V-SxnI3u4P0LRdxkiQa77JvqM10HifUeblaHTchm9LjNxAgeDOb6KWGVHf3NI25XJPYE8SDnGKiCnkzvktU6VBANym3Tvdq5_cLHW9_iRmnKp8NBKGaZBFf-YQO4xXrCxFN0W6AgHsshyx8LZmoc8MKeNf066E4";

const IMG_SPA =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAE-HsrXa6ne-AuOyOVCCRW0TO1iJhaWIaITkLjVv-rh8NWjz_vnlpdcNVE0jw0nkP0I13poX9WDZwWW0nR_iMtg4yj_7Y8CgO9lD8XXpOCDJcypyz3qiKVWVdJG4VfkjEQKoUEPZh6heQyL7x_477X6zrvcA43USvn7RXuxAeK_rhlp7c38Jow0ATQRAeuX1e-MjJBeaLn5bnJqjpHGfa9tUGoBGKfxepXUCIfwEMeADzdChMZMJakF6LPlSK04KD7vqp3Bt53lD0";

export function Amenities() {
  return (
    <section
      id="services"
      className="scroll-mt-28 bg-surface-container-low px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center sm:mb-20">
          <span className="mb-4 block font-label text-xs uppercase tracking-[0.4em] text-primary">
            Curated Services
          </span>
          <h2 className="font-serif-display text-4xl text-on-surface sm:text-5xl">
            The Art of Living Well
          </h2>
        </div>

        <div className="grid h-auto grid-cols-1 gap-6 md:h-[800px] md:grid-cols-4 md:grid-rows-2">
          <div className="group relative overflow-hidden rounded-xl bg-on-surface md:col-span-2 md:row-span-2">
            <Image
              src={IMG_DINING}
              alt="Fine dining"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-on-surface/80 to-transparent p-10">
              <span className="mb-2 block font-label text-[10px] uppercase tracking-widest text-primary-fixed">
                Cuisine
              </span>
              <h3 className="mb-4 font-serif-display text-3xl text-white">
                Fine Dining
              </h3>
              <p className="max-w-xs font-body text-sm text-stone-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                Seasonal ingredients sourced from our private gardens,
                prepared with ancestral techniques.
              </p>
            </div>
          </div>

          <div className="group relative min-h-[240px] overflow-hidden rounded-xl bg-on-surface md:col-span-2 md:row-span-1 md:min-h-0">
            <Image
              src={IMG_POOL}
              alt="Infinity pool"
              fill
              className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-on-surface/60 to-transparent p-8">
              <h3 className="mb-2 font-serif-display text-2xl text-white">
                Infinity Pool
              </h3>
              <span
                className="material-symbols-outlined text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              >
                pool
              </span>
            </div>
          </div>

          <div className="group relative min-h-[200px] overflow-hidden rounded-xl bg-on-surface md:col-span-1 md:min-h-0">
            <Image
              src={IMG_SPA}
              alt="Spa"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-on-surface/60 to-transparent p-6">
              <h3 className="font-serif-display text-xl text-white">
                The Spa
              </h3>
            </div>
          </div>

          <div className="rounded-xl bg-primary md:col-span-1">
            <div className="flex h-full min-h-[200px] flex-col justify-between p-8 text-on-primary md:min-h-0">
              <span className="material-symbols-outlined text-4xl" aria-hidden>
                doorbell
              </span>
              <div>
                <h3 className="mb-2 font-serif-display text-xl">
                  24/7 Concierge
                </h3>
                <p className="font-body text-xs leading-relaxed opacity-80">
                  Personalized itineraries curated by our local specialists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
