import fs from "node:fs";
import path from "node:path";

type ReviewAction = "publish_candidate" | "review_more" | "reject_candidate";

type DraftRecord = {
  id: string;
  sourceName: string;
  subject: string;
  category: string;
  productIdea: string;
  buyer: string;
  pain: string;
  score: number;
  evidenceLevel: string;
  hypeRisk: string;
  recommendedUse: string;
};

type LoadedDraft =
  | {
      fileName: string;
      record: DraftRecord;
      valid: true;
    }
  | {
      errors: string[];
      fileName: string;
      valid: false;
    };

const draftsDir = path.join(process.cwd(), "data", "signal-inbox", "drafts");

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getSourceName(value: Record<string, unknown>) {
  if (typeof value.source === "string") {
    return value.source;
  }

  if (isRecord(value.source)) {
    return getString(value.source.name) || getString(value.source.source_type) || "gmail";
  }

  return "";
}

function getSubject(value: Record<string, unknown>) {
  const flatSubject = getString(value.subject);

  if (flatSubject) {
    return flatSubject;
  }

  if (isRecord(value.source)) {
    return getString(value.source.subject);
  }

  return "";
}

function getScore(value: Record<string, unknown>) {
  if (typeof value.score === "number") {
    return value.score;
  }

  if (isRecord(value.score) && typeof value.score.total === "number") {
    return value.score.total <= 35
      ? Math.round((value.score.total / 35) * 100)
      : value.score.total;
  }

  return Number.NaN;
}

function getRecommendedUse(value: Record<string, unknown>) {
  if (typeof value.recommended_use === "string") {
    return value.recommended_use;
  }

  if (Array.isArray(value.recommended_use)) {
    return value.recommended_use.filter((item) => typeof item === "string").join(", ");
  }

  return "";
}

function validateDraft(value: unknown) {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return {
      errors: ["root must be an object"],
      record: null,
    };
  }

  const score = getScore(value);
  const record: DraftRecord = {
    id: getString(value.id),
    sourceName: getSourceName(value),
    subject: getSubject(value),
    category: getString(value.category),
    productIdea: getString(value.product_idea),
    buyer: getString(value.buyer),
    pain: getString(value.pain),
    score,
    evidenceLevel: getString(value.evidence_level),
    hypeRisk: getString(value.hype_risk),
    recommendedUse: getRecommendedUse(value),
  };

  if (!record.id) {
    errors.push("missing id");
  }
  if (!record.sourceName) {
    errors.push("missing source");
  }
  if (!record.subject) {
    errors.push("missing subject");
  }
  if (!record.category) {
    errors.push("missing category");
  }
  if (!record.productIdea) {
    errors.push("missing product_idea");
  }
  if (!record.buyer) {
    errors.push("missing buyer");
  }
  if (!record.pain) {
    errors.push("missing pain");
  }
  if (!Number.isFinite(record.score)) {
    errors.push("invalid score");
  }
  if (!record.evidenceLevel) {
    errors.push("missing evidence_level");
  }
  if (!record.hypeRisk) {
    errors.push("missing hype_risk");
  }
  if (!record.recommendedUse) {
    errors.push("missing recommended_use");
  }

  if (errors.length > 0) {
    return {
      errors,
      record: null,
    };
  }

  return {
    errors,
    record,
  };
}

function getRecommendedAction(record: DraftRecord): ReviewAction {
  if (record.score < 55 || (record.hypeRisk === "high" && record.evidenceLevel === "weak")) {
    return "reject_candidate";
  }

  if (record.score >= 80 && record.hypeRisk !== "high") {
    return "publish_candidate";
  }

  return "review_more";
}

function loadDrafts(): LoadedDraft[] {
  if (!fs.existsSync(draftsDir)) {
    return [];
  }

  return fs
    .readdirSync(draftsDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => {
      try {
        const filePath = path.join(draftsDir, fileName);
        const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
        const validation = validateDraft(parsed);

        if (!validation.record) {
          return {
            errors: validation.errors,
            fileName,
            valid: false,
          };
        }

        return {
          fileName,
          record: validation.record,
          valid: true,
        };
      } catch (error) {
        return {
          errors: [error instanceof Error ? error.message : "invalid JSON"],
          fileName,
          valid: false,
        };
      }
    });
}

function printReviewTable(records: DraftRecord[]) {
  const ranked = records.sort((a, b) => b.score - a.score);

  console.log("\nBilion Signal Inbox Draft Review");
  console.log("=".repeat(34));
  console.table(
    ranked.map((record, index) => ({
      rank: index + 1,
      id: record.id,
      source: record.sourceName,
      subject: record.subject,
      category: record.category,
      product_idea: record.productIdea,
      score: record.score,
      evidence_level: record.evidenceLevel,
      hype_risk: record.hypeRisk,
      recommended_use: record.recommendedUse,
      action: getRecommendedAction(record),
    })),
  );
}

function printInvalidDrafts(invalidDrafts: Extract<LoadedDraft, { valid: false }>[]) {
  if (invalidDrafts.length === 0) {
    return;
  }

  console.log("\nInvalid draft files");
  console.log("=".repeat(19));

  for (const draft of invalidDrafts) {
    console.log(`- ${draft.fileName}: ${draft.errors.join("; ")}`);
  }
}

function reviewDrafts() {
  const loadedDrafts = loadDrafts();
  const validDrafts = loadedDrafts
    .filter((draft): draft is Extract<LoadedDraft, { valid: true }> => draft.valid)
    .map((draft) => draft.record);
  const invalidDrafts = loadedDrafts.filter(
    (draft): draft is Extract<LoadedDraft, { valid: false }> => !draft.valid,
  );

  printReviewTable(validDrafts);
  printInvalidDrafts(invalidDrafts);

  console.log(
    `\nReviewed ${validDrafts.length} valid draft(s). Skipped ${invalidDrafts.length} invalid draft file(s).`,
  );
}

reviewDrafts();
