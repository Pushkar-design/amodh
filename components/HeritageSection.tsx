import Image from "next/image";

const IMG_INTERIOR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCo3gYC0Gk06ObyOOIB45CfLcU5wjt-cmjNal3zv4YukrrdvD8tEB3s3Y-j-NlDkwcDRHH0pLNKhM0XNdQnnLXmu_1XRER5xlTOJYpc1q8xFPJUTfcwAvTL3n9F1tymtGD50TnJqrQYLRdmG9aQA-tmSseSj3f_2nePUQUFfr7DYg6CZZzOVGct2odCmTA_Be-XBxJ0FZRL-A8dY7E4BVvu5hjJeU1tYHEd-SDwSzR6S2X7ahbUFoFSS0Il8cu6UdhSGhgHTz0kHjk";

const IMG_DETAIL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuChBiitm0SASh0yI8d6WN3F3L8MZ7Ej75bUGGhYj-5-9rdnIJRnxXn0nj6i1_AHb2lfMcdnN7KOjMgLes7TdLKWNJfAdjQx67p_MvdZBakWFzWAazILekkwAEcG8RNqKUPdIAtX4J5dhzI-Mx4TYQQCxe0XOymybJStddS049mde52aoIcEhtwKySZp4KgCE98O2Ua1gBbuGPmklK7xMhExvlvyGRLJhX9c7BS-vsm9joYI16OauimVnQDfFNiKZRaCc757ZlZ2S8M";

export function HeritageSection() {
  return (
    <section
      id="heritage"
      className="mx-auto max-w-7xl overflow-hidden px-4 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28 lg:py-32"
    >
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-16 lg:gap-20">
        <div className="md:col-span-5">
          <span className="mb-4 block font-label text-xs uppercase tracking-[0.3em] text-primary">
            Our Heritage
          </span>
          <h2 className="mb-8 font-serif-display text-5xl leading-tight text-on-surface md:text-6xl lg:text-7xl">
            A Sanctuary carved in stone and light.
          </h2>
          <p className="mb-8 font-body text-lg leading-relaxed text-secondary">
            Hotel Amod is more than a destination; it is a curated silence.
            Located in the heart of the valley, we blend the raw textures of
            the earth with the precision of modern luxury. Every corner is
            designed to breathe.
          </p>
          <div className="mt-12 border-l-4 border-primary bg-surface-container-low p-10">
            <p className="font-serif text-xl italic leading-relaxed text-primary">
              &ldquo;To stay here is to remember what it feels like to be truly
              still. The architecture listens to the wind.&rdquo;
            </p>
            <span className="mt-4 block font-label text-[10px] uppercase tracking-widest text-secondary">
              — Architectural Digest
            </span>
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:items-stretch sm:gap-6">
            <div className="sm:col-span-7">
              <Image
                src={IMG_INTERIOR}
                alt="Minimalist suite interior"
                width={720}
                height={960}
                className="aspect-[3/4] w-full rounded-xl object-cover shadow-xl"
                sizes="(max-width: 640px) 100vw, 45vw"
              />
            </div>
            <div className="flex flex-col justify-center sm:col-span-5">
              <Image
                src={IMG_DETAIL}
                alt="Architectural detail"
                width={560}
                height={560}
                className="aspect-square w-full max-w-md rounded-xl object-cover shadow-xl sm:max-w-none"
                sizes="(max-width: 640px) 100vw, 38vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
