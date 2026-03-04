"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { BRAND } from "@/lib/config/brand";

type Mode = "login" | "register";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
};

function isNonEmpty(v: string) {
  return v.trim().length > 0;
}

function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}

function extractApiMessage(raw: unknown): string | undefined {
  if (typeof raw === "string" && raw.trim()) return raw;

  if (Array.isArray(raw)) {
    const lines = raw
      .map((it) => {
        if (!it || typeof it !== "object") return undefined;

        const msgRaw =
          "message" in it ? (it as { message?: unknown }).message : undefined;
        const pathRaw =
          "path" in it ? (it as { path?: unknown }).path : undefined;

        const msg =
          typeof msgRaw === "string"
            ? msgRaw
            : msgRaw != null
            ? String(msgRaw)
            : "";

        const path =
          Array.isArray(pathRaw) && pathRaw.length
            ? pathRaw.map(String).join(".")
            : "";

        if (!msg.trim()) return undefined;
        return path ? `${path}: ${msg}` : msg;
      })
      .filter((v): v is string => Boolean(v));

    return lines.length ? lines.join("\n") : undefined;
  }

  if (raw && typeof raw === "object") {
    if ("message" in raw) {
      const v = (raw as { message?: unknown }).message;
      const nested = extractApiMessage(v);
      if (nested) return nested;
      if (typeof v === "string" && v.trim()) return v;
      if (v != null) return String(v);
    }

    if ("error" in raw) {
      const v = (raw as { error?: unknown }).error;
      const nested = extractApiMessage(v);
      if (nested) return nested;
      if (typeof v === "string" && v.trim()) return v;
      if (v != null) return String(v);
    }

    if ("issues" in raw) return extractApiMessage((raw as { issues?: unknown }).issues);
    if ("errors" in raw) return extractApiMessage((raw as { errors?: unknown }).errors);
  }

  return undefined;
}

export default function AdminAuthCard() {
  const [mode, setMode] = useState<Mode>("login");
  const [submitting, setSubmitting] = useState(false);

  const [login, setLogin] = useState<LoginPayload>({ email: "", password: "" });

  const [register, setRegister] = useState<RegisterPayload>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const email = normalizeEmail(login.email);
    const password = login.password;

    if (!isNonEmpty(email) || !isNonEmpty(password)) {
      await Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Email and password are required.",
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data: unknown = await res.json().catch(() => ({}));
      const message =
        typeof data === "object" && data && "message" in data
          ? String((data as { message?: unknown }).message ?? "")
          : "";

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Login blocked",
          text: message || "Login failed.",
          confirmButtonColor: BRAND.primary,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Welcome back",
        text: "Login successful.",
        confirmButtonColor: BRAND.primary,
      });

      window.location.href = "/admin";
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: BRAND.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

