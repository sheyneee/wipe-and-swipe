"use client";

import React from "react";
import { BRAND } from "@/lib/config/brand";

export type RegisterPayload = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
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
            placeholder="John"
            autoComplete="given-name"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 2 characters</p>
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
            placeholder="Doe"
            autoComplete="family-name"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 2 characters</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Middle Name <span className="text-xs text-gray-500">(Optional)</span>
        </label>
        <input
          type="text"
          value={value.middleName ?? ""}
          onChange={(e) => onChange({ ...value, middleName: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
          placeholder="Michael"
          autoComplete="additional-name"
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
          placeholder="your@email.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={value.password}
          onChange={(e) => onChange({ ...value, password: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
          placeholder="••••••••"
          autoComplete="new-password"
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
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