"use client";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { RestaurantProfile } from "@/components/dashboard/RestaurantProfile";
import { TopOrdersSection } from "@/components/dashboard/TopOrdersSection";
import { useRestaurant } from "@/hooks/useRestaurant";

const topOrders = [
  {
    id: "1",
    name: "Fresh Vegetable Salad",
    description: "A refreshing mix of crisp, colorful vegetables tossed with light dressing.",
    price: "$120.00",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    name: "Chicken Legs",
    description: "Juicy, well-seasoned chicken legs—tender on the inside and perfectly roasted.",
    price: "$720.00",
    image: "https://images.unsplash.com/photo-1514516870926-9f2d7f4addb7?auto=format&fit=crop&w=200&q=80",
  },
];

export default function MyRestaurantPage() {
  const { restaurant, loading } = useRestaurant();

  return (
    <>
      <DashboardPageHeader
        title="My Restaurant"
        description="Manage your restaurant profile, hours, and branding."
      />
      {loading ? (
        <div className="flex h-48 items-center justify-center text-neutral-400">Loading...</div>
      ) : restaurant ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RestaurantProfile
              name={restaurant.name}
              phone={restaurant.phone}
              rating={4.8}
              reviews={52}
              hours={restaurant.openingHours}
              about={`Welcome to ${restaurant.name}. ${restaurant.type} restaurant located at ${restaurant.address}.`}
            />
          </div>
          <div>
            <TopOrdersSection orders={topOrders} />
          </div>
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center text-neutral-400">
          No restaurant found. Complete onboarding first.
        </div>
      )}
    </>
  );
}
