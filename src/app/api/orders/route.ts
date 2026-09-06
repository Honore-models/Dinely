import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validators";
import { createPayment, env } from "@/lib/jjuma";
import { isJjumaConfigured } from "@/lib/jjuma-env";
import { createPaymentRecord } from "@/lib/payments";
import {
  DELIVERY_FEE_USD,
  PAYMENT_CURRENCY,
  SERVICE_FEE_USD,
  usdToRwf,
} from "@/lib/pricing";

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
      // Don't show kitchen unfinished online checkouts.
      query = query.neq("payment_status", "awaiting_payment");
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

  const {
    restaurantId,
    items,
    type,
    deliveryAddress,
    notes,
    paymentMethod,
  } = parsed.data;

  try {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, name, subscription_status")
      .eq("id", restaurantId)
      .single();

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // Price items from the menu DB — never trust browser prices.
    const menuIds = [...new Set(items.map((i) => i.menuItemId))];
    const { data: menuRows, error: menuError } = await supabase
      .from("menu_items")
      .select("id, name, price, available, restaurant_id")
      .in("id", menuIds)
      .eq("restaurant_id", restaurantId);

    if (menuError) throw menuError;

    const menuById = new Map((menuRows ?? []).map((m) => [m.id, m]));
    const pricedItems: {
      menuItemId: string;
      name: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const menu = menuById.get(item.menuItemId);
      if (!menu) {
        return NextResponse.json(
          { error: `Menu item not found: ${item.name}` },
          { status: 400 },
        );
      }
      if (menu.available === false) {
        return NextResponse.json(
          { error: `${menu.name} is currently unavailable.` },
          { status: 409 },
        );
      }
      pricedItems.push({
        menuItemId: menu.id,
        name: menu.name,
        price: Number(menu.price),
        quantity: item.quantity,
      });
    }

    const subtotal =
      Math.round(
        pricedItems.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100,
      ) / 100;
    const deliveryFee = type === "Delivery" ? DELIVERY_FEE_USD : 0;
    const serviceFee = SERVICE_FEE_USD;
    const total =
      Math.round((subtotal + deliveryFee + serviceFee) * 100) / 100;

    const { data: user } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", session.userId)
      .single();

    const customerName = user
      ? `${user.first_name} ${user.last_name}`
      : "Guest";

    if (paymentMethod === "jjuma" && !isJjumaConfigured()) {
      return NextResponse.json(
        {
          error:
            "Online payments are temporarily unavailable. Choose cash on delivery or try again later.",
        },
        { status: 503 },
      );
    }

    const paymentStatus =
      paymentMethod === "jjuma" ? "awaiting_payment" : "unpaid";

    const { data: newOrder, error } = await supabase
      .from("orders")
      .insert({
        restaurant_id: restaurantId,
        customer_id: session.userId,
        customer_name: customerName,
        items: pricedItems,
        type,
        status: "Pending",
        subtotal,
        delivery_fee: deliveryFee,
        service_fee: serviceFee,
        total,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        delivery_address: deliveryAddress || null,
        notes: notes || null,
      })
      .select("id")
      .single();

    if (error) throw error;

    if (paymentMethod === "cash") {
      return NextResponse.json(
        { message: "Order placed", orderId: newOrder.id },
        { status: 201 },
      );
    }

    // Online (JJuma) checkout
    const amountRwf = usdToRwf(total);
    const idempotencyKey = `order-${newOrder.id}`;
    const { payment, alreadyPaid } = await createPaymentRecord({
      kind: "order",
      referenceId: newOrder.id,
      userId: session.userId,
      amount: amountRwf,
      currency: PAYMENT_CURRENCY,
      idempotencyKey,
      description: `Order ${newOrder.id.slice(0, 8)} — ${restaurant.name}`,
    });

    if (alreadyPaid) {
      return NextResponse.json(
        { message: "Order already paid", orderId: newOrder.id },
        { status: 200 },
      );
    }

    const appUrl = env.APP_URL.replace(/\/$/, "");
    const result = await createPayment({
      amount: String(amountRwf),
      currency: PAYMENT_CURRENCY,
      description: `Dinely order — ${restaurant.name}`,
      redirect_url: `${appUrl}/payment/success?kind=order&orderId=${encodeURIComponent(newOrder.id)}&paymentId=${encodeURIComponent(payment.id)}`,
      cancel_redirect_url: `${appUrl}/payment/cancelled?kind=order&orderId=${encodeURIComponent(newOrder.id)}&paymentId=${encodeURIComponent(payment.id)}`,
      webhook_url: `${appUrl}/api/payments/webhook`,
      external_order_id: payment.id,
      idempotency_key: idempotencyKey,
    });

    const paymentUrl = result.data?.payment_url ?? result.payment_url ?? "";
    if (!paymentUrl) {
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", newOrder.id);

      return NextResponse.json(
        { error: "Could not start checkout. Please try again." },
        { status: 502 },
      );
    }

    const checkoutHost = new URL(paymentUrl).host;
    if (checkoutHost !== env.JJUMA_CHECKOUT_HOST) {
      return NextResponse.json(
        { error: "Untrusted checkout destination." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        message: "Checkout ready",
        orderId: newOrder.id,
        checkoutUrl: paymentUrl,
        paymentId: payment.id,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
