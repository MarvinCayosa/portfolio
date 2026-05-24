/**
 * POST /api/contact — validates and persists contact form submissions to Firestore.
 */

import { NextResponse } from "next/server";
import { getFirebaseServices } from "@/lib/db";
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

    // Persist to Firestore "messages" collection
    try {
      const { firestore } = getFirebaseServices();
      await firestore.collection("messages").add({
        ...result.data,
        createdAt: Date.now(),
        read: false,
      });
    } catch (dbErr) {
      // Log but don't fail the request — message is still acknowledged
      console.error("[contact] Firestore write failed:", dbErr);
    }

    return NextResponse.json(
      { success: true, message: "Contact request received." },
      { status: 202 },
    );
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Failed to process message." },
      { status: 500 },
    );
  }
}
