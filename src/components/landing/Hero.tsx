"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const STATS = [
  { value: "50K+", label: "Messages decoded" },
  { value: "< 3s", label: "Per analysis" },
  { value: "8", label: "Signal layers" },
] as const;

const ANALYSIS_ROWS = [
  { label: "Hidden Intent", value: "Negotiating leverage", color: "text-amber-400" },
  { label: "Emotional Tone", value: "Guarded, slightly anxious", color: "text-blue-400" },
  { label: "Power Dynamic", value: "Caller holds advantage", color: "text-purple-400" },
  { label: "Red Flags", value: "Timeline deflection", color: "text-red-400" },
] as const;

function AppMockup() {
  return (
    <div className="w-full rounded-2xl bg-[#0e0e0e] border border-[#1e1e1e] overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#181818] bg-[#0a0a0a]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center text-[11px] text-neutral-700 font-medium select-none">
          subtextai.com/analyze
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-600 font-medium">Analyzing</span>
        </span>
      </div>

      {/* Message input area */}
      <div className="px-5 pt-5 pb-4 border-b border-[#181818]">
        <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest mb-3">
          Message
        </p>
        <p className="text-sm text-neutral-300 leading-relaxed">
          "Thanks for the offer. I'll need to think it over and get back to you by end of week."
        </p>
      </div>

      {/* Analysis results */}
      <div className="px-5 py-4 space-y-1 border-b border-[#181818]">
        <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest mb-3">
          Analysis
        </p>

        {/* Interest score with bar */}
        <div className="flex items-center justify-between gap-4 py-1.5">
          <span className="text-[12px] text-neutral-500 shrink-0 w-28">Interest Score</span>
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "73%" }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-[12px] font-semibold text-emerald-400 w-12 text-right">
              73 / 100
            </span>
          </div>
        </div>

        {ANALYSIS_ROWS.map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between gap-4 py-1.5">
            <span className="text-[12px] text-neutral-500 shrink-0 w-28">{label}</span>
            <span className={`text-[12px] font-medium ${color} text-right`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Recommended reply */}
      <div className="p-5">
        <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/15 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">
              Recommended Reply
            </p>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
              94% confidence
            </span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">
            "I appreciate the offer. I'd like 48 hours to review the full terms before committing."
          </p>
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-175 h-175 rounded-full bg-emerald-500/5 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-100 h-100 rounded-full bg-cyan-500/4 blur-[100px]" />
      </div>

      {/* Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">

          {/* Left: Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-[#1e1e1e] text-[11px] text-neutral-500 tracking-wide select-none">
                <Sparkles className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                AI Communication Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-[52px] sm:text-6xl lg:text-[64px] font-semibold tracking-tighter text-white leading-[1.03]"
            >
              Decode what
              <br />
              people{" "}
              <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent italic">
                really
              </span>{" "}
              mean.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-[17px] text-neutral-500 leading-relaxed max-w-md"
            >
              Paste any message. Reveal hidden intent, emotional signals, and the
              smartest next reply — in seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start gap-3"
            >
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 active:scale-[0.98] transition-all duration-150 select-none"
              >
                Try Free Decoder
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center h-11 px-6 rounded-full border border-[#1e1e1e] text-sm text-neutral-500 hover:text-white hover:border-[#2e2e2e] active:scale-[0.98] transition-all duration-150 select-none"
              >
                See how it works
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={itemVariants} className="flex items-center gap-0 pt-1">
              {STATS.map(({ value, label }, i) => (
                <div key={label} className="flex items-center">
                  <div className="pr-6">
                    <p className="text-xl font-semibold text-white tracking-tight tabular-nums">
                      {value}
                    </p>
                    <p className="text-[11px] text-neutral-600 mt-0.5">{label}</p>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="w-px h-8 bg-[#1e1e1e] mr-6" aria-hidden="true" />
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: App mockup */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="relative lg:block"
          >
            {/* Card glow border */}
            <div
              aria-hidden="true"
              className="absolute -inset-px rounded-2xl bg-linear-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none z-10"
            />
            <AppMockup />
          </motion.div>

        </div>
      </div>
    </section>
  );
}


const PREVIEW_ROWS = [
  { label: "Hidden Intent", value: "Negotiating leverage", color: "text-amber-400" },
  { label: "Emotional Tone", value: "Guarded, slightly anxious", color: "text-blue-400" },
  { label: "Interest Score", value: "73 / 100", color: "text-emerald-400" },
  { label: "Power Dynamic", value: "Caller holds advantage", color: "text-purple-400" },
] as const;

function AnalysisPreviewCard() {
  return (
    <div className="w-full rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden shadow-2xl shadow-black/60">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1a1a1a]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
        <span className="ml-3 text-[11px] text-neutral-600 font-mono">
          subtextai — analysis.json
        </span>
      </div>

      {/* Input snippet */}
      <div className="px-5 py-4 border-b border-[#1a1a1a]">
        <p className="text-[11px] text-neutral-600 mb-1.5 font-mono uppercase tracking-wider">
          Input message
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed italic">
          "Thanks for the offer. I'll need to think it over and get back to you by end of week."
        </p>
      </div>

      {/* Analysis rows */}
      <div className="px-5 py-4 space-y-2.5">
        {PREVIEW_ROWS.map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-600">{label}</span>
            <span className={`text-[11px] font-medium ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Recommended reply */}
      <div className="mx-5 mb-5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-3.5">
        <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider mb-1.5">
          Recommended Reply
        </p>
        <p className="text-xs text-neutral-300 leading-relaxed">
          "I appreciate the offer. I'd like 48 hours to review the full terms before committing."
        </p>
      </div>
    </div>
  );
}

