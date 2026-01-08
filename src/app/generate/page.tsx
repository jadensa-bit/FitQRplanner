"use client";

import { useState } from "react";

export default function GeneratePlannerPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-900">Tell me about you</h1>
        <p className="text-zinc-600 mb-6">Fill out the details below so I can build your custom planner!</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-stone-600 mb-1">Your name</label>
            <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jaden" className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900" />
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Email to send your plan</label>
            <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="you@example.com" className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900" />
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Your #1 fitness goal</label>
            <input type="text" placeholder="e.g. Get toned, lose weight, run faster, build muscle..." className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900" onChange={() => {}} />
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Routine type</label>
            <select className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900">
              <option>Home</option>
              <option>Gym</option>
              <option>Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Current fitness level</label>
            <select className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Equipment available (if any)</label>
            <input type="text" placeholder="e.g. Dumbbells, resistance bands, none..." className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900" onChange={() => {}} />
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Time available per workout</label>
            <input type="text" placeholder="e.g. 20 min, 45 min, varies..." className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900" onChange={() => {}} />
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Injuries, limitations, or preferences</label>
            <input type="text" placeholder="e.g. Bad knee, no running, prefer short workouts..." className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900" onChange={() => {}} />
          </div>
        </div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything else? Tell me about your goals, lifestyle, or what motivates you!" className="w-full h-32 p-4 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-red-900 mt-2" />
        <button className="mt-6 w-full bg-red-900 text-white py-3 rounded-xl font-bold hover:bg-red-950 transition">Continue to Checkout</button>
      </div>
    </main>
  );
}
