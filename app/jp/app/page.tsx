"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const FREE_DAILY_LIMIT_JP = 3;
const FREE_USAGE_STORAGE_KEY_JP = "bilion_free_usage_jp";

type SourceType = "github" | "indie";

type SourceOutput = {
  label: string;
  proof: string;
  title: string;
  businessFields: [string, string][];
  validationSteps: string[];
  masterPrompt: string;
};

const sourceOutputs: Record<SourceType, SourceOutput> = {
  indie: {
    label: "Indie Hackers DB",
    proof: "参照元 IH42kDB / Indie Hackers成功事例",
    title: "入居者修理依頼ルーター",
    businessFields: [
      [
        "シグナル",
        "Indie Hackersや海外小型SaaS事例では、ニッチ業務の手作業を小さなAIツールに変換して販売するパターンが繰り返し出ている。不動産管理では、入居者からの修理依頼を分類し、緊急度を判断し、業者向けの作業指示書に変換するニーズがある。",
      ],
      ["何が金になるか", "入居者修理依頼ルーター"],
      ["誰が買うか", "20〜300戸を管理する小規模不動産管理会社"],
      [
        "どんな痛みを解決するか",
        "入居者の修理依頼がLINE、メール、電話メモに散らばり、緊急度判断と業者への作業指示作成に毎回10〜20分かかる。",
      ],
      [
        "何を売るか",
        "入居者メッセージを貼ると、緊急度、必要情報、業者向け作業指示、返信文を生成する小型AIツール。",
      ],
      ["いくらで売るか", "$299 setup + $29/month"],
      [
        "なぜ今買うか",
        "管理戸数が増えるほど修理依頼の処理が詰まり、対応遅れがクレームや退去リスクになるから。",
      ],
    ],
    validationSteps: [
      "60秒デモを作る。",
      "小規模不動産管理会社20社に送る。",
      "「これがあれば修理依頼処理が楽になるか？」を聞く。",
      "3社に$99〜$299の有料βを提案する。",
    ],
    masterPrompt: `Build a standalone new web app from scratch.

Product name:
Tenant Maintenance Request Router

Buyer:
Small property managers managing 20-300 rental units.

Pain:
Tenant repair requests arrive through LINE, email, phone notes, and messy messages. Managers waste time identifying urgency, missing information, vendor category, and the next tenant reply.

Product angle:
A lightweight AI work-order router that turns tenant repair messages into urgency, missing info, vendor-ready work orders, and tenant reply drafts.

First version:
A single-page tool where a property manager pastes a tenant maintenance message, reviews urgency, missing information, vendor category, work-order instructions, and a tenant reply draft, then copies the output.

Price:
$299 setup + $29/month.

48h validation plan:
1. Create a 60-second demo showing a messy tenant message becoming a vendor-ready work order.
2. Send the demo to 20 small property managers managing 20-300 rental units.
3. Ask: "Would this make maintenance request handling easier?"
4. Offer 3 paid beta slots at $99-$299.

Core workflow:
1. User opens the product.
2. User pastes a tenant maintenance request.
3. App classifies urgency and repair category.
4. App identifies missing information.
5. App generates a vendor-ready work order.
6. App generates a tenant reply draft.
7. User copies or saves the output.

Technical requirements:
- Use Next.js and React.
- Use local React state only.
- Use mock data only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not call external APIs.
- Do not require environment variables.

UI requirements:
- Mobile-first layout.
- Dark, calm SaaS style.
- Clear input area for tenant messages.
- Clear output sections for urgency, missing info, vendor work order, and tenant reply.
- Copy buttons for each output.
- No generic AI gradients.
- No decorative noise.

Acceptance criteria:
- The page loads successfully.
- User can paste or select a sample tenant repair request.
- Generated output appears immediately.
- Output includes urgency, missing information, vendor-ready work order, and tenant reply.
- Copy buttons work.
- The product clearly feels sellable to small property managers.`,
  },
  github: {
    label: "GitHubシグナル",
    proof: "参照元 GitHubトレンド / AIリポジトリシグナル",
    title: "GitHub Repo Signal Brief Generator",
    businessFields: [
      [
        "シグナル",
        "GitHubでAIエージェント、ローカル自動化、開発者ワークフロー系のリポジトリが伸びている。AIビルダーは毎日トレンドを見るが、それを「誰に売るか」「何を作るか」「いくらで売るか」に変換できていない。",
      ],
      ["何が金になるか", "GitHub Repo Signal Brief Generator"],
      [
        "誰が買うか",
        "Codex、Cursor、Claude Code、Lovableを使うAIビルダー・個人開発者",
      ],
      [
        "どんな痛みを解決するか",
        "GitHubトレンドやAIリポジトリを見ても、そこから売れる小型商品、買う相手、価格、検証手順に変換できない。",
      ],
      [
        "何を売るか",
        "GitHubリポジトリURLやトレンド名を入力すると、商品案、買う相手、痛み、価格、48時間検証、実装プロンプトに変換する小型AIツール。",
      ],
      ["いくらで売るか", "$19 one-time または $9/month"],
      [
        "なぜ今買うか",
        "Codex、Cursor、Claude Codeで作れる人が増えたが、作る前の「何を作れば売れるか」がボトルネックになっているから。",
      ],
    ],
    validationSteps: [
      "GitHubトレンド1件を商品案に変換する60秒デモを作る。",
      "XでAIビルダー向けに投稿する。",
      "Codex / Cursor / Claude Codeユーザー30人にDMする。",
      "5人から「使いたい」または$19購入を取れるか確認する。",
    ],
    masterPrompt: `Build a standalone new web app from scratch.

Product name:
GitHub Repo Signal Brief Generator

Buyer:
AI builders, solo developers, Codex users, Cursor users, Claude Code users, and Lovable users who watch GitHub trends but do not know how to turn them into sellable product ideas.

Pain:
The buyer sees trending AI repositories, developer tools, and public builder activity, but cannot convert those signals into a clear product angle, buyer pain, price, validation plan, and build-ready implementation prompt.

Product angle:
A lightweight signal-to-product workspace that turns one GitHub repository signal into a buyer profile, pain statement, small product idea, pricing hypothesis, 48-hour validation plan, and build-ready Code X prompt.

First version:
A single-page web app where the user pastes a GitHub repository name, URL, or trend note, then receives a commercial brief and a build-ready prompt.

Price:
$19 one-time or $9/month.

48h validation plan:
1. Record a 60-second demo showing one GitHub repository signal becoming a product brief.
2. Post the demo on X for AI builders.
3. DM 30 Codex, Cursor, Claude Code, or Lovable users.
4. Ask for 5 purchases at $19 or 5 explicit objections.

Core workflow:
1. User opens the product.
2. User pastes a GitHub repository URL, repo name, or trend note.
3. App generates buyer, pain, product idea, price, and validation plan.
4. App generates a build-ready Code X prompt.
5. User copies the output.

Technical requirements:
- Use Next.js and React.
- Use local React state only.
- Use mock data only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not call external APIs.
- Do not require environment variables.

UI requirements:
- Mobile-first layout.
- Dark, calm SaaS style.
- Clear source selector.
- Clear output cards.
- Copy button for the master prompt.
- No generic AI gradients.
- No decorative noise.

Acceptance criteria:
- The page loads successfully.
- User can select GitHubシグナル or Indie Hackers DB.
- User clicks 商品を作成する.
- Output appears only after click.
- Output changes based on selected source.
- Copy button copies the selected source's Master Prompt.`,
  },
};

