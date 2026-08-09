"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContentStudioRecord } from "@/lib/content-studio";
import {
  buildOfferLadderMarkdown,
  buildOfferLadderPack,
  type OfferLadderPack,
  type OfferLadderPrices,
  type OfferTone,
} from "@/lib/offer-ladder-generator";

type SavedPack = {
  id: string;
  createdAt: string;
  pack: OfferLadderPack;
  prices: OfferLadderPrices;
  tone: OfferTone;
};

const storageKey = "bilion.operator.offerLadder.v1";

const lowTicketPrices: OfferLadderPrices["lowTicket"][] = [770, 1980, 2980];
const corePrices: OfferLadderPrices["core"][] = [9800, 14800, 19800, 29800];
const premiumPrices: OfferLadderPrices["premium"][] = [49800, 98000, 198000];
const tones: OfferTone[] = ["direct", "founder", "calm", "premium"];

function readSavedPacks(): SavedPack[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);

    return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
  } catch {
    return [];
  }
}

function writeSavedPacks(items: SavedPack[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items.slice(0, 10)));
}

function yen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}

function sourceLabel(record: ContentStudioRecord) {
  if (record.sourceType === "money move") {
    return "money signal";
  }

  if (record.sourceType === "signal") {
    return "gmail signal";
  }

  return "success pattern";
}

function buildSalesPageText(pack: OfferLadderPack) {
  return [
    `見出し: ${pack.salesPageSections.heading}`,
    `誰向けか: ${pack.salesPageSections.forWho}`,
    `悩み: ${pack.salesPageSections.pain}`,
    `何が手に入るか: ${pack.salesPageSections.outcome}`,
    `中身:\n${pack.salesPageSections.contents.map((item) => `- ${item}`).join("\n")}`,
    `価格: ${pack.salesPageSections.price}`,
    `納品形式: ${pack.salesPageSections.deliveryFormat}`,
    `よくある不安:\n${pack.salesPageSections.faq.map((item) => `- ${item}`).join("\n")}`,
    `CTA: ${pack.salesPageSections.cta}`,
  ].join("\n\n");
}

