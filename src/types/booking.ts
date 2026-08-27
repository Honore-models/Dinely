export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export interface Booking {
  id: string;
  restaurant_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  table_id?: string;
  date: string;
  time: string;
  party_size: number;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}
