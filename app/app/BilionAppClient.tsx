"use client";

import { useState } from "react";

type FreeIdea = {
  latest_signal: string;
  what_you_can_build: string;
  buyer: string;
  pain: string;
  why_now: string;
};

type BuildPromptPack = {
  latest_signal: string;
  source_title: string;
  source_url: string;
  source_type: string;
  source_note: string;
  buyer: string;
  pain: string;
  why_now: string;
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
  sourceTitle: string;
  sourceUrl: string;
  sourceType: string;
  sourceNote: string;
  buyer: string;
  pain: string;
  whyNow: string;
  whatYouCanBuild: string;
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
    sourceTitle:
      "Japanese farmer uses ChatGPT and Codex to automate farm operations",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A practical AI use case from a local operator using AI as an always-available engineer.",
    buyer: "Small farms and local field businesses",
    pain:
      "Tasks, logs, schedules, and sensor checks are scattered across daily operations.",
    whyNow:
      "Local operators already use chat tools, while AI coding tools make small internal workflow apps fast to prototype.",
    whatYouCanBuild:
      "A LINE-based operations bot for small farms or local field businesses.",
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
      "Build a minimal working prototype of a LINE-based operations bot for a small farm or local field business. Use Next.js with a simple mobile-first single-page UI. Keep mock data in the same file. Do not add authentication, payments, databases, or external APIs. The user should be able to check today's tasks, add a work log, check greenhouse temperature from mock sensor data, and show the next task for a field. Include a mock chat panel, today's tasks, fields list, sensor readings, work log form, and simple admin section for tasks and fields. Add copy buttons where useful. Prioritize a working MVP over architecture. Acceptance criteria: the page loads without setup, all interactions work with mock data, no network calls are required, and the full workflow can be tested on mobile.",
  },
  {
    id: "clinic-call-triage",
    latestSignal:
      "Small clinics are using AI assistants to summarize phone inquiries, extract patient intent, and route routine requests before staff follow up.",
    sourceTitle: "Clinic teams use AI to triage routine front-desk requests",
    sourceUrl: "",
    sourceType: "AI Use Case",
    sourceNote:
      "A recurring operator pattern: AI structures messy intake before a human callback.",
    buyer: "Small clinics and appointment-based local offices",
    pain:
      "Front desks handle repeated calls with unclear intent, urgency, and next steps.",
    whyNow:
      "AI can structure call notes instantly, and small teams need lighter tools than full call-center software.",
    whatYouCanBuild:
      "A clinic inquiry triage tool that turns call notes into intent, urgency, and next action.",
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
      "Build a minimal working prototype of a clinic inquiry triage tool for small clinics and appointment-based local offices. Use Next.js with a simple mobile-first single-page UI. Keep mock data in the same file. Do not add authentication, payments, databases, or external APIs. The user should be able to paste call notes, detect inquiry type, flag urgency, draft a staff follow-up, and move requests through an open/resolved board. Include call notes input, triage result, open requests list, urgency filter, and follow-up draft section. Add copy buttons where useful. Prioritize a working MVP over architecture. Acceptance criteria: sample call notes can be triaged, urgency labels appear, request status can be changed, follow-up text can be copied, and everything works with mock data only.",
  },
  {
    id: "construction-daily-report",
    latestSignal:
      "Construction teams are using AI to turn messy site notes, photos, and chat updates into daily reports for clients and managers.",
    sourceTitle: "Construction teams use AI to turn field notes into reports",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A field-operations pattern where AI converts scattered updates into a standard report.",
    buyer: "Small contractors and field service teams",
    pain:
      "Daily updates live in chats, notebooks, and memory, making client reporting slow and inconsistent.",
    whyNow:
      "Mobile-first AI tools can turn messy notes into consistent reports without a full project management rollout.",
    whatYouCanBuild:
      "A construction daily report generator for small contractors.",
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
      "Build a minimal working prototype of a construction daily report generator for small contractors. Use Next.js with a simple mobile-first single-page UI. Keep mock data in the same file. Do not add authentication, payments, databases, or external APIs. The user should be able to choose a mock project, paste messy jobsite notes, add weather and crew count, generate a client-ready daily report, and save it to a local mock reports list. Include project selector, notes input, report preview, blockers/materials section, and saved reports. Add copy buttons where useful. Prioritize a working MVP over architecture. Acceptance criteria: reports generate from sample notes, saved reports appear immediately, copy buttons work, and no external services are used.",
  },
  {
    id: "property-maintenance-router",
    latestSignal:
      "Property managers are using AI to classify tenant maintenance messages, identify urgency, and prepare vendor-ready work orders.",
    sourceTitle: "Property managers use AI to route maintenance messages",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A support-operations pattern where AI turns unstructured customer messages into routed work.",
    buyer: "Small property managers and local facility operators",
    pain:
      "Tenant requests arrive with missing details, unclear urgency, and messy vendor handoff information.",
    whyNow:
      "AI classification is good enough to structure requests before a manager assigns the work.",
    whatYouCanBuild:
      "A tenant maintenance request router for small property managers.",
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
      "Build a minimal working prototype of a tenant maintenance request router for small property managers. Use Next.js with a simple mobile-first single-page UI. Keep mock data in the same file. Do not add authentication, payments, databases, or external APIs. The user should be able to paste a tenant message, classify the issue, estimate urgency, generate missing-detail questions, create a vendor-ready work order, and move the request through a simple queue. Include request intake, triage card, vendor work order preview, open queue, and category filter. Add copy buttons where useful. Prioritize a working MVP over architecture. Acceptance criteria: sample tenant requests classify correctly enough for demo, queue interactions work, work order copy works, and all data is mock data.",
  },
  {
    id: "restaurant-shift-brief",
    latestSignal:
      "Restaurant operators are using AI to turn sales notes, staff updates, reservations, and inventory issues into shift briefs.",
    sourceTitle: "Restaurant operators use AI for clearer shift handoffs",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A shift-operations pattern where AI turns messy manager notes into a consistent handoff.",
    buyer: "Independent restaurants and shift-based local teams",
    pain:
      "Shift handoffs are informal, easy to miss, and scattered across notes, chats, reservations, and inventory issues.",
    whyNow:
      "Managers can use AI to produce a useful shift brief without adopting a heavy restaurant operations platform.",
    whatYouCanBuild:
      "A restaurant shift brief generator for independent restaurants.",
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
      "Build a minimal working prototype of a restaurant shift brief generator for independent restaurants. Use Next.js with a simple mobile-first single-page UI. Keep mock data in the same file. Do not add authentication, payments, databases, or external APIs. The user should be able to enter manager notes, reservations, staffing updates, and inventory issues, then generate a concise shift brief for the next team and save it by date. Include notes input, reservations list, staffing panel, inventory issues, generated brief, and saved briefs. Add copy buttons where useful. Prioritize a working MVP over architecture. Acceptance criteria: a shift brief generates from mock inputs, saved briefs display by date, copy buttons work, and the page is usable on mobile.",
  },
  {
    id: "local-review-reply-copilot",
    latestSignal:
      "Local operators are using AI to respond faster to customer reviews while keeping replies polite, specific, and on-brand.",
    sourceTitle: "Local businesses use AI to handle review replies",
    sourceUrl: "",
    sourceType: "AI Use Case",
    sourceNote:
      "A local-operations pattern where AI reduces repeated customer communication work.",
    buyer: "Restaurants, clinics, salons, and small shops",
    pain:
      "Owners know reviews matter, but replying consistently takes time and often gets delayed.",
    whyNow:
      "Review volume keeps growing, and AI can draft useful replies from a review, tone, and business context in seconds.",
    whatYouCanBuild:
      "A local review reply copilot for restaurants, clinics, salons, and small shops.",
    coreFeatures: [
      "Paste a customer review",
      "Choose business type and tone",
      "Generate three reply options",
      "Flag negative reviews for owner review",
      "Save reusable brand details",
    ],
    comparablePrice:
      "A small review reply workflow can start at $99 setup + $19/month for local businesses.",
    buildSteps: [
      "Create mock business profiles for restaurant, clinic, salon, and shop.",
      "Build a review input and tone selector.",
      "Generate three reply options from mock rules.",
      "Add negative review flagging.",
      "Add copy buttons and a simple saved replies area.",
    ],
    patternMatches: [
      "Restaurants",
      "Clinics",
      "Salons",
      "Small Shops",
    ],
    codeXPrompt:
      "Build a minimal working prototype of a local review reply copilot for restaurants, clinics, salons, and small shops. Use Next.js with a simple mobile-first single-page UI. Keep mock data in the same file. Do not add authentication, payments, databases, or external APIs. The user should be able to choose a business type, paste a customer review, choose a tone, generate three reply options, flag negative reviews, and copy a reply. Include business profile selector, review input, tone controls, generated replies, negative review alert, and saved brand details. Add copy buttons where useful. Prioritize a working MVP over architecture. Acceptance criteria: sample reviews generate distinct replies, negative reviews show an alert, copy buttons work, and no external services are used.",
  },
  {
    id: "invoice-follow-up-assistant",
    latestSignal:
      "Freelancers and solo agencies are using AI to turn unpaid invoice context into polite follow-up messages and next-step reminders.",
    sourceTitle: "Solo operators use AI to follow up on overdue invoices",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A solo-operator pattern where AI helps with uncomfortable but recurring admin communication.",
    buyer: "Freelancers and solo agencies",
    pain:
      "Invoice follow-up is awkward, easy to postpone, and often scattered across email, spreadsheets, and accounting notes.",
    whyNow:
      "AI can draft polite follow-ups from invoice status and client context while keeping the owner in control.",
    whatYouCanBuild:
      "An invoice follow-up assistant for freelancers and solo agencies.",
    coreFeatures: [
      "Add mock invoices",
      "Filter overdue invoices",
      "Generate polite follow-up email",
      "Generate firmer second reminder",
      "Track next follow-up date",
    ],
    comparablePrice:
      "A lightweight freelancer admin assistant can start at $49 one-time or $9/month.",
    buildSteps: [
      "Create mock clients and invoices.",
      "Build overdue and due-soon filters.",
      "Generate follow-up messages by reminder stage.",
      "Add next follow-up date actions.",
      "Add copy buttons for email drafts.",
    ],
    patternMatches: [
      "Freelancers",
      "Solo Agencies",
      "Consultants",
      "Bookkeepers",
    ],
    codeXPrompt:
      "Build a minimal working prototype of an invoice follow-up assistant for freelancers and solo agencies. Use Next.js with a simple mobile-first single-page UI. Keep mock data in the same file. Do not add authentication, payments, databases, or external APIs. The user should be able to view mock invoices, filter overdue invoices, select an invoice, generate a polite follow-up email, generate a firmer second reminder, and set a next follow-up date. Include invoice list, overdue filter, selected invoice details, message generator, follow-up date controls, and copied email drafts. Add copy buttons where useful. Prioritize a working MVP over architecture. Acceptance criteria: overdue filters work, both reminder styles generate, next follow-up date changes in UI state, copy buttons work, and no external services are used.",
  },
  {
    id: "micro-saas-ticket-triage",
    latestSignal:
      "Micro SaaS founders are using AI to categorize support tickets, detect urgency, and draft short replies before they lose focus on product work.",
    sourceTitle: "Micro SaaS founders use AI to triage support tickets",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A founder-operations pattern where AI protects maker time by structuring customer support work.",
    buyer: "Micro SaaS founders",
    pain:
      "Support tickets interrupt product work and mix bugs, billing questions, feature requests, and urgent customer issues in one queue.",
    whyNow:
      "Solo founders can use AI classification to keep support manageable without adopting a full helpdesk.",
    whatYouCanBuild:
      "A support ticket triage board for micro SaaS founders.",
    coreFeatures: [
      "Paste or load mock tickets",
      "Classify ticket type",
      "Detect urgency",
      "Draft short customer reply",
      "Move tickets across triage columns",
    ],
    comparablePrice:
      "A focused support triage tool can start at $79 one-time or $15/month for micro SaaS founders.",
    buildSteps: [
      "Create mock tickets with type, urgency, and status.",
      "Build a mobile-first triage board.",
      "Add ticket classification and urgency labels.",
      "Generate short reply drafts.",
      "Add column movement and copy buttons.",
    ],
    patternMatches: [
      "Micro SaaS",
      "Indie Hackers",
      "Productized Services",
      "Developer Tools",
    ],
    codeXPrompt:
      "Build a minimal working prototype of a support ticket triage board for micro SaaS founders. Use Next.js with a simple mobile-first single-page UI. Keep mock data in the same file. Do not add authentication, payments, databases, or external APIs. The user should be able to view mock tickets, classify a ticket as bug, billing, feature request, or question, detect urgency, draft a short customer reply, and move tickets across triage columns. Include ticket board, ticket detail panel, type and urgency labels, reply draft area, and column controls. Add copy buttons where useful. Prioritize a working MVP over architecture. Acceptance criteria: tickets can move between columns, classifications display clearly, reply drafts can be copied, mobile layout is usable, and all data is mock data.",
  },
];

