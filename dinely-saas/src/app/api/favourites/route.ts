import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { favouriteSchema } from "@/lib/validators";

// ─── GET /api/favourites ──────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: user } = await supabase
      .from("users")
      .select("favourites")
      .eq("id", session.userId)
      .single();

    const favouriteIds: string[] = user?.favourites || [];
    if (favouriteIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const { data: restaurants, error } = await supabase
      .from("restaurants")
      .select("*")
      .in("id", favouriteIds);

    if (error) throw error;

    return NextResponse.json({ data: restaurants || [] });
  } catch (err) {
    console.error("[GET /api/favourites]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/favourites ─────────────────────────────────────────────────────

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

  const parsed = favouriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  const { restaurantId } = parsed.data;

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

    // Get current favourites and add if not already present
    const { data: user } = await supabase
      .from("users")
      .select("favourites")
      .eq("id", session.userId)
      .single();

    const current: string[] = user?.favourites || [];
    if (!current.includes(restaurantId)) {
      current.push(restaurantId);
    }

    await supabase
      .from("users")
      .update({ favourites: current, updated_at: new Date().toISOString() })
      .eq("id", session.userId);

    return NextResponse.json({ message: "Added to favourites" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/favourites]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── DELETE /api/favourites?restaurantId=xxx ──────────────────────────────────

export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    return NextResponse.json({ error: "restaurantId query param required" }, { status: 400 });
  }

  try {
    const { data: user } = await supabase
      .from("users")
      .select("favourites")
      .eq("id", session.userId)
      .single();

    const current: string[] = user?.favourites || [];
    const updated = current.filter((id) => id !== restaurantId);

    await supabase
      .from("users")
      .update({ favourites: updated, updated_at: new Date().toISOString() })
      .eq("id", session.userId);

    return NextResponse.json({ message: "Removed from favourites" });
  } catch (err) {
    console.error("[DELETE /api/favourites]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
