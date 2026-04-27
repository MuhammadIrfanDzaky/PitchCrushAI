import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { AnalysisResult } from "@/lib/types/analysis";

/* ─── Input allowlists ──────────────────────────────────────────── */

const VALID_CONTEXTS = new Set([
  "recruiter",
  "client",
  "dating",
  "business",
  "friendship",
  "family",
  "negotiation",
  "general",
]);

const VALID_GOALS = new Set([
  "understand",
  "win_deal",
  "reply_smart",
  "spot_manipulation",
  "improve_chances",
]);

/* ─── Zod schema for AI response ────────────────────────────────── */

const ToneVariantSchema = z.enum(["amber", "blue", "emerald", "slate", "purple", "red"]);

const AnalysisResultSchema = z.object({
  surfaceMeaning: z.string().min(1),
  hiddenIntent: z.string().min(1),
  interestScore: z.number().int().min(0).max(100),
  powerDynamic: z.object({
    label: z.string().min(1),
    senderScore: z.number().int().min(0).max(100),
    description: z.string().min(1),
  }),
  emotionalTone: z
    .array(z.object({ label: z.string().min(1), variant: ToneVariantSchema }))
    .min(1)
    .max(5),
  redFlags: z
    .array(z.object({ flag: z.string().min(1), detail: z.string() }))
    .max(5),
  evidence: z
    .array(z.object({ phrase: z.string().min(1), meaning: z.string().min(1) }))
    .min(1)
    .max(5),
  recommendedReply: z.string().min(1),
  confidenceScore: z.number().int().min(0).max(100),
});

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
  "evidence": [
    { "phrase": "exact words from the message", "meaning": "what this specific wording reveals about intent or emotion" }
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
- evidence: 3–5 items. Quote exact words or short phrases from the message. For each, explain what the specific word choice reveals — e.g. hedging language, power signals, emotional leakage, deliberate ambiguity. Be precise and analytical.
- confidenceScore: integer 0–100. Your confidence in this analysis given available context.
- Return ONLY the JSON object. No markdown, no code fences, no explanation outside the JSON.`;

/* ─── Parse JSON with fallback strategies ───────────────────────── */

function parseJSON(text: string): unknown {
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
  // Parse and validate request body
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const bodySchema = z.object({
    message: z.string(),
    context: z.string().optional(),
    goal: z.string().optional(),
  });

  const bodyParse = bodySchema.safeParse(rawBody);
  if (!bodyParse.success) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { message, context: rawContext, goal: rawGoal } = bodyParse.data;

  // Validate message
  if (!message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.trim().length > 2000) {
    return NextResponse.json(
      { error: "Message exceeds the 2000 character limit." },
      { status: 400 }
    );
  }

  // Validate context and goal against allowlists
  const context = VALID_CONTEXTS.has(rawContext ?? "") ? (rawContext as string) : "general";
  const goal = VALID_GOALS.has(rawGoal ?? "") ? (rawGoal as string) : "understand";

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not set");
    return NextResponse.json({ error: "Service not configured." }, { status: 401 });
  }

  const userPrompt = `Context: ${context}
Goal: ${goal}

Message to analyze:
"""
${message.trim()}
"""`;

  // Abort controller for 25 second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25_000);

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error("OpenRouter error:", openRouterRes.status, errText);

      if (openRouterRes.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      if (openRouterRes.status === 401 || openRouterRes.status === 403) {
        return NextResponse.json(
          { error: "Authentication error. Service not configured correctly." },
          { status: 401 }
        );
      }
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

    // Parse raw text → JSON
    let parsed: unknown;
    try {
      parsed = parseJSON(rawContent);
    } catch {
      console.error("JSON parse failed for content:", rawContent.slice(0, 300));
      return NextResponse.json(
        { error: "AI returned an unreadable response. Please try again." },
        { status: 422 }
      );
    }

    // Zod schema validation
    const validated = AnalysisResultSchema.safeParse(parsed);
    if (!validated.success) {
      console.error("Schema validation failed:", validated.error.flatten());
      return NextResponse.json(
        { error: "AI response did not match expected structure. Please try again." },
        { status: 422 }
      );
    }

    const result: AnalysisResult = validated.data;
    return NextResponse.json({ result });
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Analysis timed out. Please try again." },
        { status: 504 }
      );
    }

    console.error("Analyze route error:", err);
    return NextResponse.json(
      { error: "Failed to analyze message. Please try again." },
      { status: 500 }
    );
  }
}
