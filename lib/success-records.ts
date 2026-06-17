import goldmineSignals from "@/data/goldmine_signals.json";

const NOT_EXTRACTED = "Not extracted yet";

export type SuccessRecordQualityLabel =
  | "Ready to post"
  | "Needs enrichment"
  | "Weak record";

export type SuccessRecordQualitySignals = {
  hasGrowthChannel: boolean;
  hasWhyItWorked: boolean;
  hasRevenueSignal: boolean;
  hasBuildPrompt: boolean;
  hasDistributionAssets: boolean;
};

export type SuccessRecord = {
  id: string;
  sourceUrl: string;
  sourceType: string;
  businessName: string;
  industry: string;
  revenueSignal: string;
  buyer: string;
  pain: string;
  offer: string;
  pricingModel: string;
  growthChannel: string;
  distributionNotes: string;
  whyItWorked: string;
  aiNativeRemake: string;
  starterProduct: string;
  validationPlan48h: string;
  xPost: string;
  shortScript: string;
  imagePrompt: string;
  buildPrompt: string;
  monetizationPath: string;
  replicationScore: number;
  aiLeverageScore: number;
  monetizationClarity: number;
  buildDifficulty: number;
  qualitySignals: SuccessRecordQualitySignals;
  qualityLabel: SuccessRecordQualityLabel;
  postCard: string;
  enrichmentNotes: string[];
};

type GoldmineSignal = {
  title?: string;
  source_url?: string;
  buyer?: string;
  pain?: string;
  bad_workaround?: string;
  product_angle?: string;
  why_money?: string;
  mvp?: string;
  price_signal?: string;
  nocode_prompt?: string;
  codex_prompt?: string;
  validation_48h?: string;
  score?: number;
};

function cleanText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : NOT_EXTRACTED;
}

function hasExtracted(value: string) {
  return value.trim().length > 0 && value !== NOT_EXTRACTED;
}

function slugify(value: string, index: number) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return slug || `success-record-${index + 1}`;
}

function scorePresence(...values: string[]) {
  return values.filter((value) => value !== NOT_EXTRACTED).length;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(10, score));
}

function buildXPost(record: {
  businessName: string;
  buyer: string;
  pain: string;
  starterProduct: string;
}) {
  return [
    "I studied this indie business pattern:",
    "",
    `Business: ${record.businessName}`,
    `Buyer: ${record.buyer}`,
    `Pain: ${record.pain}`,
    "",
    "The interesting part is not the product. It's the buyer-pain-offer fit.",
    "",
    `AI remake: ${record.starterProduct}`,
    "Smallest starter version: one focused workflow, one clear output, one paid validation test.",
  ].join("\n");
}

function buildShortScript(record: {
  businessName: string;
  buyer: string;
  pain: string;
  starterProduct: string;
}) {
  return [
    "Hook: I studied this indie business pattern.",
    `Context: ${record.businessName}`,
    `Buyer: ${record.buyer}`,
    `Pain: ${record.pain}`,
    "Turn: The product matters less than the buyer-pain-offer fit.",
    `AI remake: ${record.starterProduct}`,
    "Close: Validate the smallest starter version before adding features.",
  ].join("\n");
}

function buildImagePrompt(record: {
  businessName: string;
  buyer: string;
  starterProduct: string;
}) {
  return `Dark SaaS-style product screenshot for ${record.starterProduct}, made for ${record.buyer}, inspired by the success pattern "${record.businessName}". Show a focused dashboard with input, generated output, validation checklist, and pricing panel.`;
}

function buildMonetizationPath(record: {
  pricingModel: string;
  offer: string;
  buyer: string;
}) {
  return [
    `Start with ${record.pricingModel}.`,
    `Sell the first version as: ${record.offer}.`,
    `Validate with 10-20 ${record.buyer} prospects before expanding the feature set.`,
  ].join(" ");
}

function buildPostCard(record: {
  businessName: string;
  revenueSignal: string;
  buyer: string;
  pain: string;
  offer: string;
  whyItWorked: string;
  aiNativeRemake: string;
  starterProduct: string;
}) {
  return [
    "Business Pattern:",
    record.businessName,
    "",
    "Revenue:",
    record.revenueSignal,
    "",
    "Buyer:",
    record.buyer,
    "",
    "Pain:",
    record.pain,
    "",
    "Offer:",
    record.offer,
    "",
    "Why it worked:",
    record.whyItWorked,
    "",
    "AI remake:",
    record.aiNativeRemake,
    "",
    "Starter product:",
    record.starterProduct,
  ].join("\n");
}

function buildQualitySignals(record: {
  growthChannel: string;
  whyItWorked: string;
  revenueSignal: string;
  buildPrompt: string;
  xPost: string;
  shortScript: string;
  imagePrompt: string;
}): SuccessRecordQualitySignals {
  return {
    hasGrowthChannel: hasExtracted(record.growthChannel),
    hasWhyItWorked: hasExtracted(record.whyItWorked),
    hasRevenueSignal: hasExtracted(record.revenueSignal),
    hasBuildPrompt: hasExtracted(record.buildPrompt),
    hasDistributionAssets:
      hasExtracted(record.xPost) &&
      hasExtracted(record.shortScript) &&
      hasExtracted(record.imagePrompt),
  };
}

