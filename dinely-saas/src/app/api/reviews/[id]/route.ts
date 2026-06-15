import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateReviewSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/reviews/[id] – customer edits their own review
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();
    const review = await db
      .collection("reviews")
      .findOne({ _id: new ObjectId(id) });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (review.customerId !== session.userId && session.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .collection("reviews")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...parsed.data, updatedAt: new Date() } },
      );

    // Re-compute restaurant rating
    const ratingAgg = await db
      .collection("reviews")
      .aggregate([
        { $match: { restaurantId: review.restaurantId } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ])
      .toArray();

    if (ratingAgg[0] && ObjectId.isValid(review.restaurantId)) {
      await db.collection("restaurants").updateOne(
        { _id: new ObjectId(review.restaurantId) },
        {
          $set: {
            rating: Math.round(ratingAgg[0].avg * 10) / 10,
            reviewCount: ratingAgg[0].count,
            updatedAt: new Date(),
          },
        },
      );
    }

    return NextResponse.json({ message: "Review updated" });
  } catch (err) {
    console.error("[PATCH /api/reviews/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/reviews/[id] – customer deletes own review or owner deletes from their restaurant
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const review = await db
      .collection("reviews")
      .findOne({ _id: new ObjectId(id) });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const isOwnerOfRestaurant =
      session.role === "owner" &&
      review.restaurantId === session.restaurantId;
    const isAuthor = review.customerId === session.userId;

    if (!isOwnerOfRestaurant && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });

    // Re-compute restaurant rating
    const ratingAgg = await db
      .collection("reviews")
      .aggregate([
        { $match: { restaurantId: review.restaurantId } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ])
      .toArray();

    if (ObjectId.isValid(review.restaurantId)) {
      await db.collection("restaurants").updateOne(
        { _id: new ObjectId(review.restaurantId) },
        {
          $set: {
            rating: ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : 0,
            reviewCount: ratingAgg[0]?.count ?? 0,
            updatedAt: new Date(),
          },
        },
      );
    }

    return NextResponse.json({ message: "Review deleted" });
  } catch (err) {
    console.error("[DELETE /api/reviews/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/reviews/[id]?action=helpful – mark a review as helpful
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db
      .collection("reviews")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { helpful: 1 } });
    return NextResponse.json({ message: "Marked as helpful" });
  } catch (err) {
    console.error("[POST /api/reviews/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
