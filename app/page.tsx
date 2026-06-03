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
              100 curated money patterns
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
              Built from 47,000+ founder-source URLs. Bilion helps AI builders
              find what to build, who to sell to, and how to validate it fast.
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
              Try the Money Pattern Explorer for free.
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Pick what you can build and who you want to sell to. Bilion
              returns one launchable opportunity with buyer, pain, and a tiny
              MVP.
            </p>

            <div className="mt-6 space-y-3">
              <PreviewItem
                label="Opportunity"
                value="Local Review Reply Assistant"
              />
              <PreviewItem label="Buyer" value="Local businesses" />
              <PreviewItem
                label="Pain"
                value="Owners know reviews matter but do not have time to write consistent replies."
              />
              <PreviewItem
                label="Tiny MVP"
                value="Paste a customer review → get 3 reply options in the store's tone."
              />
            </div>

            <a
              href="/app"
              className="mt-6 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Open Money Pattern Explorer
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
            title="Validate fast"
            text="Free shows the opportunity. Founder Access unlocks prompts, copy, pricing, DM scripts, and a 48h validation plan."
          />
        </section>

        <section className="mt-24 rounded-3xl border border-white/10 bg-[#101011] p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                Free vs Founder Access
              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight">
                Free shows the opportunity. Founder Access shows how to launch
                it.
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Bilion is designed to make the free result useful, but not
                complete. If the opportunity looks promising, Founder Access
                gives the execution package.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <PlanCard
                title="Free"
                price="$0"
                items={[
                  "1 opportunity preview",
                  "Buyer",
                  "Pain",
                  "Why now",
                  "Tiny MVP",
                ]}
                cta="Try Free"
                href="/app"
              />

              <PlanCard
                title="Founder Access"
                price="$19"
                highlight
                items={[
                  "Codex-ready prompt",
                  "Landing page copy",
                  "Pricing strategy",
                  "X launch posts",
                  "Cold DM script",
                  "48h validation plan",
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
