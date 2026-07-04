import Link from "next/link";

const benefits = [
  {
    title: "毎日のMoney Move",
    text: "すでにお金が動いた事業・ワークフロー・販売例から、今日試せる動きを見つけます。",
  },
  {
    title: "自分の形に変換",
    text: "買う相手、痛み、初回オファー、価格、投稿/DMの角度まで整理します。",
  },
  {
    title: "検証後にBuild",
    text: "返信、保存、クリック、購入意思が出たあとにだけ、Codexで作るためのBuildプランへ進みます。",
  },
];

const previewFields = [
  ["Money Move", "小規模不動産管理会社が、入居・修理依頼・緊急度判断をAIで整理している。"],
  ["誰が買うか", "20〜200戸を管理する小規模不動産管理会社"],
  ["痛み", "LINE、メール、電話メモに依頼が散らばり、緊急度判断と業者への指示作成に毎回時間がかかる。"],
  ["初回オファー", "$299 setup + $29/month"],
  ["今日の行動", "20社に before/after サンプルを送り、同じ整理を有料で欲しいか確認する。"],
];

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium text-zinc-500">
      <Link href="/" className="rounded-full px-3 py-1.5 transition hover:text-white">
        English
      </Link>
      <span className="rounded-full bg-white text-zinc-950 px-3 py-1.5">日本語</span>
    </div>
  );
}

function ButtonLink({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-white text-zinc-950 hover:bg-zinc-200"
          : "border border-white/10 text-zinc-200 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function OutputPreview() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111214] p-5 shadow-2xl shadow-black/20 md:p-6">
      <div className="text-xs font-semibold tracking-[0.18em] text-emerald-300">
        TODAY&apos;S MONEY MOVE
      </div>
      <div className="mt-4 space-y-3">
        {previewFields.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs font-semibold text-zinc-500">{label}</div>
            <div className="mt-1 text-sm leading-6 text-zinc-100">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JapaneseHomePage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden bg-[#0b0c0e] px-4 text-white sm:px-6">
      <section className="mx-auto w-full max-w-6xl overflow-hidden">
        <header className="flex min-w-0 items-center justify-between gap-4 py-5">
          <Link href="/jp" className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-black tracking-tight">Bilion</div>
              <div className="truncate text-xs text-zinc-500">Money Move Feed</div>
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
              今日、お金はどこで動いた？
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              Bilionは、すでに人がお金を払った事業例を見つけ、あなたの買う相手・オファー・投稿・DM・検証プランに変換します。
            </p>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-emerald-200">
              作るのは、返信や購入意思が出たあと。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/jp/app">今日のMoney Moveを見る</ButtonLink>
              <ButtonLink href="/jp/founder" variant="secondary">
                Bilion Proを見る
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
                調べるより、今日試すための材料を出す。
              </h2>
            </div>
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
                  アクセス
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Freeで試して、Proで毎日探す。
                </h2>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-zinc-500 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <div className="font-semibold text-zinc-100">Free</div>
                    <div className="mt-1">1日3件まで無料Money Move</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <div className="font-semibold text-zinc-100">Bilion Pro</div>
                    <div className="mt-1">$9.99/月</div>
                    <div className="mt-1">
                      Money Moveの無制限閲覧、追加バージョン、保存、検証後のBuildプラン
                    </div>
                  </div>
                </div>
              </div>
              <ButtonLink href="/jp/app">今日のMoney Moveを見る</ButtonLink>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
