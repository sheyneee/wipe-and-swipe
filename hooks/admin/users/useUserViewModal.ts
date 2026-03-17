"use client";

import { useState } from "react";
import type { AdminUser } from "@/components/admin/users/UsersTable";

export function useUserViewModal() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  function openView(user: AdminUser) {
    setSelectedUser(user);
    setIsViewOpen(true);
  }

  function closeView() {
    setIsViewOpen(false);
    setSelectedUser(null);
  }

  return {
    selectedUser,
    isViewOpen,
    openView,
    closeView,
  };
}