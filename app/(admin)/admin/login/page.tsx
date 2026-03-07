import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session";
import AdminAuthCard from "@/components/admin/auth/AdminAuthCard";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return <AdminAuthCard />;
}