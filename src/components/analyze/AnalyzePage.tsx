"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { InputPanel } from "./InputPanel";
import { ResultsDashboard } from "./ResultsDashboard";
import type { AnalysisResult } from "@/lib/types/analysis";

export function AnalyzePage() {
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("investor");
  const [goal, setGoal] = useState("find_weaknesses");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Track whether we're re-analyzing on top of an existing result
  const isReanalyzing = isLoading && result !== null;
  // Ref to the results column — used for mobile auto-scroll
  const resultsRef = useRef<HTMLElement>(null);

  const scrollToResults = useCallback(() => {
    // Only auto-scroll on mobile (below lg breakpoint)
    if (window.innerWidth < 1024 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  async function handleAnalyze() {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    // Do NOT clear result here — keep previous visible during re-analyze
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context, goal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        // Leave previous result visible on error
      } else {
        setResult(data.result);
        scrollToResults();
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessage("");
    setContext("investor");
    setGoal("find_weaknesses");
    setResult(null);
    setError(null);
  }

  return (
    <div className="bg-[#F7F3EA] min-h-screen lg:h-screen flex flex-col lg:overflow-hidden">
      {/* Top bar */}
      <header className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-[#E7E0D6] bg-[#F7F3EA] z-10">
        <Link
          href="/"
          className="flex items-center gap-2 select-none"
          aria-label="PitchCrush AI home"
        >
          <div className="flex flex-col gap-0.75" aria-hidden="true">
            <span className="block w-4 h-px bg-red-500" />
            <span className="block w-2.5 h-px bg-red-400/60" />
          </div>
          <span className="font-semibold text-[#171717] text-[15px] tracking-tight leading-none">
            PitchCrush<span className="text-red-500">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-stone-500 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            AI ready
          </span>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-[#E7E0D6] text-[12px] text-stone-500 hover:text-stone-900 hover:border-[#D4CBBF] transition-all duration-150 select-none"
            aria-label="Start a new analysis"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            New analysis
          </button>
        </div>
      </header>

      {/* 2-column layout */}
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        {/* Left: Input panel */}
        <aside className="lg:w-100 xl:w-110 shrink-0 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-[#E7E0D6]">
          <InputPanel
            message={message}
            context={context}
            goal={goal}
            isLoading={isLoading}
            onMessageChange={setMessage}
            onContextChange={setContext}
            onGoalChange={setGoal}
            onAnalyze={handleAnalyze}
          />
        </aside>

        {/* Right: Results */}
        <main ref={resultsRef} className="flex-1 lg:overflow-y-auto">
          <ResultsDashboard
            isLoading={isLoading}
            isReanalyzing={isReanalyzing}
            result={result}
            error={error}
          />
        </main>
      </div>
    </div>
  );
}
