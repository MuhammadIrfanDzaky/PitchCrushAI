import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-[#F7F3EA] min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <UseCases />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}