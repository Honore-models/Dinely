import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ContactContent = dynamic(() => import("./ContactContent"), { ssr: false });

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Dinely team. We're here to help with questions, support, partnerships, and more.",
  openGraph: {
    title: "Contact Us | Dinely",
    description: "Get in touch with the Dinely team. We're here to help.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
