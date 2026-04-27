"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, Cpu, Lightbulb } from "lucide-react";

const STEPS = [
  {
    number: "01",
    Icon: ClipboardPaste,
    title: "Paste your pitch",
    description:
      "Drop in any pitch format — one-liner, cold email, deck summary, YC application, or investor memo. No formatting needed.",
    detail: "Supports any pitch format.",
  },
  {
    number: "02",
    Icon: Cpu,
    title: "AI plays devil's advocate",
    description:
      "Nine signal layers activate simultaneously: skepticism, moat risk, investor red flags, weak phrases, customer doubt, and more.",
    detail: "Under 5 seconds, every time.",
  },
  {
    number: "03",
    Icon: Lightbulb,
    title: "Rebuild stronger",
    description:
      "Get a confidence-ranked rewrite \u2014 hardened against the exact objections investors will raise.",
    detail: "Ship a pitch that holds up.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 border-t border-[#E7E0D6]">
      <div className="max-w-7xl mx-auto">

        {/* Section heading — intentionally asymmetric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-20"
        >
          <p className="text-[11px] text-neutral-500 uppercase tracking-[0.2em] font-medium mb-4">
            How it works
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl md:text-[56px] font-heading font-normal text-stone-900 tracking-tight leading-[1.06] max-w-lg">
              Paste.
              <br />
              Get crushed.
              <br />
              Rebuild stronger.
            </h2>
            <p className="text-stone-600 text-sm max-w-xs lg:text-right leading-relaxed pb-1">
              Three steps. Zero sugar-coating. Just honest investor-grade feedback.
            </p>
          </div>
        </motion.div>

        {/* Desktop: stepper connector line + cards */}
        <div className="hidden md:block">
          {/* Connecting line */}
          <div className="relative flex items-center justify-between mb-8 px-8">
            <div
              aria-hidden="true"
              className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-px bg-linear-to-r from-transparent via-[#E7E0D6] to-transparent"
            />
            {STEPS.map(({ number }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: "easeOut" }}
                className="relative z-10 w-10 h-10 rounded-full bg-white border border-[#E7E0D6] flex items-center justify-center shadow-sm"
              >
                <span className="text-[11px] font-mono text-stone-400">{number}</span>
              </motion.div>
            ))}
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map(({ number, Icon, title, description, detail }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="p-7 rounded-2xl bg-white border border-[#E7E0D6] hover:border-[#D4CBBF] transition-colors duration-300 group flex flex-col gap-5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F5F0E8] border border-[#E7E0D6] flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-300">
                  <Icon className="w-4 h-4 text-stone-400 group-hover:text-red-500 transition-colors duration-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-stone-900 mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {description}
                  </p>
                </div>
                <p className="text-[11px] text-red-500 font-medium mt-auto pt-2 border-t border-[#EDE8E0]">
                  {detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden space-y-4">
          {STEPS.map(({ number, Icon, title, description, detail }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="p-6 rounded-2xl bg-white border border-[#E7E0D6] flex gap-5"
            >
              <div className="shrink-0 w-9 h-9 rounded-xl bg-[#F5F0E8] border border-[#E7E0D6] flex items-center justify-center">
                <Icon className="w-4 h-4 text-stone-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-mono mb-1">{number}</p>
                <h3 className="text-sm font-semibold text-stone-900 mb-1.5 tracking-tight">{title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{description}</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-2">{detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}


