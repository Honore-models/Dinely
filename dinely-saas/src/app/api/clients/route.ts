import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../lib/db";
import { getSession } from "../../../../lib/auth";

// ─── GET /api/clients ─────────────────────────────────────────────────────────
// Returns unique customers who have placed orders at the owner's restaurant.
// Each client includes their last visit date and order count.

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
    const db = await getDb();

    // Aggregate unique customers from orders
    const pipeline = [
      { $match: { restaurantId: session.restaurantId } },
      {
        $group: {
          _id: "$customerId",
          customerName: { $first: "$customerName" },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          lastVisit: { $max: "$createdAt" },
        },
      },
      { $sort: { lastVisit: -1 } },
    ];

    const clientSummaries = await db
      .collection("orders")
      .aggregate(pipeline)
      .toArray();

    // Fetch user details for each client
    const clientIds = clientSummaries
      .map((c) => {
        try {
          return new ObjectId(c._id as string);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as ObjectId[];

    const users = await db
      .collection("users")
      .find({ _id: { $in: clientIds } }, { projection: { passwordHash: 0 } })
      .toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const clients = clientSummaries
      .map((c) => {
        const user = userMap.get(c._id as string);
        return {
          id: c._id as string,
          name: c.customerName as string,
          email: user?.email || "",
          phone: user?.phone || "",
          orderCount: c.orderCount as number,
          totalSpent: Math.round((c.totalSpent as number) * 100) / 100,
          lastVisit: c.lastVisit as Date,
          status:
            (c.orderCount as number) >= 5
              ? "active"
              : (c.orderCount as number) <= 1
                ? "new"
                : "active",
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
