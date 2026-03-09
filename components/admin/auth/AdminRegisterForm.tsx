"use client";

import React, { useState } from "react";
import { BRAND } from "@/lib/config/brand";

export type RegisterPayload = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function AdminRegisterForm({
  value,
  onChange,
  onSubmit,
  submitting,
}: {
  value: RegisterPayload;
  onChange: (next: RegisterPayload) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={value.firstName}
            onChange={(e) => onChange({ ...value, firstName: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
            style={{ borderColor: "rgb(209 213 219)", boxShadow: "none" }}
            placeholder="John"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Middle Name
          </label>
          <input
            type="text"
            value={value.middleName ?? ""}
            onChange={(e) => onChange({ ...value, middleName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
            style={{ borderColor: "rgb(209 213 219)", boxShadow: "none" }}
            placeholder="Michael"
            autoComplete="additional-name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Last Name
        </label>
        <input
          type="text"
          value={value.lastName}
          onChange={(e) => onChange({ ...value, lastName: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
          style={{ borderColor: "rgb(209 213 219)", boxShadow: "none" }}
          placeholder="Doe"
          autoComplete="family-name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
          style={{ borderColor: "rgb(209 213 219)", boxShadow: "none" }}
          placeholder="your@email.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={value.password}
            onChange={(e) => onChange({ ...value, password: e.target.value })}
            required
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
            placeholder="Enter your password"
            autoComplete="new-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors p-1 focus:outline-none"
            style={{ color: showPassword ? BRAND.primary : undefined }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {!showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={value.confirmPassword}
            onChange={(e) =>
              onChange({ ...value, confirmPassword: e.target.value })
            }
            required
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
            placeholder="Confirm your password"
            autoComplete="new-password"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors p-1 focus:outline-none"
            style={{ color: showConfirmPassword ? BRAND.primary : undefined }}
            aria-label={
              showConfirmPassword ? "Hide confirm password" : "Show confirm password"
            }
          >
            {!showConfirmPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent})`,
        }}
      >
        {submitting ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}