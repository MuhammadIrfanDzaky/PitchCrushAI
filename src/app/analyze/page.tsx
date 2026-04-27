import type { Metadata } from "next";
import { AnalyzePage } from "@/components/analyze/AnalyzePage";

export const metadata: Metadata = {
  title: "Analyze — SubtextAI",
  description:
    "Decode any message. Reveal hidden intent, emotional signals, and the smartest next reply.",
};

export default function Page() {
  return <AnalyzePage />;
}
