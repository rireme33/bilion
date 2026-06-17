import goldmineSignals from "@/data/goldmine_signals.json";

const NOT_EXTRACTED = "Not extracted yet";

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
    `${record.businessName} shows a simple pattern:`,
    `${record.buyer} will pay when ${record.pain.toLowerCase()}`,
    `AI remake: ${record.starterProduct}`,
    "Start with one painful workflow, one buyer, and one paid validation test.",
  ].join("\n\n");
}

function buildShortScript(record: {
  businessName: string;
  buyer: string;
  pain: string;
  starterProduct: string;
}) {
  return [
    `Hook: ${record.businessName} is not just a story. It is a repeatable success pattern.`,
    `Pain: ${record.buyer} deal with this: ${record.pain}`,
    `Remake: Build ${record.starterProduct}.`,
    "Close: Validate the smallest paid version before adding features.",
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
    growthChannel: NOT_EXTRACTED,
    distributionNotes: NOT_EXTRACTED,
    whyItWorked,
    aiNativeRemake:
      starterProduct === NOT_EXTRACTED
        ? NOT_EXTRACTED
        : `Turn the success pattern into an AI-native workflow that helps ${buyer} get the outcome faster.`,
    starterProduct,
    validationPlan48h: cleanText(signal.validation_48h),
    xPost: buildXPost({
      businessName,
      buyer,
      pain,
      starterProduct,
    }),
    shortScript: buildShortScript({
      businessName,
      buyer,
      pain,
      starterProduct,
    }),
    imagePrompt: buildImagePrompt({
      businessName,
      buyer,
      starterProduct,
    }),
    buildPrompt,
    monetizationPath: buildMonetizationPath(baseRecord),
    replicationScore: clampScore(replicationInputs * 2),
    aiLeverageScore: starterProduct === NOT_EXTRACTED ? 0 : 6,
    monetizationClarity: clampScore(monetizationInputs * 3),
    buildDifficulty: buildPrompt === NOT_EXTRACTED ? 0 : 4,
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