function getQualityLabel(record: {
  buyer: string;
  pain: string;
  offer: string;
  qualitySignals: SuccessRecordQualitySignals;
}): SuccessRecordQualityLabel {
  const hasBuyer = hasExtracted(record.buyer);
  const hasPain = hasExtracted(record.pain);
  const hasOffer = hasExtracted(record.offer);

  if (!hasBuyer || !hasPain || !hasOffer || !record.qualitySignals.hasBuildPrompt) {
    return "Weak record";
  }

  if (
    record.qualitySignals.hasRevenueSignal &&
    record.qualitySignals.hasWhyItWorked &&
    record.qualitySignals.hasBuildPrompt &&
    record.qualitySignals.hasDistributionAssets
  ) {
    return "Ready to post";
  }

  return "Needs enrichment";
}

function buildEnrichmentNotes(record: {
  growthChannel: string;
  whyItWorked: string;
  sourceUrl: string;
  qualitySignals: SuccessRecordQualitySignals;
}) {
  const notes: string[] = [];

  if (!record.qualitySignals.hasGrowthChannel) {
    notes.push("Growth channel missing");
  }

  if (!record.qualitySignals.hasWhyItWorked || record.whyItWorked.length < 80) {
    notes.push("Why it worked too generic");
  }

  notes.push("Distribution assets are placeholder");

  if (!hasExtracted(record.sourceUrl)) {
    notes.push("Needs source evidence");
  } else {
    notes.push("Needs source evidence review");
  }

  return notes;
}

export function mapGoldmineSignalToSuccessRecord(
  signal: GoldmineSignal,
  index: number,
): SuccessRecord {
  const businessName = cleanText(signal.title);
  const sourceUrl = cleanText(signal.source_url);
  const buyer = cleanText(signal.buyer);
  const pain = cleanText(signal.pain);
  const offer = cleanText(signal.product_angle || signal.mvp);
  const starterProduct = cleanText(signal.mvp || signal.product_angle);
  const pricingModel = cleanText(signal.price_signal);
  const revenueSignal = cleanText(signal.why_money);
  const whyItWorked = cleanText(signal.why_money);
  const buildPrompt = cleanText(signal.codex_prompt || signal.nocode_prompt);
  const growthChannel = NOT_EXTRACTED;
  const distributionNotes = NOT_EXTRACTED;
  const aiNativeRemake =
    starterProduct === NOT_EXTRACTED
      ? NOT_EXTRACTED
      : `Turn the success pattern into an AI-native workflow that helps ${buyer} get the outcome faster.`;
  const validationPlan48h = cleanText(signal.validation_48h);
  const xPost = buildXPost({
    businessName,
    buyer,
    pain,
    starterProduct,
  });
  const shortScript = buildShortScript({
    businessName,
    buyer,
    pain,
    starterProduct,
  });
  const imagePrompt = buildImagePrompt({
    businessName,
    buyer,
    starterProduct,
  });
  const qualitySignals = buildQualitySignals({
    growthChannel,
    whyItWorked,
    revenueSignal,
    buildPrompt,
    xPost,
    shortScript,
    imagePrompt,
  });
  const qualityLabel = getQualityLabel({
    buyer,
    pain,
    offer,
    qualitySignals,
  });
  const postCard = buildPostCard({
    businessName,
    revenueSignal,
    buyer,
    pain,
    offer,
    whyItWorked,
    aiNativeRemake,
    starterProduct,
  });
  const enrichmentNotes = buildEnrichmentNotes({
    growthChannel,
    whyItWorked,
    sourceUrl,
    qualitySignals,
  });

  const baseRecord = {
    businessName,
    buyer,
    pain,
    offer,
    pricingModel,
    starterProduct,
  };

  const replicationInputs = scorePresence(
    buyer,
    pain,
    offer,
    starterProduct,
    cleanText(signal.validation_48h),
  );
  const monetizationInputs = scorePresence(revenueSignal, pricingModel, buyer);

  return {
    id: slugify(businessName, index),
    sourceUrl,
    sourceType: "Indie Hackers",
    businessName,
    industry: NOT_EXTRACTED,
    revenueSignal,
    buyer,
    pain,
    offer,
    pricingModel,
    growthChannel,
    distributionNotes,
    whyItWorked,
    aiNativeRemake,
    starterProduct,
    validationPlan48h,
    xPost,
    shortScript,
    imagePrompt,
    buildPrompt,
    monetizationPath: buildMonetizationPath(baseRecord),
    replicationScore: clampScore(replicationInputs * 2),
    aiLeverageScore: starterProduct === NOT_EXTRACTED ? 0 : 6,
    monetizationClarity: clampScore(monetizationInputs * 3),
    buildDifficulty: buildPrompt === NOT_EXTRACTED ? 0 : 4,
    qualitySignals,
    qualityLabel,
    postCard,
    enrichmentNotes,
  };
}

export function getSuccessRecords(): SuccessRecord[] {
  return (goldmineSignals as GoldmineSignal[]).map(
    mapGoldmineSignalToSuccessRecord,
  );
}

export function getSuccessRecordPlaceholder() {
  return NOT_EXTRACTED;
}
