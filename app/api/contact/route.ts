import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

// Always send to this inbox
const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL ?? "wipeandswipecs@gmail.com";

type ContactPayload = {
  name: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isOptionalNonEmptyString(v: unknown): v is string | undefined {
  return v === undefined || isNonEmptyString(v);
}

function isContactPayload(x: unknown): x is ContactPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;

  return (
    isNonEmptyString(o.name) &&
    isNonEmptyString(o.email) &&
    isNonEmptyString(o.subject) &&
    isNonEmptyString(o.message) &&
    isOptionalNonEmptyString(o.phone)
  );
}

/**
 * Very small in-memory rate limit (best-effort).
 * Note. In serverless this may reset between invocations.
 */
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_HITS = 10;

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (!xf) return "unknown";
  return xf.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured. Missing RESEND_API_KEY." },
        { status: 500 }
      );
    }

    // Rate limit
    const ip = getClientIp(req);
    const now = Date.now();
    const prev = hits.get(ip);

    if (!prev || now - prev.ts > WINDOW_MS) {
      hits.set(ip, { count: 1, ts: now });
    } else {
      prev.count += 1;
      if (prev.count > MAX_HITS) {
        return NextResponse.json(
          { error: "Too many requests. Please try again shortly." },
          { status: 429 }
        );
      }
    }

    const resend = new Resend(RESEND_API_KEY);

    const body: unknown = await req.json().catch(() => null);
    if (!isContactPayload(body)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    // NOTE: Without a domain, keep using onboarding@resend.dev for FROM.
    // TO can be your Gmail inbox.
    const from = `Wipe & Swipe <${CONTACT_FROM_EMAIL}>`;

    const result = await resend.emails.send({
      from,
      to: [CONTACT_TO_EMAIL],
      replyTo: body.email.trim(), // clicking reply goes to the customer
      subject: `[Contact] ${body.subject.trim()}`,
      text: [
        `Name: ${body.name.trim()}`,
        `Email: ${body.email.trim()}`,
        `Phone: ${(body.phone ?? "").trim() || "-"}`,
        "",
        body.message.trim(),
      ].join("\n"),
    });

    return NextResponse.json(
      { ok: true, id: result.data?.id ?? null },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}