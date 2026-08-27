export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  meal_times: string[];
  price_range: string;
  promo?: string;
  rating: number;
  reviews: number;
  orders: number;
  favourites: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}
