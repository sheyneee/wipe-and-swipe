import { requireAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await requireAdminSession();

  if (session.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  return (
    <div>
      Users page
    </div>
  );
}