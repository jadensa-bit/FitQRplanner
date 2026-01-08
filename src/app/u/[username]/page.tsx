export default function UserProfilePage({
  params,
}: {
  params: { username?: string };
}) {
  const username =
    typeof params?.username === "string" ? params.username : "guest";

  const displayName =
    username.length > 0
      ? username[0].toUpperCase() + username.slice(1)
      : "Guest";

  const profile = {
    displayName,
    headline: "Personalized fitness plans built for real life.",
    goal: "Build muscle + stay lean",
    focus: ["Strength", "Glutes/legs", "Core"],
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">FitQR Profile</p>

          <h1 className="mt-2 text-3xl font-[var(--font-display)] font-semibold tracking-tight">
            {profile.displayName}
          </h1>

          <p className="mt-2 text-zinc-600">{profile.headline}</p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Current Goal
              </p>
              <p className="mt-1 text-base font-medium">{profile.goal}</p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Focus
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.focus.map((x) => (
                  <span
                    key={x}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>

            <button className="mt-2 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:opacity-95">
              View Workout Plan
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            fitqr • scan • train
          </p>
        </div>
      </div>
    </main>
  );
}
