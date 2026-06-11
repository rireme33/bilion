"use client";

import Link from "next/link";
import { useState } from "react";

type ShowcaseItem = {
  name: string;
  route: string;
  description: string;
  buyer: string;
  revenueIdea: string;
  buildTime: string;
  signal: string;
  accent: string;
  metrics: string[];
  thumbnail: string;
};

const showcaseItems: ShowcaseItem[] = [
  {
    name: "Video Pattern Lab",
    route: "/video-pattern-lab",
    description:
      "Upload a short-form video and extract why it works, what to copy, and how to rewrite it for Bilion.",
    buyer: "Creators, AI builders, vibe coders, solo founders",
    revenueIdea: "$19 one-time or $49 creator lab",
    buildTime: "10 minutes",
    signal: "Creators struggle to reverse-engineer viral short videos into repeatable content systems.",
    accent: "from-cyan-300 via-sky-500 to-violet-500",
    metrics: ["Video upload", "Frame extraction", "Rewrite engine"],
    thumbnail: "/showcase/video-pattern-lab.png",
  },
  {
    name: "Short Video Pattern Analyzer",
    route: "/short-video-pattern-analyzer",
    description:
      "Paste messy video notes and turn them into hook, retention, psychology, pattern, and scripts.",
    buyer: "AI creators, product marketers, short-form content builders",
    revenueIdea: "$19 pattern pack or $49/month creator lab",
    buildTime: "10 minutes",
    signal: "Short-form creators need reusable structures, not vague advice.",
    accent: "from-emerald-300 via-teal-500 to-cyan-500",
    metrics: ["Hook map", "Pattern JSON", "Script options"],
    thumbnail: "/showcase/short-video-pattern-analyzer.png",
  },
  {
    name: "Done-for-You Local Review Reply Copilot",
    route: "/done-for-you-local-review-reply-copilot-outputs-setup",
    description:
      "Turn messy customer reviews into reply options, owner-review flags, and a done-for-you service offer.",
    buyer: "Restaurants, clinics, salons, local shops",
    revenueIdea: "$500 setup + $150/month",
    buildTime: "10 minutes",
    signal: "Local businesses are using AI to respond faster to customer reviews.",
    accent: "from-amber-200 via-orange-400 to-rose-500",
    metrics: ["Reply options", "Owner flags", "Service offer"],
    thumbnail: "/showcase/review-reply-copilot.png",
  },
  {
    name: "Jobsite Notes to Daily Reports",
    route: "/jobsite-notes-daily-reports",
    description:
      "Turn messy construction notes, weather, crew counts, and blockers into client-ready daily reports.",
    buyer: "Small contractors and field service teams",
    revenueIdea: "$49/month",
    buildTime: "10 minutes",
    signal: "Construction teams use AI to turn scattered field notes into standard daily reports.",
    accent: "from-lime-200 via-emerald-500 to-slate-500",
    metrics: ["Daily report", "Blocker list", "Next actions"],
    thumbnail: "/showcase/jobsite-notes-daily-reports.png",
  },
  {
    name: "Shift Briefs Prompt System for Independent Restaurants",
    route: "/app/shift-briefs-prompt-system",
    description:
      "Turn messy restaurant manager notes into shift briefs, prep lists, blockers, and handoff summaries.",
    buyer: "Builders, freelancers, operators, and consultants serving independent restaurants",
    revenueIdea: "$19 one-time",
    buildTime: "10 minutes",
    signal: "Independent restaurant shift notes are scattered, and generic AI prompts create inconsistent handoffs.",
    accent: "from-yellow-200 via-amber-500 to-red-500",
    metrics: ["15 prompts", "Before/after", "Copy buttons"],
    thumbnail: "/showcase/shift-briefs-prompt-system.png",
  },
];

const featured = showcaseItems[0];

