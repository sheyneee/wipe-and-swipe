"use client";

import Swal from "sweetalert2";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Booking = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  status: BookingStatus;
};

export default function BookingsTable({
  bookings,
  loading,
  onStatusChange,
  onDelete,
}: {
  bookings: Booking[];
  loading: boolean;
  onStatusChange: (id: string, status: BookingStatus) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}) {
  async function confirmDelete(id: string) {
    const result = await Swal.fire({
      title: "Delete booking?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;
    await onDelete(id);
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Name", "Email", "Phone", "Service", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr className="border-b border-gray-100">
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr className="border-b border-gray-100">
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No bookings yet
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.email || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.phone || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.service || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.date || "-"}</td>
                  <td className="px-6 py-4">
                    <select
                      value={b.status || "pending"}
                      onChange={(e) => onStatusChange(b._id, e.target.value as BookingStatus)}
                      className="px-3 py-1 rounded-lg text-sm font-semibold border border-gray-200 focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => confirmDelete(b._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}