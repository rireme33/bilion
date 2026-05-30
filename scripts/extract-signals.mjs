import fs from "fs";

const inputDir = "data/raw_pages";
const outputPath = "data/goldmine_signals.json";
const debugPath = "data/openai_debug.json";
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("Missing OPENAI_API_KEY.");
  process.exit(1);
}

const files = fs
  .readdirSync(inputDir)
  .filter((f) => f.endsWith(".json"))
  .slice(0, 20);

function getOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text;

  const parts = [];

  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) {
        parts.push(content.text);
      }
    }
  }

  return parts.join("\n");
}

function extractJson(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in output: " + cleaned.slice(0, 300));
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

async function extractSignal(page) {
  const prompt = `
You are extracting monetizable product opportunities from Indie Hackers founder stories.

Do NOT summarize the article.
Extract only signals useful for deciding what AI/no-code product to build.

Return valid JSON only. No markdown.

Schema:
{
  "title": "",
  "source_url": "",
  "buyer": "",
  "pain": "",
  "bad_workaround": "",
  "product_angle": "",
  "why_money": "",
  "mvp": "",
  "price_signal": "",
  "nocode_prompt": "",
  "codex_prompt": "",
  "validation_48h": "",
  "score": 0
}

Rules:
- buyer must be specific
- pain must be a paid/workflow pain
- product_angle must be buildable as a tiny AI/no-code tool
- mvp must be launchable within 48 hours
- score is 0-100 based on monetization potential
- if weak, score below 50

Source URL:
${page.url}

Title:
${page.title}

Text:
${page.raw_text.slice(0, 9000)}
`;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.2
    })
  });

  const data = await res.json();

  if (!res.ok) {
    fs.writeFileSync(debugPath, JSON.stringify(data, null, 2), "utf8");
    throw new Error(JSON.stringify(data));
  }

  const outputText = getOutputText(data);

  if (!outputText) {
    fs.writeFileSync(debugPath, JSON.stringify(data, null, 2), "utf8");
    throw new Error("No output text. Debug saved to " + debugPath);
  }

  return extractJson(outputText);
}

const results = [];

for (const file of files) {
  const page = JSON.parse(fs.readFileSync(`${inputDir}/${file}`, "utf8"));

  console.log(`Extracting ${file}: ${page.title}`);

  try {
    const signal = await extractSignal(page);
    results.push(signal);
    console.log(`Saved signal score=${signal.score}`);
  } catch (err) {
    console.error(`Failed ${file}`);
    console.error(err.message);
  }

  await new Promise((r) => setTimeout(r, 1000));
}

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");

console.log(`Done. Wrote ${results.length} signals to ${outputPath}`);
