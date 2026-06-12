import Link from "next/link";

const steps = [
  {
    title: "Pick a signal",
    text: "Real AI use cases, GitHub trends, and market signals.",
  },
  {
    title: "See the product angle",
    text: "Buyer, pain, price, and first version.",
  },
  {
    title: "Copy the build prompt",
    text: "Paste the prompt into Code X, Codex, Cursor, Claude Code, or Lovable.",
  },
];

const previewFields = [
  ["Signal", "A GitHub project is getting attention from AI builders."],
  ["Buyer", "Codex and Cursor users who can build but do not know what to build."],
  ["Product", "GitHub Signal Lab"],
  ["Price", "$19 one-time"],
  ["Next action", "Post a 30-second demo and send the page to builders who reply."],
];

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-black/30 p-1 text-xs font-semibold text-zinc-500">
      <span className="rounded-full bg-white px-3 py-1.5 text-black">English</span>
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
          ? "bg-white text-black hover:bg-zinc-200"
          : "border border-white/10 text-white hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function StepCard({ title, text, index }: { title: string; text: string; index: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101011] p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        Step {index}
      </div>
      <h3 className="mt-3 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-5xl px-5 py-5 sm:px-6 md:py-7">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-black text-black">
              B
            </div>
            <div>
              <div className="text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">Build Decision</div>
            </div>
          </Link>
          <LanguageSwitch />
        </header>

        <section className="py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Product signal engine
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Know what to build before you build.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
              Bilion turns real AI adoption signals into small product ideas, buyer angles,
              prices, and build-ready prompts.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app">View today&apos;s signal</ButtonLink>
              <ButtonLink href="/founder" variant="secondary">
                See Founder Access
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                How it works
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                From signal to product brief.
              </h2>
            </div>
            <Link href="/showcase" className="text-sm font-semibold text-zinc-400 hover:text-white">
              View product demos
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {steps.map((step, index) => (
              <StepCard key={step.title} index={index + 1} title={step.title} text={step.text} />
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Output preview
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                A practical output, not an idea dump.
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                Bilion keeps the output narrow enough to validate, sell, and build.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#101011] p-5">
              <div className="grid gap-3">
                {previewFields.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/35 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {label}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <div className="rounded-2xl border border-white/10 bg-[#101011] p-6 md:p-7">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Founder Access
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Unlock the full build prompt.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  Founder Access shows the buyer, pain, price, validation plan, and
                  complete prompt for building the product.
                </p>
              </div>
              <ButtonLink href="/founder">See Founder Access</ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-14 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight">
            Stop collecting ideas. Pick one signal and build.
          </h2>
          <div className="mt-7 flex justify-center">
            <ButtonLink href="/app">View today&apos;s signal</ButtonLink>
          </div>
        </section>
      </section>
    </main>
  );
}
