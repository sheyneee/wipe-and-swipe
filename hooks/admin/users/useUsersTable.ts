"use client";

import { useMemo, useState } from "react";
import type { AdminRole, AdminStatus, AdminUser } from "@/components/admin/users/UsersTable";
import {
  filterAndSortUsers,
  paginateUsers,
  type SortDirection,
  type SortField,
  type VerifiedFilter,
} from "@/lib/utils/users/admin-users";

export function useUsersTable(users: AdminUser[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "">("");
  const [statusFilter, setStatusFilter] = useState<AdminStatus | "">("");
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedUsers = useMemo(() => {
    return filterAndSortUsers({
      users,
      searchQuery,
      roleFilter,
      statusFilter,
      verifiedFilter,
      sortField,
      sortDirection,
    });
  }, [users, searchQuery, roleFilter, statusFilter, verifiedFilter, sortField, sortDirection]);

  const { totalPages, safeCurrentPage, paginatedUsers } = useMemo(() => {
    return paginateUsers(filteredAndSortedUsers, currentPage);
  }, [filteredAndSortedUsers, currentPage]);

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

  function handleVerifiedFilterChange(value: VerifiedFilter) {
    setCurrentPage(1);
    setVerifiedFilter(value);
  }

  function handleSearchChange(value: string) {
    setCurrentPage(1);
    setSearchQuery(value);
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

  return {
    currentPage,
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
  };
}