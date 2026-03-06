"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    src: "/images/hero/team-cleaning-room.jpg",
    alt: "Professional cleaners preparing a room",
    title: "Trained Cleaning Team",
    subtitle: "Professional staff delivering careful and consistent cleaning.",
  },
  {
    src: "/images/hero/bedroom-cleaning.jpg",
    alt: "Cleaning staff sanitizing a bedroom",
    title: "Detailed Room Care",
    subtitle: "From surfaces to linens, every detail is handled with care.",
  },
  {
    src: "/images/hero/bathroom-cleaning.jpg",
    alt: "Cleaner disinfecting a bathroom",
    title: "Sanitized Spaces",
    subtitle: "High-standard cleaning for healthier and fresher environments.",
  },
  {
    src: "/images/hero/hotel-housekeeping.jpg",
    alt: "Housekeeping team servicing a hotel room",
    title: "Reliable Service",
    subtitle: "Efficient cleaning solutions for homes, rentals, and businesses.",
  },
];

export default function HeroImageCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => setCurrent(index);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative w-full max-w-2xl mx-auto animate-slide-right"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-sm border border-white/60 shadow-2xl shadow-brand-primary/10">
        <div className="relative aspect-[4/5] sm:aspect-[16/14] lg:aspect-[4/5] xl:aspect-[16/15] w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === current
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 translate-x-6 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#283955]/85 via-[#283955]/20 to-transparent" />

              <div className="absolute left-0 right-0 bottom-0 p-5 sm:p-6 lg:p-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Trusted Professional Team
                </div>

                <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                  {slide.title}
                </h3>

                <p className="mt-2 text-white/85 text-sm sm:text-base leading-relaxed max-w-xl">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-brand-primary shadow-lg backdrop-blur-md flex items-center justify-center transition"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-brand-primary shadow-lg backdrop-blur-md flex items-center justify-center transition"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src + index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-brand-primary"
                : "w-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}