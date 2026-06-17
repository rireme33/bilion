"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  SuccessRecord,
  SuccessRecordQualityLabel,
} from "@/lib/success-records";
import CopyButton from "./CopyButton";

type FilterLabel = "All" | SuccessRecordQualityLabel;

const filters: FilterLabel[] = [
  "All",
  "Ready to post",
  "Needs enrichment",
  "Weak record",
];

const displayFields: Array<{
  label: string;
  key: keyof SuccessRecord;
  copy?: boolean;
}> = [
  { label: "Business", key: "businessName" },
  { label: "Revenue Signal", key: "revenueSignal" },
  { label: "Buyer", key: "buyer" },
  { label: "Pain", key: "pain" },
  { label: "Offer", key: "offer" },
  { label: "Growth Channel", key: "growthChannel" },
  { label: "Why It Worked", key: "whyItWorked" },
  { label: "AI Remake", key: "aiNativeRemake" },
  { label: "Starter Product", key: "starterProduct" },
  { label: "X Post", key: "xPost", copy: true },
  { label: "Short Script", key: "shortScript", copy: true },
  { label: "Image Prompt", key: "imagePrompt", copy: true },
  { label: "Build Prompt", key: "buildPrompt", copy: true },
];

function labelClasses(label: SuccessRecordQualityLabel) {
  if (label === "Ready to post") {
    return "border-emerald-300/30 bg-emerald-300/10 text-emerald-100";
  }

  if (label === "Needs enrichment") {
    return "border-yellow-300/30 bg-yellow-300/10 text-yellow-100";
  }

  return "border-red-300/30 bg-red-300/10 text-red-100";
}

function FieldBlock({
  label,
  value,
  copy,
}: {
  label: string;
  value: string | number | string[] | object;
  copy?: boolean;
}) {
  const textValue = Array.isArray(value)
    ? value.join("\n")
    : typeof value === "object"
      ? JSON.stringify(value, null, 2)
      : String(value);

  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </div>
        {copy && <CopyButton value={textValue} />}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
        {textValue}
      </p>
    </div>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-black text-white">{value}/10</div>
    </div>
  );
}

function SignalFlag({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-xs font-bold",
        active
          ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
          : "border-white/10 bg-white/[0.03] text-zinc-500",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function RecordCard({ record }: { record: SuccessRecord }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101011] p-5 shadow-xl shadow-black/20">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              {record.sourceType}
            </div>
            <span
              className={[
                "rounded-full border px-3 py-1 text-xs font-black",
                labelClasses(record.qualityLabel),
              ].join(" ")}
            >
              {record.qualityLabel}
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
            {record.businessName}
          </h2>
          {record.sourceUrl !== "Not extracted yet" && (
            <a
              href={record.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-words text-sm text-zinc-500 underline underline-offset-4 transition hover:text-zinc-200"
            >
              Source
            </a>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <SignalFlag
              label="Growth channel"
              active={record.qualitySignals.hasGrowthChannel}
            />
            <SignalFlag
              label="Why it worked"
              active={record.qualitySignals.hasWhyItWorked}
            />
            <SignalFlag
              label="Revenue"
              active={record.qualitySignals.hasRevenueSignal}
            />
            <SignalFlag
              label="Build prompt"
              active={record.qualitySignals.hasBuildPrompt}
            />
            <SignalFlag
              label="Distribution"
              active={record.qualitySignals.hasDistributionAssets}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:min-w-[420px]">
          <ScorePill label="Replication" value={record.replicationScore} />
          <ScorePill label="AI leverage" value={record.aiLeverageScore} />
          <ScorePill label="Money clarity" value={record.monetizationClarity} />
          <ScorePill label="Build difficulty" value={record.buildDifficulty} />
        </div>
      </div>

      <section className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.04] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
            Post Card
          </div>
          <CopyButton value={record.postCard} />
        </div>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-100">
          {record.postCard}
        </pre>
      </section>

      <section className="mt-4 rounded-lg border border-white/10 bg-black/25 p-4">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
          Enrichment Notes
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {record.enrichmentNotes.map((note) => (
            <span
              key={`${record.id}-${note}`}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-bold text-zinc-300"
            >
              {note}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {displayFields.map((field) => (
          <FieldBlock
            key={`${record.id}-${field.key}`}
            label={field.label}
            value={record[field.key]}
            copy={field.copy}
          />
        ))}
      </div>
    </article>
  );
}

export default function SuccessRecordsClient({
  records,
}: {
  records: SuccessRecord[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterLabel>("All");

  const counts = useMemo(() => {
    return filters.reduce<Record<FilterLabel, number>>(
      (acc, filter) => {
        acc[filter] =
          filter === "All"
            ? records.length
            : records.filter((record) => record.qualityLabel === filter).length;
        return acc;
      },
      {
        All: 0,
        "Ready to post": 0,
        "Needs enrichment": 0,
        "Weak record": 0,
      },
    );
  }, [records]);

  const visibleRecords =
    activeFilter === "All"
      ? records
      : records.filter((record) => record.qualityLabel === activeFilter);

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/app"
              className="text-sm font-bold text-zinc-500 transition hover:text-white"
            >
              Back to Bilion
            </Link>
            <div className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              Internal Preview
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              Success Records
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
              Review mapped Goldmine signals, spot enrichment gaps, and copy
              distribution-ready Post Cards.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="text-3xl font-black">{records.length}</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
              mapped records
            </div>
          </div>
        </header>

        <section className="border-b border-white/10 py-5">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={[
                    "rounded-lg border px-4 py-2 text-sm font-bold transition",
                    active
                      ? "border-white/30 bg-white text-zinc-950"
                      : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white",
                  ].join(" ")}
                >
                  {filter}{" "}
                  <span className={active ? "text-zinc-500" : "text-zinc-600"}>
                    {counts[filter]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 py-6">
          {visibleRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </section>
      </section>
    </main>
  );
}
