export type OrderStatus = "Pending" | "Active" | "Completed" | "Cancelled";
export type OrderType = "Delivery" | "Takeaway" | "Dine-in";
export type PaymentMethod = "jjuma" | "cash";
export type OrderPaymentStatus =
  | "unpaid"
  | "awaiting_payment"
  | "paid"
  | "failed"
  | "cancelled";

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
  subtotal?: number;
  delivery_fee?: number;
  service_fee?: number;
  total: number;
  payment_method?: PaymentMethod;
  payment_status?: OrderPaymentStatus;
  jjuma_transaction_id?: string | null;
  jjuma_reference?: string | null;
  paid_at?: string | null;
  delivery_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
