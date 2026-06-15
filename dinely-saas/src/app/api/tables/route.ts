import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { tableSchema } from "@/lib/validators";

// ─── GET /api/tables?restaurantId=xxx ────────────────────────────────────────
// Public: view tables for a restaurant (for booking UI).
// Owner: get their own tables (no query param needed).

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    const session = await getSession(req);
    if (!session?.restaurantId) {
      return NextResponse.json(
        { error: "restaurantId required" },
        { status: 400 },
      );
    }
    restaurantId = session.restaurantId;
  }

  try {
    const db = await getDb();
    const tables = await db
      .collection("tables")
      .find({ restaurantId })
      .sort({ number: 1 })
      .toArray();

    return NextResponse.json({
      data: tables.map((t) => ({ ...t, _id: t._id.toString() })),
    });
  } catch (err) {
    console.error("[GET /api/tables]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/tables ─────────────────────────────────────────────────────────
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

  const parsed = tableSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();

    // Prevent duplicate table numbers
    const exists = await db.collection("tables").findOne({
      restaurantId: session.restaurantId,
      number: parsed.data.number,
    });
    if (exists) {
      return NextResponse.json(
        { error: `Table #${parsed.data.number} already exists` },
        { status: 409 },
      );
    }

    const now = new Date();
    const result = await db.collection("tables").insertOne({
      ...parsed.data,
      restaurantId: session.restaurantId,
      status: parsed.data.status ?? "available",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "Table created", id: result.insertedId.toString() },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/tables]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
