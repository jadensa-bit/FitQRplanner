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

    // Determine pricing based on plan
    const planPricing: Record<string, { amount: number; name: string; description: string }> = {
      subscription: {
        amount: 900, // $9/month
        name: "FitQR All-in-One Fitness & Meal Subscription",
        description: "Get a new custom workout and meal plan every month. Cancel anytime."
      },
      workout: {
        amount: 800, // $8 one-time
        name: "Monthly Workout Planner (One-Time)",
        description: "4-week personalized workout routine - home or gym options"
      },
      meals: {
        amount: 500, // $5 one-time
        name: "Meal Prep Planner (One-Time)",
        description: "7-day meal prep plan with recipes and grocery list"
      }
    };

    const plan = planPricing[planId] || {
      amount: 1200, // Default $12 for all-in-one one-time
      name: "FitQR All-in-One Plan (One-Time)",
      description: "Complete 4-week fitness and meal plan"
    };

    // Save intake data to Supabase immediately
    let orderId = null;
    if (supabase) {
      try {
        console.log("💾 Saving intake data:", {
          customerName,
          customerEmail,
          planId,
          fitnessGoal,
          fitnessLevel,
          equipment,
          timePerWorkout
        });
        
        const { data, error } = await supabase
          .from("orders")
          .insert({
            customer_name: customerName || "",
            customer_email: customerEmail || "",
            plan_id: planId,
            subscribe: subscribe || false,
            routine_type: routineType || "",
            notes: notes || "",
            fitness_goal: fitnessGoal || "",
            fitness_level: fitnessLevel || "",
            equipment: equipment || "",
            time_per_workout: timePerWorkout || "",
            medical_history: medicalHistory || "",
            payment_status: "pending",
          })
          .select()
          .single();

        if (error) {
          console.error("Supabase insert error:", error);
        } else {
          orderId = data?.id;
          console.log("✅ Intake data saved to Supabase:", orderId);
          console.log("   Fitness Level saved:", data?.fitness_level);
        }
      } catch (err) {
        console.error("Error saving to Supabase:", err);
      }
    }

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
              unit_amount: plan.amount,
              product_data: {
                name: plan.name,
                description: plan.description,
              },
            },
          },
        ],
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/#plans`,
        metadata: {
          orderId: orderId || "",
          planId,
          customerName: customerName || "",
          customerEmail: customerEmail || "",
          notes: notes || "",
          fitnessGoal: fitnessGoal || "",
          routineType: routineType || "",
          fitnessLevel: fitnessLevel || "",
          equipment: equipment || "",
          timePerWorkout: timePerWorkout || "",
          medicalHistory: medicalHistory || "",
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
              unit_amount: plan.amount,
              product_data: {
                name: plan.name,
                description: plan.description,
              },
            },
          },
        ],
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/#plans`,
        metadata: {
          orderId: orderId || "",
          planId,
          customerName: customerName || "",
          customerEmail: customerEmail || "",
          notes: notes || "",
          fitnessGoal: fitnessGoal || "",
          routineType: routineType || "",
          fitnessLevel: fitnessLevel || "",
          equipment: equipment || "",
          timePerWorkout: timePerWorkout || "",
          medicalHistory: medicalHistory || "",
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
