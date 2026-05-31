export default function SuccessPage() {
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
            Thanks for buying Bilion Pro. Your license key has been sent to your
            email by Lemon Squeezy.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
            <h2 className="text-xl font-bold">Next steps</h2>

            <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>1. Save your license key from the Lemon Squeezy email.</li>
              <li>2. Open the Bilion app.</li>
              <li>3. Generate one build idea.</li>
              <li>
                4. Use the Pro Launch Pack section to turn it into a product,
                prompt, sales copy, and 48-hour validation plan.
              </li>
            </ol>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <a
              href="/app"
              className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Open Bilion App
            </a>

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