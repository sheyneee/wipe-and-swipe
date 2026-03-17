"use client";

import Swal from "sweetalert2";
import { useUsersTable } from "@/hooks/admin/users/useUsersTable";
import { useUserViewModal } from "@/hooks/admin/users/useUserViewModal";
import { formatDate, formatFullName, formatRole } from "@/lib/utils/users/admin-users";
import UserViewModal from "@/components/admin/users/modal/UserViewModal";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";
export type AdminStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type AdminUser = {
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

type Props = {
  users: AdminUser[];
  loading: boolean;
  onStatusChange: (id: string, status: AdminStatus) => Promise<void> | void;
  onDeleteUser: (id: string) => Promise<void> | void;
};

export default function UsersTable({
  users,
  loading,
  onStatusChange,
  onDeleteUser,
}: Props) {
  const {
    setCurrentPage,
    sortField,
    sortDirection,
    roleFilter,
    statusFilter,
    verifiedFilter,
    searchQuery,
    filteredAndSortedUsers,
    paginatedUsers,
    totalPages,
    safeCurrentPage,
    handleSortChange,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handleVerifiedFilterChange,
    handleSearchChange,
    handleResetFilters,
  } = useUsersTable(users);

  const { selectedUser, isViewOpen, openView, closeView } = useUserViewModal();

  async function confirmArchive(user: AdminUser) {
    const result = await Swal.fire({
      title: "Archive user?",
      text: "This user will be archived first before permanent deletion.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Archive",
      confirmButtonColor: "#d97706",
    });

    if (!result.isConfirmed) return;
    await onStatusChange(user.id, "ARCHIVED");
  }

  async function confirmDelete(user: AdminUser) {
    const result = await Swal.fire({
      title: "Delete archived user?",
      text: "This will permanently delete the archived user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;
    await onDeleteUser(user.id);
  }

async function handleStatusSelectChange(user: AdminUser, nextStatus: AdminStatus) {
  if (user.status === nextStatus) return;

  if (nextStatus === "ARCHIVED") {
    await confirmArchive(user);
    return;
  }

  const result = await Swal.fire({
    title: "Update user status?",
    text: `Change status of ${formatFullName(user)} to ${nextStatus}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#6b7280",
  });

  if (!result.isConfirmed) return;

  await onStatusChange(user.id, nextStatus);
}

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Users</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Manage admin user accounts.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full sm:w-72 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1350px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Verified</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
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
                    value={roleFilter}
                    onChange={(e) => handleRoleFilterChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="">All Roles</option>
                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </th>

                <th className="px-6 py-3">
                  <select
                    value={verifiedFilter}
                    onChange={(e) =>
                      handleVerifiedFilterChange(
                        e.target.value as "" | "VERIFIED" | "UNVERIFIED"
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="">All</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="UNVERIFIED">Unverified</option>
                  </select>
                </th>

                <th className="px-6 py-3">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      handleStatusFilterChange(e.target.value as AdminStatus | "")
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </th>

                <th className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={sortField === "createdAt" ? sortDirection : ""}
                      onChange={(e) => handleSortChange("createdAt", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">All</option>
                      <option value="desc">Latest to Oldest</option>
                      <option value="asc">Oldest to Latest</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-950 transition-colors whitespace-nowrap"
                    >
                      Reset
                    </button>
                  </div>
                </th>

                <th className="px-6 py-3" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredAndSortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatFullName(user) || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatRole(user.role)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.emailVerified ? "Yes" : "No"}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          void handleStatusSelectChange(user, e.target.value as AdminStatus)
                        }
                        disabled={user.role === "SUPER_ADMIN"}
                        className="px-3 py-1 rounded-lg text-sm font-semibold border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openView(user)}
                          className="rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition-colors"
                        >
                          View
                        </button>

                        {user.role === "SUPER_ADMIN" ? (
                          <span className="text-sm text-gray-400">Not allowed</span>
                        ) : user.status === "ARCHIVED" ? (
                          <button
                            type="button"
                            onClick={() => void confirmDelete(user)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void confirmArchive(user)}
                            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
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

        {!loading && filteredAndSortedUsers.length > 0 && (
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
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <UserViewModal
        open={isViewOpen}
        user={selectedUser}
        onClose={closeView}
      />
    </>
  );
}