export default function OfferLadderClient({
  records,
}: {
  records: ContentStudioRecord[];
}) {
  const [selectedRecordId, setSelectedRecordId] = useState(records[0]?.id || "");
  const [buyerOverride, setBuyerOverride] = useState(records[0]?.buyer || "");
  const [tone, setTone] = useState<OfferTone>("direct");
  const [prices, setPrices] = useState<OfferLadderPrices>({
    lowTicket: 1980,
    core: 14800,
    premium: 49800,
  });
  const [savedPacks, setSavedPacks] = useState<SavedPack[]>([]);
  const [copiedKey, setCopiedKey] = useState("");

  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) || records[0],
    [records, selectedRecordId],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSavedPacks(readSavedPacks());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const pack = useMemo(() => {
    if (!selectedRecord) {
      return null;
    }

    return buildOfferLadderPack(selectedRecord, prices, buyerOverride, tone);
  }, [buyerOverride, prices, selectedRecord, tone]);

  const markdown = useMemo(() => (pack ? buildOfferLadderMarkdown(pack) : ""), [pack]);

  async function handleCopy(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(""), 1200);
  }

  function handleSave() {
    if (!pack) {
      return;
    }

    const nextItems = [
      {
        id: `${Date.now()}-${pack.sourceTitle}`,
        createdAt: new Date().toISOString(),
        pack,
        prices,
        tone,
      },
      ...savedPacks,
    ].slice(0, 10);

    setSavedPacks(nextItems);
    writeSavedPacks(nextItems);
  }

  function handleSelectRecord(recordId: string) {
    const nextRecord = records.find((record) => record.id === recordId);

    setSelectedRecordId(recordId);
    setBuyerOverride(nextRecord?.buyer || "");
  }

  function handleLoad(item: SavedPack) {
    const record = records.find(
      (candidate) => candidate.title === item.pack.sourceTitle,
    );

    if (record) {
      setSelectedRecordId(record.id);
    }

    setBuyerOverride(item.pack.buyer);
    setPrices(item.prices);
    setTone(item.tone);
  }

  function handleDelete(id: string) {
    const nextItems = savedPacks.filter((item) => item.id !== id);

    setSavedPacks(nextItems);
    writeSavedPacks(nextItems);
  }

  if (!pack || !selectedRecord) {
    return (
      <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-100">
        <div className="mx-auto max-w-6xl rounded-lg border border-white/10 bg-zinc-900 p-5">
          Offer Ladderに使えるDBレコードが見つかりませんでした。
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <section className="grid gap-4 border-b border-white/10 pb-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs font-black uppercase text-emerald-200">
                Operator / Offer Ladder
              </div>
              <h1 className="mt-2 text-3xl font-black text-white">
                Bilion Offer Ladder Pack
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                既存DBの1件を、無料餌、低単価、本命商品、高単価、個別対応、
                Launch Assets、検証手順に変換します。
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleSave}
                className="min-h-11 rounded-md bg-emerald-300 px-4 text-sm font-black text-zinc-950 transition hover:bg-emerald-200"
              >
                localStorageに保存
              </button>
              <button
                type="button"
                onClick={() => void handleCopy("markdown", markdown)}
                className="min-h-11 rounded-md bg-white px-4 text-sm font-black text-zinc-950 transition hover:bg-zinc-200"
              >
                {copiedKey === "markdown" ? "Copied" : "Markdownで全部コピー"}
              </button>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_0.7fr]">
            <label>
              <span className="text-xs font-black uppercase text-zinc-500">
                DBネタ
              </span>
              <select
                value={selectedRecordId}
                onChange={(event) => handleSelectRecord(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-900 px-3 text-sm font-bold text-zinc-100 outline-none"
              >
                {records.map((record) => (
                  <option key={record.id} value={record.id}>
                    {sourceLabel(record)} / {record.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-xs font-black uppercase text-zinc-500">
                Buyer変更
              </span>
              <input
                value={buyerOverride}
                onChange={(event) => setBuyerOverride(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none"
              />
            </label>

            <label>
              <span className="text-xs font-black uppercase text-zinc-500">
                Tone
              </span>
              <select
                value={tone}
                onChange={(event) => setTone(event.target.value as OfferTone)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-900 px-3 text-sm font-bold text-zinc-100 outline-none"
              >
                {tones.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <PriceSelect
              label="Low Ticket"
              options={lowTicketPrices}
              value={prices.lowTicket}
              onChange={(value) =>
                setPrices((current) => ({ ...current, lowTicket: value }))
              }
            />
            <PriceSelect
              label="Core"
              options={corePrices}
              value={prices.core}
              onChange={(value) =>
                setPrices((current) => ({ ...current, core: value }))
              }
            />
            <PriceSelect
              label="Premium / Done For You"
              options={premiumPrices}
              value={prices.premium}
              onChange={(value) =>
                setPrices((current) => ({ ...current, premium: value }))
              }
            />
          </div>
        </section>

        <section className="grid gap-3 rounded-lg border border-white/10 bg-zinc-900 p-4">
          <div className="grid gap-3 lg:grid-cols-4">
            <MetaBlock label="sourceTitle" value={pack.sourceTitle} />
            <MetaBlock label="sourceType" value={pack.sourceType} />
            <MetaBlock label="buyer" value={pack.buyer} />
            <MetaBlock label="moneyProof" value={pack.moneyProof} />
          </div>
          <OutputBlock label="paidPain" value={pack.paidPain} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <OfferCard title="Free Bait" offer={pack.freeBait} />
          <OfferCard title="Low Ticket" offer={pack.lowTicketOffer} />
          <OfferCard title="Core Offer 9,800円以上" offer={pack.coreOffer9800} />
          <OfferCard title="Premium Offer 29,800円以上" offer={pack.premiumOffer29800} />
          <OfferCard title="Done For You 49,800円以上" offer={pack.doneForYouOffer49800} />
          <ListBlock title="Delivery Assets" items={pack.deliveryAssets} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <CopyBlock
            copyKey="xPost"
            copiedKey={copiedKey}
            label="Launch Assets / X投稿"
            value={pack.xPost}
            onCopy={handleCopy}
          />
          <CopyBlock
            copyKey="dmScript"
            copiedKey={copiedKey}
            label="Launch Assets / DM文"
            value={pack.dmScript}
            onCopy={handleCopy}
          />
          <CopyBlock
            copyKey="sales"
            copiedKey={copiedKey}
            label="販売ページ構成"
            value={buildSalesPageText(pack)}
            onCopy={handleCopy}
          />
          <CopyBlock
            copyKey="delivery"
            copiedKey={copiedKey}
            label="納品物リスト"
            value={pack.deliveryAssets.map((item) => `- ${item}`).join("\n")}
            onCopy={handleCopy}
          />
          <CopyBlock
            copyKey="validation"
            copiedKey={copiedKey}
            label="Validation Plan"
            value={Object.entries(pack.validationPlan)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")}
            onCopy={handleCopy}
          />
          <CopyBlock
            copyKey="buildPrompt"
            copiedKey={copiedKey}
            label="Build After Replies"
            value={pack.buildPrompt}
            onCopy={handleCopy}
          />
        </section>

        <section className="grid gap-4 rounded-lg border border-amber-300/20 bg-amber-300/[0.04] p-4">
          <div>
            <div className="text-xs font-black uppercase text-amber-200">
              Risk Notes / Next Action
            </div>
            <h2 className="mt-2 text-xl font-black text-white">
              手作業で売ってから作る
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ListBlock title="riskNotes" items={pack.riskNotes} />
            <OutputBlock label="nextAction" value={pack.nextAction} />
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-white/10 bg-zinc-900 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase text-zinc-500">
                Saved Packs
              </div>
              <h2 className="mt-2 text-xl font-black text-white">
                最新10件を読み込む
              </h2>
            </div>
            <div className="text-sm font-bold text-zinc-400">
              {savedPacks.length}/10 saved
            </div>
          </div>

          {savedPacks.length === 0 ? (
            <div className="rounded-md border border-white/10 bg-black/25 p-4 text-sm font-bold text-zinc-400">
              まだ保存されたOffer Ladder Packはありません。
            </div>
          ) : (
            <div className="grid gap-3">
              {savedPacks.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-3 rounded-md border border-white/10 bg-black/25 p-3 lg:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase text-zinc-500">
                      {new Date(item.createdAt).toLocaleString("ja-JP")}
                    </div>
                    <h3 className="mt-1 break-words text-base font-black text-white">
                      {item.pack.sourceTitle}
                    </h3>
                    <p className="mt-1 break-words text-sm text-zinc-400">
                      {item.pack.buyer} / {item.pack.coreOffer9800.price}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:w-56">
                    <button
                      type="button"
                      onClick={() => handleLoad(item)}
                      className="min-h-10 rounded-md bg-white px-3 text-xs font-black text-zinc-950 transition hover:bg-zinc-200"
                    >
                      読み込む
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="min-h-10 rounded-md border border-red-300/30 px-3 text-xs font-black text-red-100 transition hover:bg-red-300/10"
                    >
                      削除
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

function PriceSelect<T extends number>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: T[];
  value: T;
}) {
  return (
    <label>
      <span className="text-xs font-black uppercase text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value) as T)}
        className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-900 px-3 text-sm font-bold text-zinc-100 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {yen(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-black/25 p-3">
      <div className="text-xs font-black uppercase text-zinc-500">{label}</div>
      <div className="mt-2 break-words text-sm font-bold text-zinc-100">
        {value}
      </div>
    </div>
  );
}

function OutputBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-black/25 p-3">
      <div className="text-xs font-black uppercase text-zinc-500">{label}</div>
      <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-zinc-200">
        {value}
      </pre>
    </div>
  );
}

function ListBlock({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-black/25 p-3">
      <div className="text-xs font-black uppercase text-zinc-500">{title}</div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-200">
        {items.map((item) => (
          <li key={`${title}-${item}`} className="break-words">
            - {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OfferCard({
  offer,
  title,
}: {
  offer: OfferLadderPack["freeBait"];
  title: string;
}) {
  const lines = [
    offer.format ? `format: ${offer.format}` : "",
    offer.price ? `price: ${offer.price}` : "",
    offer.buyer ? `buyer: ${offer.buyer}` : "",
    `promise: ${offer.promise}`,
    offer.cta ? `cta: ${offer.cta}` : "",
    offer.whyBuyNow ? `whyBuyNow: ${offer.whyBuyNow}` : "",
    offer.deliveryFormat ? `deliveryFormat: ${offer.deliveryFormat}` : "",
    offer.deliveryTime ? `deliveryTime: ${offer.deliveryTime}` : "",
    offer.whyThisCanSell ? `whyThisCanSell: ${offer.whyThisCanSell}` : "",
    offer.whoShouldBuy ? `whoShouldBuy: ${offer.whoShouldBuy}` : "",
    offer.whyManualIsOkay ? `whyManualIsOkay: ${offer.whyManualIsOkay}` : "",
  ].filter(Boolean);
  const items = offer.whatUserGets || offer.contents || offer.manualSteps || [];

  return (
    <article className="min-w-0 rounded-lg border border-white/10 bg-zinc-900 p-4">
      <div className="text-xs font-black uppercase text-emerald-200">{title}</div>
      <h2 className="mt-2 break-words text-lg font-black text-white">
        {offer.name}
      </h2>
      <div className="mt-3 grid gap-2">
        {lines.map((line) => (
          <p key={line} className="break-words text-sm leading-6 text-zinc-300">
            {line}
          </p>
        ))}
      </div>
      {items.length > 0 ? <ListBlock title="contents" items={items} /> : null}
    </article>
  );
}

function CopyBlock({
  copiedKey,
  copyKey,
  label,
  onCopy,
  value,
}: {
  copiedKey: string;
  copyKey: string;
  label: string;
  onCopy: (key: string, value: string) => Promise<void>;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-zinc-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-black uppercase text-zinc-500">{label}</div>
        <button
          type="button"
          onClick={() => void onCopy(copyKey, value)}
          className="min-h-9 shrink-0 rounded-md bg-white px-3 text-xs font-black text-zinc-950 transition hover:bg-zinc-200"
        >
          {copiedKey === copyKey ? "Copied" : "コピー"}
        </button>
      </div>
      <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-zinc-200">
        {value}
      </pre>
    </div>
  );
}
