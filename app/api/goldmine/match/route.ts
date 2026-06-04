import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type RawSignal = {
  title?: string;
  latest_signal?: string;
  what_happened?: string;
  what_you_can_build?: string;
  why_its_useful?: string;
  pattern?: string;
  pattern_matches?: string[];
  core_features?: string[];
  comparable_price?: string;
  build_steps?: string[];
  code_x_prompt?: string;
  opportunity?: string;
  name?: string;
  product?: string;
  idea?: string;
  build_this?: string;
  buyer?: string;
  audience?: string;
  target_user?: string;
  who?: string;
  pain?: string;
  paid_pain?: string;
  problem?: string;
  issue?: string;
  why_now?: string;
  why_it_matters?: string;
  reason?: string;
  why_money?: string;
  mvp?: string;
  tiny_mvp?: string;
  free_mvp?: string;
  solution?: string;
  product_angle?: string;
  price_signal?: string;
  revenue_evidence?: string;
  revenue_signal?: string;
  source_url?: string;
  url?: string;
  source?: string;
  category?: string;
  tags?: string[];
  score?: number;
};

const fallbackSignals: RawSignal[] = [
  {
    title:
      "Japanese farmer uses ChatGPT and Codex to automate farm operations",
    latest_signal:
      "A Japanese farmer in Hokkaido uses ChatGPT and Codex to automate practical farm work, including greenhouse temperature checks, LINE-based remote controls, field data, schedules, sensor logs, and crop troubleshooting.",
    what_happened:
      "He used ChatGPT and Codex as an always-available engineer to build small internal tools for real farm operations.",
    what_you_can_build:
      "A LINE-based operations bot for small farms or local field businesses.",
    why_its_useful:
      "Many local operators already use LINE, but their tasks, logs, schedules, and sensor checks are scattered. A simple bot can reduce manual checking and make daily operations easier.",
    pattern: "AI-assisted internal operations automation",
    pattern_matches: [
      "Agriculture",
      "Construction",
      "Property Management",
      "Local Services",
    ],
    core_features: [
      "Check today's tasks",
      "Add a work log",
      "Check greenhouse temperature from mock sensor data",
      "Show the next task for a field",
      "Simple admin screen for tasks and fields",
    ],
    comparable_price:
      "Simple internal automation tools can be sold as setup fee + monthly maintenance. A realistic starting reference is ¥49,800 setup + ¥9,800/month or $299 setup + $29/month.",
    build_steps: [
      "Create a small database for fields, tasks, work logs, and sensor readings.",
      "Build a simple LINE webhook or mock chat interface.",
      "Add commands for today's tasks, add log, greenhouse temperature, and next field task.",
      "Add mock sensor data first.",
      "Add a minimal admin page to edit fields and tasks.",
    ],
    code_x_prompt:
      "Build a minimal prototype of a LINE-based operations bot for a small farm or local field business. Use Next.js or Cloudflare Workers with a simple database. The bot should support checking today's tasks, adding a work log, checking greenhouse temperature from mock sensor data, and showing the next task for a field. Include a minimal admin screen for tasks, fields, and mock sensor readings. Keep the UI and code simple. Prioritize a working MVP over complex architecture.",
    buyer: "small farms and local field businesses",
    pain:
      "Tasks, logs, schedules, and sensor checks are scattered across daily operations.",
    source_url: "https://x.com/",
    category: "Automation",
    tags: ["local businesses", "automation", "line", "codex", "farm"],
    score: 999,
  },
  {
    title: "Cold Outreach Follow-up Generator",
    buyer: "solo founders and small agencies",
    pain: "They waste hours writing follow-ups, tracking replies, and adjusting messages manually.",
    why_now:
      "AI builders can now ship small workflow tools around outbound sales in days, not months.",
    mvp: "Paste offer + previous message → get 3 follow-up replies and next-step angles.",
    source_url: "https://www.indiehackers.com/",
    category: "AI tool",
    tags: ["founders", "agencies", "sales", "automation"],
  },
  {
    title: "Client Onboarding Checklist Builder",
    buyer: "small agencies and consultants",
    pain: "Every new client requires repeated setup, scattered intake questions, and messy handoffs.",
    why_now:
      "Service businesses are actively adopting AI to reduce admin work and increase delivery speed.",
    mvp: "Enter service type + client goal → generate onboarding checklist, intake form, and first email.",
    source_url: "https://www.indiehackers.com/",
    category: "Automation",
    tags: ["agencies", "consultants", "operations"],
  },
  {
    title: "Creator Sponsorship Brief Generator",
    buyer: "small creators and newsletter operators",
    pain: "Creators struggle to turn audience data into sponsorship pitches that brands understand.",
    why_now:
      "More small creators are trying to monetize directly but lack clean sales materials.",
    mvp: "Paste audience stats + niche → generate a sponsorship brief and outreach message.",
    source_url: "https://www.indiehackers.com/",
    category: "SaaS",
    tags: ["creators", "sponsorship", "sales"],
  },
  {
    title: "Local Review Reply Assistant",
    buyer: "local businesses",
    pain: "Owners know reviews matter but do not have time to write consistent, polite replies.",
    why_now:
      "Local businesses are under pressure to look responsive online while keeping admin time low.",
    mvp: "Paste a customer review → get 3 reply options in the store's tone.",
    source_url: "https://www.indiehackers.com/",
    category: "AI tool",
    tags: ["local businesses", "reviews", "reputation"],
  },
];

async function loadSignals(): Promise<RawSignal[]> {
  for (const file of ["goldmine_signals.json", "top100_signals.json"]) {
    try {
      const filePath = path.join(process.cwd(), "data", file);
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.signals)) return parsed.signals;
      if (Array.isArray(parsed.items)) return parsed.items;
      if (Array.isArray(parsed.data)) return parsed.data;
    } catch {
      continue;
    }
  }

  return fallbackSignals;
}

