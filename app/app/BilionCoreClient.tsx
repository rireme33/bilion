"use client";

import { useState } from "react";
import { canonicalMoneySignals, type MoneySignal } from "@/data/money-signals";

type JapanOpportunity = {
  signalId: string;
  title: string;
  sold: string;
  buyer: string;
  pain: string;
  product: string;
  price: string;
  validation: string;
  mvp: string;
  features: string[];
};

const opportunities: JapanOpportunity[] = [
  {
    signalId: "success-task-magic-browser-automation-3m-year",
    title: "ブラウザ業務の自動化代行",
    sold: "APIがない管理画面の定型作業を自動化するツール",
    buyer: "受注・在庫・予約を複数の管理画面へ手入力している中小企業",
    pain: "転記作業に毎日時間がかかり、入力漏れや二重登録も起きる",
    product: "ブラウザ定型業務 自動化パック",
    price: "初期診断 29,800円 / 導入 98,000円〜",
    validation: "業務改善に関心がある事業者10社へ、1作業の無料診断を提案する。3社が画面共有に応じたら作る。",
    mvp: "操作手順を登録し、1つの定型作業を実行・確認できるローカルWebツール",
    features: ["作業手順の登録", "実行前プレビュー", "実行ログ", "失敗時の再開案内"],
  },
  {
    signalId: "success-hero-analytics-agency-reporting-1m-arr",
    title: "EC支援会社向け週次レポート",
    sold: "複数ブランドのメール・SMS施策をまとめる分析レポート",
    buyer: "Shopifyブランドを複数担当するEC支援会社・運用代行会社",
    pain: "顧客ごとの数字集計と報告文作成で毎週数時間が消える",
    product: "EC運用 週次レポート作成パック",
    price: "初回 39,800円 / 月額 19,800円〜",
    validation: "EC支援会社15社へサンプルレポートを送り、匿名データでの試作を募集する。3社がデータ提供に応じたら作る。",
    mvp: "CSVを読み込み、主要数値・前週差・顧客向けコメントを1画面で生成するツール",
    features: ["CSV取込", "主要KPI集計", "前週比較", "報告文のコピー"],
  },
  {
    signalId: "launchfast-amazon-seller-research-30k-mrr",
    title: "国内ECの商品リサーチ短縮",
    sold: "表計算で20〜30時間かかる商品調査の自動化",
    buyer: "Amazon・楽天・Yahoo!ショッピングの小規模セラー",
    pain: "候補商品の比較が散らばり、仕入れ判断までに時間がかかる",
    product: "仕入れ候補 比較レポート",
    price: "1カテゴリ 14,800円 / 月額 9,800円",
    validation: "セラー20人へ比較レポートの見本を提示し、調査したいカテゴリを聞く。3件の有料予約で作る。",
    mvp: "手入力した商品候補を、価格・レビュー・想定粗利で比較する意思決定ツール",
    features: ["候補商品入力", "比較表", "粗利メモ", "判定レポート"],
  },
  {
    signalId: "blogtopin-pinterest-blogger-15k-mrr",
    title: "記事からSNS素材を量産",
    sold: "ブログ記事をPinterest画像へ変換し、投稿を予約するSaaS",
    buyer: "記事資産はあるがSNS運用まで手が回らない士業・教室・小規模メディア",
    pain: "1つの記事から毎回SNS投稿を作り直すため、発信が止まる",
    product: "記事→SNS投稿 変換パック",
    price: "初回 9,800円 / 月額 4,980円",
    validation: "記事を持つ事業者15人へ、1記事から作った投稿例3本を送る。3人が継続作成を希望したら作る。",
    mvp: "記事本文を貼ると、短文投稿・カルーセル構成・画像指示を生成するツール",
    features: ["記事入力", "投稿文生成", "カルーセル構成", "一括コピー"],
  },
  {
    signalId: "success-bulk-mockup-photoshop-12k-month",
    title: "商品モックアップの一括作成",
    sold: "EC商品のモックアップをまとめて作るPhotoshopプラグイン",
    buyer: "BASE・STORES・楽天で商品画像を繰り返し作る小規模ショップ",
    pain: "色や柄ごとの商品画像作成に時間がかかり、出品数を増やせない",
    product: "商品画像 一括モックアップ作成",
    price: "初期設定 19,800円 / 月額 4,980円",
    validation: "ショップ10店へ、既存画像から作った5パターンの見本を送る。3店が次の商品でも希望したら作る。",
    mvp: "背景画像と商品画像を登録し、複数パターンを一括プレビューするツール",
    features: ["画像登録", "配置テンプレート", "一括プレビュー", "書き出し一覧"],
  },
  {
    signalId: "success-local-rank-seo-50k-month",
    title: "店舗の検索順位変化レポート",
    sold: "ローカル検索順位と競合の動きを追う運用ツール",
    buyer: "複数店舗を支援するMEO会社・Web制作会社・店舗運営者",
    pain: "順位変化の確認と顧客説明を手作業で繰り返している",
    product: "MEO変化レポート作成パック",
    price: "1店舗 19,800円 / 月額 9,800円〜",
    validation: "MEO支援会社10社へ1店舗分の見本を送り、現在の報告作業を聞く。3社が試用を希望したら作る。",
    mvp: "順位データを貼り付け、変化・競合メモ・顧客向け要約を出すツール",
    features: ["順位データ入力", "変化の強調", "競合メモ", "顧客向け要約"],
  },
  {
    signalId: "success-chartdb-open-source-db-diagram-9k-mrr",
    title: "DB仕様書の自動更新",
    sold: "データベース構造を図と文書にするホステッドツール",
    buyer: "仕様書が古い受託開発会社・社内開発チーム・個人開発者",
    pain: "DB構造の説明が属人化し、改修や引き継ぎのたびに確認が発生する",
    product: "DB構造 引き継ぎドキュメント",
    price: "1プロジェクト 29,800円 / 月額 9,800円",
    validation: "開発会社15社へサンプル仕様書を見せ、古いスキーマ1件の無料診断を募集する。3件集まれば作る。",
    mvp: "SQLスキーマを貼ると、テーブル一覧・関係・注意点を表示するツール",
    features: ["SQL入力", "テーブル一覧", "リレーション表示", "Markdown出力"],
  },
  {
    signalId: "success-lancer-upwork-ai-agent-10k-mrr",
    title: "案件応募文の作成支援",
    sold: "案件検索・相性判定・提案文作成をまとめたAIエージェント",
    buyer: "クラウドワークス・ランサーズで継続受注したいフリーランス",
    pain: "案件選びと提案文作成に時間がかかり、応募数と質を両立できない",
    product: "案件適合度チェック＋提案文パック",
    price: "初回 9,800円 / 月額 4,980円",
    validation: "フリーランス20人へ案件1件の無料診断を提案する。3人が翌週も使いたいと答えたら作る。",
    mvp: "案件文とプロフィールを貼り、適合度・不足情報・短い提案文を出すツール",
    features: ["案件文入力", "プロフィール登録", "適合度判定", "提案文コピー"],
  },
];

