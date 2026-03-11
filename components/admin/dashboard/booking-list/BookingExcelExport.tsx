"use client";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import type { Booking } from "@/hooks/admin/booking-list/useBookingsTable";

function formatExportDate(date: string) {
  if (!date) return "-";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BookingExcelExport({
  rows,
  fileNamePrefix = "bookings",
}: {
  rows: Booking[];
  fileNamePrefix?: string;
}) {
  function handleExport() {
    if (!rows.length) {
      void Swal.fire({
        icon: "info",
        title: "No data to export",
        text: "There are no bookings available for export.",
      });
      return;
    }

    const totalSales = rows.reduce(
      (sum, booking) => sum + (Number(booking.price) || 0),
      0
    );

    const exportRows = rows.map((booking, index) => ({
      "No.": index + 1,
      "Full Name": booking.fullName || "-",
      Email: booking.email || "-",
      "Phone Number": booking.phoneNumber || "-",
      "Service Type": booking.serviceType || "-",
      "Service Address": booking.serviceAddress || "-",
      "Preferred Date": formatExportDate(booking.preferredDate),
      "Preferred Time": booking.preferredTime || "-",
      Price: Number(booking.price) || 0,
      Status: booking.status || "-",
      "Special Requests": booking.specialRequests || "-",
    }));

    const worksheet = XLSX.utils.aoa_to_sheet([]);

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Wipe and Swipe"], [`Export Date: ${new Date().toLocaleDateString("en-PH")}`], []],
      { origin: "A1" }
    );

    XLSX.utils.sheet_add_json(worksheet, exportRows, {
      origin: "A4",
      skipHeader: false,
    });

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["", "", "", "", "", "", "", "Total Sales", totalSales]],
      { origin: `A${exportRows.length + 6}` }
    );

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 24 },
      { wch: 28 },
      { wch: 18 },
      { wch: 24 },
      { wch: 28 },
      { wch: 18 },
      { wch: 16 },
      { wch: 12 },
      { wch: 14 },
      { wch: 30 },
    ];

    worksheet["!merges"] = [
      XLSX.utils.decode_range("A1:C1"),
      XLSX.utils.decode_range("A2:C2"),
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `${fileNamePrefix}-${today}.xlsx`);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
    >
      Export Excel
    </button>
  );
}