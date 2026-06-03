import { HeroSection } from "../components/landing/HeroSection";
import { Header } from "../components/landing/Header";
import { PricingSection } from "../components/landing/PricingSection";
import { StatsBar } from "../components/landing/StatsBar";

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth">
      <Header />
      <HeroSection />
      <StatsBar />
      <PricingSection />
    </main>
  );
}
