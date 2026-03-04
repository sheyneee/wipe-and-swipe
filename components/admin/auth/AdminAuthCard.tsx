"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { BRAND } from "@/lib/config/brand";

import AdminAuthShell, { type Mode } from "@/components/admin/auth/AdminAuthShell";
import AdminLoginForm, { type LoginPayload } from "@/components/admin/auth/AdminLoginForm";
import AdminRegisterForm, { type RegisterPayload } from "@/components/admin/auth/AdminRegisterForm";

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
    <AdminAuthShell mode={mode} setMode={setMode}>
      {mode === "login" ? (
        <AdminLoginForm
          value={login}
          onChange={setLogin}
          onSubmit={handleLogin}
          submitting={submitting}
        />
      ) : (
        <AdminRegisterForm
          value={register}
          onChange={setRegister}
          onSubmit={handleRegister}
          submitting={submitting}
        />
      )}
    </AdminAuthShell>
  );
}