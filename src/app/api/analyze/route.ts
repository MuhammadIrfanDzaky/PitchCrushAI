import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { AnalysisResult } from "@/lib/types/analysis";

/* ─── Input allowlists ──────────────────────────────────────────── */

const VALID_CONTEXTS = new Set([
  "investor",
  "customer",
  "competitor",
  "demo_day",
  "cold_email",
  "board",
  "yc_interview",
  "general",
]);

const VALID_GOALS = new Set([
  "find_weaknesses",
  "strengthen_pitch",
  "prep_questions",
  "spot_fatal_flaws",
  "improve_clarity",
]);

/* ─── Zod schema for AI response ────────────────────────────────── */

const DoubtVariantSchema = z.enum(["amber", "blue", "emerald", "slate", "purple", "red"]);

const AnalysisResultSchema = z.object({
  likelyInvestorQuestion: z.string().min(1),
  biggestWeakness: z.string().min(1),
  skepticismScore: z.number().int().min(0).max(100),
  clarityScore: z.number().int().min(0).max(100),
  moatRisk: z.object({
    label: z.string().min(1),
    riskScore: z.number().int().min(0).max(100),
    description: z.string().min(1),
  }),
  customerDoubt: z
    .array(z.object({ label: z.string().min(1), variant: DoubtVariantSchema }))
    .min(1)
    .max(5),
  investorRedFlags: z
    .array(z.object({ flag: z.string().min(1), detail: z.string() }))
    .max(5),
  weakPhrases: z
    .array(z.object({ phrase: z.string().min(1), meaning: z.string().min(1) }))
    .min(1)
    .max(5),
  strongerRewrite: z.string().min(1),
  confidenceScore: z.number().int().min(0).max(100),
});

/* ─── System prompt ────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are PitchCrush AI — a brutally honest pitch critic that simulates how investors, customers, and competitors will tear apart a startup pitch.

You think like a pattern-matching Series A VC who has heard 10,000 pitches, a skeptical enterprise buyer who has been burned by vendor hype, and a well-funded competitor who knows every weakness in the market.

The user will provide a pitch (one-liner, cold email, deck summary, investor memo, or sales pitch) along with context (e.g. investor, customer, demo_day) and their goal (e.g. find_weaknesses, prep_questions).

Analyze the pitch ruthlessly and return ONLY valid JSON with this exact structure:

{
  "likelyInvestorQuestion": "The single hardest question an investor would ask first — as if they're interrupting mid-pitch",
  "biggestWeakness": "2-3 sentence paragraph on the most critical flaw: what assumption is unproven, what is glossed over, what would kill the deal",
  "skepticismScore": 0,
  "clarityScore": 0,
  "moatRisk": {
    "label": "Short label, e.g. 'Easily replicated' or 'Defensible niche'",
    "riskScore": 50,
    "description": "1-2 sentence explanation of how defensible the moat is and what threatens it"
  },
  "customerDoubt": [
    { "label": "Doubt phrase", "variant": "amber" }
  ],
  "investorRedFlags": [
    { "flag": "Short flag name", "detail": "Why this is a red flag for investors in one sentence" }
  ],
  "weakPhrases": [
    { "phrase": "exact words from the pitch", "meaning": "what this phrase signals to an investor — vagueness, hype, defensiveness, or missing proof" }
  ],
  "strongerRewrite": "A rewritten version of the core pitch that fixes the biggest weakness and sounds fundable — written as if the founder is saying it",
  "confidenceScore": 0
}

Rules:
- skepticismScore: integer 0–100. Higher = investors will be more skeptical. 90+ = this pitch will likely get passed. Under 30 = compelling case.
- clarityScore: integer 0–100. Higher = pitch is clearer and more compelling. Under 40 = confusing or vague. 80+ = crisp and fundable.
- moatRisk.riskScore: integer 0–100. 100 = zero moat, easily copied. 0 = extremely defensible.
- customerDoubt: 2–5 tags. What specific doubts would a target customer have? Choose variant:
  amber = feasibility concern
  blue = trust/credibility gap
  emerald = actually interested but cautious
  slate = neutral, needs more info
  purple = suspects vendor lock-in or hidden costs
  red = strong objection or dealbreaker concern
- investorRedFlags: 0–5 items. Only flag genuine investor-level red flags: no moat, unproven assumptions, competitive blindspots, team gaps, market sizing errors.
- weakPhrases: 3–5 items. Quote exact words from the pitch that would make investors cringe or disengage — buzzwords, vague claims, unsupported numbers, passive hedges.
- strongerRewrite: Make it specific, defensible, and compelling. Lead with traction or insight if possible.
- confidenceScore: integer 0–100. Your confidence in this critique given available context.
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
    return NextResponse.json({ error: "Pitch text is required." }, { status: 400 });
  }
  if (message.trim().length > 2000) {
    return NextResponse.json(
      { error: "Pitch exceeds the 2000 character limit." },
      { status: 400 }
    );
  }

  // Validate context and goal against allowlists
  const context = VALID_CONTEXTS.has(rawContext ?? "") ? (rawContext as string) : "general";
  const goal = VALID_GOALS.has(rawGoal ?? "") ? (rawGoal as string) : "find_weaknesses";

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not set");
    return NextResponse.json({ error: "Service not configured." }, { status: 401 });
  }

  const userPrompt = `Context: ${context}
Goal: ${goal}

Pitch to stress test:
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
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://pitchcrush.ai",
        "X-Title": "PitchCrush AI",
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
      { error: "Failed to analyze pitch. Please try again." },
      { status: 500 }
    );
  }
}
