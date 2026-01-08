import Stripe from "stripe";
import { NextResponse } from "next/server";
import { sendIntakeNotification } from "../_utils/sendSms";
import { supabase } from "../_utils/supabaseClient";

export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key || !key.startsWith("sk_")) {
    throw new Error(
      "Missing/invalid STRIPE_SECRET_KEY. Check ~/fitqr/.env.local (must start with sk_test_ or sk_live_)."
    );
  }

  return new Stripe(key, {
    apiVersion: "2025-12-15.clover",
  });
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const body = await req.json();
    const {
      planId,
      customerName,
      customerEmail,
      notes,
      subscribe,
      fitnessGoal,
      routineType,
      fitnessLevel,
      equipment,
      timePerWorkout,
      medicalHistory
    } = body as {
      planId: string;
      customerName?: string;
      customerEmail?: string;
      notes?: string;
      subscribe?: boolean;
      fitnessGoal?: string;
      routineType?: string;
      fitnessLevel?: string;
      equipment?: string;
      timePerWorkout?: string;
      medicalHistory?: string;
    };

    // Support subscription and one-time plans
    let session;
    const origin = req.headers.get("origin") || "http://localhost:3000";
    if (planId === "subscription") {
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: customerEmail || undefined,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              recurring: { interval: "month" },
              unit_amount: 900,
              product_data: {
                name: "FitQR All-in-One Fitness & Meal Subscription",
                description: "Get a new custom plan every month. Cancel anytime.",
              },
            },
          },
        ],
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
        metadata: {
          planId,
          customerName: customerName || "",
          customerEmail: customerEmail || "",
          notes: notes || "",
        },
      });
    } else {
      // One-time purchase
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail || undefined,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: 1200,
              product_data: {
                name: "FitQR Custom Fitness or Meal Plan",
                description: "One-time digital plan delivery",
              },
            },
          },
        ],
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
        metadata: {
          planId,
          customerName: customerName || "",
          customerEmail: customerEmail || "",
          notes: notes || "",
        },
      });
    }

    return NextResponse.json({ url: session.url });
    // Send notification SMS with intake info (non-blocking)
    // Notification logic moved to sendIntakeNotification above. No SMS function remains.
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
