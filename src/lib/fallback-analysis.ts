import type { AnalysisResult, DoubtTag, InvestorRedFlag, WeakPhrase } from "./types/analysis";

/* ─── Phrase database ───────────────────────────────────────────── */

const KNOWN_WEAK_PHRASES: Array<{ phrase: string; meaning: string }> = [
  {
    phrase: "ai-powered",
    meaning:
      "Overused qualifier that signals commodity positioning — investors hear this in every deck without differentiation.",
  },
  {
    phrase: "cutting-edge",
    meaning:
      "Empty superlative with no supporting evidence of technical differentiation.",
  },
  {
    phrase: "revolutionary",
    meaning:
      "A claim, not a proof — experienced investors are trained to distrust self-applied superlatives.",
  },
  {
    phrase: "game-changing",
    meaning:
      "Signals the founder may be more excited about the idea than its market-fit reality.",
  },
  {
    phrase: "disruptive",
    meaning:
      "Overused since Christensen. Without specifics, it reads as a gap in competitive analysis.",
  },
  {
    phrase: "innovative",
    meaning:
      "Table-stakes framing — every pitch says this, so it differentiates nothing.",
  },
  {
    phrase: "seamless",
    meaning:
      "A UX adjective masquerading as a business insight. What makes integration actually seamless?",
  },
  {
    phrase: "scalable",
    meaning:
      "Every SaaS product is theoretically scalable. This doesn't address go-to-market reality.",
  },
  {
    phrase: "best-in-class",
    meaning:
      "Self-declared quality signal with no benchmark provided for comparison.",
  },
  {
    phrase: "world-class",
    meaning: "Unverifiable superlative. Against what benchmark, measured by whom?",
  },
  {
    phrase: "proprietary algorithm",
    meaning:
      "Claims uniqueness without explaining what makes it defensible or hard to replicate.",
  },
  {
    phrase: "next-gen",
    meaning:
      "Vague generational claim — what specifically makes this next-generation?",
  },
  {
    phrase: "growing fast",
    meaning:
      "Relative term with no baseline — fast compared to what, measured how?",
  },
  {
    phrase: "save time and money",
    meaning:
      "The most generic B2B value proposition possible — every tool claims this.",
  },
  {
    phrase: "using ai",
    meaning:
      "Implementation detail that is now table stakes — the question is what's the unfair advantage.",
  },
  {
    phrase: "easy to use",
    meaning:
      "Table stakes, not differentiation. Every competitor also claims this.",
  },
  {
    phrase: "leverage",
    meaning:
      "Corporate buzzword that often signals the founder is describing method, not outcome.",
  },
  {
    phrase: "ecosystem",
    meaning:
      "Vague strategic framing that rarely translates into a concrete defensibility argument.",
  },
  {
    phrase: "paradigm",
    meaning:
      "Academic framing that distances the pitch from the concrete business problem being solved.",
  },
  {
    phrase: "end-to-end",
    meaning:
      "Scope claim that raises integration complexity concerns without addressing them.",
  },
  {
    phrase: "robust",
    meaning:
      "Engineering adjective that means nothing to an investor evaluating market risk.",
  },
  {
    phrase: "transformative",
    meaning:
      "Self-aggrandizing label — transformation is for customers to claim, not founders.",
  },
  {
    phrase: "holistic",
    meaning:
      "Vague breadth claim that often signals the product tries to do too much for too many.",
  },
];

/* ─── Regex detections ──────────────────────────────────────────── */

const TRACTION_RE =
  /\b(\d+\s*(?:paying\s*)?(?:customer|user|client|subscriber|contract)|revenue|arr|mrr|mau|dau|\$[\d.,]+\s*[km]\s*(?:arr|mrr|revenue)|signed\s+\d+|deployed\s+(?:at|to|with))\b/i;

const MOAT_RE =
  /\b(patent(?:ed)?|proprietary\s+data|network\s+effect|switching\s+cost|data\s+advantage|regulatory\s+moat|exclusive\s+(?:deal|contract|license)|founder.{0,20}expertise|only\s+(?:one|company|team)\s+(?:with|that))\b/i;

const SPECIFIC_METRIC_RE = /\b\d+\s*%|\$\s*\d|\b\d+x\b|\b\d{4,}\b/;

const MARKET_CLAIM_RE = /\$[\d.]+\s*[bm]\s*(?:market|opportunity|tam|industry)/i;

