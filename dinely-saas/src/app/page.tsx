import { HeroSection } from "../components/landing/HeroSection";
import { Header } from "../components/landing/Header";
import { OurStorySection } from "../components/landing/OurStorySection";
import { SpecialDishesSection } from "../components/landing/SpecialDishesSection";
import { WhyChooseUsSection } from "../components/landing/WhyChooseUsSection";
import { SpecialOfferSection } from "../components/landing/SpecialOfferSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { WhatWeServeSection } from "../components/landing/WhatWeServeSection";
import { Footer } from "../components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth">
      <Header />
      <HeroSection />
      <OurStorySection />
      <SpecialDishesSection />
      <WhyChooseUsSection />
      <SpecialOfferSection />
      <TestimonialsSection />
      <WhatWeServeSection />
      <Footer />
    </main>
  );
}
