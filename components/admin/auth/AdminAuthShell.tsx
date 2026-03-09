"use client";

import React from "react";
import TabNavButton from "./TabNavButton";

export type Mode =
  | "login"
  | "register"
  | "forgot-email"
  | "forgot-code"
  | "reset-password";

export default function AdminAuthShell({
  mode,
  setMode,
  children,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  children: React.ReactNode;
}) {
  const isForgotFlow =
    mode === "forgot-email" ||
    mode === "forgot-code" ||
    mode === "reset-password";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-primary mb-2">Welcome</h1>
        <p className="text-brand-accent text-lg font-semibold">
          {isForgotFlow
            ? "Recover your admin account"
            : "Sign in or create an account"}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {!isForgotFlow && (
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur flex border-b border-gray-200">
            <TabNavButton
              active={mode === "login"}
              onClick={() => setMode("login")}
              label="Login"
            />
            <TabNavButton
              active={mode === "register"}
              onClick={() => setMode("register")}
              label="Create Account"
            />
          </div>
        )}

        <div className="p-8">{children}</div>
      </div>

      <div className="text-center mt-5">
        <p className="text-sm text-gray-600">All your data is secure and encrypted</p>
        <p className="text-center text-gray-600 text-sm mt-2 p-3 rounded-lg">
          Admin-only area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}