export type OrderStatus = "Pending" | "Active" | "Completed" | "Cancelled";
export type OrderType = "Delivery" | "Takeaway" | "Dine-in";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  restaurant_id: string;
  customer_id: string;
  customer_name: string;
  items: OrderItem[];
  type: OrderType;
  status: OrderStatus;
  total: number;
  delivery_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
