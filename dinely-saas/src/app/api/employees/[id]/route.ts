import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { employeeSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
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
    const employee = await db
      .collection("employees")
      .findOne({ _id: new ObjectId(id) });
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    if (employee.restaurantId !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({
      data: { ...employee, _id: employee._id.toString() },
    });
  } catch (err) {
    console.error("[GET /api/employees/[id]]", err);
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

  const parsed = employeeSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const db = await getDb();
    const employee = await db
      .collection("employees")
      .findOne({ _id: new ObjectId(id) });
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    if (employee.restaurantId !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .collection("employees")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...parsed.data, updatedAt: new Date() } },
      );

    return NextResponse.json({ message: "Employee updated" });
  } catch (err) {
    console.error("[PATCH /api/employees/[id]]", err);
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
    const employee = await db
      .collection("employees")
      .findOne({ _id: new ObjectId(id) });
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    if (employee.restaurantId !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("employees").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Employee removed" });
  } catch (err) {
    console.error("[DELETE /api/employees/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
