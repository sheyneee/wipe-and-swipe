"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { SERVICES } from "@/lib/data/services";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => Promise<void> | void;
};

type FormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  otherServiceType: string;
  serviceAddress: string;
  preferredDate: string;
  preferredTime: string;
  specialRequests: string;
};

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateLimits() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return {
    min: formatLocalDate(today),
    max: formatLocalDate(maxDate),
  };
}

export default function AdminCreateBookingModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    serviceType: "",
    otherServiceType: "",
    serviceAddress: "",
    preferredDate: "",
    preferredTime: "",
    specialRequests: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const { min, max } = useMemo(() => getDateLimits(), []);

  if (!open) return null;

  function resetForm() {
    setForm({
      fullName: "",
      email: "",
      phoneNumber: "",
      serviceType: "",
      otherServiceType: "",
      serviceAddress: "",
      preferredDate: "",
      preferredTime: "",
      specialRequests: "",
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "serviceType") {
        return {
          ...prev,
          serviceType: value,
          otherServiceType: value === "others" ? prev.otherServiceType : "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const finalServiceType =
      form.serviceType === "others"
        ? form.otherServiceType.trim()
        : SERVICES.find((service) => service.value === form.serviceType)?.title || form.serviceType;

    if (!finalServiceType) {
      await Swal.fire("Missing service type", "Please select a service type.", "warning");
      return;
    }

    if (form.serviceType === "others" && !form.otherServiceType.trim()) {
      await Swal.fire("Missing service type", "Please specify the service type.", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Create booking?",
      text: "This will create a new booking record.",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Confirm",
      confirmButtonColor: "#296276",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

      const preferredDateIso = new Date(`${form.preferredDate}T00:00:00`).toISOString();

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          serviceType: finalServiceType,
          serviceAddress: form.serviceAddress.trim() || undefined,
          preferredDate: preferredDateIso,
          preferredTime: form.preferredTime,
          specialRequests: form.specialRequests.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create booking.");
      }

      await Swal.fire({
        icon: "success",
        title: "Booking created",
        text: "The booking has been added successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      resetForm();
      onClose();
      await onCreated?.();
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Failed to create booking.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (submitting) return;
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Create Booking</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add a new booking directly from the admin dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Service Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.title}
                    </option>
                  ))}
                  <option value="others">Others</option>
                </select>
              </div>

              {form.serviceType === "others" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specify Service Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="otherServiceType"
                    value={form.otherServiceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Address
                </label>
                <input
                  name="serviceAddress"
                  value={form.serviceAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Schedule</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  required
                  min={min}
                  max={max}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="preferredTime"
                  type="time"
                  value={form.preferredTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={form.specialRequests}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold hover:opacity-90 transition-colors disabled:opacity-70"
            >
              {submitting ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}