import Link from "next/link";
import BubbleBackground from "@/components/home/BubbleBackground";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <BubbleBackground />

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
            <span className="text-brand-primary font-medium text-sm">Professional Cleaning Services</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight mb-6">
            Wipe & Swipe:
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
                We Clean. You Relax.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
            Transform your space with our eco-friendly cleaning solutions. We bring the shine while you enjoy the time.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/book-now"
              className="group px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-full hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
            >
              Book Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <a
              href="#services"
              className="px-8 py-4 border-2 border-brand-primary text-brand-primary font-semibold rounded-full hover:bg-brand-primary/5 transition-all duration-300 flex items-center gap-2"
            >
              Our Services
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-8">
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

        <div className="relative animate-slide-right hidden lg:block" style={{ animationDelay: "0.3s" }}>
          <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
            <circle cx="200" cy="200" r="180" fill="url(#heroGradient)" opacity="0.3" />
            <path d="M200 60 L320 140 L320 320 L80 320 L80 140 Z" fill="white" stroke="#296276" strokeWidth="3" />
            <path d="M200 60 L80 140 L320 140 Z" fill="#296276" />
            <rect x="120" y="180" width="60" height="60" rx="4" fill="#ccfbf1" stroke="#296276" strokeWidth="2" />
            <line x1="150" y1="180" x2="150" y2="240" stroke="#296276" strokeWidth="2" />
            <line x1="120" y1="210" x2="180" y2="210" stroke="#296276" strokeWidth="2" />
            <rect x="220" y="200" width="60" height="120" rx="4" fill="#296276" />
            <circle cx="268" cy="265" r="5" fill="#266075" />
            <g className="animate-sparkle">
              <path d="M100 100 L105 110 L115 115 L105 120 L100 130 L95 120 L85 115 L95 110 Z" fill="#266075" />
            </g>
            <g className="animate-sparkle" style={{ animationDelay: "0.5s" }}>
              <path d="M300 80 L303 87 L310 90 L303 93 L300 100 L297 93 L290 90 L297 87 Z" fill="#296276" />
            </g>
            <g className="animate-sparkle" style={{ animationDelay: "1s" }}>
              <path d="M340 180 L343 187 L350 190 L343 193 L340 200 L337 193 L330 190 L337 187 Z" fill="#266075" />
            </g>
            <circle cx="60" cy="250" r="20" fill="#fcd34d" />
            <rect x="45" y="270" width="30" height="50" rx="10" fill="#296276" />
            <line x1="75" y1="290" x2="100" y2="270" stroke="#283955" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="270" x2="120" y2="340" stroke="#6b7280" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="120" cy="345" rx="20" ry="8" fill="#9ca3af" />
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#296276" />
                <stop offset="100%" stopColor="#266075" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}