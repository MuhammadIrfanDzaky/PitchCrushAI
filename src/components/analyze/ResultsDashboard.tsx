"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Target,
  TrendingDown,
  Zap,
  AlertTriangle,
  MessageSquare,
  Copy,
  Check,
  Activity,
  Sparkles,
  Quote,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { AnalyzingLoader, ReanalyzingOverlay } from "./AnalyzingLoader";
import type { AnalysisResult } from "@/lib/types/analysis";

/* ─── Mode-aware card labels ────────────────────────────────────── */

const RED_FLAGS_LABEL: Record<string, string> = {
  investor:      "Investor Red Flags",
  customer:      "Customer Objections",
  competitor:    "Competitive Threats",
  demo_day:      "Pitch Red Flags",
  cold_email:    "Cold Email Red Flags",
  board:         "Board Red Flags",
  yc_accel:      "Accelerator Red Flags",
  general:       "Red Flags",
  incumbent_kill:"Incumbent Threats",
};

const QUESTION_LABEL: Record<string, string> = {
  investor:      "Likely Investor Question",
  customer:      "Likely Buyer Question",
  competitor:    "Likely Rival Attack",
  demo_day:      "Likely Audience Question",
  cold_email:    "Likely Delete Trigger",
  board:         "Likely Board Challenge",
  yc_accel:      "Likely Partner Question",
  general:       "Toughest Question",
  incumbent_kill:"Likely Incumbent Attack",
};

const QUESTION_FOOTER: Record<string, string> = {
  investor:      "Prepare a crisp, direct answer to this before your next pitch meeting.",
  customer:      "Prepare a concrete response to this before your next sales call.",
  competitor:    "Anticipate this attack and have a sharp counter-positioning ready.",
  demo_day:      "Rehearse a confident, punchy answer to this for your demo.",
  cold_email:    "Address this objection in your subject line or first sentence.",
  board:         "Have data and a clear narrative ready before the next board meeting.",
  yc_accel:      "This is the question that decides batch admission — nail it.",
  general:       "Prepare a crisp, direct answer to this before your next pitch.",
  incumbent_kill:"Have a specific, structural answer ready — not just positioning language.",
};

/* ─── Color map for doubt chips ─────────────────────────────────── */

