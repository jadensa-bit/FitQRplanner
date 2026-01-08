"use client";

import { useMemo, useState } from "react";

// ...existing code...

type PlanId = "subscription" | "workout" | "meals";

const PLANS = [
  {
    id: "subscription" as PlanId,
    title: "All-in-One Fitness & Meal Subscription",
    tag: "Best value",
    desc: "Get a new 4-week workout routine and meal prep plan every month—personalized for your goals, schedule, and preferences. One subscription, everything you need.",
    includes: [
      "4-week step-by-step workout routine",
      "Personalized meal prep plan",
      "Home or gym options",
      "Habit tracker & progress check-ins",
      "Bonus: grocery shopping checklist",
      "Ongoing adjustments with subscription"
    ],
    price: 12,
    subscription: {
      price: 9,
      desc: "Subscribe & save: Get a new custom workout and meal plan every month, updated to your progress and goals. Cancel anytime."
    }
  },
  {
    id: "workout" as PlanId,
    title: "Monthly Workout Planner (One-Time)",
    tag: "Just workouts",
    desc: "A fully personalized 4-week workout routine for home or gym. One-time purchase, no subscription required.",
    includes: [
      "4-week step-by-step workout routine",
      "Home or gym options",
      "Habit tracker & progress check-ins"
    ],
    price: 8
  },
  {
    id: "meals" as PlanId,
    title: "Meal Prep Planner (One-Time)",
    tag: "Just meals",
    desc: "A week of healthy, affordable meal ideas with quick recipes and a simple grocery list. One-time purchase, no subscription required.",
    includes: [
      "7-day meal prep plan",
      "Cheap, easy-to-find ingredients",
      "Meals ready in 20 minutes or less",
      "Bonus: grocery shopping checklist"
    ],
    price: 5
  }
];


