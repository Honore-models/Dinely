import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validators";

// ─── GET /api/bookings ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};

  if (session.role === "owner") {
    if (!session.restaurantId) return NextResponse.json({ data: [] });
    filter.restaurantId = session.restaurantId;
  } else {
    filter.customerId = session.userId;
  }

  if (date) filter.date = date;
  if (status) filter.status = status;

  try {
    const db = await getDb();
    const bookings = await db
      .collection("bookings")
      .find(filter)
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json({
      data: bookings.map((b) => ({ ...b, _id: b._id.toString() })),
    });
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/bookings ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();

    const restaurant = await db
      .collection("restaurants")
      .findOne({ _id: new ObjectId(parsed.data.restaurantId) });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.userId) });

    const now = new Date();
    const result = await db.collection("bookings").insertOne({
      ...parsed.data,
      customerId: session.userId,
      customerName: user ? `${user.firstName} ${user.lastName}` : "Guest",
      customerEmail: user?.email || "",
      status: "Pending",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "Booking created", bookingId: result.insertedId.toString() },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
