"use client";

import Image from "next/image";

const items = [
  {
    title: "Easy To Order",
    description: "You only need a few steps to start ordering food from your favorite restaurants.",
    image: "/Delivery1.png",
  },
  {
    title: "Fastest Delivery",
    description: "Delivery that is always on time, even faster than you expect. Hot and fresh.",
    image: "/Delivery2.png",
  },
  {
    title: "Best Quality",
    description: "Quality is our number one priority. Only the finest ingredients make it to your plate.",
    image: "/Delivery3.png",
  },
];

export function WhatWeServeSection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-[#22c51f]">
            What we serve
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-neutral-900 md:text-4xl">
            Your Favourite Food
            <br />
            Delivery Partner
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="text-center">
              <div className="relative mx-auto h-56 w-56">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="mt-6 text-lg font-bold text-neutral-900">
                {item.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm text-neutral-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