async function handleRegister(e: React.FormEvent) {
  e.preventDefault();

  const payload: RegisterPayload = {
    firstName: register.firstName.trim(),
    // keep as string (Postman style). Avoid undefined which can change validation behavior
    middleName: (register.middleName ?? "").trim() || "",
    lastName: register.lastName.trim(),
    email: normalizeEmail(register.email),
    password: register.password,
  };

  // client-side guards (match your backend min=2)
  if (payload.firstName.length < 2 ) {
    await Swal.fire({
      icon: "warning",
      title: "Invalid name",
      text: "First name must contain at least 2 characters.",
      confirmButtonColor: BRAND.primary,
    });
    return;
  }

    if (payload.lastName.length < 2) {
    await Swal.fire({
      icon: "warning",
      title: "Invalid name",
      text: "Last name must contain at least 2 characters.",
      confirmButtonColor: BRAND.primary,
    });
    return;
  }

  if (!isNonEmpty(payload.email)) {
    await Swal.fire({
      icon: "warning",
      title: "Missing email",
      text: "Email is required.",
      confirmButtonColor: BRAND.primary,
    });
    return;
  }

  if (!isNonEmpty(payload.password) || payload.password.length < 8) {
    await Swal.fire({
      icon: "warning",
      title: "Weak password",
      text: "Password must be at least 8 characters.",
      confirmButtonColor: BRAND.primary,
    });
    return;
  }

  // local formatter to guarantee readable messages
    const formatServerError = (x: unknown): string => {
    if (Array.isArray(x)) {
      const messages = x
        .map((issue) => {
          if (!issue || typeof issue !== "object") return undefined;

          const obj = issue as {
            path?: unknown;
            message?: unknown;
          };

          const msg =
            typeof obj.message === "string"
              ? obj.message
              : obj.message != null
              ? String(obj.message)
              : "";

          const field =
            Array.isArray(obj.path) && obj.path.length
              ? obj.path.join(".")
              : "";

          if (!msg.trim()) return undefined;

          return field ? `${msg}` : msg;
        })
        .filter((v): v is string => Boolean(v));

      return messages.length ? messages.join("\n") : "Registration failed";
    }

    if (x && typeof x === "object") {
      if ("message" in x) return formatServerError((x as Record<string, unknown>).message);
      if ("error" in x) return formatServerError((x as Record<string, unknown>).error);
      if ("issues" in x) return formatServerError((x as Record<string, unknown>).issues);
      if ("errors" in x) return formatServerError((x as Record<string, unknown>).errors);
    }

    if (typeof x === "string" && x.trim()) {
      // Try to extract JSON inside the string and format it
      const startArr = x.indexOf("[");
      const startObj = x.indexOf("{");
      const start =
        startArr !== -1 && startObj !== -1 ? Math.min(startArr, startObj) :
        startArr !== -1 ? startArr :
        startObj !== -1 ? startObj :
        -1;

      if (start !== -1) {
        const candidate = x.slice(start).trim();
        try {
          return formatServerError(JSON.parse(candidate));
        } catch {
          // ignore
        }
      }
      return x;
    }

    return "Registration failed";
  };

  try {
    setSubmitting(true);

    const res = await fetch("/api/admin/register/public", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const rawText = await res.text();

  let parsed: unknown = null;
    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {
      // 2) If direct parse fails, try to extract JSON array/object inside the text
      const startArr = rawText.indexOf("[");
      const startObj = rawText.indexOf("{");

      const start =
        startArr !== -1 && startObj !== -1 ? Math.min(startArr, startObj) :
        startArr !== -1 ? startArr :
        startObj !== -1 ? startObj :
        -1;

      if (start !== -1) {
        const candidate = rawText.slice(start).trim();
        try {
          parsed = JSON.parse(candidate);
        } catch {
          parsed = rawText; // fallback
        }
      } else {
        parsed = rawText;
      }
    }

    if (!res.ok) {
      const friendly = formatServerError(parsed);

      await Swal.fire({
        icon: "error",
        title: "Registration failed",
        html: friendly.replace(/\n/g, "<br/>"),
        confirmButtonColor: BRAND.primary,
      });
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Account created",
      text: "Check your email for a verification link. After verification, wait for approval if required.",
      confirmButtonColor: BRAND.primary,
    });

    setMode("login");
    setLogin({ email: payload.email, password: "" });
    setRegister({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
    });
  } catch (err: unknown) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      confirmButtonColor: BRAND.primary,
    });
  } finally {
    setSubmitting(false);
  }
}

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header OUTSIDE the card */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-primary mb-2">Welcome</h1>
        <p className="text-brand-accent text-lg font-semibold">Sign in or create an account</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Sticky Tab Navigation */}
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

        {/* Body */}
        <div className="p-8">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={login.email}
                  onChange={(e) => setLogin((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: "rgb(209 213 219)",
                    boxShadow: "none",
                  }}
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
                  value={login.password}
                  onChange={(e) => setLogin((p) => ({ ...p, password: e.target.value }))}
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
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={register.firstName}
                    onChange={(e) =>
                      setRegister((p) => ({ ...p, firstName: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
                    placeholder="John"
                    autoComplete="given-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={register.lastName}
                    onChange={(e) =>
                      setRegister((p) => ({ ...p, lastName: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none transition-all focus:ring-2"
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Middle Name <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={register.middleName ?? ""}
                  onChange={(e) =>
                    setRegister((p) => ({ ...p, middleName: e.target.value }))
                  }
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
                  value={register.email}
                  onChange={(e) => setRegister((p) => ({ ...p, email: e.target.value }))}
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
                  value={register.password}
                  onChange={(e) =>
                    setRegister((p) => ({ ...p, password: e.target.value }))
                  }
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
          )}
        </div>
      </div>
          <div className="text-center mt-5">
            <p className="text-sm text-gray-600 ">All your data is secure and encrypted</p>
              <p className="text-center text-gray-600 text-sm mt-2 p-3 rounded-lg">
                Admin-only area. Unauthorized access is prohibited.
              </p>
          </div>

    </div>
  );
}

function TabNavButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 py-4 text-center font-semibold border-b-2 transition-all hover:bg-gray-50"
      style={{
        borderBottomColor: active ? BRAND.primary : "transparent",
        color: active ? BRAND.primary : "rgb(75 85 99)", // gray-600
      }}
    >
      {label}
    </button>
  );
}