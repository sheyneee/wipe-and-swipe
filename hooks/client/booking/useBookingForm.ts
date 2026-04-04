"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  getDateLimits,
  getFinalServiceType,
  getInitialBookingFormState,
  isDateWithinNextYear,
  isValidNzPhoneNumber,
  normalizeNzPhoneNumber,
  resolveInitialService,
  type BookingFormState,
} from "@/lib/utils/client/booking/bookingForm";


type ChangeElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export function useBookingForm(initialService = "") {
  const [form, setForm] = useState<BookingFormState>(getInitialBookingFormState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { min, max } = useMemo(() => getDateLimits(), []);

  useEffect(() => {
    const resolved = resolveInitialService(initialService);

    setForm((prev) => ({
      ...prev,
      serviceType: resolved.serviceType,
      otherServiceType: resolved.otherServiceType,
    }));
  }, [initialService]);

  const onChange = (
    e: React.ChangeEvent<ChangeElement>
  ) => {
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
  };

const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  try {
    if (!isDateWithinNextYear(form.preferredDate)) {
      throw new Error("Preferred date must be within today and the next 12 months.");
    }

    const finalServiceType = getFinalServiceType(form);
    const normalizedPhoneNumber = normalizeNzPhoneNumber(form.phoneNumber);
    const isoDate = new Date(`${form.preferredDate}T00:00:00`).toISOString();

    if (!isValidNzPhoneNumber(form.phoneNumber)) {
    throw new Error("Please enter a valid New Zealand phone number.");
    }

    if (!finalServiceType) {
      throw new Error("Please select a service type.");
    }

    if (form.serviceType === "others" && !form.otherServiceType.trim()) {
      throw new Error("Please enter your service type.");
    }

    setLoading(false);

    const result = await Swal.fire({
      title: "Submit quote request?",
      text: "Please confirm that all booking details are correct before sending.",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Confirm",
      confirmButtonColor: "#296276",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: normalizedPhoneNumber,
        serviceType: finalServiceType,
        serviceAddress: form.serviceAddress || undefined,
        preferredDate: isoDate,
        preferredTime: form.preferredTime,
        specialRequests: form.specialRequests || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Booking failed");
    }

    setSuccess(true);
  } catch (err) {
    setErrorMsg(err instanceof Error ? err.message : "Booking failed");
  } finally {
    setLoading(false);
  }
};

  return {
    form,
    loading,
    success,
    errorMsg,
    min,
    max,
    onChange,
    onSubmit,
  };
}