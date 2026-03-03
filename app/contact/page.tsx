import Link from "next/link";
import ClientContactForm from "./ClientContactForm";

const BRAND = {
  primary: "#296276",
  secondary: "#283955",
  accent: "#266075",
  white: "#ffffff",
};

export default function ContactPage() {
  return (
    <main
      className="min-h-screen pt-28 pb-16"
      style={{
        background:
          "linear-gradient(180deg, rgba(41,98,118,0.08) 0%, rgba(255,255,255,1) 45%, rgba(38,96,117,0.08) 100%)",
      }}
    >
      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold hover:opacity-80"
            style={{ color: BRAND.primary }}
          >
            <span aria-hidden>←</span>
            Back to Home
          </Link>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Contact Us
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl">
            Send us your details and we will get back to you. You can also call or message us on WhatsApp.
          </p>
        </div>

        {/* 40% / 60% split on large screens */}
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ContactInfoCard />
          </div>
          <div className="lg:col-span-3">
            <ContactFormCard />
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-10 rounded-3xl border p-8 md:p-10 bg-white">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: BRAND.primary }}>
                Quick Response
              </h2>
              <p className="mt-2 text-slate-700">
                We aim to respond to all inquiries within 24 hours. For urgent matters, please call or text us
                directly.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold" style={{ color: BRAND.primary }}>
                Available Hours
              </h2>
              <p className="mt-2 text-slate-700">
                Monday . Sunday: 8:00 AM . 6:00 PM
                <br />
                Emergency cleaning available upon request
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactFormCard() {
  return (
    <div className="rounded-3xl bg-white border shadow-sm p-8">
      <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
      <p className="mt-2 text-slate-600">
        This form will send directly to <span className="font-semibold">wipeandswipecs@gmail.com</span>.
      </p>

      <ClientContactForm />
    </div>
  );
}

function ContactInfoCard() {
  const phoneE164 = "+64210262114";
  const waNumberNoPlus = "64210262114";
  const email = "wipeandswipecs@gmail.com";

  return (
    <div className="rounded-3xl bg-white border shadow-sm p-8">
      <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>

      <div className="mt-8 space-y-6">
        {/* Phone */}
        <div className="flex gap-4">
          <div
            className="w-12 h-12 rounded-2xl grid place-items-center text-white"
            style={{ background: `linear-gradient(135deg, ${BRAND.secondary}, ${BRAND.accent})` }}
            aria-hidden
          >
            ☎
          </div>

          <div className="flex-1">
            <div className="text-sm text-slate-500">Phone</div>
            <div className="font-bold text-slate-900">{phoneE164}</div>

            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`tel:${phoneE164}`}
                className="px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90"
                style={{ backgroundColor: BRAND.primary }}
              >
                Call
              </a>

              <a
                href={`https://wa.me/${waNumberNoPlus}?text=${encodeURIComponent(
                  "Hi Wipe & Swipe, I would like to inquire about your cleaning services."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90"
                style={{ backgroundColor: "#22c55e" }}
              >
                WhatsApp
              </a>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              On mobile, tapping Call opens the phone app. WhatsApp opens WhatsApp if installed.
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex gap-4">
          <div
            className="w-12 h-12 rounded-2xl grid place-items-center text-white"
            style={{ background: `linear-gradient(135deg, ${BRAND.secondary}, ${BRAND.accent})` }}
            aria-hidden
          >
            ✉
          </div>

          <div className="flex-1">
            <div className="text-sm text-slate-500">Email</div>
            <a
              href={`mailto:${email}`}
              className="font-bold hover:underline break-all"
              style={{ color: BRAND.secondary }}
            >
              {email}
            </a>
            <div className="mt-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90"
                style={{ backgroundColor: BRAND.primary }}
              >
                Send Email
              </a>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex gap-4">
          <div
            className="w-12 h-12 rounded-2xl grid place-items-center text-white"
            style={{ background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.secondary})` }}
            aria-hidden
          >
            ⌖
          </div>

          <div className="flex-1">
            <div className="text-sm text-slate-500">Location</div>
            <div className="font-semibold text-slate-900">
              155A Harrison Street,
              <br />
               Whanganui, New Zealand
            </div>
            <div className="mt-3">
              <a
                href="https://maps.app.goo.gl/Vpc8sHKE4oxgCRgk8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90"
                style={{ backgroundColor: BRAND.primary }}
              >
                View Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}