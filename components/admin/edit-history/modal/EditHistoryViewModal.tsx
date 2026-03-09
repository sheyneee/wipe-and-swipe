"use client";

type BookingRef =
  | string
  | {
      _id?: string;
      fullName?: string;
      serviceType?: string;
      preferredDate?: string | Date;
      preferredTime?: string;
      status?: string;
      price?: number | null;
    };

export type BookingHistoryItem = {
  _id: string;
  bookingId: BookingRef;
  action: "CREATE" | "UPDATE" | "STATUS_CHANGE" | "ARCHIVE" | "DELETE";
  performedBy?: {
    userId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
  changes: Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }>;
  note?: string;
  createdAt: string;
  updatedAt?: string;
};

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

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (value instanceof Date) return formatDate(value);

  if (Array.isArray(value)) {
    try {
      return value.length ? JSON.stringify(value, null, 2) : "-";
    } catch {
      return String(value);
    }
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function getBookingObject(bookingId: BookingRef) {
  if (!bookingId || typeof bookingId === "string") return null;
  return bookingId;
}

function getBookingIdText(bookingId: BookingRef) {
  if (!bookingId) return "-";
  if (typeof bookingId === "string") return bookingId;
  return bookingId._id || "-";
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

function ChangeAccordion({
  index,
  change,
}: {
  index: number;
  change: BookingHistoryItem["changes"][number];
}) {
  return (
    <details className="rounded-xl border border-gray-200 bg-white">
      <summary className="cursor-pointer list-none px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Change #{index + 1}
            </p>
            <p className="text-sm text-gray-600">
              Field: <span className="font-medium text-gray-800">{change.field}</span>
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-primary">
            View
          </span>
        </div>
      </summary>

      <div className="border-t border-gray-200 px-4 py-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
              Old Value
            </p>
            <pre className="whitespace-pre-wrap break-words font-sans text-sm text-gray-800">
              {formatValue(change.oldValue)}
            </pre>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              New Value
            </p>
            <pre className="whitespace-pre-wrap break-words font-sans text-sm text-gray-800">
              {formatValue(change.newValue)}
            </pre>
          </div>
        </div>
      </div>
    </details>
  );
}

type Props = {
  item: BookingHistoryItem | null;
  open: boolean;
  onClose: () => void;
};

export default function EditHistoryViewModal({
  item,
  open,
  onClose,
}: Props) {
  if (!open || !item) return null;

  const booking = getBookingObject(item.bookingId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit History Details
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Review the booking snapshot, editor, and detailed field changes.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Booking Information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {booking?.fullName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Service Type
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {booking?.serviceType || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Preferred Date
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {booking?.preferredDate
                      ? formatDateOnly(booking.preferredDate)
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Preferred Time
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {booking?.preferredTime || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Current Status
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {booking?.status || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Edit Metadata
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {item.action}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date Edited
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {formatDate(item.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Edited By
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {getEditorName(item)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {item.performedBy?.role || "-"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {item.performedBy?.email || "-"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Note / Summary
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {item.note?.trim() || getSummary(item)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">Changes</h3>
              <p className="mt-1 text-sm text-gray-600">
                Expand each item to inspect the old and new values.
              </p>
            </div>

            {item.changes?.length ? (
              <div className="space-y-3">
                {item.changes.map((change, index) => (
                  <ChangeAccordion
                    key={`${item._id}-${change.field}-${index}`}
                    index={index}
                    change={change}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
                No detailed field changes recorded for this history entry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}