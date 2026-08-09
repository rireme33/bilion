"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildContentFactoryPack,
  type ContentFactoryPack,
} from "@/lib/content-factory";
import type { ContentStudioRecord } from "@/lib/content-studio";

type SavedPack = {
  createdAt: string;
  id: string;
  pack: ContentFactoryPack;
};

type OutputSection = {
  body: string;
  key: string;
  title: string;
};

const storageKey = "bilion.operator.contentFactory.v1";

function readSavedPacks() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    return Array.isArray(parsedValue) ? (parsedValue as SavedPack[]) : [];
  } catch {
    return [];
  }
}

function writeSavedPacks(items: SavedPack[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(items));
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);

    return true;
  } catch {
    return false;
  }
}

function formatMarkdown(pack: ContentFactoryPack) {
  return [
    `# ${pack.sourceTitle}`,
    "",
    "## 投稿タイトル案",
    pack.titleIdeas.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## X投稿",
    pack.xPost,
    "",
    "## Xカルーセル本文",
    pack.xCarousel.join("\n\n"),
    "",
    "## note記事",
    pack.noteArticle,
    "",
    "## Substack記事",
    pack.substackArticle,
    "",
    "## Brain 770円商品の目次",
    pack.brainProductOutline,
    "",
    "## DM文",
    pack.dm,
    "",
    "## CTA",
    pack.cta,
    "",
    "## ハッシュタグ",
    pack.hashtags.join(" "),
    "",
    "## Codex Build Prompt",
    pack.codexBuildPrompt,
    "",
    "## 画像生成プロンプト",
    pack.imagePrompt,
  ].join("\n");
}

function getOutputSections(pack: ContentFactoryPack): OutputSection[] {
  return [
    {
      body: pack.xPost,
      key: "x",
      title: "X",
    },
    {
      body: pack.xCarousel.join("\n\n"),
      key: "carousel",
      title: "Carousel",
    },
    {
      body: pack.noteArticle,
      key: "note",
      title: "note",
    },
    {
      body: pack.substackArticle,
      key: "substack",
      title: "Substack",
    },
    {
      body: pack.brainProductOutline,
      key: "brain",
      title: "Brain 770円",
    },
    {
      body: [pack.dm, "", "CTA:", pack.cta, "", pack.hashtags.join(" ")].join("\n"),
      key: "dm-cta",
      title: "DM and CTA",
    },
    {
      body: pack.codexBuildPrompt,
      key: "codex",
      title: "Codex Prompt",
    },
    {
      body: pack.imagePrompt,
      key: "image",
      title: "Image Prompt",
    },
  ];
}

function formatDate(value: string) {
  return value.slice(0, 16).replace("T", " ");
}

