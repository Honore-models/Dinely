import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const { data: item, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: item });
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
    // Verify ownership
    const { data: item } = await supabase
      .from("menu_items")
      .select("restaurant_id")
      .eq("id", id)
      .single();

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (item.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.name) updateData.name = parsed.data.name;
    if (parsed.data.category) updateData.category = parsed.data.category;
    if (parsed.data.price !== undefined) updateData.price = parsed.data.price;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.image !== undefined) updateData.image = parsed.data.image;
    if (parsed.data.mealTimes) updateData.meal_times = parsed.data.mealTimes;
    if (parsed.data.priceRange) updateData.price_range = parsed.data.priceRange;
    if (parsed.data.available !== undefined) updateData.available = parsed.data.available;

    const { error } = await supabase
      .from("menu_items")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

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

  try {
    const { data: item } = await supabase
      .from("menu_items")
      .select("restaurant_id")
      .eq("id", id)
      .single();

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (item.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await supabase.from("menu_items").delete().eq("id", id);
    return NextResponse.json({ message: "Menu item deleted" });
  } catch (err) {
    console.error("[DELETE /api/menu/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
