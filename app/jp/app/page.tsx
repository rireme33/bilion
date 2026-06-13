"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FREE_MASTER_PROMPT_DATE_STORAGE_KEY = "bilion_free_master_prompt_date";
const FREE_MASTER_PROMPT_PAYLOAD_STORAGE_KEY = "bilion_free_master_prompt_payload";

const previewFields = [
  ["シグナル", "AIビルダーの間でGitHubプロジェクトが伸びている。"],
  ["買う相手", "CodexやCursorを使えるが、何を作ればよいかわからない人。"],
  ["商品案", "GitHub Signal Lab"],
  ["次の行動", "30秒のデモを投稿し、反応したビルダーにページを送る。"],
];

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

const masterPrompt = `Build a standalone new web app from scratch.

Product name:
GitHub Signal Lab

Buyer:
Codex and Cursor users who can build software but do not know what AI product is worth building.

Pain:
The buyer sees GitHub trends, AI repositories, and public builder activity, but cannot convert those signals into a clear product angle, buyer pain, price, validation plan, and implementation prompt.

Product angle:
A lightweight signal-to-product workspace that turns one GitHub signal into a buyer profile, pain statement, small product idea, pricing hypothesis, 48h validation plan, and build-ready Code X prompt.

First version:
A single-page web app where the user selects or pastes a GitHub-style signal, reviews the generated commercial brief, and copies the build prompt into Code X, Codex, Cursor, Claude Code, or Lovable.

Price:
$19 one-time.

48h validation plan:
1. Record a 30-second demo showing one GitHub signal becoming a product brief.
2. Post the demo on X with a clear before/after.
3. DM 20 AI builders who reply, bookmark, or ask what to build next.
4. Ask for 5 purchases at $19 or 5 explicit objections.

Core workflow:
1. User opens the app.
2. User selects a sample GitHub signal.
3. App shows buyer, pain, product idea, price, and next action.
4. Paid user unlocks the full Code X Master Prompt.
5. User copies the prompt into their AI coding tool.

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
- Clear preview card.
- Clear locked paid section.
- Copy button for the master prompt.
- No generic AI gradients.
- No decorative noise.

Acceptance criteria:
- The page loads successfully.
- Free users can see the signal preview.
- Paid users can see the full master prompt.
- Copy button works.
- The app clearly communicates buyer, pain, price, validation plan, and build prompt.`;

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

export default function JapaneseSignalPreviewPage() {
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [freeSignalUsedToday, setFreeSignalUsedToday] = useState(false);
  const [showSignal, setShowSignal] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    const loadAccess = window.setTimeout(() => {
      const paid = hasPaidCookie();

      setHasPaidAccess(paid);
      const used = window.localStorage.getItem(FREE_MASTER_PROMPT_DATE_STORAGE_KEY) === getLocalDateKey();
      setFreeSignalUsedToday(used);
      setShowSignal(paid || used);

      try {
        const raw = window.localStorage.getItem(FREE_MASTER_PROMPT_PAYLOAD_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.date === getLocalDateKey() && parsed.language === "jp") {
            setShowSignal(true);
          }
        }
      } catch {
        // ignore
      }
    }, 0);

    return () => window.clearTimeout(loadAccess);
  }, []);

  function viewFreeSignal() {
    if (hasPaidAccess) {
      setShowSignal(true);
      return;
    }

    if (freeSignalUsedToday) {
      setShowSignal(true);
      return;
    }

    const payload = {
      date: getLocalDateKey(),
      language: "jp",
      promptTitle: "GitHub Signal Lab",
      fullCodeXMasterPrompt: masterPrompt,
      buyer: "Codex and Cursor users who can build software but do not know what AI product is worth building.",
      pain: "The buyer sees GitHub trends, AI repositories, and public builder activity, but cannot convert those signals into a clear product angle, buyer pain, price, validation plan, and implementation prompt.",
      productAngle: "A lightweight signal-to-product workspace that turns one GitHub signal into a buyer profile, pain statement, small product idea, pricing hypothesis, 48h validation plan, and build-ready Code X prompt.",
      price: "$19 one-time",
      validationPlan: [
        "Record a 30-second demo showing one GitHub signal becoming a product brief.",
        "Post the demo on X with a clear before/after.",
        "DM 20 AI builders who reply, bookmark, or ask what to build next.",
        "Ask for 5 purchases at $19 or 5 explicit objections.",
      ],
    };

    try {
      window.localStorage.setItem(FREE_MASTER_PROMPT_DATE_STORAGE_KEY, getLocalDateKey());
      window.localStorage.setItem(FREE_MASTER_PROMPT_PAYLOAD_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }

    setFreeSignalUsedToday(true);
    setShowSignal(true);
  }

  async function copyMasterPrompt() {
    await navigator.clipboard.writeText(masterPrompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1200);
  }

  const isLocked = !hasPaidAccess && freeSignalUsedToday && !showSignal;

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
              実際のAI活用事例やGitHubシグナルから、買う相手・商品案・価格・次の行動を確認できます。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {hasPaidAccess || !freeSignalUsedToday ? (
                <button
                  type="button"
                  onClick={viewFreeSignal}
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  今日の無料Master Promptを見る
                </button>
              ) : (
                <ButtonLink href="/jp/founder">実装プロンプトを見る</ButtonLink>
              )}
              <ButtonLink href="/jp" variant="secondary">
                トップに戻る
              </ButtonLink>
            </div>
            {!hasPaidAccess && !freeSignalUsedToday && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                無料版では1日1個、Full Code X Master Promptまで確認できます。追加のプロンプトは実装プロンプトアクセスで解放されます。
              </p>
            )}
          </div>

          {isLocked ? (
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-5 shadow-xl shadow-black/20">
              <h2 className="text-2xl font-semibold tracking-tight text-yellow-100">
                今日の無料Master Promptを使用済みです。
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                このプロンプトは本日中は確認できます。追加のプロンプト生成は実装プロンプトアクセスで解放されます。
              </p>
              <div className="mt-5">
                <ButtonLink href="/jp/founder">実装プロンプトを見る</ButtonLink>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#111214] p-5 shadow-xl shadow-black/20">
              <div className="border-b border-white/10 pb-4">
                <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">
                  {hasPaidAccess ? "実装プロンプトアクセス有効" : "今日の出力例"}
                </div>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  {showSignal ? "GitHub Signal Lab" : "今日のシグナルを表示"}
                </h2>
              </div>
              {showSignal ? (
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
              ) : (
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  無料版では1日1回まで、プレビュー内容を確認できます。
                </p>
              )}
            </div>
          )}
        </section>

        {showSignal && !hasPaidAccess && (
          <section className="border-t border-white/10 py-10">
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-yellow-100">
                追加のMaster Promptは有料です
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                無料版では1日1個までFull Code X Master Promptを確認できます。追加生成・無制限コピー・商用角度の展開は実装プロンプトアクセスで解放されます。
              </p>
              <div className="mt-5">
                <ButtonLink href="/jp/founder">実装プロンプトを見る</ButtonLink>
              </div>
            </div>
          </section>
        )}

        {(hasPaidAccess || (showSignal && freeSignalUsedToday)) && (
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
                    この英語のプロンプトを Code X / Codex / Cursor / Claude Code / Lovable に貼ってください。
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
                {masterPrompt}
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
