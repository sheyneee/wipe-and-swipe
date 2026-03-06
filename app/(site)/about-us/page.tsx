// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About . Wipe & Swipe",
  description: "About Wipe & Swipe Cleaning Services",
};

const BRAND = {
  primary: "#296276",
  secondary: "#283955",
  accent: "#266075",
  white: "#ffffff",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold hover:opacity-80"
            style={{ color: BRAND.primary }}
          >
            <span aria-hidden>←</span>
            Back to Home
          </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            About Wipe &amp; Swipe
          </h1>
          <p className="text-xl text-gray-600">
            Dedicated to transforming spaces and building lasting relationships with our community.
          </p>
        </div>

        {/* Main Story */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>

          <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
            <p>
              Wipe &amp; Swipe Cleaning Services Ltd was proudly established in 2024 by husband and
              wife team, Joyce Daphne Martinez and Reineer Kien Martinez.
            </p>
            <p>
              Joyce&apos;s journey in professional cleaning began in 2020 in Wellington, where she worked
              as a housekeeper for ambassadorial residences. That experience shaped her strong attention
              to detail, high standards of presentation, and commitment to excellence.
            </p>
            <p>
              After relocating to Whanganui in 2024, Joyce and Reineer decided to build something of
              their own, a family-run business grounded in trust, reliability, and quality workmanship.
            </p>
            <p>
              Today, Wipe &amp; Swipe Cleaning Services Ltd includes trained and committed team members who
              share the same values and work ethic. Joyce and Reineer remain personally involved to ensure
              every client receives consistent, high-standard results.
            </p>
            <p>
              As a family-owned company, we understand how important a clean, healthy, and welcoming environment is.
              We treat every space with care and respect, delivering not just cleanliness, but peace of mind.
            </p>

            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-brand-primary)] to-[color:var(--color-brand-accent)] italic pt-4">
              At Wipe &amp; Swipe, we don&apos;t just clean, we care.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-[color:var(--color-brand-primary)]/10 to-[color:var(--color-brand-accent)]/10 rounded-3xl p-8 border-2 border-[color:var(--color-brand-primary)]/20">
            <h3 className="text-2xl font-bold text-[color:var(--color-brand-primary)] mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To provide professional, reliable, and high-standard cleaning services that give our clients more time,
              less stress, and complete peace of mind.
            </p>
            <p className="text-gray-700 leading-relaxed italic">
              We don&apos;t just clean surfaces, we create fresh, healthy spaces you can feel proud of.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[color:var(--color-brand-secondary)]/10 to-[color:var(--color-brand-primary)]/10 rounded-3xl p-8 border-2 border-[color:var(--color-brand-secondary)]/20">
            <h3 className="text-2xl font-bold text-[color:var(--color-brand-secondary)] mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To become Whanganui&apos;s go-to cleaning company, trusted by families, businesses, schools, and
              property managers for consistent quality and dependable service.
            </p>
            <p className="text-gray-700 leading-relaxed italic">
              We aim to raise the standard of cleaning in our community.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Core Values</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Reliability First",
                desc: "We show up on time. We communicate clearly. We deliver what we promise.",
              },
              {
                title: "Detail-Driven Results",
                desc: "We focus on the small details that make a big difference.",
              },
              {
                title: "Professional Standards",
                desc: "With years of hands-on experience, we clean with structure, systems, and care.",
              },
              {
                title: "Respect for Your Space",
                desc: "Your home or business is treated with the highest level of care and professionalism.",
              },
              {
                title: "Long-Term Relationships",
                desc: "We don’t aim for one-time jobs, we build ongoing client relationships.",
              },
            ].map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="w-12 h-12 bg-[color:var(--color-brand-primary)]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-[color:var(--color-brand-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{v.title}</h4>
                  <p className="text-gray-600">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-r from-[color:var(--color-brand-primary)] via-[color:var(--color-brand-accent)] to-[color:var(--color-brand-secondary)] rounded-3xl p-8 md:p-12 text-white mb-12">
          <h2 className="text-3xl font-bold mb-8">Why Whanganui Chooses Wipe &amp; Swipe</h2>
          <p className="text-xl font-semibold mb-8 opacity-90">Because we care more.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Locally Owned & Family-Run",
                desc: "You deal directly with the founders, not a call centre or franchise.",
              },
              {
                title: "Proven Experience Since 2020",
                desc: "Professional cleaning background with high-standard residential experience.",
              },
              {
                title: "Consistent, High-Quality Results",
                desc: "We maintain strict cleaning standards across every service.",
              },
              {
                title: "Flexible Services That Fit Your Needs",
                desc: "Weekly, fortnightly, commercial, Airbnb, end-of-tenancy, post-build, we tailor it to you.",
              },
              {
                title: "Growing, Trained Team",
                desc: "We carefully train our staff to meet our standards before they represent our brand.",
              },
              {
                title: "Clear Pricing & Honest Communication",
                desc: "No hidden surprises. Just straightforward, reliable service.",
              },
            ].map((x) => (
              <div key={x.title} className="flex items-start gap-3">
                <span className="text-2xl font-bold">✔</span>
                <div>
                  <h4 className="font-bold text-lg mb-1">{x.title}</h4>
                  <p className="opacity-90">{x.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to experience the Wipe &amp; Swipe difference?
          </h3>

          <Link
            href="/book-now"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[color:var(--color-brand-primary)] to-[color:var(--color-brand-accent)] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[color:var(--color-brand-primary)]/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            Book Your Free Quote Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </section>
      </div>
    </main>
  );
}