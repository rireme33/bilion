"use client";

import { useMemo, useState } from "react";

type Status = "Ready" | "Watchlist" | "Needs Manager Review";

type ShiftRecord = {
  id: number;
  title: string;
  buyer: string;
  managerNotes: string;
  reservations: string;
  staffing: string;
  inventoryPrep: string;
  generatedOutput: string;
  status: Status;
  createdDate: string;
  price: string;
  notes: string;
};

type GeneratedBrief = {
  shiftType: string;
  status: Status;
  shiftBrief: string;
  prepList: string[];
  blockers: string[];
  handoffSummary: string;
  nextActions: string[];
  fullSample: string;
};

const price = "$19 one-time";

const samples: ShiftRecord[] = [
  {
    id: 1,
    title: "Busy Friday dinner",
    buyer: "Restaurant consultant serving independent operators",
    managerNotes:
      "High walk-in traffic, two tables waited over 20 minutes, kitchen ran behind on mains.",
    reservations: "42 covers booked tomorrow, one party of 12 at 7:30 PM.",
    staffing: "One server called out, new host needs support.",
    inventoryPrep: "Low on salmon, prep extra sauce, restock sparkling water.",
    generatedOutput:
      "Dinner shift needs a manager-visible watchlist: staffing gap, large party, salmon shortage, and kitchen timing.",
    status: "Watchlist",
    createdDate: "2026-06-10",
    price,
    notes: "Good public sample for before/after prompt-pack proof.",
  },
  {
    id: 2,
    title: "Short-staffed lunch shift",
    buyer: "Freelancer building restaurant ops assets",
    managerNotes:
      "Lunch rush hit early, POS issue delayed tickets, several regulars asked about new menu items.",
    reservations: "Light bookings but expected office walk-ins.",
    staffing: "Dishwasher late, manager covered expo.",
    inventoryPrep: "Low soup containers, prep more sandwich station backups.",
    generatedOutput:
      "Lunch shift requires service recovery, POS follow-up, and backup prep for walk-in volume.",
    status: "Needs Manager Review",
    createdDate: "2026-06-09",
    price,
    notes: "Shows how messy notes become manager-ready actions.",
  },
  {
    id: 3,
    title: "Catering and private event prep",
    buyer: "Operator packaging AI workflows for restaurants",
    managerNotes:
      "Private room needs reset, catering order confirmed, bartender reported low citrus.",
    reservations: "Private party of 18 tomorrow at 6 PM.",
    staffing: "Senior server assigned to event, trainee on floor.",
    inventoryPrep: "Prep dessert trays, check wine stock, label catering boxes.",
    generatedOutput:
      "Event prep is organized with room reset, catering labels, wine check, citrus restock, and staff assignments.",
    status: "Ready",
    createdDate: "2026-06-08",
    price,
    notes: "Strong example for private event handoff template.",
  },
];

function includesAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function splitItems(text: string) {
  return text
    .split(/,|\.|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function generateBrief(
  managerNotes: string,
  reservations: string,
  staffing: string,
  inventoryPrep: string,
): GeneratedBrief {
  const combined = `${managerNotes} ${reservations} ${staffing} ${inventoryPrep}`;
  const busy = includesAny(combined, ["walk-in", "rush", "party", "covers", "private"]);
  const staffingRisk = includesAny(combined, ["called out", "late", "trainee", "support", "covered"]);
  const inventoryRisk = includesAny(combined, ["low", "prep", "restock", "check", "label"]);
  const serviceRisk = includesAny(combined, ["waited", "delayed", "behind", "pos issue"]);

  const shiftType = busy
    ? "High-volume restaurant shift"
    : inventoryRisk
      ? "Prep-heavy restaurant shift"
      : "Standard manager handoff";
  const status: Status = serviceRisk || staffingRisk ? "Needs Manager Review" : inventoryRisk ? "Watchlist" : "Ready";
  const prepList = splitItems(inventoryPrep).length
    ? splitItems(inventoryPrep)
    : ["Confirm station backups", "Restock top-moving service items"];
  const blockers = [
    ...(staffingRisk ? splitItems(staffing).slice(0, 2) : []),
    ...(serviceRisk ? splitItems(managerNotes).filter((item) => includesAny(item, ["waited", "delayed", "behind", "pos"])) : []),
    ...(inventoryRisk ? splitItems(inventoryPrep).filter((item) => includesAny(item, ["low", "check"])) : []),
  ];
  const finalBlockers = blockers.length ? blockers : ["No major blocker flagged from the notes."];
  const nextActions = [
    staffingRisk ? "Assign manager check-in for staffing coverage before service." : "Confirm section ownership before pre-shift.",
    busy ? "Review reservation pressure and walk-in plan during pre-shift." : "Confirm expected covers and pacing notes.",
    inventoryRisk ? "Complete prep/restock checklist before the next rush." : "Spot-check prep levels before doors open.",
    serviceRisk ? "Create a recovery note for delays and kitchen timing." : "Send clean handoff to the next lead.",
  ];
  const shiftBrief = `${shiftType}. Manager notes show ${managerNotes.toLowerCase()} Reservations: ${reservations} Staffing: ${staffing} Prep focus: ${inventoryPrep} Status: ${status}.`;
  const handoffSummary = `Next lead should watch staffing coverage, reservation pacing, and prep gaps. Most important action: ${nextActions[0]}`;
  const fullSample = `Prompt-pack sample

Input:
Manager notes: ${managerNotes}
Reservations: ${reservations}
Staffing: ${staffing}
Inventory/prep: ${inventoryPrep}

Output:
Shift type: ${shiftType}
Status: ${status}
Shift brief: ${shiftBrief}
Prep list:
${prepList.map((item) => `- ${item}`).join("\n")}
Blockers:
${finalBlockers.map((item) => `- ${item}`).join("\n")}
Handoff:
${handoffSummary}
Next actions:
${nextActions.map((item) => `- ${item}`).join("\n")}`;

  return {
    shiftType,
    status,
    shiftBrief,
    prepList,
    blockers: finalBlockers,
    handoffSummary,
    nextActions,
    fullSample,
  };
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#111827] p-4 shadow-xl shadow-black/20">
      <h2 className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-slate-200">{children}</div>
    </section>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-3">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-200">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ShiftBriefsPromptSystemPage() {
  const [managerNotes, setManagerNotes] = useState(samples[0].managerNotes);
  const [reservations, setReservations] = useState(samples[0].reservations);
  const [staffing, setStaffing] = useState(samples[0].staffing);
  const [inventoryPrep, setInventoryPrep] = useState(samples[0].inventoryPrep);
  const [savedBriefs, setSavedBriefs] = useState<ShiftRecord[]>(samples);
  const [generatedAt, setGeneratedAt] = useState("Sample loaded");
  const [copied, setCopied] = useState("");

  const generated = useMemo(
    () => generateBrief(managerNotes, reservations, staffing, inventoryPrep),
    [inventoryPrep, managerNotes, reservations, staffing],
  );

  function loadSample(record: ShiftRecord) {
    setManagerNotes(record.managerNotes);
    setReservations(record.reservations);
    setStaffing(record.staffing);
    setInventoryPrep(record.inventoryPrep);
    setGeneratedAt(`${record.title} loaded`);
  }

  function runGenerate() {
    setGeneratedAt(new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }));
  }

  function saveBrief() {
    const nextRecord: ShiftRecord = {
      id: savedBriefs.length + 1,
      title: `Saved shift brief ${savedBriefs.length + 1}`,
      buyer: "Builder selling restaurant prompt systems",
      managerNotes,
      reservations,
      staffing,
      inventoryPrep,
      generatedOutput: generated.shiftBrief,
      status: generated.status,
      createdDate: new Date().toISOString().slice(0, 10),
      price,
      notes: generated.handoffSummary,
    };

    setSavedBriefs([nextRecord, ...savedBriefs]);
  }

  async function copyText(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  const validationPlan = `48h validation plan
1. Create 5 public sample prompts with before/after screenshots.
2. Publish a checkout-ready page with the full prompt pack positioned at ${price}.
3. Send the samples to 30 builders or consultants and ask for 5 purchases or explicit objections.`;

  const outreach = `I made a ${price} prompt pack for independent restaurant shift briefs. It turns messy manager notes, reservation updates, staffing gaps, and prep issues into shift briefs, prep lists, blockers, and handoff summaries. Want me to send 3 before/after examples?`;

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,#f59e0b33,transparent_32%),linear-gradient(135deg,#070a12,#111827_55%,#1f2937)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <div className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-100">
              Restaurant prompt-pack showcase
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Shift Briefs Prompt System for Independent Restaurants
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              A curated prompt system that turns messy restaurant shift notes into saved shift briefs, prep lists,
              blockers, handoff summaries, and next actions.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Buyer</div>
                <p className="mt-2 text-sm leading-6 text-slate-100">
                  Builders, freelancers, operators, and consultants serving independent restaurants.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Pain</div>
                <p className="mt-2 text-sm leading-6 text-slate-100">
                  Shift notes are scattered across chat, notebooks, and memory. Generic prompts create inconsistent handoffs.
                </p>
              </div>
              <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-amber-100">Price</div>
                <p className="mt-2 text-3xl font-black text-white">{price}</p>
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white">Product angle</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Reusable prompts, realistic examples, before/after outputs, usage instructions, and copy buttons for
              restaurant managers who need consistent shift handoffs.
            </p>
            <div className="mt-5 rounded-lg bg-amber-200 p-4 text-slate-950">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-amber-900">Inside the pack</div>
              <p className="mt-2 text-sm font-semibold leading-6">
                15 prompts, example inputs, before/after outputs, usage instructions, copy buttons, and shift brief templates.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <Panel title="Sample data selector">
            <div className="grid gap-3">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => loadSample(sample)}
                  className="rounded-lg border border-white/10 bg-black/25 p-3 text-left transition hover:border-amber-300/50 hover:bg-amber-300/10"
                >
                  <span className="block text-sm font-black text-white">{sample.title}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {sample.status} / {sample.price}
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Workflow panel">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Manager notes</span>
              <textarea
                value={managerNotes}
                onChange={(event) => setManagerNotes(event.target.value)}
                rows={4}
                className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm leading-6 text-white outline-none ring-amber-300/30 focus:ring-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Reservation updates</span>
              <textarea
                value={reservations}
                onChange={(event) => setReservations(event.target.value)}
                rows={2}
                className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm leading-6 text-white outline-none ring-amber-300/30 focus:ring-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Staffing notes</span>
              <textarea
                value={staffing}
                onChange={(event) => setStaffing(event.target.value)}
                rows={2}
                className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm leading-6 text-white outline-none ring-amber-300/30 focus:ring-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Inventory / prep issues</span>
              <textarea
                value={inventoryPrep}
                onChange={(event) => setInventoryPrep(event.target.value)}
                rows={2}
                className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm leading-6 text-white outline-none ring-amber-300/30 focus:ring-2"
              />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button onClick={runGenerate} className="rounded-lg bg-amber-200 px-4 py-3 text-sm font-black text-slate-950">
                Generate brief
              </button>
              <button onClick={saveBrief} className="rounded-lg border border-white/15 px-4 py-3 text-sm font-black text-white">
                Save brief by date
              </button>
              <button
                onClick={() => copyText("brief", generated.shiftBrief)}
                className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-black text-amber-100"
              >
                {copied === "brief" ? "Copied" : "Copy shift brief"}
              </button>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Structured output preview">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xl font-black text-white">{generated.shiftType}</p>
                <p className="mt-1 text-sm text-slate-400">Generated: {generatedAt}</p>
              </div>
              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-black",
                  generated.status === "Needs Manager Review"
                    ? "bg-rose-300/20 text-rose-100"
                    : generated.status === "Watchlist"
                      ? "bg-amber-300/20 text-amber-100"
                      : "bg-emerald-300/20 text-emerald-100",
                ].join(" ")}
              >
                {generated.status}
              </span>
            </div>
            <div className="mt-4 rounded-lg border border-white/10 bg-black/25 p-4">
              <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Shift brief</h3>
              <p className="mt-2 text-sm leading-6 text-slate-100">{generated.shiftBrief}</p>
            </div>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              <ListBlock title="Prep list" items={generated.prepList} />
              <ListBlock title="Blockers" items={generated.blockers} />
              <ListBlock title="Recommended next actions" items={generated.nextActions} />
              <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Handoff summary</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">{generated.handoffSummary}</p>
              </div>
            </div>
            <button
              onClick={() => copyText("full-sample", generated.fullSample)}
              className="mt-4 rounded-lg bg-white px-4 py-3 text-sm font-black text-slate-950"
            >
              {copied === "full-sample" ? "Copied" : "Copy full prompt-pack sample"}
            </button>
          </Panel>

          <Panel title="Saved records / examples">
            <div className="grid gap-3">
              {savedBriefs.slice(0, 5).map((brief) => (
                <article key={`${brief.id}-${brief.createdDate}`} className="rounded-lg border border-white/10 bg-black/25 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-white">{brief.title}</h3>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-slate-200">
                      {brief.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {brief.createdDate} / {brief.buyer} / {brief.price}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{brief.generatedOutput}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{brief.notes}</p>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <Panel title="Pricing / offer panel">
          <div className="rounded-lg bg-amber-200 p-5 text-slate-950">
            <p className="text-4xl font-black">{price}</p>
            <p className="mt-3 text-sm font-semibold leading-6">
              Includes 15 prompts, example inputs, before/after outputs, usage instructions, copy buttons, and shift brief templates.
            </p>
          </div>
        </Panel>

        <Panel title="48h validation asset">
          <ol className="space-y-2 text-sm leading-6 text-slate-200">
            <li>1. Create 5 public sample prompts with before/after screenshots.</li>
            <li>2. Publish a checkout-ready page with the full prompt pack positioned at {price}.</li>
            <li>3. Send the samples to 30 builders or consultants and ask for 5 purchases or explicit objections.</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => copyText("validation", validationPlan)}
              className="rounded-lg border border-white/15 px-4 py-3 text-sm font-black text-white"
            >
              {copied === "validation" ? "Copied" : "Copy validation plan"}
            </button>
            <button
              onClick={() => copyText("outreach", outreach)}
              className="rounded-lg bg-amber-200 px-4 py-3 text-sm font-black text-slate-950"
            >
              {copied === "outreach" ? "Copied" : "Copy outreach message"}
            </button>
          </div>
          <p className="mt-4 rounded-lg border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-300">
            {outreach}
          </p>
        </Panel>
      </section>
    </main>
  );
}