const cards = [
  {
    title: "買う相手",
    text: "誰が困っていて、なぜ今買うのか。",
  },
  {
    title: "商品案",
    text: "小型AIツール、Prompt Pack、Agency serviceなどに変換。",
  },
  {
    title: "実装プロンプト",
    text: "Code X、Codex、Cursor、Claude Code、Lovableに貼れる仕様。",
  },
];

function getLocalDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function hasPaidCookie() {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === "founder_access=1" || cookie === "paid_access=1");
}

function readFreeUsageCount() {
  try {
    const raw = window.localStorage.getItem(FREE_USAGE_STORAGE_KEY_JP);

    if (!raw) {
      return 0;
    }

    const parsed = JSON.parse(raw) as { date?: string; count?: number };

    if (parsed.date !== getLocalDateKey()) {
      return 0;
    }

    return Math.max(0, Math.min(FREE_DAILY_LIMIT_JP, Number(parsed.count) || 0));
  } catch {
    return 0;
  }
}

function writeFreeUsageCount(count: number) {
  try {
    window.localStorage.setItem(
      FREE_USAGE_STORAGE_KEY_JP,
      JSON.stringify({
        date: getLocalDateKey(),
        count: Math.max(0, Math.min(FREE_DAILY_LIMIT_JP, count)),
      }),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium text-zinc-500">
      <Link href="/app" className="rounded-full px-3 py-1.5 transition hover:text-white">
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
  children: ReactNode;
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

export default function JapaneseSignalPreviewPage() {
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [freeUsageCount, setFreeUsageCount] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [sourceType, setSourceType] = useState<SourceType>("indie");

  useEffect(() => {
    const loadAccess = window.setTimeout(() => {
      const paid = hasPaidCookie();
      const usageCount = readFreeUsageCount();

      setHasPaidAccess(paid);
      setFreeUsageCount(usageCount);
      setShowOutput(false);
    }, 0);

    return () => window.clearTimeout(loadAccess);
  }, []);

  const selectedOutput = sourceOutputs[sourceType];
  const freeRunsRemaining = hasPaidAccess
    ? Infinity
    : Math.max(0, FREE_DAILY_LIMIT_JP - freeUsageCount);
  const canGenerate = hasPaidAccess || freeRunsRemaining > 0;

  function generateOutput() {
    if (!canGenerate) {
      return;
    }

    if (!hasPaidAccess) {
      const nextCount = freeUsageCount + 1;
      writeFreeUsageCount(nextCount);
      setFreeUsageCount(nextCount);
    }

    setShowOutput(true);
  }

  async function copyMasterPrompt() {
    await navigator.clipboard.writeText(selectedOutput.masterPrompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1200);
  }

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

        <section className="grid gap-8 py-14 md:py-18 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              今日のシグナル
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              作るものを、ここで決める。
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              海外の成功事例やGitHubシグナルを選び、Bilionが買う相手、痛み、商品案、価格、検証手順、Full Code X Master Promptに変換します。
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-[#111214] p-4">
              <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">
                ソースを選択
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(Object.keys(sourceOutputs) as SourceType[]).map((source) => {
                  const active = sourceType === source;

                  return (
                    <button
                      key={source}
                      type="button"
                      onClick={() => {
                        setSourceType(source);
                        setShowOutput(false);
                        setCopiedPrompt(false);
                      }}
                      className={[
                        "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
                        active
                          ? "border-white/30 bg-white text-zinc-950"
                          : "border-white/10 bg-black/20 text-zinc-300 hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      {sourceOutputs[source].label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-500">
                参照元 IH42kDB + GitHubシグナル
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {canGenerate ? (
                <button
                  type="button"
                  onClick={generateOutput}
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  商品を作成する
                </button>
              ) : (
                <ButtonLink href="/jp/founder">実装プロンプトアクセスを見る</ButtonLink>
              )}
              <ButtonLink href="/jp" variant="secondary">
                トップに戻る
              </ButtonLink>
            </div>
            {!hasPaidAccess && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                無料でも有料版と同じ品質の出力を1日3回まで確認できます。Founder
                Accessでは、無制限生成・無制限コピー・追加角度の生成が使えます。
              </p>
            )}
            {hasPaidAccess && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                Unlimited access unlocked. 何度でも商品案とMaster Promptを生成できます。
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111214] p-5 shadow-xl shadow-black/20">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">
                {showOutput ? "商売判断" : "未生成"}
              </div>
              {showOutput ? (
                <>
                  <h2 className="mt-1 text-lg font-semibold text-white">{selectedOutput.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{selectedOutput.proof}</p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    ソースを選んで、商品を作成するを押してください。
                  </p>
                  <p className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-500">
                    参照元 IH42kDB + GitHubシグナル
                  </p>
                </>
              )}
            </div>

            {showOutput && (
              <div className="mt-4 grid gap-3">
                {selectedOutput.businessFields.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-3.5">
                    <div className="text-xs font-semibold tracking-wide text-zinc-500">
                      {label}
                    </div>
                    <div className="mt-1.5 text-sm leading-6 text-zinc-100">{value}</div>
                  </div>
                ))}
                <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
                  <div className="text-xs font-semibold tracking-wide text-zinc-500">
                    48時間検証
                  </div>
                  <ol className="mt-2 space-y-1 text-sm leading-6 text-zinc-100">
                    {selectedOutput.validationSteps.map((step, index) => (
                      <li key={step} className="flex gap-2">
                        <span className="text-zinc-500">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </section>

        {!hasPaidAccess && freeUsageCount >= FREE_DAILY_LIMIT_JP && (
          <section className="border-t border-white/10 py-10">
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-yellow-100">
                今日の無料生成3回を使用済みです。
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                無料でも有料版と同じ品質の出力を確認できます。追加の生成、無制限コピー、追加角度の生成は実装プロンプトアクセスで解放されます。
              </p>
              <div className="mt-5">
                <ButtonLink href="/jp/founder">実装プロンプトアクセスを見る</ButtonLink>
              </div>
            </div>
          </section>
        )}

        {showOutput && (
          <section className="border-t border-white/10 py-10">
            <div className="rounded-2xl border border-white/10 bg-[#111214] p-5 md:p-6">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    MASTER PROMPT
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Full Code X Master Prompt
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                    この英語プロンプトをCode X / Codex / Cursor / Claude Code / Lovableに貼ってください。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyMasterPrompt}
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  {copiedPrompt ? "コピー済み" : "Master Promptをコピー"}
                </button>
              </div>
              <pre className="mt-5 max-h-[620px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/35 p-4 font-sans text-sm leading-6 text-zinc-100">
                {selectedOutput.masterPrompt}
              </pre>
            </div>
          </section>
        )}

        <section className="border-t border-white/10 py-10">
          <div className="mb-5">
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              Bilionで確認できること
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-[#111214] p-5">
                <h2 className="text-base font-semibold text-white">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{card.text}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
