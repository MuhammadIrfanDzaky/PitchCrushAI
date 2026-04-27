"use client";

import {
  Briefcase,
  Building2,
  Heart,
  TrendingUp,
  Users,
  Home,
  Scale,
  Sparkles,
  RotateCcw,
} from "lucide-react";

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

const CONTEXTS = [
  { value: "recruiter", label: "Recruiter", Icon: Briefcase },
  { value: "client", label: "Client", Icon: Building2 },
  { value: "dating", label: "Dating", Icon: Heart },
  { value: "business", label: "Business", Icon: TrendingUp },
  { value: "friendship", label: "Friendship", Icon: Users },
  { value: "family", label: "Family", Icon: Home },
  { value: "negotiation", label: "Negotiation", Icon: Scale },
] as const;

const GOALS = [
  { value: "understand", label: "Understand them" },
  { value: "win_deal", label: "Win the deal" },
  { value: "reply_smart", label: "Reply smartly" },
  { value: "spot_manipulation", label: "Spot manipulation" },
  { value: "improve_chances", label: "Improve my chances" },
] as const;

const SAMPLES = [
  {
    label: "Job offer",
    context: "recruiter",
    goal: "understand",
    message:
      "Thanks for the offer. I'll need to think it over and get back to you by end of week.",
  },
  {
    label: "Client stalling",
    context: "client",
    goal: "win_deal",
    message:
      "We'll need to reassess budget timing before we can commit to the full scope of your proposal.",
  },
  {
    label: "After a date",
    context: "dating",
    goal: "understand",
    message:
      "Hey! Had a really great time last night. We should definitely hang out again sometime 😊",
  },
  {
    label: "Partnership",
    context: "business",
    goal: "spot_manipulation",
    message:
      "We really love what you've built! We'd love to potentially explore some kind of collaboration in the future.",
  },
] as const;

const MAX_CHARS = 2000;

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
  const canAnalyze = message.trim().length > 0 && !isLoading;

  return (
    <div className="p-6 flex flex-col gap-7">
      {/* Panel header */}
      <div>
        <h1 className="text-[15px] font-semibold text-white tracking-tight">
          Analyze a message
        </h1>
        <p className="text-[12px] text-neutral-600 mt-1 leading-relaxed">
          Paste any text to decode its true meaning and intent.
        </p>
      </div>

      {/* Context selector */}
      <div>
        <p className="text-[11px] text-neutral-600 uppercase tracking-[0.14em] font-medium mb-3">
          Context
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {CONTEXTS.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => onContextChange(value)}
              aria-pressed={context === value}
              aria-label={`Set context to ${label}`}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border text-[10px] font-medium transition-all duration-150 select-none leading-none ${
                context === value
                  ? "bg-emerald-500/8 border-emerald-500/25 text-emerald-400"
                  : "bg-[#111111] border-[#1a1a1a] text-neutral-600 hover:text-neutral-300 hover:border-[#252525]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal selector */}
      <div>
        <label
          htmlFor="goal-select"
          className="block text-[11px] text-neutral-600 uppercase tracking-[0.14em] font-medium mb-3"
        >
          Your goal
        </label>
        <div className="relative">
          <select
            id="goal-select"
            value={goal}
            onChange={(e) => onGoalChange(e.target.value)}
            className="w-full h-10 pl-3.5 pr-9 rounded-xl bg-[#111111] border border-[#1a1a1a] text-[13px] text-neutral-300 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500/35 hover:border-[#252525] transition-colors duration-150"
          >
            {GOALS.map(({ value, label }) => (
              <option key={value} value={value} className="bg-[#111111] text-neutral-300">
                {label}
              </option>
            ))}
          </select>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600"
          >
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Message textarea */}
      <div>
        <label
          htmlFor="message-textarea"
          className="block text-[11px] text-neutral-600 uppercase tracking-[0.14em] font-medium mb-3"
        >
          Message
        </label>
        <div className="relative">
          <textarea
            id="message-textarea"
            value={message}
            onChange={(e) => onMessageChange(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Paste any message here — email, DM, job offer, client note, text..."
            rows={7}
            className="w-full bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3.5 text-[13px] text-neutral-300 placeholder-neutral-700 resize-none focus:outline-none focus:border-emerald-500/35 hover:border-[#252525] transition-colors duration-150 leading-relaxed"
          />
          <div className="absolute bottom-3 right-3.5 flex items-center gap-2.5">
            {message.length > 0 && (
              <button
                onClick={() => onMessageChange("")}
                className="text-neutral-700 hover:text-neutral-400 transition-colors duration-150"
                aria-label="Clear message"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <span
              className={`text-[10px] tabular-nums ${
                message.length > MAX_CHARS * 0.9
                  ? "text-amber-600"
                  : "text-neutral-700"
              }`}
            >
              {message.length}/{MAX_CHARS}
            </span>
          </div>
        </div>
      </div>

      {/* Sample messages */}
      <div>
        <p className="text-[11px] text-neutral-600 uppercase tracking-[0.14em] font-medium mb-3">
          Try a sample
        </p>
        <div className="flex flex-col gap-2">
          {SAMPLES.map(({ label, message: sampleMsg, context: sampleCtx, goal: sampleGoal }) => (
            <button
              key={label}
              onClick={() => {
                onMessageChange(sampleMsg);
                onContextChange(sampleCtx);
                onGoalChange(sampleGoal);
              }}
              className="flex items-start gap-3 px-3.5 py-3 rounded-xl bg-[#111111] border border-[#1a1a1a] hover:border-[#252525] hover:bg-[#131313] text-left transition-all duration-150 group"
            >
              <span className="shrink-0 text-[10px] text-neutral-700 bg-[#191919] border border-[#222222] px-2 py-1 rounded-md mt-0.5 group-hover:text-neutral-500 transition-colors duration-150 font-medium leading-none">
                {label}
              </span>
              <span className="text-[12px] text-neutral-600 leading-relaxed line-clamp-2 group-hover:text-neutral-400 transition-colors duration-150">
                {sampleMsg}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Analyze button */}
      <button
        onClick={onAnalyze}
        disabled={!canAnalyze}
        aria-label={isLoading ? "Analyzing message…" : "Analyze message"}
        className={`relative h-11 w-full rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 select-none transition-all duration-200 ${
          canAnalyze
            ? "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.98]"
            : "bg-[#111111] border border-[#1a1a1a] text-neutral-700 cursor-not-allowed"
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
            Analyze Message
          </>
        )}
      </button>
    </div>
  );
}
