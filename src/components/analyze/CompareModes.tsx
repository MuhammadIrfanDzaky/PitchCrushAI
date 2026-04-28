"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface ModeDisplayInfo {
  value: string;
  label: string;
  purpose: string;
  bestFor: string;
  looksFor: readonly string[];
}

interface CompareModesProps {
  modes: readonly ModeDisplayInfo[];
  onClose: () => void;
}

export function CompareModes({ modes, onClose }: CompareModesProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-14 sm:items-center sm:pt-4"
      role="dialog"
      aria-modal="true"
      aria-label="Compare stress test modes"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-xl max-h-[84vh] overflow-y-auto bg-[#FAF7F2] rounded-2xl border border-[#E7E0D6] shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E7E0D6]">
          <div>
            <p className="text-[14px] font-semibold text-stone-900 tracking-tight">
              Compare modes
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              9 stress test perspectives
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close compare modes"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode list */}
        <div className="p-4 flex flex-col gap-2.5">
          {modes.map((mode) => (
            <div
              key={mode.value}
              className="p-4 rounded-xl bg-white border border-[#E7E0D6] hover:border-[#D4CBBF] transition-colors duration-150"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-[13px] font-semibold text-stone-900">
                  {mode.label}
                </p>
                <span
                  className={`shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    mode.value === "incumbent_kill"
                      ? "text-red-600 bg-red-50 border-red-200"
                      : "text-stone-400 bg-stone-50 border-stone-200"
                  }`}
                >
                  {mode.value}
                </span>
              </div>
              <p className="text-[12px] text-stone-600 leading-relaxed mb-1.5">
                {mode.purpose}
              </p>
              <p className="text-[11px] text-stone-500 mb-2.5">
                <span className="font-medium text-stone-600">Best for:</span>{" "}
                {mode.bestFor}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {mode.looksFor.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] text-stone-500 bg-[#FAF7F2] border border-[#E7E0D6] px-2 py-0.5 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
