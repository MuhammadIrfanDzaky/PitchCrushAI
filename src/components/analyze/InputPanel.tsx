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
  Shuffle,
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

/* ─── Global scenario pool (mode + goal + pitch) ─────────────────── */

interface Scenario {
  mode: string;
  goal: string;
  pitch: string;
}

const SCENARIO_POOL: Scenario[] = [
  { mode: "investor", goal: "find_funding_weaknesses", pitch: "We're building the data layer for autonomous vehicles. Our SDK is embedded in 3 OEM pilot programs and we've signed $2.4M in LOIs. Raising $8M Series A." },
  { mode: "investor", goal: "strengthen_traction", pitch: "TalentFlow automates technical hiring for mid-market companies. We've reduced time-to-hire by 62% for our 40 enterprise clients and generate $1.2M ARR. Seeking $5M to triple sales headcount." },
  { mode: "investor", goal: "find_funding_weaknesses", pitch: "We're disrupting the $50B logistics market with our proprietary routing algorithm. We have 10 beta users and are growing fast. Looking for a $2M seed round." },
  { mode: "investor", goal: "clarify_business_model", pitch: "Our AI identifies supply chain risks before they happen. Fortune 500 companies lose $184B annually to disruptions. We have 3 enterprise pilots and $400K ARR. Raising $6M." },
  { mode: "investor", goal: "prep_investor_questions", pitch: "We built the Stripe for B2B payments in Southeast Asia. 3 enterprise pilots, $180K ARR, raising $1.5M seed to expand to Indonesia and Vietnam." },
  { mode: "customer", goal: "improve_value_prop", pitch: "AccountFlow helps your accounting team close books 4x faster. We replace the 3 spreadsheets, 2 email chains, and 1 shared drive that slow down month-end close. 14-day free trial, no credit card required." },
  { mode: "customer", goal: "reduce_buyer_skepticism", pitch: "We help e-commerce brands reduce return rates by 28% using AI-powered size recommendations. Most customers see ROI within 30 days. Easy Shopify integration, no dev resources needed." },
  { mode: "customer", goal: "increase_customer_urgency", pitch: "Our platform lets HR teams run performance reviews in half the time. We replace the clunky annual review cycle with real-time feedback loops that employees actually use." },
  { mode: "customer", goal: "sharpen_pain_statement", pitch: "We eliminate 6 hours of weekly manual reporting for sales ops teams. Connect your CRM in 10 minutes and get automated pipeline reports your team will actually read." },
  { mode: "competitor", goal: "strengthen_positioning", pitch: "Unlike Salesforce, we built natively for vertical SaaS companies. No customization required. Deployable in 3 days vs 6 months. We already have 8 enterprise customers who switched." },
  { mode: "competitor", goal: "identify_copy_risks", pitch: "Our compliance automation beats Vanta on speed and beats Drata on price. We offer automatic SOC 2 in 12 weeks flat — not 6 months. Already processing 200+ audits." },
  { mode: "competitor", goal: "expose_moat_gaps", pitch: "We out-position Notion in the enterprise with permissions, audit logs, and SSO on day one. 5 enterprise deals closed in Q1 against Notion." },
  { mode: "competitor", goal: "find_attack_angles", pitch: "Where competitors offer API-first tools for developers, we built the first no-code AI orchestration layer. Customers describe us as the Zapier that actually understands your business logic." },
  { mode: "demo_day", goal: "sharpen_opening_hook", pitch: "Every year, $240B in insurance claims are overpaid due to billing fraud. We detect it in real-time. We're ClaimShield — in the last 6 months we've saved our clients $12M." },
  { mode: "demo_day", goal: "strengthen_closing_line", pitch: "My co-founder and I spent 8 years in biotech procurement. We know the pain: $180K wasted per lab per year on expired reagents. We built LabFlow to fix it. $340K ARR in 9 months." },
  { mode: "demo_day", goal: "reduce_jargon", pitch: "We're Ramp for legal spend. Companies overpay law firms by 22% on average. We've audited $40M in legal bills and saved clients $8.7M." },
  { mode: "demo_day", goal: "improve_narrative_flow", pitch: "Recruiting is broken for everyone except the top 0.1% of candidates. We built the first AI that gives every developer a personalized job search agent. 12,000 users in 60 days, zero paid acquisition." },
  { mode: "cold_email", goal: "reduce_spam_signals", pitch: "Hi, I wanted to reach out about our platform that helps companies save time and money on their operations using cutting-edge AI technology. Would love to show you a demo." },
  { mode: "cold_email", goal: "sharpen_first_line", pitch: "Hey [Name], saw your post about scaling your sales team. We help companies like yours reduce onboarding time from 6 weeks to 10 days. Worth a 20-minute call?" },
  { mode: "cold_email", goal: "improve_reply_rate", pitch: "We help CFOs at Series B companies cut SaaS spend by an average of $180K without reducing tooling. We found 3 specific cost leaks in your stack. Would a quick Loom showing this be useful?" },
  { mode: "cold_email", goal: "strengthen_cta", pitch: "Your competitor just signed with us last month. We're giving 3 spots to their top rivals at a 40% discount before Q3. Relevant?" },
  { mode: "board", goal: "surface_strategic_risks", pitch: "Q3 revenue came in at $4.1M ARR, up 18% QoQ. Burn is $380K/month with 14 months of runway. We're on track for the $6M ARR milestone required for Series B. Key risk: enterprise sales cycles extending from 60 to 90 days." },
  { mode: "board", goal: "improve_revenue_confidence", pitch: "We closed our biggest customer at $420K ACV — but missed revenue targets by 12% due to two late-stage deal slippages. I want to discuss pipeline concentration risk and three options for addressing it." },
  { mode: "board", goal: "prep_governance_questions", pitch: "Our NRR dropped from 118% to 104% this quarter. Two expansions delayed, one customer downgraded. I'm proposing we restructure the CS team and want board alignment before we proceed." },
  { mode: "yc_accel", goal: "sharpen_wedge", pitch: "We make it easy for small businesses to accept payments online. Our solution is simpler than Stripe and we already have 50 paying customers." },
  { mode: "yc_accel", goal: "test_founder_insight", pitch: "We discovered that 73% of enterprise data pipelines fail silently. Our founders spent 4 years building data infrastructure at Databricks. We've rebuilt it with observability-first design. 8 customers, $280K ARR." },
  { mode: "yc_accel", goal: "strengthen_unfair_advantage", pitch: "My co-founder and I built and sold our last company to GitHub in 2021. We're now building the missing auth layer for AI agents. 200 developers in private beta, 12 enterprise design partners." },
  { mode: "yc_accel", goal: "improve_why_now", pitch: "We discovered small law firms lose $60K/year per attorney to unbillable admin time. We built a legal AI that captures it automatically. 3 months in, $90K ARR, 0 churn." },
  { mode: "incumbent_kill", goal: "expose_incumbent_threats", pitch: "Salesforce spent $27B acquiring Slack, MuleSoft, and Tableau — and still can't offer unified AI-native workflows. We built it natively in 14 months. 6 enterprise teams have already switched off Salesforce's AI Studio." },
  { mode: "incumbent_kill", goal: "strengthen_defensibility", pitch: "SAP's ERP has a 14-month implementation cycle and a 60% failure rate. We built a modular replacement that covers 80% of ERP functionality in 6 weeks. $2.1M ARR from companies mid-SAP-implementation." },
  { mode: "incumbent_kill", goal: "improve_moat_story", pitch: "Google Workspace and Microsoft 365 both have AI writing tools. Neither understands B2B sales context. We built the first AI that reads your CRM, your deck, and your call recordings before writing a word. 180 sales teams, 40% reply rate improvement." },
  { mode: "incumbent_kill", goal: "find_distribution_risks", pitch: "The incumbent owns the channel but not the trust. We distribute through independent financial advisors that Vanguard and Fidelity have systematically cut out. 800 advisors onboarded, $2.4B AUM in 18 months." },
  { mode: "general", goal: "find_weaknesses", pitch: "We build AI-powered project management software for remote teams that increases productivity by 40%." },
  { mode: "general", goal: "strengthen_pitch", pitch: "Our platform connects skilled tradespeople with homeowners who need work done. Live in 3 cities, 800 verified tradespeople, 2,400 jobs completed this quarter." },
  { mode: "general", goal: "improve_clarity", pitch: "We help mid-market companies reduce employee turnover by 35% using predictive retention modeling. Currently working with 12 HR teams across healthcare and retail." },
  { mode: "general", goal: "spot_fatal_flaws", pitch: "We built a carbon accounting platform for manufacturing companies. Our 9 customers collectively track $400M in emissions and reduced their Scope 3 footprint by 18%." },
];

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
  const [lastScenarioIdx, setLastScenarioIdx] = useState(-1);
  const canAnalyze = message.trim().length > 0 && !isLoading;

  const handleRandomizeScenario = useCallback(() => {
    if (SCENARIO_POOL.length === 0) return;
    let idx: number;
    do {
      idx = Math.floor(Math.random() * SCENARIO_POOL.length);
    } while (SCENARIO_POOL.length > 1 && idx === lastScenarioIdx);
    const scenario = SCENARIO_POOL[idx];
    onContextChange(scenario.mode);
    onGoalChange(scenario.goal);
    onMessageChange(scenario.pitch);
    setLastScenarioIdx(idx);
  }, [lastScenarioIdx, onContextChange, onGoalChange, onMessageChange]);

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

      {/* Sample generator */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] text-stone-500 uppercase tracking-[0.14em] font-medium">
            Try a sample
          </p>
          <span className="text-[10px] text-stone-400 select-none">
            Picks a random mode, goal &amp; pitch
          </span>
        </div>
        <button
          onClick={handleRandomizeScenario}
          className="w-full flex items-center justify-center gap-2 h-9 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D6] hover:border-[#D4CBBF] hover:bg-[#F5F0E8] text-[12px] text-stone-600 hover:text-stone-900 transition-all duration-150 select-none"
          aria-label="Randomize stress test scenario — picks a random mode, goal, and pitch"
        >
          <Shuffle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          Randomize scenario
        </button>
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
