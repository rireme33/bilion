"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContentStudioRecord } from "@/lib/content-studio";

type OfferInput = {
  buyer: string;
  deliverables: string;
  marketSignal: string;
  pain: string;
  price: string;
  productIdea: string;
};

type OfferOutput = {
  bilionMonthlyUpsell: string;
  cta: string;
  dmOpener: string;
  freeLeadMagnetIdea: string;
  gumroadDescription: string;
  gumroadTitle: string;
  lemonSqueezyDescription: string;
  lemonSqueezyTitle: string;
  nineDollarProductIdea: string;
  ninetyNineDollarProductIdea: string;
  oneLineOffer: string;
  redditGiveawayPost: string;
  shortHook: string;
  tiktokScript: string;
  xPost: string;
};

type OfferCard = {
  id: string;
  input: OfferInput;
  output: OfferOutput;
  sourceTitle: string;
};

type OfferScore = {
  clarity: number;
  desire: number;
  improvementNote: string;
  likelihoodToBuy: number;
  specificity: number;
  urgency: number;
};

type MoneyStack = {
  emailSubjectLines: string[];
  funnelCopy: {
    bilionMonthlyUpsell: string;
    freeLeadMagnetCta: string;
    nineDollarUpsell: string;
    ninetyNineDollarUpsell: string;
  };
  gumroadDescriptions: string[];
  gumroadTitles: string[];
  leadMagnetCtas: string[];
  leadMagnetNames: string[];
  offerAngles: Record<string, string>;
  redditPostTitles: string[];
  score: OfferScore;
  shortPromises: string[];
  tiktokHooks: string[];
  xHooks: string[];
  nineDollarProductNames: string[];
  ninetyNineDollarProductNames: string[];
};

type GrandSlamOffer = {
  bonuses: string[];
  corePromise: string;
  ctaVariants: string[];
  deliverables: string[];
  dreamOutcome: string;
  finalSalesBlock: string;
  guarantees: string[];
  mainOffer: string;
  painRemoved: string;
  premiumOffer: string;
  priceAnchor: string;
  reasonWhy: string;
  riskReversal: string;
  scarcityUrgency: string[];
};

type OfferStatus = "Draft" | "Testing" | "Live" | "Winner" | "Archived";

type OfferLibraryItem = {
  bilionMonthlyUpsell: string;
  buyer: string;
  createdDate: string;
  favorite: boolean;
  grandSlamOffer: GrandSlamOffer;
  id: string;
  lastUpdated: string;
  leadMagnet: string;
  marketSignal: string;
  nineDollarProduct: string;
  ninetyNineDollarProduct: string;
  offerScore: OfferScore;
  pain: string;
  status: OfferStatus;
  tags: string[];
  title: string;
};

type OfferSort = "newest" | "highest-score";

const offerLibraryStorageKey = "bilion.operator.offerLibrary.v1";

const offerStatuses: OfferStatus[] = [
  "Draft",
  "Testing",
  "Live",
  "Winner",
  "Archived",
];

const fieldLabels: Record<keyof OfferInput, string> = {
  buyer: "Buyer",
  deliverables: "Deliverables",
  marketSignal: "Market signal",
  pain: "Pain",
  price: "Price",
  productIdea: "Product idea",
};

const offerAngleLabels = {
  beginner: "beginner angle",
  contrarian: "contrarian angle",
  fear: "fear angle",
  mistake: "mistake angle",
  money: "money angle",
  pain: "pain angle",
  proof: "proof angle",
  speed: "speed angle",
  status: "status angle",
  time: "time angle",
};

const outputLabels: Record<keyof OfferOutput, string> = {
  bilionMonthlyUpsell: "Bilion Monthly upsell",
  cta: "CTA",
  dmOpener: "DM opener",
  freeLeadMagnetIdea: "Free lead magnet idea",
  gumroadDescription: "Gumroad short description",
  gumroadTitle: "Gumroad title",
  lemonSqueezyDescription: "Lemon Squeezy description",
  lemonSqueezyTitle: "Lemon Squeezy title",
  nineDollarProductIdea: "$9 product idea",
  ninetyNineDollarProductIdea: "$99 product idea",
  oneLineOffer: "One-line offer",
  redditGiveawayPost: "Reddit giveaway post",
  shortHook: "Short hook",
  tiktokScript: "TikTok text script",
  xPost: "X post",
};

