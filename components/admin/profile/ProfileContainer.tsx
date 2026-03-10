"use client";

import { useState } from "react";
import ProfileDetailsView from "./ProfileDetailsView";
import ProfileDetailsForm from "./modal/ProfileDetailsForm";
import ChangePasswordForm from "./modal/ChangePasswordForm";
import { useAdminProfile } from "@/hooks/admin/profile/useAdminProfile";

export type { AdminProfile } from "@/hooks/admin/profile/useAdminProfile";

type ActiveModal = "edit-profile" | "change-password" | null;

export default function ProfileContainer() {
  const {
    profile,
    loading,
    savingProfile,
    savingPassword,
    handleSaveProfile,
    handleChangePassword,
  } = useAdminProfile();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  function closeModal() {
    if (savingProfile || savingPassword) return;
    setActiveModal(null);
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
          <p className="text-red-600">Unable to load profile.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="mt-2 text-gray-600">
            View and manage your admin profile details and password.
          </p>
        </div>

        <ProfileDetailsView
          profile={profile}
          onEditProfile={() => setActiveModal("edit-profile")}
          onChangePassword={() => setActiveModal("change-password")}
        />
      </section>

      {activeModal === "edit-profile" && (
        <Modal title="Edit Profile" onClose={closeModal}>
          <ProfileDetailsForm
            key={`${profile.id}-${profile.email}-${profile.firstName}-${profile.lastName}-${profile.middleName ?? ""}`}
            profile={profile}
            saving={savingProfile}
            onSave={async (payload) => {
              const success = await handleSaveProfile(payload);
              if (success) setActiveModal(null);
              return success;
            }}
          />
        </Modal>
      )}

      {activeModal === "change-password" && (
        <Modal title="Change Password" onClose={closeModal}>
          <ChangePasswordForm
            saving={savingPassword}
            onSave={async (payload) => {
              const success = await handleChangePassword(payload);
              if (success) setActiveModal(null);
              return success;
            }}
          />
        </Modal>
      )}
    </>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}