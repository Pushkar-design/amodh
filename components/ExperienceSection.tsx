import Image from "next/image";

const EXPERIENCE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBPIgcuX4mPWyhDUBqB2VvvSvGhSTrKywlYtz9ObPL3oSGHnRYWQDw1u3xPTLO3Gp9VomxwH5ij_2GiDZhdNsG89zi4sexq0CGir6POJKET8NN2oJr0UcJRpm65IUf0txXmPxM6feTjTGcE7jLaNx_KE0vd7jGHR3c33FzXr_H9j_rhZFI58YZ8cBVFYPR-x2DABHojvzCsXHvDmAhBIGdQIRJL3FdYdrlkXtl9kP7r9DraVWBXRA18q5iXT7NYDTlw4G8HH-baIH8";

export function ExperienceSection() {
  return (
    <section className="bg-surface px-4 py-16 sm:px-8 sm:py-24 md:px-10 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          <div className="relative min-h-[280px] h-[42vh] w-full overflow-hidden rounded-lg sm:min-h-[360px] sm:h-[48vh] sm:rounded-xl md:h-[min(600px,56vh)] md:rounded-sm lg:h-[600px]">
            <Image
              src={EXPERIENCE_IMAGE}
              alt="Terrace view over the valley"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <div className="relative z-10 -mt-8 mx-auto max-w-md bg-surface-container-highest p-6 shadow-2xl sm:-mt-12 sm:p-10 md:absolute md:-bottom-12 md:left-6 md:mx-0 md:mt-0 md:max-w-md md:p-12 lg:-bottom-16 lg:left-10 lg:p-16 xl:left-20">
            <span className="mb-3 block font-label text-[10px] uppercase tracking-widest text-primary sm:mb-4">
              The view
            </span>
            <h3 className="mb-4 text-balance font-serif-display text-2xl italic leading-snug text-on-surface sm:mb-6 sm:text-3xl md:text-4xl">
              Awaken your senses in the valley of silence.
            </h3>
            <p className="font-body text-sm leading-relaxed text-secondary sm:text-[15px]">
              Every morning, the mist clears to reveal the rugged peaks of the
              Western Ghats. Our property is built into the hillside, ensuring
              every balcony offers an uninterrupted dialogue with nature.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