function cleanText(value: string, fallback: string) {
  const trimmed = value.replace(/\s+/g, " ").trim();

  return trimmed.length > 0 && trimmed !== "Not extracted yet" ? trimmed : fallback;
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

function getTimeframe(index: number) {
  return [
    "this week",
    "in 48 hours",
    "before you build",
    "today",
    "by the end of the week",
  ][index % 5];
}

function getTradeoff(index: number) {
  return [
    "wasting months on random apps",
    "guessing what people want",
    "building a product nobody asked for",
    "writing a huge launch plan",
    "starting from a blank page",
  ][index % 5];
}

function scoreSpecificity(value: string) {
  let score = 5;

  if (value.length > 70) {
    score += 2;
  }

  if (/\d|\$|week|day|hour|month|founder|builder|owner|operator/i.test(value)) {
    score += 2;
  }

  if (/people|users|everyone|businesses/i.test(value)) {
    score -= 1;
  }

  return Math.max(1, Math.min(10, score));
}

function mapRecordToInput(record: ContentStudioRecord): OfferInput {
  return {
    buyer: cleanText(record.buyer, "AI builders"),
    deliverables: cleanText(
      record.firstProduct || record.leadMagnetAngle,
      "a Build/Sell/Post launch stack",
    ),
    marketSignal: cleanText(record.proof || record.whyNow, "a real money signal"),
    pain: cleanText(record.pain, "they do not know what to build next"),
    price: cleanText(record.price, "$9 Launch Stack"),
    productIdea: cleanText(record.productIdea, "a paid-demand business direction"),
  };
}

function buildOfferOutput(input: OfferInput, index: number): OfferOutput {
  const buyer = compact(input.buyer, 86);
  const pain = compact(input.pain, 110);
  const result = compact(input.productIdea, 86);
  const deliverables = compact(input.deliverables, 100);
  const marketSignal = compact(input.marketSignal, 120);
  const price = compact(input.price, 55);
  const timeframe = getTimeframe(index);
  const tradeoff = getTradeoff(index);
  const oneLineOffer = `For ${buyer} who ${pain}, get ${result} ${timeframe} without ${tradeoff}.`;
  const freeLeadMagnetIdea = `${compact(result, 58)} Signal Teardown`;
  const nineDollarProductIdea = `$9 ${compact(result, 48)} Launch Stack`;
  const ninetyNineDollarProductIdea = `$99 ${compact(result, 44)} Vault`;
  const shortHook = [
    "Stop guessing what to build.",
    "Turn one money signal into a sellable offer.",
    "Find the paid pain before you build.",
    "One signal. One buyer. One tiny offer.",
    "Build less. Test the money move first.",
  ][index % 5];
  const cta = [
    "Generated by Bilion.",
    "Get the full Build/Sell/Post pack inside Bilion.",
    "Find your next AI business signal with Bilion.",
    "Get the full Codex prompt inside Bilion.",
  ][index % 4];

  return {
    bilionMonthlyUpsell: `Want the full Build/Sell/Post path, Codex prompt, validation plan, DM script, pricing ladder, risks, and similar patterns? Get Bilion Monthly.`,
    cta,
    dmOpener: `Saw a money signal for ${buyer}: ${pain}. I made a free ${freeLeadMagnetIdea}. Want it?`,
    freeLeadMagnetIdea,
    gumroadDescription: `A fast, practical stack for ${buyer} who want ${result} without ${tradeoff}. Includes ${deliverables}, the free signal teardown, $9 launch stack, $99 vault angle, X post, DM opener, and sales copy.`,
    gumroadTitle: nineDollarProductIdea,
    lemonSqueezyDescription: `Turn one real market signal into a small offer you can test this week. Built for ${buyer} who want ${result} without starting from a blank page. Price signal: ${price}.`,
    lemonSqueezyTitle: `${compact(result, 44)} Offer Pack`,
    nineDollarProductIdea,
    ninetyNineDollarProductIdea,
    oneLineOffer,
    redditGiveawayPost: [
      `I am giving away a free ${freeLeadMagnetIdea} for ${buyer}.`,
      "",
      `It is built around this signal: ${marketSignal}`,
      "",
      `Useful if you are dealing with this pain: ${pain}`,
      "",
      `If you want the paid version, the next step is ${nineDollarProductIdea}.`,
      "",
      "Comment and I will send the free teardown.",
    ].join("\n"),
    shortHook,
    tiktokScript: [
      shortHook,
      "",
      `If you are ${buyer}, the pain is simple: ${pain}.`,
      "",
      `I would test ${nineDollarProductIdea} before building the full product.`,
    ].join("\n"),
    xPost: [
      shortHook,
      "",
      oneLineOffer,
      "",
      `Free: ${freeLeadMagnetIdea}`,
      `Paid test: ${nineDollarProductIdea}`,
      `Vault angle: ${ninetyNineDollarProductIdea}`,
      "",
      cta,
    ].join("\n"),
  };
}

function buildMoneyStack(input: OfferInput): MoneyStack {
  const buyer = compact(input.buyer, 86);
  const pain = compact(input.pain, 112);
  const result = compact(input.productIdea, 74);
  const signal = compact(input.marketSignal, 108);
  const deliverables = compact(input.deliverables, 86);
  const price = compact(input.price, 50);
  const score = {
    clarity: scoreSpecificity(`${buyer} ${result}`),
    desire: scoreSpecificity(`${pain} ${result}`),
    specificity: scoreSpecificity(`${buyer} ${pain}`),
    urgency: scoreSpecificity(`${pain} ${price}`),
    likelihoodToBuy: scoreSpecificity(`${buyer} ${pain} ${price}`),
  };
  const improvementNote =
    score.likelihoodToBuy >= 8
      ? "Strong enough to test. Lead with the paid pain and keep the CTA direct."
      : "Make the buyer narrower, put a number in the outcome, and make the first paid step easier to say yes to.";
  const leadMagnetNames = [
    `${result} Signal Teardown`,
    `${buyer} Money Move Map`,
    `${pain} Fix Checklist`,
    `${result} 48-Hour Test`,
    `${buyer} Offer Finder`,
    `${pain} Swipe File`,
    `${result} Starter Pack`,
    `${buyer} Launch Prompt`,
    `${pain} Demand Audit`,
    `${result} Mini Playbook`,
  ].map((item) => compact(item, 72));
  const shortPromises = [
    `Find one paid-demand angle without guessing what to build.`,
    `Turn ${signal} into a tiny offer you can test this week.`,
    `Spot the buyer, pain, and first paid step in under 10 minutes.`,
    `Get a launch angle before you write code.`,
    `See if ${buyer} care before you build the product.`,
    `Turn one messy signal into a clean offer.`,
    `Find the smallest paid version of ${result}.`,
    `Avoid another random AI app idea.`,
    `Get a buyer-specific offer from a real money move.`,
    `Move from idea noise to one testable offer.`,
  ];
  const leadMagnetCtas = [
    `Get the free teardown.`,
    `Comment and I will send it over.`,
    `Grab the free money move map.`,
    `Want the free checklist?`,
    `Reply "signal" and I will send it.`,
    `Get the free launch prompt.`,
    `Steal the free offer map.`,
    `Use this before you build.`,
    `Send this to a builder who keeps guessing.`,
    `Start with the free version.`,
  ];
  const nineDollarProductNames = [
    `$9 ${result} Launch Stack`,
    `$9 ${buyer} Offer Kit`,
    `$9 ${pain} Fix Pack`,
    `$9 Money Move Starter`,
    `$9 Demand Test Kit`,
    `$9 Launch Angle Pack`,
    `$9 Tiny Offer Builder`,
    `$9 Signal-to-Offer Pack`,
    `$9 Buyer Pain Stack`,
    `$9 Build-Later Test Pack`,
  ].map((item) => compact(item, 76));
  const ninetyNineDollarProductNames = [
    `$99 ${result} Vault`,
    `$99 ${buyer} Money Move Vault`,
    `$99 Paid Pain Vault`,
    `$99 Launch Stack Vault`,
    `$99 Signal-to-Sales Vault`,
    `$99 Buyer Demand Vault`,
    `$99 Tiny Offer Vault`,
    `$99 Build/Sell/Post Vault`,
    `$99 Codex Launch Vault`,
    `$99 Market Signal Vault`,
  ].map((item) => compact(item, 76));
  const gumroadTitles = nineDollarProductNames.map((name) =>
    name.replace("$9 ", ""),
  );
  const gumroadDescriptions = shortPromises.map(
    (promise) => `${promise} Built for ${buyer} who want ${result} without starting from a blank page.`,
  );
  const xHooks = [
    "Stop building random AI apps.",
    "Someone is already paying for this pain.",
    "This boring workflow could become a $9 product.",
    "The offer is clearer than the app.",
    "I would test this before writing code.",
    "A tiny paid product is hiding in this signal.",
    "Most builders skip this because it looks too small.",
    "This is not a startup idea. It is a money move.",
    "Do not build the product yet.",
    "Find the buyer before the features.",
    "This pain is specific enough to sell.",
    "The first version should be a paid file, not software.",
    "One signal can become a whole product ladder.",
    "This is how I would turn a signal into revenue.",
    "Free teardown first. Tiny product second.",
    "If this gets replies, build later.",
    "This is a better starting point than another wrapper.",
    "The fastest path is not more features.",
    "Start with the pain people already pay to remove.",
    "Here is a small offer I would test this week.",
  ];
  const tiktokHooks = [
    "Do not build the app yet.",
    "This is a tiny AI business idea.",
    "Here is the paid pain.",
    "This could be a $9 product.",
    "Start with the buyer.",
    "This is what I would test first.",
    "One signal, one offer.",
    "Stop guessing what to build.",
    "This pain is sellable.",
    "Build after replies.",
    "The product can wait.",
    "Find the money move.",
    "This is a launch stack.",
    "Turn this into a Gumroad product.",
    "A small vault could sell here.",
    "Give away the teardown first.",
    "The CTA matters.",
    "This is not content. It is demand testing.",
    "A free checklist could start this.",
    "This is a weekend test.",
  ];

  return {
    emailSubjectLines: [
      `A tiny offer for ${buyer}`,
      `Stop guessing what to build`,
      `This signal could become a $9 product`,
      `Free teardown: ${result}`,
      `The paid pain hiding in ${signal}`,
      `Before you build another AI app`,
      `A faster way to test ${result}`,
      `New money move for ${buyer}`,
      `This pain is specific enough to sell`,
      `Your next tiny product idea`,
    ].map((item) => compact(item, 72)),
    funnelCopy: {
      bilionMonthlyUpsell: `Want the full Build/Sell/Post pack, Codex prompt, validation plan, DM script, pricing ladder, risks, and similar patterns? Use Bilion Monthly to turn signals into products every week.`,
      freeLeadMagnetCta: `Get the free ${leadMagnetNames[0]}.`,
      nineDollarUpsell: `If the free teardown helps, grab the ${nineDollarProductNames[0]} and test the offer this week.`,
      ninetyNineDollarUpsell: `Want the full library? Get the ${ninetyNineDollarProductNames[0]} with angles, prompts, posts, DMs, and sales copy.`,
    },
    gumroadDescriptions,
    gumroadTitles,
    leadMagnetCtas,
    leadMagnetNames,
    offerAngles: {
      beginner: `If you are new, start with one free teardown, ${deliverables}, and one ${nineDollarProductNames[0]}.`,
      contrarian: `Do not build the product first. Sell the pain map first.`,
      fear: `The risk is not building too small. The risk is building for a buyer who does not care.`,
      mistake: `The mistake is turning ${signal} into features before turning it into an offer.`,
      money: `${buyer} already have a paid pain: ${pain}. Start with ${nineDollarProductNames[0]}.`,
      pain: `${pain} is specific enough to become a tiny paid product.`,
      proof: `The signal: ${signal}. The offer: ${nineDollarProductNames[0]}.`,
      speed: `Turn this into a free teardown today and a $9 product this week.`,
      status: `For builders who want sharper ideas, this turns one signal into a real offer ladder.`,
      time: `Save weeks of guessing by testing this offer before building software.`,
    },
    redditPostTitles: [
      `I made a free teardown for ${buyer}`,
      `Would this $9 product be useful?`,
      `Testing a tiny offer from one AI business signal`,
      `Free checklist for ${pain}`,
      `I turned this signal into a product ladder`,
      `Looking for feedback on a small Gumroad idea`,
      `Giving away a ${leadMagnetNames[0]}`,
      `Is this pain specific enough to sell?`,
      `Would you pay $9 for this launch stack?`,
      `Free money move map for AI builders`,
    ].map((item) => compact(item, 88)),
    score: {
      ...score,
      improvementNote,
    },
    shortPromises,
    tiktokHooks,
    xHooks,
    nineDollarProductNames,
    ninetyNineDollarProductNames,
  };
}

function buildGrandSlamOffer(input: OfferInput): GrandSlamOffer {
  const buyer = compact(input.buyer, 82);
  const pain = compact(input.pain, 112);
  const result = compact(input.productIdea, 78);
  const signal = compact(input.marketSignal, 110);
  const deliverable = compact(input.deliverables, 74);
  const price = compact(input.price, 52);
  const corePromise = `Find one AI business direction you can validate this week.`;
  const dreamOutcome = `${buyer} stop guessing, pick one paid-demand angle, and launch a small offer with a buyer, pain, price, and sales copy already mapped out.`;
  const painRemoved = `Removes the blank-page spiral, random app ideas, vague positioning, slow research, and the fear of building something nobody asked for.`;
  const mainOffer = `$9 ${compact(result, 46)} Launch Stack: a ready-to-test offer pack built from one real market signal, with the buyer, paid pain, tiny offer, posts, DMs, and Gumroad copy included.`;
  const premiumOffer = `$99 ${compact(result, 44)} Vault: the full launch library with multiple offer angles, prompts, validation plans, objection handling, pricing ladders, social posts, and Bilion Monthly upsell copy.`;
  const deliverables = [
    `${buyer} buyer map`,
    `${pain} pain map`,
    `${signal} signal teardown`,
    `${compact(result, 52)} offer angle`,
    `${deliverable} outline`,
    "Gumroad title and short description",
    "Lemon Squeezy title and short description",
    "X post for testing demand",
    "Reddit giveaway post",
    "DM opener",
    "Codex build prompt",
    "48-hour validation plan",
    "Objection handling notes",
    "Pricing ladder",
    "Bilion Monthly upsell copy",
  ].map((item) => compact(item, 92));
  const bonuses = [
    "Buyer-specific hook bank",
    "One-page market signal summary",
    "Tiny offer naming swipe file",
    "Launch checklist for the first 48 hours",
    "Reddit feedback post template",
    "Founder DM follow-up script",
    "Gumroad thumbnail copy prompts",
    "Product Hunt positioning notes",
    "Risk and hype filter",
    "Build-after-replies decision sheet",
  ];
  const guarantees = [
    "If this does not give you at least one testable business direction, ask for a refund.",
    "If you cannot find one offer worth testing, send one message and I will refund you.",
    "Use it for 48 hours. If it does not save you research time, you should not pay for it.",
    "If the pack feels vague, generic, or unusable, I will refund it.",
    "If you still feel stuck after reading it, I do not want your money.",
  ];
  const scarcityUrgency = [
    "Launch price for the first 100 buyers.",
    "Available while I build the public case study library.",
    "Early version pricing before the full vault is expanded.",
    "This signal pack is priced low while the workflow is being battle-tested.",
    "Buy this week if you want the current launch stack before it becomes part of the larger vault.",
  ];
  const reasonWhy = `This is priced at $9 because it is meant to be a fast paid-demand test, not a huge course. The $99 vault is for builders who want the full library instead of rebuilding the same launch assets from scratch.`;
  const priceAnchor = `Instead of spending weeks researching random ideas, get a launch-ready stack for $9 and know what to test next.`;
  const riskReversal = `You are not buying a big promise. You are buying a small, concrete decision: one buyer, one paid pain, one tiny offer, and the copy to test it.`;
  const ctaVariants = [
    "Get the $9 Launch Stack.",
    "Start with the $9 version.",
    "Grab the signal teardown.",
    "Test this offer this week.",
    "Get the launch-ready stack.",
    "Buy the tiny offer pack.",
    "Use this before you build.",
    "Turn the signal into a test.",
    "Get the buyer, pain, and offer.",
    "Unlock the full stack.",
  ];

  return {
    bonuses,
    corePromise,
    ctaVariants,
    deliverables,
    dreamOutcome,
    finalSalesBlock: [
      `Stop guessing what AI product to build next.`,
      "",
      corePromise,
      "",
      `For ${buyer} dealing with ${pain}.`,
      "",
      `You get a complete launch stack built from this signal: ${signal}`,
      "",
      `Inside: ${deliverables.slice(0, 8).join(", ")}.`,
      "",
      `Why now: ${buyer} need paid-demand signals before they waste another week on random features.`,
      "",
      `Price: $9 for the launch stack. $99 for the full vault.`,
      "",
      `CTA: Get the $9 Launch Stack.`,
      "",
      `Want the full Build/Sell/Post system every week? Upgrade to Bilion Monthly for signals, Codex prompts, validation plans, posts, DMs, pricing ladders, and risk checks.`,
    ].join("\n"),
    guarantees,
    mainOffer,
    painRemoved,
    premiumOffer,
    priceAnchor: `${priceAnchor} Current signal price cue: ${price}.`,
    reasonWhy,
    riskReversal,
    scarcityUrgency,
  };
}

function buildOfferCards(records: ContentStudioRecord[]) {
  return records.slice(0, 30).map((record, index) => {
    const input = mapRecordToInput(record);

    return {
      id: record.id,
      input,
      output: buildOfferOutput(input, index),
      sourceTitle: record.title,
    };
  });
}

function buildMarkdown(cards: OfferCard[]) {
  return cards
    .map((card, index) =>
      [
        `## ${index + 1}. ${card.sourceTitle}`,
        "",
        ...Object.entries(card.output).flatMap(([key, value]) => [
          `### ${outputLabels[key as keyof OfferOutput]}`,
          "",
          value,
          "",
        ]),
      ].join("\n"),
    )
    .join("\n---\n\n");
}

function buildGrandSlamMarkdown(offer: GrandSlamOffer) {
  return [
    "# Grand Slam Offer Builder",
    "",
    "## Core Promise",
    offer.corePromise,
    "",
    "## Dream Outcome",
    offer.dreamOutcome,
    "",
    "## Pain Removed",
    offer.painRemoved,
    "",
    "## Main Offer",
    offer.mainOffer,
    "",
    "## Premium Offer",
    offer.premiumOffer,
    "",
    "## Deliverables",
    offer.deliverables.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## Bonuses",
    offer.bonuses.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## Guarantees",
    offer.guarantees.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## Scarcity / Urgency",
    offer.scarcityUrgency
      .map((item, index) => `${index + 1}. ${item}`)
      .join("\n"),
    "",
    "## Reason Why",
    offer.reasonWhy,
    "",
    "## Price Anchor",
    offer.priceAnchor,
    "",
    "## Risk Reversal",
    offer.riskReversal,
    "",
    "## CTA Variants",
    offer.ctaVariants.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## Final Sales Block",
    offer.finalSalesBlock,
  ].join("\n");
}

function getOfferScoreTotal(score: OfferScore) {
  return Math.round(
    (score.clarity +
      score.desire +
      score.likelihoodToBuy +
      score.specificity +
      score.urgency) /
      5,
  );
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function stringifyTags(tags: string[]) {
  return tags.join(", ");
}

function formatDate(value: string) {
  return value.slice(0, 10);
}

function readOfferLibrary() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(offerLibraryStorageKey);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue)
      ? (parsedValue as OfferLibraryItem[])
      : [];
  } catch {
    return [];
  }
}

