import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Price IDs — set these in your .env.local after creating products in Stripe dashboard
const PRICE_IDS: Record<string, Record<string, string>> = {
  Starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || "",
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY || "",
  },
  Professional: {
    monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || "",
    yearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY || "",
  },
  Enterprise: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "",
    yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || "",
  },
};

// POST /api/payments – create a Stripe Checkout session
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { plan: string; billingCycle: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { plan, billingCycle } = body;
  const priceId = PRICE_IDS[plan]?.[billingCycle];

  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Invalid plan or billing cycle. Check your Stripe price IDs in .env.local",
      },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.userId) });

    // Create or reuse Stripe customer
    let stripeCustomerId = user?.stripeCustomerId as string | undefined;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        name: user ? `${user.firstName} ${user.lastName}` : undefined,
        metadata: { userId: session.userId },
      });
      stripeCustomerId = customer.id;
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(session.userId) },
          { $set: { stripeCustomerId, updatedAt: new Date() } },
        );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?subscribed=true`,
      cancel_url: `${origin}/onboarding/step-4?cancelled=true`,
      metadata: {
        userId: session.userId,
        restaurantId: session.restaurantId || "",
        plan,
        billingCycle,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[POST /api/payments]", err);
    return NextResponse.json(
      { error: "Payment setup failed" },
      { status: 500 },
    );
  }
}
