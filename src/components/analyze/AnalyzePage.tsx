"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { InputPanel } from "./InputPanel";
import { ResultsDashboard } from "./ResultsDashboard";
import type { AnalysisResult } from "@/lib/types/analysis";

export function AnalyzePage() {
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("recruiter");
  const [goal, setGoal] = useState("understand");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context, goal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setResult(null);
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessage("");
    setContext("recruiter");
    setGoal("understand");
    setResult(null);
    setError(null);
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen lg:h-screen flex flex-col lg:overflow-hidden">
      {/* Top bar */}
      <header className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-[#111111] bg-[#0A0A0A] z-10">
        <Link
          href="/"
          className="flex items-center gap-2 select-none"
          aria-label="SubtextAI home"
        >
          <div className="flex flex-col gap-0.75" aria-hidden="true">
            <span className="block w-4 h-px bg-emerald-400" />
            <span className="block w-2.5 h-px bg-emerald-400/50" />
          </div>
          <span className="font-semibold text-white text-[15px] tracking-tight leading-none">
            Subtext<span className="text-emerald-400">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-600 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI ready
          </span>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#111111] border border-[#1e1e1e] text-[12px] text-neutral-500 hover:text-white hover:border-[#2a2a2a] transition-all duration-150 select-none"
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
        <aside className="lg:w-100 xl:w-110 shrink-0 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-[#111111]">
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
        <main className="flex-1 lg:overflow-y-auto">
          <ResultsDashboard isLoading={isLoading} result={result} error={error} />
        </main>
      </div>
    </div>
  );
}
