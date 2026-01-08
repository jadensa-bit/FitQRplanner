import { NextResponse } from "next/server";
import { supabase } from "../_utils/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: Request) {
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
  } = body;

  const { error: supabaseError } = await supabase.from('planner_intake').insert([
    {
      customer_name: customerName || '',
      customer_email: customerEmail || '',
      notes: notes || '',
      plan_id: planId || '',
      subscribe: !!subscribe,
      fitness_goal: fitnessGoal || '',
      routine_type: routineType || '',
      fitness_level: fitnessLevel || '',
      equipment: equipment || '',
      time_per_workout: timePerWorkout || '',
      medical_history: medicalHistory || '',
      submitted_at: new Date().toISOString(),
    }
  ]);

  if (supabaseError) {
    console.error('Supabase insert error:', supabaseError);
    return NextResponse.json({ error: supabaseError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
