"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Target,
  BarChart3,
  TrendingUp,
  Zap,
  ShieldAlert,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

function FeaturedCell() {
  return (
    <div className="lg:col-span-2 lg:row-span-2 p-7 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a] hover:border-emerald-500/20 transition-all duration-300 group flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-5">
          <MessageSquare className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
          Recommended Reply
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
          Don&apos;t just understand the message &mdash; know exactly what to say next. Every reply is
          ranked by confidence and optimized for your goal.
        </p>
      </div>

      {/* Mini product preview */}
      <div className="flex-1 rounded-xl bg-[#0A0A0A] border border-[#181818] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#141414]">
          <p className="text-[10px] text-neutral-700 font-mono uppercase tracking-widest">
            Their message
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed mt-1.5">
            &ldquo;We&apos;ll need to reassess budget timing before we can move forward with the proposal.&rdquo;
          </p>
        </div>
        <div className="px-4 py-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">
              Best Reply
            </p>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full font-medium">
              91% confidence
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">
            &ldquo;I&apos;d love to align on a structure that works within your timeline &mdash; happy to explore
            a phased approach if that helps.&rdquo;
          </p>
        </div>
        <div className="px-4 py-3 border-t border-[#141414] flex items-center gap-3">
          <div className="flex gap-2">
            {["Collaborative", "Non-pushy", "Strategic"].map((tag) => (
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
    Icon: Eye,
    title: "Surface Meaning",
    description: "Instantly parse the literal content of any message.",
  },
  {
    Icon: Target,
    title: "Hidden Intent",
    description: "Uncover what the sender really wants, even when unspoken.",
  },
  {
    Icon: BarChart3,
    title: "Interest Score",
    description: "Quantify genuine engagement on a 0–100 confidence scale.",
  },
  {
    Icon: TrendingUp,
    title: "Power Dynamic",
    description: "See who holds leverage in the exchange and why.",
  },
  {
    Icon: Zap,
    title: "Emotional Tone",
    description: "Map the emotional undercurrents driving the message.",
  },
  {
    Icon: ShieldAlert,
    title: "Red Flags",
    description: "Catch manipulation, deflection, and evasion early.",
  },
  {
    Icon: CheckCircle2,
    title: "Confidence Score",
    description: "Know how certain the AI is — before you act on it.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="py-28 px-6 border-t border-[#111111]">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="text-[11px] text-neutral-600 tracking-[0.2em] uppercase font-medium mb-4">
            Features
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl md:text-[56px] font-semibold text-white tracking-tighter leading-[1.03]">
              Eight layers.
              <br />
              One analysis.
            </h2>
            <p className="text-neutral-600 text-sm max-w-xs lg:text-right leading-relaxed pb-1">
              Most tools give you a summary. SubtextAI gives you the full signal stack.
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
              className="p-6 rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#252525] hover:bg-[#0f0f0f] transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#1e1e1e] flex items-center justify-center mb-4 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5 transition-all duration-300">
                <Icon
                  className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-semibold text-white text-[13px] mb-1.5 tracking-tight">{title}</h3>
              <p className="text-xs text-neutral-700 leading-relaxed">{description}</p>
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
              className="p-6 rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#252525] hover:bg-[#0f0f0f] transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#1e1e1e] flex items-center justify-center mb-4 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5 transition-all duration-300">
                <Icon
                  className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-semibold text-white text-[13px] mb-1.5 tracking-tight">{title}</h3>
              <p className="text-xs text-neutral-700 leading-relaxed">{description}</p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

