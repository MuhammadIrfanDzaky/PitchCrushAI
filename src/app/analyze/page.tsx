import type { Metadata } from "next";
import { AnalyzePage } from "@/components/analyze/AnalyzePage";

export const metadata: Metadata = {
  title: "Pitch Crusher — PitchCrush AI",
  description:
    "Stress test your startup pitch. Reveal investor objections, weak phrases, moat risks, and get a stronger rewrite in seconds.",
};

export default function Page() {
  return <AnalyzePage />;
}
