"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";

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

type SortField = "name" | "email" | "createdAt" | null;
type SortDirection = "asc" | "desc";

type Props = {
  users: AdminUser[];
  loading: boolean;
  onStatusChange: (id: string, status: AdminStatus) => Promise<void> | void;
};

const ITEMS_PER_PAGE = 5;

function formatFullName(user: AdminUser) {
  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function formatDate(value?: string | Date) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRole(role: AdminRole) {
  return role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN";
}

export default function UsersTable({
  users,
  loading,
  onStatusChange,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "">("");
  const [statusFilter, setStatusFilter] = useState<AdminStatus | "">("");
  const [verifiedFilter, setVerifiedFilter] = useState<"" | "VERIFIED" | "UNVERIFIED">("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedUsers = useMemo(() => {
    let list = [...users];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      list = list.filter((user) => {
        const fullName = formatFullName(user).toLowerCase();
        const email = (user.email || "").toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    }

    if (roleFilter) {
      list = list.filter((user) => user.role === roleFilter);
    }

    if (statusFilter) {
      list = list.filter((user) => user.status === statusFilter);
    } else {
      list = list.filter((user) => user.status !== "ARCHIVED");
    }

    if (verifiedFilter) {
      list = list.filter((user) =>
        verifiedFilter === "VERIFIED" ? user.emailVerified : !user.emailVerified
      );
    }

    if (!sortField) return list;

    return list.sort((a, b) => {
      switch (sortField) {
        case "name": {
          const aValue = formatFullName(a).toLowerCase();
          const bValue = formatFullName(b).toLowerCase();

          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }

        case "email": {
          const aValue = (a.email || "").toLowerCase();
          const bValue = (b.email || "").toLowerCase();

          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }

        case "createdAt": {
          const aValue = new Date(a.createdAt).getTime();
          const bValue = new Date(b.createdAt).getTime();

          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        default:
          return 0;
      }
    });
  }, [
    users,
    searchQuery,
    roleFilter,
    statusFilter,
    verifiedFilter,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedUsers, safeCurrentPage]);

  async function confirmArchive(user: AdminUser) {
    const result = await Swal.fire({
      title: "Archive user?",
      text: "This user will be archived and permanently deleted within 30 days.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Archive",
      confirmButtonColor: "#d97706",
    });

    if (!result.isConfirmed) return;
    await onStatusChange(user.id, "ARCHIVED");
  }

  async function handleStatusSelectChange(user: AdminUser, nextStatus: AdminStatus) {
    if (user.status === nextStatus) return;

    if (nextStatus === "ARCHIVED") {
      await confirmArchive(user);
      return;
    }

    await onStatusChange(user.id, nextStatus);
  }

  function handleSortChange(field: SortField, direction: string) {
    setCurrentPage(1);

    if (!direction) {
      setSortField(null);
      setSortDirection("asc");
      return;
    }

    setSortField(field);
    setSortDirection(direction as SortDirection);
  }

  function handleRoleFilterChange(value: string) {
    setCurrentPage(1);
    setRoleFilter(value as AdminRole | "");
  }

  function handleStatusFilterChange(value: AdminStatus | "") {
    setCurrentPage(1);
    setStatusFilter(value);
  }

  function handleVerifiedFilterChange(value: "" | "VERIFIED" | "UNVERIFIED") {
    setCurrentPage(1);
    setVerifiedFilter(value);
  }

  function handleResetFilters() {
    setCurrentPage(1);
    setSortField(null);
    setSortDirection("asc");
    setRoleFilter("");
    setStatusFilter("");
    setVerifiedFilter("");
    setSearchQuery("");
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              Users
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Manage admin user accounts.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchQuery(e.target.value);
            }}
            className="w-full sm:w-72 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Verified
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Created
              </th>
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
                    onChange={(e) =>
                      handleSortChange("createdAt", e.target.value)
                    }
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
                        void handleStatusSelectChange(
                          user,
                          e.target.value as AdminStatus
                        )
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}