import { canonicalMoneySignals } from "@/data/money-signals";
import { getGmailMarketSignals } from "@/lib/gmail-signals";
import { getSuccessRecords } from "@/lib/success-records";

export type ContentStudioSourceType = "signal" | "success record" | "money move";

export type ContentStudioRecord = {
  id: string;
  sourceType: ContentStudioSourceType;
  title: string;
  buyer: string;
  pain: string;
  whyNow: string;
  productIdea: string;
  firstProduct: string;
  price: string;
  distribution: string;
  proof: string;
  leadMagnetAngle: string;
  contentAngle: string;
  codexPromptHint: string;
};

const FALLBACK = "Not extracted yet";

function cleanText(value: string | undefined, fallback = FALLBACK) {
  const trimmed = value?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function firstSentence(value: string) {
  const [sentence] = value.split(/(?<=[.!?])\s+/);

  return cleanText(sentence, value);
}

function limitWords(value: string, maxWords: number) {
  const words = value.split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return value;
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function getContentStudioRecords(): ContentStudioRecord[] {
  const gmailSignals = getGmailMarketSignals().map((signal): ContentStudioRecord => ({
    id: `signal-${signal.id}`,
    sourceType: "signal",
    title: signal.sourceTitle,
    buyer: signal.buyer,
    pain: signal.pain,
    whyNow: signal.whyNow,
    productIdea: signal.whatYouCanBuild,
    firstProduct: signal.whatYouCanBuild,
    price: signal.comparablePrice,
    distribution: signal.patternMatches.join(", "),
    proof: signal.latestSignal,
    leadMagnetAngle: firstSentence(signal.codeXPrompt),
    contentAngle: signal.latestSignal,
    codexPromptHint: signal.codeXPrompt,
  }));

  const successRecords = getSuccessRecords().map((record): ContentStudioRecord => ({
    id: `success-${record.id}`,
    sourceType: "success record",
    title: record.businessName,
    buyer: record.buyer,
    pain: record.pain,
    whyNow: record.whyItWorked,
    productIdea: record.aiNativeRemake,
    firstProduct: record.starterProduct,
    price: record.pricingModel,
    distribution: record.growthChannel,
    proof: record.revenueSignal,
    leadMagnetAngle: record.offer,
    contentAngle: record.xPost,
    codexPromptHint: record.buildPrompt,
  }));

  const moneyMoves = canonicalMoneySignals.map((signal): ContentStudioRecord => ({
    id: `money-${signal.id}`,
    sourceType: "money move",
    title: signal.whatMoneyMoved,
    buyer: signal.buyer,
    pain: signal.paidPain,
    whyNow: signal.proof,
    productIdea: signal.whatMoneyMoved,
    firstProduct: signal.firstOffer,
    price: signal.firstOffer,
    distribution: signal.channels.join(", "),
    proof: signal.proof,
    leadMagnetAngle: `${signal.firstOffer} teardown`,
    contentAngle: `${signal.market}: ${signal.whatMoneyMoved}`,
    codexPromptHint: `Build a focused validation asset for ${signal.buyer} around ${signal.paidPain}.`,
  }));

  return [...gmailSignals, ...successRecords, ...moneyMoves].map((record) => ({
    ...record,
    title: limitWords(cleanText(record.title), 18),
    buyer: cleanText(record.buyer),
    pain: cleanText(record.pain),
    whyNow: cleanText(record.whyNow),
    productIdea: cleanText(record.productIdea),
    firstProduct: cleanText(record.firstProduct),
    price: cleanText(record.price, "Price not set yet"),
    distribution: cleanText(record.distribution, "Distribution channel not set yet"),
    proof: cleanText(record.proof),
    leadMagnetAngle: cleanText(record.leadMagnetAngle),
    contentAngle: cleanText(record.contentAngle),
    codexPromptHint: cleanText(record.codexPromptHint),
  }));
}
