"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "Reading emotional signals...",
  "Checking power dynamics...",
  "Detecting hidden intent...",
  "Crafting smart response...",
];

export function AnalyzingLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-90 gap-10 p-8 select-none">
      {/* Pulsing rings */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping"
          style={{ animationDuration: "1.6s" }}
          aria-hidden="true"
        />
        <span
          className="absolute inset-2 rounded-full border border-emerald-500/15 animate-ping"
          style={{ animationDuration: "1.6s", animationDelay: "0.3s" }}
          aria-hidden="true"
        />
        <span
          className="absolute inset-4 rounded-full border border-emerald-500/10 animate-ping"
          style={{ animationDuration: "1.6s", animationDelay: "0.6s" }}
          aria-hidden="true"
        />
        <div
          className="relative w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"
          aria-hidden="true"
        />
      </div>

      {/* Rotating status text */}
      <div className="h-5 overflow-hidden" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="text-[13px] text-neutral-500 text-center"
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
