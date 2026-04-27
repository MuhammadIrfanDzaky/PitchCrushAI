"use client";

import { motion } from "framer-motion";

const USE_CASES = [
  {
    scenario: "Pre-investor meeting",
    description:
      "Run your pitch before a high-stakes meeting. PitchCrush surfaces hard questions you haven't answered yet — so you're not caught off guard in the room.",
    tag: "Investor Prep",
    score: "Skepticism Score",
    scoreColor: "text-red-400",
    scoreBg: "bg-red-500/8 border-red-500/15",
  },
  {
    scenario: "Accelerator application",
    description:
      "Detect vague language and unsupported claims before submission. Replace weak phrases with concrete proof before reviewers see them.",
    tag: "YC / Accelerator",
    score: "Weak Phrase Detector",
    scoreColor: "text-amber-400",
    scoreBg: "bg-amber-500/8 border-amber-500/15",
  },
  {
    scenario: "Competitive defensibility",
    description:
      "Test whether your moat holds up under scrutiny. Know exactly where a competitor or skeptic will attack your differentiation story.",
    tag: "Moat Analysis",
    score: "Moat Risk Signal",
    scoreColor: "text-purple-400",
    scoreBg: "bg-purple-500/8 border-purple-500/15",
  },
] as const;

const OTHER_USERS = [
  "Accelerator Applicants",
  "Angel Seekers",
  "Enterprise Sales",
  "Demo Day Speakers",
] as const;

export function UseCases() {
  return (
    <section id="use-cases" className="py-28 px-6">
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
            Who uses it
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl md:text-[56px] font-semibold text-white tracking-tighter leading-[1.03]">
              Where founders
              <br />
              stress test their pitch.
            </h2>
            <div className="flex flex-wrap gap-2 pb-1">
              {OTHER_USERS.map((u) => (
                <span
                  key={u}
                  className="text-[11px] text-neutral-600 bg-[#111111] border border-[#1a1a1a] px-3 py-1.5 rounded-full"
                >
                  {u}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Use case cards */}
        <div className="grid lg:grid-cols-3 gap-4">
          {USE_CASES.map(({ scenario, description, tag, score, scoreColor, scoreBg }, i) => (
            <motion.div
              key={scenario}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="flex flex-col gap-5 p-7 rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#252525] transition-colors duration-300"
            >
              {/* Signal badge */}
              <span
                className={`self-start text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${scoreBg} ${scoreColor}`}
              >
                {score}
              </span>

              {/* Description */}
              <p className="flex-1 text-sm text-neutral-400 leading-relaxed">{description}</p>

              {/* Scenario footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[#141414]">
                <p className="text-[13px] font-semibold text-white">{scenario}</p>
                <span className="text-[10px] text-neutral-700 bg-[#111111] border border-[#1a1a1a] px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
