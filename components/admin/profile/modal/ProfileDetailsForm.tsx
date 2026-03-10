"use client";

import { useState } from "react";
import type { AdminProfile } from "../ProfileContainer";
import { formatAdminRole } from "@/lib/utils/profile/profile.utils";

type ProfileFormValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
};

function getInitialForm(profile: AdminProfile): ProfileFormValues {
  return {
    firstName: profile.firstName,
    middleName: profile.middleName ?? "",
    lastName: profile.lastName,
    email: profile.email,
  };
}

export default function ProfileDetailsForm({
  profile,
  saving,
  onSave,
}: {
  profile: AdminProfile;
  saving: boolean;
  onSave: (payload: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
  }) => Promise<boolean>;
}) {
  const [form, setForm] = useState<ProfileFormValues>(() => getInitialForm(profile));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onSave({
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      email: form.email,
    });
  }

  function handleReset() {
    setForm(getInitialForm(profile));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="First Name" htmlFor="firstName">
            <input
              id="firstName"
              value={form.firstName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-primary sm:text-base"
            />
          </Field>

          <Field label="Middle Name" htmlFor="middleName">
            <input
              id="middleName"
              value={form.middleName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, middleName: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-primary sm:text-base"
            />
          </Field>

          <Field label="Last Name" htmlFor="lastName">
            <input
              id="lastName"
              value={form.lastName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-primary sm:text-base"
            />
          </Field>

          <Field label="Email" htmlFor="email">
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-primary sm:text-base"
            />
          </Field>

          <Field label="Role" htmlFor="role">
            <input
              id="role"
              value={formatAdminRole(profile.role)}
              disabled
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none sm:text-base"
            />
          </Field>

          <Field label="Status" htmlFor="status">
            <input
              id="status"
              value={profile.status}
              disabled
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none sm:text-base"
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      {children}
    </div>
  );
}