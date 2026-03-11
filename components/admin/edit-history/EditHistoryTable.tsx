"use client";

import { useMemo, useState } from "react";
import EditHistoryViewModal, {
  type BookingHistoryItem,
} from "@/components/admin/edit-history/modal/EditHistoryViewModal";
import EditHistoryFilters, {
  getDefaultDirection,
  normalizeServiceType,
  type SortDirection,
  type SortField,
} from "@/components/admin/edit-history/EditHistoryFilters";

const ITEMS_PER_PAGE = 10;

function formatDate(value?: string | Date) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateOnly(value?: string | Date) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getBookingObject(bookingId: BookingHistoryItem["bookingId"]) {
  if (!bookingId || typeof bookingId === "string") return null;
  return bookingId;
}

function getCustomerName(item: BookingHistoryItem) {
  const booking = getBookingObject(item.bookingId);
  return booking?.fullName || "-";
}

function getServiceType(item: BookingHistoryItem) {
  const booking = getBookingObject(item.bookingId);
  return booking?.serviceType || "-";
}

function getBookingStatus(item: BookingHistoryItem) {
  const booking = getBookingObject(item.bookingId);
  return booking?.status || "-";
}

function getPreferredDate(item: BookingHistoryItem) {
  const booking = getBookingObject(item.bookingId);
  return booking?.preferredDate ? formatDateOnly(booking.preferredDate) : "-";
}

function getEditorName(item: BookingHistoryItem) {
  const first = item.performedBy?.firstName?.trim() || "";
  const middle = item.performedBy?.middleName?.trim() || "";
  const last = item.performedBy?.lastName?.trim() || "";

  const fullName = [first, middle, last].filter(Boolean).join(" ").trim();
  return fullName || item.performedBy?.email || "-";
}

function getSummary(item: BookingHistoryItem) {
  if (item.note?.trim()) return item.note;
  if (!item.changes?.length) return "No field-level changes recorded";

  const fields = item.changes.map((change) => change.field);
  const uniqueFields = [...new Set(fields)];

  if (uniqueFields.length === 1) return `Changed ${uniqueFields[0]}`;
  if (uniqueFields.length === 2) {
    return `Changed ${uniqueFields[0]} and ${uniqueFields[1]}`;
  }

  return `Changed ${uniqueFields.slice(0, 2).join(", ")} and ${uniqueFields.length - 2} more`;
}

type Props = {
  records: BookingHistoryItem[];
  loading: boolean;
  onDeleteOne: (historyId: string) => Promise<void> | void;
  onDeleteAll: () => Promise<void> | void;
};

export default function EditHistoryTable({
  records,
  loading,
  onDeleteOne,
  onDeleteAll,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<BookingHistoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [actionFilter, setActionFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const filteredAndSorted = useMemo(() => {
    let list = [...records];

    if (actionFilter) {
      list = list.filter((item) => item.action === actionFilter);
    }

    if (serviceFilter) {
      list = list.filter(
        (item) => normalizeServiceType(getServiceType(item)) === serviceFilter
      );
    }

    list.sort((a, b) => {
      if (sortField === "date") {
        const aValue = new Date(a.createdAt).getTime();
        const bValue = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (sortField === "customer") {
        const aValue = getCustomerName(a).toLowerCase();
        const bValue = getCustomerName(b).toLowerCase();
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (sortField === "editor") {
        const aValue = getEditorName(a).toLowerCase();
        const bValue = getEditorName(b).toLowerCase();
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return list;
  }, [records, actionFilter, serviceFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRecords = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, safeCurrentPage]);

  function handleActionFilterChange(value: string) {
    setActionFilter(value);
    setCurrentPage(1);
  }

  function handleServiceFilterChange(value: string) {
    setServiceFilter(value);
    setCurrentPage(1);
  }

  function handleSortFieldChange(value: SortField) {
    setSortField(value);
    setSortDirection(getDefaultDirection(value));
    setCurrentPage(1);
  }

  function handleSortDirectionChange(value: SortDirection) {
    setSortDirection(value);
    setCurrentPage(1);
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
        <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Edit History</h2>
              <p className="mt-1 text-sm text-gray-600">
                Review who edited each booking and inspect the exact field changes.
              </p>
            </div>

            <button
              type="button"
              onClick={onDeleteAll}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete All History
            </button>
          </div>
        </div>

        <EditHistoryFilters
          actionFilter={actionFilter}
          serviceFilter={serviceFilter}
          sortField={sortField}
          sortDirection={sortDirection}
          onActionFilterChange={handleActionFilterChange}
          onServiceFilterChange={handleServiceFilterChange}
          onSortFieldChange={handleSortFieldChange}
          onSortDirectionChange={handleSortDirectionChange}
        />

        <div className="overflow-x-auto">
          <table className="min-w-[1450px] w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Service Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Preferred Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Edited By
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Summary
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date Edited
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-500">
                    Loading edit history...
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-500">
                    No edit history records found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getCustomerName(item)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getServiceType(item)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getPreferredDate(item)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getBookingStatus(item)}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {item.action}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getEditorName(item)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.performedBy?.role || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 max-w-[280px]">
                      <span className="line-clamp-2">{getSummary(item)}</span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteOne(item._id)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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

        {!loading && filteredAndSorted.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-gray-600">
              Page {safeCurrentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <EditHistoryViewModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}