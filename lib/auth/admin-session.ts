import { cookies } from "next/headers";

export async function hasAdminToken() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("admin_token")?.value);
}