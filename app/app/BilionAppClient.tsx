"use client";

import { useState } from "react";

type FreeIdea = {
  title: string;
  buyer: string;
  pain: string;
  source_url?: string;
};

type LaunchPack = {
  product_name: string;
  price: string;
  lp_copy: string;
  x_post: string;
  dm_script: string;
  gumroad_description: string;
  codex_prompt: string;
  launch_plan_48h: string;
};

type ApiResult = {
  free: FreeIdea;
  paid: LaunchPack;
};

type BilionAppClientProps = {
  hasPaidAccess: boolean;
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

const lockedItems = [
  "Product name",
  "Price",
  "LP copy",
  "X post",
  "DM script",
  "Gumroad description",
  "Codex prompt",
  "48h launch plan",
];

export default function BilionAppClient({
  hasPaidAccess,
}: BilionAppClientProps) {
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
            <SidebarItem active label="Discover" />
            <SidebarItem label="Build Ideas" />
            <SidebarItem label="Launch Packs" locked={!hasPaidAccess} />
            <SidebarItem label="Saved" locked />
            <SidebarItem label="Sources" locked />
            <SidebarItem label="Settings" />
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-semibold">
              {hasPaidAccess ? "Paid access" : "Free plan"}
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              {hasPaidAccess
                ? "Launch Pack outputs are unlocked for this browser."
                : "Generate a useful preview for free. Unlock when you want the full launch package."}
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
                Free gives the buyer-problem preview. Paid unlocks the launch
                pack you can build, sell, and ship from today.
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
                  onChange={(event) => setBuildType(event.target.value)}
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
                  onChange={(event) => setAudience(event.target.value)}
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
              <h2 className="mt-4 text-xl font-bold">Stop building blind.</h2>
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
                  Free preview
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoBlock label="Build this" value={result.free.title} />
                  <InfoBlock label="Buyer" value={result.free.buyer} />
                  <InfoBlock label="Pain" value={result.free.pain} />
                  <InfoBlock
                    label="Source"
                    value={result.free.source_url || "Source signal unavailable"}
                    href={result.free.source_url}
                  />
                </div>
              </div>

              {hasPaidAccess ? (
                <LaunchPackView pack={result.paid} />
              ) : (
                <LockedLaunchPack />
              )}
            </div>
          )}
        </section>

        <aside className="border-l border-white/10 bg-[#0b0b0c] p-5">
          <div className="sticky top-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                Paid Unlock
              </div>

              <h2 className="mt-4 text-2xl font-black">
                Unlock the full Launch Pack.
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Free shows what to build. Paid shows the product name, price,
                sales copy, prompts, and 48-hour plan.
              </p>

              <div className="mt-5 space-y-3">
                <RightPanelItem
                  title="Product"
                  subtitle="Name, price, and positioning"
                />
                <RightPanelItem title="Sales copy" subtitle="LP, X, DM, Gumroad" />
                <RightPanelItem
                  title="Codex prompt"
                  subtitle="Build-ready product prompt"
                />
                <RightPanelItem
                  title="48h launch"
                  subtitle="Test before overbuilding"
                />
              </div>

              <a
                href={CHECKOUT_URL}
                className="mt-6 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                Unlock Paid Access - $19
              </a>

              <p className="mt-3 text-center text-xs text-zinc-600">
                No subscription management in this version.
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

function LaunchPackView({ pack }: { pack: LaunchPack }) {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="mb-4 inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
        Paid Launch Pack
      </div>

      <div className="grid gap-4">
        <PaidBlock label="Product name" value={pack.product_name} />
        <PaidBlock label="Price" value={pack.price} />
        <PaidBlock label="LP copy" value={pack.lp_copy} />
        <PaidBlock label="X post" value={pack.x_post} />
        <PaidBlock label="DM script" value={pack.dm_script} />
        <PaidBlock
          label="Gumroad description"
          value={pack.gumroad_description}
        />
        <PaidBlock label="Codex prompt" value={pack.codex_prompt} />
        <PaidBlock label="48h launch plan" value={pack.launch_plan_48h} />
      </div>
    </div>
  );
}

function LockedLaunchPack() {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
            Paid Unlock
          </div>

          <h3 className="mt-3 text-2xl font-black">
            Free shows the preview. Paid unlocks the Launch Pack.
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Get the exact product angle, pricing, sales copy, Codex prompt, and
            48-hour launch plan.
          </p>
        </div>

        <a
          href={CHECKOUT_URL}
          className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
        >
          Unlock Paid Access - $19
        </a>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {lockedItems.map((item) => (
          <LockedItem key={item} text={item} />
        ))}
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

function InfoBlock({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block break-words text-sm leading-6 text-zinc-100 underline underline-offset-4 hover:text-white"
        >
          {value}
        </a>
      ) : (
        <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
      )}
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
        <div className="text-xs text-zinc-500">Locked</div>
      </div>
      <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
    </div>
  );
}
