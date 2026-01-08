import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "../../_utils/supabaseClient";

export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) {
    throw new Error("Missing/invalid STRIPE_SECRET_KEY");
  }
  return new Stripe(key, {
    apiVersion: "2025-12-15.clover",
  });
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log(`✅ Payment successful for session: ${session.id}`);
        console.log(`   Customer: ${session.customer_email}`);
        console.log(`   Plan: ${session.metadata?.planId}`);
        console.log(`   Amount: $${(session.amount_total || 0) / 100}`);
        
        // Update existing order with payment info if Supabase is configured
        if (supabase) {
          const orderId = session.metadata?.orderId;
          
          if (orderId) {
            // Update the existing order with Stripe payment info
            const { error } = await supabase
              .from("orders")
              .update({
                stripe_session_id: session.id,
                stripe_customer_id: session.customer as string,
                payment_status: session.payment_status,
                amount_total: session.amount_total,
                mode: session.mode,
                updated_at: new Date().toISOString(),
              })
              .eq("id", orderId);

            if (error) {
              console.error("Database update error:", error);
            } else {
              console.log(`   ✓ Order ${orderId} updated with payment info`);
            }
          } else {
            // Fallback: create new order if no orderId in metadata (shouldn't happen)
            const { error } = await supabase.from("orders").insert({
              stripe_session_id: session.id,
              stripe_customer_id: session.customer as string,
              customer_email: session.customer_email || session.metadata?.customerEmail || "",
              customer_name: session.metadata?.customerName || "",
              plan_id: session.metadata?.planId || "",
              notes: session.metadata?.notes || "",
              fitness_goal: session.metadata?.fitnessGoal || "",
              routine_type: session.metadata?.routineType || "",
              fitness_level: session.metadata?.fitnessLevel || "",
              equipment: session.metadata?.equipment || "",
              time_per_workout: session.metadata?.timePerWorkout || "",
              medical_history: session.metadata?.medicalHistory || "",
              amount_total: session.amount_total,
              payment_status: session.payment_status,
              mode: session.mode,
              created_at: new Date().toISOString(),
            });

            if (error) {
              console.error("Database insert error:", error);
            } else {
              console.log("   ✓ New order created");
            }
          }
        } else {
          console.log("   ⚠ Supabase not configured - payment info not saved");
        }
        
        // TODO: Send confirmation email
        // TODO: Trigger plan creation workflow
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log(`✅ Subscription ${event.type}: ${subscription.id}`);
        console.log(`   Status: ${subscription.status}`);
        
        // Store/update subscription in database if Supabase is configured
        if (supabase) {
          const { error } = await supabase.from("subscriptions").upsert({
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          });

          if (error) {
            console.error("Subscription upsert error:", error);
          } else {
            console.log("   ✓ Subscription saved to database");
          }
        } else {
          console.log("   ⚠ Supabase not configured - subscription not saved");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log(`✅ Subscription cancelled: ${subscription.id}`);
        
        // Mark subscription as cancelled in database if Supabase is configured
        if (supabase) {
          const { error } = await supabase
            .from("subscriptions")
            .update({ 
              status: "cancelled",
              cancelled_at: new Date().toISOString() 
            })
            .eq("stripe_subscription_id", subscription.id);

          if (error) {
            console.error("Subscription cancellation error:", error);
          } else {
            console.log("   ✓ Cancellation recorded in database");
          }
        } else {
          console.log("   ⚠ Supabase not configured - cancellation not recorded");
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        
        console.log(`✅ Invoice paid: ${invoice.id}`);
        console.log(`   Amount: $${(invoice.amount_paid || 0) / 100}`);
        console.log(`   Customer: ${invoice.customer_email}`);
        
        // TODO: Trigger monthly plan regeneration for subscriber
        // TODO: Send renewal confirmation email
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        
        console.log(`❌ Invoice payment failed: ${invoice.id}`);
        console.log(`   Customer: ${invoice.customer_email}`);
        console.log(`   Attempt: ${invoice.attempt_count}`);
        
        // TODO: Send payment failure notification
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
