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

type SortField = "name" | "email" | "phone" | "date" | "price" | null;
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 5;

const STANDARD_SERVICE_OPTIONS = [
  "Commercial Cleaning",
  "Residential Cleaning",
  "Airbnb Cleaning",
  "School Cleaning",
  "End-of-Tenancy Cleaning",
  "Deep Cleaning",
  "Window Cleaning",
  "Driveway & Concrete",
  "Builder's Clean",
] as const;

const SERVICE_OPTIONS = [...STANDARD_SERVICE_OPTIONS, "Others"] as const;

const STANDARD_SERVICE_SET = new Set(
  STANDARD_SERVICE_OPTIONS.map((service) => service.trim().toLowerCase())
);

function normalizeService(value: string) {
  return value.trim().toLowerCase();
}

export default function BookingsTable({
  bookings,
  loading,
  onStatusChange,
  onArchive,
  onDelete,
  onView,
  onEdit,
}: {
  bookings: Booking[];
  loading: boolean;
  onStatusChange: (id: string, status: BookingStatus) => Promise<void> | void;
  onArchive: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedBookings = useMemo(() => {
    let list = [...bookings];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      list = list.filter((booking) =>
        (booking.fullName || "").toLowerCase().includes(query)
      );
    }

    if (serviceFilter) {
      if (serviceFilter === "Others") {
        list = list.filter(
          (booking) =>
            !STANDARD_SERVICE_SET.has(normalizeService(booking.serviceType))
        );
      } else {
        list = list.filter(
          (booking) =>
            normalizeService(booking.serviceType) ===
            normalizeService(serviceFilter)
        );
      }
    }

    if (statusFilter) {
      list = list.filter((booking) => booking.status === statusFilter);
    } else {
      list = list.filter((booking) => booking.status !== "ARCHIVED");
    }

    if (!sortField) return list;

    return list.sort((a, b) => {
      switch (sortField) {
        case "name": {
          const aValue = (a.fullName || "").toLowerCase();
          const bValue = (b.fullName || "").toLowerCase();

          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }

        case "email": {
          const aValue = (a.email || "").toLowerCase();
          const bValue = (b.email || "").toLowerCase();

          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }

        case "phone": {
          const aValue = a.phoneNumber || "";
          const bValue = b.phoneNumber || "";

          return sortDirection === "asc"
            ? aValue.localeCompare(bValue, undefined, { numeric: true })
            : bValue.localeCompare(aValue, undefined, { numeric: true });
        }

        case "date": {
          const aValue = new Date(a.preferredDate).getTime();
          const bValue = new Date(b.preferredDate).getTime();

          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        case "price": {
          const aValue = a.price ?? 0;
          const bValue = b.price ?? 0;

          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        default:
          return 0;
      }
    });
  }, [bookings, searchQuery, serviceFilter, statusFilter, sortField, sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedBookings.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedBookings = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedBookings.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedBookings, safeCurrentPage]);

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

  function handleSortChange(field: SortField, direction: string) {
    setCurrentPage(1);

    if (!direction) {
      if (sortField === field) {
        setSortField(null);
        setSortDirection("asc");
      } else {
        setSortField(null);
        setSortDirection("asc");
      }
      return;
    }

    setSortField(field);
    setSortDirection(direction as SortDirection);
  }

  function handleServiceFilterChange(value: string) {
    setCurrentPage(1);
    setServiceFilter(value);
  }

  function handleStatusFilterChange(value: BookingStatus | "") {
    setCurrentPage(1);
    setStatusFilter(value);
  }

  function handleResetFilters() {
    setCurrentPage(1);
    setSortField(null);
    setSortDirection("asc");
    setServiceFilter("");
    setStatusFilter("");
  }

    async function handleStatusSelectChange(
      booking: Booking,
      nextStatus: BookingStatus
    ) {
      if (nextStatus === booking.status) return;

      const statusLabels: Record<BookingStatus, string> = {
        PENDING: "Pending",
        CONFIRMED: "Confirmed",
        DECLINED: "Declined",
        CANCELLED: "Cancelled",
        COMPLETED: "Completed",
        ARCHIVED: "Archived",
      };

      const isArchive = nextStatus === "ARCHIVED";

      const result = await Swal.fire({
        title: "Confirm status change",
        text: isArchive
          ? `This booking will be archived and permanently deleted within 30 days.`
          : `Change status from ${statusLabels[booking.status]} to ${statusLabels[nextStatus]}?`,
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
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
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
                  value={sortField === "date" ? sortDirection : ""}
                  onChange={(e) => handleSortChange("date", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All</option>
                  <option value="desc">Latest to Oldest</option>
                  <option value="asc">Oldest to Latest</option>
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
                      handleStatusSelectChange(b, e.target.value as BookingStatus)
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
                        className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View
                      </button>

                      <button
                        onClick={() => onEdit(b)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>

                      {b.status === "ARCHIVED" ? (
                        <button
                          onClick={() => confirmDelete(b._id)}
                          className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => confirmArchive(b._id)}
                          className="px-3 py-1 bg-amber-100 text-amber-700 font-semibold rounded-lg hover:bg-amber-200 transition-colors"
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