"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "I ran my Series A pitch through PitchCrush before the meeting. Skepticism score was 82. It surfaced three investor questions I had no answer for. I prep'd overnight and closed the round two weeks later.",
    name: "Alex K.",
    role: "Founder, FinTech startup",
    tag: "Series A",
    score: "82 skepticism",
    scoreColor: "text-red-400",
    scoreBg: "bg-red-500/8 border-red-500/15",
  },
  {
    quote:
      "Our YC application said \u2018we\u2019re building the future of X.\u2019 PitchCrush flagged it as a weak phrase with no proof of traction. We rewrote it with concrete metrics. We got an interview.",
    name: "Mei L.",
    role: "Co-founder, Climate Tech",
    tag: "YC W25",
    score: "3 weak phrases",
    scoreColor: "text-amber-400",
    scoreBg: "bg-amber-500/8 border-amber-500/15",
  },
  {
    quote:
      "PitchCrush told me my moat was \u2018easily replicated.\u2019 Brutal to hear, but it made me rethink my defensibility story entirely. The investor who passed the first time funded us six months later.",
    name: "Omar S.",
    role: "CEO, B2B SaaS",
    tag: "Seed Round",
    score: "High moat risk",
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
              Pitches that
              <br />
              survived the test.
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

        {/* Testimonial cards */}
        <div className="grid lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map(({ quote, name, role, tag, score, scoreColor, scoreBg }, i) => (
            <motion.div
              key={name}
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

              {/* Quote */}
              <blockquote className="flex-1 text-sm text-neutral-400 leading-relaxed">
                &ldquo;{quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center justify-between pt-4 border-t border-[#141414]">
                <div>
                  <p className="text-[13px] font-semibold text-white">{name}</p>
                  <p className="text-[11px] text-neutral-600 mt-0.5">{role}</p>
                </div>
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
