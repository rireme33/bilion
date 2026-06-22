import fs from "node:fs";
import path from "node:path";

type RecordShape =
  | "empty_file"
  | "malformed_json"
  | "flat_success_record"
  | "nested_starter_story_with_bilionRecordJson"
  | "unknown_shape";

type FolderAudit = {
  dir: string;
  exists: boolean;
  files: FileAudit[];
  label: string;
};

type FileAudit = {
  fileName: string;
  shape: RecordShape;
  sourceUrl?: string;
  error?: string;
};

const folders = [
  {
    dir: path.join(process.cwd(), "data", "success-records", "imports"),
    label: "imports",
  },
  {
    dir: path.join(process.cwd(), "data", "success-records", "drafts"),
    label: "drafts",
  },
  {
    dir: path.join(process.cwd(), "data", "success-records", "published"),
    label: "published",
  },
];

const flatSuccessRecordFields = [
  "businessName",
  "sourceUrl",
  "revenueSignal",
  "buyer",
  "pain",
  "offer",
  "whyItWorked",
  "starterProduct",
  "buildPrompt",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getNestedRecord(
  value: Record<string, unknown>,
  key: string,
): Record<string, unknown> | undefined {
  const nested = value[key];
  return isRecord(nested) ? nested : undefined;
}

function getString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getSourceUrl(value: Record<string, unknown>): string | undefined {
  const source = getNestedRecord(value, "source");
  const bilionRecordJson = getNestedRecord(value, "bilionRecordJson");

  return (
    getString(value.sourceUrl) ??
    getString(source?.url) ??
    getString(bilionRecordJson?.sourceUrl) ??
    getString(bilionRecordJson?.source_url)
  );
}

function isFlatSuccessRecord(value: Record<string, unknown>) {
  return flatSuccessRecordFields.some((field) => getString(value[field]));
}

function classifyRecord(value: unknown): {
  shape: RecordShape;
  sourceUrl?: string;
} {
  if (!isRecord(value)) {
    return { shape: "unknown_shape" };
  }

  const sourceUrl = getSourceUrl(value);

  if (isFlatSuccessRecord(value)) {
    return {
      shape: "flat_success_record",
      sourceUrl,
    };
  }

  if (isRecord(value.bilionRecordJson)) {
    return {
      shape: "nested_starter_story_with_bilionRecordJson",
      sourceUrl,
    };
  }

  return {
    shape: "unknown_shape",
    sourceUrl,
  };
}

function auditFile(dir: string, fileName: string): FileAudit {
  const filePath = path.join(dir, fileName);
  const contents = fs.readFileSync(filePath, "utf8");

  if (contents.trim().length === 0) {
    return {
      fileName,
      shape: "empty_file",
    };
  }

  try {
    const parsed = JSON.parse(contents) as unknown;
    const classification = classifyRecord(parsed);

    return {
      fileName,
      shape: classification.shape,
      sourceUrl: classification.sourceUrl,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "invalid JSON",
      fileName,
      shape: "malformed_json",
    };
  }
}

function auditFolder(folder: (typeof folders)[number]): FolderAudit {
  if (!fs.existsSync(folder.dir)) {
    return {
      dir: folder.dir,
      exists: false,
      files: [],
      label: folder.label,
    };
  }

  const files = fs
    .readdirSync(folder.dir)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => auditFile(folder.dir, fileName));

  return {
    dir: folder.dir,
    exists: true,
    files,
    label: folder.label,
  };
}

function countShape(files: FileAudit[], shape: RecordShape) {
  return files.filter((file) => file.shape === shape).length;
}

function getDuplicateSourceUrls(audits: FolderAudit[]) {
  const urls = new Map<string, string[]>();

  for (const audit of audits) {
    for (const file of audit.files) {
      if (!file.sourceUrl) {
        continue;
      }

      const key = file.sourceUrl;
      const sourceFiles = urls.get(key) ?? [];
      sourceFiles.push(`${audit.label}/${file.fileName}`);
      urls.set(key, sourceFiles);
    }
  }

  return [...urls.entries()]
    .filter(([, sourceFiles]) => sourceFiles.length > 1)
    .sort(([a], [b]) => a.localeCompare(b));
}

