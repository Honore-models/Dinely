"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Globe, MapPin, Phone, Timer } from "lucide-react";
import { RestaurantDetailHeader } from "@/components/customer/RestaurantDetailHeader";
import { DishRow } from "@/components/customer/DishRow";

// Mock restaurant data
const mockRestaurant = {
  id: "1",
  name: "The Golden Plate",
  type: "American Burger Restaurant",
  rating: 4.6,
  reviewCount: "2.5K",
  coverImage:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  tagline: "Good food\nGood mood",
  about:
    "This upscale dining destination is celebrated for its modern, innovative cuisine that frequently pushes culinary boundaries.",
  address: "KN 5 Rd, Kigali, Rwanda",
  hours: "10:45 – 20:30PM",
  phone: "+250 245 253 342",
  website: "www.goldenplate.com",
  isActive: true,
};

const popularDishes = [
  {
    id: "d1",
    name: "Herb-Roasted Meat",
    description:
      "Roasted chicken breast or turkey, seasoned with aromatic herbs like rosemary and thyme",
    price: 25.98,
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&q=80",
  },
  {
    id: "d2",
    name: "Crispy Chicken",
    description:
      "Stir-fried noodles—typically spaghetti or Asian-style noodles—topped with sliced, breaded, and fried protein",
    price: 14.98,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
  },
  {
    id: "d3",
    name: "Pepperoni Pizza with Extra Cheese",
    description:
      "A classic favorite, this pizza features a thin, golden crust topped with zesty tomato sauce and a generous layer of melted mozzarella cheese",
    price: 11.0,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
  },
];

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews (2.4K)", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.restaurantId as string;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Header / cover */}
      <RestaurantDetailHeader
        name={mockRestaurant.name}
        type={mockRestaurant.type}
        rating={mockRestaurant.rating}
        reviewCount={mockRestaurant.reviewCount}
        coverImage={mockRestaurant.coverImage}
        tagline={mockRestaurant.tagline}
        onOrderNow={() => router.push(`/restaurants/${id}/menu`)}
        onBookTable={() => router.push(`/restaurants/${id}/info`)}
      />

      {/* Tab nav */}
      <nav className="mt-6 flex gap-6 border-b border-neutral-200">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? `/restaurants/${id}`
              : `/restaurants/${id}/${tab.href}`;
          return (
            <Link
              key={tab.label}
              href={href}
              className="relative pb-3 text-sm font-semibold text-neutral-500 transition hover:text-neutral-800 [&.active]:text-[#22c51f]"
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Overview content */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* About + Info */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {mockRestaurant.about}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2.5 text-sm text-neutral-700">
              <MapPin size={16} className="shrink-0 text-[#22c51f]" />
              <span className="font-semibold">{mockRestaurant.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Timer size={16} className="shrink-0 text-[#22c51f]" />
              <span className="font-bold text-[#22c51f]">Active</span>
              <span className="text-neutral-500">• {mockRestaurant.hours}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-neutral-700">
              <Phone size={16} className="shrink-0 text-neutral-400" />
              <span>{mockRestaurant.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-neutral-700">
              <Globe size={16} className="shrink-0 text-neutral-400" />
              <span className="text-[#22c51f] underline underline-offset-2">
                {mockRestaurant.website}
              </span>
            </div>
          </div>
        </div>

        {/* Popular Dishes */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Popular Dishes</h2>
          <div className="mt-4 space-y-3">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center gap-4 rounded-xl bg-white"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-neutral-900">{dish.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                    {dish.description}
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-[#22c51f]">
                    ${dish.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/restaurants/${id}/menu`}
            className="mt-4 block w-full rounded-xl border border-[#22c51f] py-2.5 text-center text-sm font-bold text-[#22c51f] transition hover:bg-green-50"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
