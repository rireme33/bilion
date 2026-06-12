"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FREE_SIGNAL_DATE_STORAGE_KEY_JP = "bilion_free_signal_date_jp";

const previewFields = [
  ["シグナル", "AIビルダーの間でGitHubプロジェクトが伸びている。"],
  ["買う相手", "CodexやCursorを使えるが、何を作ればよいかわからない人。"],
  ["商品案", "GitHub Signal Lab"],
  ["次の行動", "30秒のデモを投稿し、反応したビルダーにページを送る。"],
];

const fullPreviewFields = [
  ...previewFields,
  ["痛み", "作れる力はあるが、売れるテーマを選べない。"],
  ["価格", "$19 買い切り"],
  ["検証手順", "デモを投稿し、反応したAIビルダーへページを送る。"],
  ["Code X用プロンプト", "GitHubシグナルから商品案、画面、出力、販売導線を作る仕様。"],
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

  useEffect(() => {
    const loadAccess = window.setTimeout(() => {
      const paid = hasPaidCookie();

      setHasPaidAccess(paid);
      setFreeSignalUsedToday(
        window.localStorage.getItem(FREE_SIGNAL_DATE_STORAGE_KEY_JP) ===
          getLocalDateKey(),
      );
      setShowSignal(paid);
    }, 0);

    return () => window.clearTimeout(loadAccess);
  }, []);

  function viewFreeSignal() {
    if (hasPaidAccess) {
      setShowSignal(true);
      return;
    }

    if (freeSignalUsedToday) {
      return;
    }

    window.localStorage.setItem(FREE_SIGNAL_DATE_STORAGE_KEY_JP, getLocalDateKey());
    setFreeSignalUsedToday(true);
    setShowSignal(true);
  }

  const isLocked = !hasPaidAccess && freeSignalUsedToday && !showSignal;
  const outputFields = hasPaidAccess ? fullPreviewFields : previewFields;

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
                  今日のシグナルを見る
                </button>
              ) : (
                <ButtonLink href="/founder">実装プロンプトを見る</ButtonLink>
              )}
              <ButtonLink href="/jp" variant="secondary">
                トップに戻る
              </ButtonLink>
            </div>
          </div>

          {isLocked ? (
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-5 shadow-xl shadow-black/20">
              <h2 className="text-2xl font-semibold tracking-tight text-yellow-100">
                今日の無料シグナルは使用済みです。
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                無料版では1日1回までシグナルを確認できます。実装プロンプトアクセスでは、買う相手・痛み・価格・検証手順・Code X用プロンプトまで確認できます。
              </p>
              <ButtonLink href="/founder">実装プロンプトを見る</ButtonLink>
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
                  {outputFields.map(([label, value]) => (
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

        <section className="border-t border-white/10 py-12 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight">
            完成版の実装プロンプトを見る。
          </h2>
          <div className="mt-7 flex justify-center">
            <ButtonLink href="/founder">実装プロンプトを見る</ButtonLink>
          </div>
        </section>
      </section>
    </main>
  );
}
