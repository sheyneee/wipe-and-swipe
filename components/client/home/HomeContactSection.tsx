"use client";

import * as React from "react";

type HomeContactPayload = {
  name: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
};

function isNonEmpty(v: string) {
  return v.trim().length > 0;
}

export default function HomeContactSection() {
  const [form, setForm] = React.useState<HomeContactPayload>({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = React.useState<
    | { state: "idle" }
    | { state: "loading" }
    | { state: "success" }
    | { state: "error"; message: string }
  >({ state: "idle" });

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !isNonEmpty(form.name) ||
      !isNonEmpty(form.email) ||
      !isNonEmpty(form.subject) ||
      !isNonEmpty(form.message)
    ) {
      setStatus({
        state: "error",
        message: "Please complete all required fields.",
      });
      return;
    }

    setStatus({ state: "loading" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: isNonEmpty(form.phone || "") ? form.phone : undefined,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !json?.ok) {
        setStatus({
          state: "error",
          message: json?.error || "Unable to send your message. Please try again.",
        });
        return;
      }

      setStatus({ state: "success" });
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left column (info) */}
          <div>
            <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 font-semibold rounded-full text-sm mb-4">
              Get In Touch
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Ready for a Sparkling Clean Space?
            </h2>

          <p className="text-gray-600 text-lg mb-8">
            Get your free quote today. Fill out the form and our team will respond as soon as possible. You may also call or text us directly — our lines are open 24/7.
          </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="text-lg font-semibold text-gray-800">(+64) 210-262-2114</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-lg font-semibold text-gray-800">wipeandswipecs@gmail.com</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="text-lg font-semibold text-gray-800">
                    155A Harrison Street, Whanganui, New Zealand
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column (form) */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl">
            {status.state !== "success" ? (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="home-contact-name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="home-contact-name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label htmlFor="home-contact-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="home-contact-phone"
                      name="phone"
                      value={form.phone || ""}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      placeholder="(+64) 21 000 0000"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="home-contact-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="home-contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    placeholder="john@example.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="home-contact-subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="home-contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    placeholder="Request a quote"
                  />
                </div>

                <div>
                  <label htmlFor="home-contact-message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="home-contact-message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your cleaning needs..."
                  />
                </div>

                {status.state === "error" ? (
                  <p className="text-sm text-red-600">{status.message}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={status.state === "loading"}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{status.state === "loading" ? "Sending..." : "Get Free Quote"}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  We have received your request. Our team will contact you as soon as possible.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}