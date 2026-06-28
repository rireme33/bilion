"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const exampleOutputs = [
  {
    name: "Field Notes to Daily Reports",
    signal: "Construction teams are already using AI to turn messy site notes into standard reports.",
    buyer: "Small contractors and field service teams",
    pain: "Daily reports are still copied from texts, photos, and scattered notes.",
    firstOffer: "$49/month jobsite report generator",
    test: "DM 10 contractors with a before/after sample and ask if they would pay for weekly reports.",
  },
  {
    name: "Local Review Reply Copilot",
    signal: "Restaurants, clinics, and salons need faster replies to public reviews.",
    buyer: "Local service businesses with recurring customer reviews",
    pain: "Owners know reviews matter, but writing good replies is repetitive and easy to delay.",
    firstOffer: "$500 setup + $150/month managed reply system",
    test: "Send 5 review rewrites to local owners and ask if they want the next month handled.",
  },
  {
    name: "Shift Briefs Prompt System",
    signal: "Independent restaurants keep handoff notes in chats, notebooks, and memory.",
    buyer: "Restaurant operators and consultants serving local teams",
    pain: "Shift handoffs are inconsistent, and generic AI prompts do not match restaurant workflows.",
    firstOffer: "$19 prompt system or $49/month brief generator",
    test: "Post one shift-note example and DM operators who save or reply.",
  },
];

const deliverables = [
  "Market-backed money signals",
  "Buyer",
  "Paid pain",
  "First offer",
  "X post / carousel / DM",
  "48-hour validation plan",
  "Codex-ready MVP prompt",
];

function LanguageSwitch() {
  return (
    <div className="flex shrink-0 rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium text-zinc-500">
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
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-semibold transition sm:w-auto",
        variant === "primary"
          ? "bg-white text-zinc-950 hover:bg-zinc-200"
          : "border border-white/10 text-zinc-100 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function ExampleOutputCard({ item }: { item: (typeof exampleOutputs)[number] }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#111214] p-4 sm:p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
        Money Signal
      </div>
      <h3 className="mt-3 break-words text-lg font-semibold leading-6 text-white">
        {item.name}
      </h3>
      <div className="mt-4 grid min-w-0 gap-3 text-sm leading-6">
        {[
          ["Signal", item.signal],
          ["Buyer", item.buyer],
          ["Pain", item.pain],
          ["First Offer", item.firstOffer],
          ["48h Test", item.test],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {label}
            </div>
            <p className="mt-1 break-words text-zinc-300">{value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden bg-[#0b0c0e] text-white">
      <section className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-5 sm:px-6 md:py-7">
        <header className="flex min-w-0 items-center justify-between gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="truncate text-xs text-zinc-500">Money Signal OS</div>
            </div>
          </Link>
          <LanguageSwitch />
        </header>

        <section className="py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Market → Signal → Output Pack → Test → Build
            </div>
            <h1 className="mt-5 break-words text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Turn proven money signals into posts, DMs, and Codex-ready MVP prompts.
            </h1>
            <p className="mt-5 max-w-2xl break-words text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
              Pick a market, copy a revenue-backed signal, test the offer with posts and DMs, then build with Codex only after replies.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app">Start with a money signal</ButtonLink>
              <ButtonLink href="#example-outputs" variant="secondary">
                See example outputs
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                What Bilion gives you
              </div>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
                Everything needed to sell first, then build after replies.
              </h2>
              <p className="mt-3 max-w-xl break-words text-sm leading-6 text-zinc-500">
                Built for Codex, Cursor, and Claude Code users who can build, but need a sharper answer to what they should sell.
              </p>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              {deliverables.map((item) => (
                <div
                  key={item}
                  className="min-w-0 rounded-lg border border-white/10 bg-[#111214] p-4 text-sm font-semibold leading-6 text-zinc-100"
                >
                  <span className="break-words">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="example-outputs" className="border-t border-white/10 py-10">
          <div className="mb-5 flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Example outputs
              </div>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
                Start from a real money signal with a buyer attached.
              </h2>
              <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-zinc-500">
                Each output starts with a market signal, then turns it into a buyer, paid pain, first offer, validation move, and eventual Codex-ready MVP prompt.
              </p>
            </div>
            <Link href="/app" className="text-sm font-semibold text-zinc-400 transition hover:text-white">
              Generate an Output Pack
            </Link>
          </div>
          <div className="grid min-w-0 gap-3 lg:grid-cols-3">
            {exampleOutputs.map((item) => (
              <ExampleOutputCard key={item.name} item={item} />
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#111214] p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Free
              </div>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
                3 free Output Packs per day.
              </h2>
              <p className="mt-3 break-words text-sm leading-6 text-zinc-500">
                Use Bilion to pick a market, test a first offer, and decide what deserves to be built.
              </p>
              <div className="mt-5">
                <ButtonLink href="/app" variant="secondary">
                  Start with a money signal
                </ButtonLink>
              </div>
            </article>

            <article className="min-w-0 overflow-hidden rounded-lg border border-emerald-300/20 bg-emerald-300/[0.06] p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Founder Access
              </div>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
                Founder Access — $19
              </h2>
              <div className="mt-4 grid gap-2 text-sm leading-6 text-zinc-200">
                {[
                  "Unlimited Output Packs",
                  "Full Launch Packs",
                  "Saved Winners",
                  "Full Codex Build Prompts",
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <ButtonLink href="/founder">Unlock Founder Access — $19</ButtonLink>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
