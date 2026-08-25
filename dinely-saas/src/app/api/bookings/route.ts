import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validators";

// ─── GET /api/bookings ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  try {
    let query = supabase.from("bookings").select("*");

    if (session.role === "owner") {
      if (!session.restaurantId) return NextResponse.json({ data: [] });
      query = query.eq("restaurant_id", session.restaurantId);
    } else {
      query = query.eq("customer_id", session.userId);
    }

    if (date) query = query.eq("date", date);
    if (status) query = query.eq("status", status);

    const { data: bookings, error } = await query
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: bookings || [] });
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/bookings ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", parsed.data.restaurantId)
      .single();

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("first_name, last_name, email")
      .eq("id", session.userId)
      .single();

    const { data: newBooking, error } = await supabase
      .from("bookings")
      .insert({
        restaurant_id: parsed.data.restaurantId,
        customer_id: session.userId,
        customer_name: user ? `${user.first_name} ${user.last_name}` : "Guest",
        customer_email: user?.email || "",
        table_id: parsed.data.tableId || null,
        date: parsed.data.date,
        time: parsed.data.time,
        party_size: parsed.data.partySize,
        notes: parsed.data.notes || null,
        status: "Pending",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Booking created", bookingId: newBooking.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
