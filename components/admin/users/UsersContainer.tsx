"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type AdminRole = "SUPER_ADMIN" | "ADMIN";
type AdminStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

type AdminUser = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  emailVerified: boolean;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

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
        await Swal.fire("Forbidden", "Only SUPER_ADMIN can access this page.", "error");
        window.location.href = "/admin";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error(error);
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
      console.error(error);
      await Swal.fire("Error", error instanceof Error ? error.message : "Failed to update status", "error");
    }
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800">Users</h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage admin user accounts. 
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Verified</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.firstName} {user.middleName ? `${user.middleName} ` : ""}{user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.emailVerified ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value as AdminStatus)}
                        disabled={user.role === "SUPER_ADMIN"}
                        className="px-3 py-2 rounded-lg text-sm border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none disabled:opacity-60"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}