import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "../../../../../lib/db";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// IMPORTANT: This route must NOT have body parsing.
// Add this to your Next.js config or use the raw body trick below.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.arrayBuffer();
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const db = await getDb();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, restaurantId, plan, billingCycle } = session.metadata || {};

        if (restaurantId) {
          await db.collection("restaurants").updateOne(
            { _id: new ObjectId(restaurantId) },
            {
              $set: {
                plan,
                billingCycle,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                subscriptionStatus: "active",
                updatedAt: new Date(),
              },
            }
          );
        }

        if (userId) {
          await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { stripeCustomerId: session.customer, updatedAt: new Date() } }
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await db.collection("restaurants").updateOne(
          { stripeSubscriptionId: sub.id },
          {
            $set: {
              subscriptionStatus: sub.status as string,
              updatedAt: new Date(),
            },
          }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await db.collection("restaurants").updateOne(
          { stripeSubscriptionId: sub.id },
          { $set: { subscriptionStatus: "canceled", updatedAt: new Date() } }
        );
        break;
      }

      default:
        // Unhandled event types – safe to ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Stripe Webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
