"use client";

import UsersTable from "@/components/admin/users/UsersTable";
import { useAdminUsers } from "@/hooks/admin/users/useAdminUsers";

export default function UsersContainer() {
  const { users, loading, handleStatusChange, handleDeleteUser } = useAdminUsers();

  return (
    <section className="space-y-6">
      <UsersTable
        users={users}
        loading={loading}
        onStatusChange={handleStatusChange}
        onDeleteUser={handleDeleteUser}
      />
    </section>
  );
}