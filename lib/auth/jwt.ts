import jwt from "jsonwebtoken";
import { env } from "@/lib/config/env";
import { HttpError } from "@/lib/http/errors";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";
export type AdminStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

export type AdminTokenPayload = {
  userId: string;
  role: AdminRole;
  status: AdminStatus;
};

export function signAdminToken(args: { userId: string; role: AdminRole; status: AdminStatus }) {
  const payload: AdminTokenPayload = {
    userId: args.userId,
    role: args.role,
    status: args.status,
  };

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

function getBearerToken(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    throw new HttpError(401, "Unauthorized");
  }

  return token;
}

export function requireAdmin(req: Request): AdminTokenPayload {
  const token = getBearerToken(req);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;

    // Any logged-in admin
    if (!payload?.userId) throw new HttpError(403, "Forbidden");
    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") throw new HttpError(403, "Forbidden");

    return payload;
  } catch {
    throw new HttpError(401, "Unauthorized");
  }
}

export function requireSuperAdmin(req: Request): AdminTokenPayload {
  const payload = requireAdmin(req);
  if (payload.role !== "SUPER_ADMIN") throw new HttpError(403, "Forbidden");
  return payload;
}