function writeOfferLibrary(items: OfferLibraryItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(offerLibraryStorageKey, JSON.stringify(items));
}

function createOfferLibraryItem({
  existing,
  grandSlamOffer,
  input,
  moneyStack,
  status,
  tags,
}: {
  existing?: OfferLibraryItem;
  grandSlamOffer: GrandSlamOffer;
  input: OfferInput;
  moneyStack: MoneyStack;
  status: OfferStatus;
  tags: string[];
}): OfferLibraryItem {
  const now = new Date().toISOString();
  const title = compact(
    existing?.title ||
      grandSlamOffer.corePromise ||
      moneyStack.leadMagnetNames[0] ||
      input.productIdea,
    96,
  );

  return {
    bilionMonthlyUpsell: moneyStack.funnelCopy.bilionMonthlyUpsell,
    buyer: input.buyer,
    createdDate: existing?.createdDate || now,
    favorite: existing?.favorite || false,
    grandSlamOffer,
    id: existing?.id || `offer-${Date.now()}`,
    lastUpdated: now,
    leadMagnet: moneyStack.leadMagnetNames[0],
    marketSignal: input.marketSignal,
    nineDollarProduct: moneyStack.nineDollarProductNames[0],
    ninetyNineDollarProduct: moneyStack.ninetyNineDollarProductNames[0],
    offerScore: moneyStack.score,
    pain: input.pain,
    status,
    tags,
    title,
  };
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);

    return true;
  } catch {
    return false;
  }
}

