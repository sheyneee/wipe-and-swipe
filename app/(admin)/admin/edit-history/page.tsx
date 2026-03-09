import { requireAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";

export default async function EditHistoryPage() {
  const session = await requireAdminSession();

  if (session.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  return (
    <div>
      Edit History page
    </div>
  );
}