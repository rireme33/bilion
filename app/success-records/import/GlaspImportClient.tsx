"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  mapImportedJsonToSuccessRecord,
  type SuccessRecord,
} from "@/lib/success-records";
import CopyButton from "../CopyButton";

const STORAGE_KEY = "bilion.importedSuccessRecords";
const NOT_EXTRACTED = "Not extracted yet";

const previewFields: Array<{
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
  { label: "AI Native Remake", key: "aiNativeRemake" },
  { label: "Starter Product", key: "starterProduct" },
  { label: "X Post Ideas", key: "xPost", copy: true },
  { label: "Short Script Ideas", key: "shortScript", copy: true },
  { label: "Image Prompt", key: "imagePrompt", copy: true },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeSavedRecords(value: unknown): SuccessRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord) as SuccessRecord[];
}

function findJsonCandidate(text: string) {
  const marker = /bilion\s+record\s+json/i.exec(text);
  const startAt = marker ? marker.index + marker[0].length : 0;
  const openIndex = text.slice(startAt).search(/[\[{]/);

  if (openIndex === -1) {
    return "";
  }

  const absoluteOpenIndex = startAt + openIndex;
  const open = text[absoluteOpenIndex];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = absoluteOpenIndex; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === open) {
      depth += 1;
    }

    if (char === close) {
      depth -= 1;

      if (depth === 0) {
        return text.slice(absoluteOpenIndex, index + 1);
      }
    }
  }

  return "";
}

function parseGlaspOutput(text: string) {
  const candidate = findJsonCandidate(text);

  if (!candidate) {
    throw new Error(
      'No JSON block found. Paste the Glasp output that includes "Bilion Record JSON" and a JSON object.',
    );
  }

  const parsed = JSON.parse(candidate) as unknown;
  const recordLike = Array.isArray(parsed) ? parsed[0] : parsed;

  if (!isRecord(recordLike)) {
    throw new Error("The extracted JSON must be an object or an array with one object.");
  }

  return recordLike;
}

function labelClasses(label: SuccessRecord["qualityLabel"]) {
  if (label === "Ready to post") {
    return "border-emerald-300/30 bg-emerald-300/10 text-emerald-100";
  }

  if (label === "Needs enrichment") {
    return "border-yellow-300/30 bg-yellow-300/10 text-yellow-100";
  }

  return "border-red-300/30 bg-red-300/10 text-red-100";
}

