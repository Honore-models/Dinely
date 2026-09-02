import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { employeeSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: employee, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    if (employee.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ data: employee });
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = employeeSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  try {
    const { data: employee } = await supabase
      .from("employees")
      .select("restaurant_id")
      .eq("id", id)
      .single();

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    if (employee.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.firstName) updateData.first_name = parsed.data.firstName;
    if (parsed.data.lastName) updateData.last_name = parsed.data.lastName;
    if (parsed.data.email) updateData.email = parsed.data.email;
    if (parsed.data.phone) updateData.phone = parsed.data.phone;
    if (parsed.data.role) updateData.role = parsed.data.role;
    if (parsed.data.salary !== undefined) updateData.salary = parsed.data.salary;
    if (parsed.data.startDate !== undefined) updateData.start_date = parsed.data.startDate;
    if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;
    if (parsed.data.image !== undefined) updateData.image = parsed.data.image;

    const { error } = await supabase
      .from("employees")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

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

  try {
    const { data: employee } = await supabase
      .from("employees")
      .select("restaurant_id")
      .eq("id", id)
      .single();

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    if (employee.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await supabase.from("employees").delete().eq("id", id);
    return NextResponse.json({ message: "Employee removed" });
  } catch (err) {
    console.error("[DELETE /api/employees/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
