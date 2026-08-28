import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validators";

// ─── GET /api/menu?restaurantId=xxx ──────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    const session = await getSession(req);
    if (!session?.restaurantId) {
      return NextResponse.json(
        { error: "restaurantId query param required" },
        { status: 400 },
      );
    }
    restaurantId = session.restaurantId;
  }

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const mealTime = searchParams.get("mealTime") || "";
  const priceRange = searchParams.get("priceRange") || "";
  const availableOnly = searchParams.get("available") === "true";

  try {
    let query = supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (search) {
      query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (mealTime) {
      query = query.contains("meal_times", [mealTime]);
    }
    if (priceRange) {
      query = query.eq("price_range", priceRange);
    }
    if (availableOnly) {
      query = query.eq("available", true);
    }

    const { data: items, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: items || [] });
  } catch (err) {
    console.error("[GET /api/menu]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/menu ───────────────────────────────────────────────────────────

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

  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const { data: newItem, error } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id: session.restaurantId,
        name: parsed.data.name,
        category: parsed.data.category,
        price: parsed.data.price,
        description: parsed.data.description || null,
        image: parsed.data.image || null,
        meal_times: parsed.data.mealTimes || [],
        price_range: parsed.data.priceRange || "$",
        available: parsed.data.available ?? true,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Menu item created", id: newItem.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/menu]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
