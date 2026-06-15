"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DishRow } from "@/components/customer/DishRow";

const menuCategories = [
  {
    id: "starters",
    name: "Starters",
    items: [
      {
        id: "m1",
        name: "Garlic Bread",
        description: "Toasted sourdough brushed with herb garlic butter",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1619531040576-f9416740661f?w=400&q=80",
      },
      {
        id: "m2",
        name: "Chicken Wings",
        description: "Crispy fried wings tossed in house buffalo sauce, served with ranch",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
      },
    ],
  },
  {
    id: "mains",
    name: "Main Course",
    items: [
      {
        id: "m3",
        name: "Herb-Roasted Meat",
        description: "Roasted chicken breast seasoned with aromatic herbs like rosemary and thyme",
        price: 25.98,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&q=80",
      },
      {
        id: "m4",
        name: "Crispy Chicken",
        description: "Breaded fried chicken served with fries and coleslaw",
        price: 14.98,
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
      },
      {
        id: "m5",
        name: "Pepperoni Pizza",
        description: "Thin crust pizza with tomato sauce, mozzarella, and pepperoni",
        price: 11.0,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    items: [
      {
        id: "m6",
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream",
        price: 7.5,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
      },
    ],
  },
];

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews (2.4K)", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

export default function MenuPage() {
  const params = useParams();
  const id = params.restaurantId as string;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Tab nav */}
      <nav className="flex gap-6 border-b border-neutral-200">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? `/restaurants/${id}`
              : `/restaurants/${id}/${tab.href}`;
          const isActive = tab.href === "menu";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`relative pb-3 text-sm font-semibold transition ${
                isActive
                  ? "border-b-2 border-[#22c51f] text-[#22c51f]"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Menu categories */}
      <div className="mt-8 space-y-10">
        {menuCategories.map((category) => (
          <section key={category.id}>
            <h2 className="mb-4 text-lg font-bold text-neutral-900">
              {category.name}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <DishRow
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  restaurantId={id}
                  restaurantName="The Golden Plate"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
