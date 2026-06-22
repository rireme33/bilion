"use client";

import { useMemo, useState } from "react";

type InvoiceSample = {
  id: string;
  client: string;
  project: string;
  amount: string;
  dueDate: string;
  status: "Overdue" | "Due soon" | "Second reminder";
  urgency: "Low" | "Medium" | "High";
  notes: string;
  buyerContext: string;
};

type SavedOutput = {
  id: string;
  createdAt: string;
  client: string;
  status: string;
  summary: string;
  email: string;
  nextAction: string;
};

const price = "$19 one-time";

const samples: InvoiceSample[] = [
  {
    id: "brand-refresh",
    client: "Northstar Studio",
    project: "Brand refresh sprint",
    amount: "$2,400",
    dueDate: "12 days overdue",
    status: "Overdue",
    urgency: "Medium",
    notes:
      "Friendly client, final files delivered, invoice sent twice. They usually pay after a reminder but this one slipped.",
    buyerContext: "Freelance designer managing invoice follow-up manually",
  },
  {
    id: "analytics-retainer",
    client: "BrightLedger",
    project: "Analytics setup retainer",
    amount: "$1,150",
    dueDate: "3 days overdue",
    status: "Overdue",
    urgency: "Low",
    notes:
      "Client asked for one extra dashboard tweak after delivery. Need a polite follow-up that keeps the relationship warm.",
    buyerContext: "Solo consultant balancing delivery and admin",
  },
  {
    id: "launch-copy",
    client: "CourseForge",
    project: "Launch email copy",
    amount: "$850",
    dueDate: "due in 2 days",
    status: "Due soon",
    urgency: "Low",
    notes:
      "Invoice is not late yet, but client is busy during launch week. Need a proactive reminder without sounding pushy.",
    buyerContext: "Freelance copywriter who wants clean payment habits",
  },
  {
    id: "ops-audit",
    client: "Harbor Ops",
    project: "Operations audit",
    amount: "$3,900",
    dueDate: "24 days overdue",
    status: "Second reminder",
    urgency: "High",
    notes:
      "Decision maker has gone quiet after two replies from finance. Need a firmer second reminder and next-step date.",
    buyerContext: "Independent consultant protecting cash flow",
  },
];

const promptPack = [
  "Warm overdue invoice reminder",
  "Firmer second reminder",
  "Due-soon payment nudge",
  "Client relationship-preserving follow-up",
  "Finance-team forwarding note",
  "Next follow-up date planner",
];

function todayLabel() {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date());
}

function buildGeneratedOutput(sample: InvoiceSample) {
  const isFirmer = sample.status === "Second reminder" || sample.urgency === "High";
  const subject = isFirmer
    ? `Second reminder: ${sample.project} invoice ${sample.amount}`
    : sample.status === "Due soon"
      ? `Quick payment reminder for ${sample.project}`
      : `Friendly reminder: ${sample.project} invoice`;
  const tone = isFirmer ? "Clear, firm, still relationship-safe" : "Polite, warm, concise";
  const nextAction = isFirmer
    ? "Send today, then follow up in 3 business days with a payment-date request."
    : sample.status === "Due soon"
      ? "Send 48 hours before the due date and mark the invoice for a soft check-in next week."
      : "Send today and schedule one calmer reminder 5 business days later.";
  const email = `Hi ${sample.client} team,

I hope you are doing well. I wanted to quickly follow up on the ${sample.project} invoice for ${sample.amount}, which is ${sample.dueDate}.

${isFirmer
  ? "Could you confirm when payment is scheduled? If anything is blocking it, send me the detail and I will help resolve it today."
  : "When you have a moment, could you confirm that it is in the payment queue? I am happy to resend the invoice details if useful."}

Thanks,
Your name`;

  return {
    subject,
    tone,
    summary: `${sample.client} needs a ${tone.toLowerCase()} invoice follow-up for ${sample.amount} on ${sample.project}.`,
    email,
    nextAction,
    leadMagnet:
      "Free prompt: paste client name, invoice age, project context, and relationship tone to generate a ready-to-send follow-up.",
    outreach:
      `I made a ${price} invoice follow-up prompt system for freelancers. It turns awkward unpaid-invoice notes into polite reminders, firmer second reminders, and next follow-up dates. Want 3 sample prompts?`,
  };
}

