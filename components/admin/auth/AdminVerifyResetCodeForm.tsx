"use client";

import React from "react";
import { BRAND } from "@/lib/config/brand";

export type VerifyResetCodePayload = {
  code: string;
};

export default function AdminVerifyResetCodeForm({
  email,
  value,
  onChange,
  onSubmit,
  onBack,
  onResend,
  submitting,
}: {
  email: string;
  value: VerifyResetCodePayload;
  onChange: (next: VerifyResetCodePayload) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onResend: () => void;
  submitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-brand-primary">Verify Code</h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm font-semibold text-gray-800 break-all">{email}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          6-Digit Code
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={value.code}
          onChange={(e) =>
            onChange({ code: e.target.value.replace(/\D/g, "").slice(0, 6) })
          }
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2 text-center tracking-[0.4em] text-lg font-semibold"
          placeholder="123456"
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
        {submitting ? "Verifying..." : "Verify Code"}
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="py-3 font-semibold rounded-lg border border-gray-300 text-gray-700 transition-all duration-300 hover:bg-gray-50 disabled:opacity-60"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={submitting}
          className="py-3 font-semibold rounded-lg border border-gray-300 text-gray-700 transition-all duration-300 hover:bg-gray-50 disabled:opacity-60"
        >
          Resend Code
        </button>
      </div>
    </form>
  );
}