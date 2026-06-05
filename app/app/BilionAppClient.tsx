"use client";

import { useState } from "react";

type FreeIdea = {
  latest_signal: string;
  what_happened: string;
  what_you_can_build: string;
  why_its_useful: string;
  source_label: string;
  pattern: string;
  confidence: string;
};

type BuildPromptPack = {
  latest_signal: string;
  what_you_can_build: string;
  core_features: string[];
  comparable_price: string;
  build_steps: string[];
  pattern_matches: string[];
  code_x_prompt: string;
};

type ApiResult = {
  free: FreeIdea;
  paid: BuildPromptPack;
};

type BuildSignal = {
  id: string;
  latestSignal: string;
  whatHappened: string;
  whatYouCanBuild: string;
  whyItsUseful: string;
  sourceLabel: string;
  pattern: string;
  confidence: string;
  coreFeatures: string[];
  comparablePrice: string;
  buildSteps: string[];
  patternMatches: string[];
  codeXPrompt: string;
};

type BilionAppClientProps = {
  hasFounderAccess: boolean;
};

const lockedItems = [
  "Core Features 🔒",
  "Comparable Price 🔒",
  "Full Code X Prompt 🔒",
  "Pattern Matches 🔒",
];

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "";

const buildSignals: BuildSignal[] = [
  {
    id: "hokkaido-farm-ops",
    latestSignal:
      "A Japanese farmer in Hokkaido uses ChatGPT and Codex to automate practical farm work, including greenhouse temperature checks, LINE-based remote controls, field data, schedules, sensor logs, and crop troubleshooting.",
    whatHappened:
      "He used ChatGPT and Codex as an always-available engineer to build small internal tools for real farm operations.",
    whatYouCanBuild:
      "A LINE-based operations bot for small farms or local field businesses.",
    whyItsUseful:
      "Many local operators already use LINE, but their tasks, logs, schedules, and sensor checks are scattered. A simple bot can reduce manual checking and make daily operations easier.",
    sourceLabel: "Founder Story",
    pattern: "AI-assisted internal operations automation",
    confidence: "High",
    coreFeatures: [
      "Check today's tasks",
      "Add a work log",
      "Check greenhouse temperature from mock sensor data",
      "Show the next task for a field",
      "Simple admin screen for tasks and fields",
    ],
    comparablePrice:
      "Simple internal automation tools can be sold as setup fee + monthly maintenance. A realistic starting reference is JPY 49,800 setup + JPY 9,800/month or $299 setup + $29/month.",
    buildSteps: [
      "Create a small database for fields, tasks, work logs, and sensor readings.",
      "Build a simple LINE webhook or mock chat interface.",
      "Add commands for today's tasks, add log, greenhouse temperature, and next field task.",
      "Add mock sensor data first.",
      "Add a minimal admin page to edit fields and tasks.",
    ],
    patternMatches: [
      "Agriculture",
      "Construction",
      "Property Management",
      "Local Services",
    ],
    codeXPrompt:
      "Build a minimal prototype of a LINE-based operations bot for a small farm or local field business. Use Next.js or Cloudflare Workers with a simple database. The bot should support checking today's tasks, adding a work log, checking greenhouse temperature from mock sensor data, and showing the next task for a field. Include a minimal admin screen for tasks, fields, and mock sensor readings. Keep the UI and code simple. Prioritize a working MVP over complex architecture.",
  },
  {
    id: "clinic-call-triage",
    latestSignal:
      "Small clinics are using AI assistants to summarize phone inquiries, extract patient intent, and route routine requests before staff follow up.",
    whatHappened:
      "Operators used AI to reduce repeated front-desk work without replacing the human callback step.",
    whatYouCanBuild:
      "A clinic inquiry triage tool that turns call notes into intent, urgency, and next action.",
    whyItsUseful:
      "Front desks handle repeated questions across appointments, refills, documents, and directions. A simple triage tool helps staff respond faster and avoid missing important requests.",
    sourceLabel: "Founder Story",
    pattern: "AI intake triage for high-volume local service desks",
    confidence: "High",
    coreFeatures: [
      "Paste call notes",
      "Detect inquiry type",
      "Flag urgent requests",
      "Draft staff follow-up",
      "Simple dashboard for open requests",
    ],
    comparablePrice:
      "A small intake automation can start at $499 setup + $49/month for local clinics or service offices.",
    buildSteps: [
      "Create request types and urgency levels.",
      "Build a paste-in call notes screen.",
      "Generate structured intent, urgency, and next action.",
      "Add a list view for unresolved requests.",
      "Add copy buttons for staff follow-up messages.",
    ],
    patternMatches: [
      "Healthcare",
      "Dental Clinics",
      "Veterinary Offices",
      "Repair Services",
    ],
    codeXPrompt:
      "Build a minimal prototype of a clinic inquiry triage tool. Use Next.js with a simple local database or JSON mock data. The app should let staff paste call notes, detect the inquiry type, flag urgent requests, draft a follow-up message, and show unresolved requests in a simple dashboard. Keep the UI plain and operational. Prioritize a working internal tool over complex architecture.",
  },
  {
    id: "construction-daily-report",
    latestSignal:
      "Construction teams are using AI to turn messy site notes, photos, and chat updates into daily reports for clients and managers.",
    whatHappened:
      "Field operators used AI to reduce end-of-day reporting work and standardize updates from scattered jobsite information.",
    whatYouCanBuild:
      "A construction daily report generator for small contractors.",
    whyItsUseful:
      "Small contractors often collect updates in chat threads and notebooks. A report generator makes progress, blockers, materials, and next steps easier to communicate.",
    sourceLabel: "Founder Story",
    pattern: "AI reporting from messy field updates",
    confidence: "High",
    coreFeatures: [
      "Paste jobsite notes",
      "Add weather and crew count",
      "Generate client-ready report",
      "List blockers and materials",
      "Save reports by project",
    ],
    comparablePrice:
      "A simple reporting workflow can sell for $299 setup + $29/month per small contractor team.",
    buildSteps: [
      "Create projects and daily report records.",
      "Build a notes input screen.",
      "Generate progress, blockers, materials, and next steps.",
      "Add a saved report view by project.",
      "Add copy/export buttons for sending to clients.",
    ],
    patternMatches: [
      "Construction",
      "Landscaping",
      "Property Maintenance",
      "Field Services",
    ],
    codeXPrompt:
      "Build a minimal prototype of a construction daily report generator for small contractors. Use Next.js with simple mock project data. The app should accept messy jobsite notes, weather, crew count, and materials, then generate a client-ready daily report with progress, blockers, and next steps. Include a simple project list and saved reports view. Keep the interface mobile-first for field use.",
  },
  {
    id: "property-maintenance-router",
    latestSignal:
      "Property managers are using AI to classify tenant maintenance messages, identify urgency, and prepare vendor-ready work orders.",
    whatHappened:
      "Operators used AI to convert unstructured tenant messages into cleaner internal tasks for maintenance coordination.",
    whatYouCanBuild:
      "A tenant maintenance request router for small property managers.",
    whyItsUseful:
      "Maintenance messages arrive with missing details, unclear urgency, and scattered photos. A simple router helps managers prioritize and send cleaner work orders.",
    sourceLabel: "Founder Story",
    pattern: "AI task routing from unstructured customer messages",
    confidence: "High",
    coreFeatures: [
      "Paste tenant message",
      "Classify issue category",
      "Estimate urgency",
      "Generate missing-detail questions",
      "Create vendor-ready work order",
    ],
    comparablePrice:
      "Small property operators can pay $399 setup + $39/month for a lightweight maintenance coordination tool.",
    buildSteps: [
      "Define maintenance categories and urgency levels.",
      "Build a request intake screen.",
      "Generate classification, urgency, and missing questions.",
      "Create a vendor work order output.",
      "Add a simple queue for open requests.",
    ],
    patternMatches: [
      "Property Management",
      "HOA Management",
      "Facility Management",
      "Local Services",
    ],
    codeXPrompt:
      "Build a minimal prototype of a tenant maintenance request router for small property managers. Use Next.js and simple mock data. The app should accept a tenant message, classify the issue, estimate urgency, ask for missing details, and generate a vendor-ready work order. Include a simple queue for open requests. Keep the UI simple and mobile-friendly.",
  },
  {
    id: "restaurant-shift-brief",
    latestSignal:
      "Restaurant operators are using AI to turn sales notes, staff updates, reservations, and inventory issues into shift briefs.",
    whatHappened:
      "Managers used AI to make handoffs clearer between shifts without creating a complex operations system.",
    whatYouCanBuild:
      "A restaurant shift brief generator for independent restaurants.",
    whyItsUseful:
      "Shift handoffs are often informal and easy to miss. A structured brief helps teams see reservations, staffing, stock issues, and priorities before service.",
    sourceLabel: "Founder Story",
    pattern: "AI handoff briefs for shift-based operations",
    confidence: "High",
    coreFeatures: [
      "Paste manager notes",
      "Add reservations and staffing",
      "Flag stock or prep issues",
      "Generate shift brief",
      "Save briefs by date",
    ],
    comparablePrice:
      "A lightweight shift operations tool can start at $199 setup + $19/month for independent restaurants.",
    buildSteps: [
      "Create a simple shift brief data model.",
      "Build inputs for notes, reservations, staffing, and inventory issues.",
      "Generate a concise shift brief.",
      "Add saved briefs by date.",
      "Add copy buttons for sharing in chat.",
    ],
    patternMatches: [
      "Restaurants",
      "Retail",
      "Hospitality",
      "Local Services",
    ],
    codeXPrompt:
      "Build a minimal prototype of a restaurant shift brief generator for independent restaurants. Use Next.js with simple mock data. The app should accept manager notes, reservations, staffing updates, and inventory issues, then generate a concise shift brief for the next team. Include saved briefs by date and copy buttons for sharing. Keep the UI mobile-first and operational.",
  },
];

