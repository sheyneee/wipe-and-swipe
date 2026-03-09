"use client";

import React from "react";
import { BRAND } from "@/lib/config/brand";

export type ResetPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

export default function AdminResetPasswordForm({
  value,
  onChange,
  onSubmit,
  onBack,
  submitting,
}: {
  value: ResetPasswordPayload;
  onChange: (next: ResetPasswordPayload) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  submitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-brand-primary">Set New Password</h2>
        <p className="text-sm text-gray-600 mt-2">
          Enter your new password and confirm it below.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          New Password
        </label>
        <input
          type="password"
          value={value.newPassword}
          onChange={(e) =>
            onChange({ ...value, newPassword: e.target.value })
          }
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
          placeholder="Enter your password"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={value.confirmPassword}
          onChange={(e) =>
            onChange({ ...value, confirmPassword: e.target.value })
          }
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
          placeholder="Confirm your password"
          autoComplete="new-password"
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
        {submitting ? "Resetting..." : "Reset Password"}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="w-full py-3 font-semibold rounded-lg border border-gray-300 text-gray-700 transition-all duration-300 hover:bg-gray-50 disabled:opacity-60"
      >
        Back
      </button>
    </form>
  );
}