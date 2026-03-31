import Image from "next/image";
import Link from "next/link";

const EXPERIENCE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBPIgcuX4mPWyhDUBqB2VvvSvGhSTrKywlYtz9ObPL3oSGHnRYWQDw1u3xPTLO3Gp9VomxwH5ij_2GiDZhdNsG89zi4sexq0CGir6POJKET8NN2oJr0UcJRpm65IUf0txXmPxM6feTjTGcE7jLaNx_KE0vd7jGHR3c33FzXr_H9j_rhZFI58YZ8cBVFYPR-x2DABHojvzCsXHvDmAhBIGdQIRJL3FdYdrlkXtl9kP7r9DraVWBXRA18q5iXT7NYDTlw4G8HH-baIH8";

export function ExperienceSection() {
  return (
    <section id="experience" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="relative">
          <div className="relative h-[400px] w-full overflow-hidden rounded-sm sm:h-[500px] md:h-[600px]">
            <Image
              src={EXPERIENCE_IMAGE}
              alt="Terrace view over the valley"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <div className="relative -mt-12 max-w-md bg-surface-container-highest p-10 shadow-2xl sm:-mt-16 sm:p-12 md:absolute md:-bottom-16 md:left-10 md:mt-0 md:p-16 lg:left-20">
            <span className="mb-4 block font-label text-[10px] uppercase tracking-widest text-primary">
              The Experience
            </span>
            <h3 className="mb-6 font-serif-display text-2xl italic text-on-surface sm:text-3xl">
              Awaken your senses in the valley of silence.
            </h3>
            <p className="mb-8 font-body text-sm leading-relaxed text-secondary">
              Every morning, the mist clears to reveal the rugged peaks of the
              Western Ghats. Our property is built into the hillside, ensuring
              every balcony offers an uninterrupted dialogue with nature.
            </p>
            <Link
              href="/#heritage"
              className="border-b border-primary/30 pb-1 font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:border-primary"
            >
              Discover the View
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
