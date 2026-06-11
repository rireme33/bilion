"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SignalType = "Repo momentum" | "Issue pain" | "PR workflow" | "Integration gap";
type Priority = "High" | "Medium" | "Low";

type GitHubSignal = {
  id: number;
  name: string;
  repo: string;
  buyer: string;
  signalType: SignalType;
  sourceNotes: string;
  stars: string;
  issues: string;
  prs: string;
  comments: string;
  generatedOutput: string;
  priority: Priority;
  createdDate: string;
  revenueIdea: string;
  notes: string;
};

type SignalReport = {
  classification: SignalType;
  priority: Priority;
  buyerPain: string;
  productOpportunity: string;
  evidence: string[];
  validationPlan: string[];
  buildPrompt: string;
  outreachCopy: string;
  scores: {
    urgency: number;
    willingnessToPay: number;
    buildability: number;
    distribution: number;
  };
  nextActions: string[];
  exportText: string;
};

const price = "$49/month signal lab";

const samples: GitHubSignal[] = [
  {
    id: 1,
    name: "Open-source analytics setup friction",
    repo: "open-analytics/warehouse-dashboard",
    buyer: "Data consultants and SaaS teams onboarding analytics for clients",
    signalType: "Issue pain",
    sourceNotes:
      "Multiple issues ask for a guided setup wizard. Users keep failing on environment variables, warehouse permissions, and first dashboard import. Maintainers answer the same setup questions every week.",
    stars: "8.4k stars, +420 this month",
    issues: "63 open issues, 14 tagged setup, 9 duplicates",
    prs: "4 open PRs touching docs and onboarding",
    comments:
      "Comments mention trial users dropping before first dashboard, consultants writing custom setup docs, and maintainers wanting fewer repeated support replies.",
    generatedOutput:
      "Build a setup copilot that turns repo-specific installation friction into a guided onboarding checklist.",
    priority: "High",
    createdDate: "2026-06-11",
    revenueIdea: price,
    notes: "Strong repeated pain and clear buyer: consultants who implement this stack for clients.",
  },
  {
    id: 2,
    name: "PR review bottleneck for AI coding repos",
    repo: "agent-tools/code-review-bot",
    buyer: "Maintainers of fast-moving AI developer tools",
    signalType: "PR workflow",
    sourceNotes:
      "Maintainers request help summarizing PR risk. Contributors submit large AI-generated patches. Reviewers ask for test impact, touched modules, and migration notes before approving.",
    stars: "3.1k stars, +190 this month",
    issues: "22 open issues, 6 about review quality",
    prs: "18 open PRs, many over 900 changed lines",
    comments:
      "Review comments repeatedly ask for smaller diffs, clearer risk summaries, and generated test plans.",
    generatedOutput:
      "Build a PR risk brief generator for maintainers reviewing AI-generated changes.",
    priority: "High",
    createdDate: "2026-06-10",
    revenueIdea: "$29 repo add-on or $99/month maintainer workspace",
    notes: "Clear workflow pain with buyer urgency around maintainer time.",
  },
  {
    id: 3,
    name: "Integration requests around calendar sync",
    repo: "solo-crm/lightweight-crm",
    buyer: "Solo founder CRM users and small agencies",
    signalType: "Integration gap",
    sourceNotes:
      "Users ask for Google Calendar, Calendly, and Outlook sync. Maintainers keep deferring integrations. Issues include manual copy-paste workflows and missed follow-up reminders.",
    stars: "1.9k stars, +80 this month",
    issues: "41 open issues, 11 integration requests",
    prs: "2 stale integration PRs",
    comments:
      "Users say the CRM is useful but follow-up workflows break when calendar events stay outside the app.",
    generatedOutput:
      "Build a lightweight follow-up sync layer that turns calendar events into CRM next actions.",
    priority: "Medium",
    createdDate: "2026-06-09",
    revenueIdea: "$19/month integration helper",
    notes: "Good niche, but may require real OAuth complexity after validation.",
  },
];

function includesAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function classifySignal(text: string): SignalType {
  if (includesAny(text, ["pr", "review", "patch", "diff"])) {
    return "PR workflow";
  }
  if (includesAny(text, ["integration", "sync", "oauth", "calendar"])) {
    return "Integration gap";
  }
  if (includesAny(text, ["stars", "momentum", "growth", "trending"])) {
    return "Repo momentum";
  }
  return "Issue pain";
}

