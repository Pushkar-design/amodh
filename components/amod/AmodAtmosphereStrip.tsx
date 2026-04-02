/**
 * Visual bridge between legacy page chrome and the Amod booking experience.
 * Makes the redesign obvious without changing backend behavior.
 */
export function AmodAtmosphereStrip() {
  return (
    <section
      className="relative overflow-hidden border-y border-[#e3dcd2] bg-[#faf7f2] px-6 py-14 sm:py-20"
      aria-labelledby="amod-atmosphere-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#c4a574]/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#8a9a5b]/12 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.4em] text-[#7a6b5a]">
          Amod — sensory stay
        </p>
        <h2
          id="amod-atmosphere-heading"
          className="mt-5 font-serif-display text-2xl font-normal italic leading-snug text-[#2a2620] sm:text-3xl md:text-[2rem]"
        >
          Calm light, natural texture, and a human pace.
        </h2>
        <p className="mx-auto mt-6 max-w-md font-body text-sm leading-relaxed text-[#5a5349] sm:text-base">
          Scroll down to choose rooms or the entire villa, then send one
          WhatsApp — no checkout, no clutter. Prices below are shown in{" "}
          <span className="whitespace-nowrap font-medium text-[#3d4720]">
            Indian rupees (₹)
          </span>
          .
        </p>
        <div
          className="mx-auto mt-10 flex items-center justify-center gap-4 text-[#b5a892]"
          aria-hidden
        >
          <span className="h-px w-10 bg-current sm:w-14" />
          <span className="font-serif-display text-xl leading-none">✦</span>
          <span className="h-px w-10 bg-current sm:w-14" />
        </div>
      </div>
    </section>
  );
}
