/**
 * POST /api/ai — AI-ready stub endpoint gated by OPENAI_API_KEY or ANTHROPIC_API_KEY.
 */

import { NextResponse } from "next/server";
import { AI_SYSTEM_PROMPT, SITE_NAME } from "@/lib/constants";
import type { AiRequestBody } from "@/types";

function isAiEnabled(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY?.trim() || process.env.ANTHROPIC_API_KEY?.trim(),
  );
}

export async function POST(request: Request) {
  if (!isAiEnabled()) {
    return NextResponse.json(
      {
        error: "AI assistant is not configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Partial<AiRequestBody>;
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const context = typeof body.context === "string" ? body.context.trim() : "";

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    // Stub response — swap for OpenAI or Anthropic SDK with minimal changes.
    const systemPrompt = `${AI_SYSTEM_PROMPT}${context || "General portfolio overview."}`;
    const reply = `[${SITE_NAME} AI — stub] Received your question. Connect OpenAI or Anthropic SDK to enable live responses.\n\nSystem: ${systemPrompt.slice(0, 120)}…\n\nUser: ${prompt}`;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[ai]", error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
