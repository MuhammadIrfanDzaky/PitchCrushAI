"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "I decoded 'We'll circle back next quarter' from an investor. SubtextAI flagged it as a polite no — 8% intent, high deflection pattern. I stopped waiting and found my lead the same day.",
    name: "Priya M.",
    role: "Founder, B2B SaaS",
    tag: "Founders",
    score: "8% intent",
    scoreColor: "text-red-400",
    scoreBg: "bg-red-500/8 border-red-500/15",
  },
  {
    quote:
      "Recruiter said 'We really loved your profile and will be in touch.' Ran it through SubtextAI. It caught low urgency, template phrasing, and no timeline commitment. I followed up the same day and got the interview.",
    name: "James T.",
    role: "Senior Engineer, job seeker",
    tag: "Job Seekers",
    score: "31% urgency",
    scoreColor: "text-amber-400",
    scoreBg: "bg-amber-500/8 border-amber-500/15",
  },
  {
    quote:
      "My client replied 'Sounds great, just a few tweaks.' Five red flags: vague scope, no deadline, evasive tone. I sent a scope-lock email before they could expand the project. Saved me a week.",
    name: "Sofia R.",
    role: "Freelance Product Designer",
    tag: "Freelancers",
    score: "5 red flags",
    scoreColor: "text-orange-400",
    scoreBg: "bg-orange-500/8 border-orange-500/15",
  },
] as const;

const OTHER_USERS = [
  "Salespeople",
  "Negotiators",
  "Dating & Relationships",
  "Professionals",
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
              Real signals.
              <br />
              Real decisions.
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
