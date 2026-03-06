import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { HttpError } from "@/lib/http/errors";

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    return verifyAdminToken(token);
  } catch {
    throw new HttpError(401, "Unauthorized");
  }
}