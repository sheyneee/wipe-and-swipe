import { getAdminSession } from "@/lib/auth/admin-session";
import AdminNavbarBody from "./AdminNavbarBody";

export default async function AdminNavbar() {
  const session = await getAdminSession();

  if (!session) return null;

  return <AdminNavbarBody role={session.role} />;
}