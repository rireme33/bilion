"use client";

import Link from "next/link";
import { useState } from "react";

const showcasePreview = [
  {
    name: "Jobsite Notes to Daily Reports",
    route: "/jobsite-notes-daily-reports",
    sourceSignal:
      "Construction teams use AI to turn scattered field notes into standard daily reports.",
    buyer: "Small contractors and field service teams",
    revenueIdea: "$49/month",
  },
  {
    name: "Done-for-You Local Review Reply Copilot",
    route: "/done-for-you-local-review-reply-copilot-outputs-setup",
    sourceSignal:
      "Local businesses are using AI to respond faster to customer reviews.",
    buyer: "Restaurants, clinics, salons, local shops",
    revenueIdea: "$500 setup + $150/month",
  },
  {
    name: "Shift Briefs Prompt System",
    route: "/app/shift-briefs-prompt-system",
    sourceSignal:
      "Independent restaurant shift notes are scattered and generic prompts create inconsistent handoffs.",
    buyer: "Builders and consultants serving independent restaurants",
    revenueIdea: "$19 one-time",
  },
];

const patternLibrary = [
  {
    slug: "chat-product",
    title: "$300K/year chat product",
    revenueSignal: "$300K/year",
    buyer: "Support-heavy SaaS teams",
    pain: "Customer questions are repetitive, scattered, and slow to answer.",
    channel: "Founder-led X posts and support communities",
  },
  {
    slug: "discord-tool",
    title: "$30K MRR Discord tool",
    revenueSignal: "$30K MRR",
    buyer: "Paid communities and course creators",
    pain: "Members ask the same questions and miss important resources.",
    channel: "Discord communities and creator referrals",
  },
  {
    slug: "mobile-app",
    title: "$20K/month mobile app",
    revenueSignal: "$20K/month",
    buyer: "Consumers with a repeated daily workflow",
    pain: "The job is small, annoying, and happens often enough to pay for.",
    channel: "Short-form content and app store search",
  },
  {
    slug: "demo-saas",
    title: "$250K MRR demo SaaS",
    revenueSignal: "$250K MRR",
    buyer: "B2B sales and marketing teams",
    pain: "Static demos fail to show prospects the exact use case they care about.",
    channel: "LinkedIn, outbound, and product-led demo pages",
  },
  {
    slug: "analytics-tool",
    title: "$1M ARR analytics tool",
    revenueSignal: "$1M ARR",
    buyer: "Operators who need revenue visibility",
    pain: "Important metrics live across too many tools and spreadsheets.",
    channel: "SEO, founder content, and integration marketplaces",
  },
];

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium text-zinc-500">
      <span className="rounded-full bg-white px-3 py-1.5 text-zinc-950">English</span>
      <Link href="/jp" className="rounded-full px-3 py-1.5 transition hover:text-white">
        Japanese
      </Link>
    </div>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-xl px-4 py-3 text-center text-sm font-semibold transition",
        variant === "primary"
          ? "bg-white text-zinc-950 hover:bg-zinc-200"
          : "border border-white/10 text-zinc-100 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

type SourceMode = "indie" | "github";

function ShowcaseCard({ item }: { item: (typeof showcasePreview)[number] }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#111214] p-5">
      <h3 className="text-base font-semibold text-white">{item.name}</h3>
      <div className="mt-4 grid gap-3 text-sm leading-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Source signal
          </div>
          <p className="mt-1 text-zinc-300">{item.sourceSignal}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Buyer
            </div>
            <p className="mt-1 text-zinc-300">{item.buyer}</p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Revenue idea
            </div>
            <p className="mt-1 text-zinc-300">{item.revenueIdea}</p>
          </div>
        </div>
      </div>
      <Link
        href={item.route}
        className="mt-5 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.04]"
      >
        Open demo
      </Link>
    </article>
  );
}

