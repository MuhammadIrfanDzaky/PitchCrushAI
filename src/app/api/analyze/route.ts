import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { AnalysisResult } from "@/lib/types/analysis";
import { generateFallbackAnalysis } from "@/lib/fallback-analysis";

/* ─── Input allowlists ──────────────────────────────────────────── */

const VALID_CONTEXTS = new Set([
  "investor",
  "customer",
  "competitor",
  "demo_day",
  "cold_email",
  "board",
  "yc_accel",
  "general",
  "incumbent_kill",
]);

const VALID_GOALS = new Set([
  // Investor
  "find_funding_weaknesses",
  "prep_investor_questions",
  "strengthen_traction",
  "clarify_business_model",
  // Customer
  "increase_customer_urgency",
  "improve_value_prop",
  "reduce_buyer_skepticism",
  "sharpen_pain_statement",
  // Competitor
  "expose_moat_gaps",
  "find_attack_angles",
  "strengthen_positioning",
  "identify_copy_risks",
  // Demo Day
  "sharpen_opening_hook",
  "improve_narrative_flow",
  "strengthen_closing_line",
  "reduce_jargon",
  // Cold Email
  "improve_reply_rate",
  "sharpen_first_line",
  "strengthen_cta",
  "reduce_spam_signals",
  // Board
  "surface_strategic_risks",
  "improve_revenue_confidence",
  "prep_governance_questions",
  "clarify_execution_plan",
  // YC/Accel
  "test_founder_insight",
  "sharpen_wedge",
  "improve_why_now",
  "strengthen_unfair_advantage",
  // General
  "find_weaknesses",
  "strengthen_pitch",
  "improve_clarity",
  "spot_fatal_flaws",
  // Incumbent Kill
  "expose_incumbent_threats",
  "strengthen_defensibility",
  "find_distribution_risks",
  "improve_moat_story",
  // Legacy
  "prep_questions",
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

/* ─── Per-mode system prompt addenda ───────────────────────────── */

const MODE_ADDENDA: Partial<Record<string, string>> = {
  investor: `## INVESTOR MODE
Analyze from the perspective of a pattern-matching Series A investor evaluating funding readiness.

Focus your critique on:
1. Market sizing — is the TAM credible and the beachhead market specific?
2. Traction signals — is there validated demand (paying customers, revenue, signed LOIs)?
3. Business model — are unit economics defensible at scale?
4. Why now — what macro shift creates the window for this business today?
5. Defensibility — what prevents a well-funded competitor from copying this in 12 months?

- \`likelyInvestorQuestion\`: The one question that exposes the biggest unvalidated funding assumption.
- \`skepticismScore\`: Base at 60–85. Lower only if traction is verified and moat is structurally clear.`,

  customer: `## CUSTOMER MODE
Analyze from the perspective of a skeptical enterprise or SMB buyer evaluating whether to purchase.

Focus your critique on:
1. Urgency — is there a clear reason to act now vs. next quarter?
2. Pain clarity — is the problem stated in terms the buyer actually feels, not founder terms?
3. Willingness to pay — does the value prop justify the implied cost and switching effort?
4. Value prop specificity — are benefits concrete, measurable, and credible?
5. Buyer friction — how hard is it to evaluate, buy, integrate, and justify internally?

- \`likelyInvestorQuestion\`: Reframe as the question a skeptical buyer asks before archiving the email.
- \`customerDoubt\`: Surface 3–5 buying objections a real target customer would raise.`,

  competitor: `## COMPETITOR MODE
Analyze as a well-funded direct competitor identifying attack vectors and positioning weaknesses.

Focus your critique on:
1. Positioning gaps — where is the startup's messaging weakest relative to existing players?
2. Copy risk — which specific features or workflows could be replicated in one sprint?
3. Pricing pressure — can incumbents undercut on price or bundle this as a free feature?
4. Feature parity — what investment would it take for a funded competitor to reach parity?
5. GTM gaps — which customer segments or channels is the startup ignoring?

- \`moatRisk\`: Identify the specific competitive move that would hurt the startup most.
- \`investorRedFlags\`: Frame as competitive vulnerabilities, not just generic investor concerns.`,

  demo_day: `## DEMO DAY MODE
Analyze as if this pitch is being delivered in a 3-minute public demo day setting.

Focus your critique on:
1. Opening hook — does the first sentence capture attention in under 10 seconds?
2. Narrative arc — is the problem → solution → why us flow immediately obvious to a non-expert?
3. Jargon density — what terms would cause a non-technical audience to lose the thread?
4. Traction signal — is there one memorable proof point that sticks after the presentation?
5. Closing hook — does the pitch end with urgency, a bold claim, or a compelling ask?

- \`biggestWeakness\`: Focus on what would cause the audience to mentally check out during the pitch.
- \`strongerRewrite\`: Rewrite as an opening line powerful enough to command the room in 10 seconds.`,

  cold_email: `## COLD EMAIL MODE
Analyze as if this pitch is landing in a cold outreach email to a time-pressured executive.

Focus your critique on:
1. First-line hook — would a recipient read past line one or hit delete?
2. Curiosity triggers — does the email create genuine curiosity or read like a template?
3. CTA clarity — is there a single clear, low-friction next step?
4. Spam signals — which phrases or patterns trigger delete/spam reflexes?
5. Credibility indicators — what proof point or signal makes this feel legitimate?

- \`likelyInvestorQuestion\`: Reframe as: what objection causes the recipient to archive this immediately?
- \`skepticismScore\`: Cold email defaults to high skepticism. Calibrate base at 70–90.`,

  board: `## BOARD MODE
Analyze through the lens of a board director evaluating strategic and governance-level concerns.

Focus your critique on:
1. Revenue visibility — is the path to revenue predictable and capable of being underwritten?
2. Execution risk — where are the biggest operational bottlenecks or single points of failure?
3. Runway — does the plan account for delays, market shifts, and extended sales cycles?
4. Key person risk — what critical hires are missing that could bottleneck execution?
5. Strategic focus — is the company spreading across too many initiatives or is focus crisp?

- \`biggestWeakness\`: Frame as the issue most likely to surface in a board post-mortem at 12 months.
- \`investorRedFlags\`: Prioritize governance and execution risks over purely market-level concerns.`,

  yc_accel: `## YC/ACCEL MODE
Simulate a top accelerator partner (YC, a16z seed, Sequoia Scout) evaluating this for batch admission.

Focus your critique on:
1. Founder insight — does this pitch reveal a non-obvious, hard-won understanding of the market?
2. Execution signal — does traction or product progress show the team can move fast and iterate?
3. Market timing — is there a specific, closing window that makes this business uniquely viable now?
4. Non-obvious advantage — what does this team know or have access to that outsiders cannot easily replicate?
5. Wedge sharpness — is the initial target customer and use case laser-focused, or still too broad?

- \`likelyInvestorQuestion\`: Ask the question that separates generational founders from good-but-not-great ones.
- \`skepticismScore\`: YC weights insight + speed at early stage. Base at 55–80.`,

  incumbent_kill: `## INCUMBENT KILL MODE
Simulate how large, well-resourced incumbents (Salesforce, Google, SAP, Microsoft, or vertical market leaders) would neutralize or crush this startup.

Find every structural advantage incumbents hold that makes this startup's position fragile.

Interrogate:
1. Copyability — which specific features or workflows could an incumbent ship in one product quarter?
2. Distribution advantage — what existing channels, partnerships, or salesforce does the incumbent have that the startup cannot match for years?
3. Pricing power mismatch — can incumbents offer this as a free add-on, feature flag, or bundled tier, effectively pricing the startup to zero?
4. Customer lock-in — how can incumbents leverage existing contracts, data integrations, or compliance requirements to prevent switching?
5. Structural moat weakness — what asymmetric barrier (not just a better UI or faster shipping) prevents this startup from being acqui-killed or out-competed within 24 months?

Rules:
- \`biggestWeakness\`: Identify the single incumbent structural advantage most threatening to this startup's existence.
- \`likelyInvestorQuestion\`: Frame as the hardest question an incumbent-aware investor would ask first.
- \`moatRisk\`: Be brutally specific — name the type of incumbent threat (distribution giant, platform owner, compliance player, ecosystem bundler) most likely to win.
- \`skepticismScore\`: Default 65–90 unless the pitch demonstrates a clear asymmetric advantage incumbents structurally cannot replicate.
- \`investorRedFlags\`: Focus on incumbent-specific threats: platform dependency, distribution lock-out, bundling risk, commoditization.`,
};

/* ─── Context-aware system prompt ───────────────────────────────── */

function getSystemPrompt(context: string): string {
  const addendum = MODE_ADDENDA[context];
  if (!addendum) return SYSTEM_PROMPT;
  return `${SYSTEM_PROMPT}\n\n${addendum}`;
}

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
          { role: "system", content: getSystemPrompt(context) },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 900,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error("OpenRouter error:", openRouterRes.status, errText);
      // Fall through to fallback
      throw new Error(`OpenRouter HTTP ${openRouterRes.status}`);
    }

    const data = await openRouterRes.json();
    const rawContent: string = data.choices?.[0]?.message?.content ?? "";

    if (!rawContent) {
      throw new Error("Empty AI response");
    }

    // Parse raw text → JSON
    let parsed: unknown;
    try {
      parsed = parseJSON(rawContent);
    } catch {
      console.error("JSON parse failed for content:", rawContent.slice(0, 300));
      throw new Error("AI JSON parse failure");
    }

    // Zod schema validation
    const validated = AnalysisResultSchema.safeParse(parsed);
    if (!validated.success) {
      console.error("Schema validation failed:", validated.error.flatten());
      throw new Error("AI schema mismatch");
    }

    const result: AnalysisResult = validated.data;
    return NextResponse.json({ result });
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      console.error("OpenRouter timeout — using fallback");
    } else {
      console.error("Analyze route error — using fallback:", err);
    }

    // Fallback: generate heuristic analysis locally
    const result: AnalysisResult = generateFallbackAnalysis(message, context, goal);
    return NextResponse.json({ result });
  }
}
