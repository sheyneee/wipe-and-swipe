import jwt from "jsonwebtoken";
import { env } from "@/lib/config/env";
import { HttpError } from "@/lib/http/errors";

export type AdminTokenPayload = {
  userId: string;
  role: "ADMIN";
};

export function signAdminToken(userId: string) {
  const payload: AdminTokenPayload = { userId, role: "ADMIN" };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function requireAdmin(req: Request): AdminTokenPayload {
  const auth = req.headers.get("authorization") || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;

    if (payload.role !== "ADMIN" || !payload.userId) {
      throw new HttpError(403, "Forbidden");
    }

    return payload;
  } catch {
    throw new HttpError(401, "Unauthorized");
  }
}