"use client";

import type React from "react";
import { BRAND } from "@/lib/config/brand"; 

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string };
const RING_STYLE: CSSVars = { "--tw-ring-color": "rgba(41,98,118,0.25)" };

type ApiErrorShape = { error?: string };

function isApiErrorShape(value: unknown): value is ApiErrorShape {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return obj.error === undefined || typeof obj.error === "string";
}

export default function ClientContactForm() {
  return (
    <form
      className="mt-6 space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);

        const payload = {
          name: String(fd.get("name") || ""),
          phone: String(fd.get("phone") || ""),
          email: String(fd.get("email") || ""),
          subject: String(fd.get("subject") || ""),
          message: String(fd.get("message") || ""),
        };

        const btn = form.querySelector<HTMLButtonElement>("button[type='submit']");
        if (btn) {
          btn.disabled = true;
          btn.dataset.prev = btn.textContent || "";
          btn.textContent = "Sending...";
        }

        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data: unknown = await res.json().catch(() => ({}));

          const errMsg =
            isApiErrorShape(data) && typeof data.error === "string" ? data.error : undefined;

          if (!res.ok) throw new Error(errMsg || "Failed to send message.");

          form.reset();
          alert("Message sent. We will get back to you as soon as possible.");
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Something went wrong.";
          alert(message);
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.textContent = btn.dataset.prev || "Send Message";
          }
        }
      }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <input
            name="name"
            required
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2"
            style={RING_STYLE}
            placeholder="Your name"
          />
        </Field>

        <Field label="Phone Number">
          <input
            name="phone"
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2"
            style={RING_STYLE}
            placeholder="Your phone"
          />
        </Field>
      </div>

      <Field label="Email Address" required>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2"
          style={RING_STYLE}
          placeholder="your@email.com"
        />
      </Field>

      <Field label="Subject" required>
        <input
          name="subject"
          required
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2"
          style={RING_STYLE}
          placeholder="e.g. End-of-tenancy cleaning quote"
        />
      </Field>

      <Field label="Message" required>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 resize-none"
          style={RING_STYLE}
          placeholder="Tell us how we can help..."
        />
      </Field>

      <button
        type="submit"
        className="w-full py-3.5 rounded-2xl text-white font-bold hover:opacity-95 transition shadow-sm"
        style={{ background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent})` }}
      >
        Send Message
      </button>

      <p className="text-xs text-slate-500">
        By submitting, you agree that your details will be used to respond to your inquiry.
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}