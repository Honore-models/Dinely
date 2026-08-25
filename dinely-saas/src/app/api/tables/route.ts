import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { tableSchema } from "@/lib/validators";

// ─── GET /api/tables?restaurantId=xxx ────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    const session = await getSession(req);
    if (!session?.restaurantId) {
      return NextResponse.json({ error: "restaurantId required" }, { status: 400 });
    }
    restaurantId = session.restaurantId;
  }

  try {
    const { data: tables, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("number", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: tables || [] });
  } catch (err) {
    console.error("[GET /api/tables]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/tables ─────────────────────────────────────────────────────────

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

  const parsed = tableSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  try {
    // Prevent duplicate table numbers
    const { data: exists } = await supabase
      .from("restaurant_tables")
      .select("id")
      .eq("restaurant_id", session.restaurantId)
      .eq("number", parsed.data.number)
      .single();

    if (exists) {
      return NextResponse.json(
        { error: `Table #${parsed.data.number} already exists` },
        { status: 409 },
      );
    }

    const { data: newTable, error } = await supabase
      .from("restaurant_tables")
      .insert({
        restaurant_id: session.restaurantId,
        number: parsed.data.number,
        capacity: parsed.data.capacity,
        location: parsed.data.location || null,
        status: parsed.data.status || "available",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Table created", id: newTable.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tables]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
