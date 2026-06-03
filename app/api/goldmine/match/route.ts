import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type RawSignal = {
  title?: string;
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

  const buyer =
    signal.buyer ||
    signal.audience ||
    signal.target_user ||
    signal.who ||
    "solo founders and AI builders";

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

  return {
    title: String(title),
    opportunity: String(title),
    buyer: String(buyer),
    pain: String(pain),
    why_now: String(why_now),
    tiny_mvp: String(mvp),
    mvp: String(mvp),
    price_signal: price_signal ? String(price_signal) : undefined,
    revenue_evidence: price_signal ? String(price_signal) : undefined,
    source_url: source_url ? String(source_url) : undefined,
  };
}

function buildLaunchPack(free: ReturnType<typeof normalize>) {
  const productName = free.title;
  const buyer = free.buyer;
  const pain = free.pain;
  const source = free.source_url || "Source signal not provided";
  const price =
    free.price_signal ||
    "$19 one-time for early access, then $9/mo if users need it weekly.";

  return {
    product_name: productName,
    price,
    lp_copy:
      "Headline: Solve this painful workflow for " +
      buyer +
      "\n\nSubhead: " +
      productName +
      " helps " +
      buyer +
      " handle this problem faster: " +
      pain +
      "\n\nCTA: Get the first workflow\n\nProof angle: Built from a real founder signal. Source: " +
      source,
    x_post:
      "I found a tiny product angle for " +
      buyer +
      ":\n\nPain: " +
      pain +
      "\n\nBuild this: " +
      productName +
      "\n\nThe plan is not to build a huge SaaS. It is to ship one narrow workflow, show a manual sample, and ask if people would pay " +
      price +
      ".",
    dm_script:
      "Hey - quick question. Do you ever deal with this problem?\n\n" +
      pain +
      "\n\nI am testing a tiny workflow called " +
      productName +
      " for " +
      buyer +
      ". If I send one free sample, would you tell me if it is useful?",
    gumroad_description:
      productName +
      " is a tiny launch-ready workflow for " +
      buyer +
      ".\n\nIt helps with: " +
      pain +
      "\n\nYou get the product angle, landing copy, X post, DM script, Codex prompt, and a 48-hour launch plan so you can test demand before overbuilding.\n\nSource: " +
      source,
    codex_prompt:
      "Build a clean dark Bilion-style web app called " +
      productName +
      " for " +
      buyer +
      ". The app should solve this paid pain: " +
      pain +
      ". Inputs: buyer context, current workflow, tone, and desired output. Outputs: one useful result, landing page copy, pricing, X post, DM script, Gumroad description, and a 48-hour launch plan. Do not add auth, database, webhooks, subscriptions, or new dependencies. Add copy buttons for every output.",
    launch_plan_48h:
      "Hour 0-4: Turn the pain into one manual sample workflow.\nHour 4-12: Pick 20 target buyers and send the DM script.\nHour 12-24: Create free samples for anyone who replies.\nHour 24-36: Ask if the result is worth " +
      price +
      ".\nHour 36-48: Build only the smallest version if 3+ people ask to use it again or agree to pay.",
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
      codex_prompt: true,
      landing_page_copy: true,
      pricing: true,
      x_posts: true,
      dm_script: true,
      validation_plan: true,
      similar_examples: true,
      export: true,
    },
  });
}
