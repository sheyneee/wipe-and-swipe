import { requireAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";
import UsersContainer from "@/components/admin/users/UsersContainer";

export default async function UsersPage() {
  const session = await requireAdminSession();

  if (session.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <UsersContainer />
    </main>
  );
}