"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { AdminStatus, AdminUser } from "@/components/admin/users/UsersTable";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = useCallback(async (id: string, status: AdminStatus) => {
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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update status");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                ...(data?.admin ?? {}),
                status,
                archivedAt: status === "ARCHIVED" ? new Date().toISOString() : null,
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
  }, []);

  const handleDeleteUser = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetAdminId: id,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Archived user permanently deleted.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("handleDeleteUser error:", error);
      await Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Failed to delete user",
        "error"
      );
    }
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    handleStatusChange,
    handleDeleteUser,
  };
}