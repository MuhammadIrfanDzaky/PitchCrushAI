"use client";

import { useState, useCallback } from "react";
import {
  TrendingUp,
  Users,
  Swords,
  Mic,
  Mail,
  BarChart3,
  Target,
  Globe,
  Building2,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { CompareModes, type ModeDisplayInfo } from "./CompareModes";

/* ─── Types ──────────────────────────────────────────────────────── */

interface ModeGoal {
  value: string;
  label: string;
}

interface Mode {
  value: string;
  label: string;
  Icon: LucideIcon;
  purpose: string;
  bestFor: string;
  looksFor: string[];
  goals: ModeGoal[];
}

/* ─── Mode definitions ───────────────────────────────────────────── */

const MODES: Mode[] = [
  {
    value: "incumbent_kill",
    label: "Incumbent Kill",
    Icon: Building2,
    purpose: "Simulates how large incumbents could neutralize or crush this startup.",
    bestFor: "Founders worried about being copied or outcompeted by Salesforce, Google, or category leaders",
    looksFor: [
      "Why big players can copy this",
      "Distribution disadvantage",
      "Pricing power mismatch",
      "Customer lock-in gaps",
      "Weak moat against incumbents",
    ],
    goals: [
      { value: "expose_incumbent_threats", label: "Expose incumbent threats" },
      { value: "strengthen_defensibility", label: "Strengthen defensibility" },
      { value: "find_distribution_risks", label: "Find distribution risks" },
      { value: "improve_moat_story", label: "Improve moat story" },
    ],
  },
  {
    value: "investor",
    label: "Investor",
    Icon: TrendingUp,
    purpose: "Tests funding readiness and investor skepticism.",
    bestFor: "Founders preparing for seed, Series A, or any investor meeting",
    looksFor: [
      "Market size weakness",
      "Traction gaps",
      "Business model risk",
      "Unclear 'why now'",
      "Weak defensibility",
    ],
    goals: [
      { value: "find_funding_weaknesses", label: "Find funding weaknesses" },
      { value: "prep_investor_questions", label: "Prepare investor questions" },
      { value: "strengthen_traction", label: "Strengthen traction story" },
      { value: "clarify_business_model", label: "Clarify business model" },
    ],
  },
  {
    value: "customer",
    label: "Customer",
    Icon: Users,
    purpose: "Tests whether real customers would care and pay.",
    bestFor: "Founders validating product-market fit or preparing for sales calls",
    looksFor: [
      "Weak urgency",
      "Unclear pain statement",
      "Low willingness to pay",
      "Confusing value prop",
      "Switching friction",
    ],
    goals: [
      { value: "increase_customer_urgency", label: "Increase customer urgency" },
      { value: "improve_value_prop", label: "Improve value proposition" },
      { value: "reduce_buyer_skepticism", label: "Reduce buyer skepticism" },
      { value: "sharpen_pain_statement", label: "Sharpen pain statement" },
    ],
  },
  {
    value: "competitor",
    label: "Competitor",
    Icon: Swords,
    purpose: "Tests how direct rivals could attack the startup.",
    bestFor: "Founders in competitive markets sharpening their positioning story",
    looksFor: [
      "Weak positioning",
      "Copy risk",
      "Pricing pressure",
      "Feature parity risk",
      "Go-to-market gaps",
    ],
    goals: [
      { value: "expose_moat_gaps", label: "Expose moat gaps" },
      { value: "find_attack_angles", label: "Find attack angles" },
      { value: "strengthen_positioning", label: "Strengthen positioning" },
      { value: "identify_copy_risks", label: "Identify copy risks" },
    ],
  },
  {
    value: "demo_day",
    label: "Demo Day",
    Icon: Mic,
    purpose: "Tests whether the pitch is sharp enough for a short public pitch.",
    bestFor: "Founders preparing for YC Demo Day, TechCrunch Disrupt, or investor showcases",
    looksFor: [
      "Weak opening",
      "Unclear narrative",
      "Too much jargon",
      "Missing traction",
      "Weak closing hook",
    ],
    goals: [
      { value: "sharpen_opening_hook", label: "Sharpen opening hook" },
      { value: "improve_narrative_flow", label: "Improve narrative flow" },
      { value: "strengthen_closing_line", label: "Strengthen closing line" },
      { value: "reduce_jargon", label: "Reduce jargon" },
    ],
  },
  {
    value: "cold_email",
    label: "Cold Email",
    Icon: Mail,
    purpose: "Tests whether the pitch works in a short outreach message.",
    bestFor: "Founders doing outbound sales or investor outreach via email",
    looksFor: [
      "Low curiosity triggers",
      "Vague CTA",
      "Spam-like wording",
      "Weak credibility signals",
      "Poor first-line hook",
    ],
    goals: [
      { value: "improve_reply_rate", label: "Improve reply rate" },
      { value: "sharpen_first_line", label: "Sharpen first line" },
      { value: "strengthen_cta", label: "Strengthen CTA" },
      { value: "reduce_spam_signals", label: "Reduce spam signals" },
    ],
  },
  {
    value: "board",
    label: "Board",
    Icon: BarChart3,
    purpose: "Tests strategic and governance-level concerns.",
    bestFor: "Founders preparing for board meetings or governance-focused investors",
    looksFor: [
      "Revenue uncertainty",
      "Execution risk",
      "Runway concerns",
      "Hiring risk",
      "Strategic focus issues",
    ],
    goals: [
      { value: "surface_strategic_risks", label: "Surface strategic risks" },
      { value: "improve_revenue_confidence", label: "Improve revenue confidence" },
      { value: "prep_governance_questions", label: "Prepare governance questions" },
      { value: "clarify_execution_plan", label: "Clarify execution plan" },
    ],
  },
  {
    value: "yc_accel",
    label: "YC/Accel",
    Icon: Target,
    purpose: "Tests the pitch through top accelerator-style scrutiny.",
    bestFor: "Founders applying to YC, a16z seed, Sequoia Scout, or similar programs",
    looksFor: [
      "Founder insight depth",
      "Speed of execution signals",
      "Market timing thesis",
      "Non-obvious advantage",
      "Clarity of wedge",
    ],
    goals: [
      { value: "test_founder_insight", label: "Test founder insight" },
      { value: "sharpen_wedge", label: "Sharpen wedge" },
      { value: "improve_why_now", label: "Improve why now" },
      { value: "strengthen_unfair_advantage", label: "Strengthen non-obvious advantage" },
    ],
  },
  {
    value: "general",
    label: "General",
    Icon: Globe,
    purpose: "Balanced full-stack pitch audit across all dimensions.",
    bestFor: "Founders who want a comprehensive overview before choosing a specific mode",
    looksFor: [
      "Clarity gaps",
      "Weakness signals",
      "Customer value proof",
      "Moat indicators",
      "Rewrite opportunities",
    ],
    goals: [
      { value: "find_weaknesses", label: "Find weaknesses" },
      { value: "strengthen_pitch", label: "Strengthen pitch" },
      { value: "improve_clarity", label: "Improve clarity" },
      { value: "spot_fatal_flaws", label: "Spot fatal flaws" },
    ],
  },
];

/* ─── Sample pitches ─────────────────────────────────────────────── */

const SAMPLES = [
  {
    label: "SaaS one-liner",
    context: "investor",
    goal: "find_funding_weaknesses",
    message:
      "We build AI-powered project management software for remote teams that increases productivity by 40%.",
  },
  {
    label: "Cold email pitch",
    context: "cold_email",
    goal: "improve_reply_rate",
    message:
      "Hi, I wanted to reach out about our platform that helps companies save time and money on their operations using cutting-edge AI technology.",
  },
  {
    label: "Investor deck summary",
    context: "investor",
    goal: "find_funding_weaknesses",
    message:
      "We're disrupting the $50B logistics market with our proprietary algorithm. We have 10 beta users and are growing fast. Looking for $2M seed round.",
  },
  {
    label: "YC application",
    context: "yc_accel",
    goal: "test_founder_insight",
    message:
      "We make it easy for small businesses to accept payments online. Our solution is simpler than Stripe and we already have 50 paying customers.",
  },
] as const;

/* ─── Display data for CompareModes ─────────────────────────────── */

const MODES_DISPLAY: ModeDisplayInfo[] = MODES.map(
  ({ value, label, purpose, bestFor, looksFor }) => ({
    value,
    label,
    purpose,
    bestFor,
    looksFor,
  })
);

const MAX_CHARS = 2000;

/* ─── Component ──────────────────────────────────────────────────── */

interface InputPanelProps {
  message: string;
  context: string;
  goal: string;
  isLoading: boolean;
  onMessageChange: (v: string) => void;
  onContextChange: (v: string) => void;
  onGoalChange: (v: string) => void;
  onAnalyze: () => void;
}

export function InputPanel({
  message,
  context,
  goal,
  isLoading,
  onMessageChange,
  onContextChange,
  onGoalChange,
  onAnalyze,
}: InputPanelProps) {
  const [showCompare, setShowCompare] = useState(false);
  const canAnalyze = message.trim().length > 0 && !isLoading;

  const selectedMode = MODES.find((m) => m.value === context) ?? MODES[1];
  const SelectedModeIcon = selectedMode.Icon;

  const handleModeChange = useCallback(
    (modeValue: string) => {
      const mode = MODES.find((m) => m.value === modeValue);
      onContextChange(modeValue);
      if (mode) onGoalChange(mode.goals[0].value);
    },
    [onContextChange, onGoalChange]
  );

  return (
    <div className="p-6 flex flex-col gap-7">
      {/* Panel header */}
      <div>
        <h1 className="text-[15px] font-semibold text-stone-900 tracking-tight">
          Stress test your pitch
        </h1>
        <p className="text-[12px] text-stone-500 mt-1 leading-relaxed">
          Paste any pitch — one-liner, cold email, or deck summary.
        </p>
      </div>

      {/* Context selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] text-stone-500 uppercase tracking-[0.14em] font-medium">
            Stress test mode
          </p>
          <button
            onClick={() => setShowCompare(true)}
            className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-700 transition-colors duration-150 select-none"
          >
            <LayoutGrid className="w-3 h-3" aria-hidden="true" />
            Compare modes
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {MODES.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => handleModeChange(value)}
              aria-pressed={context === value}
              aria-label={`Set context to ${label}`}
              className={[
                "rounded-xl border font-medium transition-all duration-150 select-none leading-none",
                value === "incumbent_kill"
                  ? "col-span-4 flex items-center justify-center gap-2 py-2.5 px-4 text-[11px]"
                  : "flex flex-col items-center gap-1.5 py-3 px-1 text-[10px]",
                value === "incumbent_kill"
                  ? context === "incumbent_kill"
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-[#E7E0D6] text-stone-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                  : context === value
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-[#E7E0D6] text-stone-500 hover:text-stone-800 hover:border-[#D4CBBF]",
              ].join(" ")}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Selected mode info card */}
        <div className="mt-3 px-3.5 py-3 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6]">
          <div className="flex items-center gap-2 mb-1.5">
            <SelectedModeIcon
              className="w-3.5 h-3.5 text-stone-500 shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold text-stone-800">
              {selectedMode.label}
            </span>
            {context === "incumbent_kill" && (
              <span className="text-[9px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-mono leading-none">
                aggressive
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
            {selectedMode.purpose}
          </p>
          <ul className="flex flex-col gap-1" aria-label={`${selectedMode.label} looks for`}>
            {selectedMode.looksFor.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[11px] text-stone-500">
                <span
                  className={`w-1 h-1 rounded-full shrink-0 ${
                    context === "incumbent_kill" ? "bg-red-400" : "bg-amber-400"
                  }`}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Goal chips */}
      <div>
        <p className="text-[11px] text-stone-500 uppercase tracking-[0.14em] font-medium mb-3">
          Your goal
        </p>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Select your analysis goal"
        >
          {selectedMode.goals.map(({ value: goalValue, label }) => (
            <button
              key={goalValue}
              onClick={() => onGoalChange(goalValue)}
              aria-pressed={goal === goalValue}
              className={`h-7 px-3 rounded-lg text-[11px] font-medium border transition-all duration-150 select-none ${
                goal === goalValue
                  ? "bg-stone-900 border-stone-900 text-white"
                  : "bg-white border-[#E7E0D6] text-stone-600 hover:text-stone-900 hover:border-[#D4CBBF]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Message textarea */}
      <div>
        <label
          htmlFor="message-textarea"
          className="block text-[11px] text-stone-500 uppercase tracking-[0.14em] font-medium mb-3"
        >
          Pitch text
        </label>
        <div className="relative">
          <textarea
            id="message-textarea"
            value={message}
            onChange={(e) => onMessageChange(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Paste your pitch — one-liner, cold email, investor memo, or sales deck summary..."
            rows={7}
            className="w-full bg-white border border-[#E7E0D6] rounded-xl px-4 py-3.5 text-[13px] text-stone-900 placeholder-stone-400 resize-none focus:outline-none focus:border-emerald-400 hover:border-[#D4CBBF] transition-colors duration-150 leading-relaxed"
          />
          <div className="absolute bottom-3 right-3.5 flex items-center gap-2.5">
            {message.length > 0 && (
              <button
                onClick={() => onMessageChange("")}
                className="text-stone-400 hover:text-stone-600 transition-colors duration-150"
                aria-label="Clear message"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <span
              className={`text-[10px] tabular-nums ${
                message.length > MAX_CHARS * 0.9 ? "text-amber-600" : "text-stone-400"
              }`}
            >
              {message.length}/{MAX_CHARS}
            </span>
          </div>
        </div>
      </div>

      {/* Sample messages */}
      <div>
        <p className="text-[11px] text-stone-500 uppercase tracking-[0.14em] font-medium mb-3">
          Try a sample
        </p>
        <div className="flex flex-col gap-2">
          {SAMPLES.map(({ label, message: sampleMsg, context: sampleCtx, goal: sampleGoal }) => (
            <button
              key={label}
              onClick={() => {
                onMessageChange(sampleMsg);
                onContextChange(sampleCtx);
                onGoalChange(sampleGoal);
              }}
              className="flex items-start gap-3 px-3.5 py-3 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] hover:border-[#D4CBBF] hover:bg-[#F5F0E8] text-left transition-all duration-150 group"
            >
              <span className="shrink-0 text-[10px] text-stone-500 bg-stone-100 border border-stone-200 px-2 py-1 rounded-md mt-0.5 group-hover:text-stone-700 transition-colors duration-150 font-medium leading-none">
                {label}
              </span>
              <span className="text-[12px] text-stone-500 leading-relaxed line-clamp-2 group-hover:text-stone-700 transition-colors duration-150">
                {sampleMsg}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Analyze button */}
      <button
        onClick={onAnalyze}
        disabled={!canAnalyze}
        aria-label={isLoading ? "Analyzing pitch…" : "Analyze pitch"}
        className={`relative h-11 w-full rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 select-none transition-all duration-200 ${
          canAnalyze
            ? "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]"
            : "bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Analyzing…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
            Crush My Pitch
          </>
        )}
      </button>

      {/* Compare modes modal */}
      {showCompare && (
        <CompareModes modes={MODES_DISPLAY} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
}
