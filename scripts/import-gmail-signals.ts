import fs from "node:fs";
import path from "node:path";

type SignalStatus = "draft" | "rejected" | "published";

type RouteSummary = {
  draft: number;
  rejected: number;
  published: number;
};

const defaultInputPath = path.join(process.cwd(), "scripts", "sample-gmail-signals.json");
const maxBatchSize = 20;
const outputDirs: Record<SignalStatus, string> = {
  draft: path.join(process.cwd(), "data", "signal-inbox", "drafts"),
  rejected: path.join(process.cwd(), "data", "signal-inbox", "rejected"),
  published: path.join(process.cwd(), "data", "signal-inbox", "published"),
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getInputPath() {
  const inputArg = process.argv[2];

  if (!inputArg) {
    return defaultInputPath;
  }

  return path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg);
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getSubject(signal: Record<string, unknown>) {
  const flatSubject = getString(signal.subject);

  if (flatSubject) {
    return flatSubject;
  }

  if (isRecord(signal.source)) {
    return getString(signal.source.subject);
  }

  return "";
}

function getScore(signal: Record<string, unknown>) {
  if (typeof signal.score === "number") {
    return signal.score;
  }

  if (isRecord(signal.score) && typeof signal.score.total === "number") {
    return signal.score.total <= 35
      ? Math.round((signal.score.total / 35) * 100)
      : signal.score.total;
  }

  return Number.NaN;
}

function getStatus(value: unknown): SignalStatus | undefined {
  if (value === "draft" || value === "rejected" || value === "published") {
    return value;
  }

  return undefined;
}

function getRouteStatus(score: number): SignalStatus {
  if (score >= 80) {
    return "published";
  }

  if (score >= 55) {
    return "draft";
  }

  return "rejected";
}

function getSafeId(value: unknown) {
  const id = getString(value);

  if (!id) {
    return "";
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return "";
  }

  return id;
}

function ensureOutputDirs() {
  for (const dir of Object.values(outputDirs)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getExistingIds() {
  const existingIds = new Map<string, string>();

  for (const [status, dir] of Object.entries(outputDirs)) {
    if (!fs.existsSync(dir)) {
      continue;
    }

    for (const fileName of fs.readdirSync(dir)) {
      if (!fileName.endsWith(".json")) {
        continue;
      }

      existingIds.set(path.basename(fileName, ".json"), status);
    }
  }

  return existingIds;
}

function readSignals(inputPath: string) {
  const parsed = JSON.parse(fs.readFileSync(inputPath, "utf8")) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error(`${path.relative(process.cwd(), inputPath)} must contain a JSON array.`);
  }

  if (parsed.length > maxBatchSize) {
    throw new Error(`Batch files can contain up to ${maxBatchSize} records. Found ${parsed.length}.`);
  }

  return parsed;
}

function validateSignal(
  signal: unknown,
  index: number,
  batchIds: Set<string>,
  existingIds: Map<string, string>,
) {
  const errors: string[] = [];

  if (!isRecord(signal)) {
    return {
      errors: [`record ${index + 1}: must be an object`],
      record: null,
    };
  }

  const id = getSafeId(signal.id);
  const status = getStatus(signal.status);
  const score = getScore(signal);

  if (!id) {
    errors.push("missing id");
  } else {
    if (batchIds.has(id)) {
      errors.push(`duplicate id in batch: ${id}`);
    }
    if (existingIds.has(id)) {
      errors.push(`duplicate id already exists in ${existingIds.get(id)}: ${id}`);
    }
  }

  if (!status) {
    errors.push("invalid status");
  }
  if (!getSubject(signal)) {
    errors.push("missing subject");
  }
  if (!getString(signal.raw_signal)) {
    errors.push("missing raw_signal");
  }
  if (!getString(signal.buyer)) {
    errors.push("missing buyer");
  }
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    errors.push("invalid score");
  }

  if (id) {
    batchIds.add(id);
  }

  if (errors.length > 0) {
    return {
      errors: [`record ${index + 1}: ${errors.join("; ")}`],
      record: null,
    };
  }

  const routeStatus = getRouteStatus(score);

  return {
    errors,
    record: {
      id,
      routeStatus,
      signal: {
        ...signal,
        status: routeStatus,
      },
    },
  };
}

function importSignals() {
  ensureOutputDirs();

  const inputPath = getInputPath();
  const signals = readSignals(inputPath);
  const existingIds = getExistingIds();
  const batchIds = new Set<string>();
  const validated = signals.map((signal, index) =>
    validateSignal(signal, index, batchIds, existingIds),
  );
  const errors = validated.flatMap((result) => result.errors);

  if (errors.length > 0) {
    throw new Error(`Import validation failed:\n- ${errors.join("\n- ")}`);
  }

  const summary: RouteSummary = {
    draft: 0,
    rejected: 0,
    published: 0,
  };

  for (const result of validated) {
    if (!result.record) {
      continue;
    }

    const outputPath = path.join(
      outputDirs[result.record.routeStatus],
      `${result.record.id}.json`,
    );

    fs.writeFileSync(outputPath, `${JSON.stringify(result.record.signal, null, 2)}\n`, "utf8");
    summary[result.record.routeStatus] += 1;
  }

  console.log(`Imported ${signals.length} Gmail/newsletter signal record(s).`);
  console.log(`Input: ${path.relative(process.cwd(), inputPath)}`);
  console.log(`Published: ${summary.published}`);
  console.log(`Drafts: ${summary.draft}`);
  console.log(`Rejected: ${summary.rejected}`);
  console.log(`Published dir: ${outputDirs.published}`);
  console.log(`Drafts dir: ${outputDirs.draft}`);
  console.log(`Rejected dir: ${outputDirs.rejected}`);
}

try {
  importSignals();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
