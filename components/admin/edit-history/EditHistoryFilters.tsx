"use client";

const STANDARD_SERVICE_OPTIONS = [
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

const SERVICE_OPTIONS = [...STANDARD_SERVICE_OPTIONS, "Others"] as const;

export type SortField = "date" | "customer" | "editor";
export type SortDirection = "asc" | "desc";

type Props = {
  actionFilter: string;
  serviceFilter: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onActionFilterChange: (value: string) => void;
  onServiceFilterChange: (value: string) => void;
  onSortFieldChange: (value: SortField) => void;
  onSortDirectionChange: (value: SortDirection) => void;
};

function getDirectionOptions(sortField: SortField) {
  switch (sortField) {
    case "date":
      return [
        { value: "desc", label: "Latest to Oldest" },
        { value: "asc", label: "Oldest to Latest" },
      ] as const;

    case "customer":
      return [
        { value: "asc", label: "A-Z" },
        { value: "desc", label: "Z-A" },
      ] as const;

    case "editor":
      return [
        { value: "asc", label: "A-Z" },
        { value: "desc", label: "Z-A" },
      ] as const;

    default:
      return [
        { value: "desc", label: "Descending" },
        { value: "asc", label: "Ascending" },
      ] as const;
  }
}

export function getDefaultDirection(sortField: SortField): SortDirection {
  switch (sortField) {
    case "date":
      return "desc";
    case "customer":
    case "editor":
      return "asc";
    default:
      return "desc";
  }
}

export function normalizeServiceType(serviceType: string) {
  const normalized = serviceType.trim().toLowerCase();

  const matchedStandard = STANDARD_SERVICE_OPTIONS.find(
    (item) => item.toLowerCase() === normalized
  );

  return matchedStandard ?? "Others";
}

export { STANDARD_SERVICE_OPTIONS, SERVICE_OPTIONS };

export default function EditHistoryFilters({
  actionFilter,
  serviceFilter,
  sortField,
  sortDirection,
  onActionFilterChange,
  onServiceFilterChange,
  onSortFieldChange,
  onSortDirectionChange,
}: Props) {
  const directionOptions = getDirectionOptions(sortField);

  return (
    <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Filter by Action
          </label>
          <select
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="STATUS_CHANGE">Status Change</option>
            <option value="ARCHIVE">Archive</option>
            <option value="DELETE">Delete</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Filter by Service Type
          </label>
          <select
            value={serviceFilter}
            onChange={(e) => onServiceFilterChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All Service Types</option>
            {SERVICE_OPTIONS.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="date">Date Edited</option>
            <option value="customer">Customer</option>
            <option value="editor">Edited By</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Direction
          </label>
          <select
            value={sortDirection}
            onChange={(e) => onSortDirectionChange(e.target.value as SortDirection)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          >
            {directionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}