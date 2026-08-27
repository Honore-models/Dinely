import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { restaurantSchema } from "@/lib/validators";

// ─── GET /api/restaurants ─────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine");

    // Owner: return their own restaurant
    if (session?.role === "owner" && mine === "true") {
      if (!session.restaurantId) {
        return NextResponse.json({ data: null }, { status: 200 });
      }
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", session.restaurantId)
        .single();

      return NextResponse.json({ data: restaurant || null });
    }

    // Public: list all restaurants with optional search/filter
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const rating = searchParams.get("rating")
      ? parseFloat(searchParams.get("rating")!)
      : null;

    let query = supabase
      .from("restaurants")
      .select("*")
      .order("rating", { ascending: false })
      .order("name", { ascending: true });

    if (search) {
      // Supabase ilike with OR
      query = query.or(
        `name.ilike.%${search}%,type.ilike.%${search}%,description.ilike.%${search}%`,
      );
    }
    if (category) {
      query = query.ilike("type", `%${category}%`);
    }
    if (rating !== null) {
      query = query.gte("rating", rating);
    }

    const { data: restaurants, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: restaurants || [] });
  } catch (err) {
    console.error("[GET /api/restaurants]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/restaurants ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
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

  const parsed = restaurantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    // Check if owner already has a restaurant
    const { data: existing } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", session.userId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "You already have a restaurant. Use PATCH to update it." },
        { status: 409 },
      );
    }

    const b = body as Record<string, unknown>;
    const { data: newRestaurant, error: insertError } = await supabase
      .from("restaurants")
      .insert({
        owner_id: session.userId,
        name: parsed.data.name,
        type: parsed.data.type,
        address: parsed.data.address,
        opening_hours: parsed.data.openingHours,
        phone: parsed.data.phone,
        email: parsed.data.email,
        logo: parsed.data.logo || null,
        description: parsed.data.description || null,
        plan: (b.plan as string) || "Professional",
        billing_cycle: (b.billingCycle as string) || "monthly",
        subscription_status: "trialing",
        website: parsed.data.website || null,
        capacity: parsed.data.capacity || null,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // Link restaurant to owner user
    await supabase
      .from("users")
      .update({
        restaurant_id: newRestaurant.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.userId);

    return NextResponse.json(
      { message: "Restaurant created", restaurantId: newRestaurant.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/restaurants]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