const PROBLEM_RE =
  /\b(problem|pain\s+point|challenge|struggle|broken|inefficient|friction|gap\s+in|underserved|no\s+good\s+solution)\b/i;

const COMPETITOR_RE =
  /\b(better\s+than|unlike|compared\s+to|instead\s+of|\bvs\.?\b|versus|alternative\s+to|unlike\s+existing|no\s+existing)\b/i;

const UNSUPPORTED_METRIC_PATTERNS: Array<{
  re: RegExp;
  getMeaning: (m: string) => string;
}> = [
  {
    re: /(\d+)\s*%\s*(increase|improvement|boost|reduction|faster|more\s+efficient|productivity)/gi,
    getMeaning: (m) =>
      `Unverified metric: "${m}" — where does this number come from, and how was it measured?`,
  },
  {
    re: /\$[\d.]+\s*[bm]\s*(market|opportunity|tam|industry)/gi,
    getMeaning: (m) =>
      `Market size claim "${m}" without a credible source reads as aspiration, not analysis.`,
  },
  {
    re: /(\d+)\s*x\s*(faster|cheaper|better|more\s+\w+)/gi,
    getMeaning: (m) =>
      `"${m}" is a bold claim that requires validation data not present in this pitch.`,
  },
];

/* ─── Rewrite helper ────────────────────────────────────────────── */

const BUZZWORD_REPLACE_MAP: Record<string, string> = {
  "ai-powered": "purpose-built",
  "cutting-edge": "",
  revolutionary: "",
  "game-changing": "",
  disruptive: "",
  innovative: "",
  seamless: "reliable",
  robust: "reliable",
  "world-class": "",
  "best-in-class": "",
  "next-gen": "",
  "proprietary algorithm": "purpose-built model",
  "scalable solution": "solution that scales",
  holistic: "comprehensive",
  transformative: "",
  leveraging: "using",
  leverage: "use",
};

function buildStrongerRewrite(
  message: string,
  hasTraction: boolean,
  hasMoat: boolean,
  hasProblem: boolean
): string {
  // Take first sentence as the core claim
  const sentences = message
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  let core = (sentences[0] ?? message).slice(0, 160).trim();

  // Strip known buzzwords
  for (const [buzz, replacement] of Object.entries(BUZZWORD_REPLACE_MAP)) {
    core = core.replace(new RegExp(`\\b${buzz}\\b`, "gi"), replacement);
  }
  core = core.replace(/\s{2,}/g, " ").trim();
  if (core && !core.match(/[.!?]$/)) core += ".";

  const additions: string[] = [];

  if (!hasProblem) {
    additions.push(
      "The core problem we solve: [specific pain with a measurable cost]."
    );
  }
  if (!hasTraction) {
    additions.push(
      "We've validated this with [X] early customers who achieved [specific outcome]."
    );
  }
  if (!hasMoat) {
    additions.push(
      "Our defensibility is [proprietary data / exclusive channel / founder domain expertise] — not just a better interface."
    );
  }

  return [core, ...additions].filter(Boolean).join(" ").trim();
}

/* ─── Weak phrase extractor ─────────────────────────────────────── */

