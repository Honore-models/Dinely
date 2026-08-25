import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

// ─── GET /api/analytics ───────────────────────────────────────────────────────
// Owner only. Uses Supabase RPC-style queries for dashboard metrics.

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.restaurantId) {
    return NextResponse.json({
      revenue: { current: 0, previous: 0, change: 0 },
      orders: { current: 0, previous: 0, change: 0 },
      customers: { current: 0, previous: 0, change: 0 },
      avgOrderValue: { current: 0, previous: 0, change: 0 },
      revenueChart: [],
      ordersByType: [],
      ordersByStatus: [],
      topItems: [],
    });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d";
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;

  const now = new Date();
  const currentStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const previousStart = new Date(currentStart.getTime() - days * 24 * 60 * 60 * 1000);

  const restaurantId = session.restaurantId;

  const pctChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  try {
    // Current period orders
    const { data: curOrders } = await supabase
      .from("orders")
      .select("total, customer_id, items, status, type, created_at")
      .eq("restaurant_id", restaurantId)
      .in("status", ["Completed", "Active"])
      .gte("created_at", currentStart.toISOString())
      .lte("created_at", now.toISOString());

    // Previous period orders
    const { data: prevOrders } = await supabase
      .from("orders")
      .select("total, customer_id")
      .eq("restaurant_id", restaurantId)
      .in("status", ["Completed", "Active"])
      .gte("created_at", previousStart.toISOString())
      .lt("created_at", currentStart.toISOString());

    // All current-period orders (for status/type breakdown, including non-completed)
    const { data: allCurrentOrders } = await supabase
      .from("orders")
      .select("status, type")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", currentStart.toISOString())
      .lte("created_at", now.toISOString());

    const cur = curOrders || [];
    const prev = prevOrders || [];

    const curRevenue = Math.round(cur.reduce((s, o) => s + (o.total || 0), 0) * 100) / 100;
    const prevRevenue = Math.round(prev.reduce((s, o) => s + (o.total || 0), 0) * 100) / 100;
    const curCount = cur.length;
    const prevCount = prev.length;
    const curCustomers = new Set(cur.map((o) => o.customer_id)).size;
    const prevCustomers = new Set(prev.map((o) => o.customer_id)).size;
    const curAvg = curCount > 0 ? Math.round((curRevenue / curCount) * 100) / 100 : 0;
    const prevAvg = prevCount > 0 ? Math.round((prevRevenue / prevCount) * 100) / 100 : 0;

    // Daily revenue chart
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    for (const o of cur) {
      const day = o.created_at ? new Date(o.created_at).toISOString().slice(0, 10) : "unknown";
      const entry = dailyMap.get(day) || { revenue: 0, orders: 0 };
      entry.revenue += o.total || 0;
      entry.orders += 1;
      dailyMap.set(day, entry);
    }
    const revenueChart = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { revenue, orders }]) => ({
        date,
        revenue: Math.round(revenue * 100) / 100,
        orders,
      }));

    // Orders by type
    const typeMap = new Map<string, number>();
    for (const o of allCurrentOrders || []) {
      typeMap.set(o.type, (typeMap.get(o.type) || 0) + 1);
    }
    const ordersByType = Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Orders by status
    const statusMap = new Map<string, number>();
    for (const o of allCurrentOrders || []) {
      statusMap.set(o.status, (statusMap.get(o.status) || 0) + 1);
    }
    const ordersByStatus = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    // Top items (flatten items from all current period orders)
    const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const o of cur) {
      const items = (o.items as Array<{ menuItemId: string; name: string; price: number; quantity: number }>) || [];
      for (const item of items) {
        const existing = itemMap.get(item.menuItemId) || { name: item.name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        itemMap.set(item.menuItemId, existing);
      }
    }
    const topItems = Array.from(itemMap.entries())
      .map(([id, { name, quantity, revenue }]) => ({
        id,
        name,
        quantity,
        revenue: Math.round(revenue * 100) / 100,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return NextResponse.json({
      revenue: { current: curRevenue, previous: prevRevenue, change: pctChange(curRevenue, prevRevenue) },
      orders: { current: curCount, previous: prevCount, change: pctChange(curCount, prevCount) },
      customers: { current: curCustomers, previous: prevCustomers, change: pctChange(curCustomers, prevCustomers) },
      avgOrderValue: { current: curAvg, previous: prevAvg, change: pctChange(curAvg, prevAvg) },
      revenueChart,
      ordersByType,
      ordersByStatus,
      topItems,
    });
  } catch (err) {
    console.error("[GET /api/analytics]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
