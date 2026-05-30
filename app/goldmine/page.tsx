export default function GoldminePage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold">
          Goldmine
        </h1>

        <p className="text-xl text-zinc-300">
          Stop guessing what to build with AI.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold">
            Free Signals
          </h2>

          <p className="text-zinc-400">
            30 real AI business opportunities extracted from Indie Hackers.
          </p>

          <button className="bg-white text-black px-5 py-3 rounded-lg font-semibold">
            View Free Database
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold">
            Goldmine Pro
          </h2>

          <p className="text-zinc-400">
            Get AI product recommendations based on real market signals.
          </p>

          <button className="bg-yellow-400 text-black px-5 py-3 rounded-lg font-semibold">
            Upgrade
          </button>
        </div>
      </div>
    </main>
  );
}