const DOUBT_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  amber:   { text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  blue:    { text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200"    },
  emerald: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  slate:   { text: "text-stone-600",   bg: "bg-stone-100",  border: "border-stone-200"   },
  purple:  { text: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200"  },
  red:     { text: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"     },
};

/* ─── Circle progress SVG ───────────────────────────────────────── */

function CircleProgress({
  value,
  colorClass,
}: {
  value: number;
  colorClass: string;
}) {
  const SIZE = 72;
  const STROKE = 4;
  const radius = (SIZE - STROKE * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative shrink-0">
      <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden="true">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={radius}
          stroke="#E7E0D6"
          strokeWidth={STROKE}
          fill="none"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={radius}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-1000 ease-out`}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[17px] font-bold text-stone-900 tabular-nums">{value}</span>
      </div>
    </div>
  );
}

/* ─── Card shell ─────────────────────────────────────────────────── */

function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`p-5 rounded-2xl bg-white border border-[#E7E0D6] hover:border-[#D4CBBF] transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─── Card header row ────────────────────────────────────────────── */

function CardHeader({
  icon,
  iconColor,
  label,
  badge,
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`w-7 h-7 rounded-lg ${iconColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <span className="text-[12px] font-medium text-stone-500">{label}</span>
      {badge && <div className="ml-auto">{badge}</div>}
    </div>
  );
}

/* ─── Idle / empty state ─────────────────────────────────────────── */

const SIGNAL_PREVIEW = [
  { label: "Pressure Signals",  color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200"     },
  { label: "Clarity Score",      color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { label: "Biggest Weakness",   color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  { label: "Toughest Question",  color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200"    },
  { label: "Moat Risk",          color: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200"  },
  { label: "Customer Doubt",     color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  { label: "Weak Phrases",       color: "text-sky-700",     bg: "bg-sky-50",     border: "border-sky-200"     },
  { label: "Stronger Rewrite",   color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { label: "Red Flags",          color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200"     },
] as const;

function IdleState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-90 gap-7 p-8 select-none">
      <div
        className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center"
        aria-hidden="true"
      >
        <Sparkles className="w-5 h-5 text-red-500" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-stone-800 tracking-tight">
          Ready to crush your pitch
        </p>
        <p className="text-[12px] text-stone-500 mt-1.5 leading-relaxed max-w-64">
          Paste your pitch and hit Analyze &mdash; we&apos;ll stress test it from the selected angle.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-xs">
        {SIGNAL_PREVIEW.map(({ label, color, bg, border }) => (
          <span
            key={label}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${color} ${bg} ${border} opacity-50`}
          >
            <span className="w-1 h-1 rounded-full bg-current" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Error state ────────────────────────────────────────────────── */

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-90 gap-5 p-8 select-none">
      <div
        className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center"
        aria-hidden="true"
      >
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-stone-800 tracking-tight">Analysis failed</p>
        <p className="text-[12px] text-stone-500 mt-1.5 leading-relaxed max-w-72">{message}</p>
      </div>
    </div>
  );
}

/* ─── Main dashboard ─────────────────────────────────────────────── */

interface ResultsDashboardProps {
  isLoading: boolean;
  isReanalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  context?: string;
}

export function ResultsDashboard({ isLoading, isReanalyzing, result, error, context = "general" }: ResultsDashboardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available in insecure contexts */
    }
  }

  if (isLoading && !isReanalyzing) return <AnalyzingLoader />;
  if (error && !result) return <ErrorState message={error} />;
  if (!result) return <IdleState />;

  return (
    <div className="relative p-6 lg:p-8">
      {/* Re-analyze overlay — rendered on top of existing results */}
      <AnimatePresence>
        {isReanalyzing && <ReanalyzingOverlay />}
      </AnimatePresence>

      {/* Inline error banner shown when re-analysis fails but old result is still visible */}
      <AnimatePresence>
        {error && result && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200"
            role="alert"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" aria-hidden="true" />
            <p className="text-[12px] text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-stone-900 tracking-tight">
            Pitch Stress Test
          </h2>
          <p className="text-[12px] text-stone-500 mt-0.5">9 signal layers analyzed</p>
        </div>
        <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full font-mono select-none">
          live · AI
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* ── Skepticism Score ── */}
        <Card delay={0}>
          <CardHeader
            icon={<TrendingDown className="w-3.5 h-3.5 text-red-400" />}
            iconColor="bg-red-500/10"
            label="Skepticism Score"
          />
          <div className="flex items-center gap-4">
            <CircleProgress value={result.skepticismScore} colorClass="text-red-500" />
            <div>
              <p className="text-2xl font-bold text-stone-900 tabular-nums leading-none">
                {result.skepticismScore}
                <span className="text-sm font-normal text-stone-400"> / 100</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                {result.skepticismScore >= 70
                  ? "High investor skepticism."
                  : result.skepticismScore >= 40
                  ? "Moderate skepticism."
                  : "Low skepticism — compelling case."}
              </p>
            </div>
          </div>
        </Card>

        {/* ── Clarity Score ── */}
        <Card delay={0.06}>
          <CardHeader
            icon={<Activity className="w-3.5 h-3.5 text-emerald-400" />}
            iconColor="bg-emerald-500/10"
            label="Clarity Score"
          />
          <div className="flex items-center gap-4">
            <CircleProgress value={result.clarityScore} colorClass="text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-stone-900 tabular-nums leading-none">
                {result.clarityScore}
                <span className="text-sm font-normal text-stone-400"> / 100</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                {result.clarityScore >= 75
                  ? "Clear and compelling."
                  : result.clarityScore >= 45
                  ? "Needs sharpening."
                  : "Confusing or too vague."}
              </p>
            </div>
          </div>
        </Card>

        {/* ── Biggest Weakness ── */}
        <Card className="sm:col-span-2" delay={0.12}>
          <CardHeader
            icon={<Target className="w-3.5 h-3.5 text-amber-400" />}
            iconColor="bg-amber-500/10"
            label="Biggest Weakness"
          />
          {result.likelyInvestorQuestion && (
            <p className="text-[11px] text-stone-500 mt-3 leading-relaxed border-b border-[#EDE8E0] pb-3">
              <span className="text-stone-500 font-medium">Likely first question: </span>
              {result.likelyInvestorQuestion}
            </p>
          )}
          <p className="text-[13px] text-stone-700 leading-relaxed">{result.biggestWeakness}</p>
        </Card>

        {/* ── Moat Risk ── */}
        <Card className="sm:col-span-2" delay={0.18}>
          <CardHeader
            icon={<ShieldAlert className="w-3.5 h-3.5 text-purple-400" />}
            iconColor="bg-purple-500/10"
            label="Moat Risk"
            badge={
              <span className="text-[11px] text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full font-medium">
                {result.moatRisk.label}
              </span>
            }
          />
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-stone-400 mb-2.5">
              <span>Defensible</span>
              <span>Easily copied</span>
            </div>
            <div className="relative h-1.5 bg-[#E7E0D6] rounded-full">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-purple-500 to-red-500/60"
                initial={{ width: 0 }}
                animate={{ width: `${result.moatRisk.riskScore}%` }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
              />
              <div
                className="absolute w-3 h-3 rounded-full bg-purple-400 border-2 border-[#F7F3EA] shadow-sm"
                style={{ left: `${result.moatRisk.riskScore}%`, top: "50%", transform: "translate(-50%, -50%)" }}
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-[12px] text-stone-500 leading-relaxed">
            {result.moatRisk.description}
          </p>
        </Card>

        {/* ── Customer Doubt ── */}
        <Card className="sm:col-span-2" delay={0.24}>
          <CardHeader
            icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
            iconColor="bg-amber-500/10"
            label="Customer Doubt"
          />
          <div className="flex flex-wrap gap-2">
            {result.customerDoubt.map(({ label, variant }, i) => {
              const s = DOUBT_STYLES[variant] ?? DOUBT_STYLES.slate;
              return (
                <motion.span
                  key={`${label}-${i}`}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.45 + i * 0.07, ease: "easeOut" }}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium border ${s.text} ${s.bg} ${s.border}`}
                >
                  {label}
                </motion.span>
              );
            })}
          </div>
        </Card>

        {/* ── Investor Red Flags ── */}
        <Card className="sm:col-span-2 hover:border-red-300" delay={0.3}>
          <CardHeader
            icon={<AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
            iconColor="bg-red-500/10"
            label={RED_FLAGS_LABEL[context] ?? "Red Flags"}   
            badge={
              result.investorRedFlags.length > 0 ? (
                <span className="text-[11px] text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full font-medium">
                  {result.investorRedFlags.length} detected
                </span>
              ) : (
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                  None found
                </span>
              )
            }
          />
          {result.investorRedFlags.length === 0 ? (
            <p className="text-[12px] text-stone-500">
              No major investor red flags detected in this pitch.
            </p>
          ) : (
            <div className="space-y-2.5">
              {result.investorRedFlags.map(({ flag, detail }, i) => (
                <motion.div
                  key={`${flag}-${i}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.5 + i * 0.07, ease: "easeOut" }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EDE8E0]"
                >
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.25" aria-hidden="true" />
                  <div>
                    <p className="text-[12px] font-semibold text-red-600 leading-none mb-1.5">{flag}</p>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Weak Phrases ── */}
        {result.weakPhrases && result.weakPhrases.length > 0 && (
          <Card className="sm:col-span-2" delay={0.33}>
            <CardHeader
              icon={<Quote className="w-3.5 h-3.5 text-cyan-400" />}
              iconColor="bg-cyan-500/10"
              label="Weak Phrases"
              badge={
                <span className="text-[11px] text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full font-medium">
                  {result.weakPhrases.length} flagged
                </span>
              }
            />
            <div className="space-y-2.5">
              {result.weakPhrases.map(({ phrase, meaning }, i) => (
                <motion.div
                  key={`${phrase}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: 0.52 + i * 0.06, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-xl bg-[#FAF7F2] border border-[#EDE8E0] hover:border-sky-200 transition-colors duration-200"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-sky-400/60 to-sky-400/0"
                    aria-hidden="true"
                  />
                  <div className="pl-4 pr-3 py-3">
                    <p className="text-[12px] font-semibold text-stone-900 mb-1.5 leading-snug font-mono tracking-tight">
                      &ldquo;{phrase}&rdquo;
                    </p>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{meaning}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Stronger Rewrite ── */}
        <Card className="sm:col-span-2 hover:border-emerald-300" delay={0.36}>
          <CardHeader
            icon={<MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
            iconColor="bg-emerald-500/10"
            label="Stronger Rewrite"
            badge={
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-500 bg-[#F5F0E8] border border-[#E7E0D6] px-2.5 py-1 rounded-full font-medium">
                  {result.confidenceScore}% confidence
                </span>
                <button
                  onClick={() => handleCopy(result.strongerRewrite)}
                  className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border text-[11px] font-medium transition-all duration-150 ${
                    copied
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-[#F5F0E8] border-[#E7E0D6] text-stone-500 hover:text-stone-800 hover:border-[#D4CBBF]"
                  }`}
                  aria-label="Copy stronger rewrite to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" aria-hidden="true" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" aria-hidden="true" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            }
          />
          <div className="relative pl-4">
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-emerald-500/25"
              aria-hidden="true"
            />
            <blockquote className="text-[13px] text-stone-700 leading-relaxed italic">
              &ldquo;{result.strongerRewrite}&rdquo;
            </blockquote>
          </div>
        </Card>

        {/* ── Likely Question ── */}
        <Card className="sm:col-span-2" delay={0.42}>
          <CardHeader
            icon={<HelpCircle className="w-3.5 h-3.5 text-blue-400" />}
            iconColor="bg-blue-500/10"
            label={QUESTION_LABEL[context] ?? "Toughest Question"}
          />
          <p className="text-[13px] text-stone-800 leading-relaxed font-medium">
            &ldquo;{result.likelyInvestorQuestion}&rdquo;
          </p>
          <p className="text-[11px] text-stone-500 mt-2.5 leading-relaxed">
            {QUESTION_FOOTER[context] ?? "Prepare a crisp, direct answer to this before your next pitch."}
          </p>
        </Card>

      </div>
    </div>
  );
}
