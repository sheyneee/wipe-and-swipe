"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/data/services";
import Link from "next/link";

type FormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  serviceAddress?: string;
  preferredDate: string; // yyyy-mm-dd
  preferredTime: string; // hh:mm
  specialRequests?: string;
};

export default function BookingForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    serviceType: "",
    serviceAddress: "",
    preferredDate: "",
    preferredTime: "",
    specialRequests: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const isoDate = new Date(form.preferredDate).toISOString();

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          serviceType: form.serviceType,
          serviceAddress: form.serviceAddress || undefined,
          preferredDate: isoDate,
          preferredTime: form.preferredTime,
          specialRequests: form.specialRequests || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Booking failed");

      setSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Submitted!</h3>
        <p className="text-gray-600 mb-4">Thank you for booking with Wipe &amp; Swipe. We’ll contact you to confirm the details.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-secondary transition-colors"
      >
        Return to Home
      </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
          Personal Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
            <input name="fullName" value={form.fullName} onChange={onChange} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
            <input name="email" type="email" value={form.email} onChange={onChange} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={onChange} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
          Service Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type <span className="text-red-500">*</span></label>
            <select name="serviceType" value={form.serviceType} onChange={onChange} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all bg-white"
            >
              <option value="">Select a service</option>
              {SERVICES.map(s => (
                <option key={s.value} value={s.value}>{s.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service Address (Optional)</label>
            <input name="serviceAddress" value={form.serviceAddress} onChange={onChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              placeholder="123 Main Street, City, ST 12345"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date <span className="text-red-500">*</span></label>
              <input name="preferredDate" type="date" value={form.preferredDate} onChange={onChange} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Time <span className="text-red-500">*</span></label>
              <input name="preferredTime" type="time" value={form.preferredTime} onChange={onChange} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
          Additional Information
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests (Optional)</label>
          <textarea name="specialRequests" value={form.specialRequests} onChange={onChange} rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
            placeholder="Tell us about any special requirements or preferences..."
          />
          <p className="text-sm text-gray-500 mt-2">e.g., Pet allergies, specific areas to avoid, special instructions, etc.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="border-t pt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span>{loading ? "Submitting..." : "Book For A Free Quote"}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
}