import Link from "next/link";

type ShowcaseBrief = {
  category: string;
  pattern: string;
  buyer: string;
  firstPaidOffer: string;
  price: string;
  xPost: string;
  dmScript: string;
  validationPlan: string[];
};

const patternLibrary = [
  {
    slug: "chat-product",
    title: "$300K/year chat product",
    revenueSignal: "$300K/year",
    buyer: "Support-heavy SaaS teams",
    pain: "Repetitive customer questions slow the team down.",
    channel: "X posts and support communities",
  },
  {
    slug: "discord-tool",
    title: "$30K MRR Discord tool",
    revenueSignal: "$30K MRR",
    buyer: "Paid communities and course creators",
    pain: "Members miss answers, resources, and onboarding context.",
    channel: "Discord and creator referrals",
  },
  {
    slug: "mobile-app",
    title: "$20K/month mobile app",
    revenueSignal: "$20K/month",
    buyer: "Consumers with daily repeat workflows",
    pain: "A small annoying job happens often enough to pay for.",
    channel: "Short-form content and app store search",
  },
  {
    slug: "demo-saas",
    title: "$250K MRR demo SaaS",
    revenueSignal: "$250K MRR",
    buyer: "B2B sales and marketing teams",
    pain: "Generic demos do not match each prospect's use case.",
    channel: "LinkedIn, outbound, and demo pages",
  },
  {
    slug: "analytics-tool",
    title: "$1M ARR analytics tool",
    revenueSignal: "$1M ARR",
    buyer: "Revenue operators and founders",
    pain: "Metrics are split across tools and spreadsheets.",
    channel: "SEO, founder content, and integrations",
  },
];

const showcaseBriefs: ShowcaseBrief[] = [
  {
    category: "AI agent workflow",
    pattern:
      "Ops-heavy teams pay for small AI agents that turn scattered inputs into clean daily decisions.",
    buyer: "Solo operators, agency owners, and fractional COOs",
    firstPaidOffer:
      "A done-for-you workflow agent that converts Slack notes, client requests, and task lists into a daily action brief.",
    price: "$49 setup + $19/month",
    xPost:
      "Most AI agent ideas are too broad.\n\nA better first offer:\nTurn messy team updates into one daily action brief for operators.\n\nBuyer: agency owners\nOffer: workflow agent setup\nPrice: $49 + $19/mo\n48h test: DM 20 operators with a before/after sample.",
    dmScript:
      "Quick idea: I am testing a small AI workflow agent that turns messy Slack notes and client requests into a daily action brief. Want me to run one messy example for your team?",
    validationPlan: [
      "Create one before/after sample using fake but realistic ops notes.",
      "DM 20 agency owners or operators who complain about task chaos.",
      "Validate if 3 ask for a sample, 2 send real notes, or 1 pays for setup.",
    ],
  },
  {
    category: "Local restaurant tool",
    pattern:
      "Local restaurants buy simple tools that save time on repeat customer-facing work.",
    buyer: "Independent restaurant owners and managers",
    firstPaidOffer:
      "A weekly review-reply and specials-post generator for one local restaurant.",
    price: "$29/month",
    xPost:
      "Local restaurants do not need another dashboard.\n\nThey need repeat work removed.\n\nOffer: AI review replies + weekly specials posts\nBuyer: independent restaurants\nPrice: $29/mo\n48h test: send 10 owners a free sample using their latest reviews.",
    dmScript:
      "I made a quick sample for your restaurant: polite replies to recent reviews plus a weekly specials post. Want me to send it over?",
    validationPlan: [
      "Pick 10 restaurants with recent unanswered Google reviews.",
      "Generate 2 review replies and 1 specials post for each.",
      "Validate if 3 owners reply, 1 asks for weekly help, or 1 pays $29.",
    ],
  },
  {
    category: "Creator monetization tool",
    pattern:
      "Creators pay when their existing content can be repackaged into paid offers faster.",
    buyer: "Newsletter writers, X creators, and niche educators",
    firstPaidOffer:
      "A content-to-mini-product brief that turns 10 posts into one lead magnet, one paid offer, and launch copy.",
    price: "$19/report",
    xPost:
      "Creators already have the raw material.\n\nThe missing piece is packaging.\n\nOffer: turn 10 posts into a paid mini-product angle\nBuyer: niche creators\nPrice: $19/report\n48h test: roast 5 creator feeds and pitch the strongest offer.",
    dmScript:
      "I looked at your content and think there is a small paid offer hiding in it. Want me to send a free mini-brief with the angle, price, and launch post?",
    validationPlan: [
      "Choose 5 creators with clear audience pain and consistent posting.",
      "Write one free product angle from their recent content.",
      "Validate if 2 request the full brief or 1 pays $19.",
    ],
  },
  {
    category: "SaaS churn/revenue tool",
    pattern:
      "SaaS teams pay for tools that reveal churn risk, expansion signals, or revenue leaks from existing customer data.",
    buyer: "Bootstrapped SaaS founders and customer success leads",
    firstPaidOffer:
      "A churn-risk teardown that turns cancellation notes and support tickets into retention actions.",
    price: "$99 one-time",
    xPost:
      "Small SaaS teams do not need more analytics.\n\nThey need to know why users are leaving.\n\nOffer: churn-risk teardown from support tickets + cancel notes\nBuyer: bootstrapped SaaS founders\nPrice: $99\n48h test: offer 3 free teardowns, sell the next one.",
    dmScript:
      "I am testing a churn-risk teardown for small SaaS teams. If you send 10 anonymized support or cancellation notes, I will show the top retention fixes. Want a free sample?",
    validationPlan: [
      "Find 15 SaaS founders discussing churn, activation, or retention.",
      "Offer 3 free anonymized teardowns with a clear before/after output.",
      "Validate if 2 send data or 1 agrees to pay $99 for the full report.",
    ],
  },
  {
    category: "Freelancer client-getting tool",
    pattern:
      "Freelancers pay for client-getting systems that turn vague outreach into specific, buyer-ready messages.",
    buyer: "Freelancers, consultants, and solo agencies",
    firstPaidOffer:
      "A client-getting prompt system that creates niche-specific cold DMs, follow-ups, and offer angles.",
    price: "$29/month",
    xPost:
      "Freelancers do not need 100 generic leads.\n\nThey need one sharper offer and better first messages.\n\nOffer: niche cold DM + follow-up prompt system\nBuyer: freelancers\nPrice: $29/mo\n48h test: rewrite 10 bad pitches and sell the template.",
    dmScript:
      "I am testing a small client-getting prompt system for freelancers. Send me your niche and current pitch, and I will rewrite it into a sharper buyer-specific DM.",
    validationPlan: [
      "Find 20 freelancers posting about slow leads or weak outreach.",
      "Rewrite 5 pitches for free as proof assets.",
      "Validate if 3 ask for the template or 1 pays $29 for the system.",
    ],
  },
];

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-100">{value}</p>
    </div>
  );
}

