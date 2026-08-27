import type { Metadata } from "next";
import dynamic from "next/dynamic";

const PricingContent = dynamic(() => import("./PricingContent"), { ssr: false });

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for restaurants of all sizes. Start with a 14-day free trial. Plans from $7/month.",
  openGraph: {
    title: "Pricing | Dinely",
    description:
      "Simple, transparent pricing for restaurants of all sizes. Start with a 14-day free trial.",
    url: "/pricing",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}
