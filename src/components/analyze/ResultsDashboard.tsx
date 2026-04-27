"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Zap,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  Activity,
  Sparkles,
} from "lucide-react";
import { AnalyzingLoader } from "./AnalyzingLoader";
import type { AnalysisResult } from "@/lib/types/analysis";

/* ─── Color map for tone chips ──────────────────────────────────── */

const TONE_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  amber: { text: "text-amber-400", bg: "bg-amber-500/8", border: "border-amber-500/20" },
  blue: { text: "text-blue-400", bg: "bg-blue-500/8", border: "border-blue-500/20" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/20" },
  slate: { text: "text-neutral-400", bg: "bg-neutral-500/8", border: "border-neutral-500/20" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/8", border: "border-purple-500/20" },
  red: { text: "text-red-400", bg: "bg-red-500/8", border: "border-red-500/20" },
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

function IdleState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-90 gap-6 p-8 select-none">
      <div
        className="w-12 h-12 rounded-2xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center"
        aria-hidden="true"
      >
        <Sparkles className="w-5 h-5 text-emerald-400" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-white tracking-tight">
          Ready to decode
        </p>
        <p className="text-[12px] text-neutral-600 mt-1.5 leading-relaxed max-w-64">
          Paste any message in the panel and hit Analyze to reveal what&apos;s really going on.
        </p>
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
  result: AnalysisResult | null;
  error: string | null;
}

export function ResultsDashboard({ isLoading, result, error }: ResultsDashboardProps) {
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

  if (isLoading) return <AnalyzingLoader />;
  if (error) return <ErrorState message={error} />;
  if (!result) return <IdleState />;

  return (
    <div className="p-6 lg:p-8">
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-white tracking-tight">
            Analysis Results
          </h2>
          <p className="text-[12px] text-neutral-600 mt-0.5">8 signal layers decoded</p>
        </div>
        <span className="text-[10px] text-emerald-600 bg-emerald-500/8 border border-emerald-500/15 px-2.5 py-1 rounded-full font-mono select-none">
          live · AI
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* ── Interest Score ── */}
        <Card delay={0}>
          <CardHeader
            icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            iconColor="bg-emerald-500/10"
            label="Interest Score"
          />
          <div className="flex items-center gap-4">
            <CircleProgress value={result.interestScore} colorClass="text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-white tabular-nums leading-none">
                {result.interestScore}
                <span className="text-sm font-normal text-neutral-600"> / 100</span>
              </p>
              <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
                {result.interestScore >= 70
                  ? "High interest detected."
                  : result.interestScore >= 40
                  ? "Moderate interest."
                  : "Low interest signals."}
              </p>
            </div>
          </div>
        </Card>

        {/* ── Confidence Score ── */}
        <Card delay={0.06}>
          <CardHeader
            icon={<CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
            iconColor="bg-blue-500/10"
            label="Analysis Confidence"
          />
          <div className="flex items-center gap-4">
            <CircleProgress value={result.confidenceScore} colorClass="text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-white tabular-nums leading-none">
                {result.confidenceScore}
                <span className="text-sm font-normal text-neutral-600">%</span>
              </p>
              <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
                {result.confidenceScore >= 80
                  ? "High confidence."
                  : result.confidenceScore >= 55
                  ? "Moderate confidence."
                  : "Low signal clarity."}
              </p>
            </div>
          </div>
        </Card>

        {/* ── Hidden Intent ── */}
        <Card className="sm:col-span-2" delay={0.12}>
          <CardHeader
            icon={<Target className="w-3.5 h-3.5 text-amber-400" />}
            iconColor="bg-amber-500/10"
            label="Hidden Intent"
          />
          {result.surfaceMeaning && (
            <p className="text-[11px] text-neutral-700 mb-3 leading-relaxed border-b border-[#1a1a1a] pb-3">
              <span className="text-neutral-600 font-medium">Surface: </span>
              {result.surfaceMeaning}
            </p>
          )}
          <p className="text-[13px] text-neutral-400 leading-relaxed">{result.hiddenIntent}</p>
        </Card>

        {/* ── Power Dynamic ── */}
        <Card className="sm:col-span-2" delay={0.18}>
          <CardHeader
            icon={<Activity className="w-3.5 h-3.5 text-purple-400" />}
            iconColor="bg-purple-500/10"
            label="Power Dynamic"
            badge={
              <span className="text-[11px] text-purple-400 bg-purple-500/8 border border-purple-500/20 px-2.5 py-1 rounded-full font-medium">
                {result.powerDynamic.label}
              </span>
            }
          />
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-neutral-700 mb-2.5">
              <span>Sender</span>
              <span>Receiver</span>
            </div>
            <div className="relative h-1.5 bg-[#1a1a1a] rounded-full">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-purple-500 to-purple-500/20"
                initial={{ width: 0 }}
                animate={{ width: `${result.powerDynamic.senderScore}%` }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
              />
              <div
                className="absolute w-3 h-3 rounded-full bg-purple-400 border-2 border-[#0d0d0d] shadow-sm"
                style={{
                  left: `${result.powerDynamic.senderScore}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-[12px] text-neutral-600 leading-relaxed">
            {result.powerDynamic.description}
          </p>
        </Card>

        {/* ── Emotional Tone ── */}
        <Card className="sm:col-span-2" delay={0.24}>
          <CardHeader
            icon={<Zap className="w-3.5 h-3.5 text-cyan-400" />}
            iconColor="bg-cyan-500/10"
            label="Emotional Tone"
          />
          <div className="flex flex-wrap gap-2">
            {result.emotionalTone.map(({ label, variant }, i) => {
              const s = TONE_STYLES[variant] ?? TONE_STYLES.slate;
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

        {/* ── Red Flags ── */}
        <Card className="sm:col-span-2 hover:border-red-500/15" delay={0.3}>
          <CardHeader
            icon={<AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
            iconColor="bg-red-500/10"
            label="Red Flags"
            badge={
              result.redFlags.length > 0 ? (
                <span className="text-[11px] text-red-400 bg-red-500/8 border border-red-500/20 px-2.5 py-1 rounded-full font-medium">
                  {result.redFlags.length} detected
                </span>
              ) : (
                <span className="text-[11px] text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                  None found
                </span>
              )
            }
          />
          {result.redFlags.length === 0 ? (
            <p className="text-[12px] text-neutral-600">
              No significant red flags detected in this message.
            </p>
          ) : (
            <div className="space-y-2.5">
              {result.redFlags.map(({ flag, detail }, i) => (
                <motion.div
                  key={`${flag}-${i}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.5 + i * 0.07, ease: "easeOut" }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-[#141414]"
                >
                  <div
                    className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.25"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-[12px] font-semibold text-red-300 leading-none mb-1.5">
                      {flag}
                    </p>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">{detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Recommended Reply ── */}
        <Card className="sm:col-span-2 hover:border-emerald-500/20" delay={0.36}>
          <CardHeader
            icon={<MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
            iconColor="bg-emerald-500/10"
            label="Recommended Reply"
            badge={
              <button
                onClick={() => handleCopy(result.recommendedReply)}
                className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border text-[11px] font-medium transition-all duration-150 ${
                  copied
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                    : "bg-[#111111] border-[#1e1e1e] text-neutral-500 hover:text-white hover:border-[#2a2a2a]"
                }`}
                aria-label="Copy recommended reply to clipboard"
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
            }
          />
          <div className="relative pl-4">
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-emerald-500/25"
              aria-hidden="true"
            />
            <blockquote className="text-[13px] text-neutral-300 leading-relaxed italic">
              &ldquo;{result.recommendedReply}&rdquo;
            </blockquote>
          </div>
        </Card>

      </div>
    </div>
  );
}
