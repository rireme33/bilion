import fs from "node:fs";
import path from "node:path";

type CollisionRename = {
  from: string;
  to: string;
};

type SyncSummary = {
  collisionRenamed: CollisionRename[];
  copied: string[];
  scannedFiles: number;
  skippedEmpty: string[];
  skippedExistingIdentical: string[];
  skippedMalformed: string[];
};

const sourceDir = process.env.STARTER_STORIES_DRAFTS_DIR;
const destinationDir = path.join(
  process.cwd(),
  "data",
  "success-records",
  "staging",
  "starter-stories",
);

function readJsonFiles(dir: string) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function isValidJson(contents: string) {
  try {
    JSON.parse(contents);
    return true;
  } catch {
    return false;
  }
}

function getCollisionSafePath(fileName: string, contents: string) {
  const parsed = path.parse(fileName);
  let copyIndex = 1;

  while (true) {
    const candidateName = `${parsed.name}-copy-${copyIndex}${parsed.ext}`;
    const candidatePath = path.join(destinationDir, candidateName);

    if (!fs.existsSync(candidatePath)) {
      return {
        fileName: candidateName,
        filePath: candidatePath,
      };
    }

    if (fs.readFileSync(candidatePath, "utf8") === contents) {
      return null;
    }

    copyIndex += 1;
  }
}

function syncStarterStories() {
  if (!sourceDir) {
    console.error("Missing STARTER_STORIES_DRAFTS_DIR.");
    console.error(
      "Set STARTER_STORIES_DRAFTS_DIR to the external Starter Stories drafts folder and run this script again.",
    );
    process.exitCode = 1;
    return;
  }

  const resolvedSourceDir = path.resolve(sourceDir);

  if (!fs.existsSync(resolvedSourceDir) || !fs.statSync(resolvedSourceDir).isDirectory()) {
    console.error(`STARTER_STORIES_DRAFTS_DIR is not a folder: ${resolvedSourceDir}`);
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(destinationDir, { recursive: true });

  const summary: SyncSummary = {
    collisionRenamed: [],
    copied: [],
    scannedFiles: 0,
    skippedEmpty: [],
    skippedExistingIdentical: [],
    skippedMalformed: [],
  };
  const jsonFiles = readJsonFiles(resolvedSourceDir);
  summary.scannedFiles = jsonFiles.length;

  for (const fileName of jsonFiles) {
    const sourcePath = path.join(resolvedSourceDir, fileName);
    const contents = fs.readFileSync(sourcePath, "utf8");

    if (contents.trim().length === 0) {
      summary.skippedEmpty.push(fileName);
      continue;
    }

    if (!isValidJson(contents)) {
      summary.skippedMalformed.push(fileName);
      continue;
    }

    const destinationPath = path.join(destinationDir, fileName);

    if (!fs.existsSync(destinationPath)) {
      fs.writeFileSync(destinationPath, contents, "utf8");
      summary.copied.push(fileName);
      continue;
    }

    if (fs.readFileSync(destinationPath, "utf8") === contents) {
      summary.skippedExistingIdentical.push(fileName);
      continue;
    }

    const safeCollisionPath = getCollisionSafePath(fileName, contents);

    if (!safeCollisionPath) {
      summary.skippedExistingIdentical.push(fileName);
      continue;
    }

    fs.writeFileSync(safeCollisionPath.filePath, contents, "utf8");
    summary.collisionRenamed.push({
      from: fileName,
      to: safeCollisionPath.fileName,
    });
  }

  printSummary(resolvedSourceDir, summary);
}

function printList(label: string, values: string[]) {
  console.log(`${label}: ${values.length}`);

  for (const value of values) {
    console.log(`  - ${value}`);
  }
}

function printSummary(resolvedSourceDir: string, summary: SyncSummary) {
  console.log("\nBilion Starter Stories Sync");
  console.log("===========================");
  console.log(`Source folder: ${resolvedSourceDir}`);
  console.log(`Destination folder: ${destinationDir}`);
  console.log(`Scanned JSON files: ${summary.scannedFiles}`);
  printList("Copied files", summary.copied);
  printList("Skipped empty", summary.skippedEmpty);
  printList("Skipped malformed", summary.skippedMalformed);
  printList("Skipped existing identical", summary.skippedExistingIdentical);
  console.log(`Collision-renamed files: ${summary.collisionRenamed.length}`);

  for (const rename of summary.collisionRenamed) {
    console.log(`  - ${rename.from} -> ${rename.to}`);
  }
}

syncStarterStories();
