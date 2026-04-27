"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, Cpu, Lightbulb } from "lucide-react";

const STEPS = [
  {
    number: "01",
    Icon: ClipboardPaste,
    title: "Paste your message",
    description:
      "Drop in any text — email, DM, job offer, client brief, or casual conversation. No formatting needed.",
    detail: "Works with any language or tone.",
  },
  {
    number: "02",
    Icon: Cpu,
    title: "AI reads the subtext",
    description:
      "Eight signal layers activate simultaneously: intent, tone, power, emotion, red flags, and more.",
    detail: "Under 3 seconds, every time.",
  },
  {
    number: "03",
    Icon: Lightbulb,
    title: "Reply with an edge",
    description:
      "Get a confidence-ranked reply recommendation — crafted for your specific goal, not just politeness.",
    detail: "Know exactly what to say next.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 border-t border-[#111111]">
      <div className="max-w-7xl mx-auto">

        {/* Section heading — intentionally asymmetric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-20"
        >
          <p className="text-[11px] text-neutral-600 tracking-[0.2em] uppercase font-medium mb-4">
            How it works
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl md:text-[56px] font-semibold text-white tracking-tighter leading-[1.03] max-w-lg">
              From message
              <br />
              to clarity.
            </h2>
            <p className="text-neutral-600 text-sm max-w-xs lg:text-right leading-relaxed pb-1">
              Three steps. Zero guessing. Just the full picture.
            </p>
          </div>
        </motion.div>

        {/* Desktop: stepper connector line + cards */}
        <div className="hidden md:block">
          {/* Connecting line */}
          <div className="relative flex items-center justify-between mb-8 px-8">
            <div
              aria-hidden="true"
              className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-px bg-linear-to-r from-transparent via-[#1e1e1e] to-transparent"
            />
            {STEPS.map(({ number }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: "easeOut" }}
                className="relative z-10 w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#2a2a2a] flex items-center justify-center"
              >
                <span className="text-[11px] font-mono text-neutral-500">{number}</span>
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
                className="p-7 rounded-2xl bg-[#111111] border border-[#1a1a1a] hover:border-[#252525] transition-colors duration-300 group flex flex-col gap-5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#161616] border border-[#222222] flex items-center justify-center group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5 transition-all duration-300">
                  <Icon className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors duration-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {description}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-600 font-medium mt-auto pt-2 border-t border-[#161616]">
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
              className="p-6 rounded-2xl bg-[#111111] border border-[#1a1a1a] flex gap-5"
            >
              <div className="shrink-0 w-9 h-9 rounded-xl bg-[#161616] border border-[#222222] flex items-center justify-center">
                <Icon className="w-4 h-4 text-neutral-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-700 font-mono mb-1">{number}</p>
                <h3 className="text-sm font-semibold text-white mb-1.5 tracking-tight">{title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{description}</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-2">{detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}


