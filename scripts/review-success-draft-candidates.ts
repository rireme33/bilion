import fs from "node:fs";
import path from "node:path";

type BilionRecordJson = Record<string, unknown>;

type Candidate = {
  fileName: string;
  record: BilionRecordJson;
  reportAngle: string;
  strengthScore: number;
};

type ReviewSummary = {
  candidates: Candidate[];
  skippedEmpty: string[];
  skippedMalformed: string[];
  skippedNoBilionRecordJson: string[];
  totalFilesScanned: number;
};

const draftsDir = path.join(process.cwd(), "data", "success-records", "drafts");

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getString(value: unknown) {
  if (typeof value !== "string") {
    return "Not extracted yet";
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Not extracted yet";
}

function getOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function scoreValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const normalized = value.trim().toLowerCase();
  const parsed = Number(normalized);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  if (normalized.includes("very high")) {
    return 5;
  }
  if (normalized.includes("high")) {
    return 4;
  }
  if (normalized.includes("medium")) {
    return 3;
  }
  if (normalized.includes("low")) {
    return 1;
  }

  return 0;
}

function getStrengthScore(record: BilionRecordJson) {
  const replicationScore = scoreValue(record.replicationScore);
  const aiLeverageScore = scoreValue(record.aiLeverageScore);
  const monetizationClarity = scoreValue(record.monetizationClarity);
  const buildDifficulty = scoreValue(record.buildDifficulty);

  return replicationScore + aiLeverageScore + monetizationClarity - buildDifficulty;
}

function getReportAngle(record: BilionRecordJson) {
  const text = [
    record.businessName,
    record.industry,
    record.buyer,
    record.pain,
    record.offer,
    record.starterProduct,
    record.monetizationPath,
  ]
    .map((value) => getOptionalString(value))
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (text.includes("agency") || text.includes("service")) {
    return "AI agency offers";
  }

  if (
    text.includes("micro") ||
    text.includes("saas") ||
    text.includes("software") ||
    text.includes("subscription")
  ) {
    return "micro SaaS ideas";
  }

  if (
    text.includes("boring") ||
    text.includes("local") ||
    text.includes("operations") ||
    text.includes("workflow")
  ) {
    return "boring SaaS ideas";
  }

  return "founder pattern remakes";
}

function readJsonFiles() {
  if (!fs.existsSync(draftsDir)) {
    return [];
  }

  return fs
    .readdirSync(draftsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function reviewDrafts(): ReviewSummary {
  const fileNames = readJsonFiles();
  const summary: ReviewSummary = {
    candidates: [],
    skippedEmpty: [],
    skippedMalformed: [],
    skippedNoBilionRecordJson: [],
    totalFilesScanned: fileNames.length,
  };

  for (const fileName of fileNames) {
    const filePath = path.join(draftsDir, fileName);
    const contents = fs.readFileSync(filePath, "utf8");

    if (contents.trim().length === 0) {
      summary.skippedEmpty.push(fileName);
      continue;
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(contents) as unknown;
    } catch {
      summary.skippedMalformed.push(fileName);
      continue;
    }

    if (!isRecord(parsed) || !isRecord(parsed.bilionRecordJson)) {
      summary.skippedNoBilionRecordJson.push(fileName);
      continue;
    }

    const record = parsed.bilionRecordJson;

    summary.candidates.push({
      fileName,
      record,
      reportAngle: getReportAngle(record),
      strengthScore: getStrengthScore(record),
    });
  }

  return summary;
}

function printField(label: string, value: unknown) {
  console.log(`  ${label}: ${getString(value)}`);
}

function printScoreFields(record: BilionRecordJson) {
  const scoreFields = [
    "replicationScore",
    "aiLeverageScore",
    "monetizationClarity",
    "buildDifficulty",
  ].filter((field) => record[field] !== undefined);

  if (scoreFields.length === 0) {
    console.log("  scoreFields: Not extracted yet");
    return;
  }

  console.log("  scoreFields:");
  for (const field of scoreFields) {
    console.log(`    ${field}: ${getString(record[field])}`);
  }
}

function printCandidate(candidate: Candidate, index: number) {
  const { record } = candidate;

  console.log(`\n${index + 1}. ${candidate.fileName}`);
  printField("businessName", record.businessName);
  printField("industry", record.industry);
  printField("revenueSignal", record.revenueSignal);
  printField("buyer", record.buyer);
  printField("pain", record.pain);
  printField("offer", record.offer);
  printField("starterProduct", record.starterProduct);
  printField("pricingModel", record.pricingModel);
  printField("growthChannel", record.growthChannel);
  printField("validationPlan48h", record.validationPlan48h);
  printField("monetizationPath", record.monetizationPath);
  printField("sourceUrl", record.sourceUrl);
  printField("recommendedReportAngle", candidate.reportAngle);
  printField("strengthScore", candidate.strengthScore);
  printScoreFields(record);
}

function printTopCandidates(candidates: Candidate[]) {
  const strongest = [...candidates]
    .sort((a, b) => {
      if (b.strengthScore !== a.strengthScore) {
        return b.strengthScore - a.strengthScore;
      }

      return a.fileName.localeCompare(b.fileName);
    })
    .slice(0, 5);

  console.log("\nTop 5 strongest candidates for Bilion Report #002");
  console.log("=================================================");

  if (strongest.length === 0) {
    console.log("No candidates found.");
    return;
  }

  for (const [index, candidate] of strongest.entries()) {
    console.log(
      `${index + 1}. ${candidate.fileName} | ${getString(
        candidate.record.businessName,
      )} | ${candidate.reportAngle} | score ${candidate.strengthScore}`,
    );
  }
}

function printAngleSummary(candidates: Candidate[]) {
  const counts = new Map<string, number>();

  for (const candidate of candidates) {
    counts.set(candidate.reportAngle, (counts.get(candidate.reportAngle) ?? 0) + 1);
  }

  console.log("\nRecommended report angles");
  console.log("=========================");

  if (counts.size === 0) {
    console.log("No report angles available.");
    return;
  }

  for (const [angle, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`- ${angle}: ${count}`);
  }
}

function printSummary(summary: ReviewSummary) {
  console.log("\nBilion Success Draft Candidate Review");
  console.log("=====================================");
  console.log(`Drafts folder: ${draftsDir}`);
  console.log(`Total files scanned: ${summary.totalFilesScanned}`);
  console.log(`Valid candidate count: ${summary.candidates.length}`);
  console.log(`Skipped empty count: ${summary.skippedEmpty.length}`);
  console.log(`Skipped malformed count: ${summary.skippedMalformed.length}`);
  console.log(
    `Skipped no bilionRecordJson count: ${summary.skippedNoBilionRecordJson.length}`,
  );

  if (summary.skippedMalformed.length > 0) {
    console.log(`Malformed files: ${summary.skippedMalformed.join(", ")}`);
  }

  if (summary.skippedNoBilionRecordJson.length > 0) {
    console.log(
      `No bilionRecordJson files: ${summary.skippedNoBilionRecordJson.join(", ")}`,
    );
  }

  console.log("\nCandidate list");
  console.log("==============");

  for (const [index, candidate] of summary.candidates.entries()) {
    printCandidate(candidate, index);
  }

  printTopCandidates(summary.candidates);
  printAngleSummary(summary.candidates);
}

printSummary(reviewDrafts());
