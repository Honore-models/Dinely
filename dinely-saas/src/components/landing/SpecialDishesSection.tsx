"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const dishes = [
  {
    name: "Herb-Roasted Chicken",
    description: "Seasoned with rosemary and thyme, served with vegetables",
    price: "$25.98",
    rating: 4.7,
    image: "/food4.jpg",
  },
  {
    name: "Classic Beef Burger",
    description: "Juicy patty with lettuce, tomato, and signature sauce",
    price: "$13.50",
    rating: 4.8,
    image: "/food5.jpg",
  },
  {
    name: "Pepperoni Pizza",
    description: "Thin crust with mozzarella and premium pepperoni",
    price: "$11.00",
    rating: 4.8,
    image: "/food6.jpg",
  },
  {
    name: "Crispy Chicken Wings",
    description: "Buffalo sauce with blue cheese dip on the side",
    price: "$9.99",
    rating: 4.6,
    image: "/food7.jpg",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm molten center with vanilla ice cream scoop",
    price: "$7.50",
    rating: 4.9,
    image: "/food8.jpg",
  },
];

export function SpecialDishesSection() {
  return (
    <section className="bg-[#f8fdf8] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#22c51f]">
            Our Menu
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-neutral-900 md:text-3xl">
            Special Dishes at Our Restaurant
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
            Discover our handpicked selection of signature dishes, crafted by expert
            chefs using the freshest ingredients.
          </p>
        </div>

        {/* Horizontal scroll cards */}
        <div className="mt-8 flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {dishes.map((dish) => (
            <div
              key={dish.name}
              className="group min-w-[260px] snap-center overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 md:min-w-[280px]"
            >
              {/* Image with green ring */}
              <div className="relative bg-gradient-to-b from-[#e8f5e9] to-white px-6 pt-8 pb-4">
                <div className="relative mx-auto h-36 w-36">
                  {/* Green ring */}
                  <div className="absolute inset-0 rounded-full border-[3px] border-[#22c51f]/30 shadow-[0_0_20px_rgba(34,197,31,0.15)]" />
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                {/* Price badge */}
                <div className="absolute right-5 top-5 rounded-lg bg-[#22c51f] px-3 py-1.5 text-sm font-extrabold text-white shadow-md">
                  {dish.price}
                </div>
              </div>

              {/* Content */}
              <div className="px-5 pb-5">
                <h3 className="text-base font-bold text-neutral-900">
                  {dish.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                  {dish.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-neutral-700">
                      {dish.rating}
                    </span>
                  </div>
                  <Link
                    href="/explore"
                    className="rounded-lg bg-[#22c51f] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#1bad1a]"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="mt-5 flex justify-center gap-2">
          <span className="h-2 w-6 rounded-full bg-[#22c51f]" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
        </div>
      </div>
    </section>
  );
}
