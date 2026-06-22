import fs from "node:fs";
import path from "node:path";

type ReviewAction = "publish_candidate" | "review_more" | "reject_candidate";

type DraftRecord = {
  id: string;
  source: {
    name: string;
  };
  category: string;
  product_idea: string;
  buyer: string;
  pain: string;
  score: {
    total: number;
  };
  evidence_level: string;
  hype_risk: string;
  recommended_use: string[];
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

function getNestedRecord(value: Record<string, unknown>, key: string) {
  const nested = value[key];
  return isRecord(nested) ? nested : undefined;
}

function validateDraft(value: unknown) {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return {
      errors: ["root must be an object"],
      record: null,
    };
  }

  const source = getNestedRecord(value, "source");
  const score = getNestedRecord(value, "score");

  if (typeof value.id !== "string" || value.id.trim().length === 0) {
    errors.push("missing id");
  }
  if (!source || typeof source.name !== "string" || source.name.trim().length === 0) {
    errors.push("missing source.name");
  }
  if (typeof value.category !== "string" || value.category.trim().length === 0) {
    errors.push("missing category");
  }
  if (typeof value.product_idea !== "string" || value.product_idea.trim().length === 0) {
    errors.push("missing product_idea");
  }
  if (typeof value.buyer !== "string" || value.buyer.trim().length === 0) {
    errors.push("missing buyer");
  }
  if (typeof value.pain !== "string" || value.pain.trim().length === 0) {
    errors.push("missing pain");
  }
  if (!score || typeof score.total !== "number") {
    errors.push("missing score.total");
  }
  if (
    typeof value.evidence_level !== "string" ||
    value.evidence_level.trim().length === 0
  ) {
    errors.push("missing evidence_level");
  }
  if (typeof value.hype_risk !== "string" || value.hype_risk.trim().length === 0) {
    errors.push("missing hype_risk");
  }
  if (
    !Array.isArray(value.recommended_use) ||
    !value.recommended_use.every((item) => typeof item === "string")
  ) {
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
    record: value as DraftRecord,
  };
}

function getRecommendedAction(record: DraftRecord): ReviewAction {
  if (
    record.score.total < 29 ||
    (record.hype_risk === "high" && record.evidence_level === "weak")
  ) {
    return "reject_candidate";
  }

  if (
    record.score.total >= 32 &&
    (record.hype_risk === "low" || record.hype_risk === "medium")
  ) {
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
  const ranked = records.sort((a, b) => b.score.total - a.score.total);

  console.log("\nBilion Signal Inbox Draft Review");
  console.log("=".repeat(34));
  console.table(
    ranked.map((record, index) => ({
      rank: index + 1,
      id: record.id,
      source: record.source.name,
      category: record.category,
      product_idea: record.product_idea,
      total: record.score.total,
      evidence_level: record.evidence_level,
      hype_risk: record.hype_risk,
      recommended_use: record.recommended_use.join(", "),
      action: getRecommendedAction(record),
    })),
  );
}

function printInvalidDrafts(invalidDrafts: Extract<LoadedDraft, { valid: false }>[]) {
  if (invalidDrafts.length === 0) {
    return;
  }

  console.log("\nInvalid or legacy draft files");
  console.log("=".repeat(29));

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
    `\nReviewed ${validDrafts.length} valid draft(s). Skipped ${invalidDrafts.length} invalid/legacy draft file(s).`,
  );
}

reviewDrafts();
