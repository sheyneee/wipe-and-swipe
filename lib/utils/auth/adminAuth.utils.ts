export function isNonEmpty(v: string) {
  return v.trim().length > 0;
}

export function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}

export function extractApiMessage(raw: unknown): string | undefined {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;

    try {
      const parsed = JSON.parse(trimmed);
      return extractApiMessage(parsed);
    } catch {
      return trimmed;
    }
  }

  if (Array.isArray(raw)) {
    const lines = raw
      .map((it) => {
        if (!it || typeof it !== "object") return undefined;

        const msgRaw =
          "message" in it ? (it as { message?: unknown }).message : undefined;

        const msg =
          typeof msgRaw === "string"
            ? msgRaw.trim()
            : msgRaw != null
            ? String(msgRaw).trim()
            : "";

        if (!msg) return undefined;
        return msg;
      })
      .filter((v): v is string => Boolean(v));

    return lines.length ? lines.join("\n") : undefined;
  }

  if (raw && typeof raw === "object") {
    if ("message" in raw) {
      const v = (raw as { message?: unknown }).message;
      const nested = extractApiMessage(v);
      if (nested) return nested;
      if (typeof v === "string" && v.trim()) return v.trim();
      if (v != null) return String(v);
    }

    if ("error" in raw) {
      const v = (raw as { error?: unknown }).error;
      const nested = extractApiMessage(v);
      if (nested) return nested;
      if (typeof v === "string" && v.trim()) return v.trim();
      if (v != null) return String(v);
    }

    if ("issues" in raw) {
      return extractApiMessage((raw as { issues?: unknown }).issues);
    }

    if ("errors" in raw) {
      return extractApiMessage((raw as { errors?: unknown }).errors);
    }
  }

  return undefined;
}

export async function parseResponse(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
}