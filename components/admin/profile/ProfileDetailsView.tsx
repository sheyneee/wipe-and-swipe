"use client";

import type { AdminProfile } from "./ProfileContainer";
import { formatAdminRole } from "@/lib/utils/admin/profile/profile.utils";

export default function ProfileDetailsView({
  profile,
  onEditProfile,
  onChangePassword,
}: {
  profile: AdminProfile;
  onEditProfile: () => void;
  onChangePassword: () => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Profile Details</h2>
          <p className="mt-1 text-sm text-gray-600">
            View your current admin account information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadOnlyField label="First Name" value={profile.firstName} />
          <ReadOnlyField label="Middle Name" value={profile.middleName?.trim() || "N/A"} />
          <ReadOnlyField label="Last Name" value={profile.lastName} />
          <ReadOnlyField label="Email" value={profile.email} />
          <ReadOnlyField label="Role" value={formatAdminRole(profile.role)} />
          <ReadOnlyField label="Status" value={profile.status} />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onChangePassword}
            className="w-full rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={onEditProfile}
            className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>
      <div className="min-h-[48px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 sm:text-base">
        {value}
      </div>
    </div>
  );
}