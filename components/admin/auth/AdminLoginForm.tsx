"use client";

import React from "react";
import { BRAND } from "@/lib/config/brand";

export type LoginPayload = {
  email: string;
  password: string;
};

export default function AdminLoginForm({
  value,
  onChange,
  onSubmit,
  submitting,
}: {
  value: LoginPayload;
  onChange: (next: LoginPayload) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        <input
          type="password"
          value={value.password}
          onChange={(e) => onChange({ ...value, password: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
          placeholder="••••••••"
          autoComplete="current-password"
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
        {submitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}