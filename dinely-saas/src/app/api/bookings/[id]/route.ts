import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const updateBookingSchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Cancelled", "Completed"]).optional(),
  tableId: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const db = await getDb();
    const booking = await db
      .collection("bookings")
      .findOne({ _id: new ObjectId(id) });
    if (!booking)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (
      session.role === "owner" &&
      booking.restaurantId !== session.restaurantId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.role === "customer" && booking.customerId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      data: { ...booking, _id: booking._id.toString() },
    });
  } catch (err) {
    console.error("[GET /api/bookings/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();
    const booking = await db
      .collection("bookings")
      .findOne({ _id: new ObjectId(id) });
    if (!booking)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Owners update status; customers can only cancel their own
    if (
      session.role === "owner" &&
      booking.restaurantId !== session.restaurantId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.role === "customer") {
      if (booking.customerId !== session.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (parsed.data.status && parsed.data.status !== "Cancelled") {
        return NextResponse.json(
          { error: "Customers can only cancel bookings" },
          { status: 403 },
        );
      }
    }

    await db
      .collection("bookings")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...parsed.data, updatedAt: new Date() } },
      );

    return NextResponse.json({ message: "Booking updated" });
  } catch (err) {
    console.error("[PATCH /api/bookings/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
