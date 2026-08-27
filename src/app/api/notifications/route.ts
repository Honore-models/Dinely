import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "booking" | "review" | "system" | "promotion";
  read: boolean;
  link?: string;
  created_at: string;
}

// Generate notifications based on restaurant data
function generateNotifications(role: string, data: any): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  if (role === "owner") {
    const { orders = [], bookings = [], reviews = [] } = data;

    // Recent orders
    orders.slice(0, 3).forEach((order: any) => {
      notifications.push({
        id: `order-${order.id}`,
        title: "New Order Received",
        message: `${order.customer_name || "Customer"} placed a ${order.type} order for $${order.total?.toFixed(2) || "0"}`,
        type: "order",
        read: false,
        link: `/dashboard/orders/${order.id}`,
        created_at: order.created_at || now.toISOString(),
      });
    });

    // Recent bookings
    bookings.slice(0, 2).forEach((booking: any) => {
      notifications.push({
        id: `booking-${booking.id}`,
        title: "New Booking",
        message: `${booking.customer_name || "Customer"} booked a table for ${booking.guests || 2} guests`,
        type: "booking",
        read: false,
        link: "/dashboard/bookings/tables",
        created_at: booking.created_at || now.toISOString(),
      });
    });

    // Recent reviews
    reviews.slice(0, 2).forEach((review: any) => {
      notifications.push({
        id: `review-${review.id}`,
        title: "New Review",
        message: `${review.customer_name || "Customer"} left a ${review.rating}-star review`,
        type: "review",
        read: false,
        link: "/dashboard/clients",
        created_at: review.created_at || now.toISOString(),
      });
    });
  } else {
    // Customer notifications
    const { orders = [] } = data;

    orders.slice(0, 3).forEach((order: any) => {
      const statusMessages: Record<string, string> = {
        Pending: "Your order has been received and is being prepared",
        Active: "Your order is being prepared and will be ready soon",
        Completed: "Your order has been delivered. Enjoy your meal!",
        Cancelled: "Your order has been cancelled",
      };
      notifications.push({
        id: `order-${order.id}`,
        title: `Order ${order.status}`,
        message: statusMessages[order.status] || `Your order status: ${order.status}`,
        type: "order",
        read: false,
        link: `/orders`,
        created_at: order.created_at || now.toISOString(),
      });
    });

    // Add a system notification
    notifications.push({
      id: "welcome",
      title: "Welcome to Dinely!",
      message: "Explore restaurants and enjoy exclusive offers",
      type: "system",
      read: true,
      created_at: now.toISOString(),
    });
  }

  // Sort by date (newest first)
  notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return notifications;
}

// GET /api/notifications
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let data: any = {};

    if (session.role === "owner") {
      // Fetch recent orders, bookings, reviews for the owner's restaurant
      const restaurantId = session.restaurantId;
      if (restaurantId) {
        const [ordersRes, bookingsRes, reviewsRes] = await Promise.all([
          supabase
            .from("orders")
            .select("id, customer_name, type, total, status, created_at")
            .eq("restaurant_id", restaurantId)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("bookings")
            .select("id, customer_name, guests, created_at")
            .eq("restaurant_id", restaurantId)
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("reviews")
            .select("id, customer_name, rating, created_at")
            .eq("restaurant_id", restaurantId)
            .order("created_at", { ascending: false })
            .limit(3),
        ]);

        data = {
          orders: ordersRes.data || [],
          bookings: bookingsRes.data || [],
          reviews: reviewsRes.data || [],
        };
      }
    } else {
      // Fetch recent orders for the customer
      const ordersRes = await supabase
        .from("orders")
        .select("id, status, total, created_at")
        .eq("customer_id", session.userId)
        .order("created_at", { ascending: false })
        .limit(5);

      data = {
        orders: ordersRes.data || [],
      };
    }

    const notifications = generateNotifications(session.role, data);

    return NextResponse.json({
      data: notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  } catch (err) {
    console.error("[GET /api/notifications]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
