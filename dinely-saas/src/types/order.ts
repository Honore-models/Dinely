export type OrderStatus = "Pending" | "Active" | "Completed" | "Cancelled";
export type OrderType = "Delivery" | "Takeaway" | "Dine-in";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id?: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  type: OrderType;
  status: OrderStatus;
  total: number;
  deliveryAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
