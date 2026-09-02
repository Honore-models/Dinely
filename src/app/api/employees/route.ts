import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
    let query = supabase
      .from("employees")
      .select("*")
      .eq("restaurant_id", session.restaurantId)
      .order("last_name", { ascending: true })
      .order("first_name", { ascending: true });

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,role.ilike.%${search}%`,
      );
    }

    const { data: employees, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data: employees || [] });
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
    return NextResponse.json({ error: "Complete restaurant setup first" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = employeeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  try {
    // Prevent duplicate employee emails within this restaurant
    const { data: existing } = await supabase
      .from("employees")
      .select("id")
      .eq("restaurant_id", session.restaurantId)
      .eq("email", parsed.data.email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "An employee with this email already exists" },
        { status: 409 },
      );
    }

    const { data: newEmployee, error } = await supabase
      .from("employees")
      .insert({
        restaurant_id: session.restaurantId,
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        role: parsed.data.role,
        salary: parsed.data.salary || null,
        start_date: parsed.data.startDate || null,
        notes: parsed.data.notes || null,
        image: parsed.data.image || null,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Employee added", id: newEmployee.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/employees]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
