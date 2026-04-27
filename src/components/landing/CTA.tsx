"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROOF = [
  { value: "Free",  label: "No signup required" },
  { value: "9",     label: "Signal layers" },
  { value: "< 5s", label: "Per analysis" },
] as const;

export function CTA() {
  return (
    <section className="py-28 px-6 border-t border-[#E7E0D6]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl bg-white border border-[#E7E0D6] overflow-hidden shadow-sm"
        >
          {/* Top glow line */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-linear-to-r from-transparent via-red-400/50 to-transparent"
          />
          {/* Background glow */}
          <div
            aria-hidden="true"
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-400/6 blur-[100px]"
          />

          <div className="relative px-8 sm:px-16 py-16 sm:py-20 text-center">

            <p className="text-[11px] text-neutral-500 tracking-[0.2em] uppercase font-medium mb-6">
              Get started free
            </p>

            <h2 className="text-[40px] sm:text-[56px] font-heading font-normal text-stone-900 tracking-tight leading-[1.08] mb-5">
              Most pitches fail
              <br />
              before the{" "}
              <span className="text-stone-400 italic">meeting.</span>
              <br />
              Yours won&apos;t after{" "}
              <span className="bg-linear-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                this.
              </span>
            </h2>

            <p className="text-stone-600 text-base mb-10 max-w-sm mx-auto leading-relaxed">
              Join founders who stress-test before they pitch.
            </p>

            <Link
              href="/analyze"
              className="group inline-flex items-center gap-2 h-12 px-8 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:scale-[0.98] transition-all duration-150 select-none"
            >
              Crush My Pitch
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
                aria-hidden="true"
              />
            </Link>

            <p className="mt-4 text-[11px] text-neutral-600">
              No credit card. No sign-up required.
            </p>

            {/* Stats strip */}
            <div className="mt-14 pt-8 border-t border-[#EDE8E0] flex items-center justify-center gap-10 flex-wrap">
              {PROOF.map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-10">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-stone-900 tabular-nums tracking-tight">
                      {value}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">{label}</p>
                  </div>
                  {i < PROOF.length - 1 && (
                    <div className="w-px h-8 bg-[#E7E0D6]" aria-hidden="true" />
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


