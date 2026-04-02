import Link from "next/link";

type HeroProps = {
  /** Default `/` home; use `/preview-amod#rooms` on preview route */
  roomsHref?: string;
};

const HERO_POSTER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBaEFctgVMCMwrnKdN7ctVMYNxMxobqFMTCnWMIpJBg7R4K8QIlEIG4_P1itqSMjLd9PVLlsGZtoZFiVMD8_KzqvfRGyTJN1JyfKuP83R6E8wXMUTfdZSvVhCcy9dKJjBINRIWrC1PQ322KCyFv6AEtg798JiQ_uHOgoNKB2tNLPCvFKFwtfSg3EX3HlI_oa4pfBZpmbnOWvNfcnnFK55f93en02vEqXXfCmsJPVOoT-s7nv4Qs_24vyYa9KSkh-QcDSDzEbC6ushM";

export function Hero({ roomsHref = "/#rooms" }: HeroProps) {
  const videoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] min-h-screen w-full scroll-mt-28 items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        {videoSrc ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_POSTER}
            aria-hidden
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_POSTER})` }}
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-b from-foreground/25 via-foreground/20 to-foreground/35"
          aria-hidden
        />
      </div>
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <p className="animate-fade-rise mb-8 font-label text-[10px] font-medium uppercase tracking-[0.42em] text-white/85">
          Amod
        </p>
        <h1 className="font-serif-display text-4xl font-normal leading-[1.12] tracking-tight text-white sm:text-6xl md:text-7xl">
          Where{" "}
          <span className="text-white/72">joy lingers</span> in the{" "}
          <span className="text-white/72">air.</span>
        </h1>
        <p className="animate-fade-rise-delayed mx-auto mt-8 max-w-md font-body text-base font-normal leading-relaxed text-white/88 sm:text-lg">
          A quiet invitation — warmth, stillness, and the gentle pull of scent
          and light. Slow luxury, felt rather than announced.
        </p>
        <div className="animate-fade-rise-delayed mt-12 flex justify-center">
          <Link
            href={roomsHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-white/10 px-10 py-3 font-label text-xs font-medium uppercase tracking-[0.22em] text-white backdrop-blur-md transition-transform duration-500 ease-out hover:scale-[1.02] hover:bg-white/16 motion-reduce:transform-none"
          >
            Book Your Stay
          </Link>
        </div>
      </div>
    </section>
  );
}
