"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import BookingsStats from "@/components/admin/dashboard/booking-list/BookingsStats";
import BookingsTable, {
  type Booking,
  type BookingStatus,
} from "@/components/admin/dashboard/booking-list/BookingsTable";
import ViewBookingModal from "@/components/admin/dashboard/booking-list/modals/ViewBookingModal";
import type { UpdateBookingPayload } from "@/components/admin/dashboard/booking-list/modals/EditBookingForm";

export default function BookingsContainer() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    void fetchBookings();
  }, []);

  async function forceLogoutAndRedirect(
    message = "Your admin session is no longer active."
  ) {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    await Swal.fire({
      icon: "warning",
      title: "Session ended",
      text: message,
    });

    window.location.href = "/admin/login";
  }

  async function fetchBookings() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/bookings", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        await forceLogoutAndRedirect();
        return;
      }

      if (!res.ok) throw new Error("Failed to load bookings");

      const data = await res.json();
      const bookingsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.bookings)
        ? data.bookings
        : Array.isArray(data.data)
        ? data.data
        : [];

      setBookings(bookingsArray);
    } catch (error) {
      console.error("fetchBookings error:", error);
      await Swal.fire("Error", "Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: BookingStatus) {
    const previousBookings = bookings;

    try {
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );

      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (res.status === 401 || res.status === 403) {
        setBookings(previousBookings);
        await forceLogoutAndRedirect();
        return;
      }

      if (!res.ok) throw new Error("Failed to update status");
    } catch (error) {
      console.error("handleStatusChange error:", error);
      setBookings(previousBookings);
      await Swal.fire("Error", "Failed to update status", "error");
    }
  }

  function handleOpenView(booking: Booking) {
    setSelectedBooking(booking);
    setModalMode("view");
    setIsViewModalOpen(true);
  }

  function handleOpenEdit(booking: Booking) {
    setSelectedBooking(booking);
    setModalMode("edit");
    setIsViewModalOpen(true);
  }

  function handleCloseView() {
    setSelectedBooking(null);
    setModalMode("view");
    setIsViewModalOpen(false);
  }

  async function handleSaveEdit(id: string, payload: UpdateBookingPayload) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.status === 401 || res.status === 403) {
      await forceLogoutAndRedirect();
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to update booking");
    }

    const responseData = await res.json();
    const updatedBooking = responseData?.data ?? responseData;

    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === id ? { ...booking, ...updatedBooking } : booking
      )
    );

    setSelectedBooking((prev) =>
      prev && prev._id === id ? { ...prev, ...updatedBooking } : prev
    );
  }

  async function handleArchive(id: string) {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "ARCHIVED" }),
      });

      if (res.status === 401 || res.status === 403) {
        await forceLogoutAndRedirect();
        return;
      }

      if (!res.ok) throw new Error("Failed to archive booking");

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status: "ARCHIVED" } : booking
        )
      );

      setSelectedBooking((prev) =>
        prev && prev._id === id ? { ...prev, status: "ARCHIVED" } : prev
      );

      await Swal.fire({
        icon: "success",
        title: "Archived",
        text: "Booking archived successfully. It will be permanently deleted within 30 days.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("handleArchive error:", error);
      await Swal.fire("Error", "Failed to archive booking", "error");
    }
  }

  return (
    <section className="space-y-6">
      <BookingsStats bookings={bookings} />

      <BookingsTable
        bookings={bookings}
        loading={loading}
        onStatusChange={handleStatusChange}
        onArchive={handleArchive}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
      />

      <ViewBookingModal
        open={isViewModalOpen}
        booking={selectedBooking}
        initialMode={modalMode}
        onClose={handleCloseView}
        onSave={handleSaveEdit}
      />
    </section>
  );
}