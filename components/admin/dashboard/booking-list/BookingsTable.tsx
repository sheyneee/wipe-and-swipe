"use client";

import Swal from "sweetalert2";
import {
  SERVICE_OPTIONS,
  formatDate,
  formatPrice,
  BOOKING_STATUS_LABELS,
} from "@/lib/utils/admin/booking-list/bookingsTable.utils";
import {
  useBookingsTable,
  type Booking,
  type BookingStatus,
} from "@/hooks/admin/booking-list/useBookingsTable";
import { useEffect } from "react";

export default function BookingsTable({
  bookings,
  loading,
  onStatusChange,
  onArchive,
  onDelete,
  onView,
  onEdit,
  onFilteredDataChange,
}: {
  bookings: Booking[];
  loading: boolean;
  onStatusChange: (id: string, status: BookingStatus) => Promise<void> | void;
  onArchive: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onFilteredDataChange?: (rows: Booking[]) => void;
}) {
  const {
    currentPage,
    setCurrentPage,
    sortField,
    sortDirection,
    serviceFilter,
    statusFilter,
    searchQuery,
    dateValue,
    filteredAndSortedBookings,
    paginatedBookings,
    totalPages,
    safeCurrentPage,
    handleSearchQueryChange,
    handleSortChange,
    handleServiceFilterChange,
    handleStatusFilterChange,
    handleDateChange,
    handleResetFilters,
  } = useBookingsTable({ bookings });

  useEffect(() => {
    onFilteredDataChange?.(filteredAndSortedBookings);
  }, [filteredAndSortedBookings, onFilteredDataChange]);

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

  async function confirmDelete(id: string) {
    const result = await Swal.fire({
      title: "Delete booking permanently?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;
    await onDelete(id);
  }

  async function handleStatusSelectChange(
    booking: Booking,
    nextStatus: BookingStatus
  ) {
    if (nextStatus === booking.status) return;

    const isArchive = nextStatus === "ARCHIVED";

    const result = await Swal.fire({
      title: "Confirm status change",
      text: isArchive
        ? "This booking will be archived and permanently deleted within 30 days."
        : `Change status from ${BOOKING_STATUS_LABELS[booking.status]} to ${BOOKING_STATUS_LABELS[nextStatus]}?`,
      icon: isArchive ? "warning" : "question",
      showCancelButton: true,
      confirmButtonText: isArchive ? "Archive" : "Confirm",
      confirmButtonColor: isArchive ? "#d97706" : "#296276",
    });

    if (!result.isConfirmed) return;

    await onStatusChange(booking._id, nextStatus);
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              Booking List
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Manage all customer cleaning service bookings.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search customer name..."
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            className="w-full sm:w-72 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Service
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>

            <tr className="bg-white border-b border-gray-200">
              <th className="px-6 py-3">
                <select
                  value={sortField === "name" ? sortDirection : ""}
                  onChange={(e) => handleSortChange("name", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </th>

              <th className="px-6 py-3">
                <select
                  value={sortField === "email" ? sortDirection : ""}
                  onChange={(e) => handleSortChange("email", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </th>

              <th className="px-6 py-3">
                <select
                  value={sortField === "phone" ? sortDirection : ""}
                  onChange={(e) => handleSortChange("phone", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </th>

              <th className="px-6 py-3">
                <select
                  value={serviceFilter}
                  onChange={(e) => handleServiceFilterChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All Services</option>
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </th>

              <th className="px-6 py-3">
                <select
                  value={dateValue}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All</option>
                  <option value="desc">Latest to Oldest</option>
                  <option value="asc">Oldest to Latest</option>
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last60">Last 60 Days</option>
                </select>
              </th>

              <th className="px-6 py-3">
                <select
                  value={sortField === "price" ? sortDirection : ""}
                  onChange={(e) => handleSortChange("price", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All</option>
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </select>
              </th>

              <th className="px-6 py-3">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    handleStatusFilterChange(e.target.value as BookingStatus | "")
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="DECLINED">Declined</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </th>

              <th className="px-6 py-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-950 transition-colors"
                >
                  Reset
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Loading bookings...
                </td>
              </tr>
            ) : filteredAndSortedBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              paginatedBookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {b.fullName || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {b.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {b.phoneNumber || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {b.serviceType || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(b.preferredDate)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">
                    {formatPrice(b.price)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        handleStatusSelectChange(
                          b,
                          e.target.value as BookingStatus
                        )
                      }
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
                        className="px-3 py-1 bg-brand-primary text-white font-semibold rounded-lg hover:opacity-90 transition-colors"
                      >
                        View
                      </button>

                      <button
                        onClick={() => onEdit(b)}
                        className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>

                      {b.status === "ARCHIVED" ? (
                        <button
                          onClick={() => confirmDelete(b._id)}
                          className="px-3 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => confirmArchive(b._id)}
                          className="px-3 py-1 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredAndSortedBookings.length > 0 && (
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
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