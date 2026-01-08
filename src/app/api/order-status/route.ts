import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "../_utils/supabaseClient";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) {
    throw new Error("Missing/invalid STRIPE_SECRET_KEY");
  }
  return new Stripe(key, { apiVersion: "2025-12-15.clover" });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Fetch order from Supabase
    let orderData = null;
    if (supabase && session.metadata?.orderId) {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", session.metadata.orderId)
        .single();
      
      orderData = data;
    }

    return NextResponse.json({
      id: orderData?.id || session.id,
      customer_email: session.customer_email || orderData?.customer_email,
      customer_name: orderData?.customer_name,
      plan_id: session.metadata?.planId || orderData?.plan_id,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
      fitness_goal: orderData?.fitness_goal,
      fitness_level: orderData?.fitness_level,
    });
  } catch (err: any) {
    console.error("Order status error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}
