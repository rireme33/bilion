import fs from "node:fs";
import path from "node:path";
import { gmailSignals, type GmailSignal } from "@/data/gmail-signals";

type GmailSignalSource = {
  name?: string;
  from?: string;
  subject?: string;
  received_at?: string;
  source_type?: string;
};

type GmailSignalRecord = {
  id: string;
  source?: GmailSignalSource | string;
  sender?: string;
  subject?: string;
  received_at?: string;
  summary?: string;
  category?: string;
  raw_signal?: string;
  buyer?: string;
  pain?: string;
  why_now?: string;
  product_idea?: string;
  first_product?: string;
  price?: string;
  distribution?: string;
  lead_magnet_angle?: string;
  content_angle?: string;
  bilion_access_angle?: string;
  evidence_level?: string;
  hype_risk?: string;
  status?: string;
};

export type GmailMarketSignal = {
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
  signalSourceLabel: string;
};

const signalInboxRoot = path.join(process.cwd(), "data", "signal-inbox");
const appVisibleStatuses = ["published", "drafts"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getSource(record: GmailSignalRecord) {
  return isRecord(record.source) ? record.source : undefined;
}

function getPublisher(record: GmailSignalRecord) {
  const source = getSource(record);

  return (
    source?.name ||
    source?.source_type ||
    (typeof record.source === "string" ? record.source : "") ||
    "Newsletter"
  );
}

function getSubject(record: GmailSignalRecord) {
  return record.subject || getSource(record)?.subject || record.product_idea || record.id;
}

function getSender(record: GmailSignalRecord) {
  return record.sender || getSource(record)?.from || "";
}

function getReceivedAt(record: GmailSignalRecord) {
  return record.received_at || getSource(record)?.received_at || "";
}

function getSignalFiles(statusDir: string) {
  const dir = path.join(signalInboxRoot, statusDir);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => path.join(dir, fileName));
}

function loadGmailSignalRecords() {
  const records: GmailSignalRecord[] = [];

  for (const statusDir of appVisibleStatuses) {
    for (const filePath of getSignalFiles(statusDir)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;

        if (!isRecord(parsed) || !getString(parsed.id)) {
          continue;
        }

        records.push(parsed as GmailSignalRecord);
      } catch {
        // Broken draft records should not break the customer-facing app.
      }
    }
  }

  return records;
}

function mapGmailSignal(record: GmailSignalRecord): GmailMarketSignal {
  const publisher = getPublisher(record);
  const subject = getSubject(record);
  const firstProduct =
    record.first_product ||
    record.product_idea ||
    "A focused AI product brief built from this newsletter signal.";
  const price =
    record.price ||
    "Start with a $19 one-time report, then test $29/month ongoing access.";
  const distribution =
    record.distribution ||
    "X, newsletter replies, founder communities, and direct buyer outreach.";
  const leadMagnet =
    record.lead_magnet_angle ||
    "A free before/after breakdown of the market signal and the first offer.";
  const contentAngle =
    record.content_angle ||
    "Turn the newsletter signal into a public market insight and ask who wants the build plan.";

  return {
    id: record.id,
    latestSignal:
      record.raw_signal ||
      record.summary ||
      record.why_now ||
      "A Gmail/newsletter signal points to a repeated buyer pain.",
    sourceTitle: `${publisher} signal: ${subject}`,
    sourceUrl: "",
    sourceType: "Newsletter Signal",
    sourceNote: [
      getSender(record) ? `From: ${getSender(record)}` : "",
      getReceivedAt(record) ? `Received: ${getReceivedAt(record)}` : "",
      record.status ? `Status: ${record.status}` : "",
      record.evidence_level ? `Evidence: ${record.evidence_level}` : "",
      record.hype_risk ? `Hype risk: ${record.hype_risk}` : "",
    ]
      .filter(Boolean)
      .join(" | "),
    buyer:
      record.buyer ||
      "AI builders and solo founders looking for proven newsletter signals.",
    pain:
      record.pain ||
      "The buyer sees market noise but does not know which specific pain is worth building around.",
    whyNow:
      record.why_now ||
      "Newsletter signals show what builders and buyers are paying attention to right now.",
    whatYouCanBuild: firstProduct,
    coreFeatures: [
      "Signal summary",
      "Buyer and pain extraction",
      "Build it / Sell it / Post it outputs",
      "Copyable validation plan",
    ],
    comparablePrice: price,
    buildSteps: [
      "Turn the newsletter signal into one buyer-specific product angle.",
      "Create a small before/after example from the pain.",
      "Write the outreach message and public post from the same signal.",
      "Send the offer to 15 likely buyers within 48 hours.",
    ],
    patternMatches: [
      publisher,
      record.category || "newsletter signal",
      distribution,
    ],
    codeXPrompt: `Build a standalone AI market-signal action brief generator.

Source:
${publisher} newsletter

Signal:
${record.raw_signal || firstProduct}

Buyer:
${record.buyer || "AI builders and solo founders"}

Pain:
${record.pain || "They need a clearer path from signal to action."}

What to build:
${firstProduct}

Price:
${price}

Distribution:
${distribution}

Lead magnet:
${leadMagnet}

Content angle:
${contentAngle}

Requirements:
- Use local React state only.
- Do not add auth.
- Do not add a database.
- Do not call external APIs.
- Show Build it, Sell it, and Post it outputs from the selected signal.`,
    signalSourceLabel: "Gmail Signal",
  };
}

export function normalizeGmailSignal(signal: GmailSignal): GmailMarketSignal {
  return {
    id: signal.id,
    latestSignal: signal.moneySignal,
    sourceTitle: signal.title,
    sourceUrl: "",
    sourceType: signal.market,
    sourceNote: [
      "Extracted from newsletter/Product Hunt/Reddit/Gumroad emails",
      `Source: ${signal.sourceName}`,
      `Date: ${signal.sourceDate}`,
      `Pattern: ${signal.oneLinePattern}`,
      `Distribution: ${signal.distribution}`,
    ].join(" | "),
    buyer: signal.buyer,
    pain: signal.paidPain,
    whyNow: signal.moneySignal,
    whatYouCanBuild: signal.starterProduct,
    coreFeatures: [
      "Money signal summary",
      "Buyer and paid pain",
      "First offer",
      "48-hour validation plan",
      "Codex-ready MVP prompt",
    ],
    comparablePrice: `${signal.firstOffer} - ${signal.price}`,
    buildSteps: signal.validationPlan48h,
    patternMatches: [
      signal.market,
      signal.moneySignal,
      signal.firstOffer,
      signal.distribution,
      "Gmail seed signal",
    ],
    codeXPrompt: signal.codexBuildPrompt,
    signalSourceLabel: "Gmail Signal",
  };
}

export function getGmailMarketSignals() {
  const staticSignals = gmailSignals.map(normalizeGmailSignal);
  const fileSignals = loadGmailSignalRecords().map(mapGmailSignal);
  const seenIds = new Set<string>();

  return [...staticSignals, ...fileSignals].filter((signal) => {
    if (seenIds.has(signal.id)) {
      return false;
    }

    seenIds.add(signal.id);
    return true;
  });
}
