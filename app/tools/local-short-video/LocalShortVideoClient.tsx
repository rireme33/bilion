"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  generateLocalShortVideoPack,
  getInitialLocalShortVideoInput,
  type LocalShortVideoIdea,
  type LocalShortVideoInput,
  type LocalShortVideoPack,
} from "@/lib/local-short-video-generator";

const storageKey = "bilion.free.localShortVideo.v1";

const industryOptions = [
  "美容院",
  "整体院",
  "飲食店",
  "サロン",
  "工務店",
  "家具店",
  "ジム",
  "スクール",
  "カフェ",
  "その他の店舗",
];

const goalOptions = [
  "予約を増やす",
  "来店を増やす",
  "問い合わせを増やす",
  "認知を増やす",
  "信頼を作る",
  "採用につなげる",
];

const toneOptions = [
  "親しみやすい",
  "プロっぽい",
  "やさしい",
  "おしゃれ",
  "信頼重視",
  "初心者向け",
];

const faceModeOptions = [
  "顔出しできる",
  "手元だけならできる",
  "店内だけ撮りたい",
  "商品だけ撮りたい",
  "顔出しなし",
];

const outputCountOptions = ["3本", "5本", "10本"];

type SavedPack = {
  createdAt: string;
  input: LocalShortVideoInput;
  pack: LocalShortVideoPack;
};

const emptyInput: LocalShortVideoInput = {
  faceMode: "顔出しなし",
  goal: "予約を増やす",
  industry: "美容院",
  offer: "",
  outputCount: "5本",
  storeName: "",
  targetCustomer: "",
  tone: "親しみやすい",
};

function formatIdea(idea: LocalShortVideoIdea) {
  return [
    `# ${idea.title}`,
    "",
    "## 冒頭フック",
    idea.hook,
    "",
    "## 15秒台本",
    idea.script15s,
    "",
    "## 撮影指示",
    idea.shootingInstructions,
    "",
    "## 投稿文",
    idea.caption,
    "",
    "## CTA",
    idea.cta,
    "",
    "## なぜ効くか",
    idea.whyItWorks,
  ].join("\n");
}

function readSavedPacks() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? (parsed as SavedPack[]).slice(0, 5) : [];
  } catch {
    return [];
  }
}

function writeSavedPacks(packs: SavedPack[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(packs.slice(0, 5)));
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);

    return true;
  } catch {
    return false;
  }
}

