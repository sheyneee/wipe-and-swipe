import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  name: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
};

function isContactPayload(x: unknown): x is ContactPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    typeof o.email === "string" &&
    typeof o.subject === "string" &&
    typeof o.message === "string" &&
    (o.phone === undefined || typeof o.phone === "string")
  );
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (!isContactPayload(body)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const to = process.env.CONTACT_TO_EMAIL || "wipeandswipecs@gmail.com";

    await resend.emails.send({
      from: "Wipe & Swipe <onboarding@resend.dev>", // test sender from Resend docs
      to: [to],
      replyTo: body.email, // so you can hit "Reply" and it goes to the customer
      subject: `[Contact] ${body.subject}`,
      text: [
        `Name: ${body.name}`,
        `Email: ${body.email}`,
        `Phone: ${body.phone || "-"}`,
        "",
        body.message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}