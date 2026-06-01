import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type RawSignal = {
  title?: string;
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
  mvp?: string;
  tiny_mvp?: string;
  free_mvp?: string;
  solution?: string;
  source_url?: string;
  url?: string;
  source?: string;
  category?: string;
  tags?: string[];
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
  try {
    const filePath = path.join(process.cwd(), "data", "top100_signals.json");
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.signals)) return parsed.signals;
    if (Array.isArray(parsed.items)) return parsed.items;
    if (Array.isArray(parsed.data)) return parsed.data;

    return fallbackSignals;
  } catch {
    return fallbackSignals;
  }
}

function asSearchText(signal: RawSignal) {
  return JSON.stringify(signal).toLowerCase();
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
    let score = 0;

    if (text.includes(build)) score += 5;
    if (text.includes(buyer)) score += 5;

    if (text.includes("ai")) score += 2;
    if (text.includes("automation")) score += 2;
    if (text.includes("saas")) score += 2;
    if (text.includes("founder")) score += 2;
    if (text.includes("agency")) score += 2;
    if (text.includes("creator")) score += 2;
    if (text.includes("local")) score += 2;
    if (text.includes("pain")) score += 1;
    if (text.includes("revenue")) score += 1;
    if (text.includes("customer")) score += 1;
    if (text.includes("manual")) score += 1;
    if (text.includes("workflow")) score += 1;

    return { signal, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 5).filter((item) => item.score > 0);

  if (top.length > 0) {
    return top[Math.floor(Math.random() * top.length)].signal;
  }

  return signals[Math.floor(Math.random() * signals.length)] || fallbackSignals[0];
}

function normalize(signal: RawSignal) {
  const title =
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
    signal.reason ||
    "AI coding tools make it possible to ship small products quickly, but market selection is now the bottleneck.";

  const mvp =
    signal.mvp ||
    signal.tiny_mvp ||
    signal.free_mvp ||
    signal.solution ||
    "Paste a specific workflow problem → get a small AI product idea, buyer, and validation angle.";

  const source_url = signal.source_url || signal.url || signal.source;

  return {
    title: String(title),
    buyer: String(buyer),
    pain: String(pain),
    why_now: String(why_now),
    mvp: String(mvp),
    source_url: source_url ? String(source_url) : undefined,
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