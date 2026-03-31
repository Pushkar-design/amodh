"use client";

import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBaEFctgVMCMwrnKdN7ctVMYNxMxobqFMTCnWMIpJBg7R4K8QIlEIG4_P1itqSMjLd9PVLlsGZtoZFiVMD8_KzqvfRGyTJN1JyfKuP83R6E8wXMUTfdZSvVhCcy9dKJjBINRIWrC1PQ322KCyFv6AEtg798JiQ_uHOgoNKB2tNLPCvFKFwtfSg3EX3HlI_oa4pfBZpmbnOWvNfcnnFK55f93en02vEqXXfCmsJPVOoT-s7nv4Qs_24vyYa9KSkh-QcDSDzEbC6ushM";

export function Hero() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Hotel Amodh exterior at twilight"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-on-surface/30" aria-hidden />
      </div>
      <div className="relative z-10 px-4 text-center">
        <span className="mb-6 inline-block animate-[fadeIn_1s_ease-out_forwards] font-label text-xs uppercase tracking-[0.4em] text-white/90 opacity-0">
          Est. 1924
        </span>
        <h1 className="mb-8 font-serif-display text-5xl italic leading-tight tracking-tight text-white md:text-8xl">
          Quiet Luxury. <br />
          <span className="not-italic">Timeless Soul.</span>
        </h1>
        <div className="mt-12 flex flex-col items-center justify-center gap-6 md:flex-row">
          <Link
            href="/#rooms"
            className="rounded-md bg-white px-12 py-4 text-center font-label text-xs font-bold uppercase tracking-widest text-on-surface transition-all duration-300 hover:bg-surface-container-lowest"
          >
            Explore Rooms
          </Link>
          <Link
            href="/services"
            className="rounded-md border border-white/40 px-12 py-4 text-center font-label text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
          >
            The Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
