"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UsersTable, {
  type AdminStatus,
  type AdminUser,
} from "@/components/admin/users/UsersTable";

export default function UsersContainer() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 403) {
        await Swal.fire(
          "Forbidden",
          "Only SUPER_ADMIN can access this page.",
          "error"
        );
        window.location.href = "/admin";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("fetchUsers error:", error);
      await Swal.fire("Error", "Failed to load users.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: AdminStatus) {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetAdminId: id,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update status");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                status,
                archivedAt:
                  status === "ARCHIVED" ? new Date().toISOString() : null,
              }
            : user
        )
      );

      await Swal.fire({
        icon: "success",
        title: "Updated",
        text:
          status === "ARCHIVED"
            ? "User archived successfully. It will be permanently deleted after 30 days."
            : "User status updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("handleStatusChange error:", error);
      await Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Failed to update status",
        "error"
      );
    }
  }

  return (
    <section className="space-y-6">
      <UsersTable
        users={users}
        loading={loading}
        onStatusChange={handleStatusChange}
      />
    </section>
  );
}