function BriefCard({ brief, index }: { brief: ShowcaseBrief; index: number }) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-[#101110] shadow-2xl shadow-black/25">
      <div className="border-b border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-200">
              Example {index + 1}
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
              {brief.category}
            </h2>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-right">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-500">
              Price
            </div>
            <div className="mt-1 text-sm font-black text-emerald-200">
              {brief.price}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5">
        <DetailBlock label="Pattern" value={brief.pattern} />
        <DetailBlock label="Buyer" value={brief.buyer} />
        <DetailBlock label="First paid offer" value={brief.firstPaidOffer} />
        <DetailBlock label="X post" value={brief.xPost} />
        <DetailBlock label="DM script" value={brief.dmScript} />

        <div className="rounded-lg border border-white/10 bg-black/25 p-4">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500">
            48h validation plan
          </div>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-zinc-100">
            {brief.validationPlan.map((step, stepIndex) => (
              <li key={step} className="flex gap-3">
                <span className="text-zinc-500">{stepIndex + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <Link
          href="/app"
          className="mt-1 inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
        >
          Generate your own brief
        </Link>
      </div>
    </article>
  );
}

function CompactPatternCard({ pattern }: { pattern: (typeof patternLibrary)[number] }) {
  return (
    <article className="min-w-[260px] rounded-lg border border-white/10 bg-black/25 p-4 sm:min-w-0">
      <h3 className="text-base font-black leading-6 text-white">{pattern.title}</h3>
      <div className="mt-3 grid gap-2 text-sm leading-5">
        <div className="flex justify-between gap-3">
          <span className="text-zinc-500">Revenue</span>
          <span className="font-bold text-emerald-200">{pattern.revenueSignal}</span>
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
            Buyer
          </div>
          <p className="mt-1 text-zinc-300">{pattern.buyer}</p>
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
            Pain
          </div>
          <p className="mt-1 text-zinc-300">{pattern.pain}</p>
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
            Channel
          </div>
          <p className="mt-1 text-zinc-300">{pattern.channel}</p>
        </div>
      </div>
      <Link
        href={`/app?pattern=${pattern.slug}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/[0.04]"
      >
        Generate my version
      </Link>
    </article>
  );
}

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#070707] text-zinc-100">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.18),transparent_30%),linear-gradient(180deg,#101110,#070707)]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-base font-black text-black">
                B
              </div>
              <div>
                <div className="text-lg font-black text-white">Bilion</div>
                <div className="text-xs text-zinc-500">Opportunity Briefs</div>
              </div>
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Open app
            </Link>
          </header>

          <div className="py-12 sm:py-16">
            <div className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
              5 example briefs
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Know what sells before you build.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
              Bilion turns proven success patterns into concrete offers, launch
              copy, DM scripts, validation plans, and build prompts.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
              >
                Generate your own brief
              </Link>
              <div className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-zinc-300">
                Built for AI builders, indie hackers, and people selling before
                they ship.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-[#101110] p-5">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Pattern Library
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                Browse proven business patterns
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Bilion turns real success stories into sell-before-you-build
                briefs.
              </p>
            </div>
            <Link href="/app" className="text-sm font-black text-zinc-400 hover:text-white">
              Generate my version
            </Link>
          </div>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-5">
            {patternLibrary.map((pattern) => (
              <CompactPatternCard key={pattern.title} pattern={pattern} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {showcaseBriefs.map((brief, index) => (
            <BriefCard key={brief.category} brief={brief} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.06] p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Stop collecting ideas. Start testing offers.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
                Use Bilion to turn a success pattern into a first paid offer,
                sales copy, and a 48-hour validation plan.
              </p>
            </div>
            <Link
              href="/app"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
            >
              Generate your own brief
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
