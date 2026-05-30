"use client";

import { useState } from "react";

type FreeSignal = {
  id: string;
  product_angle: string;
  buyer: string;
  pain: string;
  bad_workaround: string;
  mvp: string;
  why_money: string;
  price_signal: string;
  score: number;
  locked: Record<string, boolean>;
};

export default function HomePage() {
  const [signal, setSignal] = useState<FreeSignal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkoutUrl =
    process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://gumroad.com/l/YOUR_PRODUCT";

  async function handleBuildToday() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/goldmine/match", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to find a build idea.");
      }

      setSignal(data.signal);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        <header className="mb-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">Bilion</div>
          <div className="rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-400">
            Tweet Hunter for vibe coders
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section>
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              For Codex, Cursor, Claude Code, Lovable users
            </div>

            <h1 className="mb-6 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              What should I build today?
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-8 text-zinc-300">
              Bilion shows AI builders what to build next using real indie
              founder signals, buyer pain, and proven small-business patterns.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleBuildToday}
                disabled={loading}
                className="rounded-2xl bg-white px-7 py-4 text-base font-bold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Finding signal..." : "What should I build today?"}
              </button>

              <a
                href={checkoutUrl}
                className="rounded-2xl border border-zinc-700 px-7 py-4 text-center text-base font-bold text-white transition hover:bg-zinc-900"
              >
                Unlock Launch Pack - $12
              </a>
            </div>

            {error && (
              <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl">
            {!signal ? (
              <div className="flex min-h-[520px] flex-col justify-center rounded-2xl border border-dashed border-zinc-700 p-8 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Build This Today
                </p>
                <h2 className="mb-4 text-3xl font-black">
                  Your next AI product signal appears here.
                </h2>
                <p className="text-zinc-400">
                  Click the button to get one buildable product direction from
                  the Bilion goldmine.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                      Build This Today
                    </p>
                    <h2 className="text-3xl font-black leading-tight">
                      {signal.product_angle}
                    </h2>
                  </div>

                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-300">
                    Score {signal.score}
                  </div>
                </div>

                <div className="grid gap-4">
                  <InfoBlock label="Buyer" value={signal.buyer} />
                  <InfoBlock label="Pain" value={signal.pain} />
                  <InfoBlock
                    label="Bad workaround"
                    value={signal.bad_workaround}
                  />
                  <InfoBlock label="MVP" value={signal.mvp} />
                  <InfoBlock label="Why money" value={signal.why_money} />
                  <InfoBlock
                    label="Price signal"
                    value={signal.price_signal}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-yellow-300">
                    Locked in Launch Pack
                  </p>

                  <div className="grid gap-2 text-sm text-zinc-300">
                    <LockedItem text="Lovable prompt" />
                    <LockedItem text="Codex prompt" />
                    <LockedItem text="Landing page copy" />
                    <LockedItem text="Pricing details" />
                    <LockedItem text="X launch posts" />
                    <LockedItem text="DM script" />
                    <LockedItem text="48h validation plan" />
                    <LockedItem text="First customer target" />
                    <LockedItem text="Similar successful examples" />
                  </div>

                  <a
                    href={checkoutUrl}
                    className="mt-5 block rounded-2xl bg-yellow-300 px-6 py-4 text-center font-black text-zinc-950 transition hover:bg-yellow-200"
                  >
                    Unlock Launch Pack - $12
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="text-base leading-7 text-zinc-100">{value || "—"}</p>
    </div>
  );
}

function LockedItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
      <span>{text}</span>
      <span className="text-yellow-300">Locked</span>
    </div>
  );
}