export const ITEMS_PER_PAGE = 5;

export const STANDARD_SERVICE_OPTIONS = [
  "Commercial Cleaning",
  "Residential Cleaning",
  "Airbnb Cleaning",
  "School Cleaning",
  "End-of-Tenancy Cleaning",
  "Deep Cleaning",
  "Window Cleaning",
  "Driveway & Concrete",
  "Builder's Clean",
] as const;

export const SERVICE_OPTIONS = [...STANDARD_SERVICE_OPTIONS, "Others"] as const;

export const STANDARD_SERVICE_SET = new Set(
  STANDARD_SERVICE_OPTIONS.map((service) => service.trim().toLowerCase())
);

export function normalizeService(value: string) {
  return value.trim().toLowerCase();
}

export function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatPrice(value?: number | null) {
  if (value === null || value === undefined) return "-";
  return `$${value.toFixed(2)}`;
}

export const BOOKING_STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
} as const;