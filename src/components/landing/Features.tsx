"use client";

import { motion } from "framer-motion";
import {
  TrendingDown,
  Activity,
  Target,
  HelpCircle,
  ShieldAlert,
  Users,
  Quote,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

function FeaturedCell() {
  return (
    <div className="lg:col-span-2 lg:row-span-2 p-7 bg-white rounded-2xl border border-[#E7E0D6] hover:border-red-300 transition-all duration-300 group flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
          <MessageSquare className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900 tracking-tight mb-2">
          Stronger Rewrite
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed max-w-xs">
          Don&apos;t just find the problems &mdash; fix them. Get a battle-hardened rewrite
          optimized to survive investor scrutiny.
        </p>
      </div>

      {/* Mini product preview */}
      <div className="flex-1 rounded-xl bg-[#0A0A0A] border border-[#181818] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#141414]">
          <p className="text-[10px] text-neutral-700 font-mono uppercase tracking-widest">
            Original pitch
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed mt-1.5">
            &ldquo;We&apos;re disrupting the $50B logistics market with our proprietary AI algorithm.&rdquo;
          </p>
        </div>
        <div className="px-4 py-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">
              Stronger Rewrite
            </p>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full font-medium">
              79% clarity
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">
            &ldquo;We cut last-mile delivery costs by 34% for 3PL operators in Southeast Asia &mdash; $2.1M ARR, growing 18% MoM.&rdquo;
          </p>
        </div>
        <div className="px-4 py-3 border-t border-[#141414] flex items-center gap-3">
          <div className="flex gap-2">
            {["Specific", "Credible", "Investor-ready"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-neutral-700 bg-[#141414] border border-[#1e1e1e] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SMALL_FEATURES = [
  {
    Icon: TrendingDown,
    title: "Skepticism Score",
    description: "How skeptical investors will be — scored 0–100.",
  },
  {
    Icon: Activity,
    title: "Clarity Score",
    description: "How clear and compelling your pitch reads.",
  },
  {
    Icon: Target,
    title: "Biggest Weakness",
    description: "The single strongest objection your pitch invites.",
  },
  {
    Icon: HelpCircle,
    title: "Likely Investor Question",
    description: "The first hard question they'll ask in the room.",
  },
  {
    Icon: ShieldAlert,
    title: "Moat Risk",
    description: "How defensible your competitive position actually is.",
  },
  {
    Icon: Users,
    title: "Customer Doubt",
    description: "The objections real customers will raise, not investors.",
  },
  {
    Icon: Quote,
    title: "Weak Phrases",
    description: "Exact words that signal vagueness or lack of conviction.",
  },
  {
    Icon: AlertTriangle,
    title: "Investor Red Flags",
    description: "Patterns that make investors pass before slide three.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="py-28 px-6 border-t border-[#E7E0D6]">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="text-[11px] text-neutral-500 uppercase tracking-[0.2em] font-medium mb-4">
            Features
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl md:text-[56px] font-heading font-normal text-stone-900 tracking-tight leading-[1.06]">
              Nine layers.
              <br />
              One pitch test.
            </h2>
            <p className="text-stone-600 text-sm max-w-xs lg:text-right leading-relaxed pb-1">
              Most tools give you encouragement. PitchCrush gives you the full signal stack.
            </p>
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-auto">

          {/* Featured: Recommended Reply (top-left, 2×2 on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1 , y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sm:col-span-2 lg:col-span-2 lg:row-span-2"
          >
            <FeaturedCell />
          </motion.div>

          {/* Small cells: fill positions [0,2], [0,3], [1,2], [1,3], then row 2 */}
          {SMALL_FEATURES.slice(0, 4).map(({ Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 + i * 0.06, ease: "easeOut" }}
              className="p-6 rounded-2xl bg-white border border-[#E7E0D6] hover:border-[#D4CBBF] hover:bg-[#FAF7F2] transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F5F0E8] border border-[#E7E0D6] flex items-center justify-center mb-4 group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-300">
                <Icon
                  className="w-4 h-4 text-stone-400 group-hover:text-red-500 transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-semibold text-stone-900 text-[13px] mb-1.5 tracking-tight">{title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}

          {/* Bottom row: 3 remaining small cells */}
          {SMALL_FEATURES.slice(4).map(({ Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.25 + i * 0.06, ease: "easeOut" }}
              className="p-6 rounded-2xl bg-white border border-[#E7E0D6] hover:border-[#D4CBBF] hover:bg-[#FAF7F2] transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F5F0E8] border border-[#E7E0D6] flex items-center justify-center mb-4 group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-300">
                <Icon
                  className="w-4 h-4 text-stone-400 group-hover:text-red-500 transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-semibold text-stone-900 text-[13px] mb-1.5 tracking-tight">{title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

