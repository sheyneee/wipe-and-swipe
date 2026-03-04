"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import BookingsStats from "@/components/admin/dashboard/BookingsStats";
import BookingsTable, { type Booking, type BookingStatus } from "@/components/admin/dashboard/BookingsTable";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load bookings");

      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      await Swal.fire("Error", "Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  }

  async function onStatusChange(id: string, status: BookingStatus) {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Update failed");

      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch {
      await Swal.fire("Error", "Failed to update status", "error");
    }
  }

  async function onDelete(id: string) {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch {
      await Swal.fire("Error", "Failed to delete booking", "error");
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Bookings</h2>
        <p className="text-gray-600">Manage all customer cleaning service bookings</p>
      </div>

      <BookingsStats bookings={bookings} />

      <BookingsTable
        bookings={bookings}
        loading={loading}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </main>
  );
}