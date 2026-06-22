import fs from "node:fs";
import path from "node:path";

type SignalStatus = "draft" | "rejected" | "published";

const inputPath = path.join(process.cwd(), "scripts", "sample-gmail-signals.json");
const outputDirs: Record<SignalStatus, string> = {
  draft: path.join(process.cwd(), "data", "signal-inbox", "drafts"),
  rejected: path.join(process.cwd(), "data", "signal-inbox", "rejected"),
  published: path.join(process.cwd(), "data", "signal-inbox", "published"),
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getStatus(value: unknown): SignalStatus {
  if (value === "draft" || value === "rejected" || value === "published") {
    return value;
  }

  throw new Error(`Invalid status: ${String(value)}. Expected draft, rejected, or published.`);
}

function getSafeId(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("Each signal must include a non-empty string id.");
  }

  const id = value.trim();

  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error(
      `Invalid id "${id}". Use only letters, numbers, underscores, and hyphens.`,
    );
  }

  return id;
}

function ensureOutputDirs() {
  for (const dir of Object.values(outputDirs)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readSignals() {
  const parsed = JSON.parse(fs.readFileSync(inputPath, "utf8")) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("scripts/sample-gmail-signals.json must contain a JSON array.");
  }

  return parsed;
}

function importSignals() {
  ensureOutputDirs();

  const signals = readSignals();
  let written = 0;

  signals.forEach((signal, index) => {
    if (!isRecord(signal)) {
      throw new Error(`Signal at index ${index} must be an object.`);
    }

    const id = getSafeId(signal.id);
    const status = getStatus(signal.status);
    const outputPath = path.join(outputDirs[status], `${id}.json`);

    fs.writeFileSync(outputPath, `${JSON.stringify(signal, null, 2)}\n`, "utf8");
    written += 1;
  });

  console.log(`Imported ${written} Gmail signal record(s).`);
  console.log(`Drafts: ${outputDirs.draft}`);
  console.log(`Rejected: ${outputDirs.rejected}`);
  console.log(`Published: ${outputDirs.published}`);
}

try {
  importSignals();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