function getTodaysSignal() {
  const index = Math.floor(Date.now() / 86400000) % buildSignals.length;
  return buildSignals[index];
}

function buildResult(signal: BuildSignal): ApiResult {
  return {
    free: {
      latest_signal: signal.latestSignal,
      what_happened: signal.whatHappened,
      what_you_can_build: signal.whatYouCanBuild,
      why_its_useful: signal.whyItsUseful,
      source_label: signal.sourceLabel,
      pattern: signal.pattern,
      confidence: signal.confidence,
    },
    paid: {
      latest_signal: signal.latestSignal,
      what_you_can_build: signal.whatYouCanBuild,
      core_features: signal.coreFeatures,
      comparable_price: signal.comparablePrice,
      build_steps: signal.buildSteps,
      pattern_matches: signal.patternMatches,
      code_x_prompt: signal.codeXPrompt,
    },
  };
}

export default function BilionAppClient({
  hasFounderAccess,
}: BilionAppClientProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");

  function generateIdea() {
    setLoading(true);
    setError("");
    setResult(null);
    setResult(buildResult(getTodaysSignal()));
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div
        className={[
          "grid min-h-screen grid-cols-1",
          result ? "lg:grid-cols-[260px_1fr_340px]" : "lg:grid-cols-[260px_1fr]",
        ].join(" ")}
      >
        <aside className="hidden border-r border-white/10 bg-[#0b0b0c] p-5 lg:block">
          <div className="mb-8">
            <div className="text-2xl font-black tracking-tight">Bilion</div>
            <div className="mt-1 text-xs text-zinc-500">
              47,000+ Founder Stories
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem active label="Latest Signals" />
            <SidebarItem label="Build Prompts" locked={!hasFounderAccess} />
            <SidebarItem label="Founder View" locked={!hasFounderAccess} />
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-semibold">
              {hasFounderAccess ? "Founder access" : "Free preview"}
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              {hasFounderAccess
                ? "Code X Prompt is unlocked for this browser."
                : "Free shows the signal and build idea. Founder unlocks the full prompt."}
            </p>
          </div>
        </aside>

        <section className="p-4 md:p-8">
          <header className="mb-8">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              Build Prompt Engine
            </div>

            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Turn fresh AI success signals into tools you can build in Code X.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Bilion turns practical AI adoption stories into small tool ideas
              and build-ready prompts.
            </p>
          </header>

          {!result && (
            <div className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl md:p-8">
              <h2 className="text-2xl font-black tracking-tight">
                {"Today's Build Signal"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Click to reveal a real AI use case and a buildable Code X
                prompt.
              </p>
              <button
                onClick={generateIdea}
                disabled={loading}
                className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Revealing signal..." : "See Today's Signal"}
              </button>
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            </div>
          )}

          {result && (
            <div className="mt-8 grid gap-6">
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
                <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Free preview
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoBlock
                    label="Latest Signal"
                    value={result.free.latest_signal}
                  />
                  <InfoBlock
                    label="What Happened"
                    value={result.free.what_happened}
                  />
                  <InfoBlock
                    label="What You Can Build"
                    value={result.free.what_you_can_build}
                  />
                  <InfoBlock
                    label="Why It's Useful"
                    value={result.free.why_its_useful}
                  />
                </div>

                <SignalMeta
                  source={result.free.source_label}
                  pattern={result.free.pattern}
                  confidence={result.free.confidence}
                />
              </div>

              {hasFounderAccess ? (
                <FounderPromptView pack={result.paid} />
              ) : (
                <LockedFounderView />
              )}
            </div>
          )}
        </section>

        {result && (
        <aside className="border-l border-white/10 bg-[#0b0b0c] p-5">
          <div className="sticky top-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                Founder Preview
              </div>

              <h2 className="mt-4 text-2xl font-black">
                The value is the full Code X Prompt.
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Founder access reveals the core features, build steps, and the
                prompt you can paste into Code X.
              </p>

              <div className="mt-5 space-y-3">
                <RightPanelItem title="Core features" />
                <RightPanelItem title="Comparable price" />
                <RightPanelItem title="Full Code X Prompt" />
                <RightPanelItem title="Pattern Matches" />
              </div>
            </div>
          </div>
        </aside>
        )}
      </div>
    </main>
  );
}

function FounderPromptView({ pack }: { pack: BuildPromptPack }) {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="mb-4 inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
        Founder Build Prompt
      </div>

      <div className="grid gap-4">
        <PaidBlock label="Latest Signal" value={pack.latest_signal} />
        <PaidBlock
          label="What You Can Build"
          value={pack.what_you_can_build}
        />
        <PaidBlock
          label="Core Features"
          value={pack.core_features.map((item) => "- " + item).join("\n")}
        />
        <PaidBlock label="Comparable Price" value={pack.comparable_price} />
        <PaidBlock
          label="Build Steps"
          value={pack.build_steps
            .map((item, index) => index + 1 + ". " + item)
            .join("\n")}
        />
        <PaidBlock
          label="Pattern Matches"
          value={pack.pattern_matches.join("\n")}
        />
        <PaidBlock label="Code X Prompt" value={pack.code_x_prompt} />
      </div>
    </div>
  );
}

