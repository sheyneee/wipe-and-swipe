"use client";

import { useState } from "react";
import type { Booking, BookingStatus } from "../BookingsTable";

export type UpdateBookingPayload = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  serviceType?: string;
  serviceAddress?: string;
  preferredDate?: string;
  preferredTime?: string;
  specialRequests?: string;
  price?: number | null;
  status?: BookingStatus;
};

type Props = {
  booking: Booking;
  saving: boolean;
  onCancel: () => void;
  onSave: (payload: UpdateBookingPayload) => Promise<void>;
};

type FormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  serviceAddress: string;
  preferredDate: string;
  preferredTime: string;
  specialRequests: string;
  price: string;
  status: BookingStatus;
};

function toDateInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function createInitialFormState(booking: Booking): FormState {
  return {
    fullName: booking.fullName ?? "",
    email: booking.email ?? "",
    phoneNumber: booking.phoneNumber ?? "",
    serviceType: booking.serviceType ?? "",
    serviceAddress: booking.serviceAddress ?? "",
    preferredDate: toDateInputValue(booking.preferredDate),
    preferredTime: booking.preferredTime ?? "",
    specialRequests: booking.specialRequests ?? "",
    price:
      booking.price === null || booking.price === undefined
        ? ""
        : String(booking.price),
    status: booking.status,
  };
}

export default function EditBookingForm({
  booking,
  saving,
  onCancel,
  onSave,
}: Props) {
  const [form, setForm] = useState<FormState>(() => createInitialFormState(booking));

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onSave({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      serviceType: form.serviceType.trim(),
      serviceAddress: form.serviceAddress.trim() || undefined,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime.trim(),
      specialRequests: form.specialRequests.trim() || undefined,
      price: form.price.trim() === "" ? null : Number(form.price),
      status: form.status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name">
          <input
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <Field label="Phone Number">
          <input
            value={form.phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <Field label="Service Type">
          <input
            value={form.serviceType}
            onChange={(e) => updateField("serviceType", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <Field label="Service Address">
          <input
            value={form.serviceAddress}
            onChange={(e) => updateField("serviceAddress", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <Field label="Price">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <Field label="Preferred Date">
          <input
            type="date"
            value={form.preferredDate}
            onChange={(e) => updateField("preferredDate", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <Field label="Preferred Time">
          <input
            value={form.preferredTime}
            onChange={(e) => updateField("preferredTime", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value as BookingStatus)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DECLINED">Declined</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Special Requests">
            <textarea
              rows={4}
              value={form.specialRequests}
              onChange={(e) => updateField("specialRequests", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}