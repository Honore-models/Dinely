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
    // Get all orders for this restaurant to find unique customers
    const { data: orders } = await supabase
      .from("orders")
      .select("customer_id, customer_name, total, created_at")
      .eq("restaurant_id", session.restaurantId);

    if (!orders || orders.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Aggregate by customer
    const clientMap = new Map<
      string,
      { name: string; orderCount: number; totalSpent: number; lastVisit: string }
    >();

    for (const o of orders) {
      const existing = clientMap.get(o.customer_id) || {
        name: o.customer_name,
        orderCount: 0,
        totalSpent: 0,
        lastVisit: o.created_at,
      };
      existing.orderCount += 1;
      existing.totalSpent += o.total || 0;
      if (o.created_at > existing.lastVisit) existing.lastVisit = o.created_at;
      clientMap.set(o.customer_id, existing);
    }

    // Get user details for emails/phones
    const clientIds = Array.from(clientMap.keys());
    const { data: users } = await supabase
      .from("users")
      .select("id, email, phone")
      .in("id", clientIds);

    const userMap = new Map((users || []).map((u) => [u.id, u]));

    const clients = Array.from(clientMap.entries())
      .map(([id, info]) => {
        const user = userMap.get(id);
        return {
          id,
          name: info.name,
          email: user?.email || "",
          phone: user?.phone || "",
          orderCount: info.orderCount,
          totalSpent: Math.round(info.totalSpent * 100) / 100,
          lastVisit: info.lastVisit,
          status: info.orderCount >= 5 ? "active" : info.orderCount <= 1 ? "new" : "active",
        };
      })
      .filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()),
      );

    return NextResponse.json({ data: clients });
  } catch (err) {
    console.error("[GET /api/clients]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
