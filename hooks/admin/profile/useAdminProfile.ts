"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  normalizeEmail,
  normalizeOptionalText,
  normalizeRequiredText,
  validatePasswordChange,
  validateProfileDetails,
} from "@/lib/utils/admin/profile/profile.utils";

export type AdminProfile = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  emailVerified?: boolean;
};

type SaveProfilePayload = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
};

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    void fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/profile", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load profile");
      }

      setProfile(data);
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Failed to load profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(payload: SaveProfilePayload) {
    const normalizedPayload = {
      firstName: normalizeRequiredText(payload.firstName),
      middleName: normalizeOptionalText(payload.middleName ?? ""),
      lastName: normalizeRequiredText(payload.lastName),
      email: normalizeEmail(payload.email),
    };

    const validationError = validateProfileDetails(normalizedPayload);

    if (validationError) {
      await Swal.fire("Error", validationError, "error");
      return false;
    }

    const emailChanged =
      normalizeEmail(profile?.email ?? "") !== normalizedPayload.email;

    const result = await Swal.fire({
      title: emailChanged ? "Save profile and change email?" : "Save profile changes?",
      text: emailChanged
        ? "Your email will be updated and you will need to verify the new email address again."
        : "Your profile details will be updated.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#296276",
    });

    if (!result.isConfirmed) return false;

    try {
      setSavingProfile(true);

      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(normalizedPayload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: data.firstName,
              middleName: data.middleName ?? "",
              lastName: data.lastName,
              email: data.email,
              emailVerified: data.emailVerified,
            }
          : prev
      );

      await Swal.fire({
        icon: "success",
        title: data.emailChanged ? "Profile updated" : "Profile updated",
        text: data.emailChanged
          ? "Your profile was updated. Your new email must be verified again, and a verification email has been sent."
          : "Your profile details were updated successfully.",
        confirmButtonColor: "#296276",
      });

      return true;
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Failed to update profile",
        "error"
      );
      return false;
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(payload: ChangePasswordPayload) {
    const validationError = validatePasswordChange(payload);

    if (validationError) {
      await Swal.fire("Error", validationError, "error");
      return false;
    }

    const result = await Swal.fire({
      title: "Change password?",
      text: "Your password will be updated immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Update Password",
      confirmButtonColor: "#296276",
    });

    if (!result.isConfirmed) return false;

    try {
      setSavingPassword(true);

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to change password");
      }

      await Swal.fire({
        icon: "success",
        title: "Password changed",
        text: "Your password was updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Failed to change password",
        "error"
      );
      return false;
    } finally {
      setSavingPassword(false);
    }
  }

  return {
    profile,
    loading,
    savingProfile,
    savingPassword,
    fetchProfile,
    handleSaveProfile,
    handleChangePassword,
  };
}