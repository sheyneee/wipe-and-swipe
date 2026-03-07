import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { HttpError } from "@/lib/http/errors";
import { dbConnect } from "@/lib/db/mongodb";
import { Admin } from "@/modules/admin/admin.model";
import { redirect } from "next/navigation";

type RequireAdminSessionOptions = {
  redirectToLogin?: boolean;
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    const payload = verifyAdminToken(token);

    await dbConnect();

    const admin = await Admin.findById(payload.userId)
      .select("role status")
      .lean();

    if (!admin) return null;

    if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") {
      return null;
    }

    if (admin.status !== "ACTIVE") {
      return null;
    }

    return {
      userId: payload.userId,
      role: admin.role,
      status: admin.status,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession(
  options: RequireAdminSessionOptions = {}
) {
  const { redirectToLogin = true } = options;

  const session = await getAdminSession();

  if (!session) {
    if (redirectToLogin) redirect("/admin/login");
    throw new HttpError(401, "Unauthorized");
  }

  return session;
}