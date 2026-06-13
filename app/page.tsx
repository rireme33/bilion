import Link from "next/link";

const benefits = [
  {
    title: "Signal",
    text: "Real AI use cases, GitHub trends, and market movement.",
  },
  {
    title: "Buyer",
    text: "Who has the pain, why they buy, and what to charge.",
  },
  {
    title: "Build prompt",
    text: "A clear prompt you can paste into Code X, Codex, Cursor, Claude Code, or Lovable.",
  },
];

const previewFields = [
  ["Signal", "A GitHub project is getting attention from AI builders."],
  ["Buyer", "Codex and Cursor users who can build but do not know what to build."],
  ["Product", "GitHub Signal Lab"],
  ["Next action", "Post a 30-second demo and send the page to builders who reply."],
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

function OutputPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111214] p-5 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Output
          </div>
          <h2 className="mt-1 text-lg font-semibold text-white">Today&apos;s signal</h2>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Ready
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {previewFields.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-3.5">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {label}
            </div>
            <div className="mt-1.5 text-sm leading-6 text-zinc-100">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0c0e] text-white">
      <section className="mx-auto max-w-6xl px-5 py-5 sm:px-6 md:py-7">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div>
              <div className="text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">Product signals for AI builders</div>
            </div>
          </Link>
          <LanguageSwitch />
        </header>

        <section className="grid gap-8 py-14 md:py-18 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              For AI builders
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Find a product worth building.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              Bilion turns real AI use cases and GitHub signals into a buyer, price,
              validation plan, and build-ready prompt.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app">View today&apos;s signal</ButtonLink>
              <ButtonLink href="/founder" variant="secondary">
                See full prompt access
              </ButtonLink>
            </div>
          </div>
          <OutputPreview />
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                What Bilion gives you
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                The parts you need to decide and ship.
              </h2>
            </div>
            <Link href="/showcase" className="text-sm font-semibold text-zinc-400 hover:text-white">
              View product demos
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {benefits.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-[#111214] p-5">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="rounded-2xl border border-white/10 bg-[#111214] p-6 md:p-7">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Access
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Free preview, paid build output.
                </h2>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-zinc-500 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <div className="font-semibold text-zinc-100">Free</div>
                    <div className="mt-1">Free daily Master Prompt</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <div className="font-semibold text-zinc-100">Full Prompt Access</div>
                    <div className="mt-1">$19 one-time</div>
                    <div className="mt-1">
                      Buyer, pain, price, validation plan, and full build prompt
                    </div>
                  </div>
                </div>
              </div>
              <ButtonLink href="/app">View today&apos;s signal</ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-12 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight">
            Pick one signal. Build one product.
          </h2>
          <div className="mt-7 flex justify-center">
            <ButtonLink href="/app">View today&apos;s signal</ButtonLink>
          </div>
        </section>
      </section>
    </main>
  );
}
