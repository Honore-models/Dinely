import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validators";

// ─── GET /api/orders ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase.from("orders").select("*", { count: "exact" });

    if (session.role === "owner") {
      if (!session.restaurantId) {
        return NextResponse.json({ data: [], total: 0 });
      }
      query = query.eq("restaurant_id", session.restaurantId);
    } else {
      query = query.eq("customer_id", session.userId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data: orders, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({
      data: orders || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (err) {
    console.error("[GET /api/orders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  const { restaurantId, items, type, deliveryAddress, notes } = parsed.data;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  try {
    // Verify restaurant exists
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .single();

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // Get customer name
    const { data: user } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", session.userId)
      .single();

    const customerName = user
      ? `${user.first_name} ${user.last_name}`
      : "Guest";

    const { data: newOrder, error } = await supabase
      .from("orders")
      .insert({
        restaurant_id: restaurantId,
        customer_id: session.userId,
        customer_name: customerName,
        items: items,
        type,
        status: "Pending",
        total: Math.round(total * 100) / 100,
        delivery_address: deliveryAddress || null,
        notes: notes || null,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Order placed", orderId: newOrder.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