export default function Page() {
                const [fitnessGoal, setFitnessGoal] = useState("");
                const [fitnessLevel, setFitnessLevel] = useState("");
                const [equipment, setEquipment] = useState("");
                const [timePerWorkout, setTimePerWorkout] = useState("");
                const [medicalHistory, setMedicalHistory] = useState("");
              // Timer state: one timer per checklist step per day
              const [timers, setTimers] = useState(Array(7).fill(null).map((_, dayIdx) => Array(10).fill(0)));
              // Track which timers are running
              const [timerActive, setTimerActive] = useState(Array(7).fill(null).map((_, dayIdx) => Array(10).fill(false)));
            // For interactive workout checklist: track checked state for each exercise per day
            const [checkedExercises, setCheckedExercises] = useState(Array(7).fill(null).map((_, i) => Array((i === 2 ? 3 : 5)).fill(false)));
          const coachQA = [
            {
              q: "How do I stay motivated?",
              a: "Set small, achievable goals and celebrate your progress every week!"
            },
            {
              q: "What if I miss a day?",
              a: "No worries! Just pick up where you left off. Consistency is what matters most."
            },
            {
              q: "How do I make healthy eating easier?",
              a: "Prep meals in advance and keep healthy snacks on hand. Simplicity wins!"
            },
            {
              q: "Can I do these workouts as a beginner?",
              a: "Absolutely! Every plan is tailored to your level and can be adjusted as you grow."
            }
          ];
        const quickTips = [
          "Bonus: Prep your meals in advance to save time!",
          "Tip: Use a water bottle with measurements to track hydration.",
          "Recovery: Take 5 minutes to stretch after every workout.",
          "Nutrition: Add a source of protein to every meal.",
          "Sleep: Try to keep a consistent bedtime for better recovery.",
          "Motivation: Celebrate small wins every day!"
        ];
      const weeklyCheckIns = [
        "How did you feel about your progress this week?",
        "What was your biggest win?",
        "What challenged you most?",
        "What will you focus on next week?"
      ];
      const miniChallenges = [
        "No sugar today!",
        "Try a new veggie.",
        "Add 5 extra push-ups.",
        "Drink only water today.",
        "Stretch for 10 minutes.",
        "Go for a 20-min walk.",
        "Sleep 8 hours tonight."
      ];
    const [showConfetti, setShowConfetti] = useState(false);
    const dailyTips = [
      "Pro Tip: Drink a glass of water first thing in the morning!",
      "Motivation: Small steps every day add up to big results.",
      "Nutrition: Add a veggie to every meal for more energy.",
      "Recovery: Quality sleep is just as important as your workout.",
      "Mindset: Progress, not perfection!",
      "Challenge: Try a new healthy recipe this week.",
      "Reminder: Consistency beats intensity."
    ];
  const [selected, setSelected] = useState<PlanId>("subscription");
  const [routineType, setRoutineType] = useState<"home" | "gym">("home");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
    const [subscribe, setSubscribe] = useState(false);
  const [demoDay, setDemoDay] = useState(1);
  const [tab, setTab] = useState<'workout' | 'meals'>('workout');
  const [completed, setCompleted] = useState([false, false, false]);
  // Streak state: counts consecutive days completed
  const [streak, setStreak] = useState(0);

  const chosen = useMemo(
    () => PLANS.find((p) => p.id === selected),
    [selected]
  );

  // simple validation for a more legit checkout flow
  const canCheckout = customerEmail.includes("@") && customerEmail.includes(".");

  async function handleCheckout() {
    try {
      // Use subscription plan if checked, else use one-time plan
      const planId = subscribe ? "subscription" : selected;
      const totalPrice = subscribe ? 9 : 12;

      // Save all form data to localStorage for use on success page
      const intakeData = {
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
      };
      window.localStorage.setItem("fitqr_intake", JSON.stringify(intakeData));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          customerName,
          customerEmail,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");

      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      alert(e?.message || "Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-stone-800">
      {/* Limited-Time Offer Banner */}
      <div className="w-full bg-gradient-to-r from-pink-500 via-yellow-400 to-orange-400 text-white py-3 px-4 flex items-center justify-center font-bold text-lg shadow animate-fade-in rounded-b-2xl mb-6">
        <span className="mr-2">⏰</span>
        <span>New Year Special: Get your first plan for <span className="line-through text-white/70">$18</span> <span className="bg-white text-pink-600 px-2 py-1 rounded ml-1">$12</span> or subscribe for <span className="line-through text-white/70">$14/mo</span> <span className="bg-white text-pink-600 px-2 py-1 rounded ml-1">$9/mo</span>! Limited time only.</span>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-stone-200 overflow-hidden">
        {/* INTRO HERO SECTION */}
        <section className="relative text-center py-16 mb-10 bg-gradient-to-br from-red-50 via-stone-50 to-rose-100 border-b border-stone-100 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-200/30 via-transparent to-transparent"></div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-red-900 drop-shadow-lg">
            Transform Your Fitness & Meals—<br className="hidden md:inline" /> All in One Place
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-stone-800 mb-6 font-semibold">
            Get a new 4-week workout routine <span className="text-red-700 font-bold">and</span> meal prep plan every month—customized for <span className="text-red-700 font-bold">your</span> goals, schedule, and lifestyle.
          </p>
          <p className="max-w-xl mx-auto text-base text-stone-600 mb-4">No equipment needed. Cancel anytime. Created by an Exercise Science senior for real people who want real results.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="#plans" className="px-8 py-4 rounded-full font-bold text-lg bg-red-900 text-white hover:bg-red-950 transition shadow-lg">See Plans</a>
            <a href="#demo" className="px-8 py-4 rounded-full font-bold text-lg bg-white border border-red-900 text-red-900 hover:bg-red-50 transition shadow">View Demo</a>
          </div>
        </section>
        {/* TESTIMONIALS CAROUSEL & URGENCY SECTION */}
        <section className="mb-12">
          {/* Testimonials Carousel */}
          <div className="mb-8">
            <div className="font-bold text-2xl text-center text-stone-800 mb-2">What Our Users Say</div>
            <div className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in mb-4">
              <div className="text-lg italic text-stone-700 mb-2">“I never thought I could stick to a routine until I tried this planner. The checklists and rewards kept me motivated all week!”</div>
              <div className="flex items-center gap-2">
                <img src="/avatar1.png" alt="User" className="w-8 h-8 rounded-full border-2 border-pink-400" />
                <span className="font-bold text-pink-700">Maya R.</span>
                <span className="text-xs text-stone-400">@mayafit</span>
              </div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in mb-4">
              <div className="text-lg italic text-stone-700 mb-2">“The meal ideas and grocery list made healthy eating so much easier. I lost 4 lbs in my first month!”</div>
              <div className="flex items-center gap-2">
                <img src="/avatar2.png" alt="User" className="w-8 h-8 rounded-full border-2 border-green-400" />
                <span className="font-bold text-green-700">Chris D.</span>
                <span className="text-xs text-stone-400">@chrisgoals</span>
              </div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in">
              <div className="text-lg italic text-stone-700 mb-2">“I love the community leaderboard and the support button. It feels like I have a coach in my pocket!”</div>
              <div className="flex items-center gap-2">
                <img src="/avatar3.png" alt="User" className="w-8 h-8 rounded-full border-2 border-blue-400" />
                <span className="font-bold text-blue-700">Taylor S.</span>
                <span className="text-xs text-stone-400">@taylorfit</span>
              </div>
            </div>
          </div>
          {/* Urgency/Why Now Section */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-display text-xl font-bold mb-2 text-red-900">Why start now?</h2>
            <ul className="list-disc list-inside text-stone-700 mb-2">
              <li>Get your personalized booklet delivered fast — start tonight!</li>
              <li>Special launch pricing: save more, get more value</li>
              <li>Build healthy habits before the new year rush</li>
            </ul>
            <p className="text-sm text-stone-700 font-semibold mt-2">Don’t wait — your future self will thank you!</p>
          </div>
        </section>
        {/* MONEY-BACK GUARANTEE SECTION */}
        <section className="max-w-xl mx-auto mb-8 px-4">
          <div className="bg-gradient-to-r from-green-200 via-green-50 to-white border border-green-300 rounded-2xl shadow-lg p-6 flex items-center gap-4 animate-fade-in">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.293a1 1 0 00-1.414 0L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" /></svg>
            <div>
              <div className="font-bold text-green-900 text-lg mb-1">30-Day Money-Back Guarantee</div>
              <div className="text-green-800 text-sm">Try the planner risk-free. If you’re not 100% satisfied, get a full refund—no questions asked.</div>
            </div>
          </div>
        </section>
        {/* ...existing code... */}
        {/* Top banner */}
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-900 px-8 py-5 text-stone-100">
          <p className="text-sm text-stone-200">
            Unlock your best self with a plan you’ll actually use — built by an Exercise Science senior, delivered fast, and designed for real life.
          </p>
          <h2 className="font-display text-xl font-semibold">
            Start your fitness journey tonight — no equipment needed, just motivation.
          </h2>
        </div>

        <div className="p-8 md:p-12">
          {/* SAMPLE PREVIEW SECTION */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold mb-4 text-stone-900">See a Sample</h2>
            <p className="text-stone-700 mb-4">
              <span className="font-semibold text-red-900">Every FitQR planner is 100% custom.</span> You’ll get a complete, step-by-step routine built just for you—based on your goals, schedule, and what you share in the chat box. I personally create your plan so you can follow it and get the results you want.
            </p>
                      {/* CUSTOMIZATION OPTIONS SECTION */}
                      <section className="mb-12">
                        <h2 className="font-display text-xl font-bold mb-3 text-stone-900">What can your plan focus on?</h2>
                        <p className="text-stone-700 mb-4">When you order, you can request any of these (or combine them):</p>
                        <div className="flex flex-wrap gap-3 mb-2">
                          <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">Get more toned</span>
                          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">Slim down a little</span>
                          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">Hit a new PR (weightlifting)</span>
                          <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">Beat your fastest mile</span>
                          <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">Build healthy habits</span>
                          <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold">Feel more confident</span>
                          <span className="bg-stone-100 text-stone-800 px-4 py-2 rounded-full text-sm font-semibold">Other: You tell me!</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-2">Your plan is built around <span className="font-semibold">your</span> goals, schedule, and preferences—no generic templates, ever.</p>
                      </section>
            <div className="flex flex-col items-center justify-center mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Planner Demo</h3>
              <div className="w-[260px] h-[520px] bg-gradient-to-br from-stone-900 via-black to-red-900 rounded-[2.5rem] shadow-2xl border-4 border-red-400 flex flex-col items-center overflow-hidden relative animate-pulse-slow">
                {/* Phone notch + camera */}
                <div className="w-20 h-2 bg-stone-300 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10"></div>
                <div className="w-4 h-4 bg-stone-700 rounded-full absolute top-2 left-1/2 -translate-x-1/2 border-2 border-stone-900 z-20"></div>
                {/* Animated callout badge */}
                <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow animate-bounce z-30">
                  LIVE DEMO
                </div>
                {/* Interactive demo - enhanced, with state passed from top-level, and scrollable */}
                <div className="flex flex-col h-full w-full overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent py-2">
                                                      {/* Confetti animation overlay */}
                                                      {showConfetti && (
                                                        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
                                                          <svg width="200" height="200" viewBox="0 0 200 200" className="animate-fadeout">
                                                            <g>
                                                              <circle cx="50" cy="50" r="8" fill="#fbbf24"/>
                                                              <circle cx="150" cy="60" r="7" fill="#f87171"/>
                                                              <circle cx="100" cy="120" r="10" fill="#34d399"/>
                                                              <circle cx="70" cy="160" r="6" fill="#60a5fa"/>
                                                              <circle cx="160" cy="140" r="5" fill="#a78bfa"/>
                                                            </g>
                                                          </svg>
                                                        </div>
                                                      )}
                                    {/* Streak badge at the top */}
                                                      {/* Visual progress tracker (calendar/week view) */}
                                                      <div className="flex justify-center gap-1 mb-2">
                                                        {[0,1,2].map((i) => (
                                                          <div key={i} className={`w-8 h-8 flex flex-col items-center justify-center rounded-xl border-2 ${completed[i] ? 'bg-green-200 border-green-500' : 'bg-stone-100 border-stone-300'}`}>
                                                            <span className="text-xs font-bold">Day {i+1}</span>
                                                            <span className={`text-lg ${completed[i] ? 'text-green-600' : 'text-stone-400'}`}>{completed[i] ? '✔' : '—'}</span>
                                                          </div>
                                                        ))}
                                                      </div>
                                    <div className="flex justify-center items-center mb-2">
                                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-bold text-xs shadow ${streak > 0 ? 'bg-green-100 text-green-800 animate-bounce' : 'bg-stone-200 text-stone-500'}`}>
                                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" /></svg>
                                        {streak > 0 ? `Streak: ${streak} day${streak > 1 ? 's' : ''}!` : 'No streak yet'}
                                      </div>
                                    </div>
                  {(() => {
                    const demoDays = [
                      {
                        label: "Day 1",
                        title: "Full Body Strength (Home)",
                        details: [
                          { step: "Warm-Up: 3 min March in Place", type: "exercise", duration: 180 },
                          { step: "Dynamic Stretch: Arm Circles (30 sec)", type: "exercise", duration: 30 },
                          { step: "Dynamic Stretch: Leg Swings (30 sec)", type: "exercise", duration: 30 },
                          { step: "Circuit 1: Repeat 3x", type: "info" },
                          { step: "15 Bodyweight Squats", type: "exercise" },
                          { step: "12 Push-ups (knee or full)", type: "exercise" },
                          { step: "15 Glute Bridges", type: "exercise" },
                          { step: "30-sec Plank", type: "exercise", duration: 30 },
                          { step: "Rest 60 sec", type: "rest", duration: 60 },
                          { step: "Circuit 2: Repeat 2x", type: "info" },
                          { step: "12 Reverse Lunges (each leg)", type: "exercise" },
                          { step: "10 Tricep Dips (chair)", type: "exercise" },
                          { step: "20 Mountain Climbers", type: "exercise" },
                          { step: "Rest 60 sec", type: "rest", duration: 60 },
                          { step: "Cool-Down: 3 min Stretch (hamstrings, quads, chest, shoulders)", type: "exercise", duration: 180 }
                        ],
                        meals: [
                          {
                            name: "Breakfast: Greek yogurt + berries",
                            recipe: {
                              ingredients: ["1 cup Greek yogurt", "1/2 cup mixed berries", "1 tbsp honey (optional)"],
                              steps: ["Spoon yogurt into a bowl.", "Top with berries and drizzle with honey."]
                            }
                          },
                          {
                            name: "Lunch: Turkey wrap + veggies",
                            recipe: {
                              ingredients: ["1 whole wheat wrap", "3 oz sliced turkey", "Lettuce, tomato, cucumber", "1 tbsp hummus"],
                              steps: ["Spread hummus on wrap.", "Add turkey and veggies.", "Roll up and slice."]
                            }
                          },
                          {
                            name: "Dinner: Grilled chicken + rice + broccoli",
                            recipe: {
                              ingredients: ["1 chicken breast", "1 cup cooked rice", "1 cup steamed broccoli", "Olive oil, salt, pepper"],
                              steps: ["Grill chicken with olive oil, salt, and pepper.", "Serve with rice and broccoli."]
                            }
                          }
                        ],
                        quote: "You don’t have to be extreme, just consistent."
                      },
                      {
                        label: "Day 2",
                        title: "Cardio & Core",
                        details: [
                          { step: "Warm-Up: 2 min High Knees", type: "exercise", duration: 120 },
                          { step: "Dynamic Stretch: Torso Twists (30 sec)", type: "exercise", duration: 30 },
                          { step: "Main Set: Repeat 3x", type: "info" },
                          { step: "2 min Jog in Place", type: "exercise", duration: 120 },
                          { step: "20 Mountain Climbers", type: "exercise" },
                          { step: "15 Crunches", type: "exercise" },
                          { step: "20 Russian Twists", type: "exercise" },
                          { step: "Rest 60 sec", type: "rest", duration: 60 },
                          { step: "Bonus: 1 min Plank Hold", type: "exercise", duration: 60 },
                          { step: "Cool-Down: 3 min Stretch (abs, back, hips)", type: "exercise", duration: 180 }
                        ],
                        meals: [
                          {
                            name: "Breakfast: Oatmeal + banana",
                            recipe: {
                              ingredients: ["1/2 cup oats", "1 cup milk or water", "1 banana, sliced", "1 tsp cinnamon"],
                              steps: ["Cook oats with milk/water.", "Top with banana and cinnamon."]
                            }
                          },
                          {
                            name: "Lunch: Chicken salad",
                            recipe: {
                              ingredients: ["2 cups mixed greens", "1/2 cup cooked chicken", "Cherry tomatoes", "Cucumber", "1 tbsp vinaigrette"],
                              steps: ["Toss greens, chicken, and veggies.", "Drizzle with vinaigrette."]
                            }
                          },
                          {
                            name: "Dinner: Salmon + sweet potato + green beans",
                            recipe: {
                              ingredients: ["1 salmon fillet", "1 small sweet potato", "1 cup green beans", "Olive oil, salt, pepper"],
                              steps: ["Bake salmon and sweet potato.", "Steam green beans.", "Serve together."]
                            }
                          }
                        ],
                        quote: "Progress, not perfection."
                      },
                      {
                        label: "Day 3",
                        title: "Active Recovery & Mobility",
                        details: [
                          { step: "Gentle Yoga Flow (10 min)", type: "exercise", duration: 600 },
                          { step: "Foam Rolling: Quads, Hamstrings, Back (5 min)", type: "exercise", duration: 300 },
                          { step: "Stretch: Hold each for 30 sec (hamstrings, quads, chest, shoulders, calves)", type: "exercise", duration: 180 },
                          { step: "Breathing: 2 min deep breathing/relaxation", type: "exercise", duration: 120 },
                          { step: "Hydrate and reflect on progress", type: "info" }
                        ],
                        meals: [
                          {
                            name: "Breakfast: Avocado toast",
                            recipe: {
                              ingredients: ["1 slice whole grain bread", "1/2 avocado", "Salt, pepper, chili flakes"],
                              steps: ["Toast bread.", "Mash avocado on top.", "Season to taste."]
                            }
                          },
                          {
                            name: "Lunch: Tuna bowl",
                            recipe: {
                              ingredients: ["1 pouch tuna", "1 cup cooked rice", "Cucumber, carrot, edamame", "Soy sauce"],
                              steps: ["Mix tuna with veggies.", "Serve over rice.", "Drizzle with soy sauce."]
                            }
                          },
                          {
                            name: "Dinner: Veggie stir-fry + tofu",
                            recipe: {
                              ingredients: ["1 cup mixed veggies", "1/2 block tofu", "Soy sauce, garlic, ginger"],
                              steps: ["Stir-fry tofu and veggies.", "Add sauce and cook until hot."]
                            }
                          }
                        ],
                        quote: "Rest is part of the process."
                      },
                      {
                        label: "Day 4",
                        title: "Upper Body Strength",
                        details: [
                          { step: "Warm-Up: Arm Circles (1 min)", type: "exercise", duration: 60 },
                          { step: "Dynamic Stretch: Shoulder Rolls (30 sec)", type: "exercise", duration: 30 },
                          { step: "Main Set: Repeat 3x", type: "info" },
                          { step: "12 Push-ups (knee or full)", type: "exercise" },
                          { step: "10 Tricep Dips (chair)", type: "exercise" },
                          { step: "15 Shoulder Taps", type: "exercise" },
                          { step: "20-sec Side Plank (each side)", type: "exercise", duration: 20 },
                          { step: "Rest 60 sec", type: "rest", duration: 60 },
                          { step: "Bonus: 10 Pike Push-ups", type: "exercise" },
                          { step: "Cool-Down: 3 min Stretch (arms, chest, back)", type: "exercise", duration: 180 }
                        ],
                        meals: [
                          {
                            name: "Breakfast: Scrambled eggs + spinach",
                            recipe: {
                              ingredients: ["2 eggs", "1 cup spinach", "Salt, pepper"],
                              steps: ["Scramble eggs with spinach.", "Season to taste."]
                            }
                          },
                          {
                            name: "Lunch: Turkey & cheese sandwich",
                            recipe: {
                              ingredients: ["2 slices whole grain bread", "3 oz turkey", "1 slice cheese", "Lettuce, tomato"],
                              steps: ["Assemble sandwich with all ingredients."]
                            }
                          },
                          {
                            name: "Dinner: Shrimp tacos + slaw",
                            recipe: {
                              ingredients: ["3 corn tortillas", "6 shrimp, cooked", "1 cup slaw mix", "Salsa"],
                              steps: ["Fill tortillas with shrimp and slaw.", "Top with salsa."]
                            }
                          }
                        ],
                        quote: "Strength comes from consistency."
                      },
                      {
                        label: "Day 5",
                        title: "Lower Body Burn",
                        details: [
                          { step: "Warm-Up: 2 min March in Place", type: "exercise", duration: 120 },
                          { step: "Dynamic Stretch: Hip Circles (30 sec)", type: "exercise", duration: 30 },
                          { step: "Main Set: Repeat 3x", type: "info" },
                          { step: "20 Walking Lunges (total)", type: "exercise" },
                          { step: "15 Glute Bridges", type: "exercise" },
                          { step: "20 Calf Raises", type: "exercise" },
                          { step: "30-sec Wall Sit", type: "exercise", duration: 30 },
                          { step: "Rest 60 sec", type: "rest", duration: 60 },
                          { step: "Bonus: 10 Single-Leg Deadlifts (each leg)", type: "exercise" },
                          { step: "Cool-Down: 3 min Stretch (quads, hamstrings, calves)", type: "exercise", duration: 180 }
                        ],
                        meals: [
                          {
                            name: "Breakfast: Cottage cheese + pineapple",
                            recipe: {
                              ingredients: ["1 cup cottage cheese", "1/2 cup pineapple chunks"],
                              steps: ["Mix together and enjoy."]
                            }
                          },
                          {
                            name: "Lunch: Chicken & veggie wrap",
                            recipe: {
                              ingredients: ["1 whole wheat wrap", "1/2 cup cooked chicken", "Lettuce, tomato, cucumber", "1 tbsp ranch"],
                              steps: ["Fill wrap with chicken and veggies.", "Drizzle with ranch and roll up."]
                            }
                          },
                          {
                            name: "Dinner: Beef & broccoli stir-fry",
                            recipe: {
                              ingredients: ["4 oz beef strips", "1 cup broccoli", "Soy sauce, garlic"],
                              steps: ["Stir-fry beef and broccoli.", "Add sauce and cook until done."]
                            }
                          }
                        ],
                        quote: "Push yourself, but listen to your body."
                      },
                      {
                        label: "Day 6",
                        title: "HIIT & Core",
                        details: [
                          { step: "Warm-Up: 2 min Jump Rope or March in Place", type: "exercise", duration: 120 },
                          { step: "Dynamic Stretch: Side Lunges (30 sec)", type: "exercise", duration: 30 },
                          { step: "HIIT Circuit: Repeat 4x", type: "info" },
                          { step: "30-sec High Knees", type: "exercise", duration: 30 },
                          { step: "20 Jump Squats", type: "exercise" },
                          { step: "15 Bicycle Crunches", type: "exercise" },
                          { step: "20-sec Plank Hold", type: "exercise", duration: 20 },
                          { step: "Rest 60 sec", type: "rest", duration: 60 },
                          { step: "Bonus: 1 min Burpees (as many as possible)", type: "exercise", duration: 60 },
                          { step: "Cool-Down: 3 min Stretch (core, legs, back)", type: "exercise", duration: 180 }
                        ],
                        meals: [
                          {
                            name: "Breakfast: Protein smoothie",
                            recipe: {
                              ingredients: ["1 scoop protein powder", "1 cup milk", "1/2 banana", "1 tbsp peanut butter"],
                              steps: ["Blend all ingredients until smooth."]
                            }
                          },
                          {
                            name: "Lunch: Egg salad pita",
                            recipe: {
                              ingredients: ["1 whole wheat pita", "2 eggs, hard-boiled", "Lettuce, tomato", "1 tbsp light mayo"],
                              steps: ["Chop eggs and mix with mayo.", "Fill pita with egg salad and veggies."]
                            }
                          },
                          {
                            name: "Dinner: Chicken stir-fry + rice",
                            recipe: {
                              ingredients: ["1/2 cup cooked chicken", "1 cup mixed veggies", "1 cup cooked rice", "Soy sauce"],
                              steps: ["Stir-fry chicken and veggies.", "Serve over rice with soy sauce."]
                            }
                          }
                        ],
                        quote: "You’re stronger than you think."
                      },
                      {
                        label: "Day 7",
                        title: "Active Recovery & Reflection",
                        details: [
                          { step: "Gentle Yoga or Stretching (10 min)", type: "exercise", duration: 600 },
                          { step: "Go for a Walk (15 min)", type: "exercise", duration: 900 },
                          { step: "Foam Rolling: Full Body (5 min)", type: "exercise", duration: 300 },
                          { step: "Breathing: 3 min deep breathing/relaxation", type: "exercise", duration: 180 },
                          { step: "Reflect on your week & set new goals", type: "info" }
                        ],
                        meals: [
                          {
                            name: "Breakfast: Berry parfait",
                            recipe: {
                              ingredients: ["1 cup Greek yogurt", "1/2 cup granola", "1/2 cup mixed berries"],
                              steps: ["Layer yogurt, granola, and berries in a glass."]
                            }
                          },
                          {
                            name: "Lunch: Veggie quesadilla",
                            recipe: {
                              ingredients: ["1 whole wheat tortilla", "1/2 cup shredded cheese", "1/2 cup mixed veggies"],
                              steps: ["Fill tortilla with cheese and veggies.", "Cook on skillet until golden."]
                            }
                          },
                          {
                            name: "Dinner: Baked fish + veggies",
                            recipe: {
                              ingredients: ["1 fish fillet", "1 cup mixed veggies", "Lemon, olive oil, herbs"],
                              steps: ["Bake fish and veggies with lemon and olive oil."]
                            }
                          }
                        ],
                        quote: "Recovery is where the magic happens."
                      }
                    ];
                    return (
                      <div className="flex flex-col h-full">
                        {/* Motivational quote carousel */}
                                                                        {/* Bonus quick tip section */}
                                                                        <div className="bg-blue-100 text-blue-900 font-semibold text-xs px-4 py-2 rounded-xl mb-2 text-center animate-fadein">
                                                                          {quickTips[(demoDay - 1) % quickTips.length]}
                                                                        </div>
                                                {/* Mini challenge section */}
                                                <div className="bg-amber-100 text-amber-900 font-semibold text-xs px-4 py-2 rounded-xl mb-2 text-center animate-fadein">
                                                  Challenge: {miniChallenges[(demoDay - 1) % miniChallenges.length]}
                                                </div>
                        <div className="bg-gradient-to-r from-amber-200 via-rose-100 to-red-100 text-red-900 font-bold text-xs px-4 py-2 rounded-b-xl mb-2 animate-pulse text-center">
                          {demoDays[demoDay - 1].quote}
                        </div>
                        {/* Cover page */}
                        <div className="bg-gradient-to-br from-red-900 to-red-400 text-white flex flex-col items-center justify-center h-32 rounded-b-2xl mb-2">
                          <div className="text-xl font-bold mb-1 tracking-wide">FitQR Planner</div>
                          <div className="text-xs">Your Name</div>
                          <div className="mt-2 text-xs opacity-80">2026 Edition</div>
                        </div>
                        {/* Progress bar */}
                        <div className="mx-8 mb-2">
                          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(demoDay / demoDays.length) * 100}%` }}></div>
                          </div>
                          <div className="text-[10px] text-stone-400 text-right mt-1">Day {demoDay} of {demoDays.length}</div>
                        </div>
                        {/* Day selector */}
                        <div className="flex justify-center gap-2 mb-2">
                          {demoDays.map((d, i) => (
                            <button
                              key={d.label}
                              onClick={() => setDemoDay(i + 1)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${demoDay === i + 1 ? "bg-red-900 text-white" : "bg-stone-200 text-stone-700"}`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                        {/* Tab selector */}
                        <div className="flex justify-center gap-2 mb-3">
                          <button onClick={() => setTab('workout' as 'workout' | 'meals')} className={`px-4 py-1 rounded-full text-xs font-bold transition ${tab === 'workout' ? 'bg-red-900 text-white' : 'bg-stone-200 text-stone-700'}`}>Workout</button>
                          <button onClick={() => setTab('meals' as 'workout' | 'meals')} className={`px-4 py-1 rounded-full text-xs font-bold transition ${tab === 'meals' ? 'bg-green-700 text-white' : 'bg-stone-200 text-stone-700'}`}>Meals</button>
                        </div>
                        {/* Tab content */}
                        {tab === 'workout' ? (
                          <div className="bg-white mx-4 mb-3 rounded-xl shadow p-4 text-stone-800 flex-1 flex flex-col">
                                                                                    {/* How to Use This Planner: quickstart guide */}
                                                                                    <div className="mb-3 bg-purple-50 border border-purple-200 rounded-xl p-3 animate-fadein">
                                                                                      <div className="font-bold text-purple-900 text-xs mb-1">How to Use This Planner</div>
                                                                                      <ol className="list-decimal list-inside text-xs text-purple-900 space-y-1">
                                                                                        <li>Pick your focus: home, gym, or both.</li>
                                                                                        <li>Follow the daily workout and check off each exercise as you go.</li>
                                                                                        <li>Try the meal ideas and use the recipes for easy prep.</li>
                                                                                        <li>Use the tracker and weekly check-in to stay accountable.</li>
                                                                                        <li>Read the tips, challenges, and Q&A for extra support.</li>
                                                                                      </ol>
                                                                                    </div>
                                                                                    {/* Common Mistakes to Avoid: educational section */}
                                                                                    <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-3">
                                                                                      <div className="font-bold text-rose-900 mb-1 text-xs">Common Mistakes to Avoid</div>
                                                                                      <ul className="list-disc list-inside text-xs text-rose-900">
                                                                                        <li>Skipping rest days—recovery is essential!</li>
                                                                                        <li>Trying to change everything at once—focus on 1-2 habits at a time.</li>
                                                                                        <li>Not eating enough protein or veggies.</li>
                                                                                        <li>Comparing your journey to others—go at your own pace.</li>
                                                                                        <li>Giving up after a missed day—just get back on track!</li>
                                                                                      </ul>
                                                                                    </div>
                                                        {/* Motivation Board: rotating affirmations */}
                                                        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center animate-fadein">
                                                          <div className="font-bold text-amber-900 text-xs mb-1">Motivation Board</div>
                                                          <div className="italic text-amber-800 text-xs">
                                                            {[
                                                              "You are one workout away from a better mood!",
                                                              "Every healthy meal is a win.",
                                                              "Progress, not perfection.",
                                                              "You’re building habits for life.",
                                                              "Small steps add up!"
                                                            ][demoDay % 5]}
                                                          </div>
                                                        </div>
                                                        {/* Why This Works: educational section */}
                                                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
                                                          <div className="font-bold text-blue-900 mb-1 text-xs">Why This Works</div>
                                                          <ul className="list-disc list-inside text-xs text-blue-900">
                                                            <li>Combines exercise, nutrition, and habit tracking for real results</li>
                                                            <li>Step-by-step routines make it easy to follow</li>
                                                            <li>Personalized for your goals and schedule</li>
                                                            <li>Focuses on sustainable, healthy habits</li>
                                                            <li>Includes expert tips and support</li>
                                                          </ul>
                                                        </div>
                            <div className="font-bold text-sm mb-1">{demoDays[demoDay - 1].title}</div>
                            <ul className="text-xs mb-2">
                              {demoDays[demoDay - 1].details.map((stepObj, idx) => (
                                <li key={idx} className="flex items-center gap-2 mb-1">
                                  {stepObj.type !== 'info' && (
                                    <input
                                      type="checkbox"
                                      checked={checkedExercises[demoDay - 1][idx]}
                                      onChange={() => {
                                        const newChecked = checkedExercises.map(arr => [...arr]);
                                        newChecked[demoDay - 1][idx] = !newChecked[demoDay - 1][idx];
                                        setCheckedExercises(newChecked);
                                      }}
                                      className="accent-red-600 w-4 h-4"
                                    />
                                  )}
                                  <span className={checkedExercises[demoDay - 1][idx] && stepObj.type !== 'info' ? 'line-through text-stone-400' : ''}>{stepObj.step}</span>
                                  {/* Timer button for timed steps */}
                                  {stepObj.duration && (
                                    <button
                                      className={`ml-2 px-2 py-1 rounded text-xs font-bold ${timerActive[demoDay-1][idx] ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'}`}
                                      disabled={timerActive[demoDay-1][idx]}
                                      onClick={() => {
                                        // Start timer for this step
                                        const newTimers = timers.map(arr => [...arr]);
                                        const newActive = timerActive.map(arr => [...arr]);
                                        newTimers[demoDay-1][idx] = stepObj.duration;
                                        newActive[demoDay-1][idx] = true;
                                        setTimers(newTimers);
                                        setTimerActive(newActive);
                                        // Countdown
                                        const interval = setInterval(() => {
                                          setTimers(prev => {
                                            const updated = prev.map(arr => [...arr]);
                                            if (updated[demoDay-1][idx] > 0) {
                                              updated[demoDay-1][idx] -= 1;
                                            }
                                            return updated;
                                          });
                                        }, 1000);
                                        // Stop timer when done
                                        setTimeout(() => {
                                          clearInterval(interval);
                                          setTimerActive(prev => {
                                            const updated = prev.map(arr => [...arr]);
                                            updated[demoDay-1][idx] = false;
                                            return updated;
                                          });
                                        }, stepObj.duration * 1000);
                                      }}
                                    >
                                      {timerActive[demoDay-1][idx] ? `${timers[demoDay-1][idx]}s` : 'Start Timer'}
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                            <button
                              className={`mt-auto px-4 py-2 rounded-full font-bold text-xs transition ${completed[demoDay - 1] ? 'bg-green-500 text-white' : 'bg-red-900 text-white hover:bg-red-950'}`}
                              onClick={() => {
                                const arr = [...completed];
                                arr[demoDay - 1] = !arr[demoDay - 1];
                                setCompleted(arr);
                                // Update streak: count consecutive trues from start
                                let newStreak = 0;
                                for (let i = 0; i < arr.length; i++) {
                                  if (arr[i]) newStreak++;
                                  else break;
                                }
                                setStreak(newStreak);
                                // Show confetti if marking as complete
                                if (!completed[demoDay - 1] && !showConfetti) {
                                  setShowConfetti(true);
                                  setTimeout(() => setShowConfetti(false), 1200);
                                }
                              }}
                            >
                              {completed[demoDay - 1] ? 'Completed!' : 'Mark as Complete'}
                            </button>
                            {/* Daily tip section */}
                            <div className="bg-green-100 text-green-900 font-semibold text-xs px-4 py-2 rounded-xl mb-2 text-center animate-fadein">
                              {dailyTips[(demoDay - 1) % dailyTips.length]}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white mx-4 mb-3 rounded-xl shadow p-4 text-stone-800 flex-1 flex flex-col">
                            <div className="font-bold text-sm mb-1">Meal Plan</div>
                            <ul className="text-xs mb-2">
                              {demoDays[demoDay - 1].meals.map((meal, idx) => (
                                <li key={idx} className="mb-2">
                                  <span className="font-semibold">{meal.name}</span>
                                  <details className="ml-2">
                                    <summary className="cursor-pointer text-blue-700 underline text-xs">View Recipe</summary>
                                    <div className="pl-2 mt-1">
                                      <div className="font-bold text-xs mb-1">Ingredients:</div>
                                      <ul className="list-disc list-inside text-xs mb-1">
                                        {meal.recipe.ingredients.map((ing, i) => (
                                          <li key={i}>{ing}</li>
                                        ))}
                                      </ul>
                                      <div className="font-bold text-xs mb-1">Steps:</div>
                                      <ol className="list-decimal list-inside text-xs">
                                        {meal.recipe.steps.map((step, i) => (
                                          <li key={i}>{step}</li>
                                        ))}
                                      </ol>
                                    </div>
                                  </details>
                                </li>
                              ))}
                            </ul>
                            {/* Food Choices section: healthy swaps and snack ideas */}
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
                              <div className="font-bold text-green-900 mb-1 text-xs">Food Choices & Healthy Swaps</div>
                              <ul className="list-disc list-inside text-xs mb-2 text-green-900">
                                <li>Swap soda for sparkling water or herbal tea</li>
                                <li>Choose whole grain bread/wraps over white</li>
                                <li>Snack on fruit, nuts, or Greek yogurt instead of chips/candy</li>
                                <li>Try veggie sticks with hummus for a crunchy snack</li>
                                <li>Use olive oil or avocado instead of butter</li>
                                <li>Pick lean proteins (chicken, fish, tofu) most days</li>
                              </ul>
                              <div className="font-bold text-green-900 mb-1 text-xs">Smart Snack Ideas</div>
                              <ul className="list-disc list-inside text-xs text-green-900">
                                <li>Apple slices with peanut butter</li>
                                <li>Carrot sticks & hummus</li>
                                <li>Low-fat string cheese</li>
                                <li>Rice cakes with almond butter</li>
                                <li>Hard-boiled eggs</li>
                                <li>Greek yogurt with berries</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Collapsible Demo Sections for Clarity */}
                        <div className="bg-gradient-to-br from-white via-stone-50 to-stone-200 mx-4 mb-2 rounded-2xl shadow-xl p-4 text-stone-800 border border-stone-100">
                          {/* --- WEEKLY OVERVIEW & MOTIVATION --- */}
                          <details className="mb-4" open>
                            <summary className="font-bold text-red-900 cursor-pointer text-sm mb-2">Weekly Overview & Motivation</summary>
                            {demoDay === 1 && (
                              <>
                                {/* Motivational Video of the Week */}
                                <div className="bg-gradient-to-r from-stone-900 via-stone-700 to-stone-900 rounded-2xl p-3 mb-3 flex flex-col items-center shadow-lg">
                                  <div className="font-bold text-white text-xs mb-1">Motivational Video of the Week</div>
                                  <div className="w-full aspect-video bg-stone-900 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs">[Video Demo Placeholder]</span>
                                  </div>
                                  <div className="text-stone-200 text-xs mt-1">Start your week strong! (Demo only)</div>
                                </div>
                                {/* Weekly Challenge Card */}
                                <div className="bg-gradient-to-r from-orange-100 via-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-3 mb-3 flex items-center gap-2 shadow">
                                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 01.894.553l1.382 2.797 3.09.449a1 1 0 01.554 1.706l-2.234 2.178.527 3.075a1 1 0 01-1.451 1.054L10 12.347l-2.763 1.455a1 1 0 01-1.451-1.054l.527-3.075-2.234-2.178a1 1 0 01.554-1.706l3.09-.449L9.106 2.553A1 1 0 0110 2z" /></svg>
                                  <div>
                                    <span className="font-bold text-orange-900">Weekly Challenge</span>
                                    <br />
                                    <span className="text-xs text-orange-800">No added sugar for 3 days! (Try fruit, tea, or water instead of soda or candy.)</span>
                                  </div>
                                </div>
                                {/* Custom Goal Setting Card */}
                                <div className="bg-gradient-to-r from-cyan-100 via-cyan-50 to-white border border-cyan-200 rounded-2xl p-3 mb-3 shadow">
                                  <div className="font-bold text-cyan-900 mb-1 text-xs">Set Your Weekly Goal</div>
                                  <div className="text-xs text-cyan-900 mb-1">What do you want to achieve this week?</div>
                                  <input
                                    className="w-full rounded border border-cyan-300 p-2 text-xs text-cyan-900 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-1"
                                    placeholder="E.g., Do 5 workouts, try 3 new recipes, lose 1 lb (Demo only)"
                                    disabled
                                  />
                                  <div className="text-xs text-cyan-700">(Demo only, not saved)</div>
                                </div>
                              </>
                            )}
                            {/* Duplicate Quick Wins Checklist removed for clarity. */}
                          </details>
                          {/* --- DAILY TRACKERS & HABITS --- */}
                          <details className="mb-4">
                            <summary className="font-bold text-blue-900 cursor-pointer text-sm mb-2">Daily Trackers & Habits</summary>
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Water Tracker */}
                              <div className="bg-gradient-to-r from-sky-100 via-sky-50 to-white border border-sky-200 rounded-2xl p-3 flex items-center gap-2 shadow">
                                <div className="font-bold text-sky-900 text-xs mr-2">Water Tracker</div>
                                {[...Array(8)].map((_, i) => (
                                  <span key={i} className="w-4 h-4 rounded-full border-2 border-sky-400 bg-white inline-block text-sky-400 text-xs flex items-center justify-center transition-transform hover:scale-125 hover:bg-sky-200 shadow-sm">💧</span>
                                ))}
                                <span className="text-xs text-sky-700 ml-2">8 cups/day (Demo only)</span>
                              </div>
                              {/* Mood Tracker */}
                              <div className="bg-gradient-to-r from-fuchsia-100 via-fuchsia-50 to-white border border-fuchsia-200 rounded-2xl p-3 flex items-center gap-2 shadow">
                                <div className="font-bold text-fuchsia-900 text-xs mr-2">Mood Tracker</div>
                                <span className="text-2xl hover:scale-125 transition-transform cursor-pointer">😞</span>
                                <span className="text-2xl hover:scale-125 transition-transform cursor-pointer">😐</span>
                                <span className="text-2xl hover:scale-125 transition-transform cursor-pointer">🙂</span>
                                <span className="text-2xl hover:scale-125 transition-transform cursor-pointer">😃</span>
                                <span className="text-2xl hover:scale-125 transition-transform cursor-pointer">🤩</span>
                                <span className="text-xs text-fuchsia-700 ml-2">How do you feel today? (Demo only)</span>
                              </div>
                              {/* Sleep Log */}
                              <div className="bg-gradient-to-r from-indigo-100 via-indigo-50 to-white border border-indigo-200 rounded-2xl p-3 flex flex-col gap-1 shadow">
                                <div className="font-bold text-indigo-900 text-xs mb-1">Sleep Log</div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-indigo-700">Bedtime:</span>
                                  <input className="rounded border border-indigo-300 text-xs px-2 py-1 bg-white" placeholder="10:30 PM" disabled />
                                  <span className="text-xs text-indigo-700">Wake:</span>
                                  <input className="rounded border border-indigo-300 text-xs px-2 py-1 bg-white" placeholder="6:30 AM" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-indigo-700">Hours Slept:</span>
                                  <input className="rounded border border-indigo-300 text-xs px-2 py-1 bg-white w-12" placeholder="8" disabled />
                                </div>
                                <span className="text-xs text-indigo-500">(Demo only, not saved)</span>
                              </div>
                              {/* Personal Reflection Journal */}
                              <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-white border border-yellow-200 rounded-2xl p-3 shadow">
                                <div className="font-bold text-yellow-900 mb-1 text-xs">Personal Reflection Journal</div>
                                <div className="text-xs text-yellow-900 mb-1">Prompt: What’s one thing you’re proud of today? Any challenges?</div>
                                <textarea
                                  className="w-full rounded border border-yellow-300 p-2 text-xs text-yellow-900 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                  rows={2}
                                  placeholder="Write your thoughts here... (Demo only, not saved)"
                                  disabled
                                />
                              </div>
                            </div>
                          </details>
                          {/* --- PROGRESS, REWARDS & COMMUNITY --- */}
                          <details className="mb-4">
                            <summary className="font-bold text-green-900 cursor-pointer text-sm mb-2">Progress, Rewards & Community</summary>
                            <div className="mb-6">
                              {/* Progress Photo Reminder */}
                              {demoDay === 7 && (
                                <div className="bg-gradient-to-r from-pink-100 via-pink-50 to-white border border-pink-200 rounded-2xl p-3 mb-3 flex items-center gap-2 shadow animate-fade-in">
                                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 012-2h1.172a2 2 0 011.414.586l.828.828A2 2 0 0010.828 5H14a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 3a3 3 0 100 6 3 3 0 000-6z" /></svg>
                                  <div>
                                    <span className="font-bold text-pink-900">Progress Photo Reminder</span>
                                    <br />
                                    <span className="text-xs text-pink-800">Snap a photo today to see your progress over time!</span>
                                  </div>
                                </div>
                              )}
                              {/* Habit Streak Reward Badge */}
                              {streak >= 3 && (
                                <div className="bg-gradient-to-r from-green-100 via-green-50 to-white border border-green-300 rounded-2xl p-2 mb-3 flex items-center gap-2 shadow animate-bounce animate-fade-in">
                                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" /></svg>
                                  <span className="font-bold text-green-900">Streak Reward: {streak} days! Keep it up!</span>
                                </div>
                              )}
                              {/* Weekly Reward/Unlock Badge */}
                              {demoDay === 7 && (
                                <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-white border border-yellow-300 rounded-2xl p-2 mb-3 flex items-center gap-2 shadow animate-bounce animate-fade-in">
                                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" /></svg>
                                  <span className="font-bold text-yellow-900">Congrats! You unlocked a bonus tip: "Consistency beats intensity—keep showing up!"</span>
                                </div>
                              )}
                              {/* Community Leaderboard */}
                              {demoDay === 7 && (
                                <div className="bg-gradient-to-r from-stone-100 via-stone-50 to-white border border-stone-300 rounded-2xl p-3 mb-3 shadow">
                                  <div className="font-bold text-stone-900 mb-1 text-xs">Community Wins</div>
                                  <ul className="list-decimal list-inside text-xs text-stone-800">
                                    <li>Alex: 14-day streak</li>
                                    <li>Jordan: 10 healthy meals prepped</li>
                                    <li>Taylor: 7 days of workouts</li>
                                    <li>Sam: 5 lbs lost</li>
                                    <li>You: 7 days completed!</li>
                                  </ul>
                                  <div className="text-xs text-stone-500">(Demo only, for inspiration!)</div>
                                </div>
                              )}
                            </div>
                          </details>
                          {/* --- TOOLS & SUPPORT --- */}
                          <details>
                            <summary className="font-bold text-purple-900 cursor-pointer text-sm mb-2">Tools & Support</summary>
                            <div className="mb-6">
                              {/* Printable/Exportable PDF Mockup */}
                              {demoDay === 7 && (
                                <div className="flex justify-center mb-3">
                                  <button
                                    className="bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-stone-800 hover:to-stone-900 transition-all duration-200 animate-fade-in"
                                    onClick={() => alert('Download your completed week as a PDF! (Demo only)')}
                                  >
                                    <span className="mr-2">🖨️</span>Download My Week (PDF)
                                  </button>
                                </div>
                              )}
                              {/* Share Progress Button */}
                              {demoDay === 7 && (
                                <div className="flex justify-center mb-3">
                                  <button
                                    className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 animate-fade-in"
                                    onClick={() => alert('Share your progress! (Demo only)')}
                                  >
                                    <span className="mr-2">📤</span>Share My Progress
                                  </button>
                                </div>
                              )}
                              {/* Printable Grocery List Button */}
                              {tab === 'meals' && demoDay === 7 && (
                                <div className="flex justify-center mb-3">
                                  <button
                                    className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-green-700 hover:to-green-900 transition-all duration-200 animate-fade-in"
                                    onClick={() => {
                                      // Gather all ingredients from all meals for the week
                                      const allIngredients = [];
                                      for (let d = 0; d < demoDays.length; d++) {
                                        for (const meal of demoDays[d].meals) {
                                          allIngredients.push(...meal.recipe.ingredients);
                                        }
                                      }
                                      // Remove duplicates
                                      const uniqueIngredients = Array.from(new Set(allIngredients));
                                      alert('Grocery List for the Week:\n' + uniqueIngredients.join('\n'));
                                    }}
                                  >
                                    <span className="mr-2">🛒</span>Print Grocery List
                                  </button>
                                </div>
                              )}
                              {/* Customizable Reminder Time */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs text-stone-600">Set daily reminder:</span>
                                <select className="rounded border border-stone-300 text-xs px-2 py-1 bg-white" disabled>
                                  <option>7:00 AM</option>
                                  <option>8:00 AM</option>
                                  <option>12:00 PM</option>
                                  <option>6:00 PM</option>
                                  <option>8:00 PM</option>
                                </select>
                                <span className="text-xs text-stone-400">(Demo only)</span>
                              </div>
                              {/* FAQ/Support Chat Button */}
                              <div className="flex justify-end mb-3">
                                <button
                                  className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg hover:scale-105 hover:from-purple-700 hover:to-purple-900 transition-all duration-200 animate-fade-in"
                                  onClick={() => alert('How can we help? (Demo only)')}
                                >
                                  <span className="mr-1">💬</span>Need help?
                                </button>
                              </div>
                            </div>
                          </details>

                                                                                                                                                                                                                                                                                                                          {/* --- PROGRESS, REWARDS & COMMUNITY --- */}
                                                                                                                                                                                                                                                                                                                          <div className="mb-6">
                                                                                                                                                                                                                                                                                                                            {/* Progress Photo Reminder */}
                                                                                                                                                                                                                                                                                                                            {demoDay === 7 && (
                                                                                                                                                                                                                                                                                                                              <div className="bg-gradient-to-r from-pink-100 via-pink-50 to-white border border-pink-200 rounded-2xl p-3 mb-3 flex items-center gap-2 shadow animate-fade-in">
                                                                                                                                                                                                                                                                                                                                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 012-2h1.172a2 2 0 011.414.586l.828.828A2 2 0 0010.828 5H14a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 3a3 3 0 100 6 3 3 0 000-6z" /></svg>
                                                                                                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                                                                                  <span className="font-bold text-pink-900">Progress Photo Reminder</span>
                                                                                                                                                                                                                                                                                                                                  <br />
                                                                                                                                                                                                                                                                                                                                  <span className="text-xs text-pink-800">Snap a photo today to see your progress over time!</span>
                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                            {/* Habit Streak Reward Badge */}
                                                                                                                                                                                                                                                                                                                            {streak >= 3 && (
                                                                                                                                                                                                                                                                                                                              <div className="bg-gradient-to-r from-green-100 via-green-50 to-white border border-green-300 rounded-2xl p-2 mb-3 flex items-center gap-2 shadow animate-bounce animate-fade-in">
                                                                                                                                                                                                                                                                                                                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" /></svg>
                                                                                                                                                                                                                                                                                                                                <span className="font-bold text-green-900">Streak Reward: {streak} days! Keep it up!</span>
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                            {/* Weekly Reward/Unlock Badge */}
                                                                                                                                                                                                                                                                                                                            {demoDay === 7 && (
                                                                                                                                                                                                                                                                                                                              <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-white border border-yellow-300 rounded-2xl p-2 mb-3 flex items-center gap-2 shadow animate-bounce animate-fade-in">
                                                                                                                                                                                                                                                                                                                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" /></svg>
                                                                                                                                                                                                                                                                                                                                <span className="font-bold text-yellow-900">Congrats! You unlocked a bonus tip: "Consistency beats intensity—keep showing up!"</span>
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                            {/* Community Leaderboard */}
                                                                                                                                                                                                                                                                                                                            {demoDay === 7 && (
                                                                                                                                                                                                                                                                                                                              <div className="bg-gradient-to-r from-stone-100 via-stone-50 to-white border border-stone-300 rounded-2xl p-3 mb-3 shadow">
                                                                                                                                                                                                                                                                                                                                <div className="font-bold text-stone-900 mb-1 text-xs">Community Wins</div>
                                                                                                                                                                                                                                                                                                                                <ul className="list-decimal list-inside text-xs text-stone-800">
                                                                                                                                                                                                                                                                                                                                  <li>Alex: 14-day streak</li>
                                                                                                                                                                                                                                                                                                                                  <li>Jordan: 10 healthy meals prepped</li>
                                                                                                                                                                                                                                                                                                                                  <li>Taylor: 7 days of workouts</li>
                                                                                                                                                                                                                                                                                                                                  <li>Sam: 5 lbs lost</li>
                                                                                                                                                                                                                                                                                                                                  <li>You: 7 days completed!</li>
                                                                                                                                                                                                                                                                                                                                </ul>
                                                                                                                                                                                                                                                                                                                                <div className="text-xs text-stone-500">(Demo only, for inspiration!)</div>
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                          </div>

                                                                                                                                                                                                                                                                                                                          {/* --- TOOLS & SUPPORT --- */}
                                                                                                                                                                                                                                                                                                                          <div className="mb-6">
                                                                                                                                                                                                                                                                                                                            {/* Printable/Exportable PDF Mockup */}
                                                                                                                                                                                                                                                                                                                            {demoDay === 7 && (
                                                                                                                                                                                                                                                                                                                              <div className="flex justify-center mb-3">
                                                                                                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                                                                                  className="bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-stone-800 hover:to-stone-900 transition-all duration-200 animate-fade-in"
                                                                                                                                                                                                                                                                                                                                  onClick={() => alert('Download your completed week as a PDF! (Demo only)')}
                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                  <span className="mr-2">🖨️</span>Download My Week (PDF)
                                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                            {/* Share Progress Button */}
                                                                                                                                                                                                                                                                                                                            {demoDay === 7 && (
                                                                                                                                                                                                                                                                                                                              <div className="flex justify-center mb-3">
                                                                                                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                                                                                  className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 animate-fade-in"
                                                                                                                                                                                                                                                                                                                                  onClick={() => alert('Share your progress! (Demo only)')}
                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                  <span className="mr-2">📤</span>Share My Progress
                                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                            {/* Printable Grocery List Button */}
                                                                                                                                                                                                                                                                                                                            {tab === 'meals' && demoDay === 7 && (
                                                                                                                                                                                                                                                                                                                              <div className="flex justify-center mb-3">
                                                                                                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                                                                                  className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-green-700 hover:to-green-900 transition-all duration-200 animate-fade-in"
                                                                                                                                                                                                                                                                                                                                  onClick={() => {
                                                                                                                                                                                                                                                                                                                                    // Gather all ingredients from all meals for the week
                                                                                                                                                                                                                                                                                                                                    const allIngredients = [];
                                                                                                                                                                                                                                                                                                                                    for (let d = 0; d < demoDays.length; d++) {
                                                                                                                                                                                                                                                                                                                                      for (const meal of demoDays[d].meals) {
                                                                                                                                                                                                                                                                                                                                        allIngredients.push(...meal.recipe.ingredients);
                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                    // Remove duplicates
                                                                                                                                                                                                                                                                                                                                    const uniqueIngredients = Array.from(new Set(allIngredients));
                                                                                                                                                                                                                                                                                                                                    alert('Grocery List for the Week:\n' + uniqueIngredients.join('\n'));
                                                                                                                                                                                                                                                                                                                                  }}
                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                  <span className="mr-2">🛒</span>Print Grocery List
                                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                            )}
                                                                                                                                                                                                                                                                                                                            {/* Customizable Reminder Time */}
                                                                                                                                                                                                                                                                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                                                                                                                                                                                                                                                              <span className="text-xs text-stone-600">Set daily reminder:</span>
                                                                                                                                                                                                                                                                                                                              <select className="rounded border border-stone-300 text-xs px-2 py-1 bg-white" disabled>
                                                                                                                                                                                                                                                                                                                                <option>7:00 AM</option>
                                                                                                                                                                                                                                                                                                                                <option>8:00 AM</option>
                                                                                                                                                                                                                                                                                                                                <option>12:00 PM</option>
                                                                                                                                                                                                                                                                                                                                <option>6:00 PM</option>
                                                                                                                                                                                                                                                                                                                                <option>8:00 PM</option>
                                                                                                                                                                                                                                                                                                                              </select>
                                                                                                                                                                                                                                                                                                                              <span className="text-xs text-stone-400">(Demo only)</span>
                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                            {/* FAQ/Support Chat Button */}
                                                                                                                                                                                                                                                                                                                            <div className="flex justify-end mb-3">
                                                                                                                                                                                                                                                                                                                              <button
                                                                                                                                                                                                                                                                                                                                className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg hover:scale-105 hover:from-purple-700 hover:to-purple-900 transition-all duration-200 animate-fade-in"
                                                                                                                                                                                                                                                                                                                                onClick={() => alert('How can we help? (Demo only)')}
                                                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                                                <span className="mr-1">💬</span>Need help?
                                                                                                                                                                                                                                                                                                                              </button>

                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                  {/* Weekly Reward/Unlock Badge (shows on day 7) */}
                                                                                                                                                                                                                                                                                                  {demoDay === 7 && (
                                                                                                                                                                                                                                                                                                    <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-2 mb-2 flex items-center gap-2 animate-bounce">
                                                                                                                                                                                                                                                                                                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" /></svg>
                                                                                                                                                                                                                                                                                                      <span className="font-bold text-yellow-900">Congrats! You unlocked a bonus tip: "Consistency beats intensity—keep showing up!"</span>
                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                  )}
                                                                                                                                                                                                                                                                                                  {/* Community Leaderboard (Demo Only) */}
                                                                                                                                                                                                                                                                                                  {demoDay === 7 && (
                                                                                                                                                                                                                                                                                                    <div className="bg-stone-100 border border-stone-300 rounded-xl p-3 mb-2">
                                                                                                                                                                                                                                                                                                      <div className="font-bold text-stone-900 mb-1 text-xs">Community Wins</div>
                                                                                                                                                                                                                                                                                                      <ul className="list-decimal list-inside text-xs text-stone-800">
                                                                                                                                                                                                                                                                                                        <li>Alex: 14-day streak</li>
                                                                                                                                                                                                                                                                                                        <li>Jordan: 10 healthy meals prepped</li>
                                                                                                                                                                                                                                                                                                        <li>Taylor: 7 days of workouts</li>
                                                                                                                                                                                                                                                                                                        <li>Sam: 5 lbs lost</li>
                                                                                                                                                                                                                                                                                                        <li>You: 7 days completed!</li>
                                                                                                                                                                                                                                                                                                      </ul>
                                                                                                                                                                                                                                                                                                      <div className="text-xs text-stone-500">(Demo only, for inspiration!)</div>
                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                  )}
                                                                                                                                                                                                                                                                                                  {/* Printable/Exportable PDF Mockup (shows on day 7) */}
                                                                                                                                                                                                                                                                                                  {demoDay === 7 && (
                                                                                                                                                                                                                                                                                                    <div className="flex justify-center mb-2">
                                                                                                                                                                                                                                                                                                      <button
                                                                                                                                                                                                                                                                                                        className="bg-stone-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow hover:bg-stone-800 transition"
                                                                                                                                                                                                                                                                                                        onClick={() => alert('Download your completed week as a PDF! (Demo only)')}
                                                                                                                                                                                                                                                                                                      >
                                                                                                                                                                                                                                                                                                        Download My Week (PDF)
                                                                                                                                                                                                                                                                                                      </button>
                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                  )}
                                                                                                                                                                                                                                                                                                  {/* FAQ/Support Chat Button (always visible) */}
                                                                                                                                                                                                                                                                                                  <div className="flex justify-end mb-2">
                                                                                                                                                                                                                                                                                                    <button
                                                                                                                                                                                                                                                                                                      className="bg-purple-700 text-white font-bold text-xs px-3 py-1 rounded-full shadow hover:bg-purple-800 transition"
                                                                                                                                                                                                                                                                                                      onClick={() => alert('How can we help? (Demo only)')}
                                                                                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                                                                                      Need help?
                                                                                                                                                                                                                                                                                                    </button>
                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                          {/* Duplicate Mood Tracker, Sleep Log, Custom Goal Setting, and Water Tracker removed for clarity. */}
                                                                                                                                                                                                                          {/* Weekly Challenge Card (shows on day 1) */}
                                                                                                                                                                                                                          {demoDay === 1 && (
                                                                                                                                                                                                                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-2 flex items-center gap-2">
                                                                                                                                                                                                                              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 01.894.553l1.382 2.797 3.09.449a1 1 0 01.554 1.706l-2.234 2.178.527 3.075a1 1 0 01-1.451 1.054L10 12.347l-2.763 1.455a1 1 0 01-1.451-1.054l.527-3.075-2.234-2.178a1 1 0 01.554-1.706l3.09-.449L9.106 2.553A1 1 0 0110 2z" /></svg>
                                                                                                                                                                                                                              <div>
                                                                                                                                                                                                                                <span className="font-bold text-orange-900">Weekly Challenge</span>
                                                                                                                                                                                                                                <br />
                                                                                                                                                                                                                                <span className="text-xs text-orange-800">No added sugar for 3 days! (Try fruit, tea, or water instead of soda or candy.)</span>
                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                          )}
                                                                                                                                                                                                                          {/* Celebrate Your Wins Button (shows on day 7) */}
                                                                                                                                                                                                                          {demoDay === 7 && (
                                                                                                                                                                                                                            <div className="flex justify-center mb-2">
                                                                                                                                                                                                                              <button
                                                                                                                                                                                                                                className="bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow hover:bg-amber-600 transition"
                                                                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                                                                  // Show confetti celebration
                                                                                                                                                                                                                                  setShowConfetti(true);
                                                                                                                                                                                                                                  setTimeout(() => setShowConfetti(false), 1500);
                                                                                                                                                                                                                                }}
                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                🎉 Celebrate Your Wins
                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                          )}
                                                                                                                                                                                                  {/* Motivational Video of the Week (embed or mockup) */}
                                                                                                                                                                                                  {demoDay === 1 && (
                                                                                                                                                                                                    <div className="bg-black rounded-xl p-3 mb-2 flex flex-col items-center">
                                                                                                                                                                                                      <div className="font-bold text-white text-xs mb-1">Motivational Video of the Week</div>
                                                                                                                                                                                                      <div className="w-full aspect-video bg-stone-900 rounded-lg flex items-center justify-center">
                                                                                                                                                                                                        <span className="text-white text-xs">[Video Demo Placeholder]</span>
                                                                                                                                                                                                      </div>
                                                                                                                                                                                                      <div className="text-stone-200 text-xs mt-1">Start your week strong! (Demo only)</div>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                  )}
                                                                                                                                                                                                  {/* Quick Wins Checklist */}
                                                                                                                                                                                                  <div className="bg-lime-50 border border-lime-200 rounded-xl p-3 mb-2">
                                                                                                                                                                                                    <div className="font-bold text-lime-900 mb-1 text-xs">Quick Wins</div>
                                                                                                                                                                                                    <ul className="list-disc list-inside text-xs text-lime-900">
                                                                                                                                                                                                      <li>Drink a glass of water after waking up</li>
                                                                                                                                                                                                      <li>Do 10 squats before breakfast</li>
                                                                                                                                                                                                      <li>Prep a healthy snack for later</li>
                                                                                                                                                                                                      <li>Take a 5-min walk after lunch</li>
                                                                                                                                                                                                      <li>Write down one thing you’re grateful for</li>
                                                                                                                                                                                                    </ul>
                                                                                                                                                                                                  </div>
                                                                                                                                                                          {/* Share Progress Button (shows on day 7) */}
                                                                                                                                                                          {demoDay === 7 && (
                                                                                                                                                                            <div className="flex justify-center mb-2">
                                                                                                                                                                              <button
                                                                                                                                                                                className="bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow hover:bg-blue-800 transition"
                                                                                                                                                                                onClick={() => alert('Share your progress! (Demo only)')}
                                                                                                                                                                              >
                                                                                                                                                                                Share My Progress
                                                                                                                                                                              </button>
                                                                                                                                                                            </div>
                                                                                                                                                                          )}
                                                                                                                                                                          {/* Customizable Reminder Time (visual only) */}
                                                                                                                                                                          <div className="flex items-center gap-2 mb-2">
                                                                                                                                                                            <span className="text-xs text-stone-600">Set daily reminder:</span>
                                                                                                                                                                            <select className="rounded border border-stone-300 text-xs px-2 py-1 bg-white" disabled>
                                                                                                                                                                              <option>7:00 AM</option>
                                                                                                                                                                              <option>8:00 AM</option>
                                                                                                                                                                              <option>12:00 PM</option>
                                                                                                                                                                              <option>6:00 PM</option>
                                                                                                                                                                              <option>8:00 PM</option>
                                                                                                                                                                            </select>
                                                                                                                                                                            <span className="text-xs text-stone-400">(Demo only)</span>
                                                                                                                                                                          </div>
                                                                                                                                                  {/* Weekly Recap & Next Steps (show on last day of week) */}
                                                                                                                                                  {demoDay === 7 && (
                                                                                                                                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-2">
                                                                                                                                                      <div className="font-bold text-blue-900 mb-1 text-xs">Weekly Recap & Next Steps</div>
                                                                                                                                                      <ul className="list-disc list-inside text-xs text-blue-900 mb-2">
                                                                                                                                                        <li>How many days did you complete your routine?</li>
                                                                                                                                                        <li>What was your biggest win this week?</li>
                                                                                                                                                        <li>What will you focus on next week?</li>
                                                                                                                                                      </ul>
                                                                                                                                                      <div className="text-xs text-blue-800 mb-1">Tip: Review your notes and progress photos to see how far you’ve come!</div>
                                                                                                                                                      <div className="font-bold text-blue-900 text-xs">Next: Set a new goal or try a new challenge for the upcoming week!</div>
                                                                                                                                                    </div>
                                                                                                                                                  )}
                                                                                                                          {/* Progress Photo Reminder (show on last day of week) */}
                                                                                                                          {demoDay === 7 && (
                                                                                                                            <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 mb-2 flex items-center gap-2">
                                                                                                                              <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 012-2h1.172a2 2 0 011.414.586l.828.828A2 2 0 0010.828 5H14a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 3a3 3 0 100 6 3 3 0 000-6z" /></svg>
                                                                                                                              <div>
                                                                                                                                <span className="font-bold text-pink-900">Progress Photo Reminder</span>
                                                                                                                                <br />
                                                                                                                                <span className="text-xs text-pink-800">Snap a photo today to see your progress over time!</span>
                                                                                                                              </div>
                                                                                                                            </div>
                                                                                                                          )}
                                                                                                                          {/* Habit Streak Reward Badge (show for 3+ streak) */}
                                                                                                                          {streak >= 3 && (
                                                                                                                            <div className="bg-green-100 border border-green-300 rounded-xl p-2 mb-2 flex items-center gap-2 animate-bounce">
                                                                                                                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" /></svg>
                                                                                                                              <span className="font-bold text-green-900">Streak Reward: {streak} days! Keep it up!</span>
                                                                                                                            </div>
                                                                                                                          )}
                                                                                                  {/* Personal Reflection Journal */}
                                                                                                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-2">
                                                                                                    <div className="font-bold text-yellow-900 mb-1 text-xs">Personal Reflection Journal</div>
                                                                                                    <div className="text-xs text-yellow-900 mb-1">Prompt: What’s one thing you’re proud of today? Any challenges?</div>
                                                                                                    <textarea
                                                                                                      className="w-full rounded border border-yellow-300 p-2 text-xs text-yellow-900 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                                                                      rows={2}
                                                                                                      placeholder="Write your thoughts here... (Demo only, not saved)"
                                                                                                      disabled
                                                                                                    />
                                                                                                  </div>
                                                                          {/* Ask the Coach Q&A section */}
                                                                                                  {/* Printable/downloadable sample button */}
                                                                                                                          {/* Refer a friend bonus callout */}
                                                                                                                          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-2 flex items-center gap-2">
                                                                                                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zm-9 8a6 6 0 1112 0H4z" /></svg>
                                                                                                                            <div>
                                                                                                                              <span className="font-bold text-green-900">Refer a friend &amp; save!</span>
                                                                                                                              <br />
                                                                                                                              <span className="text-xs text-green-800">Get $5 off your next plan for every friend who joins. Share the love &amp; get rewarded!</span>
                                                                                                                            </div>
                                                                                                                          </div>
                                                                                                  <div className="flex justify-center mb-2">
                                                                                                    <a
                                                                                                      href="/sample-planner.pdf"
                                                                                                      target="_blank"
                                                                                                      rel="noopener noreferrer"
                                                                                                      className="inline-block bg-red-900 text-white font-bold text-xs px-4 py-2 rounded-full shadow hover:bg-red-950 transition"
                                                                                                    >
                                                                                                      Preview Sample PDF
                                                                                                    </a>
                                                                                                  </div>
                                                                          <div className="bg-stone-100 rounded-xl p-3 mb-2">
                                                                            <div className="font-bold text-sm text-red-900 mb-1">Ask the Coach</div>
                                                                            <ul className="text-xs text-stone-700 space-y-2">
                                                                              {coachQA.map((item, idx) => (
                                                                                <li key={idx}>
                                                                                  <span className="font-semibold text-stone-900">Q: {item.q}</span>
                                                                                  <br />
                                                                                  <span className="ml-2">A: {item.a}</span>
                                                                                </li>
                                                                              ))}
                                                                            </ul>
                                                                          </div>
                                                  {/* Weekly check-in prompt (show on last day of week) */}
                                                  {demoDay === 3 && (
                                                    <div className="bg-purple-100 text-purple-900 font-semibold text-xs px-4 py-2 rounded-xl mb-2 text-center animate-fadein">
                                                      Weekly Check-In: {weeklyCheckIns[Math.floor(Math.random() * weeklyCheckIns.length)]}
                                                    </div>
                                                  )}
                          <div className="font-bold text-sm mb-1">Habit Tracker</div>
                          <div className="flex gap-1 mb-2">
                            {[...Array(7)].map((_, i) => (
                              <span key={i} className={`w-4 h-4 rounded ${completed[demoDay - 1] ? 'bg-green-400' : 'bg-stone-200'}`}></span>
                            ))}
                          </div>
                          <div className="text-xs text-stone-500">Check off each day you complete your routine!</div>
                        </div>
                        <div className="bg-white mx-4 mb-2 rounded-xl shadow p-4 text-stone-800">
                          <div className="font-bold text-sm mb-1">Notes</div>
                          <div className="text-xs text-stone-600">Write down how you felt, what worked, or any questions for your next plan.</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <h3 className="font-semibold text-red-900 mb-2">Planner Example</h3>
                <div className="mb-2 flex gap-2">
                  <button onClick={() => setRoutineType("home")} className={`px-3 py-1 rounded-full text-xs font-semibold ${routineType === "home" ? "bg-red-900 text-white" : "bg-stone-200 text-stone-700"}`}>Home</button>
                  <button onClick={() => setRoutineType("gym")} className={`px-3 py-1 rounded-full text-xs font-semibold ${routineType === "gym" ? "bg-red-900 text-white" : "bg-stone-200 text-stone-700"}`}>Gym</button>
                </div>
                {routineType === "home" ? (
                  <ul className="list-disc list-inside text-stone-700">
                    <li>Jumping Jacks – 1 min</li>
                    <li>Bodyweight Squats – 15 reps</li>
                    <li>Push-ups (knee or full) – 10 reps</li>
                    <li>Plank – 30 sec</li>
                    <li>Repeat 3x</li>
                  </ul>
                ) : (
                  <ul className="list-disc list-inside text-stone-700">
                    <li>Barbell Squat – 3x8</li>
                    <li>Dumbbell Bench Press – 3x10</li>
                    <li>Lat Pulldown – 3x12</li>
                    <li>Seated Row – 3x12</li>
                    <li>Core: Hanging Knee Raise – 3x10</li>
                  </ul>
                )}
              </div>
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                <h3 className="font-semibold text-green-900 mb-2">Meal Plan Example</h3>
                <ul className="list-disc list-inside text-stone-700">
                  <li>Breakfast: Overnight oats with banana & peanut butter</li>
                  <li>Lunch: Chicken & veggie stir-fry (frozen veggies, quick rice)</li>
                  <li>Dinner: Black bean tacos with salsa & lettuce</li>
                  <li>Snack: Greek yogurt with honey</li>
                  <li>All meals: Under 20 minutes, budget-friendly!</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Custom Example</h3>
                <ul className="list-disc list-inside text-stone-700">
                  <li>Personalized split for your schedule</li>
                  <li>Custom goals (fat loss, muscle, etc.)</li>
                  <li>Weekly check-in prompts</li>
                  <li>Direct feedback and tweaks</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-4">Your booklet will include routines, meal plans, habit trackers, and tips tailored to your goals and schedule.</p>
          </section>
          {/* TESTIMONIAL & URGENCY SECTION */}
          <section className="mb-12">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-2 text-amber-900">Real Results</h2>
              <p className="text-stone-700 italic mb-2">“I never stuck to a plan before, but this booklet made it easy. I started seeing results in just two weeks!”</p>
              <p className="text-xs text-stone-500">— Happy FitQR Customer</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-display text-xl font-bold mb-2 text-red-900">Why start now?</h2>
              <ul className="list-disc list-inside text-stone-700 mb-2">
                <li>Get your personalized booklet delivered fast — start tonight!</li>
                <li>Special launch pricing: save more, get more value</li>
                <li>Build healthy habits before the new year rush</li>
              </ul>
              <p className="text-sm text-stone-700 font-semibold mt-2">Don’t wait — your future self will thank you!</p>
            </div>
          </section>


          {/* WHY THIS WORKS */}
          <section className="max-w-4xl mx-auto mb-14">
            <h3 className="font-display text-2xl font-bold mb-3 text-stone-900">
              Why this approach works
            </h3>

            <p className="text-stone-700 leading-relaxed mb-4">
              Results aren’t about extreme routines — they come from applying the
              right <strong>dose</strong> of movement consistently. Major
              guidelines emphasize regular aerobic activity paired with strength
              training as a foundation for long-term health.
            </p>

            <p className="text-stone-700 leading-relaxed mb-4">
              Strength training at least <strong>two days per week</strong>{" "}
              supports muscular strength and function, while moderate aerobic
              activity across the week supports cardiovascular health. The key
              variable isn’t perfection — it’s <strong>adherence</strong>.
            </p>

            <p className="text-sm text-stone-500 mt-4">
              Frameworks informed by ACSM-style guidance + federal physical
              activity recommendations. References available upon request.
            </p>
          </section>

          {/* TRUST BAR + HOW IT WORKS */}
          <section className="mb-14">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500 mb-1">Turnaround</p>
                <p className="font-semibold text-stone-900">Fast delivery</p>
                <p className="text-sm text-stone-600">
                  Most plans delivered within <strong>24 hours</strong> (often
                  sooner).
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500 mb-1">Checkout</p>
                <p className="font-semibold text-stone-900">Secure payment</p>
                <p className="text-sm text-stone-600">
                  Your payment is handled by a secure checkout provider.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500 mb-1">Local</p>
                <p className="font-semibold text-stone-900">Built in the Triad</p>
                <p className="text-sm text-stone-600">
                  Based in Winston-Salem and growing from here.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">
                How it works
              </h3>
              <ol className="grid md:grid-cols-3 gap-4 text-sm text-stone-700">
                <li className="rounded-xl bg-white border border-stone-200 p-4">
                  <p className="font-semibold text-stone-900 mb-1">1) Pick a plan</p>
                  <p>Choose gym, home, jumpstart, or fully custom.</p>
                </li>
                <li className="rounded-xl bg-white border border-stone-200 p-4">
                  <p className="font-semibold text-stone-900 mb-1">
                    2) Tell me your needs
                  </p>
                  <p>Drop your schedule + preferences in the box.</p>
                </li>
                <li className="rounded-xl bg-white border border-stone-200 p-4">
                  <p className="font-semibold text-stone-900 mb-1">3) Get your plan</p>
                  <p>You’ll receive a clean plan you can actually follow.</p>
                </li>
              </ol>
            </div>
          </section>

          {/* PLANS */}
          <section id="plans" className="mb-14">
            <h2 className="font-display text-3xl font-bold mb-6">
              Choose your plan and start your transformation tonight
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {PLANS.map((plan) => {
                const active =
                  plan.id === selected
                    ? "border-red-900 bg-red-50 ring-1 ring-red-900/20"
                    : "border-stone-300 hover:bg-stone-50";

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelected(plan.id)}
                    className={`text-left rounded-2xl p-6 border transition ${active}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-semibold">{plan.title}</h3>
                      <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                        {plan.tag}
                      </span>
                    </div>

                    <p className="text-sm text-stone-600 mb-4">{plan.desc}</p>
                    <ul className="space-y-2 text-sm mb-4">
                      {plan.includes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.subscription && (
                      <div className="mb-2 p-2 rounded-lg bg-green-50 border border-green-200 text-green-900 text-xs">
                        <span className="font-bold">${plan.subscription.price}/mo</span> — {plan.subscription.desc}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <p className="font-bold">${plan.price} <span className="text-xs font-normal text-stone-500">one-time</span></p>
                      <span className="text-sm">
                        {plan.id === selected ? "Selected" : "Select →"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-center">
            </div>
          </section>

          {/* CUSTOM */}
          <section
            id="customize"
            className="bg-stone-100 border border-stone-300 rounded-2xl p-8 mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-2">
              Tell me what you actually need
            </h2>
            <p className="text-stone-600 mb-4">
              Schedule, goals, injuries, stress, gym access — put it all here.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-stone-600 mb-1">Your name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Jaden"
                  className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Email to send your plan</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div className="col-span-2 flex items-center mt-2">
                <input
                  id="subscribe"
                  type="checkbox"
                  checked={subscribe}
                  onChange={e => setSubscribe(e.target.checked)}
                  className="mr-2 w-5 h-5 accent-red-900"
                />
                <label htmlFor="subscribe" className="text-sm text-stone-700 font-semibold">
                  Subscribe for $9/month (get a new plan every month, cancel anytime)
                </label>
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Your #1 fitness goal</label>
                <input
                  type="text"
                  value={fitnessGoal}
                  onChange={e => setFitnessGoal(e.target.value)}
                  placeholder="e.g. Get toned, lose weight, run faster, build muscle..."
                  className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Routine type</label>
                <select
                  value={routineType}
                  onChange={e => setRoutineType(e.target.value as "home" | "gym")}
                  className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900"
                >
                  <option value="home">Home</option>
                  <option value="gym">Gym</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Current fitness level</label>
                <select
                  value={fitnessLevel}
                  onChange={e => setFitnessLevel(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Equipment available (if any)</label>
                <input
                  type="text"
                  value={equipment}
                  onChange={e => setEquipment(e.target.value)}
                  placeholder="e.g. Dumbbells, resistance bands, none..."
                  className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Time available per workout</label>
                <input
                  type="text"
                  value={timePerWorkout}
                  onChange={e => setTimePerWorkout(e.target.value)}
                  placeholder="e.g. 20 min, 45 min, varies..."
                  className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Medical history or injuries (required)</label>
                <input
                  type="text"
                  value={medicalHistory}
                  onChange={e => setMedicalHistory(e.target.value)}
                  required
                  placeholder="e.g. Asthma, diabetes, knee pain, none..."
                  className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else? Tell me about your goals, lifestyle, or what motivates you!"
              className="w-full h-32 p-4 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900 mt-2"
            />
            <div className="mt-4 flex items-start gap-2">
              <input id="liability" type="checkbox" required className="mt-1" />
              <label htmlFor="liability" className="text-xs text-stone-600">
                <strong>I understand:</strong> This plan is for general fitness and information only. It is not medical advice or a substitute for professional care. I agree to consult a doctor before starting any new exercise or nutrition program, and I release FitQR and its creator from any liability for injury or health issues that may arise.
              </label>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="mb-4 text-center text-lg font-bold text-red-900">
                Total: {subscribe ? "$9 first payment (then $9/mo)" : "$12 one-time"}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold mb-4 text-stone-900">
              Quick questions
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <p className="font-semibold text-stone-900 mb-2">
                  What do I receive?
                </p>
                <p className="text-sm text-stone-600">
                  A clear workout plan (and simple progression) based on your
                  selection. If you choose custom, it’s built around your notes.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <p className="font-semibold text-stone-900 mb-2">
                  How fast is delivery?
                </p>
                <p className="text-sm text-stone-600">
                  Most plans go out within <strong>24 hours</strong>. During peak
                  times (holidays/weekends), it may take a bit longer.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <p className="font-semibold text-stone-900 mb-2">
                  Is this 1-on-1 training?
                </p>
                <p className="text-sm text-stone-600">
                  Not live coaching or in-person training. This is personalized
                  program design based on your goals, access, and preferences.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <p className="font-semibold text-stone-900 mb-2">
                  Medical or rehab?
                </p>
                <p className="text-sm text-stone-600">
                  No diagnosis or treatment. If you have injuries/conditions,
                  please check with a clinician and tell me your limitations so
                  your plan stays safe.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-500 mt-4">
              Note: This site shares exercise information and program design
              support. It’s not medical advice.
            </p>
          </section>

          {/* CTA */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm text-stone-500">Selected</p>
              <p className="font-display text-2xl font-bold">{chosen ? chosen.title : "Select a plan"}</p>
              <p className="text-stone-600">
                Built with intention. Backed by science. Local roots.
              </p>
            </div>

            <div className="md:w-[320px] rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <p className="text-sm text-stone-500 mb-2">Order summary</p>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-stone-900">{chosen?.title ?? ''}</p>
                  <p className="text-sm text-stone-600 mt-1">
                    Digital plan delivery
                  </p>
                </div>
                <p className="font-bold text-stone-900">${chosen?.price ?? ''}</p>
              </div>

              <div className="mt-4 space-y-2 text-sm text-stone-700">
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>Clear routine + progression</span>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>Swaps for equipment/access</span>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>Designed around your notes</span>
                </div>
              </div>

              <p className="text-xs text-stone-500 mt-4">
                Most plans delivered within 24 hours.
              </p>

              {customerEmail ? (
                <p className="text-xs text-stone-500 mt-3">
                  Sending to:{" "}
                  <span className="font-medium text-stone-700">
                    {customerEmail}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-stone-500 mt-3">
                  Add your email above so I know where to send your plan.
                </p>
              )}
            </div>

            <div className="md:text-right">
              <p className="text-sm text-stone-500 mb-1">Price</p>
              <p className="text-3xl font-extrabold mb-3">${chosen?.price ?? ''}</p>

              <button
                onClick={handleCheckout}
                disabled={!canCheckout}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition ${
                  canCheckout
                    ? "bg-red-900 text-white hover:bg-red-950"
                    : "bg-stone-300 text-stone-600 cursor-not-allowed"
                }`}
              >
                Order your plan now — start tonight!
              </button>

              <p className="text-xs text-stone-500 mt-3">
                After checkout, you’ll get a confirmation and I’ll email your plan
                to you.
              </p>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-12 border-t border-stone-200 pt-8 text-sm text-stone-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p>© {new Date().getFullYear()} FitQR • Winston-Salem, NC</p>
              <p className="text-stone-500">
                Questions? Add your email capture next (recommended).
              </p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
