import Link from "next/link";
import BubbleBackground from "@/components/home/BubbleBackground";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-start justify-center pt-36 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: "url('/images/hero/team-cleaning-room.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-white/50" />

      {/* Bubble background */}
      <div className="absolute inset-0 z-[1]">
        <BubbleBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
          <span className="text-brand-primary font-bold text-sm">
            Professional Cleaning Services
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 drop-shadow-md leading-tight mb-6">
          Wipe &amp; Swipe:
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
            Where Clean Meets Care
          </span>
        </h1>

        <p className="text-xl text-gray-700 font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform your space with our eco-friendly cleaning solutions. We bring
          the shine while you enjoy the time.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/book-now"
            className="group px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-full hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
          >
            Book Now
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

          <a
            href="#services"
            className="px-8 py-4 border-2 border-brand-primary text-brand-primary font-semibold rounded-full hover:bg-brand-primary/5 transition-all duration-300 flex items-center gap-2"
          >
            Our Services
          </a>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["J", "M", "S"].map((c, idx) => (
                <div
                  key={c}
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-bold"
                  style={{
                    background:
                      idx === 0
                        ? "linear-gradient(to bottom right, #296276, #266075)"
                        : idx === 1
                        ? "linear-gradient(to bottom right, #283955, #296276)"
                        : "linear-gradient(to bottom right, #266075, #283955)",
                  }}
                >
                  {c}
                </div>
              ))}
            </div>

            <div className="text-sm">
              <span className="font-bold text-gray-800">500+</span>{" "}
              <span className="text-gray-500">Happy Clients</span>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">★★★★★</div>
            <span className="text-sm text-gray-600 font-medium">5/5 Rating</span>
          </div>
        </div>
      </div>

      {/* Bottom wave cut */}
      <div className="absolute bottom-0 left-0 w-full leading-none z-10">
        <svg
          viewBox="0 0 1440 180"
          className="block w-full h-[90px] sm:h-[110px] md:h-[130px] lg:h-[150px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,128L48,133.3C96,139,192,149,288,144C384,139,480,117,576,106.7C672,96,768,96,864,106.7C960,117,1056,139,1152,144C1248,149,1344,139,1392,133.3L1440,128L1440,181L1392,181C1344,181,1248,181,1152,181C1056,181,960,181,864,181C768,181,672,181,576,181C480,181,384,181,288,181C192,181,96,181,48,181L0,181Z"
            fill="#f5f9fb"
          />
        </svg>
      </div>
    </section>
  );
}