const signals = opportunities
  .map((opportunity) => ({
    opportunity,
    signal: canonicalMoneySignals.find((signal) => signal.id === opportunity.signalId),
  }))
  .filter((item): item is { opportunity: JapanOpportunity; signal: MoneySignal } => Boolean(item.signal));

function buildCodexPrompt(signal: MoneySignal, opportunity: JapanOpportunity) {
  return `目的:
「${opportunity.product}」のモバイル対応MVPを実装してください。

対象顧客:
${opportunity.buyer}

解決する痛み:
${opportunity.pain}

MVP仕様:
${opportunity.mvp}

必要機能:
${opportunity.features.map((feature) => `- ${feature}`).join("\n")}

参考にする海外の収益事例:
${signal.proof}

制約:
- 既存プロジェクトの構成とUIを再利用する
- TypeScriptで実装する
- モバイルファーストにする
- 認証、決済、外部API、DBは追加しない
- サンプルデータとローカル状態だけで動かす
- 1画面で入力、結果確認、コピーまで完了させる
- ${opportunity.validation} の検証後に拡張する前提にする`;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-zinc-200 py-4 first:border-0 first:pt-0">
      <dt className="text-xs font-bold tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-zinc-900">{value}</dd>
    </div>
  );
}

export default function BilionCoreClient({ hasFounderAccess = false }: { hasFounderAccess?: boolean }) {
  const [selectedId, setSelectedId] = useState(signals[0]?.signal.id ?? "");
  const [showBuild, setShowBuild] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const selected = signals.find(({ signal }) => signal.id === selectedId) ?? signals[0];

  if (!selected) return null;

  const prompt = buildCodexPrompt(selected.signal, selected.opportunity);
  const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "/founder";

  function chooseSignal(id: string) {
    setSelectedId(id);
    setShowBuild(false);
    window.setTimeout(() => document.getElementById("japan-opportunity")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    window.setTimeout(() => setCopyState("idle"), 1500);
  }

  return (
    <main className="min-h-screen bg-[#f6f6f3] text-zinc-950" data-access={hasFounderAccess ? "paid" : "free"}>
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-[#f6f6f3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="text-lg font-black tracking-tight">BILION</a>
          <span className="text-xs font-semibold text-zinc-500">海外事例 → 日本の商品 → Codex</span>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">AI BUSINESS OPPORTUNITY</p>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            海外で売れた事例を、<br className="hidden sm:block" />日本で売れる小さな商品へ。
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
            収益根拠のある事例を選ぶだけ。日本向けの商品案と、Codexへ渡せるMVP仕様まで確認できます。
          </p>
        </section>

        <ol className="mt-8 grid grid-cols-3 overflow-hidden rounded-xl border border-zinc-200 bg-white text-center text-xs font-bold sm:text-sm">
          {["1 Money Signal", "2 日本向け商品", "3 Codex実装"].map((step, index) => (
            <li key={step} className={`px-2 py-3 ${index < 2 ? "border-r border-zinc-200" : ""}`}>{step}</li>
          ))}
        </ol>

        <section className="mt-12" aria-labelledby="signals-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-700">STEP 1</p>
              <h2 id="signals-heading" className="mt-1 text-2xl font-black tracking-tight">Money Signal</h2>
            </div>
            <p className="text-xs text-zinc-500">収益根拠あり · {signals.length}件</p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {signals.map(({ signal, opportunity }) => (
              <article key={signal.id} className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-emerald-700">{signal.source}</p>
                    <h3 className="mt-2 text-lg font-black leading-6">{opportunity.title}</h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">実売</span>
                </div>
                <dl className="mt-4">
                  <Field label="何が売れたか" value={opportunity.sold} />
                  <Field label="誰が買ったか" value={signal.buyer} />
                  <Field label="収益・価格の根拠" value={signal.proof} />
                </dl>
                <button
                  type="button"
                  onClick={() => chooseSignal(signal.id)}
                  className="mt-auto w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-700"
                >
                  この事例を日本向けに変換
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="japan-opportunity" className="scroll-mt-20 border-t border-zinc-300 py-12 sm:mt-12" aria-labelledby="opportunity-heading">
          <p className="text-xs font-bold text-emerald-700">STEP 2 · JAPAN OPPORTUNITY</p>
          <h2 id="opportunity-heading" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{selected.opportunity.product}</h2>
          <p className="mt-2 text-sm text-zinc-500">元事例: {selected.opportunity.title}</p>

          {hasFounderAccess ? (
            <>
              <dl className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
                <Field label="ターゲット" value={selected.opportunity.buyer} />
                <Field label="痛み / 欲求" value={selected.opportunity.pain} />
                <Field label="売る商品" value={selected.opportunity.product} />
                <Field label="価格" value={selected.opportunity.price} />
                <Field label="最小検証" value={selected.opportunity.validation} />
              </dl>

              <button
                type="button"
                onClick={() => {
                  setShowBuild(true);
                  window.setTimeout(() => document.getElementById("build")?.scrollIntoView({ behavior: "smooth" }), 0);
                }}
                className="mt-5 w-full rounded-lg bg-zinc-950 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-700 sm:w-auto sm:min-w-64"
              >
                Codex実装案を見る
              </button>
            </>
          ) : (
            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-700 sm:p-8">
              <p className="text-base font-semibold text-zinc-900">Money Signalは無料です。</p>
              <p className="mt-3">日本向け商品案とCodex実装案はBilion Proで開放されます。</p>
              <a
                href={CHECKOUT_URL}
                className="mt-5 inline-flex w-full justify-center rounded-lg bg-zinc-950 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-700 sm:w-auto sm:min-w-64"
              >
                Proで解放
              </a>
            </div>
          )}
        </section>

        {showBuild && (
          <section id="build" className="scroll-mt-20 border-t border-zinc-300 py-12" aria-labelledby="build-heading">
            <p className="text-xs font-bold text-emerald-700">STEP 3 · BUILD</p>
            <h2 id="build-heading" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">最小MVPをCodexで作る</h2>

            <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
                <h3 className="font-black">MVP仕様</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-700">{selected.opportunity.mvp}</p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  {selected.opportunity.features.map((feature) => <li key={feature}>・{feature}</li>)}
                </ul>
              </div>

              <div className="min-w-0 rounded-xl bg-zinc-950 p-5 text-white sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-black">Codex実装プロンプト</h3>
                  <button type="button" onClick={copyPrompt} className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold text-zinc-950">
                    {copyState === "copied" ? "コピー済み" : copyState === "error" ? "再試行" : "コピー"}
                  </button>
                </div>
                <pre className="mt-5 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-sans text-xs leading-6 text-zinc-300 sm:text-sm">{prompt}</pre>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
