"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditHistoryTable from "@/components/admin/edit-history/EditHistoryTable";
import type { BookingHistoryItem } from "@/components/admin/edit-history/modal/EditHistoryViewModal";

export default function EditHistoryContainer() {
  const [records, setRecords] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/edit-history", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load edit history");
      }

      const json = await res.json();
      const data = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : [];

      setRecords(data);
    } catch (error) {
      console.error("fetchHistory error:", error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load edit history.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOne(historyId: string) {
    const result = await Swal.fire({
      title: "Delete history record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/edit-history/${historyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "Failed to delete history record");
      }

      setRecords((prev) => prev.filter((item) => item._id !== historyId));

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "History record deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("handleDeleteOne error:", error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete history record.",
      });
    }
  }

  async function handleDeleteAll() {
    const result = await Swal.fire({
      title: "Delete all booking edit history?",
      text: "This will permanently remove all edit history records.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete All",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/admin/edit-history", {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "Failed to delete all history");
      }

      setRecords([]);

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "All booking edit history deleted successfully.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("handleDeleteAll error:", error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete all history.",
      });
    }
  }

  return (
    <EditHistoryTable
      records={records}
      loading={loading}
      onDeleteOne={handleDeleteOne}
      onDeleteAll={handleDeleteAll}
    />
  );
}