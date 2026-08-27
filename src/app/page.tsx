import type { Metadata } from "next";
import {
  OrganizationJsonLd,
  WebsiteJsonLd,
  SoftwareAppJsonLd,
} from "../components/seo/JsonLd";
import { HeroSection } from "../components/landing/HeroSection";
import { Header } from "../components/landing/Header";
import { OurStorySection } from "../components/landing/OurStorySection";
import { SpecialDishesSection } from "../components/landing/SpecialDishesSection";
import { WhyChooseUsSection } from "../components/landing/WhyChooseUsSection";
import { SpecialOfferSection } from "../components/landing/SpecialOfferSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { WhatWeServeSection } from "../components/landing/WhatWeServeSection";
import { Footer } from "../components/landing/Footer";

export const metadata: Metadata = {
  title: "Dinely - Restaurant Management & Food Ordering Platform",
  description:
    "Discover restaurants, order food, manage bookings, and grow your restaurant business with Dinely. The all-in-one platform for diners and restaurant owners.",
  openGraph: {
    title: "Dinely - Restaurant Management & Food Ordering Platform",
    description:
      "Discover restaurants, order food, manage bookings, and grow your restaurant business with Dinely.",
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="scroll-smooth">
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <SoftwareAppJsonLd />
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
