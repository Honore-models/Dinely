import type { Metadata } from "next";
import dynamic from "next/dynamic";

const FAQContent = dynamic(() => import("./FAQContent"), { ssr: false });

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Dinely. Learn about restaurant management, food ordering, pricing, and more.",
  openGraph: {
    title: "FAQ | Dinely",
    description: "Frequently asked questions about Dinely.",
    url: "/faq",
  },
};

export default function FAQPage() {
  return <FAQContent />;
}
