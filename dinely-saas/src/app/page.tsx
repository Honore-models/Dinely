import { HeroSection } from "../components/landing/HeroSection";
import { Header } from "../components/landing/Header";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden">
      <Header />
      <HeroSection />
    </main>
  );
}