function stringifyRecord(record: SuccessRecord) {
  return JSON.stringify(record, null, 2);
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

function MissingFieldNotes({ record }: { record: SuccessRecord }) {
  const missing = previewFields
    .filter((field) => String(record[field.key]) === NOT_EXTRACTED)
    .map((field) => `${field.label} missing`);
  const notes = [...missing, ...record.enrichmentNotes];
  const uniqueNotes = Array.from(new Set(notes));

  return (
    <section className="rounded-lg border border-white/10 bg-black/25 p-4">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
        Missing Fields / Quality Notes
      </div>
      {uniqueNotes.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-400">No obvious gaps detected.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {uniqueNotes.map((note) => (
            <span
              key={note}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-bold text-zinc-300"
            >
              {note}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function PreviewCard({
  onSave,
  record,
}: {
  onSave: () => void;
  record: SuccessRecord;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101011] p-5 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              Parsed Preview
            </span>
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
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyButton label="Copy JSON" value={stringifyRecord(record)} />
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-white px-4 py-2 text-xs font-black text-zinc-950 transition hover:bg-zinc-200"
          >
            Save to Browser
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {previewFields.map((field) => (
          <FieldBlock
            key={`${record.id}-${field.key}`}
            label={field.label}
            value={record[field.key]}
            copy={field.copy}
          />
        ))}
      </div>

      <div className="mt-4">
        <MissingFieldNotes record={record} />
      </div>
    </article>
  );
}

function SavedRecordCard({ record }: { record: SuccessRecord }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101011] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            {record.sourceType}
          </div>
          <h3 className="mt-2 text-lg font-black text-white">{record.businessName}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
            {record.pain}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <CopyButton label="Copy Post Card" value={record.postCard} />
          <CopyButton label="Copy JSON" value={stringifyRecord(record)} />
        </div>
      </div>
    </article>
  );
}

export default function GlaspImportClient() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [previewRecord, setPreviewRecord] = useState<SuccessRecord | null>(null);
  const [savedRecords, setSavedRecords] = useState<SuccessRecord[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      return raw ? normalizeSavedRecords(JSON.parse(raw)) : [];
    } catch {
      return [];
    }
  });
  const [saveMessage, setSaveMessage] = useState("");

  const exportedJson = useMemo(
    () => JSON.stringify(savedRecords, null, 2),
    [savedRecords],
  );

  function persistRecords(records: SuccessRecord[]) {
    setSavedRecords(records);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function extractRecord() {
    setError("");
    setSaveMessage("");

    try {
      const parsed = parseGlaspOutput(input);
      setPreviewRecord(mapImportedJsonToSuccessRecord(parsed, savedRecords.length));
    } catch (parseError) {
      setPreviewRecord(null);
      setError(
        parseError instanceof Error
          ? parseError.message
          : "Could not parse the pasted Glasp output.",
      );
    }
  }

  function savePreviewRecord() {
    if (!previewRecord) {
      return;
    }

    const recordToSave = {
      ...previewRecord,
      id: `${previewRecord.id}-${Date.now()}`,
    };
    const nextRecords = [recordToSave, ...savedRecords].slice(0, 50);
    persistRecords(nextRecords);
    setSaveMessage("Saved locally in this browser.");
  }

  function exportSavedRecords() {
    const blob = new Blob([exportedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "bilion-imported-success-records.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/success-records"
              className="text-sm font-bold text-zinc-500 transition hover:text-white"
            >
              Back to Success Records
            </Link>
            <div className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              Internal Import
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              Glasp to Success Record
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
              Paste a Glasp-generated business breakdown, extract the Bilion
              Record JSON, preview the mapped SuccessRecord, and save it locally
              in this browser.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="text-3xl font-black">{savedRecords.length}</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
              local imports
            </div>
          </div>
        </header>

        <section className="grid gap-5 border-b border-white/10 py-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-white/10 bg-[#101011] p-5">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                Glasp Output
              </span>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Paste Glasp output here. If it includes a heading like Bilion Record JSON, the importer will extract the JSON block after it."
                className="mt-3 min-h-[420px] w-full resize-y rounded-lg border border-white/10 bg-black/35 p-4 text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-white/30"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={extractRecord}
                className="rounded-lg bg-white px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-zinc-200"
              >
                Extract Bilion Record JSON
              </button>
              {previewRecord && (
                <CopyButton label="Copy JSON" value={stringifyRecord(previewRecord)} />
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-300/30 bg-red-300/10 p-4 text-sm leading-6 text-red-100">
                {error}
              </div>
            )}
            {saveMessage && (
              <div className="mt-4 rounded-lg border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
                {saveMessage}
              </div>
            )}
          </div>

          <div>
            {previewRecord ? (
              <PreviewCard record={previewRecord} onSave={savePreviewRecord} />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-white/10 bg-[#101011] p-6 text-center">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    Preview
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
                    Extracted SuccessRecord preview will appear here. Missing
                    optional fields are filled with deterministic placeholders.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Saved Imported Records
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Stored only in this browser with localStorage. Nothing is
                written to repository data files.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton label="Copy Imported JSON" value={exportedJson} />
              <button
                type="button"
                onClick={exportSavedRecords}
                disabled={savedRecords.length === 0}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Export Imported Records JSON
              </button>
            </div>
          </div>

          {savedRecords.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-[#101011] p-5 text-sm text-zinc-500">
              No imported records saved yet.
            </div>
          ) : (
            <div className="grid gap-3">
              {savedRecords.map((record) => (
                <SavedRecordCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
