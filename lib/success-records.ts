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

export type ImportedSuccessRecordInput = Record<string, unknown>;

function cleanText(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => cleanText(item))
      .filter((item) => item !== NOT_EXTRACTED);

    return items.length > 0 ? items.join("\n") : NOT_EXTRACTED;
  }

  return NOT_EXTRACTED;
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

function getField(input: ImportedSuccessRecordInput, keys: string[]) {
  const normalized = new Map<string, unknown>();

  for (const [key, value] of Object.entries(input)) {
    normalized.set(key.toLowerCase().replace(/[^a-z0-9]/g, ""), value);
  }

  for (const key of keys) {
    const value = normalized.get(key.toLowerCase().replace(/[^a-z0-9]/g, ""));

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function getInputId(input: ImportedSuccessRecordInput) {
  return cleanText(getField(input, ["id", "recordId", "record_id"]));
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

function completeSuccessRecord({
  aiNativeRemake,
  buildPrompt,
  businessName,
  distributionNotes,
  growthChannel,
  id,
  imagePrompt,
  industry,
  offer,
  pain,
  pricingModel,
  revenueSignal,
  shortScript,
  sourceType,
  sourceUrl,
  starterProduct,
  validationPlan48h,
  whyItWorked,
  xPost,
  buyer,
}: {
  aiNativeRemake: string;
  buildPrompt: string;
  businessName: string;
  distributionNotes: string;
  growthChannel: string;
  id: string;
  imagePrompt: string;
  industry: string;
  offer: string;
  pain: string;
  pricingModel: string;
  revenueSignal: string;
  shortScript: string;
  sourceType: string;
  sourceUrl: string;
  starterProduct: string;
  validationPlan48h: string;
  whyItWorked: string;
  xPost: string;
  buyer: string;
}): SuccessRecord {
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

  const replicationInputs = scorePresence(
    buyer,
    pain,
    offer,
    starterProduct,
    validationPlan48h,
  );
  const monetizationInputs = scorePresence(revenueSignal, pricingModel, buyer);

  return {
    id,
    sourceUrl,
    sourceType,
    businessName,
    industry,
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
    monetizationPath: buildMonetizationPath({
      pricingModel,
      offer,
      buyer,
    }),
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
  return completeSuccessRecord({
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
  });
}

export function mapImportedJsonToSuccessRecord(
  input: ImportedSuccessRecordInput,
  index = 0,
): SuccessRecord {
  const inputId = getInputId(input);
  const businessName = cleanText(
    getField(input, ["businessName", "business", "business_name", "name", "title"]),
  );
  const sourceUrl = cleanText(getField(input, ["sourceUrl", "source_url", "url"]));
  const sourceType = cleanText(getField(input, ["sourceType", "source_type", "source"])) ===
    NOT_EXTRACTED
    ? "Glasp Import"
    : cleanText(getField(input, ["sourceType", "source_type", "source"]));
  const buyer = cleanText(getField(input, ["buyer", "customer", "targetBuyer", "target_user"]));
  const pain = cleanText(getField(input, ["pain", "problem", "customerPain"]));
  const offer = cleanText(getField(input, ["offer", "product", "productAngle", "product_angle"]));
  const starterProduct = cleanText(
    getField(input, ["starterProduct", "starter_product", "mvp", "aiStarterProduct"]),
  );
  const pricingModel = cleanText(
    getField(input, ["pricingModel", "pricing_model", "price", "priceSignal"]),
  );
  const revenueSignal = cleanText(
    getField(input, ["revenueSignal", "revenue_signal", "revenue", "whyMoney"]),
  );
  const whyItWorked = cleanText(
    getField(input, ["whyItWorked", "why_it_worked", "whyWorked", "successPattern"]),
  );
  const aiNativeRemake = cleanText(
    getField(input, ["aiNativeRemake", "ai_native_remake", "aiRemake", "remake"]),
  );
  const growthChannel = cleanText(
    getField(input, ["growthChannel", "growth_channel", "channel", "growth"]),
  );
  const xPost = cleanText(getField(input, ["xPost", "x_post", "xPostIdeas", "x_post_ideas"]));
  const shortScript = cleanText(
    getField(input, ["shortScript", "short_script", "shortScriptIdeas", "short_script_ideas"]),
  );
  const imagePrompt = cleanText(
    getField(input, ["imagePrompt", "image_prompt", "visualPrompt"]),
  );
  const buildPrompt = cleanText(
    getField(input, ["buildPrompt", "build_prompt", "codexPrompt", "implementationPrompt"]),
  );

  return completeSuccessRecord({
    id:
      inputId === NOT_EXTRACTED
        ? `glasp-${slugify(businessName, index)}`
        : `glasp-${slugify(inputId, index)}`,
    sourceUrl,
    sourceType,
    businessName,
    industry: cleanText(getField(input, ["industry", "category", "market"])),
    revenueSignal,
    buyer,
    pain,
    offer,
    pricingModel,
    growthChannel,
    distributionNotes: cleanText(
      getField(input, ["distributionNotes", "distribution_notes", "distribution"]),
    ),
    whyItWorked,
    aiNativeRemake:
      aiNativeRemake === NOT_EXTRACTED && starterProduct !== NOT_EXTRACTED
        ? `Turn the success pattern into an AI-native workflow around ${starterProduct}.`
        : aiNativeRemake,
    starterProduct,
    validationPlan48h: cleanText(
      getField(input, ["validationPlan48h", "validation_plan_48h", "validation", "validation48h"]),
    ),
    xPost:
      xPost === NOT_EXTRACTED
        ? buildXPost({ businessName, buyer, pain, starterProduct })
        : xPost,
    shortScript:
      shortScript === NOT_EXTRACTED
        ? buildShortScript({ businessName, buyer, pain, starterProduct })
        : shortScript,
    imagePrompt:
      imagePrompt === NOT_EXTRACTED
        ? buildImagePrompt({ businessName, buyer, starterProduct })
        : imagePrompt,
    buildPrompt,
  });
}

function isImportedRecordInput(value: unknown): value is ImportedSuccessRecordInput {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getServerBuiltins() {
  if (typeof window !== "undefined") {
    return undefined;
  }

  const processWithBuiltins = process as typeof process & {
    getBuiltinModule?: (id: string) => unknown;
  };

  if (!processWithBuiltins.getBuiltinModule) {
    return undefined;
  }

  return {
    fs: processWithBuiltins.getBuiltinModule("fs") as {
      existsSync: (filePath: string) => boolean;
      readdirSync: (dirPath: string) => string[];
      readFileSync: (filePath: string, encoding: "utf8") => string;
    },
    path: processWithBuiltins.getBuiltinModule("path") as {
      extname: (filePath: string) => string;
      join: (...segments: string[]) => string;
    },
  };
}

function loadImportedSuccessRecords(): SuccessRecord[] {
  const builtins = getServerBuiltins();

  if (!builtins) {
    return [];
  }

  try {
    const { fs, path } = builtins;
    // Imported Glasp/Bilion records live in data/success-records/imports/*.json
    const importsDir = path.join(
      process.cwd(),
      "data",
      "success-records",
      "imports",
    );

    if (!fs.existsSync(importsDir)) {
      return [];
    }

    return fs
      .readdirSync(importsDir)
      .filter((fileName) => path.extname(fileName).toLowerCase() === ".json")
      .sort((a, b) => b.localeCompare(a))
      .flatMap((fileName, index) => {
        try {
          const filePath = path.join(importsDir, fileName);
          const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;

          if (!isImportedRecordInput(parsed)) {
            return [];
          }

          return [mapImportedJsonToSuccessRecord(parsed, index)];
        } catch {
          return [];
        }
      });
  } catch {
    return [];
  }
}

function withUniqueRecordIds(records: SuccessRecord[]) {
  const seen = new Map<string, number>();

  return records.map((record) => {
    const count = seen.get(record.id) || 0;
    seen.set(record.id, count + 1);

    if (count === 0) {
      return record;
    }

    return {
      ...record,
      id: `${record.id}-${count + 1}`,
    };
  });
}

export function getSuccessRecords(): SuccessRecord[] {
  const importedRecords = loadImportedSuccessRecords();
  const goldmineRecords = (goldmineSignals as GoldmineSignal[]).map(
    mapGoldmineSignalToSuccessRecord,
  );

  return withUniqueRecordIds([...importedRecords, ...goldmineRecords]);
}

export function getSuccessRecordPlaceholder() {
  return NOT_EXTRACTED;
}