function buildFullReport(sample: InvoiceSample, output: ReturnType<typeof buildGeneratedOutput>) {
  return `Invoice Follow-up Outputs Prompt System for Freelancers

Price: ${price}
Buyer: Builders, freelancers, operators, and consultants who need repeatable invoice follow-up outputs.
Pain: Generic prompts create inconsistent follow-ups and make unpaid invoice admin feel harder than it should.

Client: ${sample.client}
Project: ${sample.project}
Amount: ${sample.amount}
Status: ${sample.status}
Urgency: ${sample.urgency}
Notes: ${sample.notes}

Generated subject:
${output.subject}

Generated email:
${output.email}

Next action:
${output.nextAction}

Validation:
1. Create 5 public before/after prompt examples.
2. Publish a checkout-ready page positioned at ${price}.
3. Send samples to 30 freelancers and ask for 5 purchases or objections.`;
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function FieldLabel({ children }: { children: string }) {
  return (
    <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
      {children}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
        {label}
      </div>
    </div>
  );
}

export default function InvoiceFollowUpPromptSystemPage() {
  const [selectedId, setSelectedId] = useState(samples[0].id);
  const [rawNotes, setRawNotes] = useState(samples[0].notes);
  const [urgency, setUrgency] = useState<InvoiceSample["urgency"]>(samples[0].urgency);
  const [status, setStatus] = useState<InvoiceSample["status"]>(samples[0].status);
  const [savedOutputs, setSavedOutputs] = useState<SavedOutput[]>([]);
  const [feedback, setFeedback] = useState("");

  const selectedSample = samples.find((sample) => sample.id === selectedId) || samples[0];
  const workingSample = useMemo<InvoiceSample>(
    () => ({
      ...selectedSample,
      notes: rawNotes,
      urgency,
      status,
    }),
    [rawNotes, selectedSample, status, urgency],
  );
  const output = useMemo(() => buildGeneratedOutput(workingSample), [workingSample]);
  const fullReport = useMemo(() => buildFullReport(workingSample, output), [output, workingSample]);

  function loadSample(sample: InvoiceSample) {
    setSelectedId(sample.id);
    setRawNotes(sample.notes);
    setUrgency(sample.urgency);
    setStatus(sample.status);
    setFeedback("");
  }

  async function handleCopy(label: string, text: string) {
    const copied = await copyText(text);
    setFeedback(copied ? `Copied ${label}` : "Clipboard blocked. Select the text on screen and copy it manually.");
  }

  function saveOutput() {
    const saved: SavedOutput = {
      id: `${selectedSample.id}-${Date.now()}`,
      createdAt: todayLabel(),
      client: workingSample.client,
      status: workingSample.status,
      summary: output.summary,
      email: output.email,
      nextAction: output.nextAction,
    };

    setSavedOutputs((current) => [saved, ...current].slice(0, 5));
    setFeedback("Saved output");
  }

  return (
    <main className="min-h-screen bg-[#070809] text-zinc-100">
      <section className="border-b border-white/10 bg-[linear-gradient(135deg,#0b0f12,#111827_58%,#10130f)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-8">
          <div>
            <div className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
              Prompt-pack product / {price}
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Invoice Follow-up Outputs Prompt System for Freelancers
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-200">
              Turn awkward unpaid-invoice context into polite follow-up emails,
              firmer reminders, next-step dates, and reusable before/after prompt examples.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Prompt pack" value="15" />
              <MiniStat label="Mock invoices" value="4" />
              <MiniStat label="Validation" value="48h" />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30">
            <div className="rounded-lg bg-white p-4 text-zinc-950">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                Best fit buyer
              </div>
              <p className="mt-2 text-base font-bold leading-6">
                Freelancers and solo agencies who want a calm, repeatable way to follow up on unpaid invoices.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <FieldLabel>Pain</FieldLabel>
                <p className="mt-2 text-sm leading-6 text-zinc-200">
                  Generic prompts produce inconsistent output, and payment follow-up
                  feels emotionally expensive.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <FieldLabel>What to build</FieldLabel>
                <p className="mt-2 text-sm leading-6 text-zinc-200">
                  A checkout-ready prompt-pack page with prompts, examples,
                  before/after outputs, and copy buttons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <div className="space-y-5">
          <article className="rounded-lg border border-white/10 bg-[#11161d] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <FieldLabel>Source input</FieldLabel>
                <h2 className="mt-2 text-2xl font-black text-white">Invoice context</h2>
              </div>
              <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-black">
                {workingSample.status}
              </span>
            </div>

            <div className="mt-5 grid gap-2">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => loadSample(sample)}
                  className={[
                    "rounded-lg border p-3 text-left transition",
                    sample.id === selectedId
                      ? "border-emerald-300/60 bg-emerald-300/15"
                      : "border-white/10 bg-black/25 hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-white">{sample.client}</div>
                      <p className="mt-1 text-xs leading-5 text-zinc-300">{sample.project}</p>
                    </div>
                    <div className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-black text-black">
                      {sample.amount}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel>Status</FieldLabel>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as InvoiceSample["status"])}
                  className="rounded-lg border border-white/10 bg-black/50 px-3 py-3 text-sm text-white outline-none focus:border-emerald-300/50"
                >
                  <option>Overdue</option>
                  <option>Due soon</option>
                  <option>Second reminder</option>
                </select>
              </label>
              <label className="grid gap-2">
                <FieldLabel>Urgency</FieldLabel>
                <select
                  value={urgency}
                  onChange={(event) => setUrgency(event.target.value as InvoiceSample["urgency"])}
                  className="rounded-lg border border-white/10 bg-black/50 px-3 py-3 text-sm text-white outline-none focus:border-emerald-300/50"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>

            <label className="mt-4 grid gap-2">
              <FieldLabel>Messy notes</FieldLabel>
              <textarea
                value={rawNotes}
                onChange={(event) => setRawNotes(event.target.value)}
                rows={7}
                className="resize-none rounded-lg border border-white/10 bg-black/50 p-4 text-sm leading-6 text-zinc-100 outline-none focus:border-emerald-300/50"
              />
            </label>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#11161d] p-5">
            <FieldLabel>Prompt pack contents</FieldLabel>
            <div className="mt-3 grid gap-2">
              {promptPack.map((prompt, index) => (
                <div key={prompt} className="flex gap-3 rounded-lg bg-black/30 p-3 text-sm text-zinc-200">
                  <span className="font-black text-emerald-300">{index + 1}.</span>
                  <span>{prompt}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-5">
          <article className="rounded-lg border border-emerald-300/30 bg-[#101712] p-5 shadow-2xl shadow-emerald-950/20">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <FieldLabel>Generated output</FieldLabel>
                <h2 className="mt-2 text-3xl font-black text-white">Copy-ready follow-up</h2>
                <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-200">{output.summary}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:min-w-72">
                <button
                  type="button"
                  onClick={() => handleCopy("email draft", output.email)}
                  className="rounded-lg bg-emerald-300 px-4 py-3 text-sm font-black text-black transition hover:bg-emerald-200"
                >
                  Copy Email
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy("full report", fullReport)}
                  className="rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.04]"
                >
                  Copy Full Report
                </button>
              </div>
            </div>

            {feedback && (
              <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-100">
                {feedback}
              </div>
            )}

            <div className="mt-5 grid gap-4">
              <div className="rounded-lg border border-white/10 bg-white p-5 text-zinc-950">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  Subject
                </div>
                <p className="mt-2 text-xl font-black">{output.subject}</p>
                <div className="mt-5 border-t border-zinc-200 pt-4">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    Email draft
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap font-sans text-base leading-8 text-zinc-900">
                  {output.email}
                  </pre>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/35 p-4">
                  <FieldLabel>Tone</FieldLabel>
                  <p className="mt-2 text-sm leading-6 text-zinc-200">{output.tone}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/35 p-4">
                  <FieldLabel>Next action</FieldLabel>
                  <p className="mt-2 text-sm leading-6 text-zinc-200">{output.nextAction}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={saveOutput}
                className="rounded-lg bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
              >
                Save Output
              </button>
              <button
                type="button"
                onClick={() => handleCopy("validation outreach", output.outreach)}
                className="rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.04]"
              >
                Copy Outreach
              </button>
            </div>
          </article>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-lg border border-white/10 bg-[#11161d] p-5">
              <FieldLabel>48h validation plan</FieldLabel>
              <ol className="mt-3 space-y-3 text-sm leading-6 text-zinc-100">
                <li>1. Create 5 public sample prompts with before/after screenshots.</li>
                <li>2. Publish a checkout-ready page with the full prompt pack positioned at {price}.</li>
                <li>3. Send samples to 30 freelancers and ask for 5 purchases or explicit objections.</li>
              </ol>
              <button
                type="button"
                onClick={() => handleCopy("lead magnet", output.leadMagnet)}
                className="mt-4 w-full rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.04]"
              >
                Copy Lead Magnet Angle
              </button>
            </article>

            <article className="rounded-lg border border-white/10 bg-[#11161d] p-5">
              <FieldLabel>Saved records</FieldLabel>
              <div className="mt-3 space-y-3">
                {savedOutputs.length === 0 ? (
                  <p className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm leading-6 text-zinc-500">
                    Saved invoice follow-up outputs will appear here.
                  </p>
                ) : (
                  savedOutputs.map((saved) => (
                    <div key={saved.id} className="rounded-lg border border-white/10 bg-black/25 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-black text-white">{saved.client}</div>
                        <div className="text-xs text-zinc-500">{saved.createdAt}</div>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-zinc-400">{saved.summary}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy("saved email", saved.email)}
                        className="mt-3 rounded-md bg-white px-3 py-2 text-xs font-black text-black transition hover:bg-zinc-200"
                      >
                        Copy Saved Email
                      </button>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
