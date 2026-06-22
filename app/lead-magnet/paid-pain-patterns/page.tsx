import type { Metadata } from "next";
import Link from "next/link";
import {
  getSuccessRecordPlaceholder,
  getSuccessRecords,
  type SuccessRecord,
} from "@/lib/success-records";

export const metadata: Metadata = {
  title: "Paid Pain Patterns | Bilion",
  description:
    "A PDF-ready collection of paid pain patterns from real business signals.",
};

const NOT_EXTRACTED = getSuccessRecordPlaceholder();

type PainPatternCard = {
  title: string;
  revenue: string;
  buyer: string;
  pain: string;
  whyTheyPaid: string;
  recreation48h: string;
  bilionRemix: string;
};

function cleanField(value: string, fallback: string) {
  return value && value !== NOT_EXTRACTED ? value : fallback;
}

function summarize(value: string, maxLength = 420) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

function toPainPatternCard(record: SuccessRecord): PainPatternCard {
  const revenue = cleanField(
    record.revenueSignal,
    cleanField(record.pricingModel, "Revenue signal needs manual enrichment."),
  );
  const whyTheyPaid = cleanField(
    record.whyItWorked,
    cleanField(
      record.revenueSignal,
      "The buyer had a recurring pain and a clear reason to pay for a faster outcome.",
    ),
  );
  const remix = [
    cleanField(record.starterProduct, record.offer),
    cleanField(record.aiNativeRemake, ""),
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    title: cleanField(record.businessName, "Untitled paid pain pattern"),
    revenue: summarize(revenue),
    buyer: summarize(cleanField(record.buyer, "Buyer needs manual enrichment.")),
    pain: summarize(cleanField(record.pain, "Pain needs manual enrichment.")),
    whyTheyPaid: summarize(whyTheyPaid),
    recreation48h: summarize(
      cleanField(
        record.validationPlan48h,
        "Create a simple before/after sample, send it to 20 likely buyers, and ask for one paid pilot or concrete objection.",
      ),
    ),
    bilionRemix: summarize(
      remix || "Turn the pain into a small AI-native brief, prompt pack, audit, or workflow tool.",
    ),
  };
}

function getLeadMagnetCards() {
  return getSuccessRecords()
    .filter((record) => record.buyer !== NOT_EXTRACTED && record.pain !== NOT_EXTRACTED)
    .sort((a, b) => {
      const aScore =
        a.monetizationClarity + a.replicationScore + a.aiLeverageScore;
      const bScore =
        b.monetizationClarity + b.replicationScore + b.aiLeverageScore;

      return bScore - aScore;
    })
    .slice(0, 12)
    .map(toPainPatternCard);
}

function Field({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-lg border p-3",
        accent
          ? "border-emerald-400/25 bg-emerald-400/[0.07] print:border-zinc-300 print:bg-zinc-50"
          : "border-white/10 bg-black/20 print:border-zinc-200 print:bg-white",
      ].join(" ")}
    >
      <div
        className={[
          "text-[10px] font-black uppercase tracking-[0.16em]",
          accent ? "text-emerald-200 print:text-zinc-600" : "text-zinc-500",
        ].join(" ")}
      >
        {label}
      </div>
      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-zinc-100 print:text-zinc-800">
        {value}
      </p>
    </div>
  );
}

function PatternCard({
  card,
  index,
}: {
  card: PainPatternCard;
  index: number;
}) {
  return (
    <article className="break-inside-avoid rounded-xl border border-white/10 bg-[#111214] p-5 shadow-xl shadow-black/20 print:border-zinc-300 print:bg-white print:shadow-none">
      <div className="flex items-start gap-4 border-b border-white/10 pb-4 print:border-zinc-200">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-zinc-950 print:border print:border-zinc-300">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
            Paid Pain Pattern
          </div>
          <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-white print:text-zinc-950">
            {card.title}
          </h2>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <Field label="Revenue" value={card.revenue} accent />
        <Field label="Buyer" value={card.buyer} />
        <Field label="Pain" value={card.pain} />
        <Field label="Why They Paid" value={card.whyTheyPaid} />
        <Field label="48h Recreation" value={card.recreation48h} />
        <Field label="Bilion Remix" value={card.bilionRemix} accent />
      </div>
    </article>
  );
}

export default function PaidPainPatternsLeadMagnetPage() {
  const cards = getLeadMagnetCards();

  return (
    <main className="min-h-screen bg-[#08090b] text-white print:bg-white print:text-zinc-950">
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:py-10 print:max-w-none print:px-0 print:py-0">
        <header className="border-b border-white/10 pb-8 print:border-zinc-300 print:pb-6">
          <div className="flex items-center justify-between gap-4 print:hidden">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white text-sm font-black text-zinc-950">
                B
              </div>
              <div>
                <div className="text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                  Bilion
                </div>
                <div className="text-xs text-zinc-500">AI opportunity OS</div>
              </div>
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.04]"
            >
              Open Bilion
            </Link>
          </div>

          <div className="mt-10 print:mt-0">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300 print:text-zinc-600">
              PDF-ready lead magnet
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl print:text-4xl">
              Paid Pain Patterns
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 print:text-zinc-700">
              Real business signals converted into buyer pain, payment logic,
              48-hour recreations, and Bilion-style AI product remixes.
            </p>
          </div>
        </header>

        <section className="grid gap-5 py-6 md:grid-cols-2 print:grid-cols-2 print:gap-4 print:py-5">
          {cards.map((card, index) => (
            <PatternCard key={`${card.title}-${index}`} card={card} index={index} />
          ))}
        </section>

        <footer className="border-t border-white/10 py-6 print:border-zinc-300">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 print:border-zinc-300 print:bg-zinc-50">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              Built with Bilion
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300 print:text-zinc-700">
              Bilion turns startup stories, founder signals, newsletters, and
              market patterns into buildable AI business opportunities.
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
