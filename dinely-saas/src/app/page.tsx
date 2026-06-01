import { HeroSection } from "../components/landing/HeroSection";
import { PricingSection } from "../components/landing/PricingSection";
import { StatsBar } from "../components/landing/StatsBar";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <PricingSection />
    </main>
  );
}
