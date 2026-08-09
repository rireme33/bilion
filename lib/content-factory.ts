import type { ContentStudioRecord } from "@/lib/content-studio";

export type ContentFactoryPack = {
  brainProductOutline: string;
  codexBuildPrompt: string;
  cta: string;
  dm: string;
  hashtags: string[];
  imagePrompt: string;
  noteArticle: string;
  recordId: string;
  sourceTitle: string;
  substackArticle: string;
  titleIdeas: string[];
  xCarousel: string[];
  xPost: string;
};

const fallbackText = "Not extracted yet";

function cleanText(value: string, fallback: string) {
  const trimmed = value.replace(/\s+/g, " ").trim();

  return trimmed.length > 0 && trimmed !== fallbackText ? trimmed : fallback;
}

function compact(value: string, maxLength: number) {
  const cleanValue = value.replace(/\s+/g, " ").trim();

  if (cleanValue.length <= maxLength) {
    return cleanValue;
  }

  const words = cleanValue.split(" ");
  let result = "";

  for (const word of words) {
    const candidate = result ? `${result} ${word}` : word;

    if (candidate.length > maxLength) {
      break;
    }

    result = candidate;
  }

  return result || cleanValue.slice(0, maxLength).trim();
}

function getTinyProductName(firstOffer: string, buyer: string, pain: string) {
  const offer = cleanText(firstOffer, "");

  if (offer && offer.length <= 72) {
    return offer;
  }

  const buyerLabel = compact(buyer, 36);
  const painLabel = compact(pain, 46);

  return `$9 ${buyerLabel} ${painLabel} checklist`;
}

function getHashtagSource(value: string) {
  return value
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4)
    .slice(0, 3);
}

function dedupe<T>(items: T[]) {
  return Array.from(new Set(items));
}

