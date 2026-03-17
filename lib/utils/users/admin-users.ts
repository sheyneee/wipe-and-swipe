import type { AdminRole, AdminStatus, AdminUser } from "@/components/admin/users/UsersTable";

export type SortField = "name" | "email" | "createdAt" | null;
export type SortDirection = "asc" | "desc";
export type VerifiedFilter = "" | "VERIFIED" | "UNVERIFIED";

export const ITEMS_PER_PAGE = 5;

export function formatFullName(user: AdminUser) {
  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function formatDate(value?: string | Date) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRole(role: AdminRole) {
  return role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN";
}

type FilterAndSortParams = {
  users: AdminUser[];
  searchQuery: string;
  roleFilter: AdminRole | "";
  statusFilter: AdminStatus | "";
  verifiedFilter: VerifiedFilter;
  sortField: SortField;
  sortDirection: SortDirection;
};

export function filterAndSortUsers({
  users,
  searchQuery,
  roleFilter,
  statusFilter,
  verifiedFilter,
  sortField,
  sortDirection,
}: FilterAndSortParams) {
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
}

export function paginateUsers(users: AdminUser[], currentPage: number, itemsPerPage = ITEMS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  return {
    totalPages,
    safeCurrentPage,
    paginatedUsers: users.slice(startIndex, startIndex + itemsPerPage),
  };
}