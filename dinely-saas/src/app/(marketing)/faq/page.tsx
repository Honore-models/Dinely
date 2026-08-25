"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is Dinely?",
    a: "Dinely is an all-in-one restaurant management and food ordering platform. It helps restaurant owners manage their menus, bookings, orders, staff, and analytics — while giving customers a seamless way to discover restaurants, browse menus, and order food.",
  },
  {
    q: "How do I create an account?",
    a: "Click the 'Get Started Free' button on our homepage or 'Sign Up' in the header. You can register as a customer to order food, or as a restaurant owner to manage your business. The registration process takes less than 2 minutes.",
  },
  {
    q: "Is Dinely free to use?",
    a: "Dinely offers a free Starter plan for small restaurants. Our Professional ($14/mo) and Enterprise ($20/mo) plans unlock advanced analytics, priority support, and additional features. Customers can browse, order, and book for free.",
  },
  {
    q: "How do restaurant owners manage their menu?",
    a: "After signing up and completing onboarding, restaurant owners can access the Dashboard to add, edit, or remove menu items. You can set prices, descriptions, photos, categories, and availability. Changes go live instantly.",
  },
  {
    q: "Can customers make table reservations?",
    a: "Yes! Customers can browse restaurants, check available tables, and book directly through the platform. Restaurant owners see all incoming reservations in their dashboard and can confirm or suggest alternatives.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Dinely supports credit/debit cards, mobile money, and other local payment methods depending on your region. All payments are securely processed through our payment partners.",
  },
  {
    q: "How do I contact support?",
    a: "You can reach our support team through the Contact page, by emailing support@dinely.com, or by calling +250 788 123 456. Our team is available Monday through Friday, 8am to 5pm.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes, you can cancel your subscription at any time from your Dashboard Settings. There are no cancellation fees. Your plan will remain active until the end of your current billing cycle.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#22c51f]">
            Help Center
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-neutral-900">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-neutral-500">
            Everything you need to know about Dinely. Can&apos;t find what you&apos;re looking for?
            {" "}
            <a href="/contact" className="font-bold text-[#22c51f] hover:underline">
              Contact our team
            </a>
            .
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-xl border transition ${
                open === i
                  ? "border-[#22c51f]/30 bg-[#f8fdf8]"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-bold text-neutral-900">
                  {faq.q}
                </span>
                <span
                  className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg transition ${
                    open === i
                      ? "rotate-45 bg-[#22c51f] text-white"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
