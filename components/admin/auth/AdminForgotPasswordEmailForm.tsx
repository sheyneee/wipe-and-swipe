"use client";

import React from "react";
import { BRAND } from "@/lib/config/brand";

export type ForgotPasswordEmailPayload = {
  email: string;
};

export default function AdminForgotPasswordEmailForm({
  value,
  onChange,
  onSubmit,
  onBack,
  submitting,
}: {
  value: ForgotPasswordEmailPayload;
  onChange: (next: ForgotPasswordEmailPayload) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  submitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-brand-primary">Forgot Password</h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter your admin email address and we will send you a 6-digit reset code.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={value.email}
          onChange={(e) => onChange({ email: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
          placeholder="your@email.com"
          autoComplete="email"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent})`,
        }}
      >
        {submitting ? "Sending code..." : "Send Code"}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="w-full py-3 font-semibold rounded-lg border border-gray-300 text-gray-700 transition-all duration-300 hover:bg-gray-50 disabled:opacity-60"
      >
        Back to Login
      </button>
    </form>
  );
}