export function buildContentFactoryPack(record: ContentStudioRecord): ContentFactoryPack {
  const sourceTitle = cleanText(record.title, "Untitled signal");
  const buyer = cleanText(record.buyer, "solo builders");
  const pain = cleanText(record.pain, "they can build, but they are not sure what someone will pay for");
  const whyNow = cleanText(record.whyNow, "there is a fresh market signal worth testing");
  const productIdea = cleanText(record.productIdea, "a small AI workflow product");
  const firstOffer = cleanText(record.firstProduct, "a small paid checklist or template");
  const price = cleanText(record.price, "$9 to $29");
  const distribution = cleanText(record.distribution, "X, DMs, niche communities, and founder groups");
  const proof = cleanText(record.proof, whyNow);
  const leadMagnet = cleanText(record.leadMagnetAngle, "a free example output");
  const contentAngle = cleanText(record.contentAngle, proof);
  const codexHint = cleanText(record.codexPromptHint, productIdea);
  const tinyProduct = getTinyProductName(firstOffer, buyer, pain);
  const shortBuyer = compact(buyer, 72);
  const shortPain = compact(pain, 110);
  const shortProduct = compact(productIdea, 92);
  const shortProof = compact(proof, 130);
  const cta = `Want the full buyer, pain, offer, DM, and build prompt? I am pulling these from Bilion and testing the small versions first.`;
  const titleIdeas = [
    `${shortBuyer}: the small AI offer hiding in ${compact(sourceTitle, 54)}`,
    `I would test this before building the full app`,
    `A $9 offer idea from one money signal`,
    `Build only after replies: ${compact(shortProduct, 56)}`,
    `A practical AI product angle for ${compact(shortBuyer, 48)}`,
  ];
  const xPost = [
    "I would not build the full app first.",
    "",
    `Signal: ${shortProof}`,
    "",
    `Buyer: ${shortBuyer}`,
    `Pain: ${shortPain}`,
    "",
    `Small offer to test: ${tinyProduct}`,
    "",
    "Post it. DM a few likely buyers. Build only after replies.",
    "",
    cta,
  ].join("\n");
  const xCarousel = [
    `1. The signal\n${shortProof}`,
    `2. The buyer\n${shortBuyer}`,
    `3. The paid pain\n${shortPain}`,
    `4. The tiny offer\n${tinyProduct}`,
    `5. The validation move\nPost one sample output, DM 10-20 likely buyers, and ask if they want the paid version.`,
    `6. Build rule\nDo not build the full product yet. Build only after replies.`,
    `7. CTA\n${cta}`,
  ];
  const noteArticle = [
    `# ${titleIdeas[0]}`,
    "",
    "I found a signal worth testing, but I would not turn it into a full product yet.",
    "",
    `The signal: ${proof}`,
    "",
    `The buyer is ${buyer}. The painful part is simple: ${pain}`,
    "",
    "That is enough to test a small offer.",
    "",
    `The first version I would sell is: ${tinyProduct}`,
    "",
    "Not a SaaS. Not a big build. A small paid artifact with one clear output.",
    "",
    "The 48-hour test:",
    "1. Make one sample output.",
    `2. Give away a useful free asset: ${leadMagnet}`,
    "3. Post the sample on X.",
    "4. DM 10-20 likely buyers.",
    "5. Ask if they want the paid version.",
    "6. Build the tool only if people reply.",
    "",
    `If it works, the bigger product can become: ${productIdea}`,
    "",
    cta,
  ].join("\n");
  const substackArticle = [
    `# ${titleIdeas[3]}`,
    "",
    `Source pattern: ${sourceTitle}`,
    "",
    "The useful part of this signal is not the idea itself. It is the buyer-pain-offer path.",
    "",
    `Buyer: ${buyer}`,
    `Pain: ${pain}`,
    `Proof: ${proof}`,
    "",
    "My read:",
    `There is probably a small paid asset here: ${tinyProduct}`,
    `Content angle: ${contentAngle}`,
    "",
    "That should be tested before anyone opens a code editor.",
    "",
    "What I would publish first:",
    `- One sample output from ${shortProduct}`,
    `- One short X post aimed at ${shortBuyer}`,
    "- One DM asking if the buyer wants the paid version",
    "- One simple checkout page if replies come in",
    "",
    "Build only after replies.",
    "",
    `Distribution: ${distribution}`,
    "",
    cta,
  ].join("\n");
  const brainProductOutline = [
    `# ${tinyProduct}`,
    "",
    `Price cue: 770円 / $9 style first offer. Source price signal: ${price}`,
    "",
    "Who this is for:",
    buyer,
    "",
    "What pain it solves:",
    pain,
    "",
    "What is included:",
    "1. Source signal breakdown",
    "2. Buyer and paid pain",
    "3. First small offer",
    "4. X post",
    "5. DM script",
    "6. 48-hour validation plan",
    "7. Codex MVP prompt",
    "8. Example output format",
    "",
    "Important:",
    "This is not a revenue promise. It is a small validation asset. Use it before building the full product.",
  ].join("\n");
  const imagePrompt = [
    `Create a clean dark SaaS-style carousel image for an AI business signal.`,
    `Main title: ${titleIdeas[2]}`,
    `Show: signal, buyer, paid pain, tiny offer, and build-after-replies validation steps.`,
    `Buyer: ${buyer}`,
    `Pain: ${pain}`,
    `Offer: ${tinyProduct}`,
    `Style: practical operator dashboard, sharp typography, no hype, no mascots, no fake revenue claims.`,
  ].join("\n");
  const codexBuildPrompt = [
    `Build a small local-only web tool for this validated idea.`,
    "",
    `Source title: ${sourceTitle}`,
    `Buyer: ${buyer}`,
    `Paid pain: ${pain}`,
    `First offer: ${tinyProduct}`,
    `Product idea: ${productIdea}`,
    "",
    "Requirements:",
    "- No auth",
    "- No database",
    "- No external API",
    "- Local state only",
    "- Mobile-first",
    "- Copy buttons required",
    "- Result cards required",
    "",
    "Screen:",
    "- Input panel for buyer context, pain, raw notes, tone, and offer price",
    "- Generate button",
    "- Result cards for offer, X post, DM, validation plan, and product outline",
    "- Read-only markdown export textarea",
    "",
    "Tone:",
    "Practical, specific, and not hypey. The user should be able to show one output to a buyer before building more.",
    "",
    "Build only after replies.",
    "",
    `Existing hint:\n${codexHint}`,
  ].join("\n");
  const dm = [
    `Saw a pattern that looks relevant for ${compact(shortBuyer, 64)}.`,
    "",
    `It is about this pain: ${compact(shortPain, 120)}`,
    "",
    `I made a small example for ${tinyProduct}. Want me to send it over?`,
  ].join("\n");
  const hashtags = dedupe([
    "BuildInPublic",
    "AI",
    "IndieHackers",
    ...getHashtagSource(buyer),
    ...getHashtagSource(productIdea),
  ]).map((tag) => `#${tag.replace(/^#/, "")}`);

  return {
    brainProductOutline,
    codexBuildPrompt,
    cta,
    dm,
    hashtags,
    imagePrompt,
    noteArticle,
    recordId: record.id,
    sourceTitle,
    substackArticle,
    titleIdeas,
    xCarousel,
    xPost,
  };
}