function extractWeakPhrases(message: string): WeakPhrase[] {
  const text = message.toLowerCase();
  const results: WeakPhrase[] = [];
  const usedPhrases = new Set<string>();

  // Match known buzzwords against input
  for (const entry of KNOWN_WEAK_PHRASES) {
    if (results.length >= 4) break;
    if (!text.includes(entry.phrase)) continue;
    if (usedPhrases.has(entry.phrase)) continue;

    // Extract surrounding context (up to 60 chars)
    const re = new RegExp(`[^.!?,]{0,30}${entry.phrase}[^.!?,]{0,30}`, "i");
    const ctxMatch = message.match(re);
    const extracted = ctxMatch
      ? ctxMatch[0].trim().replace(/\s+/g, " ")
      : entry.phrase;

    results.push({
      phrase: extracted.length > 65 ? entry.phrase : extracted,
      meaning: entry.meaning,
    });
    usedPhrases.add(entry.phrase);
  }

  // Add unsupported metrics
  for (const { re, getMeaning } of UNSUPPORTED_METRIC_PATTERNS) {
    if (results.length >= 5) break;
    re.lastIndex = 0;
    const matches = [...message.matchAll(re)];
    for (const m of matches) {
      if (results.length >= 5) break;
      const phrase = m[0].trim();
      if (usedPhrases.has(phrase)) continue;
      results.push({ phrase, meaning: getMeaning(phrase) });
      usedPhrases.add(phrase);
    }
  }

  // Ensure minimum 3 items with generic fallbacks
  const GENERIC_FALLBACKS: WeakPhrase[] = [
    {
      phrase: "increases productivity",
      meaning:
        "Productivity gains require proof — what's the measurement methodology and sample size?",
    },
    {
      phrase: "our solution",
      meaning:
        "Impersonal framing that distances the founder from their own conviction.",
    },
    {
      phrase: "helps companies",
      meaning:
        "Overly broad targeting — which companies, of what size, in which industry?",
    },
    {
      phrase: "better solution",
      meaning:
        "Better than what? Comparative claims without a named benchmark invite skepticism.",
    },
  ];

  for (const fb of GENERIC_FALLBACKS) {
    if (results.length >= 3) break;
    if (text.includes(fb.phrase) && !usedPhrases.has(fb.phrase)) {
      results.push(fb);
      usedPhrases.add(fb.phrase);
    }
  }

  // If still under 3, add the first unmatched generic entries
  if (results.length < 3) {
    for (const fb of GENERIC_FALLBACKS) {
      if (results.length >= 3) break;
      if (!usedPhrases.has(fb.phrase)) {
        results.push(fb);
      }
    }
  }

  return results.slice(0, 5);
}

/* ─── Main fallback generator ───────────────────────────────────── */

