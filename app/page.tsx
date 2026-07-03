"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const todaysMoneyMoves = [
  {
    revenue: "$15k MRR",
    sold: "Blog posts -> Pinterest pins",
    buyer: "Bloggers and niche site owners",
    why: "They wanted more traffic without manually designing and scheduling social assets.",
    tryThis: "Turn newsletters into LinkedIn carousel packs.",
  },
  {
    revenue: "$30k MRR",
    sold: "Discord community automation",
    buyer: "Paid community owners and Discord operators",
    why: "Member onboarding, repeated questions, and handoffs became too messy to handle manually.",
    tryThis: "Sell a Discord cleanup audit for paid communities.",
  },
  {
    revenue: "$1.3M ARR",
    sold: "Hosted social scheduler",
    buyer: "Developers, self-hosters, and small content teams",
    why: "Teams wanted scheduling without being locked into expensive closed platforms.",
    tryThis: "Offer a self-hosted setup service for one niche team.",
  },
];

const bilionGives = [
  {
    title: "Daily Money Move Feed",
    body: "Discover proven examples of where people already paid.",
  },
  {
    title: "Make it yours",
    body: "Turn a Money Move into your buyer, offer, price, and channel.",
  },
  {
    title: "Launch assets",
    body: "Get an X post, carousel idea, buyer DM, and validation plan.",
  },
  {
    title: "Build after replies",
    body: "Use Codex only after people reply, click, save, or show buying intent.",
  },
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

function MoneyMoveCard({ item }: { item: (typeof todaysMoneyMoves)[number] }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#111214] p-4 sm:p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
        Money Move
      </div>
      <div className="mt-3 break-words text-3xl font-black tracking-tight text-white">
        {item.revenue}
      </div>
      <h3 className="mt-2 break-words text-lg font-semibold leading-6 text-white">
        {item.sold}
      </h3>
      <div className="mt-4 grid min-w-0 gap-3 text-sm leading-6">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Who paid
          </div>
          <p className="mt-1 break-words text-zinc-300">{item.buyer}</p>
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Why money moved
          </div>
          <p className="mt-1 break-words text-zinc-300">{item.why}</p>
        </div>
        <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-2 text-sm font-semibold text-emerald-100">
          Try this: {item.tryThis}
        </div>
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
              <div className="truncate text-xs text-zinc-500">Money Move Feed</div>
            </div>
          </Link>
          <LanguageSwitch />
        </header>

        <section className="py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Money moved somewhere -&gt; Make it yours -&gt; Test today -&gt; Build after replies
            </div>
            <h1 className="mt-5 break-words text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Where did money move today?
            </h1>
            <p className="mt-5 max-w-2xl break-words text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
              Open Bilion, find one proven Money Move, make it yours, and test it today.
            </p>
            <p className="mt-3 max-w-2xl break-words text-sm font-semibold leading-6 text-emerald-200">
              Build after replies. Codex comes last.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app">See today&apos;s Money Move</ButtonLink>
              <ButtonLink href="#todays-money-moves" variant="secondary">
                View example Money Moves
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
                Daily discovery, then one concrete test.
              </h2>
              <p className="mt-3 max-w-xl break-words text-sm leading-6 text-zinc-500">
                Built for AI builders who can build, but need to know what people already paid for first.
              </p>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              {bilionGives.map((item) => (
                <div
                  key={item.title}
                  className="min-w-0 rounded-lg border border-white/10 bg-[#111214] p-4"
                >
                  <div className="break-words text-sm font-semibold text-white">{item.title}</div>
                  <p className="mt-2 break-words text-sm leading-6 text-zinc-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Build after replies, not before
              </div>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
                Test the signal before opening Codex.
              </h2>
            </div>
            <div className="min-w-0 rounded-lg border border-white/10 bg-[#111214] p-5 text-sm leading-7 text-zinc-300 sm:p-6">
              Most AI builders waste time building before demand exists. Bilion gives you the signal, offer, post, DM, and validation plan first. Use Codex only after someone replies.
            </div>
          </div>
        </section>

        <section id="todays-money-moves" className="border-t border-white/10 py-10">
          <div className="mb-5 flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Today&apos;s Money Moves
              </div>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
                Open the feed and find one proven move to test.
              </h2>
              <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-zinc-500">
                Feed cards are short on purpose: money proof, who paid, why it worked, and a move you can make yours.
              </p>
            </div>
            <Link href="/app" className="text-sm font-semibold text-zinc-400 transition hover:text-white">
              See today&apos;s Money Move
            </Link>
          </div>
          <div className="grid min-w-0 gap-3 lg:grid-cols-3">
            {todaysMoneyMoves.map((item) => (
              <MoneyMoveCard key={item.sold} item={item} />
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
                3 free Money Moves per day.
              </h2>
              <p className="mt-3 break-words text-sm leading-6 text-zinc-500">
                Try one move, copy one post, and test demand before building.
              </p>
              <div className="mt-5">
                <ButtonLink href="/app" variant="secondary">
                  See today&apos;s Money Move
                </ButtonLink>
              </div>
            </article>

            <article className="min-w-0 overflow-hidden rounded-lg border border-emerald-300/20 bg-emerald-300/[0.06] p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Bilion Pro
              </div>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
                Pro Access - $19
              </h2>
              <p className="mt-3 break-words text-sm leading-6 text-zinc-300">
                Never run out of Money Moves. Keep discovering proven opportunities until one catches your eye.
              </p>
              <div className="mt-4 grid gap-2 text-sm leading-6 text-zinc-200">
                {[
                  "Unlimited discovery",
                  "Unlimited Try This",
                  "More versions when one catches your eye",
                  "Saved tests and winning moves",
                  "Codex build plans after validation",
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <ButtonLink href="/founder">Unlock unlimited Money Moves</ButtonLink>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
