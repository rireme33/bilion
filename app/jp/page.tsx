import Link from "next/link";

const problems = [
  "AIツール情報を追っても、結局なにを作ればいいかわからない",
  "GitHubや海外事例を見ても、自分の商品に変換できない",
  "生成AIで作れるものは増えたが、売れるテーマ選定が難しい",
  "リサーチだけ増えて、LP・デモ・販売まで進まない",
];

const steps = [
  {
    title: "海外シグナルを読む",
    text: "実際に使われているAI活用例、伸びているツール、GitHubトレンドをもとに判断。",
  },
  {
    title: "買う相手を決める",
    text: "誰が困っていて、なぜ今買うのかを明確化。",
  },
  {
    title: "小型商品に変換する",
    text: "Micro SaaS、AI workflow、Prompt pack、Agency service などに落とし込む。",
  },
  {
    title: "Code Xプロンプトを出す",
    text: "そのままCode X / Codex / Cursorに貼れる実装仕様を生成。",
  },
];

const antiPositioning = [
  "根拠のない「稼げる副業」ではない",
  "汎用プロンプト集ではない",
  "アイデアを眺めるだけのDBではない",
  "作って売るためのビジネス変換ツール",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
      {children}
    </div>
  );
}

function CTAButton({
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
        "rounded-2xl px-6 py-4 text-center text-sm font-bold transition",
        variant === "primary"
          ? "bg-white text-black hover:bg-zinc-200"
          : "border border-white/10 text-white hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function JapaneseLandingPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-6xl px-6 py-6 md:py-8">
        <header className="mb-16 flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white text-lg font-black text-black">
              B
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">日本語エントリー</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            <Link
              href="/app"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
            >
              無料で見る
            </Link>
            <Link
              href="/founder"
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Founder Access
            </Link>
          </nav>
        </header>

        <section className="grid gap-10 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center md:pb-28">
          <div>
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              海外AIシグナルから、作る商品を決める
            </div>
            <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
              「AIで何を作れば売れるか」を、先に決める。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
              Bilionは、海外のAI活用事例・GitHubトレンド・成功シグナルをもとに、売れる小型AIツール案とCode X用プロンプトを生成します。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/app">無料でシグナルを見る</CTAButton>
              <CTAButton href="/founder" variant="secondary">
                Founder Accessを見る
              </CTAButton>
            </div>
            <p className="mt-6 text-sm font-semibold text-zinc-500">
              Codex / Code X / Cursor / Claude Code / Lovable ユーザー向け
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl shadow-black/40">
            <div className="mb-4 inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              Bilion Output
            </div>
            <h2 className="text-3xl font-black">シグナルを、実装仕様に変換。</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Signal", "GitHubで伸びているAI自動化リポジトリ"],
                ["Buyer", "Codex / Cursor を使う個人開発者"],
                ["Product", "小型AIワークフロー商品"],
                ["Prompt", "Code Xに貼れる実装プロンプト"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {label}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <SectionLabel>Problem</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight">
            作れるのに、売れるものが決まらない。
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {problems.map((problem) => (
              <div key={problem} className="rounded-3xl border border-white/10 bg-[#101011] p-6">
                <p className="text-sm leading-7 text-zinc-300">{problem}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <SectionLabel>Product</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight">Bilionがやること</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-[#101011] p-6">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <SectionLabel>Demo Preview</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight">出力イメージ</h2>
          <div className="mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(16,16,17,1)_42%,rgba(250,204,21,0.08))] p-6 shadow-2xl md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                  Example Signal
                </div>
                <p className="mt-4 text-2xl font-black leading-10">
                  伸びているGitHubリポジトリをもとに、AIビルダー向けの小型商品を作る。
                </p>
              </div>
              <div className="grid gap-3">
                {[
                  ["Buyer", "Codex / Cursor を使う個人開発者"],
                  ["Pain", "作れるが、売れるテーマを選べない"],
                  ["Product", "GitHub Signal Lab"],
                  ["Price", "$19 one-time"],
                  ["First Build", "GitHubトレンドを商品案と実装プロンプトに変換する1ページツール"],
                  ["48h Validation", "Xでデモ動画を投稿し、反応したAIビルダーへDM"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      {label}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-3xl border border-white/10 bg-[#101011] p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <SectionLabel>Access</SectionLabel>
                <h2 className="mt-5 text-4xl font-black tracking-tight">Founder Access</h2>
                <p className="mt-4 max-w-3xl text-sm leading-8 text-zinc-400">
                  無料版では最新シグナルのプレビューを確認できます。Founder Accessでは、買う相手、痛み、価格、48時間検証プラン、Code X用マスタープロンプトまで表示できます。
                </p>
              </div>
              <CTAButton href="/founder">Founder Accessを見る</CTAButton>
            </div>
          </div>
        </section>

        <section className="py-16">
          <SectionLabel>Positioning</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight">
            これは、AI副業ネタ集ではありません。
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {antiPositioning.map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <p className="text-sm font-semibold leading-7 text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400">
            Bilion by Build Decision
          </div>
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            情報収集を終わらせて、作るものを決める。
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CTAButton href="/app">Bilionを試す</CTAButton>
            <CTAButton href="/founder" variant="secondary">
              Founder Accessを見る
            </CTAButton>
          </div>
        </section>
      </section>
    </main>
  );
}