function numericSignals(text: string) {
  const matches = text.match(/\d+/g) ?? [];
  return matches.map(Number);
}

function scoreFromSignals(text: string, base: number) {
  const numbers = numericSignals(text);
  const lift = Math.min(4, numbers.filter((value) => value >= 5).length);
  return Math.max(1, Math.min(10, base + lift));
}

function buildReport(signal: GitHubSignal): SignalReport {
  const sourceText = `${signal.sourceNotes} ${signal.stars} ${signal.issues} ${signal.prs} ${signal.comments}`;
  const classification = classifySignal(sourceText);
  const repeatedPain = includesAny(sourceText, ["repeated", "duplicate", "same", "every week", "keep"]);
  const implementationRisk = includesAny(sourceText, ["oauth", "permissions", "migration", "integration"]);
  const priority: Priority = repeatedPain && !implementationRisk ? "High" : repeatedPain ? "Medium" : signal.priority;
  const urgency = scoreFromSignals(`${signal.issues} ${signal.comments}`, repeatedPain ? 6 : 4);
  const willingnessToPay = scoreFromSignals(signal.buyer, signal.buyer.includes("consultants") || signal.buyer.includes("maintainers") ? 7 : 5);
  const buildability = implementationRisk ? 6 : 8;
  const distribution = scoreFromSignals(signal.stars, 5);
  const buyerPain =
    classification === "PR workflow"
      ? "Maintainers need compact risk briefs before reviewing large or AI-generated pull requests."
      : classification === "Integration gap"
        ? "Users like the core tool but lose workflow value when adjacent tools are not connected."
        : classification === "Repo momentum"
          ? "A fast-growing repo creates demand for implementation help, templates, and onboarding shortcuts."
          : "Users repeatedly hit the same setup or workflow issue and maintainers are answering it manually.";
  const productOpportunity =
    classification === "PR workflow"
      ? "A PR signal brief workspace that summarizes touched modules, risks, tests, and reviewer next actions."
      : classification === "Integration gap"
        ? "A narrow integration helper that turns missing sync requests into productized workflow automation."
        : classification === "Repo momentum"
          ? "A repo-specific starter kit that converts attention into setup, templates, and paid implementation assets."
          : "A guided workflow layer that turns repeated GitHub issue pain into checklists, templates, and support-ready answers.";
  const evidence = [
    signal.stars,
    signal.issues,
    signal.prs,
    signal.comments,
  ];
  const nextActions = [
    "Open the top 10 related issues and group comments by repeated buyer pain.",
    "Write a one-page before/after workflow using the repo language.",
    "DM or comment with a lightweight validation offer before building integrations.",
    "Ship a static demo that solves one repeated workflow, not the entire repo roadmap.",
  ];
  const validationPlan = [
    "Choose one repeated repo pain and write a before/after signal brief.",
    "Send the brief to 20 builders, maintainers, or consultants who know the repo category.",
    "Ask for 3 paid pilots, 5 explicit objections, or one repo-specific workflow they would use this week.",
  ];
  const buildPrompt = `Build a GitHub signal product from ${signal.repo}. Buyer: ${signal.buyer}. Signal type: ${classification}. Turn these notes into a narrow workflow product: ${signal.sourceNotes}`;
  const outreachCopy = `I noticed repeated ${classification.toLowerCase()} pain around ${signal.repo}. I made a small workflow concept that turns the repeated GitHub comments into a productized fix. Want me to send the before/after?`;
  const exportText = `GitHub Signal Lab Report

Signal: ${signal.name}
Repo: ${signal.repo}
Buyer: ${signal.buyer}
Classification: ${classification}
Priority: ${priority}
Revenue idea: ${signal.revenueIdea}

Buyer pain:
${buyerPain}

Product opportunity:
${productOpportunity}

Evidence:
${evidence.map((item) => `- ${item}`).join("\n")}

Build prompt:
${buildPrompt}

Next actions:
${nextActions.map((item) => `- ${item}`).join("\n")}

48h validation plan:
${validationPlan.map((item) => `- ${item}`).join("\n")}

Outreach:
${outreachCopy}`;

  return {
    classification,
    priority,
    buyerPain,
    productOpportunity,
    evidence,
    validationPlan,
    buildPrompt,
    outreachCopy,
    scores: {
      urgency,
      willingnessToPay,
      buildability,
      distribution,
    },
    nextActions,
    exportText,
  };
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#101827] p-4 shadow-xl shadow-black/20">
      <h2 className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-slate-200">{children}</div>
    </section>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-black text-white">{value}</div>
    </div>
  );
}

