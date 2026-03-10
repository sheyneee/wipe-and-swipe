"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/admin/ui/password-visibility-icon";

export default function ChangePasswordForm({
  saving,
  onSave,
}: {
  saving: boolean;
  onSave: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<boolean>;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const success = await onSave({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!success) return;

    handleClear();
  }

  function handleClear() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Current Password" htmlFor="currentPassword">
          <PasswordInput
            id="currentPassword"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrentPassword}
            onToggleShow={() => setShowCurrentPassword((prev) => !prev)}
          />
        </Field>

        <Field label="New Password" htmlFor="newPassword">
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={setNewPassword}
            show={showNewPassword}
            onToggleShow={() => setShowNewPassword((prev) => !prev)}
          />
        </Field>

        <Field label="Confirm New Password" htmlFor="confirmPassword">
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPassword}
            onToggleShow={() => setShowConfirmPassword((prev) => !prev)}
          />
        </Field>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  show,
  onToggleShow,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={id === "currentPassword" ? "current-password" : "new-password"}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-brand-primary sm:text-base"
      />

      <button
        type="button"
        onClick={onToggleShow}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
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