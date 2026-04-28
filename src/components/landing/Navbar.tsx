"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
          className="flex items-center select-none"
          aria-label="PitchCrush AI home"
        >
          <Image
            src="/img/logo.png"
            alt="PitchCrush AI"
            width={180}
            height={48}
            priority
            className="h-8 w-auto md:h-9"
          />
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


