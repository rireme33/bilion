import Link from "next/link";

const steps = [
  {
    title: "シグナルを見る",
    text: "AI活用事例、GitHubトレンド、市場の動きを読む。",
  },
  {
    title: "商品案に変換する",
    text: "買う相手、痛み、価格、最初に作る形を決める。",
  },
  {
    title: "プロンプトをコピーする",
    text: "Code X、Codex、Cursor、Claude Code、Lovableに貼る。",
  },
];

const previewFields = [
  ["シグナル", "AIビルダーの間でGitHubプロジェクトが伸びている。"],
  ["買う相手", "CodexやCursorを使えるが、何を作れば売れるかわからない人。"],
  ["商品案", "GitHub Signal Lab"],
  ["価格", "$19 買い切り"],
  ["次の行動", "30秒のデモ動画を投稿し、反応したビルダーにページを送る。"],
];

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-black/30 p-1 text-xs font-semibold text-zinc-500">
      <Link href="/" className="rounded-full px-3 py-1.5 transition hover:text-white">
        英語
      </Link>
      <span className="rounded-full bg-white px-3 py-1.5 text-black">日本語</span>
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
        {index}
      </div>
      <h3 className="mt-3 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
    </div>
  );
}

export default function JapaneseLandingPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-5xl px-5 py-5 sm:px-6 md:py-7">
        <header className="flex items-center justify-between gap-4">
          <Link href="/jp" className="group flex items-center gap-3">
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
              商品シグナルエンジン
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
              作る前に、売れるものを決める。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
              Bilionは、実際のAI活用事例から、小型商品案・買う相手・価格・Code X用プロンプトを作ります。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app">今日のシグナルを見る</ButtonLink>
              <ButtonLink href="/founder" variant="secondary">
                Founder Accessを見る
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                使い方
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                シグナルを、商品仕様に変える。
              </h2>
            </div>
            <Link href="/showcase" className="text-sm font-semibold text-zinc-400 hover:text-white">
              デモを見る
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
                出力例
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                アイデア一覧ではなく、次に動ける形で出す。
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                検証、販売、実装に進める粒度まで絞ります。
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
                  完成版の実装プロンプトを見る。
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  Founder Accessでは、買う相手、痛み、価格、検証手順、実装プロンプトまで確認できます。
                </p>
              </div>
              <ButtonLink href="/founder">Founder Accessを見る</ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-14 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight">
            情報収集を終えて、1つ作るものを決める。
          </h2>
          <div className="mt-7 flex justify-center">
            <ButtonLink href="/app">今日のシグナルを見る</ButtonLink>
          </div>
        </section>
      </section>
    </main>
  );
}
