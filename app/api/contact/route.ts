/**
 * POST /api/contact — validates and persists contact form submissions.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { ContactFormData } from "@/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateBody(
  body: unknown,
): { ok: true; data: ContactFormData } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return { ok: false, error: "Name is required" };
  }
  if (typeof email !== "string" || !emailPattern.test(email)) {
    return { ok: false, error: "Valid email is required" };
  }
  if (typeof message !== "string" || !message.trim()) {
    return { ok: false, error: "Message is required" };
  }

  return {
    ok: true,
    data: { name: name.trim(), email: email.trim(), message: message.trim() },
  };
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = validateBody(body);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const contact = await prisma.contact.create({ data: result.data });

    return NextResponse.json(
      { success: true, id: contact.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Failed to save message. Check database connection." },
      { status: 500 },
    );
  }
}