export default function OfferFactoryClient({
  records,
}: {
  records: ContentStudioRecord[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [input, setInput] = useState<OfferInput>(() =>
    mapRecordToInput(records[0]),
  );
  const [cards, setCards] = useState<OfferCard[]>(() => buildOfferCards(records));
  const [copiedKey, setCopiedKey] = useState("");
  const [moneyStack, setMoneyStack] = useState<MoneyStack>(() =>
    buildMoneyStack(mapRecordToInput(records[0])),
  );
  const [grandSlamOffer, setGrandSlamOffer] = useState<GrandSlamOffer>(() =>
    buildGrandSlamOffer(mapRecordToInput(records[0])),
  );
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [offerLibrary, setOfferLibrary] = useState<OfferLibraryItem[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [libraryStatus, setLibraryStatus] = useState<OfferStatus>("Draft");
  const [libraryTags, setLibraryTags] = useState("ai builder, signal");
  const [librarySearch, setLibrarySearch] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "All">("All");
  const [tagFilter, setTagFilter] = useState("");
  const [librarySort, setLibrarySort] = useState<OfferSort>("newest");

  const output = useMemo(() => buildOfferOutput(input, selectedIndex), [
    input,
    selectedIndex,
  ]);
  const markdown = useMemo(() => buildMarkdown(cards), [cards]);
  const selectedOffer = useMemo(
    () => offerLibrary.find((item) => item.id === selectedOfferId),
    [offerLibrary, selectedOfferId],
  );
  const filteredOfferLibrary = useMemo(() => {
    const searchValue = librarySearch.trim().toLowerCase();
    const tagValue = tagFilter.trim().toLowerCase();

    return offerLibrary
      .filter((item) => {
        const matchesSearch =
          !searchValue ||
          [
            item.title,
            item.buyer,
            item.pain,
            item.marketSignal,
            item.leadMagnet,
            item.nineDollarProduct,
            item.ninetyNineDollarProduct,
            item.bilionMonthlyUpsell,
            item.grandSlamOffer.finalSalesBlock,
            item.tags.join(" "),
          ]
            .join(" ")
            .toLowerCase()
            .includes(searchValue);
        const matchesBuyer = buyerFilter === "All" || item.buyer === buyerFilter;
        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;
        const matchesTag =
          !tagValue ||
          item.tags.some((tag) => tag.toLowerCase().includes(tagValue));

        return matchesSearch && matchesBuyer && matchesStatus && matchesTag;
      })
      .sort((firstItem, secondItem) => {
        if (librarySort === "highest-score") {
          return (
            getOfferScoreTotal(secondItem.offerScore) -
            getOfferScoreTotal(firstItem.offerScore)
          );
        }

        return (
          new Date(secondItem.createdDate).getTime() -
          new Date(firstItem.createdDate).getTime()
        );
      });
  }, [buyerFilter, librarySearch, librarySort, offerLibrary, statusFilter, tagFilter]);
  const buyerOptions = useMemo(
    () => Array.from(new Set(offerLibrary.map((item) => item.buyer))).sort(),
    [offerLibrary],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setOfferLibrary(readOfferLibrary());
      setLibraryLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (libraryLoaded) {
      writeOfferLibrary(offerLibrary);
    }
  }, [libraryLoaded, offerLibrary]);

  function handleRecordChange(nextIndex: number) {
    setSelectedIndex(nextIndex);
    setInput(mapRecordToInput(records[nextIndex]));
  }

  function handleGenerateOne() {
    const nextOutput = buildOfferOutput(input, selectedIndex);
    setCards((current) => [
      {
        id: `custom-${Date.now()}`,
        input,
        output: nextOutput,
        sourceTitle: "Custom offer",
      },
      ...current.slice(0, 29),
    ]);
  }

  function handleGenerateThirty() {
    setCards(buildOfferCards(records));
  }

  function handleGenerateMoneyStack() {
    setMoneyStack(buildMoneyStack(input));
  }

  function handleGenerateGrandSlamOffer() {
    setGrandSlamOffer(buildGrandSlamOffer(input));
  }

  function handleSaveOffer() {
    const nextMoneyStack = buildMoneyStack(input);
    const nextGrandSlamOffer = buildGrandSlamOffer(input);
    const nextItem = createOfferLibraryItem({
      grandSlamOffer: nextGrandSlamOffer,
      input,
      moneyStack: nextMoneyStack,
      status: libraryStatus,
      tags: parseTags(libraryTags),
    });

    setMoneyStack(nextMoneyStack);
    setGrandSlamOffer(nextGrandSlamOffer);
    setOfferLibrary((current) => [nextItem, ...current]);
    setSelectedOfferId(nextItem.id);
  }

  function handleUpdateOffer() {
    if (!selectedOffer) {
      handleSaveOffer();

      return;
    }

    const nextMoneyStack = buildMoneyStack(input);
    const nextGrandSlamOffer = buildGrandSlamOffer(input);
    const nextItem = createOfferLibraryItem({
      existing: selectedOffer,
      grandSlamOffer: nextGrandSlamOffer,
      input,
      moneyStack: nextMoneyStack,
      status: libraryStatus,
      tags: parseTags(libraryTags),
    });

    setMoneyStack(nextMoneyStack);
    setGrandSlamOffer(nextGrandSlamOffer);
    setOfferLibrary((current) =>
      current.map((item) => (item.id === selectedOffer.id ? nextItem : item)),
    );
  }

  function handleDuplicateOffer(id?: string) {
    const sourceOffer = id
      ? offerLibrary.find((item) => item.id === id)
      : selectedOffer;

    if (!sourceOffer) {
      handleSaveOffer();

      return;
    }

    const now = new Date().toISOString();
    const duplicateOffer = {
      ...sourceOffer,
      createdDate: now,
      favorite: false,
      id: `offer-${Date.now()}`,
      lastUpdated: now,
      status: "Draft" as OfferStatus,
      title: `${sourceOffer.title} Copy`,
    };

    setOfferLibrary((current) => [duplicateOffer, ...current]);
    setSelectedOfferId(duplicateOffer.id);
  }

  function handleDeleteOffer(id: string) {
    setOfferLibrary((current) => current.filter((item) => item.id !== id));

    if (selectedOfferId === id) {
      setSelectedOfferId("");
    }
  }

  function handleToggleFavorite(id: string) {
    setOfferLibrary((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite: !item.favorite,
              lastUpdated: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  function handleChangeOfferStatus(id: string, status: OfferStatus) {
    setOfferLibrary((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              lastUpdated: new Date().toISOString(),
              status,
            }
          : item,
      ),
    );
  }

  function handleLoadOffer(item: OfferLibraryItem) {
    const loadedInput = {
      buyer: item.buyer,
      deliverables: item.grandSlamOffer.deliverables.join(", "),
      marketSignal: item.marketSignal,
      pain: item.pain,
      price: item.nineDollarProduct,
      productIdea: item.grandSlamOffer.corePromise,
    };

    setSelectedOfferId(item.id);
    setInput(loadedInput);
    setMoneyStack(buildMoneyStack(loadedInput));
    setGrandSlamOffer(item.grandSlamOffer);
    setLibraryStatus(item.status);
    setLibraryTags(stringifyTags(item.tags));
  }

  async function handleCopy(key: string, value: string) {
    const copied = await copyText(value);
    setCopiedKey(copied ? key : "error");
    window.setTimeout(() => setCopiedKey(""), 1400);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="border-b border-white/10 pb-6">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Operator / Internal Offer Factory
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
            Internal offer engine for selling Bilion.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
            Operator-only workspace for turning Bilion signals into free offers,
            $9 products, $99 products, social posts, DMs, Gumroad copy, and
            Bilion Monthly upsells. This is not a user-facing Bilion feature.
            No external API, no auth, no database write.
          </p>
        </section>

        <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1fr_auto]">
          <label className="min-w-0">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
              Source signal
            </span>
            <select
              value={selectedIndex}
              onChange={(event) => handleRecordChange(Number(event.target.value))}
              className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm font-bold text-zinc-100 outline-none"
            >
              {records.slice(0, 60).map((record, index) => (
                <option key={record.id} value={index}>
                  {record.title}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[54rem] lg:grid-cols-5">
            <button
              type="button"
              onClick={handleGenerateOne}
              className="min-h-12 rounded-md bg-white px-4 text-sm font-black text-zinc-950 transition hover:bg-zinc-200"
            >
              Generate Stack
            </button>
            <button
              type="button"
              onClick={handleGenerateThirty}
              className="min-h-12 rounded-md bg-emerald-300 px-4 text-sm font-black text-zinc-950 transition hover:bg-emerald-200"
            >
              Generate 30 Stacks
            </button>
            <button
              type="button"
              onClick={handleGenerateMoneyStack}
              className="min-h-12 rounded-md bg-yellow-300 px-4 text-sm font-black text-zinc-950 transition hover:bg-yellow-200"
            >
              Generate Money Stack
            </button>
            <button
              type="button"
              onClick={handleGenerateGrandSlamOffer}
              className="min-h-12 rounded-md bg-cyan-300 px-4 text-sm font-black text-zinc-950 transition hover:bg-cyan-200"
            >
              Generate Grand Slam
            </button>
            <button
              type="button"
              onClick={() => void handleCopy("all-markdown", markdown)}
              className="min-h-12 rounded-md border border-white/10 px-4 text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
            >
              {copiedKey === "all-markdown" ? "Copied" : "Copy Markdown"}
            </button>
          </div>
        </section>

        {copiedKey === "error" && (
          <div className="rounded-lg border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100">
            Clipboard blocked. Select the text and copy it manually.
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <h2 className="text-lg font-black text-white">Inputs</h2>
            <div className="mt-4 grid gap-3">
              {(Object.keys(fieldLabels) as Array<keyof OfferInput>).map((key) => (
                <label key={key} className="min-w-0">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                    {fieldLabels[key]}
                  </span>
                  <textarea
                    value={input[key]}
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className="mt-2 min-h-16 w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-3 text-sm leading-6 text-zinc-100 outline-none transition focus:border-emerald-300/60"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">Current Stack</h2>
              <button
                type="button"
                onClick={() => void handleCopy("current-offer", buildMarkdown([
                  {
                    id: "current",
                    input,
                    output,
                    sourceTitle: "Current offer",
                  },
                ]))}
                className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
              >
                {copiedKey === "current-offer" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {(Object.keys(outputLabels) as Array<keyof OfferOutput>).map((key) => (
                <OutputBlock key={key} label={outputLabels[key]} value={output[key]} />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-yellow-300/20 bg-yellow-300/[0.04] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">
                Money Stack
              </div>
              <h2 className="mt-2 text-2xl font-black text-white">
                Short offer angles built to get replies, clicks, and sales.
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                void handleCopy(
                  "money-stack",
                  [
                    "# Money Stack",
                    "",
                    ...Object.entries(moneyStack.offerAngles).flatMap(
                      ([key, value]) => [
                        `## ${offerAngleLabels[key as keyof typeof offerAngleLabels]}`,
                        value,
                        "",
                      ],
                    ),
                    "## Lead Magnet Names",
                    moneyStack.leadMagnetNames.join("\n"),
                    "",
                    "## $9 Products",
                    moneyStack.nineDollarProductNames.join("\n"),
                    "",
                    "## $99 Products",
                    moneyStack.ninetyNineDollarProductNames.join("\n"),
                    "",
                    "## X Hooks",
                    moneyStack.xHooks.join("\n"),
                  ].join("\n"),
                )
              }
              className="min-h-10 rounded-md border border-yellow-300/30 px-3 text-xs font-black text-yellow-100 transition hover:bg-yellow-300/10"
            >
              {copiedKey === "money-stack" ? "Copied" : "Copy Money Stack"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <ScoreCard label="Desire" value={moneyStack.score.desire} />
            <ScoreCard label="Urgency" value={moneyStack.score.urgency} />
            <ScoreCard label="Specificity" value={moneyStack.score.specificity} />
            <ScoreCard label="Clarity" value={moneyStack.score.clarity} />
            <ScoreCard
              label="Likelihood to buy"
              value={moneyStack.score.likelihoodToBuy}
            />
          </div>
          <OutputBlock
            label="Short improvement note"
            value={moneyStack.score.improvementNote}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <ListBlock
              items={Object.entries(moneyStack.offerAngles).map(
                ([key, value]) =>
                  `${offerAngleLabels[key as keyof typeof offerAngleLabels]}: ${value}`,
              )}
              title="10 Offer Angles"
            />
            <ListBlock
              items={moneyStack.leadMagnetNames}
              title="10 Free Lead Magnet Names"
            />
            <ListBlock items={moneyStack.shortPromises} title="10 Short Promises" />
            <ListBlock items={moneyStack.leadMagnetCtas} title="10 CTA Lines" />
            <ListBlock
              items={moneyStack.nineDollarProductNames}
              title="10 $9 Product Names"
            />
            <ListBlock
              items={moneyStack.ninetyNineDollarProductNames}
              title="10 $99 Product Names"
            />
            <ListBlock items={moneyStack.gumroadTitles} title="10 Gumroad Titles" />
            <ListBlock
              items={moneyStack.gumroadDescriptions}
              title="10 Gumroad Descriptions"
            />
            <ListBlock items={moneyStack.xHooks} title="20 X Hooks" />
            <ListBlock items={moneyStack.tiktokHooks} title="20 TikTok Text Hooks" />
            <ListBlock
              items={moneyStack.redditPostTitles}
              title="10 Reddit Post Titles"
            />
            <ListBlock
              items={moneyStack.emailSubjectLines}
              title="10 Email Subject Lines"
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <OutputBlock
              label="Free lead magnet CTA"
              value={moneyStack.funnelCopy.freeLeadMagnetCta}
            />
            <OutputBlock
              label="$9 upsell copy"
              value={moneyStack.funnelCopy.nineDollarUpsell}
            />
            <OutputBlock
              label="$99 upsell copy"
              value={moneyStack.funnelCopy.ninetyNineDollarUpsell}
            />
            <OutputBlock
              label="Bilion Monthly upsell copy"
              value={moneyStack.funnelCopy.bilionMonthlyUpsell}
            />
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.04] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
                Grand Slam Offer Builder
              </div>
              <h2 className="mt-2 text-2xl font-black text-white">
                Build the offer before writing more copy.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Internal operator tool for turning one Bilion signal into a
                tighter free offer, $9 product, $99 vault, and Bilion Monthly
                path. Built for selling this week, not for adding a user-facing
                feature.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                void handleCopy(
                  "grand-slam-offer",
                  buildGrandSlamMarkdown(grandSlamOffer),
                )
              }
              className="min-h-10 rounded-md border border-cyan-300/30 px-3 text-xs font-black text-cyan-100 transition hover:bg-cyan-300/10"
            >
              {copiedKey === "grand-slam-offer"
                ? "Copied"
                : "Copy Grand Slam"}
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <OutputBlock
              label="Core Promise"
              value={grandSlamOffer.corePromise}
            />
            <OutputBlock
              label="Dream Outcome"
              value={grandSlamOffer.dreamOutcome}
            />
            <OutputBlock
              label="Pain Removed"
              value={grandSlamOffer.painRemoved}
            />
            <OutputBlock label="Main Offer" value={grandSlamOffer.mainOffer} />
            <OutputBlock
              label="Premium Offer"
              value={grandSlamOffer.premiumOffer}
            />
            <OutputBlock label="Reason Why" value={grandSlamOffer.reasonWhy} />
            <OutputBlock
              label="Price Anchor"
              value={grandSlamOffer.priceAnchor}
            />
            <OutputBlock
              label="Risk Reversal"
              value={grandSlamOffer.riskReversal}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ListBlock
              items={grandSlamOffer.deliverables}
              title="Deliverables"
            />
            <ListBlock items={grandSlamOffer.bonuses} title="Bonuses" />
            <ListBlock items={grandSlamOffer.guarantees} title="Guarantees" />
            <ListBlock
              items={grandSlamOffer.scarcityUrgency}
              title="Scarcity / Urgency"
            />
            <ListBlock
              items={grandSlamOffer.ctaVariants}
              title="CTA Variants"
            />
            <OutputBlock
              label="Final Sales Block"
              value={grandSlamOffer.finalSalesBlock}
            />
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.035] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
                Offer Library
              </div>
              <h2 className="mt-2 text-2xl font-black text-white">
                Save every offer worth testing.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Internal asset manager for reusable offers, lead magnets, paid
                products, channels, and Bilion Monthly upsells. Built to grow
                more useful every week.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:w-[26rem]">
              <button
                type="button"
                onClick={handleSaveOffer}
                className="min-h-10 rounded-md bg-emerald-300 px-3 text-xs font-black text-zinc-950 transition hover:bg-emerald-200"
              >
                Save Offer
              </button>
              <button
                type="button"
                onClick={handleUpdateOffer}
                className="min-h-10 rounded-md border border-emerald-300/30 px-3 text-xs font-black text-emerald-100 transition hover:bg-emerald-300/10"
              >
                Update Offer
              </button>
              <button
                type="button"
                onClick={() => handleDuplicateOffer()}
                className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
              >
                Duplicate Offer
              </button>
              <button
                type="button"
                onClick={() =>
                  selectedOfferId ? handleDeleteOffer(selectedOfferId) : undefined
                }
                className="min-h-10 rounded-md border border-red-300/30 px-3 text-xs font-black text-red-100 transition hover:bg-red-300/10"
              >
                Delete Offer
              </button>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_12rem_1fr]">
            <label className="min-w-0">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Tags for saved offer
              </span>
              <input
                value={libraryTags}
                onChange={(event) => setLibraryTags(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-emerald-300/60"
                placeholder="gumroad, ai builder, winner"
              />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Status
              </span>
              <select
                value={libraryStatus}
                onChange={(event) =>
                  setLibraryStatus(event.target.value as OfferStatus)
                }
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm font-bold text-zinc-100 outline-none"
              >
                {offerStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-md border border-white/10 bg-black/25 p-3">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Selected asset
              </div>
              <div className="mt-2 text-sm font-bold text-zinc-200">
                {selectedOffer ? selectedOffer.title : "No saved offer selected"}
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
            <label className="min-w-0">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Search
              </span>
              <input
                value={librarySearch}
                onChange={(event) => setLibrarySearch(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-emerald-300/60"
                placeholder="buyer, pain, product, channel"
              />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Buyer
              </span>
              <select
                value={buyerFilter}
                onChange={(event) => setBuyerFilter(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm font-bold text-zinc-100 outline-none"
              >
                <option value="All">All buyers</option>
                {buyerOptions.map((buyer) => (
                  <option key={buyer} value={buyer}>
                    {buyer}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as OfferStatus | "All")
                }
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm font-bold text-zinc-100 outline-none"
              >
                <option value="All">All statuses</option>
                {offerStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="min-w-0">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Tag
              </span>
              <input
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:border-emerald-300/60"
                placeholder="winner"
              />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Sort
              </span>
              <select
                value={librarySort}
                onChange={(event) => setLibrarySort(event.target.value as OfferSort)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm font-bold text-zinc-100 outline-none"
              >
                <option value="newest">Newest</option>
                <option value="highest-score">Highest score</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCard label="Saved" value={offerLibrary.length} />
            <ScoreCard
              label="Filtered"
              value={filteredOfferLibrary.length}
            />
            <ScoreCard
              label="Favorites"
              value={offerLibrary.filter((item) => item.favorite).length}
            />
            <ScoreCard
              label="Winners"
              value={offerLibrary.filter((item) => item.status === "Winner").length}
            />
          </div>

          {filteredOfferLibrary.length === 0 ? (
            <div className="rounded-md border border-white/10 bg-black/25 p-4 text-sm font-bold text-zinc-400">
              No saved offers yet. Generate a strong stack, add tags, then save
              it to the library.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredOfferLibrary.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-lg border p-4 ${
                    selectedOfferId === item.id
                      ? "border-emerald-300/50 bg-emerald-300/[0.06]"
                      : "border-white/10 bg-zinc-900"
                  }`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(item.id)}
                          className="min-h-8 rounded-md border border-white/10 px-2 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
                        >
                          {item.favorite ? "Favorite" : "Mark Favorite"}
                        </button>
                        <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-black text-zinc-400">
                          Score {getOfferScoreTotal(item.offerScore)}/10
                        </span>
                        <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-black text-zinc-400">
                          Created {formatDate(item.createdDate)}
                        </span>
                        <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-black text-zinc-400">
                          Updated {formatDate(item.lastUpdated)}
                        </span>
                      </div>
                      <h3 className="mt-3 break-words text-lg font-black text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 break-words text-sm leading-6 text-zinc-400">
                        {item.buyer} / {item.pain}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={`${item.id}-${tag}`}
                            className="rounded-md bg-black/30 px-2 py-1 text-xs font-bold text-emerald-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid shrink-0 gap-2 sm:grid-cols-2 lg:w-[26rem]">
                      <select
                        value={item.status}
                        onChange={(event) =>
                          handleChangeOfferStatus(
                            item.id,
                            event.target.value as OfferStatus,
                          )
                        }
                        className="min-h-10 rounded-md border border-white/10 bg-zinc-950 px-3 text-xs font-black text-zinc-100 outline-none"
                      >
                        {offerStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleLoadOffer(item)}
                        className="min-h-10 rounded-md bg-white px-3 text-xs font-black text-zinc-950 transition hover:bg-zinc-200"
                      >
                        Load Offer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateOffer(item.id)}
                        className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOffer(item.id)}
                        className="min-h-10 rounded-md border border-red-300/30 px-3 text-xs font-black text-red-100 transition hover:bg-red-300/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <OutputBlock label="Market Signal" value={item.marketSignal} />
                    <OutputBlock label="Lead Magnet" value={item.leadMagnet} />
                    <OutputBlock
                      label="$9 Product"
                      value={item.nineDollarProduct}
                    />
                    <OutputBlock
                      label="$99 Product"
                      value={item.ninetyNineDollarProduct}
                    />
                    <OutputBlock
                      label="Bilion Monthly Upsell"
                      value={item.bilionMonthlyUpsell}
                    />
                    <OutputBlock
                      label="Grand Slam Offer"
                      value={item.grandSlamOffer.finalSalesBlock}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Today&apos;s 30</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Fast offer variants from existing Bilion records.
              </p>
            </div>
            <div className="text-sm font-bold text-zinc-400">
              Free Lead Magnet / $9 Launch Stack / $99 Vault / Bilion Monthly
            </div>
          </div>
          <div className="grid gap-4">
            {cards.map((card, index) => (
              <article
                key={`${card.id}-${index}`}
                className="rounded-lg border border-white/10 bg-zinc-900 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                      Stack {index + 1}
                    </div>
                    <h3 className="mt-2 break-words text-lg font-black text-white">
                      {card.sourceTitle}
                    </h3>
                    <p className="mt-2 break-words text-sm leading-6 text-zinc-400">
                      {card.output.oneLineOffer}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      void handleCopy(
                        `offer-${index}`,
                        buildMarkdown([card]),
                      )
                    }
                    className="min-h-10 shrink-0 rounded-md bg-white px-3 text-xs font-black text-zinc-950 transition hover:bg-zinc-200"
                  >
                    {copiedKey === `offer-${index}` ? "Copied" : "Copy Stack"}
                  </button>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <OutputBlock
                    label="Free lead magnet"
                    value={card.output.freeLeadMagnetIdea}
                  />
                  <OutputBlock
                    label="$9 product"
                    value={card.output.nineDollarProductIdea}
                  />
                  <OutputBlock
                    label="$99 product"
                    value={card.output.ninetyNineDollarProductIdea}
                  />
                  <OutputBlock label="X post" value={card.output.xPost} />
                  <OutputBlock label="DM opener" value={card.output.dmOpener} />
                  <OutputBlock label="Gumroad title" value={card.output.gumroadTitle} />
                  <OutputBlock
                    label="Lemon Squeezy title"
                    value={card.output.lemonSqueezyTitle}
                  />
                  <OutputBlock label="CTA" value={card.output.cta} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function OutputBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-black/25 p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-zinc-200">
        {value}
      </pre>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-yellow-300/20 bg-black/25 p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-black text-white">{value}/10</div>
    </div>
  );
}

function ListBlock({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-black/25 p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
        {title}
      </div>
      <ol className="mt-3 grid gap-2 text-sm leading-6 text-zinc-200">
        {items.map((item, index) => (
          <li key={`${title}-${item}`} className="grid grid-cols-[1.5rem_1fr] gap-2">
            <span className="font-bold text-zinc-600">{index + 1}.</span>
            <span className="break-words">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
