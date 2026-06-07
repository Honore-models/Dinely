import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../lib/db";
import { getSession } from "../../../../lib/auth";
import { createOrderSchema } from "../../../../lib/validators";

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Owner: all orders for their restaurant (with pagination & status filter).
// Customer: their own orders.

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};

  if (session.role === "owner") {
    if (!session.restaurantId) {
      return NextResponse.json({ data: [], total: 0 });
    }
    filter.restaurantId = session.restaurantId;
  } else {
    filter.customerId = session.userId;
  }

  if (status) filter.status = status;

  try {
    const db = await getDb();
    const [orders, total] = await Promise.all([
      db
        .collection("orders")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("orders").countDocuments(filter),
    ]);

    return NextResponse.json({
      data: orders.map((o) => ({ ...o, _id: o._id.toString() })),
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error("[GET /api/orders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Customers place orders; owners can also create manual orders.

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  const { restaurantId, items, type, deliveryAddress, notes } = parsed.data;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  try {
    const db = await getDb();

    // Verify restaurant exists
    const restaurant = await db
      .collection("restaurants")
      .findOne({ _id: new ObjectId(restaurantId) });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    // Get customer name
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.userId) });
    const customerName = user ? `${user.firstName} ${user.lastName}` : "Guest";

    const now = new Date();
    const result = await db.collection("orders").insertOne({
      restaurantId,
      customerId: session.userId,
      customerName,
      items,
      type,
      status: "Pending",
      total: Math.round(total * 100) / 100,
      deliveryAddress,
      notes,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "Order placed", orderId: result.insertedId.toString() },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
