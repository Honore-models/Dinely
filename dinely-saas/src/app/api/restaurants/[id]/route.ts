import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { restaurantSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/restaurants/[id] ────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const restaurant = await db
      .collection("restaurants")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { stripeCustomerId: 0, stripeSubscriptionId: 0 } },
      );

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: { ...restaurant, _id: restaurant._id.toString() },
    });
  } catch (err) {
    console.error("[GET /api/restaurants/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── PATCH /api/restaurants/[id] ─────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);

  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.restaurantId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  const parsed = restaurantSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();
    await db
      .collection("restaurants")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...parsed.data, updatedAt: new Date() } },
      );

    return NextResponse.json({ message: "Restaurant updated" });
  } catch (err) {
    console.error("[PATCH /api/restaurants/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── DELETE /api/restaurants/[id] ────────────────────────────────────────────

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);

  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.restaurantId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const db = await getDb();
    await db.collection("restaurants").deleteOne({ _id: new ObjectId(id) });
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(session.userId) },
        { $unset: { restaurantId: "" }, $set: { updatedAt: new Date() } },
      );

    return NextResponse.json({ message: "Restaurant deleted" });
  } catch (err) {
    console.error("[DELETE /api/restaurants/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
