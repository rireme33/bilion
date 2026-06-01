"use client";

import { useState } from "react";

type FreeIdea = {
  title: string;
  buyer: string;
  pain: string;
  why_now: string;
  mvp: string;
  source_url?: string;
};

type ApiResult = {
  free: FreeIdea;
  locked: {
    codex_prompt: boolean;
    landing_page_copy: boolean;
    pricing: boolean;
    x_posts: boolean;
    dm_script: boolean;
    validation_plan: boolean;
    similar_examples: boolean;
    export: boolean;
  };
};

const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "#";

const buildTypes = [
  "AI tool",
  "SaaS",
  "Chrome extension",
  "Automation",
  "Directory",
  "Notion or spreadsheet product",
];

const audiences = [
  "founders",
  "agencies",
  "creators",
  "local businesses",
  "developers",
  "marketers",
  "job seekers",
];

export default function BilionAppPage() {
  const [buildType, setBuildType] = useState("AI tool");
  const [audience, setAudience] = useState("founders");
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
          buildType,
          audience,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate idea");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not generate a build idea. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr_360px]">
        <aside className="hidden border-r border-white/10 bg-[#0b0b0c] p-5 lg:block">
          <div className="mb-8">
            <div className="text-2xl font-black tracking-tight">Bilion</div>
            <div className="mt-1 text-xs text-zinc-500">
              100 curated money patterns from founder signals
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem active label="Discover" icon="⚡" />
            <SidebarItem label="Build Ideas" icon="🧠" />
            <SidebarItem label="Launch Packs" icon="🚀" locked />
            <SidebarItem label="Saved" icon="📌" locked />
            <SidebarItem label="Sources" icon="🗂️" locked />
            <SidebarItem label="Settings" icon="⚙️" />
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-semibold">Free plan</div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Generate build ideas for free. Unlock Pro when you want prompts,
              copy, and a 48h validation plan.
            </p>
          </div>
        </aside>

        <section className="p-4 md:p-8">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                Money Pattern Explorer
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                Know what to build before you build.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
               Built from 47,000+ founder-source URLs. Start with 100 curated
                money patterns and unlock the launch plan.
              </p>
            </div>
          </header>

          <div className="rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-300">
                  What can you build?
                </label>
                <select
                  value={buildType}
                  onChange={(e) => setBuildType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                >
                  {buildTypes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300">
                  Who do you want to sell to?
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                >
                  {audiences.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={generateIdea}
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Finding a matched opportunity..."
                : "Find Opportunity"}
            </button>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          </div>

          {!result && (
            <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <div className="text-3xl">🧭</div>
              <h2 className="mt-4 text-xl font-bold">
                Stop building blind.
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                Pick a build type and audience. Bilion will surface one
                launchable opportunity from the curated pattern set.
              </p>
            </div>
          )}

          {result && (
            <div className="mt-8 grid gap-6">
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
                <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Free result
                </div>

                <h2 className="text-3xl font-black tracking-tight">
                  {result.free.title}
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <InfoBlock label="Buyer" value={result.free.buyer} />
                  <InfoBlock label="Pain" value={result.free.pain} />
                  <InfoBlock label="Why now" value={result.free.why_now} />
                  <InfoBlock label="Tiny MVP" value={result.free.mvp} />
                </div>

                {result.free.source_url && (
                  <a
                    href={result.free.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex text-sm text-zinc-400 underline underline-offset-4 hover:text-white"
                  >
                    View source signal
                  </a>
                )}
              </div>

              <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                      Founder Access
                    </div>

                    <h3 className="mt-3 text-2xl font-black">
                      Free shows the opportunity. Founder Access shows how to launch it.
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                      Unlock the exact prompt, positioning, sales copy, and
                      48-hour validation workflow.
                    </p>
                  </div>

                  <a
                    href={CHECKOUT_URL}
                    className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
                  >
                    Unlock Founder Access — $19
                  </a>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <LockedItem text="Codex-ready build prompt" />
                  <LockedItem text="Landing page copy" />
                  <LockedItem text="Pricing strategy" />
                  <LockedItem text="X launch thread" />
                  <LockedItem text="Cold DM script" />
                  <LockedItem text="48h validation plan" />
                  <LockedItem text="Similar successful examples" />
                  <LockedItem text="Export Launch Pack" />
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="border-l border-white/10 bg-[#0b0b0c] p-5">
          <div className="sticky top-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                Founder Access
              </div>

              <h2 className="mt-4 text-2xl font-black">
                Unlock what to build, how to build it, and how to sell it.
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Free gives you the opportunity. Founder Access gives you the execution
                package.
              </p>

              <div className="mt-5 space-y-3">
                <RightPanelItem
                  title="Build prompt"
                  subtitle="For Codex, Cursor, and AI coding tools"
                />
                <RightPanelItem title="Sales copy" subtitle="LP and X posts" />
                <RightPanelItem
                  title="Buyer targeting"
                  subtitle="Who to DM first"
                />
                <RightPanelItem
                  title="48h validation"
                  subtitle="Test before building too much"
                />
              </div>

              <a
                href={CHECKOUT_URL}
                className="mt-6 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                Unlock Founder Access — $19
              </a>

              <p className="mt-3 text-center text-xs text-zinc-600">
                Early access. Price increases after initial users.
              </p>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm font-bold">Why Bilion?</div>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                AI made building cheap. It did not solve the harder problem:
                choosing what is worth building.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SidebarItem({
  label,
  icon,
  active,
  locked,
}: {
  label: string;
  icon: string;
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
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {locked && <span className="text-xs opacity-60">🔒</span>}
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

function LockedItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
      <span className="text-sm text-zinc-300">{text}</span>
      <span className="text-sm text-zinc-500">🔒</span>
    </div>
  );
}

function RightPanelItem({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-zinc-500">🔒</div>
      </div>
      <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
    </div>
  );
}