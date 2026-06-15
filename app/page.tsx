import Link from "next/link";

const proofItems = [
  "20 curated signals",
  "100 candidate signals",
  "5 product demos",
  "GitHub Signal Lab",
];

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

export default function HomePage() {
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
              Market Signal to Build Brief
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Find a product worth building.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
              Bilion turns Indie Hacker stories and GitHub signals into buyer pain, revenue
              signals, validation plans, Build Briefs, and implementation prompts.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app">Generate Build Brief</ButtonLink>
              <ButtonLink href="/showcase" variant="secondary">
                View Showcase
              </ButtonLink>
            </div>
            <Link
              href="/github-signal-lab"
              className="mt-5 inline-flex text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
            >
              Open GitHub Signal Lab
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {proofItems.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-zinc-100">{item}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Showcase Demo
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Products built from Bilion signals.
              </h2>
            </div>
            <Link href="/showcase" className="text-sm font-semibold text-zinc-400 hover:text-white">
              View all demos
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
                  Three free generations. Unlimited with Founder Access.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                  Free users can generate 3 total Build Briefs. Founder and paid users get unlimited
                  Market Signal, Product Opportunity, Build Brief, and Implementation Prompt output.
                </p>
              </div>
              <ButtonLink href="/app">Generate Build Brief</ButtonLink>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
