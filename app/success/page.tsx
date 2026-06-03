import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-16 text-white">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-[#101011] p-8 shadow-2xl">
          <div className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Bilion Pro
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            Welcome to Bilion Pro.
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-400">
            Thanks for buying Bilion Pro. Use the access code from your purchase
            email to unlock the Launch Pack in this browser.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
            <h2 className="text-xl font-bold">Unlock paid access</h2>

            <form action="/api/paid/access" className="mt-4 grid gap-3">
              <label className="block">
                <span className="text-sm font-bold text-zinc-300">
                  Access code
                </span>
                <input
                  name="access"
                  type="password"
                  autoComplete="off"
                  placeholder="Paste your Bilion access code"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/40"
                />
              </label>

              {error === "invalid_paid_access" && (
                <p className="text-sm text-red-400">
                  That access code did not match. Please check the code and try
                  again.
                </p>
              )}

              <button
                type="submit"
                className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                Unlock Launch Pack
              </button>
            </form>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
            <h2 className="text-xl font-bold">Next steps</h2>

            <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>1. Enter your access code above.</li>
              <li>2. Generate one build idea in the Bilion app.</li>
              <li>
                3. Use the unlocked Launch Pack to turn it into a product,
                prompt, sales copy, and 48-hour validation plan.
              </li>
            </ol>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              href="/app"
              className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Open Bilion App
            </Link>

            <a
              href="mailto:rireme33@gmail.com"
              className="rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04]"
            >
              Need help?
            </a>
          </div>

          <p className="mt-6 text-xs leading-5 text-zinc-600">
            Early access note: Bilion Pro is still being improved. Your purchase
            gives you access to the early Pro workflow and future early-access
            improvements.
          </p>
        </div>
      </section>
    </main>
  );
}
