import Link from "next/link";

const LINKS = [
  { label: "Analyze", href: "/analyze" },
  { label: "Features", href: "#features" },
  { label: "Use cases", href: "#use-cases" },
  { label: "How it works", href: "#how-it-works" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#111111] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <Link href="/" className="select-none" aria-label="SubtextAI home">
            <span className="font-semibold text-white text-base tracking-tight">
              Subtext<span className="text-emerald-400">AI</span>
            </span>
          </Link>
          <p className="text-[11px] text-neutral-700 mt-1">
            Decode what people really mean.
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-xs text-neutral-600 hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-[11px] text-neutral-700">
          © {new Date().getFullYear()} SubtextAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