export default function ContentFactoryClient({
  records,
}: {
  records: ContentStudioRecord[];
}) {
  const [selectedRecordId, setSelectedRecordId] = useState(records[0]?.id || "");
  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) || records[0],
    [records, selectedRecordId],
  );
  const [pack, setPack] = useState<ContentFactoryPack | null>(() =>
    selectedRecord ? buildContentFactoryPack(selectedRecord) : null,
  );
  const [savedPacks, setSavedPacks] = useState<SavedPack[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const markdownExport = useMemo(() => (pack ? formatMarkdown(pack) : ""), [pack]);
  const outputSections = useMemo(
    () => (pack ? getOutputSections(pack) : []),
    [pack],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSavedPacks(readSavedPacks());
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      writeSavedPacks(savedPacks);
    }
  }, [isLoaded, savedPacks]);

  function handleGenerate() {
    if (!selectedRecord) {
      return;
    }

    setPack(buildContentFactoryPack(selectedRecord));
  }

  async function handleCopy(key: string, value: string) {
    const copied = await copyText(value);
    setCopiedKey(copied ? key : "error");
    window.setTimeout(() => setCopiedKey(""), 1200);
  }

  function handleSavePack() {
    if (!pack) {
      return;
    }

    const nextPack = {
      createdAt: new Date().toISOString(),
      id: `content-pack-${Date.now()}`,
      pack,
    };

    setSavedPacks((current) => [nextPack, ...current].slice(0, 10));
  }

  function handleLoadPack(item: SavedPack) {
    setPack(item.pack);
    setSelectedRecordId(item.pack.recordId);
  }

  function handleDeletePack(id: string) {
    setSavedPacks((current) => current.filter((item) => item.id !== id));
  }

  if (!selectedRecord || !pack) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-5xl rounded-lg border border-white/10 bg-zinc-900 p-5">
          No content records found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="border-b border-white/10 pb-6">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Operator / Content Factory v0
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
            Turn one Bilion signal into publishable content.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
            Pick one existing record, generate copyable posts, articles, a 770円
            product outline, DMs, prompts, and validation assets. No API, no DB
            write, no auto-posting. Build only after replies.
          </p>
        </section>

        <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <label className="min-w-0 flex-1">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Source selector
              </span>
              <select
                value={selectedRecordId}
                onChange={(event) => setSelectedRecordId(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm font-bold text-zinc-100 outline-none"
              >
                {records.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.sourceType} / {record.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
              <button
                type="button"
                onClick={handleGenerate}
                className="min-h-12 rounded-md bg-emerald-300 px-4 text-sm font-black text-zinc-950 transition hover:bg-emerald-200"
              >
                Generate Pack
              </button>
              <button
                type="button"
                onClick={() => void handleCopy("all", markdownExport)}
                className="min-h-12 rounded-md bg-white px-4 text-sm font-black text-zinc-950 transition hover:bg-zinc-200"
              >
                {copiedKey === "all" ? "Copied" : "Copy All"}
              </button>
              <button
                type="button"
                onClick={handleSavePack}
                className="min-h-12 rounded-md border border-white/10 px-4 text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
              >
                Save Pack
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <SourceField label="Source type" value={selectedRecord.sourceType} />
            <SourceField label="Buyer" value={selectedRecord.buyer} />
            <SourceField label="Pain" value={selectedRecord.pain} />
            <SourceField label="First offer" value={selectedRecord.firstProduct} />
          </div>
        </section>

        {copiedKey === "error" && (
          <div className="rounded-md border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100">
            Clipboard blocked. Copy from the markdown textarea instead.
          </div>
        )}

        <section className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                Output cards
              </div>
              <h2 className="mt-2 text-2xl font-black text-white">
                One signal, multiple distribution assets.
              </h2>
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 px-3 py-2 text-xs font-bold text-zinc-400">
              {pack.sourceTitle}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <OutputCard
              body={pack.titleIdeas.map((item, index) => `${index + 1}. ${item}`).join("\n")}
              copiedKey={copiedKey}
              copyKey="titles"
              onCopy={handleCopy}
              title="投稿タイトル案"
            />
            {outputSections.map((section) => (
              <OutputCard
                body={section.body}
                copiedKey={copiedKey}
                copyKey={section.key}
                key={section.key}
                onCopy={handleCopy}
                title={section.title}
              />
            ))}
            <OutputCard
              body={markdownExport}
              copiedKey={copiedKey}
              copyKey="markdown"
              onCopy={handleCopy}
              title="Markdown export"
            />
          </div>
        </section>

        <section className="grid gap-4 pb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">
                Saved packs
              </div>
              <h2 className="mt-2 text-2xl font-black text-white">
                Latest 10 local drafts.
              </h2>
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 px-3 py-2 text-xs font-bold text-zinc-400">
              localStorage only
            </div>
          </div>

          {savedPacks.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-zinc-900 p-4 text-sm font-bold text-zinc-400">
              No saved packs yet. Generate a pack, then save it.
            </div>
          ) : (
            <div className="grid gap-3">
              {savedPacks.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-3 rounded-lg border border-white/10 bg-zinc-900 p-4 lg:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                      {formatDate(item.createdAt)}
                    </div>
                    <h3 className="mt-2 break-words text-lg font-black text-white">
                      {item.pack.sourceTitle}
                    </h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-zinc-400">
                      {item.pack.titleIdeas[0]}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3 lg:w-[22rem]">
                    <button
                      type="button"
                      onClick={() => handleLoadPack(item)}
                      className="min-h-10 rounded-md bg-white px-3 text-xs font-black text-zinc-950 transition hover:bg-zinc-200"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopy(`saved-${item.id}`, formatMarkdown(item.pack))}
                      className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
                    >
                      {copiedKey === `saved-${item.id}` ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePack(item.id)}
                      className="min-h-10 rounded-md border border-red-300/30 px-3 text-xs font-black text-red-100 transition hover:bg-red-300/10"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SourceField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/25 p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-bold leading-6 text-zinc-200">
        {value}
      </div>
    </div>
  );
}

function OutputCard({
  body,
  copiedKey,
  copyKey,
  onCopy,
  title,
}: {
  body: string;
  copiedKey: string;
  copyKey: string;
  onCopy: (key: string, value: string) => Promise<void>;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-black text-white">{title}</h3>
        <button
          type="button"
          onClick={() => void onCopy(copyKey, body)}
          className="min-h-9 shrink-0 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
        >
          {copiedKey === copyKey ? "Copied" : "Copy"}
        </button>
      </div>
      <textarea
        readOnly
        value={body}
        className="mt-3 min-h-72 w-full rounded-md border border-white/10 bg-black/30 px-3 py-3 text-sm leading-6 text-zinc-200 outline-none"
      />
    </article>
  );
}
