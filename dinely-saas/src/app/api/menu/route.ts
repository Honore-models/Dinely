import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validators";

// ─── GET /api/menu?restaurantId=xxx ──────────────────────────────────────────
// Public: fetch menu for a given restaurant.
// Owner (no query param): fetch their own restaurant's menu.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    const session = await getSession(req);
    if (!session?.restaurantId) {
      return NextResponse.json(
        { error: "restaurantId query param required" },
        { status: 400 },
      );
    }
    restaurantId = session.restaurantId;
  }

  try {
    const db = await getDb();
    const items = await db
      .collection("menu_items")
      .find({ restaurantId })
      .sort({ category: 1, name: 1 })
      .toArray();

    return NextResponse.json({
      data: items.map((i) => ({ ...i, _id: i._id.toString() })),
    });
  } catch (err) {
    console.error("[GET /api/menu]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/menu ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.restaurantId) {
    return NextResponse.json(
      { error: "Complete restaurant setup first" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();
    const now = new Date();
    const result = await db.collection("menu_items").insertOne({
      ...parsed.data,
      restaurantId: session.restaurantId,
      mealTimes: parsed.data.mealTimes || [],
      priceRange: parsed.data.priceRange || "$",
      rating: 0,
      reviews: 0,
      orders: 0,
      favourites: 0,
      available: parsed.data.available ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "Menu item created", id: result.insertedId.toString() },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/menu]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