export function generateFallbackAnalysis(
  message: string,
  context: string,
  // goal parameter available for future context-aware branching
  _goal?: string
): AnalysisResult {
  const text = message.toLowerCase();
  const wordCount = message.trim().split(/\s+/).length;

  // --- Signals ---
  const foundBuzzwordCount = KNOWN_WEAK_PHRASES.filter((b) =>
    text.includes(b.phrase)
  ).length;
  const hasTraction = TRACTION_RE.test(text);
  const hasMoat = MOAT_RE.test(text);
  const hasSpecificMetrics = SPECIFIC_METRIC_RE.test(message);
  const hasMarketClaim = MARKET_CLAIM_RE.test(text);
  const hasProblem = PROBLEM_RE.test(text);
  const hasCompetitorContext = COMPETITOR_RE.test(text);
  const isInvestorContext = ["investor", "demo_day", "yc_interview", "board", "brutal_vc"].includes(context);
  const isBrutalVC = context === "brutal_vc";

  // --- Scores ---
  const buzzPenalty = Math.min(foundBuzzwordCount * 9, 32);
  const tractionBonus = hasTraction ? 18 : 0;
  const metricsBonus = hasSpecificMetrics ? 8 : 0;
  const problemBonus = hasProblem ? 5 : 0;
  const baseSkepticism = isBrutalVC ? 72 : isInvestorContext ? 62 : 54;

  const skepticismScore = Math.round(
    Math.min(
      Math.max(baseSkepticism + buzzPenalty - tractionBonus - metricsBonus - problemBonus, 28),
      91
    )
  );

  const clarityScore = Math.round(
    Math.min(
      Math.max(
        62 -
          buzzPenalty / 2 +
          metricsBonus +
          (hasProblem ? 9 : 0) +
          (hasTraction ? 11 : 0) +
          (wordCount > 35 ? 5 : -8),
        22
      ),
      84
    )
  );

  // --- Weak phrases ---
  const weakPhrases = extractWeakPhrases(message);

  // --- Customer doubt tags ---
  const customerDoubt: DoubtTag[] = [];

  if (!hasTraction) {
    customerDoubt.push({ label: "Proof of demand?", variant: "amber" });
  }
  if (!hasCompetitorContext) {
    customerDoubt.push({ label: "How is this different?", variant: "blue" });
  }
  if (hasMarketClaim && !hasTraction) {
    customerDoubt.push({ label: "Real traction or theory?", variant: "red" });
  }
  customerDoubt.push({ label: "Integration complexity?", variant: "slate" });
  if (!hasMoat) {
    customerDoubt.push({ label: "What if a bigger player copies this?", variant: "purple" });
  }
  if (hasTraction) {
    customerDoubt.push({ label: "Cautiously interested", variant: "emerald" });
  }
  if (customerDoubt.length < 2) {
    customerDoubt.push({ label: "Needs more specifics", variant: "slate" });
  }

  // --- Investor red flags ---
  const investorRedFlags: InvestorRedFlag[] = [];

  if (!hasTraction && isInvestorContext) {
    investorRedFlags.push({
      flag: "No traction evidence",
      detail:
        "The pitch contains no mention of paying customers, revenue, or validated demand — the strongest signal investors look for at any stage.",
    });
  }
  if (!hasMoat) {
    investorRedFlags.push({
      flag: "Undefined competitive moat",
      detail:
        "Without a clear defensibility story, a well-funded competitor or incumbent can replicate this positioning within a year.",
    });
  }
  if (foundBuzzwordCount >= 3) {
    investorRedFlags.push({
      flag: "High buzzword density",
      detail:
        "Pitch relies on trend-adjacent language over substance, which signals the founder hasn't developed a crisp, differentiated thesis.",
    });
  }
  if (hasMarketClaim && !hasTraction) {
    investorRedFlags.push({
      flag: "Market size claim without bottom-up proof",
      detail:
        "Top-down market sizing without customer evidence reads as aspiration, not analysis.",
    });
  }

  // --- Biggest weakness ---
  let biggestWeakness: string;

  if (!hasTraction && !hasMoat) {
    biggestWeakness =
      "The pitch presents an idea without evidence of real-world validation. There is no mention of paying customers, signed LOIs, or measurable traction that would de-risk the investment hypothesis. Without proof of demand, investors are being asked to fund a thesis rather than a business. The core assumption — that this problem is worth paying to solve — remains entirely unproven.";
  } else if (!hasMoat && hasTraction) {
    biggestWeakness =
      "The pitch shows early traction but fails to answer the most important investor question: why will this company win long-term? No moat is articulated — no proprietary data, network effect, or switching cost that prevents a well-funded competitor from entering and capturing market share. Traction is an early signal; durability requires a defensibility thesis.";
  } else if (hasMoat && !hasTraction) {
    biggestWeakness =
      "The pitch articulates a defensibility story but lacks the market validation to back it up. Claims of proprietary advantage are difficult to underwrite without customer evidence. At the seed stage, investors pattern-match on founder-market fit and early demand signals — both of which remain unclear here.";
  } else {
    biggestWeakness =
      "The pitch's biggest structural weakness is a specificity gap: strong value propositions are diluted by language that could describe dozens of competitors. The clearest path forward is replacing every generic claim with a concrete, verifiable proof point that competitors cannot credibly replicate.";
  }

  // --- Likely investor question ---
  let likelyInvestorQuestion: string;

  if (!hasTraction && isInvestorContext) {
    likelyInvestorQuestion =
      "Do you have any paying customers yet, and if not, what's your evidence that someone will actually pay for this?";
  } else if (!hasMoat) {
    likelyInvestorQuestion =
      "What stops a well-funded startup or an incumbent from building this in 6 months once you start getting traction?";
  } else if (hasMarketClaim && !hasTraction) {
    likelyInvestorQuestion =
      "You're describing a large market — how are you arriving at your serviceable slice, and what's your customer acquisition thesis?";
  } else {
    likelyInvestorQuestion =
      "What's the one thing you know about this market that your competitors don't, and how does your product exploit that insight?";
  }

  // --- Moat risk ---
  const moatRisk = {
    label: hasMoat ? "Some defensibility" : "Easily replicated",
    riskScore: hasMoat ? 38 : 73,
    description: hasMoat
      ? "Some defensibility signals are present but the moat isn't made concrete enough to underwrite. Investors need to understand specifically why this is structurally hard to copy."
      : "No structural competitive advantage is articulated in this pitch. Without a data moat, network effect, or proprietary distribution, the business is vulnerable to well-funded replication.",
  };

  // --- Stronger rewrite ---
  const strongerRewrite = buildStrongerRewrite(message, hasTraction, hasMoat, hasProblem);

  return {
    skepticismScore,
    clarityScore,
    biggestWeakness,
    moatRisk,
    customerDoubt: customerDoubt.slice(0, 5),
    likelyInvestorQuestion,
    investorRedFlags: investorRedFlags.slice(0, 4),
    weakPhrases,
    strongerRewrite,
    confidenceScore: Math.min(
      55 + (hasTraction ? 12 : 0) + (hasSpecificMetrics ? 6 : 0),
      78
    ),
  };
}
