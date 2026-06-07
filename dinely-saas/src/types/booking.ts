export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export interface Booking {
  _id?: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  tableId?: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  partySize: number;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
