"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F7F3EA]/95 backdrop-blur-xl border-b border-[#E7E0D6]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 select-none group"
          aria-label="PitchCrush AI home"
        >
          {/* Logo mark: target/crush icon */}
          <div className="flex flex-col gap-0.75 py-0.5" aria-hidden="true">
            <span className="block w-4 h-px bg-red-500" />
            <span className="block w-2.5 h-px bg-red-400/60" />
          </div>
          <span className="font-semibold text-stone-900 text-[15px] tracking-tight leading-none">
            PitchCrush<span className="text-red-500">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Use cases", href: "#use-cases" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[13px] text-stone-500 hover:text-stone-900 transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center">
          <Link
            href="/analyze"
            className="h-8 px-4 flex items-center rounded-full bg-red-600 text-white text-[13px] font-medium hover:bg-red-500 active:scale-[0.97] transition-all duration-150 select-none"
          >
            Crush My Pitch
          </Link>
        </div>

      </div>
    </motion.header>
  );
}


