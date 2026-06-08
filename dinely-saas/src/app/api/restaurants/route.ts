import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { restaurantSchema } from "@/lib/validators";

// ─── GET /api/restaurants ─────────────────────────────────────────────────────
// Owner: returns their own restaurant.
// Customer / public: returns all restaurants (for explore page).

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const session = await getSession(req);

    // If an owner is logged in and asks for "mine", return just their restaurant
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine");

    if (session?.role === "owner" && mine === "true") {
      if (!session.restaurantId) {
        return NextResponse.json({ data: null }, { status: 200 });
      }
      const restaurant = await db
        .collection("restaurants")
        .findOne({ _id: new ObjectId(session.restaurantId) });
      if (!restaurant) return NextResponse.json({ data: null });
      return NextResponse.json({
        data: { ...restaurant, _id: restaurant._id.toString() },
      });
    }

    // Public: list all restaurants
    const restaurants = await db
      .collection("restaurants")
      .find(
        {},
        { projection: { stripeCustomerId: 0, stripeSubscriptionId: 0 } },
      )
      .toArray();

    return NextResponse.json({
      data: restaurants.map((r) => ({ ...r, _id: r._id.toString() })),
    });
  } catch (err) {
    console.error("[GET /api/restaurants]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/restaurants ────────────────────────────────────────────────────
// Create a restaurant for the logged-in owner (called at end of onboarding).

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = restaurantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();

    // Check if owner already has a restaurant
    const existing = await db
      .collection("restaurants")
      .findOne({ ownerId: session.userId });
    if (existing) {
      return NextResponse.json(
        { error: "You already have a restaurant. Use PATCH to update it." },
        { status: 409 },
      );
    }

    const now = new Date();
    const result = await db.collection("restaurants").insertOne({
      ...parsed.data,
      ownerId: session.userId,
      plan: (body as Record<string, unknown>).plan || "Professional",
      billingCycle: (body as Record<string, unknown>).billingCycle || "monthly",
      subscriptionStatus: "trialing",
      createdAt: now,
      updatedAt: now,
    });

    // Link restaurantId onto the user document
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(session.userId) },
        {
          $set: { restaurantId: result.insertedId.toString(), updatedAt: now },
        },
      );

    return NextResponse.json(
      {
        message: "Restaurant created",
        restaurantId: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/restaurants]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
