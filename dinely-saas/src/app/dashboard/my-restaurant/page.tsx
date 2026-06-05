import { DashboardPageHeader } from "../../../components/dashboard/DashboardPageHeader";
import { RestaurantProfile } from "../../../components/dashboard/RestaurantProfile";
import { TopOrdersSection } from "../../../components/dashboard/TopOrdersSection";

export default function MyRestaurantPage() {
  const restaurantData = {
    name: "Fork & Knife",
    phone: "+120 9834 24411",
    rating: 4.8,
    reviews: 52,
    hours: "Daily · 08:00-22:00",
    about:
      "Welcome to a place where vibrant flavours and fresh ingredients come together to create an unforgettable dining experience. Our warm, inviting atmosphere sets the perfect stage for everything from casual lunches to special celebrations",
  };

  const topOrders = [
    {
      id: "1",
      name: "Fresh Vegetable Salad",
      description:
        "A refreshing mix of crisp, colorful vegetables tossed with light dressing, delivering a clean and healthy burst of flavor.",
      price: "$120.00",
      image: "https://via.placeholder.com/200x150?text=Salad",
    },
    {
      id: "2",
      name: "Chicken Legs",
      description:
        "Paired with juicy, well-seasoned chicken legs—tender on the inside and perfectly roasted for a rich, savory finish.",
      price: "$720.00",
      image: "https://via.placeholder.com/200x150?text=Chicken",
    },
  ];

  return (
    <>
      <DashboardPageHeader
        title="My Restaurant"
        description="Manage your restaurant profile, hours, and branding."
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RestaurantProfile {...restaurantData} />
        </div>
        <div>
          <TopOrdersSection orders={topOrders} />
        </div>
      </div>
    </>
  );
}
