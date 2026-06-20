import Link from "next/link";

type Idea = {
  name: string;
  buyer: string;
  pain: string;
  price: string;
  test48h: string;
};

const ideas: Idea[] = [
  {
    name: "Boring Niche SaaS Opportunity Finder",
    buyer: "AI builders and solo consultants",
    pain: "Too many AI ideas, not enough buyer-specific markets.",
    price: "$19/month or $49 one-time",
    test48h: "Post 5 sample opportunities, DM 20 builders, and offer a paid niche scan.",
  },
  {
    name: "Inbox-to-Opportunity Signal Extractor",
    buyer: "Founders, agencies, and newsletter-heavy creators",
    pain: "Useful market signals get lost before they become products.",
    price: "$29/month or $99 setup",
    test48h: "Ask 10 founders to paste 3 emails and review the extracted ideas.",
  },
  {
    name: "AI Bookkeeping Pre-Check Assistant",
    buyer: "Bookkeepers and small accounting firms",
    pain: "Client files arrive messy before bookkeeping can start.",
    price: "$49/month or $199 implementation",
    test48h: "Run manual pre-checks on 10 messy client folders and measure time saved.",
  },
  {
    name: "AI Business Skills Pack",
    buyer: "Non-technical operators",
    pain: "Generic AI courses do not translate into repeatable daily workflows.",
    price: "$29 one-time or $9/month",
    test48h: "Sell one role-specific pack and collect before/after workflow examples.",
  },
  {
    name: "AI Agency Offer Builder",
    buyer: "New AI automation agencies",
    pain: "They can build automations, but their offers sound generic.",
    price: "$49 one-time or $149 workshop",
    test48h: "Run 5 offer teardown calls and ask who will pay for a refined offer pack.",
  },
  {
    name: "Newsletter-to-Content Repurposer",
    buyer: "Solo creators and B2B founders",
    pain: "Saved newsletters rarely become consistent original content.",
    price: "$15/month or $39 batch kit",
    test48h: "Repurpose 3 newsletters into 15 posts for 5 creators and track usage.",
  },
  {
    name: "Founder Pain Signal Tracker",
    buyer: "Product builders researching small SaaS opportunities",
    pain: "Founder complaints are scattered across emails, communities, and comments.",
    price: "$25/month or $79 template",
    test48h: "Share 25 pain signals publicly and pre-sell the scored version.",
  },
  {
    name: "Product Hunt Trend Brief Generator",
    buyer: "Indie hackers and agencies watching launch trends",
    pain: "Launches show demand clues, but the patterns are hard to summarize.",
    price: "$12/month or $39/month filtered",
    test48h: "Publish 5 daily briefs and pre-sell a filtered version for one niche.",
  },
  {
    name: "AI Offer Audit Checklist",
    buyer: "Consultants selling AI services to small businesses",
    pain: "Their offers skip buyer specificity, proof, and implementation scope.",
    price: "$19 one-time or $99 private audit",
    test48h: "Audit 10 public offers, post anonymized fixes, and sell 3 private audits.",
  },
  {
    name: "Micro SaaS Validation Planner",
    buyer: "Builders who want to test an idea before coding",
    pain: "They start building before testing buyer interest or price.",
    price: "$9 one-time or $29/month",
    test48h: "Give the planner to 20 builders and track who completes outreach first.",
  },
];

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
        "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-white text-zinc-950 hover:bg-zinc-200"
          : "border border-white/10 text-zinc-100 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-zinc-200">{value}</p>
    </div>
  );
}

function IdeaRow({ idea, index }: { idea: Idea; index: number }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#111214] p-4 shadow-xl shadow-black/20 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white text-xs font-black text-zinc-950 sm:h-9 sm:w-9 sm:text-sm">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
            {idea.name}
          </h2>
          <div className="mt-4 grid gap-3">
            <Field label="Buyer" value={idea.buyer} />
            <Field label="Pain" value={idea.pain} />
            <Field label="Price" value={idea.price} />
            <Field label="48h test" value={idea.test48h} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function InboxIdeasLeadMagnetPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0e] text-white">
      <section className="mx-auto max-w-3xl px-4 py-5 sm:px-6 md:py-7">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div>
              <div className="text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">AI opportunity OS</div>
            </div>
          </Link>
          <Link
            href="/app"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.04] sm:px-4"
          >
            Open
          </Link>
        </header>

        <section className="border-b border-white/10 py-9 md:py-12">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Inbox signals
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            10 AI Business Ideas Hiding in Your Inbox
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
            A quick list from startup newsletters, Product Hunt digests, AI agency
            emails, and indie founder signals.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/">Explore Bilion</ButtonLink>
            <ButtonLink href="/app" variant="secondary">
              View today&apos;s signal
            </ButtonLink>
          </div>
        </section>

        <section className="grid gap-3 py-7 md:py-9">
          {ideas.map((idea, index) => (
            <IdeaRow key={idea.name} idea={idea} index={index} />
          ))}
        </section>

        <section className="border-t border-white/10 py-8">
          <div className="rounded-lg border border-white/10 bg-[#111214] p-5 md:p-6">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Built with Bilion
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Bilion turns newsletters, startup stories, and founder signals into
                  buildable AI business opportunities.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <ButtonLink href="/">Explore Bilion</ButtonLink>
                <ButtonLink href="/app" variant="secondary">
                  View today&apos;s signal
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
