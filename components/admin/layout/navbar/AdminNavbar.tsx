import { cookies } from "next/headers";
import AdminNavbarClient from "./AdminNavbarBody";

export default async function AdminNavbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) return null;

  return <AdminNavbarClient />;
}