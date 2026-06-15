import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { favouriteSchema } from "@/lib/validators";

// ─── GET /api/favourites ──────────────────────────────────────────────────────
// Returns the logged-in customer's favourite restaurants with full restaurant data.

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.userId) });

    const favouriteIds: string[] = user?.favourites ?? [];
    if (favouriteIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const validIds = favouriteIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    const restaurants = await db
      .collection("restaurants")
      .find(
        { _id: { $in: validIds } },
        { projection: { stripeCustomerId: 0, stripeSubscriptionId: 0 } },
      )
      .toArray();

    return NextResponse.json({
      data: restaurants.map((r) => ({ ...r, _id: r._id.toString() })),
    });
  } catch (err) {
    console.error("[GET /api/favourites]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/favourites ─────────────────────────────────────────────────────
// Add a restaurant to favourites. Body: { restaurantId }

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

  const parsed = favouriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  const { restaurantId } = parsed.data;

  try {
    const db = await getDb();

    if (!ObjectId.isValid(restaurantId)) {
      return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
    }

    // Verify restaurant exists
    const restaurant = await db
      .collection("restaurants")
      .findOne({ _id: new ObjectId(restaurantId) });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // Add to user's favourites array (addToSet prevents duplicates)
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      {
        $addToSet: { favourites: restaurantId },
        $set: { updatedAt: new Date() },
      },
    );

    return NextResponse.json({ message: "Added to favourites" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/favourites]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── DELETE /api/favourites?restaurantId=xxx ──────────────────────────────────
// Remove a restaurant from favourites.

export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurantId query param required" },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        $pull: { favourites: restaurantId } as any,
        $set: { updatedAt: new Date() },
      },
    );

    return NextResponse.json({ message: "Removed from favourites" });
  } catch (err) {
    console.error("[DELETE /api/favourites]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
