import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const item = await db
      .collection("menu_items")
      .findOne({ _id: new ObjectId(id) });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: { ...item, _id: item._id.toString() } });
  } catch (err) {
    console.error("[GET /api/menu/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
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

  const parsed = menuItemSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();
    // Ensure the item belongs to this owner's restaurant
    const item = await db
      .collection("menu_items")
      .findOne({ _id: new ObjectId(id) });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (item.restaurantId !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .collection("menu_items")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...parsed.data, updatedAt: new Date() } },
      );

    return NextResponse.json({ message: "Menu item updated" });
  } catch (err) {
    console.error("[PATCH /api/menu/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const item = await db
      .collection("menu_items")
      .findOne({ _id: new ObjectId(id) });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (item.restaurantId !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("menu_items").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Menu item deleted" });
  } catch (err) {
    console.error("[DELETE /api/menu/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
