import { requireAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";
import UsersContainer from "@/components/admin/users/UsersContainer";

export default async function UsersPage() {
  const session = await requireAdminSession();

  if (session.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  return <UsersContainer />;
}