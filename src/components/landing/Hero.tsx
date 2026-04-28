"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const SIGNAL_EXAMPLES = [
  { phrase: "We're Uber for lawyers",        signal: "Generic positioning detected", variant: "red"   as const },
  { phrase: "AI helps SMBs grow",             signal: "No moat signal",              variant: "amber" as const },
  { phrase: "We automate back-office work",   signal: "Too broad to defend",         variant: "amber" as const },
  { phrase: "The market is huge",             signal: "Weak evidence",               variant: "red"   as const },
] as const;

const SIGNAL_STYLES = {
  red:   "text-red-600 bg-red-50 border border-red-100",
  amber: "text-amber-600 bg-amber-50 border border-amber-100",
} as const;

function PitchSignalTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % SIGNAL_EXAMPLES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const { phrase, signal, variant } = SIGNAL_EXAMPLES[index];

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">
        Detects patterns like
      </p>

      {/* Card with fixed height to prevent layout shift */}
      <div className="bg-white border border-[#E7E0D6] rounded-xl px-4 py-3 shadow-sm w-full max-w-sm min-h-[64px] flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -9 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <p className="text-[13px] text-stone-800 font-medium leading-snug">
              &ldquo;{phrase}&rdquo;
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-stone-400 text-[10px] leading-none" aria-hidden="true">↳</span>
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${SIGNAL_STYLES[variant]}`}>
                {signal}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1 pl-0.5" aria-hidden="true">
        {SIGNAL_EXAMPLES.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? "w-4 bg-stone-400" : "w-1 bg-[#E7E0D6]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const ANALYSIS_ROWS = [
  { label: "Biggest Weakness",    value: "No proof of traction",   color: "text-amber-400" },
  { label: "Moat Risk",           value: "Easily replicated",      color: "text-purple-400" },
  { label: "Customer Doubt",      value: "Why now? Why you?",      color: "text-blue-400" },
  { label: "Investor Red Flags",  value: "2 detected",             color: "text-red-400" },
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
          pitchcrush.ai/analyze
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-red-500 font-medium">Crushing</span>
        </span>
      </div>

      {/* Message input area */}
      <div className="px-5 pt-5 pb-4 border-b border-[#181818]">
        <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest mb-3">
          Pitch
        </p>
        <p className="text-sm text-neutral-300 leading-relaxed">
          &ldquo;We&apos;re building the Stripe for B2B payments in Southeast Asia. We have 3 pilot customers and are raising $1.5M seed.&rdquo;
        </p>
      </div>

      {/* Analysis results */}
      <div className="px-5 py-4 space-y-1 border-b border-[#181818]">
        <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest mb-3">
          Analysis
        </p>

        {/* Interest score with bar */}
        <div className="flex items-center justify-between gap-4 py-1.5">
          <span className="text-[12px] text-neutral-500 shrink-0 w-28">Skepticism Score</span>
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-[12px] font-semibold text-red-400 w-12 text-right">
              78 / 100
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

      {/* Stronger rewrite */}
      <div className="p-5">
        <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/15 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">
              Stronger Rewrite
            </p>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
              82% clarity
            </span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">
            &ldquo;We&apos;re the first B2B payments infrastructure built for Southeast Asia&apos;s fragmented banking system. 3 enterprise pilots, $180K ARR, raising $1.5M to expand to Indonesia and Vietnam.&rdquo;
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
    <section className="relative min-h-screen flex items-center px-6 pt-20 pb-16">
      {/* Background glows — overflow-hidden scoped here so section content can breathe */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-175 h-175 rounded-full bg-red-400/8 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-100 h-100 rounded-full bg-amber-400/6 blur-[100px]" />
      </div>

      {/* Subtle warm dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C4BBAF 1px, transparent 1px)",
          backgroundSize: "32px 32px",
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
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E7E0D6] text-[11px] text-stone-500 tracking-wide select-none shadow-sm">
                <Sparkles className="w-3 h-3 text-red-500" aria-hidden="true" />
                AI Pitch Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-[52px] sm:text-6xl lg:text-[64px] font-heading font-normal tracking-tight text-stone-900 leading-[1.06]"
            >
              Stress test your
              <br />
              pitch{" "}
              <span className="text-red-600 italic">
                before
              </span>{" "}
              investors do.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-[17px] text-stone-600 leading-relaxed max-w-md"
            >
              Paste your pitch. Get brutally honest feedback simulating how VCs,
              customers, and competitors will tear it apart &mdash; in seconds.
            </motion.p>

            {/* Rotating signal ticker */}
            <motion.div variants={itemVariants}>
              <PitchSignalTicker />
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start gap-3"
            >
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:scale-[0.98] transition-all duration-150 select-none"
              >
                Crush My Pitch
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center h-11 px-6 rounded-full border border-stone-300 text-sm text-stone-600 hover:text-stone-900 hover:border-stone-400 active:scale-[0.98] transition-all duration-150 select-none"
              >
                See how it works
              </Link>
            </motion.div>

          </motion.div>

          {/* Right: App mockup */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            {/* Card glow border */}
            <div
              aria-hidden="true"
              className="absolute -inset-px rounded-2xl bg-linear-to-b from-red-500/10 via-transparent to-transparent pointer-events-none z-10"
            />
            <AppMockup />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

