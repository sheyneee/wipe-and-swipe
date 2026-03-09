"use client";

import { useMemo, useState } from "react";
import {
  ITEMS_PER_PAGE,
  STANDARD_SERVICE_SET,
  normalizeService,
} from "@/lib/utils/booking-list/bookingsTable.utils";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DECLINED"
  | "CANCELLED"
  | "COMPLETED"
  | "ARCHIVED";

export type Booking = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  serviceAddress?: string;
  preferredDate: string;
  preferredTime?: string;
  specialRequests?: string;
  price?: number | null;
  status: BookingStatus;
};

export type SortField = "name" | "email" | "phone" | "date" | "price" | null;
export type SortDirection = "asc" | "desc";

type UseBookingsTableParams = {
  bookings: Booking[];
};

export function useBookingsTable({ bookings }: UseBookingsTableParams) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedBookings = useMemo(() => {
    let list = [...bookings];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      list = list.filter((booking) =>
        (booking.fullName || "").toLowerCase().includes(query)
      );
    }

    if (serviceFilter) {
      if (serviceFilter === "Others") {
        list = list.filter(
          (booking) =>
            !STANDARD_SERVICE_SET.has(normalizeService(booking.serviceType))
        );
      } else {
        list = list.filter(
          (booking) =>
            normalizeService(booking.serviceType) ===
            normalizeService(serviceFilter)
        );
      }
    }

    if (statusFilter) {
      list = list.filter((booking) => booking.status === statusFilter);
    } else {
      list = list.filter((booking) => booking.status !== "ARCHIVED");
    }

    if (!sortField) return list;

    return list.sort((a, b) => {
      switch (sortField) {
        case "name": {
          const aValue = (a.fullName || "").toLowerCase();
          const bValue = (b.fullName || "").toLowerCase();

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

        case "phone": {
          const aValue = a.phoneNumber || "";
          const bValue = b.phoneNumber || "";

          return sortDirection === "asc"
            ? aValue.localeCompare(bValue, undefined, { numeric: true })
            : bValue.localeCompare(aValue, undefined, { numeric: true });
        }

        case "date": {
          const aValue = new Date(a.preferredDate).getTime();
          const bValue = new Date(b.preferredDate).getTime();

          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        case "price": {
          const aValue = a.price ?? 0;
          const bValue = b.price ?? 0;

          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        default:
          return 0;
      }
    });
  }, [
    bookings,
    searchQuery,
    serviceFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedBookings.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedBookings = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedBookings.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedBookings, safeCurrentPage]);

  function handleSearchQueryChange(value: string) {
    setCurrentPage(1);
    setSearchQuery(value);
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

  function handleServiceFilterChange(value: string) {
    setCurrentPage(1);
    setServiceFilter(value);
  }

  function handleStatusFilterChange(value: BookingStatus | "") {
    setCurrentPage(1);
    setStatusFilter(value);
  }

  function handleResetFilters() {
    setCurrentPage(1);
    setSortField(null);
    setSortDirection("asc");
    setServiceFilter("");
    setStatusFilter("");
    setSearchQuery("");
  }

  return {
    currentPage,
    setCurrentPage,
    sortField,
    sortDirection,
    serviceFilter,
    statusFilter,
    searchQuery,
    filteredAndSortedBookings,
    paginatedBookings,
    totalPages,
    safeCurrentPage,
    handleSearchQueryChange,
    handleSortChange,
    handleServiceFilterChange,
    handleStatusFilterChange,
    handleResetFilters,
  };
}