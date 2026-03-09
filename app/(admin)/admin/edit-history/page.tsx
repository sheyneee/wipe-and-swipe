import { requireAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";
import EditHistoryContainer from "@/components/admin/edit-history/EditHistoryContainer";

export default async function EditHistoryPage() {
  const session = await requireAdminSession();

  if (session.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <EditHistoryContainer />
    </main>
  );
}