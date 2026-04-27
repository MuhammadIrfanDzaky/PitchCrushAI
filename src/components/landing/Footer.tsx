import Link from "next/link";

const LINKS = [
  { label: "Analyze", href: "/analyze" },
  { label: "Features", href: "#features" },
  { label: "Use cases", href: "#use-cases" },
  { label: "How it works", href: "#how-it-works" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E7E0D6] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <Link href="/" className="select-none" aria-label="PitchCrush AI home">
            <span className="font-semibold text-stone-900 text-base tracking-tight">
              PitchCrush<span className="text-red-500">AI</span>
            </span>
          </Link>
          <p className="text-[11px] text-neutral-600 mt-1">
            Stress test your startup before investors do.
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-xs text-neutral-500 hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-[11px] text-neutral-600">
          © {new Date().getFullYear()} PitchCrush AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
