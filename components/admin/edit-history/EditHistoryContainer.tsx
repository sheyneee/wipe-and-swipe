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

  return <EditHistoryTable records={records} loading={loading} />;
}