import fs from "fs";

const inputPath = "data/ih_urls.txt";
const outputPath = "data/raw_signals.json";

const includeKeywords = [
  "revenue",
  "mrr",
  "profitable",
  "customers",
  "sold",
  "launched",
  "grew",
  "growth",
  "saas",
  "tool",
  "automation",
  "manual",
  "frustrated",
  "pain",
  "workflow",
  "agency",
  "template",
  "database",
  "ai",
];

const excludeKeywords = [
  "looking-for-cofounder",
  "roast",
  "what-do-you-think",
  "motivation",
  "general-advice",
];

function scoreUrl(url) {
  const text = url.toLowerCase();

  let score = 0;
  const matched = [];

  for (const keyword of includeKeywords) {
    if (text.includes(keyword)) {
      score += 10;
      matched.push(keyword);
    }
  }

  for (const keyword of excludeKeywords) {
    if (text.includes(keyword)) {
      score -= 20;
    }
  }

  return { score, matched };
}

function titleFromUrl(url) {
  const slug = url.split("/").filter(Boolean).pop() || "";
  return slug
    .replace(/-\w{8,}$/g, "")
    .replace(/-/g, " ")
    .trim();
}

if (!fs.existsSync(inputPath)) {
  console.error(`Missing ${inputPath}`);
  process.exit(1);
}

const urls = fs
  .readFileSync(inputPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const signals = urls
  .map((url) => {
    const { score, matched } = scoreUrl(url);

    return {
      source: "indiehackers",
      url,
      title: titleFromUrl(url),
      status: score > 0 ? "candidate" : "low_signal",
      score,
      matched_keywords: matched,
      raw_text: "",
      buyer: "",
      pain: "",
      bad_workaround: "",
      product_angle: "",
      revenue_signal: "",
      why_money: "",
      mvp: "",
      nocode_prompt: "",
      codex_prompt: "",
      created_at: new Date().toISOString(),
    };
  })
  .sort((a, b) => b.score - a.score);

fs.writeFileSync(outputPath, JSON.stringify(signals, null, 2), "utf8");

console.log(`Read URLs: ${urls.length}`);
console.log(`Wrote signals: ${signals.length}`);
console.log(`Candidates: ${signals.filter((s) => s.status === "candidate").length}`);
console.log(`Output: ${outputPath}`);
