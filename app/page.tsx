import Link from "next/link";

const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "#";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto flex max-w-6xl flex-col px-6 pb-20 pt-6 md:pb-28">
        <header className="mb-16 flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white text-lg font-black text-black">
              B
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">by Build Decision</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            <a
              href="/products"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
            >
              Products
            </a>

            <a
              href="/app"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
            >
              Try Free
            </a>

            <a
              href={CHECKOUT_URL}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Unlock Founder Access — $19
            </a>
          </nav>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              47,000+ Founder Stories
            </div>

            <div className="mt-8">
              <div className="text-lg font-bold uppercase tracking-[0.35em] text-zinc-500">
                Bilion
              </div>

              <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                Know what to build before you build.
              </h1>
            </div>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Built from 47,000+ founder stories.
              <br />
              <br />
              Not random ideas.
              <br />
              <br />
              Every signal comes from a real founder, operator, or AI use case.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/app"
                className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                Try Bilion Free
              </a>

              <a
                href={CHECKOUT_URL}
                className="rounded-2xl border border-white/10 px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04]"
              >
                Unlock Founder Access — $19
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-500">
              <span className="rounded-full border border-white/10 px-3 py-1">
                For Codex users
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                For Cursor builders
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                For solo AI builders
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl">
            <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Free preview
            </div>

            <h2 className="text-3xl font-black">
              Try the Build Prompt Engine for free.
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Bilion returns one practical AI usage signal and a small tool you
              can build in Code X.
            </p>

            <div className="mt-6 space-y-3">
              <PreviewItem
                label="Latest Signal"
                value="Japanese farmer uses ChatGPT and Codex to automate farm operations"
              />
              <PreviewItem
                label="What Happened"
                value="He used ChatGPT and Codex as an always-available engineer for real farm operations."
              />
              <PreviewItem
                label="What You Can Build"
                value="A LINE-based operations bot for small farms or local field businesses."
              />
            </div>

            <a
              href="/app"
              className="mt-6 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Open Build Prompt Engine
            </a>
          </div>
        </div>

        <section className="mt-24 grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Stop guessing"
            text="Most AI builders can ship fast now. The bottleneck is choosing what is worth building."
          />
          <FeatureCard
            title="Start from signals"
            text="Bilion turns founder and product patterns into small product opportunities."
          />
          <FeatureCard
            title="Build today"
            text="Free shows the signal. Founder Access unlocks core features, build steps, and the full Code X Prompt."
          />
        </section>

        <section className="mt-24">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">
                Showcase preview
              </div>
              <h2 className="mt-5 text-4xl font-black tracking-tight">
                What Bilion Creates
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
                Real AI signals turned into demo products.
              </p>
            </div>

            <a
              href="/showcase"
              className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/[0.04]"
            >
              See all demos
            </a>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ShowcasePreviewCard
              title="Video Pattern Lab"
              text="Upload a short-form video and extract why it works."
              revenue="$19 one-time or $49 creator lab"
              href="/video-pattern-lab"
              thumbnail="/showcase/video-pattern-lab.png"
            />
            <ShowcasePreviewCard
              title="Review Reply Copilot"
              text="Turn local customer reviews into reply options and a service offer."
              revenue="$500 setup + $150/month"
              href="/done-for-you-local-review-reply-copilot-outputs-setup"
              thumbnail="/showcase/review-reply-copilot.png"
            />
            <ShowcasePreviewCard
              title="Short Video Pattern Analyzer"
              text="Turn messy video notes into hooks, patterns, and scripts."
              revenue="$19 pattern pack or $49/month creator lab"
              href="/short-video-pattern-analyzer"
              thumbnail="/showcase/short-video-pattern-analyzer.png"
            />
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-3xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(16,16,17,1)_42%,rgba(250,204,21,0.08))] p-6 shadow-2xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Featured Signal Lab
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                GitHub Signal Lab
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">
                Turn GitHub repos, issues, pull requests, and maintainer
                comments into buyer pain, product opportunities, validation
                plans, outreach copy, and Code X build prompts.
              </p>
              <p className="mt-3 text-sm font-semibold text-cyan-100">
                Use repo activity as a market signal before deciding what to
                build.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/github-signal-lab"
                  className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
                >
                  Open GitHub Signal Lab
                </a>
                <a
                  href="/showcase"
                  className="rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04]"
                >
                  View Showcase
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="grid gap-3">
                {[
                  ["Repo signal", "Repeated setup issues, PR bottlenecks, integration gaps"],
                  ["Buyer pain", "Who hurts, why now, and what keeps repeating"],
                  ["Code X prompt", "A narrow product build prompt from the signal"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-cyan-200">
                      {label}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-zinc-200">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 rounded-3xl border border-white/10 bg-[#101011] p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                Free vs Founder Access
              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight">
                Free shows the signal. Founder Access shows the full build
                prompt.
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Bilion is designed to make the free preview useful, but the
                full Code X Prompt stays behind Founder Access.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <PlanCard
                title="Free"
                price="$0"
                items={[
                  "Latest Signal",
                  "What Happened",
                  "What You Can Build",
                  "Why It's Useful",
                ]}
                cta="Try Free"
                href="/app"
              />

              <PlanCard
                title="Founder Access"
                price="$19"
                highlight
                items={[
                  "Latest Signal",
                  "What You Can Build",
                  "Core Features",
                  "Comparable Price",
                  "Build Steps",
                  "Code X Prompt",
                ]}
                cta="Unlock Founder Access"
                href={CHECKOUT_URL}
              />
            </div>
          </div>
        </section>

        <section className="mt-24 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">
            Bilion by Build Decision
          </div>

          <h2 className="text-4xl font-black tracking-tight">
            Build from buyer pain, not random inspiration.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Use Bilion when you can build with AI, but you are stuck choosing
            what to build next.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/app"
              className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Try Bilion Free
            </a>

            <a
              href={CHECKOUT_URL}
              className="rounded-2xl border border-white/10 px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04]"
            >
              Unlock Founder Access — $19
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#101011] p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
    </div>
  );
}

function ShowcasePreviewCard({
  title,
  text,
  revenue,
  href,
  thumbnail,
}: {
  title: string;
  text: string;
  revenue: string;
  href: string;
  thumbnail: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#101011] p-6">
      <img
        src={thumbnail}
        alt={`${title} screenshot`}
        className="mb-5 aspect-video w-full rounded-2xl border border-white/10 object-cover"
      />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-3">
        <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Revenue idea
        </div>
        <div className="mt-2 text-sm font-semibold text-zinc-100">
          {revenue}
        </div>
      </div>
      <a
        href={href}
        className="mt-5 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
      >
        Open Demo
      </a>
    </div>
  );
}

function PlanCard({
  title,
  price,
  items,
  cta,
  href,
  highlight,
}: {
  title: string;
  price: string;
  items: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-6",
        highlight
          ? "border-yellow-400/30 bg-yellow-400/[0.04]"
          : "border-white/10 bg-black/40",
      ].join(" ")}
    >
      <div className="text-sm font-bold text-zinc-400">{title}</div>
      <div className="mt-3 text-4xl font-black">{price}</div>

      <ul className="mt-6 space-y-3 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-emerald-300">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        className={[
          "mt-6 block rounded-2xl px-5 py-4 text-center text-sm font-bold transition",
          highlight
            ? "bg-white text-black hover:bg-zinc-200"
            : "border border-white/10 text-white hover:bg-white/[0.04]",
        ].join(" ")}
      >
        {cta}
      </a>
    </div>
  );
}
