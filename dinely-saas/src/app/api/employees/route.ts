import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { employeeSchema } from "@/lib/validators";

// ─── GET /api/employees ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.restaurantId) {
    return NextResponse.json({ data: [] });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const db = await getDb();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { restaurantId: session.restaurantId };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await db
      .collection("employees")
      .find(filter)
      .sort({ lastName: 1, firstName: 1 })
      .toArray();

    return NextResponse.json({
      data: employees.map((e) => ({ ...e, _id: e._id.toString() })),
    });
  } catch (err) {
    console.error("[GET /api/employees]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/employees ──────────────────────────────────────────────────────
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

  const parsed = employeeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();

    // Prevent duplicate employee emails within this restaurant
    const existing = await db.collection("employees").findOne({
      restaurantId: session.restaurantId,
      email: parsed.data.email,
    });
    if (existing) {
      return NextResponse.json(
        { error: "An employee with this email already exists" },
        { status: 409 },
      );
    }

    const now = new Date();
    const result = await db.collection("employees").insertOne({
      ...parsed.data,
      restaurantId: session.restaurantId,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "Employee added", id: result.insertedId.toString() },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/employees]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
