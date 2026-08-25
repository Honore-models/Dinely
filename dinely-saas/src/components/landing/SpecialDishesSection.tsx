"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const dishes = [
  {
    name: "Herb-Roasted Chicken",
    price: "$25.98",
    rating: 4.7,
    image: "/food4.jpg",
  },
  {
    name: "Classic Beef Burger",
    price: "$13.50",
    rating: 4.8,
    image: "/food5.jpg",
  },
  {
    name: "Pepperoni Pizza",
    price: "$11.00",
    rating: 4.8,
    image: "/food6.jpg",
  },
  {
    name: "Crispy Chicken Wings",
    price: "$9.99",
    rating: 4.6,
    image: "/food7.jpg",
  },
  {
    name: "Chocolate Lava Cake",
    price: "$7.50",
    rating: 4.9,
    image: "/food8.jpg",
  },
];

export function SpecialDishesSection() {
  return (
    <section className="bg-[#f8fdf8] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900 md:text-4xl">
            Special Dishes at Our Restaurant
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-500">
            Discover our handpicked selection of signature dishes, crafted by expert
            chefs using the freshest ingredients.
          </p>
        </div>

        {/* Horizontal scroll */}
        <div className="mt-12 flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {dishes.map((dish) => (
            <div
              key={dish.name}
              className="min-w-[240px] snap-center rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md md:min-w-[260px]"
            >
              {/* Circular image */}
              <div className="relative mx-auto h-32 w-32">
                <div className="absolute inset-0 rounded-full border-4 border-[#22c51f]/20" />
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm font-bold text-neutral-900">{dish.name}</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <span className="text-sm font-bold text-neutral-700">{dish.rating}</span>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i <= Math.round(dish.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-200"
                      }
                    />
                  ))}
                </div>
                <p className="mt-3 text-lg font-extrabold text-[#22c51f]">{dish.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="mt-6 flex justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22c51f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
        </div>
      </div>
    </section>
  );
}
