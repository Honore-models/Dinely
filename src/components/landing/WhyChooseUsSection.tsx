"use client";

import { ChefHat, ShoppingBag, Truck, Utensils } from "lucide-react";

const services = [
  {
    icon: Utensils,
    title: "Dine-In Experience",
    description:
      "Savor meals in a clean, comfortable, and friendly setting with our partner restaurants.",
  },
  {
    icon: ShoppingBag,
    title: "Takeaway Service",
    description:
      "Quickly grab your favorite food easily while on the go. Fresh and ready when you are.",
  },
  {
    icon: Truck,
    title: "Home Delivery",
    description:
      "Fast and reliable delivery right to your doorstep. Perfect for meetings, parties, and celebrations.",
  },
  {
    icon: ChefHat,
    title: "Event Catering",
    description:
      "Fresh made meals for parties, corporate events, and special occasions. Custom menus available.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-white px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left side */}
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-900 md:text-3xl">
              Why choose us
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
              For customers: great taste, fresh ingredients, and fast service
              you can rely on. For restaurant owners: the tools to manage
              everything from menu to delivery. Quality, affordability, and a
              friendly atmosphere make every experience special.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a
                href="/get-started"
                className="inline-flex h-11 items-center rounded-xl bg-[#22c51f] px-7 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
              >
                Get Started
              </a>
              <a
                href="/explore"
                className="inline-flex h-11 items-center rounded-xl border-2 border-[#22c51f] bg-transparent px-7 text-sm font-bold text-[#22c51f] transition hover:bg-green-50"
              >
                Explore Restaurants
              </a>
            </div>
          </div>

          {/* Right side -2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`rounded-2xl p-5 transition ${
                  index === 0 ? "bg-[#f8fdf8] shadow-sm" : "bg-neutral-50"
                }`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#22c51f] shadow-sm">
                  <service.icon size={20} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">
                  {service.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