const todayIndex = Math.floor(Date.now() / 86400000) % buildSignals.length;

function buildResult(signal: BuildSignal): ApiResult {
  return {
    free: {
      latest_signal: signal.latestSignal,
      what_you_can_build: signal.whatYouCanBuild,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
    },
    paid: {
      latest_signal: signal.latestSignal,
      source_title: signal.sourceTitle,
      source_url: signal.sourceUrl,
      source_type: signal.sourceType,
      source_note: signal.sourceNote,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
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
  const [signalIndex, setSignalIndex] = useState(todayIndex);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const selectedSignal = buildSignals[signalIndex];

  function generateIdea() {
    setLoading(true);
    setError("");
    setResult(null);
    setResult(buildResult(selectedSignal));
    setLoading(false);
  }

  const showNextSignal = () => {
    setCopiedPrompt(false);
    setSignalIndex((current) => {
      const next = (current + 1) % buildSignals.length;
      setResult(buildResult(buildSignals[next]));
      return next;
    });
  };

  async function copyFullCodeXPrompt() {
    const signal = selectedSignal;
    const copyText = [
      "Latest Signal",
      signal.latestSignal,
      "",
      "Source Title",
      signal.sourceTitle,
      ...(signal.sourceUrl ? ["", "Source URL", signal.sourceUrl] : []),
      "",
      "Buyer",
      signal.buyer,
      "",
      "Pain",
      signal.pain,
      "",
      "Why Now",
      signal.whyNow,
      "",
      "What You Can Build",
      signal.whatYouCanBuild,
      "",
      "Core Features",
      signal.coreFeatures.map((item) => "- " + item).join("\n"),
      "",
      "Comparable Price",
      signal.comparablePrice,
      "",
      "Build Steps",
      signal.buildSteps.map((item, index) => index + 1 + ". " + item).join("\n"),
      "",
      "Pattern Matches",
      signal.patternMatches.join("\n"),
      "",
      "Full Code X Prompt",
      signal.codeXPrompt,
    ].join("\n");

    await navigator.clipboard.writeText(copyText);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1000);
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
                    label="What You Can Build"
                    value={result.free.what_you_can_build}
                  />
                  <InfoBlock label="Buyer" value={result.free.buyer} />
                  <InfoBlock label="Pain" value={result.free.pain} />
                  <InfoBlock
                    label="Why Now"
                    value={result.free.why_now}
                  />
                </div>
              </div>

              {hasFounderAccess ? (
                <FounderPromptView
                  copied={copiedPrompt}
                  onCopyPrompt={copyFullCodeXPrompt}
                  onNextSignal={showNextSignal}
                  pack={result.paid}
                />
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

function FounderPromptView({
  copied,
  onCopyPrompt,
  onNextSignal,
  pack,
}: {
  copied: boolean;
  onCopyPrompt: () => void;
  onNextSignal: () => void;
  pack: BuildPromptPack;
}) {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
          Founder Build Prompt
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onNextSignal}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.04]"
          >
            Next Build Prompt
          </button>
          <button
            type="button"
            onClick={onCopyPrompt}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            {copied ? "Copied" : "Copy Full Code X Prompt"}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <SourceBlock pack={pack} />
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
        <PaidBlock label="Full Code X Prompt" value={pack.code_x_prompt} />
      </div>
    </div>
  );
}

function SourceBlock({ pack }: { pack: BuildPromptPack }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        Source
      </div>
      <div className="mt-3 grid gap-3 text-sm leading-6 text-zinc-100">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Latest Signal
          </div>
          <div className="mt-1">{pack.latest_signal}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Title
          </div>
          <div className="mt-1">{pack.source_title}</div>
        </div>
        {pack.source_url && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Source URL
            </div>
            <a
              href={pack.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-words underline underline-offset-4 hover:text-white"
            >
              {pack.source_url}
            </a>
          </div>
        )}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Type
          </div>
          <div className="mt-1">{pack.source_type}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Note
          </div>
          <div className="mt-1">{pack.source_note}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Buyer
          </div>
          <div className="mt-1">{pack.buyer}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Pain
          </div>
          <div className="mt-1">{pack.pain}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Why Now
          </div>
          <div className="mt-1">{pack.why_now}</div>
        </div>
      </div>
    </article>
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