function PatternCard({ pattern }: { pattern: (typeof patternLibrary)[number] }) {
  return (
    <article className="min-w-[280px] rounded-lg border border-white/10 bg-[#111214] p-4 shadow-xl shadow-black/20 sm:min-w-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-6 text-white">{pattern.title}</h3>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
          Pattern
        </span>
      </div>
      <div className="mt-4 grid gap-3 text-sm leading-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Revenue signal
          </div>
          <p className="mt-1 font-semibold text-zinc-100">{pattern.revenueSignal}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Buyer
          </div>
          <p className="mt-1 text-zinc-300">{pattern.buyer}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Pain
          </div>
          <p className="mt-1 text-zinc-300">{pattern.pain}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Channel
          </div>
          <p className="mt-1 text-zinc-300">{pattern.channel}</p>
        </div>
      </div>
      <Link
        href={`/app?pattern=${pattern.slug}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
      >
        Generate my version
      </Link>
    </article>
  );
}

export default function HomePage() {
  const [sourceMode, setSourceMode] = useState<SourceMode>("indie");

  return (
    <main className="min-h-screen bg-[#0b0c0e] text-white">
      <section className="mx-auto max-w-6xl px-5 py-5 sm:px-6 md:py-7">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div>
              <div className="text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">Market signals for AI builders</div>
            </div>
          </Link>
          <LanguageSwitch />
        </header>

        <section className="py-14 md:py-18">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Opportunity Brief
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Know what sells before you build.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
              Bilion turns proven business patterns into first offers, launch
              copy, and 48-hour validation plans.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Built for people who want to sell AI-powered products, not
              collect more ideas.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSourceMode("indie")}
                className={[
                  "rounded-lg border px-4 py-4 text-left transition",
                  sourceMode === "indie"
                    ? "border-white/30 bg-white/[0.08] text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.04]",
                ].join(" ")}
              >
                <span className="block text-sm font-semibold">Indie Hacker Signal</span>
                <span className="mt-1 block text-xs leading-5">Generate from curated market stories.</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceMode("github")}
                className={[
                  "rounded-lg border px-4 py-4 text-left transition",
                  sourceMode === "github"
                    ? "border-white/30 bg-white/[0.08] text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.04]",
                ].join(" ")}
              >
                <span className="block text-sm font-semibold">GitHub Signal</span>
                <span className="mt-1 block text-xs leading-5">Generate from repo activity or sample data.</span>
              </button>
            </div>

            <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
              <ButtonLink href={`/app?source=${sourceMode}`}>Get my free product roast</ButtonLink>
              <ButtonLink href="/showcase" variant="secondary">
                See example briefs
              </ButtonLink>
            </div>
            <div className="mt-4 max-w-xl rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm leading-6 text-zinc-400">
                30 proven business patterns from a private research database.
              </p>
              <a
                href="https://rireme33.gumroad.com/l/30-proven-business-ideas"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 sm:w-auto"
              >
                Download Free PDF
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Pattern Library
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Browse proven business patterns
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Bilion turns real success stories into sell-before-you-build
                briefs.
              </p>
            </div>
            <Link href="/app" className="text-sm font-semibold text-zinc-400 hover:text-white">
              Generate my version
            </Link>
          </div>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-5">
            {patternLibrary.map((pattern) => (
              <PatternCard key={pattern.title} pattern={pattern} />
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                What Bilion gives you
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                See the example, then generate your own.
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Bilion is not an idea generator. It is a
                sell-before-you-build brief generator.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Proven business pattern",
                "First paid offer",
                "Launch copy and DM script",
                "48-hour validation plan + Codex prompt",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-[#111214] p-4 text-sm font-semibold leading-6 text-zinc-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Example briefs
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Understand Bilion through examples first.
              </h2>
            </div>
            <Link href="/showcase" className="text-sm font-semibold text-zinc-400 hover:text-white">
              See example briefs
            </Link>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {showcasePreview.map((item) => (
              <ShowcaseCard key={item.route} item={item} />
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="rounded-lg border border-white/10 bg-[#111214] p-6 md:p-7">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Access
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Three free product roasts. Unlimited with Founder Access.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                  Free users can generate 3 Opportunity Briefs per calendar day.
                  Founder and paid users get unlimited product angles, launch
                  copy, validation plans, and build prompts.
                </p>
              </div>
              <ButtonLink href="/app">Get my free product roast</ButtonLink>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
