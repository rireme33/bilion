import Link from "next/link";
import { getSuccessRecords, type SuccessRecord } from "@/lib/success-records";
import CopyButton from "./CopyButton";

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

function FieldBlock({
  label,
  value,
  copy,
}: {
  label: string;
  value: string | number;
  copy?: boolean;
}) {
  const textValue = String(value);

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

function RecordCard({ record }: { record: SuccessRecord }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101011] p-5 shadow-xl shadow-black/20">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
            {record.sourceType}
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
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
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:min-w-[420px]">
          <ScorePill label="Replication" value={record.replicationScore} />
          <ScorePill label="AI leverage" value={record.aiLeverageScore} />
          <ScorePill label="Money clarity" value={record.monetizationClarity} />
          <ScorePill label="Build difficulty" value={record.buildDifficulty} />
        </div>
      </div>

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

export default function SuccessRecordsPage() {
  const records = getSuccessRecords();

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
              Existing enriched Goldmine signals mapped into Bilion&apos;s first
              canonical Success Pattern OS record shape.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="text-3xl font-black">{records.length}</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
              mapped records
            </div>
          </div>
        </header>

        <section className="grid gap-5 py-6">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </section>
      </section>
    </main>
  );
}
