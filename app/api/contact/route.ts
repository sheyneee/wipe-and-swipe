import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

// Always send to this inbox
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "wipeandswipecs@gmail.com";

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

function isOptionalString(v: unknown): v is string | undefined {
  return v === undefined || typeof v === "string";
}

function isContactPayload(x: unknown): x is ContactPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;

  return (
    isNonEmptyString(o.name) &&
    isNonEmptyString(o.email) &&
    isNonEmptyString(o.subject) &&
    isNonEmptyString(o.message) &&
    isOptionalString(o.phone)
  );
}

export async function POST(req: Request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured. Missing RESEND_API_KEY." },
        { status: 500 }
      );
    }

    // Create client only when key exists
    const resend = new Resend(RESEND_API_KEY);

    const body: unknown = await req.json().catch(() => null);
    if (!isContactPayload(body)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    // You must use a sender you have verified in Resend.
    // For production, CONTACT_FROM_EMAIL should be a verified domain sender (hello@wipeandswipe.co.nz).
    const from = `Wipe & Swipe <${CONTACT_FROM_EMAIL}>`;

    await resend.emails.send({
      from,
      to: [CONTACT_TO_EMAIL],
      replyTo: body.email,
      subject: `[Contact] ${body.subject.trim()}`,
      text: [
        `Name: ${body.name.trim()}`,
        `Email: ${body.email.trim()}`,
        `Phone: ${(body.phone ?? "").trim() || "-"}`,
        "",
        body.message.trim(),
      ].join("\n"),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}