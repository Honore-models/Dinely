import { HeroSection } from "../components/landing/HeroSection";
import { PricingSection } from "../components/landing/PricingSection";
import { StatsBar } from "../components/landing/StatsBar";
import { Header } from "../components/landing/Header";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <StatsBar />
      <PricingSection />
    </main>
  );
}
