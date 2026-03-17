"use client";

import type { AdminUser } from "@/components/admin/users/UsersTable";
import { formatDate, formatFullName, formatRole } from "@/lib/utils/users/admin-users";

type Props = {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 py-3 border-b border-gray-100">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <div className="text-sm text-gray-600 break-words">{value}</div>
    </div>
  );
}

export default function UserViewModal({ open, user, onClose }: Props) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            <p className="text-sm text-gray-500">
              View admin account information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div className="px-6 py-5">
          <DetailRow label="Full Name" value={formatFullName(user) || "-"} />
          <DetailRow label="Email" value={user.email || "-"} />
          <DetailRow label="Role" value={formatRole(user.role)} />
          <DetailRow label="Status" value={user.status} />
          <DetailRow
            label="Email Verified"
            value={user.emailVerified ? "Yes" : "No"}
          />
          <DetailRow label="Created At" value={formatDate(user.createdAt)} />
          <DetailRow label="Updated At" value={formatDate(user.updatedAt)} />
          <DetailRow
            label="Archived At"
            value={user.archivedAt ? formatDate(user.archivedAt) : "-"}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}