function printFolderSummary(audit: FolderAudit) {
  console.log(`\n${audit.label}`);
  console.log("-".repeat(audit.label.length));

  if (!audit.exists) {
    console.log("folder: missing");
    return;
  }

  console.log(`folder: ${audit.dir}`);
  console.log(`total JSON files: ${audit.files.length}`);
  console.log(
    `valid JSON: ${
      audit.files.length -
      countShape(audit.files, "empty_file") -
      countShape(audit.files, "malformed_json")
    }`,
  );
  console.log(`empty files: ${countShape(audit.files, "empty_file")}`);
  console.log(`malformed JSON: ${countShape(audit.files, "malformed_json")}`);
  console.log(
    `flat compatible: ${countShape(audit.files, "flat_success_record")}`,
  );
  console.log(
    `nested bilionRecordJson: ${countShape(
      audit.files,
      "nested_starter_story_with_bilionRecordJson",
    )}`,
  );
  console.log(`unknown shape: ${countShape(audit.files, "unknown_shape")}`);
}

function printProblemFiles(audits: FolderAudit[]) {
  const problemFiles = audits.flatMap((audit) =>
    audit.files
      .filter(
        (file) =>
          file.shape === "empty_file" ||
          file.shape === "malformed_json" ||
          file.shape === "unknown_shape",
      )
      .map((file) => ({
        folder: audit.label,
        ...file,
      })),
  );

  if (problemFiles.length === 0) {
    return;
  }

  console.log("\nFiles needing review");
  console.log("--------------------");
  for (const file of problemFiles) {
    const error = file.error ? ` (${file.error})` : "";
    console.log(`- ${file.folder}/${file.fileName}: ${file.shape}${error}`);
  }
}

function printDuplicateSourceUrls(duplicates: [string, string[]][]) {
  console.log("\nDuplicate source URL candidates");
  console.log("-------------------------------");

  if (duplicates.length === 0) {
    console.log("None found.");
    return;
  }

  for (const [sourceUrl, sourceFiles] of duplicates) {
    console.log(`- ${sourceUrl}`);
    console.log(`  files: ${sourceFiles.join(", ")}`);
  }
}

function printRecommendedCleanupActions(
  audits: FolderAudit[],
  duplicates: [string, string[]][],
) {
  const hasEmptyFiles = audits.some((audit) => countShape(audit.files, "empty_file") > 0);
  const hasMalformedJson = audits.some(
    (audit) => countShape(audit.files, "malformed_json") > 0,
  );
  const hasNestedRecords = audits.some(
    (audit) =>
      countShape(audit.files, "nested_starter_story_with_bilionRecordJson") > 0,
  );
  const hasPublishedFolder = audits.some(
    (audit) => audit.label === "published" && audit.exists,
  );

  console.log("\nRecommended cleanup actions");
  console.log("---------------------------");

  if (hasMalformedJson) {
    console.log("- Fix malformed JSON before using records in any app-facing flow.");
  }
  if (hasEmptyFiles) {
    console.log("- Review empty placeholder files and decide whether to keep, fill, or remove later.");
  }
  if (duplicates.length > 0) {
    console.log("- Review duplicate source URL candidates before publishing records.");
  }
  if (hasNestedRecords) {
    console.log(
      "- Add an explicit review/publish step that converts nested Starter Stories into flat SuccessRecords.",
    );
  }
  if (!hasPublishedFolder) {
    console.log(
      "- Create data/success-records/published/ later when the published Starter Story flow is ready.",
    );
  }
  console.log("- Keep this audit read-only until the success-record publishing rules are finalized.");
}

function auditSuccessRecords() {
  const audits = folders.map(auditFolder);
  const duplicates = getDuplicateSourceUrls(audits);

  console.log("\nBilion Success Records Audit");
  console.log("============================");

  for (const audit of audits) {
    printFolderSummary(audit);
  }

  printDuplicateSourceUrls(duplicates);
  printProblemFiles(audits);
  printRecommendedCleanupActions(audits, duplicates);
}

auditSuccessRecords();
