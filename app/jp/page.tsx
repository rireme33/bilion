import Link from "next/link";

const benefits = [
  {
    title: "シグナル",
    text: "AI活用事例、GitHubトレンド、市場の動き。",
  },
  {
    title: "買う相手",
    text: "誰が困っていて、なぜ買うのか、いくらで出すか。",
  },
  {
    title: "実装プロンプト",
    text: "Code X、Codex、Cursor、Claude Code、Lovableに貼れる仕様。",
  },
];

const previewFields = [
  ["シグナル", "AIビルダーの間でGitHubプロジェクトが伸びている。"],
  ["買う相手", "CodexやCursorを使えるが、何を作ればよいかわからない人。"],
  ["商品案", "GitHub Signal Lab"],
  ["次の行動", "30秒のデモを投稿し、反応したビルダーにページを送る。"],
];

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium text-zinc-500">
      <Link href="/" className="rounded-full px-3 py-1.5 transition hover:text-white">
        英語
      </Link>
      <span className="rounded-full bg-white px-3 py-1.5 text-zinc-950">日本語</span>
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
          <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">
            出力例
          </div>
          <h2 className="mt-1 text-lg font-semibold text-white">今日のシグナル</h2>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          表示中
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {previewFields.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-3.5">
            <div className="text-xs font-semibold tracking-wide text-zinc-500">
              {label}
            </div>
            <div className="mt-1.5 text-sm leading-6 text-zinc-100">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JapaneseLandingPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0e] text-white">
      <section className="mx-auto max-w-6xl px-5 py-5 sm:px-6 md:py-7">
        <header className="flex items-center justify-between gap-4">
          <Link href="/jp" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div>
              <div className="text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">AIビルダー向け商品シグナル</div>
            </div>
          </Link>
          <LanguageSwitch />
        </header>

        <section className="grid gap-8 py-14 md:py-18 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              AIビルダー向け
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              作るものを、ここで決める。
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              Bilionは、実際のAI活用事例とGitHubシグナルから、買う相手、価格、検証手順、実装プロンプトを出します。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app">今日のシグナルを見る</ButtonLink>
              <ButtonLink href="/founder" variant="secondary">
                実装プロンプトを見る
              </ButtonLink>
            </div>
          </div>
          <OutputPreview />
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
                Bilionでできること
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                判断して、作るための材料を出す。
              </h2>
            </div>
            <Link href="/showcase" className="text-sm font-semibold text-zinc-400 hover:text-white">
              事例を見る
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
                <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
                  有料アクセス
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  完成版の実装プロンプトを見る。
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  買う相手、痛み、価格、検証手順、実装プロンプトまで確認できます。
                </p>
              </div>
              <ButtonLink href="/founder">実装プロンプトを見る</ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-12 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight">
            1つのシグナルから、1つ作る。
          </h2>
          <div className="mt-7 flex justify-center">
            <ButtonLink href="/app">今日のシグナルを見る</ButtonLink>
          </div>
        </section>
      </section>
    </main>
  );
}
