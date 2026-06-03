import Link from "next/link";

const products = [
  {
    name: "ReplyTask",
    buyer: "solopreneurs",
    pain: "messy emails create mental drag",
    whatItDoes: "turns one messy email into a reply and next task",
    price: "$9",
    status: "testing",
    cta: "View product",
    href: "/reply-task",
  },
  {
    name: "Founder Launch Kit",
    buyer: "AI builders / vibe coders",
    pain: "can build but do not know what to build",
    whatItDoes:
      "turns one real startup win into product idea, landing copy, X posts, DM scripts, and a 48-hour launch plan",
    price: "$9 early access",
    status: "owner mode",
    cta: "Founder Mode",
    href: "/founder",
  },
  {
    name: "Goldmine Match",
    buyer: "AI builders",
    pain: "too many ideas, no market signal",
    whatItDoes: "matches builders to proof-backed AI business ideas",
    price: "free preview",
    status: "live",
    cta: "Try free match",
    href: "/goldmine",
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-14">
        <header className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-semibold text-zinc-500 transition hover:text-white"
            >
              Back to Bilion
            </Link>

            <div className="mt-8 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              Built with Bilion
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Small products born from real market signals.
            </h1>
          </div>

          <p className="max-w-md text-sm leading-7 text-zinc-400">
            If you can use AI coding tools, you can build small products too.
            Bilion helps you start from a buyer, a pain, and a simple proof-backed
            idea.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="flex min-h-[420px] flex-col rounded-2xl border border-white/10 bg-[#101011] p-5 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-black tracking-tight">
                  {product.name}
                </h2>
                <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-400">
                  {product.status}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <ProductField label="Buyer" value={product.buyer} />
                <ProductField label="Pain" value={product.pain} />
                <ProductField label="What it does" value={product.whatItDoes} />
                <ProductField label="Price" value={product.price} />
              </div>

              <a
                href={product.href}
                className="mt-auto block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                {product.cta}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="/goldmine"
            className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Try Goldmine Free
          </a>
          <a
            href="/founder"
            className="rounded-2xl border border-white/10 px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04]"
          >
            Owner / Founder Mode
          </a>
        </div>
      </section>
    </main>
  );
}

function ProductField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{value}</p>
    </div>
  );
}
