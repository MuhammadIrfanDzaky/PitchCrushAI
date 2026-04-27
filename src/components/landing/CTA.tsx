"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROOF = [
  { value: "50K+", label: "Analyses run" },
  { value: "94%", label: "Avg. confidence" },
  { value: "< 3s", label: "Per decode" },
] as const;

export function CTA() {
  return (
    <section className="py-28 px-6 border-t border-[#111111]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl bg-[#0d0d0d] border border-[#1a1a1a] overflow-hidden"
        >
          {/* Top glow line */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent"
          />
          {/* Background glow */}
          <div
            aria-hidden="true"
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/6 blur-[100px]"
          />

          <div className="relative px-8 sm:px-16 py-16 sm:py-20 text-center">

            <p className="text-[11px] text-neutral-600 tracking-[0.2em] uppercase font-medium mb-6">
              Get started free
            </p>

            <h2 className="text-[40px] sm:text-[56px] font-semibold text-white tracking-tighter leading-[1.04] mb-5">
              Most people reply to
              <br />
              what was{" "}
              <span className="text-neutral-500 italic">said.</span>
              <br />
              Not what was{" "}
              <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                meant.
              </span>
            </h2>

            <p className="text-neutral-600 text-base mb-10 max-w-sm mx-auto leading-relaxed">
              Join thousands who read between the lines before they reply.
            </p>

            <Link
              href="/analyze"
              className="group inline-flex items-center gap-2 h-12 px-8 rounded-full bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 active:scale-[0.98] transition-all duration-150 select-none"
            >
              Decode Your First Message
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
                aria-hidden="true"
              />
            </Link>

            <p className="mt-4 text-[11px] text-neutral-700">
              No credit card. No sign-up required.
            </p>

            {/* Stats strip */}
            <div className="mt-14 pt-8 border-t border-[#141414] flex items-center justify-center gap-10 flex-wrap">
              {PROOF.map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-10">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-white tabular-nums tracking-tight">
                      {value}
                    </p>
                    <p className="text-[11px] text-neutral-700 mt-1">{label}</p>
                  </div>
                  {i < PROOF.length - 1 && (
                    <div className="w-px h-8 bg-[#1a1a1a]" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}