function MockPreview({ item, large = false }: { item: ShowcaseItem; large?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-lg border border-white/10 bg-[#070a12] ${large ? "p-4" : "p-3"}`}>
      <div className={`h-2 rounded-full bg-gradient-to-r ${item.accent}`} />
      <div className="mt-4 grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-28 rounded-full bg-white/20" />
          <div className="h-7 w-20 rounded-md bg-white/10" />
        </div>
        <div className={`rounded-lg bg-gradient-to-br ${item.accent} p-px`}>
          <div className="rounded-lg bg-slate-950/90 p-4">
            <div className="h-4 w-3/4 rounded-full bg-white/25" />
            <div className="mt-3 h-3 w-1/2 rounded-full bg-white/10" />
            <div className="mt-5 grid grid-cols-3 gap-2">
              {item.metrics.map((metric) => (
                <div key={metric} className="rounded-md border border-white/10 bg-white/[0.04] p-2">
                  <div className="h-8 rounded bg-white/10" />
                  <div className="mt-2 h-2 rounded-full bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-14 rounded-md bg-white/[0.06]" />
          <div className="h-14 rounded-md bg-white/[0.09]" />
          <div className="h-14 rounded-md bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

function ThumbnailPreview({ item, large = false }: { item: ShowcaseItem; large?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!item.thumbnail || imageFailed) {
    return <MockPreview item={item} large={large} />;
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-white/10 bg-[#070a12] ${large ? "p-3" : "p-2"}`}>
      <img
        src={item.thumbnail}
        alt={`${item.name} product screenshot`}
        onError={() => setImageFailed(true)}
        className="aspect-video w-full rounded-md object-cover"
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

function GalleryCard({ item }: { item: ShowcaseItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#101827] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-white/20">
      <ThumbnailPreview item={item} />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-black tracking-tight text-white">{item.name}</h3>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300">
            {item.buildTime}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
        <div className="mt-4 grid gap-3">
          <DetailRow label="Buyer" value={item.buyer} />
          <DetailRow label="Signal" value={item.signal} />
          <DetailRow label="Revenue idea" value={item.revenueIdea} />
        </div>
        <Link
          href={item.route}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-200"
        >
          Open Demo
        </Link>
      </div>
    </article>
  );
}

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,#22d3ee2b,transparent_32%),radial-gradient(circle_at_80%_10%,#f59e0b1f,transparent_28%),linear-gradient(135deg,#070a12,#0f172a_55%,#111827)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white text-base font-black text-black">
                B
              </div>
              <div>
                <div className="text-lg font-black text-white transition group-hover:text-slate-200">Bilion</div>
                <div className="text-xs text-slate-500">showcase gallery</div>
              </div>
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Open Bilion
            </Link>
          </header>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                {showcaseItems.length} demos
              </div>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-white sm:text-7xl">
                Built with Bilion
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Real AI signals turned into demo products.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                A visual proof gallery for what Bilion can create: buyer pain, signal, product angle, revenue idea, and
                a working demo route in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="text-3xl font-black text-white">{showcaseItems.length}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Demo products</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="text-3xl font-black text-white">10m</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Build time each</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="text-3xl font-black text-white">5</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Buyer markets</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <article className="overflow-hidden rounded-lg border border-cyan-300/30 bg-[#101827] shadow-2xl shadow-cyan-950/20">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
              <div className="p-5">
                <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
                  Featured demo
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">{featured.name}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{featured.description}</p>
                <div className="mt-5 grid gap-3">
                  <DetailRow label="Buyer" value={featured.buyer} />
                  <DetailRow label="Signal" value={featured.signal} />
                  <DetailRow label="Revenue idea" value={featured.revenueIdea} />
                  <DetailRow label="Build time" value={featured.buildTime} />
                </div>
                <Link
                  href={featured.route}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 sm:w-auto"
                >
                  Open Demo
                </Link>
              </div>
              <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
                <ThumbnailPreview item={featured} large />
                <div className="mt-4 grid gap-2">
                  {featured.metrics.map((metric) => (
                    <div key={metric} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                      <span className="text-sm font-bold text-slate-200">{metric}</span>
                      <span className="h-2 w-16 rounded-full bg-cyan-300/60" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <aside className="rounded-lg border border-white/10 bg-[#101827] p-5 shadow-xl shadow-black/20">
            <h2 className="text-lg font-black text-white">What this proves</h2>
            <div className="mt-5 space-y-3">
              {[
                "Bilion signals can become concrete products, not just idea lists.",
                "Each demo includes a buyer, pain, revenue angle, and working route.",
                "The gallery lets visitors inspect the product shape before opening every demo.",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Gallery</h2>
            <p className="mt-2 text-sm text-slate-400">All products built from Bilion signals.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate-300">
            {showcaseItems.length} demos
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {showcaseItems.map((item) => (
            <GalleryCard key={item.route} item={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,#101827,#111827_55%,#0f172a)] p-5 shadow-2xl shadow-black/20 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">Want to build products like these?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Open Bilion, start from a real AI signal, and turn it into a product demo with a buyer, pain, offer, and
                route you can share.
              </p>
            </div>
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-200"
            >
              Open Bilion
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
