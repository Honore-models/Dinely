export interface MenuItem {
  _id?: string;
  restaurantId: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  mealTimes: string[]; // e.g. ["Breakfast", "Lunch"]
  priceRange: string; // e.g. "$", "$$", "$$$"
  promo?: string;
  rating: number;
  reviews: number;
  orders: number;
  favourites: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}
