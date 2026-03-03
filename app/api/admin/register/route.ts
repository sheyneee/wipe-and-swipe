import { ok, fail } from "@/lib/http/response";
import { env } from "@/lib/config/env";
import { HttpError } from "@/lib/http/errors";
import { handleCreateAdmin } from "@/modules/admin/admin.controller";

export async function POST(req: Request) {
  try {
    // Gate admin creation behind a shared secret (server-side env var)
    const secret =
      req.headers.get("x-admin-register-secret") ||
      req.headers.get("X-Admin-Register-Secret") ||
      "";

    if (!secret || secret !== env.ADMIN_REGISTER_SECRET) {
      throw new HttpError(403, "Forbidden");
    }

    const data = await handleCreateAdmin(req);
    return ok(data, 201);
  } catch (err) {
    return fail(err);
  }
}