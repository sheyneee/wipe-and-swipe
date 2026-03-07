"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DECLINED"
  | "CANCELLED"
  | "COMPLETED"
  | "ARCHIVED";

export type Booking = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  serviceAddress?: string;
  preferredDate: string;
  preferredTime?: string;
  specialRequests?: string;
  price?: number | null;
  status: BookingStatus;
};

const ITEMS_PER_PAGE = 5;

export default function BookingsTable({
  bookings,
  loading,
  onStatusChange,
  onArchive,
  onView,
}: {
  bookings: Booking[];
  loading: boolean;
  onStatusChange: (id: string, status: BookingStatus) => Promise<void> | void;
  onArchive: (id: string) => Promise<void> | void;
  onView: (booking: Booking) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedBookings = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return bookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [bookings, safeCurrentPage]);

  async function confirmArchive(id: string) {
    const result = await Swal.fire({
      title: "Archive booking?",
      text: "This booking will be archived and permanently deleted within 30 days.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Archive",
      confirmButtonColor: "#d97706",
    });

    if (!result.isConfirmed) return;
    await onArchive(id);
  }

  function formatDate(value: string) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatPrice(value?: number | null) {
    if (value === null || value === undefined) return "-";
    return `$${value.toFixed(2)}`;
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Name", "Email", "Phone", "Service", "Date", "Price", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No bookings yet
                </td>
              </tr>
            ) : (
              paginatedBookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.fullName || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.email || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.phoneNumber || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.serviceType || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(b.preferredDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{formatPrice(b.price)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={b.status}
                      onChange={(e) => onStatusChange(b._id, e.target.value as BookingStatus)}
                      className="px-3 py-1 rounded-lg text-sm font-semibold border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="DECLINED">Declined</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(b)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View
                      </button>

                      <button
                        onClick={() => confirmArchive(b._id)}
                        className="px-3 py-1 bg-amber-100 text-amber-700 font-semibold rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && bookings.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Page {safeCurrentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safeCurrentPage === 1}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safeCurrentPage === totalPages}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}