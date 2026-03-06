import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/data/services";
import BackButton from "@/components/ui/BackButton";

type PageProps = {
  params: Promise<{ value: string }>;
};

export default async function ServiceDetailPage({ params }: PageProps) {
  const { value } = await params;

  const service = SERVICES.find((s) => s.value === value);
  if (!service) return notFound();

  return (
    <section className="pt-24 pb-12 px-6 bg-gradient-to-b from-white to-teal-50">
      {/* WIDENED WRAPPER */}
      <div className="max-w-6xl mx-auto">

        <BackButton />

        {/* HEADER */}
        <div className="mb-12">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
            style={{ background: "linear-gradient(135deg, #296276 0%, #283955 100%)" }}
          >
            <span className="text-3xl" aria-hidden="true">
              {service.emoji}
            </span>
          </div>

          <h1 className="font-[var(--font-playfair)] text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            {service.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">{service.description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-teal-100 px-4 py-3 rounded-full">
              <span className="font-bold text-[color:var(--brand-primary,#296276)]">{service.price}</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-100 px-4 py-3 rounded-full">
              <span className="font-semibold text-[color:var(--brand-primary,#296276)]">Flexible Scheduling</span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">What&apos;s Included</h2>

              <div className="space-y-4">
                {service.bullets.map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{item}</h4>
                      <p className="text-gray-600">Included in this service.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[color:rgba(41,98,118,0.10)] to-[color:rgba(40,57,85,0.10)] rounded-3xl p-8 border-2 border-[color:rgba(41,98,118,0.20)]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Choose {service.title}?</h3>

              <ul className="space-y-3 text-gray-700">
                {service.whyChoose.map((w) => (
                  <li key={w} className="flex items-start gap-3">
                    <span className="text-teal-600 font-bold mt-1">✓</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* STICKY CTA */}
          <aside className="bg-white rounded-3xl p-8 shadow-lg sticky top-24 h-fit">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Ready to Book?</h3>

            <div className="space-y-4">
            <Link
              href={`/book-now?service=${encodeURIComponent(service.value)}`}
              className="w-full py-4 bg-gradient-to-r from-[color:var(--brand-primary,#296276)] to-[color:var(--brand-accent,#283955)] 
              text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[color:rgba(41,98,118,0.30)] 
              transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
               Book This Service for Quotation
            </Link>

              <Link
                href="/contact"
                className="w-full py-4 border-2 border-[color:var(--brand-primary,#296276)] text-[color:var(--brand-primary,#296276)] font-semibold rounded-xl hover:bg-[color:rgba(41,98,118,0.05)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Get in Touch
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4">Typical Turnaround</h4>
              <p className="text-gray-600 mb-4">2-3 hours for average home</p>

              <h4 className="font-bold text-gray-800 mb-4">Service Area</h4>
              <p className="text-gray-600">Whanganui &amp; surrounding areas</p>
            </div>
          </aside>
        </div>

        {/* BOTTOM CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Ready to experience the Wipe &amp; Swipe difference?</h3>

        <Link
          href={`/book-now?service=${encodeURIComponent(service.value)}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[color:var(--brand-primary,#296276)] to-[color:var(--brand-accent,#283955)] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[color:rgba(41,98,118,0.30)] transition-all duration-300 hover:-translate-y-0.5"
        >
          Request Your Free Quote
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        </div>
      </div>
    </section>
  );
}