export default function GitHubSignalLabPage() {
  const [activeSignal, setActiveSignal] = useState<GitHubSignal>(samples[0]);
  const [savedSignals, setSavedSignals] = useState<GitHubSignal[]>(samples);
  const [generatedAt, setGeneratedAt] = useState("Sample loaded");
  const [copied, setCopied] = useState("");

  const report = useMemo(() => buildReport(activeSignal), [activeSignal]);

  function updateSignal(key: keyof GitHubSignal, value: string) {
    setActiveSignal((current) => ({ ...current, [key]: value }));
  }

  function generateSignal() {
    setGeneratedAt(new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }));
  }

  function saveSignal() {
    const nextSignal: GitHubSignal = {
      ...activeSignal,
      id: savedSignals.length + 1,
      signalType: report.classification,
      priority: report.priority,
      generatedOutput: report.productOpportunity,
      createdDate: new Date().toISOString().slice(0, 10),
      notes: report.buyerPain,
    };

    setSavedSignals([nextSignal, ...savedSignals]);
  }

  async function copyText(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  function trySampleSignal() {
    setActiveSignal(samples[0]);
    setGeneratedAt("Sample signal loaded");
  }

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,#22d3ee30,transparent_32%),linear-gradient(135deg,#070a12,#0f172a_55%,#111827)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
              GitHub Signal Lab
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Turn GitHub activity into buildable product opportunities.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Paste or select a GitHub-style signal and Bilion converts it into buyer pain, product opportunity,
              validation plan, outreach copy, and Code X prompt.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={trySampleSignal}
                className="rounded-lg bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Try sample signal
              </button>
              <Link
                href="/showcase"
                className="rounded-lg border border-white/15 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-white/10"
              >
                Back to showcase
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Repo signal</div>
                <p className="mt-2 text-sm leading-6 text-slate-100">
                  Issues, PRs, labels, duplicate comments, stars, stale requests, and maintainer replies.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Buyer pain</div>
                <p className="mt-2 text-sm leading-6 text-slate-100">
                  Repeated implementation friction, maintainer workload, missing integrations, and workflow gaps.
                </p>
              </div>
              <div className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Build prompt</div>
                <p className="mt-2 text-sm leading-6 text-white">A narrow Code X prompt from the market signal.</p>
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white">Product angle</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A research workspace that turns public GitHub activity into a commercial signal: who hurts, what they keep
              asking for, what product could be built, and how to validate it before writing code.
            </p>
            <div className="mt-5 rounded-lg bg-cyan-200 p-4 text-slate-950">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-cyan-900">Validation asset</div>
              <p className="mt-2 text-sm font-semibold leading-6">
                Send one before/after GitHub signal brief to 20 builders and ask which repo pain they would pay to solve.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <Panel title="Sample selector">
            <p className="mb-4 text-sm leading-6 text-slate-400">
              Pick a realistic GitHub-style signal to instantly see how Bilion turns repo activity into a buildable
              product direction.
            </p>
            <div className="grid gap-3">
              {samples.map((signal) => (
                <button
                  key={signal.id}
                  onClick={() => {
                    setActiveSignal(signal);
                    setGeneratedAt(`${signal.name} loaded`);
                  }}
                  className="rounded-lg border border-white/10 bg-black/25 p-3 text-left transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                >
                  <span className="block text-sm font-black text-white">{signal.name}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {signal.repo} / {signal.priority} / {signal.revenueIdea}
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="GitHub signal input">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Signal name</span>
              <input
                value={activeSignal.name}
                onChange={(event) => updateSignal("name", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none ring-cyan-300/30 focus:ring-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Repo</span>
              <input
                value={activeSignal.repo}
                onChange={(event) => updateSignal("repo", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none ring-cyan-300/30 focus:ring-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Repo / issue / PR notes</span>
              <textarea
                value={activeSignal.sourceNotes}
                onChange={(event) => updateSignal("sourceNotes", event.target.value)}
                rows={5}
                className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm leading-6 text-white outline-none ring-cyan-300/30 focus:ring-2"
              />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button onClick={generateSignal} className="rounded-lg bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950">
                Generate signal brief
              </button>
              <button onClick={saveSignal} className="rounded-lg border border-white/15 px-4 py-3 text-sm font-black text-white">
                Save signal
              </button>
              <button
                onClick={() => copyText("export", report.exportText)}
                className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100"
              >
                {copied === "export" ? "Copied" : "Copy report"}
              </button>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Output panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Signal summary</div>
                <p className="mt-2 text-xl font-black text-white">{activeSignal.name}</p>
                <p className="mt-1 text-sm text-slate-400">Generated: {generatedAt}</p>
              </div>
              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-black",
                  report.priority === "High"
                    ? "bg-rose-300/20 text-rose-100"
                    : report.priority === "Medium"
                      ? "bg-amber-300/20 text-amber-100"
                      : "bg-emerald-300/20 text-emerald-100",
                ].join(" ")}
              >
                {report.priority}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <ScoreCard label="Urgency" value={report.scores.urgency} />
              <ScoreCard label="Pay" value={report.scores.willingnessToPay} />
              <ScoreCard label="Build" value={report.scores.buildability} />
              <ScoreCard label="Distribution" value={report.scores.distribution} />
            </div>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Buyer</h3>
                <p className="mt-2 text-sm leading-6 text-slate-100">{activeSignal.buyer}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Pain</h3>
                <p className="mt-2 text-sm leading-6 text-slate-100">{report.buyerPain}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Product opportunity</h3>
                <p className="mt-2 text-sm leading-6 text-slate-100">{report.productOpportunity}</p>
                <button
                  onClick={() => copyText("opportunity", report.productOpportunity)}
                  className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-black text-slate-950"
                >
                  {copied === "opportunity" ? "Copied" : "Copy opportunity"}
                </button>
              </div>
            </div>
          </Panel>

          <Panel title="Evidence and next actions">
            <div className="grid gap-3 xl:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Evidence</h3>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-200">
                  {report.evidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">48h validation plan</h3>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-200">
                  {report.validationPlan.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button
                  onClick={() => copyText("validation", report.validationPlan.join("\n"))}
                  className="mt-3 rounded-lg bg-cyan-300 px-4 py-2 text-xs font-black text-slate-950"
                >
                  {copied === "validation" ? "Copied" : "Copy validation plan"}
                </button>
              </div>
            </div>
          </Panel>

          <Panel title="Build prompt and outreach">
            <div className="rounded-lg border border-white/10 bg-black/25 p-4">
              <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Build prompt</h3>
              <p className="mt-2 text-sm leading-6 text-slate-100">{report.buildPrompt}</p>
              <button
                onClick={() => copyText("prompt", report.buildPrompt)}
                className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-black text-slate-950"
              >
                {copied === "prompt" ? "Copied" : "Copy build prompt"}
              </button>
            </div>
            <div className="mt-3 rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-4">
              <h3 className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">Outreach copy</h3>
              <p className="mt-2 text-sm leading-6 text-slate-100">{report.outreachCopy}</p>
              <button
                onClick={() => copyText("outreach", report.outreachCopy)}
                className="mt-3 rounded-lg bg-cyan-300 px-4 py-2 text-xs font-black text-slate-950"
              >
                {copied === "outreach" ? "Copied" : "Copy outreach"}
              </button>
            </div>
          </Panel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Panel title="Next actions">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {report.nextActions.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Panel title="Saved GitHub signal records">
          <div className="grid gap-3 lg:grid-cols-3">
            {savedSignals.slice(0, 6).map((signal) => (
              <article key={`${signal.id}-${signal.createdDate}`} className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-white">{signal.name}</h3>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-slate-200">
                    {signal.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {signal.createdDate} / {signal.repo}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{signal.generatedOutput}</p>
                <p className="mt-3 text-xs font-bold text-cyan-100">{signal.revenueIdea}</p>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,#101827,#111827_55%,#0f172a)] p-5 shadow-2xl shadow-black/20 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                Build from real signals, not random ideas.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Bilion turns AI use cases, GitHub activity, and operator workflows into small buildable products.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="rounded-lg bg-white px-5 py-4 text-center text-sm font-black text-slate-950 transition hover:bg-slate-200"
              >
                Open Bilion
              </Link>
              <Link
                href="/showcase"
                className="rounded-lg border border-white/15 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-white/10"
              >
                View Showcase
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