export default function LocalShortVideoClient() {
  const initialInput = useMemo(() => getInitialLocalShortVideoInput(), []);
  const initialPack = useMemo(
    () => generateLocalShortVideoPack(initialInput),
    [initialInput],
  );
  const [input, setInput] = useState<LocalShortVideoInput>(initialInput);
  const [pack, setPack] = useState<LocalShortVideoPack>(initialPack);
  const [savedPacks, setSavedPacks] = useState<SavedPack[]>([]);
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSavedPacks(readSavedPacks());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateInput(key: keyof LocalShortVideoInput, value: string) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function handleCopy(key: string, value: string) {
    const copied = await copyText(value);
    setCopiedKey(copied ? key : "error");
    window.setTimeout(() => setCopiedKey(""), 1200);
  }

  function savePack(nextInput: LocalShortVideoInput, nextPack: LocalShortVideoPack) {
    const nextSaved = [
      { createdAt: nextPack.createdAt, input: nextInput, pack: nextPack },
      ...savedPacks.filter((saved) => saved.pack.id !== nextPack.id),
    ].slice(0, 5);

    setSavedPacks(nextSaved);
    writeSavedPacks(nextSaved);
  }

  function handleGenerate() {
    const nextPack = generateLocalShortVideoPack(input);
    setPack(nextPack);
    savePack(input, nextPack);
  }

  function handleSample() {
    const sample = getInitialLocalShortVideoInput();
    const nextPack = generateLocalShortVideoPack(sample);
    setInput(sample);
    setPack(nextPack);
    savePack(sample, nextPack);
  }

  function handleReset() {
    const nextPack = generateLocalShortVideoPack(emptyInput);
    setInput(emptyInput);
    setPack(nextPack);
  }

  function handleLoad(saved: SavedPack) {
    setInput(saved.input);
    setPack(saved.pack);
  }

  function handleDelete(id: string) {
    const nextSaved = savedPacks.filter((saved) => saved.pack.id !== id);
    setSavedPacks(nextSaved);
    writeSavedPacks(nextSaved);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 py-10">
          <div className="w-fit rounded-md border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-100">
            Free Bilion mini tool
          </div>
          <div className="grid gap-4">
            <h1 className="max-w-5xl text-4xl font-black leading-tight text-white sm:text-6xl">
              小さな店舗のためのショート動画ネタメーカー
            </h1>
            <p className="max-w-4xl text-base font-bold leading-8 text-zinc-300 sm:text-xl">
              業種、商品、目的を入れるだけで、15秒ショート動画のネタ、台本、撮影指示、投稿文まで作れます。海外で実績のある店舗SNSの考え方を、日本の小さな店舗向けに変換した無料ツールです。
            </p>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-bold leading-7 text-zinc-300">
              <p>これはBilionの実験から生まれた無料ミニツールです。</p>
              <p>
                Bilionでは、海外で金が動いたAIビジネスやツールを見つけ、日本版にして小さく試しています。
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="grid gap-4 rounded-lg border border-white/10 bg-zinc-900 p-4">
            <div>
              <h2 className="text-2xl font-black text-white">入力</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-zinc-400">
                まずは1つの商品やサービスに絞ると、使いやすいネタになります。
              </p>
            </div>

            <SelectField
              label="業種"
              onChange={(value) => updateInput("industry", value)}
              options={industryOptions}
              value={input.industry}
            />
            <TextField
              label="店舗名"
              onChange={(value) => updateInput("storeName", value)}
              placeholder="任意"
              value={input.storeName}
            />
            <TextField
              label="商品やサービス"
              onChange={(value) => updateInput("offer", value)}
              placeholder="例: 髪質改善カラー"
              value={input.offer}
            />
            <TextField
              label="来てほしいお客さん"
              onChange={(value) => updateInput("targetCustomer", value)}
              placeholder="例: 髪のパサつきが気になる30代女性"
              value={input.targetCustomer}
            />
            <SelectField
              label="投稿の目的"
              onChange={(value) => updateInput("goal", value)}
              options={goalOptions}
              value={input.goal}
            />
            <SelectField
              label="動画の雰囲気"
              onChange={(value) => updateInput("tone", value)}
              options={toneOptions}
              value={input.tone}
            />
            <SelectField
              label="店主が顔出しできるか"
              onChange={(value) => updateInput("faceMode", value)}
              options={faceModeOptions}
              value={input.faceMode}
            />
            <SelectField
              label="生成数"
              onChange={(value) => updateInput("outputCount", value)}
              options={outputCountOptions}
              value={input.outputCount}
            />

            <div className="grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={handleGenerate}
                className="min-h-12 rounded-md bg-emerald-300 px-4 text-sm font-black text-zinc-950 transition hover:bg-emerald-200"
              >
                ネタを生成する
              </button>
              <button
                type="button"
                onClick={handleSample}
                className="min-h-12 rounded-md border border-white/10 px-4 text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
              >
                サンプルを入れる
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="min-h-12 rounded-md border border-white/10 px-4 text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
              >
                入力をリセット
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.05] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">生成結果</h2>
                  <p className="mt-2 text-sm font-bold leading-7 text-zinc-300">
                    {pack.summary}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void handleCopy("all", pack.markdown)}
                    className="min-h-11 rounded-md bg-white px-4 text-sm font-black text-zinc-950 transition hover:bg-zinc-200"
                  >
                    {copiedKey === "all" ? "Copied" : "すべてコピー"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCopy("markdown", pack.markdown)}
                    className="min-h-11 rounded-md border border-white/10 px-4 text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
                  >
                    {copiedKey === "markdown" ? "Copied" : "Markdownでコピー"}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {pack.ideas.map((idea, index) => (
                <IdeaCard
                  copiedKey={copiedKey}
                  idea={idea}
                  index={index}
                  key={idea.id}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-black text-white">提案DM / キット案</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <CopyPanel
              copiedKey={copiedKey}
              copyId="proposal-dm"
              label="提案DM"
              onCopy={handleCopy}
              value={pack.proposalDm}
            />
            <CopyPanel
              copiedKey={copiedKey}
              copyId="paid-kit"
              label="有料キット案"
              onCopy={handleCopy}
              value={pack.paidKitPitch}
            />
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-black text-white">最近作ったネタ</h2>
          {savedPacks.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-zinc-900 p-4 text-sm font-bold leading-7 text-zinc-400">
              生成すると、最新5件がこのブラウザに保存されます。
            </div>
          ) : (
            <div className="grid gap-3">
              {savedPacks.map((saved) => (
                <div
                  key={saved.pack.id}
                  className="grid gap-3 rounded-lg border border-white/10 bg-zinc-900 p-4 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="text-sm font-black text-white">
                      {saved.pack.summary}
                    </div>
                    <div className="mt-2 text-xs font-bold text-zinc-500">
                      {new Date(saved.createdAt).toLocaleString("ja-JP")}
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => handleLoad(saved)}
                      className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void handleCopy(`saved-${saved.pack.id}`, saved.pack.markdown)
                      }
                      className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
                    >
                      {copiedKey === `saved-${saved.pack.id}`
                        ? "Copied"
                        : "Copy Markdown"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(saved.pack.id)}
                      className="min-h-10 rounded-md border border-red-300/20 px-3 text-xs font-black text-red-100 transition hover:bg-red-300/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-2xl font-black text-white">このツールの元ネタ</h2>
          <p className="text-sm font-bold leading-7 text-zinc-300">
            このツールは、海外で実績のある店舗SNS事例を日本向けに変換して作った無料ミニツールです。
          </p>
          <p className="text-sm font-bold leading-7 text-zinc-300">
            Bilionでは、海外で金が動いたAIビジネスやツールを見つけ、日本向けに変換し、無料ツール、記事、スターターキットとして試しています。
          </p>
          <Link
            href="/"
            className="w-fit min-h-11 rounded-md bg-emerald-300 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-emerald-200"
          >
            Bilionを見る
          </Link>
        </section>

        <section className="grid gap-4 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.05] p-5">
          <h2 className="text-2xl font-black text-white">
            もっと業種別に使いたい方へ
          </h2>
          <p className="text-sm font-bold leading-7 text-zinc-300">
            美容院、整体院、飲食店、サロン、工務店、家具店向けのショート動画ネタ、15秒台本、撮影指示、投稿文、提案DMをまとめたスターターキットを準備中です。
          </p>
          <div className="w-fit rounded-md border border-white/10 px-4 py-3 text-sm font-black text-zinc-100">
            欲しい人がいれば初版を出します
          </div>
        </section>

        {copiedKey === "error" && (
          <div className="rounded-md border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100">
            Clipboard blocked. textareaから手動でコピーしてください。
          </div>
        )}
      </div>
    </main>
  );
}

function TextField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-zinc-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-md border border-white/10 bg-black/25 px-3 text-sm font-bold text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60"
        placeholder={placeholder}
      />
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-md border border-white/10 bg-black/25 px-3 text-sm font-bold text-zinc-100 outline-none transition focus:border-emerald-300/60"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function IdeaCard({
  copiedKey,
  idea,
  index,
  onCopy,
}: {
  copiedKey: string;
  idea: LocalShortVideoIdea;
  index: number;
  onCopy: (key: string, value: string) => Promise<void>;
}) {
  const copyKey = `idea-${index}`;

  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-200">
            idea {index + 1}
          </div>
          <h3 className="mt-2 text-xl font-black text-white">{idea.title}</h3>
          <p className="mt-2 text-sm font-bold leading-7 text-zinc-300">
            {idea.hook}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => void onCopy(copyKey, formatIdea(idea))}
            className="min-h-10 rounded-md bg-white px-3 text-xs font-black text-zinc-950 transition hover:bg-zinc-200"
          >
            {copiedKey === copyKey ? "Copied" : "コピー"}
          </button>
          <button
            type="button"
            onClick={() => void onCopy(`${copyKey}-caption`, idea.caption)}
            className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
          >
            {copiedKey === `${copyKey}-caption` ? "Copied" : "投稿文だけコピー"}
          </button>
          <button
            type="button"
            onClick={() => void onCopy(`${copyKey}-script`, idea.script15s)}
            className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
          >
            {copiedKey === `${copyKey}-script` ? "Copied" : "台本だけコピー"}
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {[
          ["15秒台本", idea.script15s],
          ["撮影指示", idea.shootingInstructions],
          ["投稿文", idea.caption],
          ["CTA", idea.cta],
          ["なぜこのネタが効くか", idea.whyItWorks],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-black/25 p-3">
            <div className="text-xs font-black text-zinc-500">{label}</div>
            <div className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-zinc-200">
              {value}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function CopyPanel({
  copiedKey,
  copyId,
  label,
  onCopy,
  value,
}: {
  copiedKey: string;
  copyId: string;
  label: string;
  onCopy: (key: string, value: string) => Promise<void>;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-black text-white">{label}</h3>
        <button
          type="button"
          onClick={() => void onCopy(copyId, value)}
          className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
        >
          {copiedKey === copyId ? "Copied" : "コピー"}
        </button>
      </div>
      <div className="mt-3 whitespace-pre-wrap rounded-md bg-black/25 p-3 text-sm font-bold leading-7 text-zinc-200">
        {value}
      </div>
    </div>
  );
}
