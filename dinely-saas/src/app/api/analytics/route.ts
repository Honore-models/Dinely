import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

// ─── GET /api/analytics ───────────────────────────────────────────────────────
// Owner only. Returns dashboard metrics for their restaurant.
// Supports ?period=7d|30d|90d

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
  const previousStart = new Date(
    currentStart.getTime() - days * 24 * 60 * 60 * 1000,
  );

  const restaurantId = session.restaurantId;

  try {
    const db = await getDb();

    // ── Revenue & orders ──────────────────────────────────────────────────────
    const [currentPeriod, previousPeriod] = await Promise.all([
      db
        .collection("orders")
        .aggregate([
          {
            $match: {
              restaurantId,
              status: { $in: ["Completed", "Active"] },
              createdAt: { $gte: currentStart, $lte: now },
            },
          },
          {
            $group: {
              _id: null,
              revenue: { $sum: "$total" },
              count: { $sum: 1 },
              uniqueCustomers: { $addToSet: "$customerId" },
            },
          },
        ])
        .toArray(),
      db
        .collection("orders")
        .aggregate([
          {
            $match: {
              restaurantId,
              status: { $in: ["Completed", "Active"] },
              createdAt: { $gte: previousStart, $lt: currentStart },
            },
          },
          {
            $group: {
              _id: null,
              revenue: { $sum: "$total" },
              count: { $sum: 1 },
              uniqueCustomers: { $addToSet: "$customerId" },
            },
          },
        ])
        .toArray(),
    ]);

    const cur = currentPeriod[0] ?? {
      revenue: 0,
      count: 0,
      uniqueCustomers: [],
    };
    const prev = previousPeriod[0] ?? {
      revenue: 0,
      count: 0,
      uniqueCustomers: [],
    };

    const pctChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const curRevenue = Math.round((cur.revenue as number) * 100) / 100;
    const prevRevenue = Math.round((prev.revenue as number) * 100) / 100;
    const curOrders = cur.count as number;
    const prevOrders = prev.count as number;
    const curCustomers = (cur.uniqueCustomers as string[]).length;
    const prevCustomers = (prev.uniqueCustomers as string[]).length;
    const curAvg =
      curOrders > 0
        ? Math.round((curRevenue / curOrders) * 100) / 100
        : 0;
    const prevAvg =
      prevOrders > 0
        ? Math.round((prevRevenue / prevOrders) * 100) / 100
        : 0;

    // ── Daily revenue chart ────────────────────────────────────────────────────
    const revenueChart = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            restaurantId,
            status: { $in: ["Completed", "Active"] },
            createdAt: { $gte: currentStart, $lte: now },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // ── Orders by type ────────────────────────────────────────────────────────
    const ordersByType = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            restaurantId,
            createdAt: { $gte: currentStart, $lte: now },
          },
        },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // ── Orders by status ──────────────────────────────────────────────────────
    const ordersByStatus = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            restaurantId,
            createdAt: { $gte: currentStart, $lte: now },
          },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // ── Top menu items ─────────────────────────────────────────────────────────
    const topItems = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            restaurantId,
            status: { $in: ["Completed", "Active"] },
            createdAt: { $gte: currentStart, $lte: now },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.menuItemId",
            name: { $first: "$items.name" },
            quantity: { $sum: "$items.quantity" },
            revenue: {
              $sum: { $multiply: ["$items.price", "$items.quantity"] },
            },
          },
        },
        { $sort: { quantity: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    return NextResponse.json({
      revenue: {
        current: curRevenue,
        previous: prevRevenue,
        change: pctChange(curRevenue, prevRevenue),
      },
      orders: {
        current: curOrders,
        previous: prevOrders,
        change: pctChange(curOrders, prevOrders),
      },
      customers: {
        current: curCustomers,
        previous: prevCustomers,
        change: pctChange(curCustomers, prevCustomers),
      },
      avgOrderValue: {
        current: curAvg,
        previous: prevAvg,
        change: pctChange(curAvg, prevAvg),
      },
      revenueChart: revenueChart.map((d) => ({
        date: d._id as string,
        revenue: Math.round((d.revenue as number) * 100) / 100,
        orders: d.orders as number,
      })),
      ordersByType: ordersByType.map((d) => ({
        type: d._id as string,
        count: d.count as number,
      })),
      ordersByStatus: ordersByStatus.map((d) => ({
        status: d._id as string,
        count: d.count as number,
      })),
      topItems: topItems.map((d) => ({
        id: d._id as string,
        name: d.name as string,
        quantity: d.quantity as number,
        revenue: Math.round((d.revenue as number) * 100) / 100,
      })),
    });
  } catch (err) {
    console.error("[GET /api/analytics]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
