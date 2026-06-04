"use client";

import { useState } from "react";

type FreeIdea = {
  latest_signal: string;
  what_happened: string;
  what_you_can_build: string;
  why_its_useful: string;
  source_label: string;
  pattern: string;
  confidence: string;
};

type BuildPromptPack = {
  latest_signal: string;
  what_you_can_build: string;
  core_features: string[];
  comparable_price: string;
  build_steps: string[];
  pattern_matches: string[];
  code_x_prompt: string;
};

type ApiResult = {
  free: FreeIdea;
  paid: BuildPromptPack;
};

type BilionAppClientProps = {
  hasFounderAccess: boolean;
};

const lockedItems = [
  "Core Features 🔒",
  "Comparable Price 🔒",
  "Full Code X Prompt 🔒",
  "Pattern Matches 🔒",
];

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "";

export default function BilionAppClient({
  hasFounderAccess,
}: BilionAppClientProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");

  async function generateIdea() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/goldmine/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buildType: "Automation",
          audience: "local businesses",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate idea");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not generate a build prompt idea. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div
        className={[
          "grid min-h-screen grid-cols-1",
          result ? "lg:grid-cols-[260px_1fr_340px]" : "lg:grid-cols-[260px_1fr]",
        ].join(" ")}
      >
        <aside className="hidden border-r border-white/10 bg-[#0b0b0c] p-5 lg:block">
          <div className="mb-8">
            <div className="text-2xl font-black tracking-tight">Bilion</div>
            <div className="mt-1 text-xs text-zinc-500">
              47,000+ Founder Stories
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem active label="Latest Signals" />
            <SidebarItem label="Build Prompts" locked={!hasFounderAccess} />
            <SidebarItem label="Founder View" locked={!hasFounderAccess} />
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-semibold">
              {hasFounderAccess ? "Founder access" : "Free preview"}
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              {hasFounderAccess
                ? "Code X Prompt is unlocked for this browser."
                : "Free shows the signal and build idea. Founder unlocks the full prompt."}
            </p>
          </div>
        </aside>

        <section className="p-4 md:p-8">
          <header className="mb-8">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              Build Prompt Engine
            </div>

            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Turn fresh AI success signals into tools you can build in Code X.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Bilion turns practical AI adoption stories into small tool ideas
              and build-ready prompts.
            </p>
          </header>

          {!result && (
            <div className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl md:p-8">
              <h2 className="text-2xl font-black tracking-tight">
                {"Today's Build Signal"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Click to reveal a real AI use case and a buildable Code X
                prompt.
              </p>
              <button
                onClick={generateIdea}
                disabled={loading}
                className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Revealing signal..." : "See Today's Signal"}
              </button>
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            </div>
          )}

          {result && (
            <div className="mt-8 grid gap-6">
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
                <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Free preview
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoBlock
                    label="Latest Signal"
                    value={result.free.latest_signal}
                  />
                  <InfoBlock
                    label="What Happened"
                    value={result.free.what_happened}
                  />
                  <InfoBlock
                    label="What You Can Build"
                    value={result.free.what_you_can_build}
                  />
                  <InfoBlock
                    label="Why It's Useful"
                    value={result.free.why_its_useful}
                  />
                </div>

                <SignalMeta
                  source={result.free.source_label}
                  pattern={result.free.pattern}
                  confidence={result.free.confidence}
                />
              </div>

              {hasFounderAccess ? (
                <FounderPromptView pack={result.paid} />
              ) : (
                <LockedFounderView />
              )}
            </div>
          )}
        </section>

        {result && (
        <aside className="border-l border-white/10 bg-[#0b0b0c] p-5">
          <div className="sticky top-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                Founder Preview
              </div>

              <h2 className="mt-4 text-2xl font-black">
                The value is the full Code X Prompt.
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Founder access reveals the core features, build steps, and the
                prompt you can paste into Code X.
              </p>

              <div className="mt-5 space-y-3">
                <RightPanelItem title="Core features" />
                <RightPanelItem title="Comparable price" />
                <RightPanelItem title="Full Code X Prompt" />
                <RightPanelItem title="Pattern Matches" />
              </div>
            </div>
          </div>
        </aside>
        )}
      </div>
    </main>
  );
}

function FounderPromptView({ pack }: { pack: BuildPromptPack }) {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="mb-4 inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
        Founder Build Prompt
      </div>

      <div className="grid gap-4">
        <PaidBlock label="Latest Signal" value={pack.latest_signal} />
        <PaidBlock
          label="What You Can Build"
          value={pack.what_you_can_build}
        />
        <PaidBlock
          label="Core Features"
          value={pack.core_features.map((item) => "- " + item).join("\n")}
        />
        <PaidBlock label="Comparable Price" value={pack.comparable_price} />
        <PaidBlock
          label="Build Steps"
          value={pack.build_steps
            .map((item, index) => index + 1 + ". " + item)
            .join("\n")}
        />
        <PaidBlock
          label="Pattern Matches"
          value={pack.pattern_matches.join("\n")}
        />
        <PaidBlock label="Code X Prompt" value={pack.code_x_prompt} />
      </div>
    </div>
  );
}

function LockedFounderView() {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
        Founder only
      </div>

      <h3 className="mt-3 text-2xl font-black">
        Founder preview
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        The full Code X Prompt and matching domains are hidden in the free
        preview.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {lockedItems.map((item) => (
          <LockedItem key={item} text={item} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
        <h4 className="text-xl font-black">Unlock Founder Access</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Get the full Code X prompt, build steps, comparable price, and pattern
          matches.
        </p>

        {CHECKOUT_URL ? (
          <a
            href={CHECKOUT_URL}
            className="mt-5 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Unlock Founder Access — $9
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-zinc-500"
          >
            Checkout link not configured
          </button>
        )}
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  active,
  locked,
}: {
  label: string;
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between rounded-2xl px-3 py-3 text-sm",
        active
          ? "bg-white text-black"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>
      {locked && <span className="text-xs opacity-60">Locked</span>}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
    </div>
  );
}

function SignalMeta({
  source,
  pattern,
  confidence,
}: {
  source: string;
  pattern: string;
  confidence: string;
}) {
  return (
    <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm md:grid-cols-3">
      <MetaItem label="Source" value={source} />
      <MetaItem label="Pattern" value={pattern} />
      <MetaItem label="Confidence" value={confidence} />
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-zinc-100">{value}</div>
    </div>
  );
}

function PaidBlock({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-100">
        {value}
      </pre>
    </article>
  );
}

function LockedItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
      <span className="text-sm text-zinc-300">{text}</span>
      <span className="text-sm text-zinc-500">Locked</span>
    </div>
  );
}

function RightPanelItem({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-zinc-500">Founder</div>
      </div>
    </div>
  );
}
