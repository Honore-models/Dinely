import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { updateOrderStatusSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (session.role === "owner" && order.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.role === "customer" && order.customer_id !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: order });
  } catch (err) {
    console.error("[GET /api/orders/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (session.role === "owner") {
      if (order.restaurant_id !== session.restaurantId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Require online payment before kitchen starts the order.
      if (
        parsed.data.status === "Active" &&
        order.payment_method === "jjuma" &&
        order.payment_status !== "paid"
      ) {
        return NextResponse.json(
          { error: "Online payment is still pending for this order." },
          { status: 409 },
        );
      }
    } else {
      if (order.customer_id !== session.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (parsed.data.status !== "Cancelled") {
        return NextResponse.json(
          { error: "Customers can only cancel orders" },
          { status: 403 },
        );
      }
      if (order.status !== "Pending") {
        return NextResponse.json(
          { error: "Only pending orders can be cancelled" },
          { status: 409 },
        );
      }
    }

    const updates: Record<string, string> = {
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    };

    // Cash / COD: mark paid when the restaurant completes the order.
    if (
      parsed.data.status === "Completed" &&
      order.payment_method === "cash" &&
      order.payment_status !== "paid"
    ) {
      updates.payment_status = "paid";
      updates.paid_at = new Date().toISOString();
    }

    if (parsed.data.status === "Cancelled") {
      if (
        order.payment_status === "awaiting_payment" ||
        order.payment_status === "unpaid"
      ) {
        updates.payment_status = "cancelled";
      }
    }

    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Order updated" });
  } catch (err) {
    console.error("[PATCH /api/orders/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
