"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "Scanning investor objections...",
  "Assessing competitive moat...",
  "Finding critical weaknesses...",
  "Crafting stronger rewrite...",
];

const STEPS = [
  { label: "Investor signals", pct: 22 },
  { label: "Moat analysis",    pct: 47 },
  { label: "Weak points",      pct: 73 },
  { label: "Rewrite",          pct: 91 },
];

/* ─── Full-panel loader (first analysis) ───────────────────────── */

export function AnalyzingLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const step = STEPS[index];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-90 gap-10 p-8 select-none">
      {/* Layered rings with center dot */}
      <div className="relative w-20 h-20 flex items-center justify-center" aria-hidden="true">
        <span
          className="absolute inset-0 rounded-full border border-red-500/15 animate-ping"
          style={{ animationDuration: "2s" }}
        />
        <span
          className="absolute inset-3 rounded-full border border-red-500/20 animate-ping"
          style={{ animationDuration: "2s", animationDelay: "0.4s" }}
        />
        <span
          className="absolute inset-6 rounded-full border border-red-500/30 animate-ping"
          style={{ animationDuration: "2s", animationDelay: "0.8s" }}
        />
        <div className="relative w-2 h-2 rounded-full bg-red-400 shadow-sm shadow-red-400/60" />
      </div>

      <div className="flex flex-col items-center gap-5 w-full max-w-64">
        {/* Step label */}
        <div className="h-5 overflow-hidden" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-[13px] text-neutral-400 text-center"
            >
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-red-600 to-red-400 rounded-full"
              animate={{ width: `${step.pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <div
                key={s.label}
                className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                  i <= index ? "bg-red-500" : "bg-[#1e1e1e]"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Re-analyze overlay (shown on top of existing results) ──────── */

export function ReanalyzingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0A0A0A]/80 backdrop-blur-sm rounded-none"
      aria-live="polite"
    >
      {/* Spinning ring */}
      <div className="relative w-10 h-10 flex items-center justify-center" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          viewBox="0 0 40 40"
          style={{ animationDuration: "1.2s" }}
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="60 40"
            className="text-red-500"
          />
        </svg>
        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
      </div>

      {/* Rotating text */}
      <div className="h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="text-[12px] text-neutral-500 text-center"
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
