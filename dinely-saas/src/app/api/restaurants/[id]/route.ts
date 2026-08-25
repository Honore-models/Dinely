import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { restaurantSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/restaurants/[id] ────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ data: restaurant });
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
    const updateData: Record<string, unknown> = {};
    if (parsed.data.name) updateData.name = parsed.data.name;
    if (parsed.data.type) updateData.type = parsed.data.type;
    if (parsed.data.address) updateData.address = parsed.data.address;
    if (parsed.data.openingHours) updateData.opening_hours = parsed.data.openingHours;
    if (parsed.data.phone) updateData.phone = parsed.data.phone;
    if (parsed.data.email) updateData.email = parsed.data.email;
    if (parsed.data.logo !== undefined) updateData.logo = parsed.data.logo;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;

    const { error } = await supabase
      .from("restaurants")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

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
    await supabase.from("restaurants").delete().eq("id", id);

    // Unlink restaurant from owner
    await supabase
      .from("users")
      .update({ restaurant_id: null, updated_at: new Date().toISOString() })
      .eq("id", session.userId);

    return NextResponse.json({ message: "Restaurant deleted" });
  } catch (err) {
    console.error("[DELETE /api/restaurants/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
