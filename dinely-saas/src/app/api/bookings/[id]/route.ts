import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const updateBookingSchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Cancelled", "Completed"]).optional(),
  tableId: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (session.role === "owner" && booking.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.role === "customer" && booking.customer_id !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: booking });
  } catch (err) {
    console.error("[GET /api/bookings/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (session.role === "owner" && booking.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.role === "customer") {
      if (booking.customer_id !== session.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (parsed.data.status && parsed.data.status !== "Cancelled") {
        return NextResponse.json(
          { error: "Customers can only cancel bookings" },
          { status: 403 },
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.status) updateData.status = parsed.data.status;
    if (parsed.data.tableId !== undefined) updateData.table_id = parsed.data.tableId;
    if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;

    const { error } = await supabase
      .from("bookings")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Booking updated" });
  } catch (err) {
    console.error("[PATCH /api/bookings/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
