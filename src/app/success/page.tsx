"use client";
import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    const intakeRaw = window.localStorage.getItem("fitqr_intake");
    if (intakeRaw) {
      fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: intakeRaw,
      })
        .then(() => {
          window.localStorage.removeItem("fitqr_intake");
        })
        .catch(() => {});
    }
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">

        <h1 className="text-2xl font-bold mb-4 text-red-900">You did it! Your order is in 🎉</h1>

        <p className="text-zinc-600 mb-6">
          <span className="font-semibold text-black">Your personalized FitQR booklet is being crafted just for you.</span><br /><br />
          <span className="text-green-700 font-semibold">Bonus:</span> You’ll also get a free mini habit tracker PDF and a sample meal-prep guide for quick, healthy eating!
        </p>

        <div className="mb-6 text-left">
          <h2 className="text-lg font-bold mb-2 text-stone-900">Your Next Steps:</h2>
          <ul className="list-decimal list-inside text-zinc-700 space-y-1">
            <li>Check your email for your custom booklet (usually within 24 hours)</li>
            <li>Download your free habit tracker and meal-prep guide</li>
            <li>Pick a meal and a workout to try this week—keep it simple!</li>
            <li>Share your journey: Tag <span className="font-semibold">@fitqr</span> on social for a shoutout!</li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-sm text-zinc-500">Your plan and meal guide are custom-made, so you get exactly what fits your life and budget. If you have questions or want tweaks, just reply to your confirmation email!</p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className="inline-block bg-amber-100 text-amber-800 rounded-full px-3 py-1 text-xs font-bold">BONUS</span>
          <span className="text-xs text-amber-700 font-semibold">Limited time: All orders tonight get the bonus habit tracker free!</span>
          <span role="img" aria-label="habit tracker" className="text-2xl">📒</span>
        </div>

        {/* What to expect next timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2 text-stone-900">What happens next?</h2>
          <ol className="relative border-l-2 border-red-200 pl-6 space-y-4">
            <li>
              <span className="absolute -left-3 top-1 w-4 h-4 bg-red-400 rounded-full border-2 border-white"></span>
              <span className="font-semibold">Order received</span> — I’m starting your custom booklet!
            </li>
            <li>
              <span className="absolute -left-3 top-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white"></span>
              <span className="font-semibold">Booklet delivered</span> — Check your email (within 24 hours)
            </li>
            <li>
              <span className="absolute -left-3 top-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
              <span className="font-semibold">Start your journey</span> — Use your booklet and bonus tracker to crush your goals!
            </li>
          </ol>
        </div>

        {/* Refer a Friend section */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
          <h3 className="font-bold text-green-900 mb-1">Refer a Friend, Get Rewarded!</h3>
          <p className="text-green-800 text-sm mb-2">Share FitQR with a friend. If they order, you both get a bonus mini-guide!</p>
          <p className="text-xs text-green-700">Send them this link: <span className="underline">fitqr.com</span></p>
        </div>

        <a
          href="/"
          className="inline-block rounded-xl bg-black text-white px-6 py-3 text-sm font-medium hover:bg-zinc-800 transition"
        >
          Back to FitQR
        </a>
      </div>
    </main>
  );
}