function asSearchText(signal: RawSignal) {
  return JSON.stringify(signal).toLowerCase();
}

function fieldScore(signal: RawSignal) {
  let score = typeof signal.score === "number" ? signal.score : 0;

  if (signal.price_signal || signal.revenue_evidence || signal.revenue_signal) {
    score += 20;
  }
  if (signal.buyer || signal.audience || signal.target_user || signal.who) {
    score += 10;
  }
  if (signal.pain || signal.paid_pain || signal.problem || signal.issue) {
    score += 10;
  }
  if (signal.mvp || signal.tiny_mvp || signal.free_mvp || signal.product_angle) {
    score += 10;
  }
  if (signal.source_url || signal.url || signal.source) {
    score += 10;
  }

  return score;
}

function pickBestSignal(
  signals: RawSignal[],
  buildType: string,
  audience: string
) {
  const build = buildType.toLowerCase();
  const buyer = audience.toLowerCase();

  const scored = signals.map((signal) => {
    const text = asSearchText(signal);
    let score = fieldScore(signal);

    if (text.includes(build)) score += 5;
    if (text.includes(buyer)) score += 5;

    if (text.includes("mrr")) score += 4;
    if (text.includes("arr")) score += 4;
    if (text.includes("revenue")) score += 3;
    if (text.includes("customer")) score += 3;
    if (text.includes("sold")) score += 3;
    if (text.includes("profitable")) score += 3;
    if (text.includes("ai")) score += 2;
    if (text.includes("automation")) score += 2;
    if (text.includes("saas")) score += 2;
    if (text.includes("agency")) score += 2;
    if (text.includes("workflow")) score += 1;

    return { signal, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored[0]?.signal || fallbackSignals[0];
}

function normalize(signal: RawSignal) {
  const title =
    signal.opportunity ||
    signal.title ||
    signal.build_this ||
    signal.product ||
    signal.idea ||
    signal.name ||
    "AI Workflow Assistant";

  const pain =
    signal.pain ||
    signal.paid_pain ||
    signal.problem ||
    signal.issue ||
    "They can build with AI, but they do not know which small product is worth building and selling.";

  const why_now =
    signal.why_now ||
    signal.why_it_matters ||
    signal.why_money ||
    signal.reason ||
    "AI coding tools make it possible to ship small products quickly, but market selection is now the bottleneck.";

  const mvp =
    signal.tiny_mvp ||
    signal.mvp ||
    signal.free_mvp ||
    signal.product_angle ||
    signal.solution ||
    "Paste a specific workflow problem → get a small AI product idea, buyer, and validation angle.";

  const price_signal =
    signal.price_signal || signal.revenue_evidence || signal.revenue_signal;

  const source_url = signal.source_url || signal.url || signal.source;
  const whatYouCanBuild =
    signal.what_you_can_build ||
    signal.build_this ||
    signal.product_angle ||
    signal.solution ||
    String(title);
  const coreFeatures =
    signal.core_features && signal.core_features.length > 0
      ? signal.core_features
      : [
          "Simple input screen",
          "One useful generated output",
          "Copy button for the result",
          "Minimal admin view",
        ];
  const buildSteps =
    signal.build_steps && signal.build_steps.length > 0
      ? signal.build_steps
      : [
          "Create the basic page and data model.",
          "Add the main workflow input.",
          "Generate the useful output.",
          "Add copy buttons and a simple admin view.",
        ];

  return {
    title: String(title),
    latest_signal: String(
      signal.latest_signal ||
        why_now ||
        "A practical AI workflow is being used in real operations."
    ),
    what_happened: String(
      signal.what_happened ||
        "A builder used AI coding tools to turn a real workflow into a small internal tool."
    ),
    what_you_can_build: String(whatYouCanBuild || mvp),
    why_its_useful: String(
      signal.why_its_useful ||
        pain ||
        "It turns a repeated manual workflow into a small tool someone can use today."
    ),
    source_label: "Founder Story",
    pattern: String(
      signal.pattern || "AI-assisted internal operations automation"
    ),
    confidence: "High",
    pattern_matches: (
      signal.pattern_matches || [
        "Agriculture",
        "Construction",
        "Property Management",
        "Local Services",
      ]
    ).map(String),
    core_features: coreFeatures.map(String),
    comparable_price: String(
      signal.comparable_price ||
        price_signal ||
        "$299 setup + $29/month for a small internal automation prototype."
    ),
    build_steps: buildSteps.map(String),
    code_x_prompt: String(
      signal.code_x_prompt ||
        "Build a minimal prototype for this tool: " +
          whatYouCanBuild +
          ". Keep the UI and code simple. Prioritize a working MVP over complex architecture."
    ),
    source_url: source_url ? String(source_url) : undefined,
  };
}

function buildLaunchPack(free: ReturnType<typeof normalize>) {
  return {
    latest_signal: free.latest_signal,
    what_you_can_build: free.what_you_can_build,
    core_features: free.core_features,
    comparable_price: free.comparable_price,
    build_steps: free.build_steps,
    pattern_matches: free.pattern_matches,
    code_x_prompt: free.code_x_prompt,
  };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const buildType = String(body.buildType || "AI tool");
  const audience = String(body.audience || "founders");

  const signals = await loadSignals();
  const chosen = pickBestSignal(signals, buildType, audience);
  const free = normalize(chosen);

  return NextResponse.json({
    free,
    paid: buildLaunchPack(free),
    locked: {
      latest_signal: true,
      what_you_can_build: true,
      core_features: true,
      comparable_price: true,
      build_steps: true,
      code_x_prompt: true,
    },
  });
}
