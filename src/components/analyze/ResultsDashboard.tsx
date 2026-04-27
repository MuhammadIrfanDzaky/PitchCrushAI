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

/* ─── Color map for doubt chips ─────────────────────────────────── */

const DOUBT_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  amber:   { text: "text-amber-400",   bg: "bg-amber-500/8",   border: "border-amber-500/20"   },
  blue:    { text: "text-blue-400",    bg: "bg-blue-500/8",    border: "border-blue-500/20"    },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/20" },
  slate:   { text: "text-neutral-400", bg: "bg-neutral-500/8", border: "border-neutral-500/20" },
  purple:  { text: "text-purple-400",  bg: "bg-purple-500/8",  border: "border-purple-500/20"  },
  red:     { text: "text-red-400",     bg: "bg-red-500/8",     border: "border-red-500/20"     },
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
          stroke="#1a1a1a"
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
        <span className="text-[17px] font-bold text-white tabular-nums">{value}</span>
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
      className={`p-5 rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#222222] transition-colors duration-300 ${className}`}
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
      <span className="text-[12px] font-medium text-neutral-500">{label}</span>
      {badge && <div className="ml-auto">{badge}</div>}
    </div>
  );
}

/* ─── Idle / empty state ─────────────────────────────────────────── */

const SIGNAL_PREVIEW = [
  { label: "Skepticism Score",   color: "text-red-400",     bg: "bg-red-500/8",     border: "border-red-500/15"     },
  { label: "Clarity Score",      color: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/15" },
  { label: "Biggest Weakness",   color: "text-amber-400",   bg: "bg-amber-500/8",   border: "border-amber-500/15"   },
  { label: "Likely Question",    color: "text-blue-400",    bg: "bg-blue-500/8",    border: "border-blue-500/15"    },
  { label: "Moat Risk",          color: "text-purple-400",  bg: "bg-purple-500/8",  border: "border-purple-500/15"  },
  { label: "Customer Doubt",     color: "text-amber-400",   bg: "bg-amber-500/8",   border: "border-amber-500/15"   },
  { label: "Weak Phrases",       color: "text-cyan-400",    bg: "bg-cyan-500/8",    border: "border-cyan-500/15"    },
  { label: "Stronger Rewrite",   color: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/15" },
  { label: "Investor Red Flags", color: "text-red-400",     bg: "bg-red-500/8",     border: "border-red-500/15"     },
] as const;

function IdleState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-90 gap-7 p-8 select-none">
      <div
        className="w-12 h-12 rounded-2xl bg-red-500/8 border border-red-500/15 flex items-center justify-center"
        aria-hidden="true"
      >
        <Sparkles className="w-5 h-5 text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-white tracking-tight">
          Ready to crush your pitch
        </p>
        <p className="text-[12px] text-neutral-600 mt-1.5 leading-relaxed max-w-64">
          Paste your pitch and hit Analyze &mdash; we&apos;ll stress test it like a skeptical investor.
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
        className="w-12 h-12 rounded-2xl bg-red-500/8 border border-red-500/15 flex items-center justify-center"
        aria-hidden="true"
      >
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-white tracking-tight">Analysis failed</p>
        <p className="text-[12px] text-neutral-600 mt-1.5 leading-relaxed max-w-72">{message}</p>
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
}

export function ResultsDashboard({ isLoading, isReanalyzing, result, error }: ResultsDashboardProps) {
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
            className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20"
            role="alert"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
            <p className="text-[12px] text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-white tracking-tight">
            Pitch Stress Test
          </h2>
          <p className="text-[12px] text-neutral-600 mt-0.5">9 signal layers analyzed</p>
        </div>
        <span className="text-[10px] text-red-500 bg-red-500/8 border border-red-500/15 px-2.5 py-1 rounded-full font-mono select-none">
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
              <p className="text-2xl font-bold text-white tabular-nums leading-none">
                {result.skepticismScore}
                <span className="text-sm font-normal text-neutral-600"> / 100</span>
              </p>
              <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
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
              <p className="text-2xl font-bold text-white tabular-nums leading-none">
                {result.clarityScore}
                <span className="text-sm font-normal text-neutral-600"> / 100</span>
              </p>
              <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
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
            <p className="text-[11px] text-neutral-700 mb-3 leading-relaxed border-b border-[#1a1a1a] pb-3">
              <span className="text-neutral-500 font-medium">Likely first question: </span>
              {result.likelyInvestorQuestion}
            </p>
          )}
          <p className="text-[13px] text-neutral-400 leading-relaxed">{result.biggestWeakness}</p>
        </Card>

        {/* ── Moat Risk ── */}
        <Card className="sm:col-span-2" delay={0.18}>
          <CardHeader
            icon={<ShieldAlert className="w-3.5 h-3.5 text-purple-400" />}
            iconColor="bg-purple-500/10"
            label="Moat Risk"
            badge={
              <span className="text-[11px] text-purple-400 bg-purple-500/8 border border-purple-500/20 px-2.5 py-1 rounded-full font-medium">
                {result.moatRisk.label}
              </span>
            }
          />
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-neutral-700 mb-2.5">
              <span>Defensible</span>
              <span>Easily copied</span>
            </div>
            <div className="relative h-1.5 bg-[#1a1a1a] rounded-full">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-purple-500 to-red-500/60"
                initial={{ width: 0 }}
                animate={{ width: `${result.moatRisk.riskScore}%` }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
              />
              <div
                className="absolute w-3 h-3 rounded-full bg-purple-400 border-2 border-[#0d0d0d] shadow-sm"
                style={{ left: `${result.moatRisk.riskScore}%`, top: "50%", transform: "translate(-50%, -50%)" }}
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-[12px] text-neutral-600 leading-relaxed">
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
        <Card className="sm:col-span-2 hover:border-red-500/15" delay={0.3}>
          <CardHeader
            icon={<AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
            iconColor="bg-red-500/10"
            label="Investor Red Flags"
            badge={
              result.investorRedFlags.length > 0 ? (
                <span className="text-[11px] text-red-400 bg-red-500/8 border border-red-500/20 px-2.5 py-1 rounded-full font-medium">
                  {result.investorRedFlags.length} detected
                </span>
              ) : (
                <span className="text-[11px] text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                  None found
                </span>
              )
            }
          />
          {result.investorRedFlags.length === 0 ? (
            <p className="text-[12px] text-neutral-600">
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
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-[#141414]"
                >
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.25" aria-hidden="true" />
                  <div>
                    <p className="text-[12px] font-semibold text-red-300 leading-none mb-1.5">{flag}</p>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">{detail}</p>
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
                <span className="text-[11px] text-cyan-400 bg-cyan-500/8 border border-cyan-500/20 px-2.5 py-1 rounded-full font-medium">
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
                  className="group relative overflow-hidden rounded-xl bg-[#0A0A0A] border border-[#141414] hover:border-cyan-500/15 transition-colors duration-200"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-cyan-500/40 to-cyan-500/0"
                    aria-hidden="true"
                  />
                  <div className="pl-4 pr-3 py-3">
                    <p className="text-[12px] font-semibold text-white mb-1.5 leading-snug font-mono tracking-tight">
                      &ldquo;{phrase}&rdquo;
                    </p>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">{meaning}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Stronger Rewrite ── */}
        <Card className="sm:col-span-2 hover:border-emerald-500/20" delay={0.36}>
          <CardHeader
            icon={<MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
            iconColor="bg-emerald-500/10"
            label="Stronger Rewrite"
            badge={
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-600 bg-[#111111] border border-[#1e1e1e] px-2.5 py-1 rounded-full font-medium">
                  {result.confidenceScore}% confidence
                </span>
                <button
                  onClick={() => handleCopy(result.strongerRewrite)}
                  className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border text-[11px] font-medium transition-all duration-150 ${
                    copied
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                      : "bg-[#111111] border-[#1e1e1e] text-neutral-500 hover:text-white hover:border-[#2a2a2a]"
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
            <blockquote className="text-[13px] text-neutral-300 leading-relaxed italic">
              &ldquo;{result.strongerRewrite}&rdquo;
            </blockquote>
          </div>
        </Card>

        {/* ── Likely Investor Question ── */}
        <Card className="sm:col-span-2" delay={0.42}>
          <CardHeader
            icon={<HelpCircle className="w-3.5 h-3.5 text-blue-400" />}
            iconColor="bg-blue-500/10"
            label="Likely Investor Question"
          />
          <p className="text-[13px] text-neutral-300 leading-relaxed font-medium">
            &ldquo;{result.likelyInvestorQuestion}&rdquo;
          </p>
          <p className="text-[11px] text-neutral-600 mt-2.5 leading-relaxed">
            Prepare a crisp, direct answer to this before your next pitch meeting.
          </p>
        </Card>

      </div>
    </div>
  );
}
