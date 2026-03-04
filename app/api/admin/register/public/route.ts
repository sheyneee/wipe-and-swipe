import { ok, fail } from "@/lib/http/response";
import { env } from "@/lib/config/env";
import { HttpError } from "@/lib/http/errors";

type IssueLike = {
  message?: unknown;
  path?: unknown;
};

function isIssueLike(x: unknown): x is IssueLike {
  return typeof x === "object" && x !== null;
}

function getMessageFromUnknown(x: unknown): string | undefined {
  if (typeof x === "string" && x.trim()) return x;

  if (Array.isArray(x)) {
    const lines = x
      .map((item) => {
        if (!isIssueLike(item)) return undefined;

        const msgRaw = item.message;
        const pathRaw = item.path;

        const msg =
          typeof msgRaw === "string"
            ? msgRaw
            : msgRaw != null
            ? String(msgRaw)
            : "";

        const path =
          Array.isArray(pathRaw) && pathRaw.length
            ? pathRaw.map(String).join(".")
            : "";

        if (!msg.trim()) return undefined;
        return path ? `${path}: ${msg}` : msg;
      })
      .filter((v): v is string => Boolean(v));

    if (lines.length) return lines.join("\n");
  }

  if (x && typeof x === "object" && "message" in x) {
    const v = (x as { message?: unknown }).message;
    if (typeof v === "string") return v;
  }

  return undefined;
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "http";
    if (!host) throw new HttpError(500, "Missing host header");

    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-register-secret": env.ADMIN_REGISTER_SECRET,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await res.text();

    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text };
    }

    if (!res.ok) {
      const message =
        getMessageFromUnknown(data) ||
        (text?.trim() ? text : "Registration failed");

      throw new HttpError(res.status, message);
    }

    return ok(data, 201);
  } catch (err) {
    return fail(err);
  }
}