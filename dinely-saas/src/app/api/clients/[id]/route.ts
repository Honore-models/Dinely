import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/clients/[id] – owner fetches a single client's profile + order history
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();

    // Get user profile
    let userDoc = null;
    if (ObjectId.isValid(id)) {
      userDoc = await db
        .collection("users")
        .findOne(
          { _id: new ObjectId(id) },
          { projection: { passwordHash: 0 } },
        );
    }

    // Get their orders at this restaurant
    const orders = await db
      .collection("orders")
      .find({ restaurantId: session.restaurantId, customerId: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({
      data: {
        user: userDoc ? { ...userDoc, _id: userDoc._id.toString() } : null,
        orders: orders.map((o) => ({ ...o, _id: o._id.toString() })),
      },
    });
  } catch (err) {
    console.error("[GET /api/clients/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