function LockedFounderView() {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
        Founder only
      </div>

      <h3 className="mt-3 text-2xl font-black">
        Founder preview
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        The full Code X Prompt and matching domains are hidden in the free
        preview.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {lockedItems.map((item) => (
          <LockedItem key={item} text={item} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
        <h4 className="text-xl font-black">Unlock Founder Access</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Get the full Code X prompt, build steps, comparable price, and pattern
          matches.
        </p>

        {CHECKOUT_URL ? (
          <a
            href={CHECKOUT_URL}
            className="mt-5 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Unlock Founder Access — $19
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-zinc-500"
          >
            Checkout link not configured
          </button>
        )}
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  active,
  locked,
}: {
  label: string;
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between rounded-2xl px-3 py-3 text-sm",
        active
          ? "bg-white text-black"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>
      {locked && <span className="text-xs opacity-60">Locked</span>}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
    </div>
  );
}

function SignalMeta({
  source,
  pattern,
  confidence,
}: {
  source: string;
  pattern: string;
  confidence: string;
}) {
  return (
    <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm md:grid-cols-3">
      <MetaItem label="Source" value={source} />
      <MetaItem label="Pattern" value={pattern} />
      <MetaItem label="Confidence" value={confidence} />
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-zinc-100">{value}</div>
    </div>
  );
}

function PaidBlock({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-100">
        {value}
      </pre>
    </article>
  );
}

function LockedItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
      <span className="text-sm text-zinc-300">{text}</span>
      <span className="text-sm text-zinc-500">Locked</span>
    </div>
  );
}

function RightPanelItem({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-zinc-500">Founder</div>
      </div>
    </div>
  );
}
