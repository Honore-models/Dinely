import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

// ─── GET /api/clients ─────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.restaurantId) {
    return NextResponse.json({ data: [] });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const rid = session.restaurantId;

    // ── 1. Fetch all touchpoints in parallel ──────────────────────────────
    const [ordersRes, bookingsRes, reviewsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("customer_id, customer_name, total, created_at, status")
        .eq("restaurant_id", rid),
      supabase
        .from("bookings")
        .select("customer_id, customer_name, customer_email, date, time, party_size, status, created_at")
        .eq("restaurant_id", rid),
      supabase
        .from("reviews")
        .select("customer_id, customer_name, rating, comment, created_at")
        .eq("restaurant_id", rid),
    ]);

    const orders = ordersRes.data || [];
    const bookings = bookingsRes.data || [];
    const reviews = reviewsRes.data || [];

    // ── 2. Build unified client map ──────────────────────────────────────
    interface ClientInfo {
      name: string;
      email: string;
      orderCount: number;
      totalSpent: number;
      bookingCount: number;
      reviewCount: number;
      avgRating: number;
      lastActivity: string;
      hasOrders: boolean;
      hasBookings: boolean;
      hasReviews: boolean;
    }

    const clientMap = new Map<string, ClientInfo>();

    const upsert = (id: string, name: string, email?: string) => {
      if (!clientMap.has(id)) {
        clientMap.set(id, {
          name,
          email: email || "",
          orderCount: 0,
          totalSpent: 0,
          bookingCount: 0,
          reviewCount: 0,
          avgRating: 0,
          lastActivity: "",
          hasOrders: false,
          hasBookings: false,
          hasReviews: false,
        });
      }
      const c = clientMap.get(id)!;
      if (email && !c.email) c.email = email;
      return c;
    };

    // Orders
    for (const o of orders) {
      const c = upsert(o.customer_id, o.customer_name);
      c.hasOrders = true;
      c.orderCount += 1;
      c.totalSpent += o.total || 0;
      if (o.created_at > c.lastActivity) c.lastActivity = o.created_at;
    }

    // Bookings
    for (const b of bookings) {
      const c = upsert(b.customer_id, b.customer_name, b.customer_email);
      c.hasBookings = true;
      c.bookingCount += 1;
      if (b.created_at > c.lastActivity) c.lastActivity = b.created_at;
    }

    // Reviews
    for (const r of reviews) {
      const c = upsert(r.customer_id, r.customer_name);
      c.hasReviews = true;
      c.reviewCount += 1;
      c.avgRating =
        ((c.avgRating * (c.reviewCount - 1)) + r.rating) / c.reviewCount;
      if (r.created_at > c.lastActivity) c.lastActivity = r.created_at;
    }

    // ── 3. Enrich with user details ──────────────────────────────────────
    const clientIds = Array.from(clientMap.keys());
    if (clientIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const { data: users } = await supabase
      .from("users")
      .select("id, email, phone")
      .in("id", clientIds);

    const userMap = new Map((users || []).map((u: any) => [u.id, u]));

    // ── 4. Build response ────────────────────────────────────────────────
    const clients = Array.from(clientMap.entries())
      .map(([id, info]) => {
        const user = userMap.get(id);
        const totalInteractions = info.orderCount + info.bookingCount + info.reviewCount;
        return {
          id,
          name: info.name,
          email: user?.email || info.email,
          phone: user?.phone || "",
          orderCount: info.orderCount,
          bookingCount: info.bookingCount,
          reviewCount: info.reviewCount,
          totalSpent: Math.round(info.totalSpent * 100) / 100,
          avgRating: info.reviewCount > 0 ? Math.round(info.avgRating * 10) / 10 : null,
          lastActivity: info.lastActivity,
          hasOrders: info.hasOrders,
          hasBookings: info.hasBookings,
          hasReviews: info.hasReviews,
          status:
            totalInteractions >= 5
              ? "loyal"
              : totalInteractions >= 2
                ? "active"
                : "new",
        };
      })
      .filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        // Sort by most recent activity first
        if (a.lastActivity && b.lastActivity) {
          return b.lastActivity.localeCompare(a.lastActivity);
        }
        return a.lastActivity ? -1 : 1;
      });

    return NextResponse.json({ data: clients });
  } catch (err) {
    console.error("[GET /api/clients]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
