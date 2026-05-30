import fs from "fs";

const inputPath = "data/top100_signals.json";
const outputDir = "data/raw_pages";
const limit = 20;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const signals = JSON.parse(fs.readFileSync(inputPath, "utf8")).slice(0, limit);

function cleanHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

for (let i = 0; i < signals.length; i++) {
  const signal = signals[i];
  const outPath = `${outputDir}/${i + 1}.json`;

  try {
    console.log(`Fetching ${i + 1}/${signals.length}: ${signal.url}`);

    const res = await fetch(signal.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 BilionResearchBot/0.1"
      }
    });

    const html = await res.text();
    const text = cleanHtml(html);

    fs.writeFileSync(
      outPath,
      JSON.stringify(
        {
          ...signal,
          fetched_at: new Date().toISOString(),
          http_status: res.status,
          raw_text: text
        },
        null,
        2
      ),
      "utf8"
    );

    console.log(`Saved: ${outPath} chars=${text.length}`);
    await new Promise((r) => setTimeout(r, 1200));
  } catch (err) {
    console.error(`Failed: ${signal.url}`);
    console.error(err.message);
  }
}
