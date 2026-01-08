"use client";

import { useMemo, useState, useEffect } from "react";

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

// Simulated activity feed data
const ACTIVITIES = [
  { name: "Sarah", city: "Winston-Salem" },
  { name: "Marcus", city: "Greensboro" },
  { name: "Emily", city: "High Point" },
  { name: "Jordan", city: "Durham" },
  { name: "Alex", city: "Raleigh" }
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
  // Activity feed notifications
  const [showActivity, setShowActivity] = useState(true);
  const [currentActivity, setCurrentActivity] = useState(0);
  // Counting animation for stats
  const [peopleCount, setPeopleCount] = useState(0);
  // Confetti state
  const [showConfettiEffect, setShowConfettiEffect] = useState(false);
  // Parallax scroll offset
  const [scrollY, setScrollY] = useState(0);
  // Card tilt state (index -> {x, y})
  const [cardTilt, setCardTilt] = useState<{[key: number]: {x: number, y: number}}>({});
  // Mouse position for spotlight effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Track client-side mount to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  // Generate random particle data only on client
  const [particles] = useState(() => 
    Array.from({length: 15}).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: 2 + Math.random() * 4,
      height: 2 + Math.random() * 4,
      color: ['rgba(168, 85, 247, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(34, 211, 238, 0.3)'][Math.floor(Math.random() * 3)],
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 5
    }))
  );
  
  const [stars] = useState(() =>
    Array.from({length: 8}).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2
    }))
  );
  
  const [confettiPieces] = useState(() =>
    Array.from({length: 50}).map(() => ({
      left: Math.random() * 100,
      color: ['#b91c1c', '#ea580c', '#f59e0b', '#10b981', '#3b82f6'][Math.floor(Math.random() * 5)],
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360
    }))
  );
  
  const [selectedWeeklyCheckIn] = useState(() => 
    weeklyCheckIns[Math.floor(Math.random() * weeklyCheckIns.length)]
  );
  
  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Cycle through activities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % ACTIVITIES.length);
      setShowActivity(true);
      setTimeout(() => setShowActivity(false), 4000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  // Counting animation for people stat
  useEffect(() => {
    const target = 347;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setPeopleCount(target);
        clearInterval(timer);
      } else {
        setPeopleCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);
  
  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Mouse spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Confetti cleanup
  useEffect(() => {
    if (showConfettiEffect) {
      const timer = setTimeout(() => setShowConfettiEffect(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfettiEffect]);

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
          subscribe,
          fitnessGoal,
          routineType,
          fitnessLevel,
          equipment,
          timePerWorkout,
          medicalHistory
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
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-stone-800 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 -z-10" 
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite'
        }}></div>
      
      {/* Parallax floating elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Morphing blob shapes */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-cyan-300/20 rounded-full blur-3xl" style={{
          animation: 'morph 10s ease-in-out infinite'
        }}></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-fuchsia-300/20 to-violet-300/20 rounded-full blur-3xl" style={{
          animation: 'morph 12s ease-in-out infinite',
          animationDelay: '2s'
        }}></div>
        <div 
          className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"
          style={{transform: `translateY(${scrollY * 0.1}px)`}}
        ></div>
        <div 
          className="absolute top-40 right-20 w-48 h-48 bg-violet-200/20 rounded-full blur-3xl"
          style={{transform: `translateY(${scrollY * 0.15}px)`}}
        ></div>
        <div 
          className="absolute bottom-40 left-1/4 w-40 h-40 bg-cyan-200/20 rounded-full blur-3xl"
          style={{transform: `translateY(${scrollY * -0.08}px)`}}
        ></div>
        <div 
          className="absolute top-1/2 right-10 w-56 h-56 bg-fuchsia-200/20 rounded-full blur-3xl"
          style={{transform: `translateY(${scrollY * 0.12}px)`}}
        ></div>
      </div>
      
      {/* Confetti effect */}
      {showConfettiEffect && isMounted && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiPieces.map((piece, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${piece.left}%`,
                top: '-10px',
                backgroundColor: piece.color,
                animation: `confetti-fall ${piece.duration}s linear forwards`,
                animationDelay: `${piece.delay}s`,
                transform: `rotate(${piece.rotation}deg)`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Floating particles */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                backgroundColor: particle.color,
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
          {/* Add sparkle stars */}
          {stars.map((star, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-2xl"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
                opacity: 0.6
              }}
            >✨</div>
          ))}
        </div>
      )}
      
      {/* Cursor spotlight effect */}
      <div 
        className="fixed pointer-events-none z-30 rounded-full blur-3xl transition-all duration-300"
        style={{
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)'
        }}
      />
      
      {/* Scanning beam effect */}
      <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" style={{
          animation: 'scan 8s linear infinite',
          top: 0
        }}></div>
      </div>
      
      {/* Floating action badges */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        <div className="absolute top-20 left-10 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg" style={{
          animation: 'float 6s ease-in-out infinite'
        }}>💪 Get Fit</div>
        <div className="absolute top-40 right-20 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg" style={{
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '1s'
        }}>🥗 Eat Clean</div>
        <div className="absolute bottom-40 left-20 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg" style={{
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '2s'
        }}>🔥 Stay Motivated</div>
        
        {/* DNA helix effect */}
        {Array.from({length: 6}).map((_, i) => (
          <div key={`dna-${i}`} className="absolute" style={{
            left: i % 2 === 0 ? '5%' : '95%',
            top: `${15 + i * 15}%`,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7, #22d3ee)',
            animation: `helix ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`
          }}></div>
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-stone-200 overflow-hidden relative z-10">
        
        {/* BRANDED HEADER */}
        <header className="bg-gradient-to-r from-purple-900 via-violet-800 to-fuchsia-700 text-white py-6 px-8 border-b-4 border-cyan-400 relative overflow-hidden">
          {/* Animated background sparkle */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(251,191,36,0.15)_0%,_transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_rgba(251,191,36,0.15)_0%,_transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Energy waves */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            {Array.from({length: 3}).map((_, i) => (
              <div key={`wave-${i}`} className="absolute w-full h-full border border-cyan-300/50" style={{
                animation: `wave ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
                borderRadius: '50%',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) scale(0.5)'
              }}></div>
            ))}
          </div>
          
          <div className="flex items-center justify-between max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-4">
              {/* Enhanced Logo - QR-Inspired Modern Badge */}
              <div className="relative group">
                {/* Rotating ring */}
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-cyan-400/30 animate-spin" style={{animationDuration: '8s'}}></div>
                
                {/* Pulsing glow */}
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full animate-pulse"></div>
                
                {/* Main logo circle */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-violet-500 to-fuchsia-600 p-1 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-white via-purple-50 to-cyan-100 flex items-center justify-center relative overflow-hidden">
                    {/* QR code inspired pattern */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 p-2">
                      <div className="bg-purple-700 rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-purple-700 rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-purple-700 rounded-full"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-purple-700 rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-purple-700 rounded-sm"></div>
                    </div>
                    {/* Checkmark overlay */}
                    <svg className="w-10 h-10 text-purple-700 relative z-10 drop-shadow-lg group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20" style={{
                      filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
                    }}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-3xl font-black bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg tracking-tighter group-hover:scale-110 transition-transform inline-block" style={{textShadow: '0 2px 10px rgba(34,211,238,0.3)'}}>
                    FitQR
                  </span>
                  <span className="text-[10px] bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-2 py-0.5 rounded-md font-bold shadow-lg animate-pulse">BETA</span>
                </div>
                <p className="text-sm font-bold text-cyan-200 drop-shadow-sm tracking-wide">Fitness Plans That Fit Your Life</p>
                <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Winston-Salem, NC
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-br from-green-500/30 to-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-green-300/40 shadow-lg">
              <svg className="w-5 h-5 text-green-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">100% Personalized Plans</span>
            </div>
          </div>
        </header>

        {/* INTRO HERO SECTION */}
        <section className="relative text-center py-16 mb-10 bg-gradient-to-br from-purple-100 via-violet-50 to-cyan-50 border-b-4 border-purple-700 overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-300/40 via-transparent to-transparent animate-pulse"></div>
          
          {/* Decorative accent shapes */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-red-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
          
          {/* Pattern Interrupt */}
          <div className="mb-4 relative z-10">
            <div className="inline-block bg-gradient-to-r from-stone-800 to-stone-700 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl" style={{
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)'
            }}>
              <p className="text-sm md:text-base font-semibold">
                Built for people who've tried before — and want something that actually sticks.
              </p>
            </div>
          </div>
          
          {/* New Year Special Badge - ENHANCED */}
          <div className="mb-6 relative z-10">
            <div className="inline-block bg-gradient-to-r from-cyan-400 via-purple-500 to-violet-600 text-white px-8 py-3 rounded-2xl shadow-xl transform hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:rotate-2 relative overflow-hidden" style={{
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.6), 0 10px 40px rgba(0,0,0,0.2)',
              animation: 'pulse-border 3s ease-in-out infinite'
            }}>
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{
                animation: 'shine 3s ease-in-out infinite',
                transform: 'skewX(-20deg)'
              }}></div>
              <p className="text-2xl md:text-3xl font-extrabold mb-0.5 relative z-10">
                <span className="inline-block animate-bounce">⏰</span> New Year Special <span className="inline-block animate-bounce" style={{animationDelay: '0.2s'}}>🎉</span>
              </p>
              <p className="text-xs font-semibold tracking-wider relative z-10">Limited time pricing</p>
            </div>
          </div>
          
          {/* Pricing Headline - BOLD */}
          <div className="mb-8 relative z-10 bg-white/80 backdrop-blur-sm max-w-2xl mx-auto rounded-3xl shadow-2xl p-8 border-2" style={{
            borderColor: 'transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #a855f7, #ec4899, #f59e0b, #10b981, #3b82f6, #8b5cf6)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 20px 60px rgba(0,0,0,0.1)',
            animation: 'rainbow-border 5s linear infinite'
          }}>
            <p className="text-2xl md:text-3xl font-extrabold text-stone-700 mb-3">
              Get your first custom fitness + meal plan for <span className="line-through text-stone-400">$12</span>
            </p>
            <p className="text-3xl md:text-4xl text-stone-800 mb-3 font-extrabold">
              Subscribe for <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-violet-600 text-white px-4 py-2 rounded-xl shadow-lg inline-block relative overflow-hidden" style={{
                animation: 'gradient-shift 3s ease infinite',
                backgroundSize: '200% 200%'
              }}>
                <span className="relative z-10">$9/month</span>
                {/* Holographic shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{
                  animation: 'shimmer 2s infinite',
                  transform: 'skewX(-20deg)'
                }}></span>
              </span> <span className="text-sm font-normal text-stone-600">(cancel anytime)</span>
            </p>
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-3 inline-block">
              <p className="text-sm md:text-base text-green-900 font-semibold italic flex items-center gap-2">
                <span className="text-xl animate-bounce">✨</span> Most users start feeling more consistent and confident within the first 1–2 weeks.
              </p>
            </div>
          </div>
          
          {/* Main Headline - MASSIVE */}
          <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-stone-900 relative z-10 group" style={{
            textShadow: '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.2)'
          }}>
            <span className="group-hover:animate-pulse">Transform Your Fitness & Meals</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-500 animate-gradient-x" style={{
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 3s ease infinite'
            }}>
              All in One Place
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-stone-800 mb-6 relative z-10 font-semibold">
            Custom workouts, simple meal prep, and habit tracking built around your life.<span className="inline-block w-0.5 h-6 bg-purple-600 ml-1 animate-pulse" style={{animation: 'blink 1s step-end infinite'}}>​</span>
          </p>
          
          {/* Trust Builders - BADGE STYLE */}
          <div className="max-w-3xl mx-auto mb-8 relative z-10 flex flex-wrap justify-center gap-3">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-stone-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-purple-300">
              <span className="text-sm font-bold text-stone-800"><span className="inline-block text-green-600 animate-bounce" style={{animationDuration: '2s'}}>✓</span> No equipment needed</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-stone-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-cyan-300">
              <span className="text-sm font-bold text-stone-800">⏱️ Fast delivery</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-stone-200 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-violet-300">
              <span className="text-sm font-bold text-stone-800">🎓 Exercise Science–trained</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <a 
              href="#plans" 
              onMouseEnter={() => setShowConfettiEffect(true)}
              onClick={(e) => {
                e.preventDefault();
                setShowConfettiEffect(true);
                setTimeout(() => window.location.hash = '#plans', 300);
              }}
              className="px-8 py-4 rounded-full font-bold text-lg bg-purple-700 text-white hover:bg-purple-800 transition-all shadow-lg relative overflow-hidden group hover:scale-110"
              style={{
                boxShadow: '0 0 20px rgba(126, 34, 206, 0.5), 0 0 40px rgba(126, 34, 206, 0.3)',
                animation: 'pulse-glow 2s ease-in-out infinite'
              }}
            >
              <span className="relative z-10 inline-block group-hover:scale-110 transition-transform">See Plans 🚀</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              {/* Ripple effect */}
              <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700"></span>
            </a>
            <a href="#demo" className="px-8 py-4 rounded-full font-bold text-lg bg-white border-2 border-purple-700 text-purple-700 hover:bg-purple-50 transition-all shadow hover:scale-105 hover:shadow-xl">View Demo</a>
          </div>
        </section>

        <div className="bg-gradient-to-r from-purple-900 via-violet-900 to-purple-900 px-8 py-5 text-stone-100">
          <p className="text-sm text-stone-200">
            Unlock your best self with a plan you’ll actually use — Exercise Science–trained, delivered fast, and designed for real life.
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
              <span className="font-semibold text-purple-700">Every FitQR planner is 100% custom.</span> You’ll get a complete, step-by-step routine built just for you—based on your goals, schedule, and what you share in the chat box. I personally create your plan so you can follow it and get the results you want.
            </p>
                      {/* CUSTOMIZATION OPTIONS SECTION */}
                      <section className="mb-12 py-12 px-6 bg-stone-50 rounded-2xl">
                        <h2 className="font-display text-xl font-bold mb-3 text-stone-900">What can your plan focus on?</h2>
                        <p className="text-stone-700 mb-4">When you order, you can request any of these (or combine them):</p>
                        <div className="flex flex-wrap gap-3 mb-2">
                          <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">Get more toned</span>
                          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">Slim down a little</span>
                          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">Hit a new PR (weightlifting)</span>
                          <span className="bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-semibold">Beat your fastest mile</span>
                          <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">Build healthy habits</span>
                          <span className="bg-fuchsia-100 text-fuchsia-800 px-4 py-2 rounded-full text-sm font-semibold">Feel more confident</span>
                          <span className="bg-stone-100 text-stone-800 px-4 py-2 rounded-full text-sm font-semibold">Other: You tell me!</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-2">Your plan is built around <span className="font-semibold">your</span> goals, schedule, and preferences—no generic templates, ever.</p>
                      </section>
            
            {/* SOCIAL PROOF COUNTER */}
            <div className="flex flex-col items-center mb-8 gap-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-xl border-2 border-green-400 animate-fade-in hover:scale-105 transition-transform duration-300 relative overflow-hidden" style={{
                boxShadow: '0 0 30px rgba(5, 150, 105, 0.5), 0 10px 40px rgba(0,0,0,0.2)'
              }}>
                {/* Animated progress bar at bottom */}
                <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                  <div className="h-full bg-white/60" style={{
                    width: `${(peopleCount / 347) * 100}%`,
                    transition: 'width 2s ease-out'
                  }}></div>
                </div>
                <p className="text-center relative z-10">
                  <span className="text-3xl font-bold block mb-1" style={{animation: 'heartbeat 2s ease-in-out infinite'}}>{peopleCount}+</span>
                  <span className="text-sm font-semibold">people started their plan this week <span className="inline-block animate-bounce" style={{animationDuration: '1.5s'}}>🔥</span></span>
                </p>
              </div>
              {/* Limited Spots Indicator */}
              <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-violet-600 text-white px-6 py-3 rounded-full shadow-lg border-2 border-cyan-300 hover:scale-110 transition-transform" style={{
                boxShadow: '0 0 25px rgba(168, 85, 247, 0.6), 0 10px 30px rgba(0,0,0,0.2)',
                animation: 'shake 3s ease-in-out infinite, pulse 2s ease-in-out infinite'
              }}>
                <p className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg animate-bounce">⚡</span>
                  Only 23 spots left at this price today!
                </p>
              </div>
            </div>

            {/* SIDE-BY-SIDE DEMO SHOWCASE */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-6">
              
              {/* LEFT: Phone Demo */}
              <div className="flex flex-col items-center justify-center order-2 lg:order-1 relative">
                {/* Pulsing rings around phone */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[400px] h-[400px] border-2 border-purple-400/30 rounded-full" style={{
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                  }}></div>
                  <div className="absolute w-[450px] h-[450px] border-2 border-cyan-400/20 rounded-full" style={{
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                    animationDelay: '0.5s'
                  }}></div>
                </div>
                <div className="w-[300px] md:w-[340px] h-[600px] md:h-[680px] bg-gradient-to-br from-stone-900 via-black to-purple-900 rounded-[2.5rem] shadow-2xl border-4 border-purple-500 hover:border-cyan-400 flex flex-col items-center overflow-hidden relative animate-pulse-slow transition-all duration-500 hover:scale-105">
                {/* Phone notch + camera */}
                <div className="w-20 h-2 bg-stone-300 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10"></div>
                <div className="w-4 h-4 bg-stone-700 rounded-full absolute top-2 left-1/2 -translate-x-1/2 border-2 border-stone-900 z-20"></div>
                {/* Animated callout badge - SPICY */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce z-30 border-2 border-white/50">
                  ✨ TRY IT NOW →
                </div>
                {/* Interactive demo - enhanced, with state passed from top-level, and scrollable */}
                <div className="flex flex-col h-full w-full overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent py-2">
                  {/* Preview Notice - Enhanced */}
                  <div className="mx-2 mb-3">
                    <div className="bg-gradient-to-r from-purple-100 via-blue-50 to-purple-100 border-2 border-purple-300 rounded-xl p-3 shadow-sm">
                      <p className="text-center text-xs font-bold text-purple-900 flex items-center justify-center gap-1">
                        <span className="text-base">🎯</span>
                        <span>This is just a preview — your real plan will be <span className="text-purple-700">100% personalized to YOU</span></span>
                      </p>
                    </div>
                  </div>
                  
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
                                                      {/* Visual progress tracker - Enhanced */}
                                                      <div className="flex justify-center gap-2 mb-2 px-2">
                                                        {[0,1,2].map((i) => (
                                                          <div key={i} className={`flex-1 max-w-[70px] h-12 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 shadow-sm ${
                                                            completed[i] 
                                                              ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-600 scale-105' 
                                                              : 'bg-white border-stone-300'
                                                          }`}>
                                                            <span className="text-[10px] font-bold text-stone-700">Day {i+1}</span>
                                                            <span className={`text-xl ${
                                                              completed[i] ? 'text-white' : 'text-stone-300'
                                                            }`}>
                                                              {completed[i] ? '✔' : '—'}
                                                            </span>
                                                          </div>
                                                        ))}
                                                      </div>
                                    <div className="flex justify-center items-center mb-3 px-2">
                                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-lg transition-all duration-300 ${
                                        streak > 0 
                                          ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white scale-105 animate-pulse' 
                                          : 'bg-stone-100 text-stone-500'
                                      }`}>
                                        <svg className={`w-5 h-5 ${
                                          streak > 0 ? 'text-yellow-200' : 'text-stone-400'
                                        }`} fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78L10 2z" />
                                        </svg>
                                        {streak > 0 ? `🔥 ${streak} Day Streak!` : 'Start your streak today!'}
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
                                                                        {/* Bonus quick tip section - Enhanced */}
                                                                        <div className="mx-2 mb-2">
                                                                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl text-center shadow-lg border-2 border-blue-400">
                                                                            <span className="text-sm">💡</span> Bonus: {quickTips[(demoDay - 1) % quickTips.length].replace('Bonus: ', '')}
                                                                          </div>
                                                                        </div>
                                                {/* Mini challenge section - Enhanced */}
                                                <div className="mx-2 mb-2">
                                                  <div className="bg-gradient-to-r from-cyan-400 via-purple-500 to-red-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl text-center shadow-lg border-2 border-cyan-300">
                                                    <span className="text-sm">🎯</span> Challenge: {miniChallenges[(demoDay - 1) % miniChallenges.length]}
                                                  </div>
                                                </div>
                        {/* Epic Hero Section - First thing users see */}
                        <div className="bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-700 text-white px-4 pt-3 pb-6 mb-4 mx-2 rounded-2xl relative overflow-hidden animate-fade-in shadow-lg">
                          {/* Decorative background elements */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-12 -mt-12"></div>
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                          
                          {/* Main heading */}
                          <div className="relative z-10 text-center mb-3">
                            <h2 className="font-display text-lg font-extrabold mb-1 tracking-tight leading-tight">Sarah's Plan</h2>
                            <p className="text-[10px] text-white/80 leading-relaxed">Personalized • Science-backed • Ready to go</p>
                          </div>
                          
                          {/* Quick Stats - SPICY with animations */}
                          <div className="relative z-10 grid grid-cols-3 gap-2 mb-3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20 hover:scale-110 hover:bg-white/20 transition-all duration-300 cursor-pointer animate-fade-in">
                              <div className="text-xl mb-0.5">💪</div>
                              <div className="text-[9px] font-bold leading-tight">7 Workouts</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20 hover:scale-110 hover:bg-white/20 transition-all duration-300 cursor-pointer animate-fade-in" style={{animationDelay: '0.1s'}}>
                              <div className="text-xl mb-0.5">🍽️</div>
                              <div className="text-[9px] font-bold leading-tight">21 Meals</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20 hover:scale-110 hover:bg-white/20 transition-all duration-300 cursor-pointer animate-fade-in" style={{animationDelay: '0.2s'}}>
                              <div className="text-xl mb-0.5">✨</div>
                              <div className="text-[9px] font-bold leading-tight">Daily Habits</div>
                            </div>
                          </div>
                          
                          {/* Circular Progress */}
                          <div className="relative z-10 flex items-center justify-center mb-3">
                            <div className="relative w-20 h-20">
                              <svg className="w-20 h-20 transform -rotate-90">
                                <circle cx="40" cy="40" r="35" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                                <circle 
                                  cx="40" 
                                  cy="40" 
                                  r="35" 
                                  stroke="white" 
                                  strokeWidth="6" 
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 35}`}
                                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - demoDay / demoDays.length)}`}
                                  className="transition-all duration-500"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-xl font-bold">{demoDay}</div>
                                  <div className="text-[8px] opacity-80">of {demoDays.length}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Streak Badge */}
                          {streak > 0 && (
                            <div className="relative z-10 flex justify-center">
                              <div className="bg-cyan-400 text-cyan-900 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                🔥 {streak} Day Streak!
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Day selector */}
                        <div className="flex justify-center gap-2 mb-4 px-4">
                          {demoDays.map((d, i) => (
                            <button
                              key={d.label}
                              onClick={() => setDemoDay(i + 1)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${demoDay === i + 1 ? "bg-purple-700 text-white" : "bg-stone-200 text-stone-700"}`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                        {/* Tab selector */}
                        <div className="flex justify-center gap-3 mb-4 px-4">
                          <button 
                            onClick={() => setTab('workout' as 'workout' | 'meals')} 
                            className={`flex-1 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                              tab === 'workout' 
                                ? 'bg-gradient-to-br from-purple-900 to-red-800 text-white shadow-md' 
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            💪 Workout
                          </button>
                          <button 
                            onClick={() => setTab('meals' as 'workout' | 'meals')} 
                            className={`flex-1 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                              tab === 'meals' 
                                ? 'bg-gradient-to-br from-green-700 to-green-600 text-white shadow-md' 
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            🍽️ Meals
                          </button>
                        </div>
                        {/* Tab content */}
                        {tab === 'workout' ? (
                          <div className="bg-gradient-to-br from-stone-50 to-stone-100 mx-4 mb-4 rounded-2xl shadow-lg p-5 text-stone-800 flex-1 flex flex-col">
                                                        {/* Motivation Board: elegant premium banner */}
                                                        <div className="mb-4 bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-50 border border-cyan-200 rounded-xl p-4 text-center shadow-sm">
                                                          <div className="font-bold text-cyan-900 text-sm mb-2">✨ Daily Motivation</div>
                                                          <div className="italic text-cyan-800 text-xs leading-relaxed">
                                                            {[
                                                              "You are one workout away from a better mood!",
                                                              "Every healthy meal is a win.",
                                                              "Progress, not perfection.",
                                                              "You’re building habits for life.",
                                                              "Small steps add up!"
                                                            ][demoDay % 5]}
                                                          </div>
                                                        </div>
                            <div className="font-display text-base font-bold mb-3 text-stone-900 border-b border-stone-200 pb-2">{demoDays[demoDay - 1].title}</div>
                            <ul className="text-xs mb-3 space-y-2">
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
                              className={`mt-auto px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 ${
                                completed[demoDay - 1] 
                                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                                  : 'bg-gradient-to-r from-purple-900 to-red-800 text-white hover:from-red-950 hover:to-purple-900 animate-pulse-slow border-2 border-red-600'
                              }`}
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
                            <div className="bg-gradient-to-r from-green-100 to-emerald-50 text-green-900 font-semibold text-xs px-4 py-3 rounded-xl mb-2 text-center shadow-sm border border-green-200">
                              💡 {dailyTips[(demoDay - 1) % dailyTips.length]}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-stone-50 to-stone-100 mx-4 mb-4 rounded-2xl shadow-lg p-5 text-stone-800 flex-1 flex flex-col">
                            <div className="font-display text-base font-bold mb-3 text-stone-900 border-b border-stone-200 pb-2">🍽️ Meal Plan</div>
                            <ul className="text-xs mb-3 space-y-3">
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
                            <summary className="font-bold text-purple-700 cursor-pointer text-sm mb-2">Weekly Overview & Motivation</summary>
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
                                <div className="bg-gradient-to-r from-pink-100 via-pink-50 to-white border border-purple-200 rounded-2xl p-3 mb-3 flex items-center gap-2 shadow animate-fade-in">
                                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 012-2h1.172a2 2 0 011.414.586l.828.828A2 2 0 0010.828 5H14a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 3a3 3 0 100 6 3 3 0 000-6z" /></svg>
                                  <div>
                                    <span className="font-bold text-pink-900">Progress Photo Reminder</span>
                                    <br />
                                    <span className="text-xs text-fuchsia-800">Snap a photo today to see your progress over time!</span>
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
                                                                                                                                                                                                                                                                                                                              <div className="bg-gradient-to-r from-pink-100 via-pink-50 to-white border border-purple-200 rounded-2xl p-3 mb-3 flex items-center gap-2 shadow animate-fade-in">
                                                                                                                                                                                                                                                                                                                                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 012-2h1.172a2 2 0 011.414.586l.828.828A2 2 0 0010.828 5H14a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 3a3 3 0 100 6 3 3 0 000-6z" /></svg>
                                                                                                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                                                                                  <span className="font-bold text-pink-900">Progress Photo Reminder</span>
                                                                                                                                                                                                                                                                                                                                  <br />
                                                                                                                                                                                                                                                                                                                                  <span className="text-xs text-fuchsia-800">Snap a photo today to see your progress over time!</span>
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
                                                                                                                                                                                                                                                                          {/* Duplicate Mood Tracker, Sleep Log, Custom Goal Setting, and Water Tracker removed for clarity. */}
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
                                                                                                                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-2 flex items-center gap-2">
                                                                                                                              <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 012-2h1.172a2 2 0 011.414.586l.828.828A2 2 0 0010.828 5H14a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 3a3 3 0 100 6 3 3 0 000-6z" /></svg>
                                                                                                                              <div>
                                                                                                                                <span className="font-bold text-pink-900">Progress Photo Reminder</span>
                                                                                                                                <br />
                                                                                                                                <span className="text-xs text-fuchsia-800">Snap a photo today to see your progress over time!</span>
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
                                                                                                      className="inline-block bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow hover:bg-purple-800 transition"
                                                                                                    >
                                                                                                      Preview Sample PDF
                                                                                                    </a>
                                                                                                  </div>
                                                                          <div className="bg-stone-100 rounded-xl p-3 mb-2">
                                                                            <div className="font-bold text-sm text-purple-700 mb-1">Ask the Coach</div>
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
                                                      Weekly Check-In: {selectedWeeklyCheckIn}
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
              
              {/* RIGHT: Features & Benefits */}
              <div className="order-1 lg:order-2 space-y-6">
                <div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-3">
                    👇 See Your Future Plan
                  </h3>
                  <p className="text-stone-600 text-lg mb-6">
                    Swipe through 7 days of personalized workouts, meals & habit tracking
                  </p>
                </div>
                
                {/* Feature List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-stone-200">
                    <div className="text-2xl">💪</div>
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">Custom Workouts</h4>
                      <p className="text-sm text-stone-600">Exercises tailored to your fitness level — home or gym options</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-stone-200">
                    <div className="text-2xl">🍽️</div>
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">Simple Meal Prep</h4>
                      <p className="text-sm text-stone-600">Easy recipes with grocery lists — no complicated meal plans</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-stone-200">
                    <div className="text-2xl">✅</div>
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">Daily Habit Tracking</h4>
                      <p className="text-sm text-stone-600">Build consistency with streaks, progress photos, and check-ins</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-stone-200">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">Weekly Challenges</h4>
                      <p className="text-sm text-stone-600">Stay motivated with fun challenges and motivational content</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-stone-200">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">Progress Insights</h4>
                      <p className="text-sm text-stone-600">See your transformation with mood tracking and reflection journals</p>
                    </div>
                  </div>
                </div>
                
                {/* Mini-CTA */}
                <div className="bg-gradient-to-r from-purple-900 to-red-800 text-white rounded-2xl p-6 shadow-xl">
                  <p className="font-bold text-lg mb-2">✨ Like what you see?</p>
                  <p className="text-sm text-white/90">Your personalized version is ready in 24 hours. Let's build yours →</p>
                </div>
              </div>
              
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <h3 className="font-semibold text-purple-700 mb-2">Planner Example</h3>
                <div className="mb-2 flex gap-2">
                  <button onClick={() => setRoutineType("home")} className={`px-3 py-1 rounded-full text-xs font-semibold ${routineType === "home" ? "bg-purple-700 text-white" : "bg-stone-200 text-stone-700"}`}>Home</button>
                  <button onClick={() => setRoutineType("gym")} className={`px-3 py-1 rounded-full text-xs font-semibold ${routineType === "gym" ? "bg-purple-700 text-white" : "bg-stone-200 text-stone-700"}`}>Gym</button>
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
            {/* Urgency Badge - SPICY */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-6 py-3 rounded-2xl shadow-xl border-2 border-purple-500 animate-pulse">
                <p className="text-sm font-bold text-center">🔥 <span className="text-yellow-200">New Year Special</span> – Limited Time Pricing</p>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-2 text-cyan-900">Real Results</h2>
              <p className="text-stone-700 italic mb-2">“I never stuck to a plan before, but this booklet made it easy. I started seeing results in just two weeks!”</p>
              <p className="text-xs text-stone-500">— Happy FitQR Customer</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

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
          <section id="plans" className="mb-14 py-12 px-6 bg-stone-50 rounded-2xl">
            {/* Money-Back Guarantee Badge */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-green-900 text-lg">30-Day Money-Back Guarantee</p>
                    <p className="text-sm text-green-700">Not happy? Get a full refund, no questions asked.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              Choose Your Plan
            </h2>

            <div className="space-y-6 mb-8">
              {/* Best Value - Subscription Plan */}
              <button
                onClick={() => setSelected("subscription")}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  setCardTilt({...cardTilt, 0: {
                    x: (y - 0.5) * 10,
                    y: (x - 0.5) * -10
                  }});
                }}
                onMouseLeave={() => setCardTilt({...cardTilt, 0: {x: 0, y: 0}})}
                style={{
                  transform: cardTilt[0] ? `perspective(1000px) rotateX(${cardTilt[0].x}deg) rotateY(${cardTilt[0].y}deg) scale(1.02)` : 'none',
                  transition: 'transform 0.1s ease-out'
                }}
                className={`w-full text-left rounded-2xl p-6 border-2 shadow-md hover:shadow-2xl ${
                  selected === "subscription"
                    ? "border-purple-700 bg-red-50 ring-2 ring-red-900/20"
                    : "border-stone-300 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔥</span>
                      <span className="text-xs px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                        Best Value
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-stone-900">
                      All-in-One Fitness & Meal Subscription
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-700">$9<span className="text-lg">/month</span></p>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex gap-2 items-start">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>Custom workouts</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>Personalized meal prep</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>Habit tracking</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>Monthly updates</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                
                <div className="pt-3 border-t border-stone-200">
                  <p className="text-sm text-stone-600">
                    <span className="font-bold text-purple-700">$12 one-time</span> — First plan only
                  </p>
                </div>
                
                {/* Subscription Renewal Feature - ENHANCED */}
                {selected === "subscription" && (
                  <div className="mt-4 bg-gradient-to-br from-cyan-50 via-purple-50 to-violet-50 border-2 border-purple-300 rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full p-2">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-purple-900 text-base">Plans That Evolve With You 🚀</h4>
                    </div>
                    
                    <p className="text-sm text-purple-800 mb-4 font-medium">
                      Every renewal, you choose how to move forward:
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-purple-200">
                        <div className="text-2xl">💪</div>
                        <div>
                          <p className="font-bold text-purple-900 text-sm">Keep & Progress</p>
                          <p className="text-xs text-purple-700">Love your plan? We'll auto-progress the intensity, add new exercises, and evolve your meals — same goals, next level.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-cyan-200">
                        <div className="text-2xl">🎯</div>
                        <div>
                          <p className="font-bold text-cyan-900 text-sm">Update Your Goals</p>
                          <p className="text-xs text-cyan-700">Life changes! Update your goals, schedule, or preferences anytime. We'll create a fresh plan that fits your new direction.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-violet-200">
                        <div className="text-2xl">✨</div>
                        <div>
                          <p className="font-bold text-violet-900 text-sm">Full Refresh</p>
                          <p className="text-xs text-violet-700">Want something completely different? Get an entirely new workout style, meal approach, and challenge set.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-3">
                      <p className="text-xs text-green-900 flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Easy updates: </span>
                        We'll check in 2-3 days before each renewal. No response? Your plan auto-progresses — zero hassle!
                      </p>
                    </div>
                  </div>
                )}
              </button>

              {/* One-Time Plans */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Workout Only */}
                <button
                  onClick={() => setSelected("workout")}
                  className={`text-left rounded-2xl p-6 border transition shadow-md hover:shadow-lg ${
                    selected === "workout"
                      ? "border-purple-700 bg-red-50 ring-1 ring-red-900/20"
                      : "border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <div className="mb-3">
                    <h3 className="font-display text-lg font-semibold text-stone-900 mb-1">
                      Workout-Only Planner (One-Time)
                    </h3>
                    <p className="text-2xl font-bold text-purple-700">$8</p>
                  </div>
                  <p className="text-sm text-stone-600">
                    Custom 4-week workout routine
                  </p>
                </button>

                {/* Meal Prep Only */}
                <button
                  onClick={() => setSelected("meals")}
                  className={`text-left rounded-2xl p-6 border transition shadow-md hover:shadow-lg ${
                    selected === "meals"
                      ? "border-purple-700 bg-red-50 ring-1 ring-red-900/20"
                      : "border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <div className="mb-3">
                    <h3 className="font-display text-lg font-semibold text-stone-900 mb-1">
                      Meal Prep Planner (One-Time)
                    </h3>
                    <p className="text-2xl font-bold text-purple-700">$5</p>
                  </div>
                  <p className="text-sm text-stone-600">
                    7-day meals + grocery list
                  </p>
                </button>
              </div>
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
                  required
                >
                  <option value="">Select your fitness level</option>
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
                This planner provides general fitness and nutrition guidance. It is not medical advice. Always consult a healthcare professional before starting a new program.
              </label>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="mb-4 text-center text-lg font-bold text-purple-700">
                Total: {subscribe ? "$9 first payment (then $9/mo)" : "$12 one-time"}
              </div>
            </div>
          </section>

          {/* FAQ + TESTIMONIALS COMBINED - SIDE BY SIDE */}
          <section className="mb-12 py-12 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
            <h2 className="font-display text-3xl font-bold mb-2 text-center text-blue-900">
              Questions & Reviews
            </h2>
            <p className="text-center text-blue-700 mb-8">See what people ask and what they're saying</p>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* LEFT: Quick Questions (3 key FAQs) */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-blue-900 mb-4">❓ Quick Questions</h3>
                
                <details className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 cursor-pointer hover:shadow-md transition-all">
                  <summary className="font-semibold text-stone-900 cursor-pointer list-none flex items-center gap-2">
                    <span className="text-lg">🤔</span> Never stuck to a plan before?
                  </summary>
                  <p className="mt-2 text-sm text-stone-700 leading-relaxed pl-7">
                    That's exactly why we built this! This is personalized to your schedule, preferences, and goals—making it way easier to stick with.
                  </p>
                </details>

                <details className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 cursor-pointer hover:shadow-md transition-all">
                  <summary className="font-semibold text-stone-900 cursor-pointer list-none flex items-center gap-2">
                    <span className="text-lg">⏱️</span> How fast is delivery?
                  </summary>
                  <p className="mt-2 text-sm text-stone-700 leading-relaxed pl-7">
                    Within 24 hours (usually much sooner). It arrives as a clean PDF you can print or use on your phone.
                  </p>
                </details>

                <details className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 cursor-pointer hover:shadow-md transition-all">
                  <summary className="font-semibold text-stone-900 cursor-pointer list-none flex items-center gap-2">
                    <span className="text-lg">🏋️</span> Need a gym?
                  </summary>
                  <p className="mt-2 text-sm text-stone-700 leading-relaxed pl-7">
                    Nope! You choose—home workouts with minimal equipment, or gym-based routines. We build around what you have.
                  </p>
                </details>
              </div>

              {/* RIGHT: Customer Reviews */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-cyan-900 mb-4">⭐️ Real Results</h3>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-cyan-100">
                  <div className="text-yellow-400 text-sm mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                  <p className="text-sm italic text-stone-700 mb-2">"Finally, a plan that doesn't make me feel overwhelmed. The workouts are actually doable and I'm seeing real progress."</p>
                  <p className="text-xs text-stone-600">— Jessica M., Winston-Salem</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-cyan-100">
                  <div className="text-yellow-400 text-sm mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                  <p className="text-sm italic text-stone-700 mb-2">"The meal prep section saved me so much time. No more stressing about what to eat every day!"</p>
                  <p className="text-xs text-stone-600">— Brandon K., Greensboro</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-cyan-100">
                  <div className="text-yellow-400 text-sm mb-2">⭐️⭐️⭐️⭐️⭐️</div>
                  <p className="text-sm italic text-stone-700 mb-2">"I've tried so many programs before. This is the first one that actually fits my schedule. Game changer!"</p>
                  <p className="text-xs text-stone-600">— Alex P., High Point</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 py-8">
            <div className="flex-1">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-stone-900 mb-4 leading-tight">
                Start tonight — don't overthink it.
              </h2>
              <p className="text-xl md:text-2xl text-stone-700 leading-relaxed">
                You'll get a plan you can actually follow, built around your goals, schedule, and real life.
              </p>
            </div>

            <div className="md:text-center">
              <div className="mb-6">
                <p className="text-lg font-bold text-stone-900">Subscription: <span className="text-purple-700">$9/month</span></p>
                <p className="text-lg font-bold text-stone-900">One-time plan: <span className="text-purple-700">$12</span></p>
              </div>

              <p className="text-xs text-stone-500 mb-3">
                ✓ Secure checkout • 📦 Digital delivery • ✓ 30-day money-back guarantee
              </p>

              {/* Security Badges Row - Enhanced */}
              <div className="bg-stone-50 rounded-2xl p-4 mb-4 border border-stone-200">
                <p className="text-xs text-stone-600 text-center mb-2 font-semibold">🔒 Secure Checkout Powered By:</p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-stone-200">
                    <span className="text-xs font-bold text-purple-700">🔐 256-bit SSL</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-stone-200">
                    <span className="text-xs font-bold text-blue-600">💳 Stripe</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-stone-200">
                    <span className="text-xs font-bold text-green-600">✓ PCI Compliant</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges Row */}
              <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-stone-700">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-stone-700">Money Back</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-stone-700">Local Business</span>
                </div>
              </div>

              <p className="text-sm text-stone-700 mb-4 italic">
                If you're tired of overthinking fitness, this was built for you.
              </p>

              <button
                onClick={handleCheckout}
                disabled={!canCheckout}
                className={`px-10 py-5 rounded-full font-bold text-xl transition-all duration-200 shadow-lg ${
                  canCheckout
                    ? "bg-purple-700 text-white hover:bg-purple-800 hover:shadow-2xl hover:scale-105"
                    : "bg-stone-300 text-stone-600 cursor-not-allowed"
                }`}
              >
                Order Your Plan Now
              </button>

              <p className="text-xs text-stone-500 mt-3">
                After checkout, you'll get a confirmation — and I'll email your plan within 24 hours (often sooner).
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
      
      {/* STICKY FLOATING CTA - Bottom of screen */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 to-fuchsia-700 text-white py-4 px-6 shadow-2xl z-50 border-t-4 border-cyan-400 md:hidden">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <p className="text-xs font-semibold text-cyan-200">New Year Special</p>
            <p className="text-lg font-black">$9/month</p>
          </div>
          <a href="#plans" className="bg-white text-purple-700 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
            Get Started →
          </a>
        </div>
      </div>
      
      {/* LIVE ACTIVITY FEED - Bottom left corner */}
      {showActivity && (
        <div className="fixed bottom-24 md:bottom-6 left-6 bg-white rounded-xl shadow-2xl p-4 z-40 border-2 border-green-400 animate-fade-in max-w-xs">
          <div className="flex items-start gap-3">
            <div className="bg-green-500 rounded-full p-2 animate-pulse">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-stone-900">{ACTIVITIES[currentActivity].name} from {ACTIVITIES[currentActivity].city}</p>
              <p className="text-xs text-stone-600">just started their plan! 🎉</p>
            </div>
            <button onClick={() => setShowActivity(false)} className="text-stone-400 hover:text-stone-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* CHAT WIDGET - Bottom right corner */}
      <div className="fixed bottom-24 md:bottom-6 right-6 z-40">
        <button className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform group">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">1</div>
          <div className="absolute bottom-full right-0 mb-2 bg-stone-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Questions? We're here! 💬
          </div>
        </button>
      </div>
    </main>
  );
}
