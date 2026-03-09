"use client";

import { useMemo, useState } from "react";
import { SERVICES } from "@/lib/data/services";
import type {
  Booking,
  BookingStatus,
} from "@/hooks/admin/booking-list/useBookingsTable";

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

const CUSTOM_SERVICE_VALUE = "__custom__";

function toDateInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function toTimeInputValue(value?: string) {
  if (!value) return "";

  const trimmed = value.trim();

  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let hours = Number(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();

    if (period === "AM" && hours === 12) hours = 0;
    if (period === "PM" && hours !== 12) hours += 12;

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  return "";
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

const SERVICE_TITLES = SERVICES.map((service) => service.title);

function isStandardService(serviceType?: string) {
  if (!serviceType) return false;

  const normalized = normalizeText(serviceType);
  return SERVICE_TITLES.some((title) => normalizeText(title) === normalized);
}

function createInitialFormState(booking: Booking): FormState {
  return {
    fullName: booking.fullName ?? "",
    email: booking.email ?? "",
    phoneNumber: booking.phoneNumber ?? "",
    serviceType: booking.serviceType ?? "",
    serviceAddress: booking.serviceAddress ?? "",
    preferredDate: toDateInputValue(booking.preferredDate),
    preferredTime: toTimeInputValue(booking.preferredTime),
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
  const [form, setForm] = useState<FormState>(() =>
    createInitialFormState(booking)
  );

  const [serviceMode, setServiceMode] = useState<"select" | "custom">(
    isStandardService(booking.serviceType) ? "select" : "custom"
  );

  const selectedServiceValue = useMemo(() => {
    if (serviceMode === "custom") return CUSTOM_SERVICE_VALUE;

    const matched = SERVICE_TITLES.find(
      (title) => normalizeText(title) === normalizeText(form.serviceType)
    );

    return matched ?? "";
  }, [form.serviceType, serviceMode]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleServiceSelectChange(value: string) {
    if (value === CUSTOM_SERVICE_VALUE) {
      setServiceMode("custom");
      if (isStandardService(form.serviceType)) {
        updateField("serviceType", "");
      }
      return;
    }

    setServiceMode("select");
    updateField("serviceType", value);
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
      preferredTime: form.preferredTime.trim() || undefined,
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
          <div className="space-y-3">
            <select
              value={selectedServiceValue}
              onChange={(e) => handleServiceSelectChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Select a service</option>
              {SERVICES.map((service) => (
                <option key={service.value} value={service.title}>
                  {service.title}
                </option>
              ))}
              <option value={CUSTOM_SERVICE_VALUE}>Other / Custom</option>
            </select>

            {serviceMode === "custom" && (
              <input
                value={form.serviceType}
                onChange={(e) => updateField("serviceType", e.target.value)}
                placeholder="Type custom service"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
              />
            )}
          </div>
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
            type="time"
            value={form.preferredTime}
            onChange={(e) => updateField("preferredTime", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as BookingStatus)
              }
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