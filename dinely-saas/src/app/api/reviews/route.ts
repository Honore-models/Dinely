import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validators";

// ─── GET /api/reviews?restaurantId=xxx ────────────────────────────────────────
// Public: list reviews for a restaurant (paginated).

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
  const skip = (page - 1) * limit;

  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurantId query param required" },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const [reviews, total] = await Promise.all([
      db
        .collection("reviews")
        .find({ restaurantId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("reviews").countDocuments({ restaurantId }),
    ]);

    // Compute aggregate rating
    const agg = await db
      .collection("reviews")
      .aggregate([
        { $match: { restaurantId } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ])
      .toArray();

    const avgRating = agg[0]?.avg ?? 0;

    return NextResponse.json({
      data: reviews.map((r) => ({ ...r, _id: r._id.toString() })),
      total,
      page,
      limit,
      avgRating: Math.round(avgRating * 10) / 10,
    });
  } catch (err) {
    console.error("[GET /api/reviews]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/reviews ────────────────────────────────────────────────────────
// Authenticated customers can post a review after ordering.

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

  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  const { restaurantId, rating, comment } = parsed.data;

  try {
    const db = await getDb();

    // Verify restaurant exists
    if (!ObjectId.isValid(restaurantId)) {
      return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
    }
    const restaurant = await db
      .collection("restaurants")
      .findOne({ _id: new ObjectId(restaurantId) });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // One review per customer per restaurant
    const existing = await db
      .collection("reviews")
      .findOne({ restaurantId, customerId: session.userId });
    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this restaurant. Use PATCH to update." },
        { status: 409 },
      );
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.userId) });
    const customerName = user
      ? `${user.firstName} ${user.lastName}`
      : "Anonymous";

    const now = new Date();
    const result = await db.collection("reviews").insertOne({
      restaurantId,
      customerId: session.userId,
      customerName,
      rating,
      comment,
      helpful: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Update restaurant's cached rating
    const ratingAgg = await db
      .collection("reviews")
      .aggregate([
        { $match: { restaurantId } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ])
      .toArray();

    if (ratingAgg[0]) {
      await db.collection("restaurants").updateOne(
        { _id: new ObjectId(restaurantId) },
        {
          $set: {
            rating: Math.round(ratingAgg[0].avg * 10) / 10,
            reviewCount: ratingAgg[0].count,
            updatedAt: now,
          },
        },
      );
    }

    return NextResponse.json(
      { message: "Review submitted", reviewId: result.insertedId.toString() },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/reviews]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
