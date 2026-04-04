"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { Booking } from "@/hooks/admin/booking-list/useBookingsTable";
import EditBookingForm, { type UpdateBookingPayload } from "./EditBookingForm";

type Props = {
  open: boolean;
  booking: Booking | null;
  initialMode?: "view" | "edit";
  onClose: () => void;
  onSave: (id: string, payload: UpdateBookingPayload) => Promise<void>;
};

export default function ViewBookingModal({
  open,
  booking,
  initialMode = "view",
  onClose,
  onSave,
}: Props) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [open, initialMode, booking?._id]);

  if (!open || !booking) return null;

  const currentBooking = booking;

  async function handleSave(payload: UpdateBookingPayload) {
    const result = await Swal.fire({
      title: "Save booking changes?",
      text: "This will update the booking details.",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Confirm",
      confirmButtonColor: "#296276",
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      await onSave(currentBooking._id, payload);

      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Booking updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setMode("view");
    } catch {
      await Swal.fire("Error", "Failed to update booking.", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setMode("view");
    onClose();
  }

  const formattedPreferredDate = currentBooking.preferredDate
    ? new Date(currentBooking.preferredDate).toLocaleDateString("en-NZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {mode === "view" ? "Booking Details" : "Edit Booking"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "view"
                ? "View customer booking details"
                : "Update customer booking details"}
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

        <div className="overflow-y-auto px-6 py-6">
          {mode === "view" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Full Name" value={currentBooking.fullName} />
                <Detail label="Email" value={currentBooking.email} />
                <Detail label="Phone Number" value={currentBooking.phoneNumber} />
                <Detail label="Service Type" value={currentBooking.serviceType} />
                <Detail label="Service Address" value={currentBooking.serviceAddress} />
                <Detail label="Preferred Date" value={formattedPreferredDate} />
                <Detail label="Preferred Time" value={currentBooking.preferredTime} />
                <Detail
                  label="Price"
                  value={
                    currentBooking.price === null || currentBooking.price === undefined
                      ? "-"
                      : `$${currentBooking.price.toFixed(2)}`
                  }
                />
                <Detail label="Status" value={currentBooking.status} />
                <div className="md:col-span-2">
                  <Detail label="Special Requests" value={currentBooking.specialRequests} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Edit
                </button>
              </div>
            </>
          ) : (
            <EditBookingForm
              key={currentBooking._id}
              booking={currentBooking}
              saving={saving}
              onCancel={() => setMode("view")}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-gray-800">{value || "-"}</p>
    </div>
  );
}