import { NextRequest, NextResponse } from "next/server";
import type { AnalyzeRequest, AnalysisResult } from "@/lib/types/analysis";

/* ─── System prompt ────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are SubtextAI — an expert in conversational psychology, negotiation dynamics, emotional intelligence, social signaling, and hidden intent analysis.

The user will provide a message along with context (e.g. recruiter, client, dating) and their goal (e.g. understand them, win the deal).

Analyze the message deeply and return ONLY valid JSON with this exact structure:

{
  "surfaceMeaning": "What the message literally says in one sentence",
  "hiddenIntent": "2-3 sentence paragraph on the sender's true motive, subtext, and what they're not saying",
  "interestScore": 0,
  "powerDynamic": {
    "label": "Short label, e.g. 'Sender holds advantage' or 'Balanced dynamic'",
    "senderScore": 50,
    "description": "1-2 sentence explanation of the power balance and why"
  },
  "emotionalTone": [
    { "label": "Tone word", "variant": "amber" }
  ],
  "redFlags": [
    { "flag": "Short flag name", "detail": "Why this is a red flag in one sentence" }
  ],
  "recommendedReply": "A specific, strategic reply the user should send — written as if they are sending it",
  "confidenceScore": 0
}

Rules:
- interestScore: integer 0–100. Higher = sender is more genuinely interested or engaged.
- powerDynamic.senderScore: integer 0–100. 100 = sender has full leverage. 50 = balanced. 0 = receiver has full leverage.
- emotionalTone: 2–5 items. Choose the variant that best fits each tone:
  amber = guarded/cautious/uncertain
  blue = analytical/calculated/detached
  emerald = positive/warm/interested
  slate = neutral/formal/professional
  purple = strategic/manipulative/evasive
  red = hostile/aggressive/dismissive
- redFlags: 0–5 items. Only flag genuine communication red flags. Return empty array if none.
- confidenceScore: integer 0–100. Your confidence in this analysis given available context.
- Return ONLY the JSON object. No markdown, no code fences, no explanation outside the JSON.`;

/* ─── Input sanitisation helpers ───────────────────────────────── */

function clamp(n: unknown, min: number, max: number): number {
  const num = typeof n === "number" ? n : parseInt(String(n), 10);
  if (isNaN(num)) return min;
  return Math.min(max, Math.max(min, Math.round(num)));
}

const VALID_VARIANTS = new Set(["amber", "blue", "emerald", "slate", "purple", "red"]);

function sanitizeResult(raw: Record<string, unknown>): AnalysisResult {
  const tone = Array.isArray(raw.emotionalTone)
    ? (raw.emotionalTone as Array<{ label?: unknown; variant?: unknown }>)
        .filter((t) => t && typeof t.label === "string")
        .map((t) => ({
          label: String(t.label),
          variant: VALID_VARIANTS.has(String(t.variant)) ? String(t.variant) : "slate",
        }))
        .slice(0, 5)
    : [];

  const redFlags = Array.isArray(raw.redFlags)
    ? (raw.redFlags as Array<{ flag?: unknown; detail?: unknown }>)
        .filter((f) => f && typeof f.flag === "string")
        .map((f) => ({ flag: String(f.flag), detail: String(f.detail ?? "") }))
        .slice(0, 5)
    : [];

  const pd = raw.powerDynamic && typeof raw.powerDynamic === "object"
    ? (raw.powerDynamic as Record<string, unknown>)
    : {};

  return {
    surfaceMeaning: String(raw.surfaceMeaning ?? ""),
    hiddenIntent: String(raw.hiddenIntent ?? ""),
    interestScore: clamp(raw.interestScore, 0, 100),
    powerDynamic: {
      label: String(pd.label ?? "Balanced dynamic"),
      senderScore: clamp(pd.senderScore, 0, 100),
      description: String(pd.description ?? ""),
    },
    emotionalTone: tone,
    redFlags,
    recommendedReply: String(raw.recommendedReply ?? ""),
    confidenceScore: clamp(raw.confidenceScore, 0, 100),
  } as AnalysisResult;
}

/* ─── Parse JSON with fallback strategies ───────────────────────── */

function parseJSON(text: string): Record<string, unknown> {
  // 1. Direct parse
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }
  // 2. Strip markdown code fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {
      // continue
    }
  }
  // 3. Extract first {...} block
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch {
      // continue
    }
  }
  throw new Error("Could not parse AI response as JSON");
}

/* ─── Route handler ─────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  // Parse request body
  let body: AnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { message, context, goal } = body;

  // Validate required fields
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.trim().length > 2000) {
    return NextResponse.json({ error: "Message exceeds the 2000 character limit." }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not set");
    return NextResponse.json({ error: "Service not configured." }, { status: 500 });
  }

  const userPrompt = `Context: ${context || "general"}
Goal: ${goal || "understand"}

Message to analyze:
"""
${message.trim()}
"""`;

  try {
    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://subtextai.com",
        "X-Title": "SubtextAI",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.7-sonnet",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error("OpenRouter error:", openRouterRes.status, errText);
      return NextResponse.json(
        { error: "AI service returned an error. Please try again." },
        { status: 502 }
      );
    }

    const data = await openRouterRes.json();
    const rawContent: string = data.choices?.[0]?.message?.content ?? "";

    if (!rawContent) {
      return NextResponse.json({ error: "Empty response from AI service." }, { status: 502 });
    }

    const parsed = parseJSON(rawContent);
    const result = sanitizeResult(parsed);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Analyze route error:", err);
    return NextResponse.json(
      { error: "Failed to analyze message. Please try again." },
      { status: 500 }
    );
  }
}
