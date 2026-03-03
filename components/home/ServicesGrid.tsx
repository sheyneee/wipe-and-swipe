import Link from "next/link";
import { SERVICES } from "@/lib/data/services";

export default function ServicesGrid() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 font-semibold rounded-full text-sm mb-4">
            What We Offer
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Cleaning Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            From homes to offices, we’ve got every corner covered with our comprehensive cleaning solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s) => (
            <article
              key={s.value}
              className="service-card bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              {/* Top */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #296276 0%, #266075 100%)",
                  boxShadow: "0 10px 20px rgba(41, 98, 118, 0.3)",
                }}
              >
                <span className="text-2xl text-white" aria-hidden>
                  {s.emoji}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-brand-primary font-semibold text-lg mb-4">{s.price}</p>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{s.description}</p>

              {/* Middle (fills space) */}
              <ul className="space-y-2 text-gray-600 text-sm flex-1">
                {s.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-primary font-bold">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Bottom (fixed to bottom of card) */}
              <Link
                href={`/services/${s.value}`}
                className="mt-6 block w-full text-center py-3 bg-[color:rgba(41,98,118,0.10)] text-[color:var(--brand-primary,#296276)] font-semibold rounded-lg transition-all duration-300 hover:bg-[color:var(--brand-primary,#296276)] hover:text-white"
              >
                View Details
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}