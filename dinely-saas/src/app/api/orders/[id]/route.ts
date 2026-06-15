import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateOrderStatusSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const db = await getDb();
    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });
    if (!order)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Owners can only see their restaurant's orders; customers their own
    if (
      session.role === "owner" &&
      order.restaurantId !== session.restaurantId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.role === "customer" && order.customerId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: { ...order, _id: order._id.toString() } });
  } catch (err) {
    console.error("[GET /api/orders/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/orders/[id] – owners update order status; customers can cancel
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();
    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });
    if (!order)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (session.role === "owner") {
      if (order.restaurantId !== session.restaurantId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      // Customer can only cancel their own order while still Pending
      if (order.customerId !== session.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (parsed.data.status !== "Cancelled") {
        return NextResponse.json(
          { error: "Customers can only cancel orders" },
          { status: 403 },
        );
      }
      if (order.status !== "Pending") {
        return NextResponse.json(
          { error: "Only pending orders can be cancelled" },
          { status: 409 },
        );
      }
    }

    await db
      .collection("orders")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: parsed.data.status, updatedAt: new Date() } },
      );

    return NextResponse.json({ message: "Order updated" });
  } catch (err) {
    console.error("[PATCH /api/orders/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
