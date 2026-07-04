"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { canonicalMoneySignals, type MoneySignal } from "../../data/money-signals";
import { showcaseItems } from "../showcase/showcase-data";

type FreeIdea = {
  latest_signal: string;
  what_you_can_build: string;
  buyer: string;
  pain: string;
  why_now: string;
};

type BuildPromptPack = {
  latest_signal: string;
  source_title: string;
  source_url: string;
  source_type: string;
  source_note: string;
  buyer: string;
  pain: string;
  why_now: string;
  what_you_can_build: string;
  core_features: string[];
  comparable_price: string;
  build_steps: string[];
  pattern_matches: string[];
  code_x_prompt: string;
};

type ApiResult = {
  free: FreeIdea;
  paid: BuildPromptPack;
};

type BuildSignal = {
  id: string;
  latestSignal: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: string;
  sourceNote: string;
  buyer: string;
  pain: string;
  whyNow: string;
  whatYouCanBuild: string;
  coreFeatures: string[];
  comparablePrice: string;
  buildSteps: string[];
  patternMatches: string[];
  codeXPrompt: string;
  signalSourceLabel?: string;
};

type BilionAppClientProps = {
  gmailMarketSignals: BuildSignal[];
  hasFounderAccess: boolean;
};

type SourceMode = "indie" | "github";
type NextAction = "post" | "sell" | "dm" | "build";
type WorkflowTab = "library" | "studio" | "queue" | "validation" | "winners";
type MarketClassification = MarketOption;
type DistributionStatus =
  | "Not tested"
  | "Posted"
  | "DM sent"
  | "Got replies"
  | "Winner"
  | "Rejected";
type DistributionKind = "X post" | "DM script" | "Validation log" | "Short video angle";
type ValidationVerdict = "Build" | "Kill" | "Pivot";

const selectedPatternLabels: Record<string, string> = {
  "chat-product": "$300K/year chat product",
  "discord-tool": "$30K MRR Discord tool",
  "mobile-app": "$20K/month mobile app",
  "demo-saas": "$250K MRR demo SaaS",
  "analytics-tool": "$1M ARR analytics tool",
};

type CopyFeedback = {
  message: string;
  tone: "success" | "error";
};

type ExportAssetKind = "pdf" | "pack" | "tiktok" | "x" | "gumroad";

type DistributionAsset = {
  id: string;
  action: NextAction;
  body: string;
  buyer: string;
  createdAt: string;
  kind: DistributionKind;
  signalTitle: string;
  status: DistributionStatus;
  title: string;
};

type ValidationRecord = {
  id: string;
  action: NextAction;
  buyer: string;
  clicks: number;
  createdAt: string;
  dmsSent: number;
  interested: number;
  objections: string;
  replies: number;
  signalTitle: string;
  verdict: ValidationVerdict;
  winner: boolean;
};

type EvidenceDraft = {
  id: string;
  createdAt: string;
  rawText: string;
  sourceType: string;
  market: string;
  product: string;
  buyer: string;
  paidPain: string;
  offer: string;
  price: string;
  revenueEvidence: string;
  sourceEvidence: string;
  distributionChannel: string;
  leadMagnet: string;
  whyItWorked: string;
  adaptationIdea: string;
  opportunityScore: number;
  evidenceLevel: "strong" | "medium" | "weak";
  recommendedUse: "build_sell_post" | "sell_post" | "research_more";
  launchPackSeed: string;
};

type RawSignal = {
  id: string;
  sourceType: string;
  sourceName: string;
  subject: string;
  body: string;
  sourceUrl: string;
  importedAt: string;
  status: "candidate" | "approved" | "rejected";
};

type CandidateMoneySignal = {
  id: string;
  rawSignalId: string;
  market: MarketOption;
  source: string;
  proof: string;
  whatMoneyMoved: string;
  buyer: string;
  paidPain: string;
  firstOffer: string;
  score: number;
  channels: string[];
  confidence: "high" | "medium" | "low";
  missingFields: string[];
  extractionNotes: string;
  status: "candidate" | "approved" | "rejected";
};

type ApprovedMoneySignal = {
  id: string;
  market: MarketOption;
  source: string;
  proof: string;
  whatMoneyMoved: string;
  buyer: string;
  paidPain: string;
  firstOffer: string;
  score: number;
  channels: string[];
  approvedAt: string;
};

type OutputPack = {
  id: string;
  signalId: string;
  angle?: NextAction;
  market: string;
  generatedAt: string;
  xPost: string;
  shortVideoScript: string;
  carouselSlides: string[];
  coldDm: string;
  validationPlan: string;
  codexBuildPrompt: string;
};

const marketOptions = [
  "Micro SaaS",
  "Freelance Dev",
  "Business Automation",
  "Digital Product",
  "AI Agency",
  "Local Business",
  "Healthcare",
  "Construction",
  "Ecommerce",
  "Creators",
  "Legal",
  "Real Estate",
  "Finance",
  "Developer Workflow",
  "Agriculture / Field Ops",
] as const;

type MarketOption = (typeof marketOptions)[number];

const appMarketOptions = [
  "Creators",
  "Ecommerce",
  "Local Business",
  "Healthcare",
  "Construction",
  "Finance",
  "Legal",
  "Real Estate",
  "Developer Workflow",
  "Agriculture / Field Ops",
] as const satisfies readonly MarketOption[];

type AppMarketOption = (typeof appMarketOptions)[number];

function isAppMarketOption(value: string): value is AppMarketOption {
  return appMarketOptions.some((market) => market === value);
}

type MarketSpecificOpportunity = {
  buyer: string;
  paidPain: string;
  whyNow: string;
  firstOffer: string;
  price: string;
  distributionChannel: string;
  postHook: string;
  dmTarget: string;
  fortyEightHourValidation: string[];
  whatToBuildOnlyAfterReplies: string;
};

type ProvenMoneyPattern = {
  id: string;
  proofLabel: string;
  patternTitle: string;
  whatSold: string;
  buyer: string;
  paidPain: string;
  moneyReason: string;
  smallVersion: string;
  firstOffer: string;
  postHook: string;
  dmScript: string;
  validationSteps: string[];
  buildAfterReplies: string;
  suggestedPaths: MarketOption[];
};

type PathOfferRule = {
  angle: string;
  price: string;
  firstOffer: (pattern: ProvenMoneyPattern) => string;
  buildAfterReplies: (pattern: ProvenMoneyPattern) => string;
  salesMotion: string;
};

type NormalizedOpportunity = {
  proofLabel: string;
  patternTitle: string;
  whatSold: string;
  buyer: string;
  paidPain: string;
  firstOfferName: string;
  firstOfferOutcome: string;
  price: string;
  postHook: string;
  dmScript: string;
  validationSteps: string[];
  buildAfterReplies: string;
  selectedPath: MarketOption;
};

type CanonicalMoneySignal = MoneySignal;

const provenMoneyPatterns: ProvenMoneyPattern[] = [
  {
    id: "discord-community-tool",
    proofLabel: "$30K MRR",
    patternTitle: "Discord Community Tool",
    whatSold: "A Discord community management tool",
    buyer: "paid community owners and Discord operators",
    paidPain: "member onboarding, repeated questions, and messy community operations",
    moneyReason:
      "paid communities lose trust when onboarding, FAQs, and member handoffs feel disorganized",
    smallVersion: "Discord Community Cleanup Pack",
    firstOffer: "$49 Discord onboarding and FAQ cleanup pack",
    postHook:
      "Paid Discord communities do not need more channels. They need onboarding and FAQs that stop the same member questions.",
    dmScript:
      "Quick idea: I am testing a Discord Community Cleanup Pack. I can turn one messy onboarding flow and FAQ list into a cleaner member-ready version before building anything. Want to see a sample?",
    validationSteps: [
      "Post 3 before/after examples of messy Discord onboarding and cleaner FAQ sections.",
      "DM 25 paid community owners or Discord operators.",
      "Offer to clean one onboarding checklist manually before building.",
    ],
    buildAfterReplies: "onboarding checklist generator and member FAQ copilot",
    suggestedPaths: ["Micro SaaS", "Digital Product", "AI Agency"],
  },
  {
    id: "demo-creation-saas",
    proofLabel: "$250K MRR",
    patternTitle: "Demo Creation SaaS",
    whatSold: "A product demo creation tool",
    buyer: "SaaS founders and sales teams",
    paidPain: "turning product features into clear demos that help sales conversations",
    moneyReason:
      "sales calls improve when product features become a tight walkthrough instead of a feature dump",
    smallVersion: "Demo Cleanup Pack",
    firstOffer: "$99 demo script and walkthrough cleanup pack",
    postHook:
      "SaaS teams do not need a prettier demo. They need one walkthrough that makes the buyer ask the next question.",
    dmScript:
      "Quick idea: I am testing a Demo Cleanup Pack. I can turn one feature list into a tighter demo script and walkthrough before building software. Want me to do one?",
    validationSteps: [
      "Rewrite 3 public product pages into short demo scripts.",
      "Post one before/after demo outline.",
      "DM 20 SaaS founders or sales leads offering one manual demo cleanup.",
    ],
    buildAfterReplies: "demo script generator and walkthrough builder",
    suggestedPaths: ["Micro SaaS", "Freelance Dev", "AI Agency"],
  },
  {
    id: "automation-business",
    proofLabel: "$3M ARR",
    patternTitle: "Automation Business",
    whatSold: "Repetitive task automation software/service",
    buyer: "operators, agencies, and business teams doing repeatable admin work",
    paidPain: "manual repeated tasks that delay responses, reporting, or handoffs",
    moneyReason:
      "operators pay when one annoying recurring task becomes a reliable intake, output, and handoff system",
    smallVersion: "Manual Automation Setup",
    firstOffer: "$299 AI automation setup for one repeated task",
    postHook:
      "The first paid automation is not a platform. It is one repeated task turned into a cleaner intake and output.",
    dmScript:
      "Quick idea: I am testing a Manual Automation Setup. Pick one repeated admin task and I will map the intake, output, and handoff manually before building. Want a sample?",
    validationSteps: [
      "Post 3 examples of one repeated admin task becoming a clear intake and output.",
      "DM 25 operators or agency owners asking for one task they repeat weekly.",
      "Build only if people send a real task or ask for the setup.",
    ],
    buildAfterReplies: "intake-to-output automation dashboard",
    suggestedPaths: ["Business Automation", "AI Agency", "Freelance Dev"],
  },
  {
    id: "mobile-utility-app",
    proofLabel: "$100K/mo",
    patternTitle: "Mobile Utility App",
    whatSold: "A simple niche mobile utility",
    buyer: "users with one repeated daily annoyance",
    paidPain: "small but frequent problems people want solved without a complex platform",
    moneyReason:
      "people pay for tiny utilities when the pain happens often and the product gives a clear answer fast",
    smallVersion: "Niche Utility Template",
    firstOffer: "$19 checklist or lightweight utility template",
    postHook:
      "The best small app ideas are not giant platforms. They solve one repeated daily annoyance in under a minute.",
    dmScript:
      "Quick idea: I am testing a Niche Utility Template for one daily annoyance. I can mock the checklist and first screen before building. Want to see it?",
    validationSteps: [
      "List 5 repeated daily annoyances from one niche.",
      "Post 3 one-screen mockups with a clear before/after.",
      "DM 20 people in that niche asking which one they would pay to remove.",
    ],
    buildAfterReplies: "single-purpose mobile-first app",
    suggestedPaths: ["Micro SaaS", "Digital Product"],
  },
  {
    id: "seo-content-tool",
    proofLabel: "$25K/mo",
    patternTitle: "SEO Content Tool",
    whatSold: "Content and SEO assistance tool",
    buyer: "creators, SaaS teams, and niche site operators",
    paidPain: "turning rough ideas into search-friendly content briefs consistently",
    moneyReason:
      "content teams pay when rough ideas become briefs they can publish from without starting over",
    smallVersion: "SEO Content Fix Pack",
    firstOffer: "$49 content brief cleanup pack",
    postHook:
      "Niche sites do not need 100 content ideas. They need one rough idea turned into a brief a writer can actually use.",
    dmScript:
      "Quick idea: I am testing an SEO Content Fix Pack. Send one rough topic and I will turn it into a cleaner content brief before building a tool. Want one?",
    validationSteps: [
      "Turn 3 rough topic ideas into search-friendly content briefs.",
      "Post one before/after brief.",
      "DM 20 creators or niche site operators offering one manual cleanup.",
    ],
    buildAfterReplies: "keyword brief generator and content scoring tool",
    suggestedPaths: ["Digital Product", "Micro SaaS", "Freelance Dev"],
  },
];

const pathOfferRules: Partial<Record<MarketOption, PathOfferRule>> = {
  "Micro SaaS": {
    angle: "small monthly software angle",
    price: "$19-$49/month",
    firstOffer: (pattern) => `$19/month ${pattern.smallVersion} app`,
    buildAfterReplies: (pattern) => `${pattern.buildAfterReplies} as a tiny monthly SaaS`,
    salesMotion: "post the proof, show one demo screen, and ask for 5 paid beta users",
  },
  "Freelance Dev": {
    angle: "implementation service angle",
    price: "$299-$1,500 one-time",
    firstOffer: (pattern) => `$499 implementation sprint for ${pattern.smallVersion}`,
    buildAfterReplies: (pattern) => `${pattern.buildAfterReplies} as a client-specific internal tool`,
    salesMotion: "DM buyers with one before/after sample and offer a fixed-scope implementation",
  },
  "Business Automation": {
    angle: "setup + retainer angle",
    price: "$299-$500 setup + $49-$150/month",
    firstOffer: (pattern) => `$299 setup for ${pattern.smallVersion}`,
    buildAfterReplies: (pattern) => `${pattern.buildAfterReplies} as an automation dashboard`,
    salesMotion: "sell one repeated task setup, then add a monthly monitoring retainer",
  },
  "Digital Product": {
    angle: "template/checklist/prompt pack angle",
    price: "$9-$49 one-time",
    firstOffer: (pattern) => `$29 ${pattern.smallVersion} template pack`,
    buildAfterReplies: (pattern) => `${pattern.smallVersion} as a downloadable pack or generator`,
    salesMotion: "post the before/after asset and sell the pack from replies",
  },
  "AI Agency": {
    angle: "audit to setup angle",
    price: "$49 audit -> $500 setup",
    firstOffer: (pattern) => `$49 audit for ${pattern.smallVersion}`,
    buildAfterReplies: (pattern) => `${pattern.buildAfterReplies} as a client-facing audit/report generator`,
    salesMotion: "sell a small audit first, then offer the setup after the buyer sends real inputs",
  },
};

const marketSpecificOpportunities: Record<MarketOption, MarketSpecificOpportunity> = {
  "Micro SaaS": {
    buyer: "parents, preschool teachers, and homeschool creators selling printable learning materials",
    paidPain: "custom name worksheets take 15-30 minutes to design for each child, so teachers reuse generic sheets instead of personalized practice",
    whyNow: "worksheet examples spread well on X, Pinterest, and teacher groups, and a simple preview generator can be validated before a full download product exists",
    firstOffer: "$9 Custom Name Tracing Worksheet Pack",
    price: "$9 one-time or $5/month",
    distributionChannel: "Pinterest examples + Facebook homeschool groups + DMs to preschool worksheet sellers",
    postHook: "Parents do not need another learning app. They need a printable worksheet with their child's actual name on it.",
    dmTarget: "preschool teachers, homeschool creators, Etsy worksheet sellers, parenting newsletter writers",
    fortyEightHourValidation: [
      "Post 3 name tracing worksheet examples with different child names and themes.",
      "DM 20 preschool teachers or worksheet sellers offering one free custom sample.",
      "Build only if people request their own worksheet or ask how to buy the template.",
    ],
    whatToBuildOnlyAfterReplies: "name input -> worksheet style selector -> printable preview -> download placeholder",
  },
  "Freelance Dev": {
    buyer: "freelance web developers maintaining client sites on retainers",
    paidPain: "clients send vague bug reports by email and screenshots, forcing the developer to rewrite each issue into reproducible steps before fixing it",
    whyNow: "freelancers already use Codex or Cursor to fix code, but the bottleneck is turning messy client messages into clean implementation tasks",
    firstOffer: "$49 Bug Report Cleanup Sprint",
    price: "$49 one-time or $99/month",
    distributionChannel: "X posts + DMs to freelancers posting about client maintenance, WordPress fixes, and Cursor/Codex workflows",
    postHook: "Freelance developers do not need more AI coding tips. They need messy client bug reports turned into clean fix tickets.",
    dmTarget: "WordPress freelancers, Webflow developers, solo SaaS maintainers, agency subcontractors",
    fortyEightHourValidation: [
      "Collect 5 public examples of vague client bug reports.",
      "Publish 3 before/after examples turning them into fix tickets.",
      "DM 25 freelance developers offering to clean up one real client issue manually.",
    ],
    whatToBuildOnlyAfterReplies: "bug report intake -> repro steps generator -> priority tag -> Codex-ready fix brief",
  },
  "Business Automation": {
    buyer: "operations leads and agency owners with one repeated admin task every week",
    paidPain: "lead replies, client updates, reports, and handoffs are still copied between inboxes, spreadsheets, and chat threads",
    whyNow: "buyers can test value with one manual before/after task cleanup before trusting a full system",
    firstOffer: "$299 Manual Automation Setup",
    price: "$299 setup + $99/month",
    distributionChannel: "LinkedIn operator posts + agency owner DMs + niche operations communities",
    postHook: "The first paid automation is not a platform. It is one repeated task turned into a cleaner intake and output.",
    dmTarget: "agency owners, operations managers, client success leads, solo operators doing weekly admin handoffs",
    fortyEightHourValidation: [
      "Post 3 examples of one repeated admin task becoming a clear intake and output.",
      "DM 25 operators asking for one task they repeat every week.",
      "Build only if buyers send a real task or ask for the setup.",
    ],
    whatToBuildOnlyAfterReplies: "task intake -> output generator -> handoff checklist -> status tracker",
  },
  "Digital Product": {
    buyer: "creators, consultants, and niche operators selling templates, checklists, or prompt packs",
    paidPain: "they know the repeatable process but have not packaged it into a clear asset buyers can use without a call",
    whyNow: "one before/after example can sell before a generator or full product exists",
    firstOffer: "$29 Template Cleanup Pack",
    price: "$29 one-time",
    distributionChannel: "X proof posts + Gumroad audience DMs + niche community posts with before/after examples",
    postHook: "Digital products do not need to start as software. Start with one before/after asset people can buy today.",
    dmTarget: "Gumroad sellers, newsletter operators, consultants, prompt pack creators, Notion template sellers",
    fortyEightHourValidation: [
      "Create 3 before/after examples from one repeatable process.",
      "Post the strongest example with a clear $29 offer.",
      "DM 20 creators asking if they want the pack before a tool exists.",
    ],
    whatToBuildOnlyAfterReplies: "input checklist -> template generator -> example library -> download-ready pack",
  },
  "AI Agency": {
    buyer: "solo AI agency freelancers selling lead follow-up systems to local service businesses",
    paidPain: "leads arrive from website forms, Instagram DMs, and email, but nobody follows up within 5 minutes",
    whyNow: "AI agency beginners are selling chatbots while local businesses lose money in the first reply window",
    firstOffer: "$49 Lead Leak Audit",
    price: "$49 audit or $199 setup",
    distributionChannel: "X posts + cold DM to AI agency beginners",
    postHook: "Most local businesses do not need an AI chatbot. They need a 5-minute follow-up system.",
    dmTarget: "people posting about AI agency, GoHighLevel, Zapier, Make, and local lead generation",
    fortyEightHourValidation: [
      "Post 3 hooks about missed local leads and 5-minute follow-up.",
      "DM 30 AI agency beginners offering to make 3 lead follow-up audits manually.",
      "Build only if they ask for the audit template or want a reusable client delivery tool.",
    ],
    whatToBuildOnlyAfterReplies: "lead intake -> missed lead detector -> follow-up script generator",
  },
  "Local Business": {
    buyer: "independent restaurant, clinic, salon, and home-service owners with public reviews",
    paidPain: "Google reviews sit unanswered because owners are busy and staff are unsure how to reply to complaints without making them worse",
    whyNow: "review replies are visible to every future buyer, and owners can judge value from 5 before/after examples",
    firstOffer: "$150 Review Reply Cleanup Pack",
    price: "$150 one-time or $99/month",
    distributionChannel: "Google Maps prospecting + local owner Facebook groups + direct email with rewritten reviews",
    postHook: "Local businesses do not need a brand voice strategy. They need yesterday's bad reviews answered without sounding defensive.",
    dmTarget: "restaurants with unanswered reviews, clinics with booking-site reviews, salons with low-star Google reviews",
    fortyEightHourValidation: [
      "Rewrite 5 public unanswered reviews from one niche.",
      "Send before/after replies to 20 owners with the exact review link.",
      "Build only if owners ask you to handle the next batch.",
    ],
    whatToBuildOnlyAfterReplies: "review input -> tone selector -> safe reply options -> owner approval queue",
  },
  Healthcare: {
    buyer: "small dental clinics, therapy offices, and appointment-based clinics with front-desk staff",
    paidPain: "cancellation notes and voicemail callbacks pile up, so open appointment slots are not recovered before the day ends",
    whyNow: "one recovered appointment can pay for the tool, and clinics can validate with a simple cancellation list sample",
    firstOffer: "$199 Cancellation Recovery Script Pack",
    price: "$199 setup + $49/month",
    distributionChannel: "LinkedIn clinic operators + dental office manager groups + direct email to clinics with visible booking pages",
    postHook: "Clinics do not need a patient portal first. They need canceled slots turned into same-day recovery messages.",
    dmTarget: "dental office managers, therapy clinic owners, chiropractic clinics, med spa operators",
    fortyEightHourValidation: [
      "Create 3 cancellation recovery scripts from realistic patient notes.",
      "DM or email 20 clinic managers asking what one filled cancellation is worth.",
      "Build only if clinics send a sample cancellation note or ask for the script pack.",
    ],
    whatToBuildOnlyAfterReplies: "cancellation intake -> recovery priority -> SMS/email script -> follow-up status board",
  },
  Construction: {
    buyer: "small contractors with 3-20 field workers",
    paidPain: "site updates are buried in WhatsApp, photos, and voice notes, so daily reports to clients are late or inconsistent",
    whyNow: "owners already have the raw notes on their phones, and a before/after client report proves value in one screenshot",
    firstOffer: "$99 Daily Report Cleanup Pack",
    price: "$99 one-time or $49/month",
    distributionChannel: "LinkedIn contractor operators + Facebook construction groups",
    postHook: "Small contractors do not need full project management software. They need clean daily reports from messy field notes.",
    dmTarget: "remodelers, roofing contractors, small GC owners, construction ops managers",
    fortyEightHourValidation: [
      "Collect 5 public contractor posts or sample field notes.",
      "Publish 3 before/after examples turning messy notes into client-ready reports.",
      "DM 20 contractors offering to turn yesterday's field notes into a clean report.",
    ],
    whatToBuildOnlyAfterReplies: "mobile note intake -> photo summary -> daily report PDF",
  },
  Ecommerce: {
    buyer: "Shopify store owners with 20-200 SKUs and abandoned product pages",
    paidPain: "product pages have weak benefits, missing FAQs, and inconsistent sizing/shipping answers that create support tickets and lost carts",
    whyNow: "store owners can test a rewritten product page before installing an app or changing their theme",
    firstOffer: "$79 Product Page Conversion Cleanup",
    price: "$79 one-time or $29/month",
    distributionChannel: "Shopify founder X posts + ecommerce Facebook groups + DMs to stores with thin product descriptions",
    postHook: "Most Shopify stores do not need another popup. They need product pages that answer the questions buyers ask before checkout.",
    dmTarget: "Shopify owners, DTC operators, Etsy-to-Shopify sellers, ecommerce copywriters",
    fortyEightHourValidation: [
      "Rewrite 3 public product pages with stronger bullets and FAQs.",
      "Post before/after screenshots for one niche.",
      "DM 25 store owners offering one manual product page cleanup.",
    ],
    whatToBuildOnlyAfterReplies: "product URL/input -> benefit bullets -> FAQ generator -> copy-ready product page sections",
  },
  Creators: {
    buyer: "newsletter writers, YouTube educators, and short-form creators selling templates or mini-products",
    paidPain: "audience questions and comments are scattered across replies, DMs, and comments, so creators miss repeatable paid product angles",
    whyNow: "creators can validate by posting one audience-question teardown before building a product",
    firstOffer: "$29 Audience Question Product Map",
    price: "$29 one-time or $19/month",
    distributionChannel: "X creator threads + newsletter communities + DMs to creators with repeated audience Q&A",
    postHook: "Creators do not need 100 content ideas. They need the 3 audience questions that can become a paid mini-product.",
    dmTarget: "newsletter operators, YouTube tutorial creators, Gumroad sellers, cohort-based course creators",
    fortyEightHourValidation: [
      "Collect 20 comments from one creator niche.",
      "Post 3 examples mapping repeated questions to paid mini-products.",
      "DM 20 creators offering to map their replies into one paid offer.",
    ],
    whatToBuildOnlyAfterReplies: "comment import -> repeated-question clustering -> paid offer map -> launch post generator",
  },
  Legal: {
    buyer: "solo lawyers and small law firms handling intake for estate planning, immigration, and small business clients",
    paidPain: "prospect emails lack key facts, so staff spend back-and-forth time collecting matter type, deadlines, documents, and eligibility details",
    whyNow: "firms can validate with intake checklists and internal summaries without giving legal advice",
    firstOffer: "$299 Intake Summary Setup",
    price: "$299 setup + $99/month",
    distributionChannel: "LinkedIn legal ops posts + local bar association groups + email to small firm intake managers",
    postHook: "Small law firms do not need an AI lawyer. They need messy prospect emails turned into clean intake summaries.",
    dmTarget: "estate planning lawyers, immigration firms, small business attorneys, legal intake coordinators",
    fortyEightHourValidation: [
      "Create 3 anonymized prospect email to intake-summary examples.",
      "Post one compliance-safe before/after with no legal advice.",
      "DM 20 small firm owners asking if their intake team would use the summary format.",
    ],
    whatToBuildOnlyAfterReplies: "prospect email intake -> missing facts checklist -> internal matter summary -> next-step email draft",
  },
  "Real Estate": {
    buyer: "property managers handling 50-500 rental units",
    paidPain: "tenant maintenance messages arrive through email, portals, and texts, but staff still rewrite them into vendor-ready work orders",
    whyNow: "maintenance routing is concrete, frequent, and easy to demonstrate with one tenant message",
    firstOffer: "$199 Maintenance Request Router Setup",
    price: "$199 setup + $49/month",
    distributionChannel: "property manager Facebook groups + LinkedIn multifamily ops posts + email to local management firms",
    postHook: "Property managers do not need a bigger portal. They need tenant repair messages turned into vendor-ready work orders.",
    dmTarget: "property managers, leasing coordinators, maintenance dispatchers, small multifamily operators",
    fortyEightHourValidation: [
      "Turn 5 sample tenant messages into vendor-ready work orders.",
      "Post 2 before/after examples for plumbing and appliance issues.",
      "DM 20 property managers offering to route one real anonymized request.",
    ],
    whatToBuildOnlyAfterReplies: "tenant message intake -> urgency/category detector -> vendor work order -> tenant reply draft",
  },
  Finance: {
    buyer: "bookkeepers and fractional CFOs serving freelancers and small agencies",
    paidPain: "client transaction notes and receipts are incomplete, so month-end cleanup requires repeated clarification emails",
    whyNow: "bookkeepers can test one cleaned transaction packet before trusting a full finance tool",
    firstOffer: "$99 Month-End Cleanup Brief",
    price: "$99 one-time or $149/month",
    distributionChannel: "bookkeeper Facebook groups + LinkedIn fractional CFO posts + DMs to finance operators",
    postHook: "Bookkeepers do not need AI to do the books. They need clients to answer the missing transaction questions faster.",
    dmTarget: "bookkeepers, fractional CFOs, agency finance operators, freelancer accountants",
    fortyEightHourValidation: [
      "Create 3 messy transaction to client-question examples.",
      "Post a before/after showing a cleaned month-end clarification brief.",
      "DM 20 bookkeepers offering to clean one anonymized client note packet.",
    ],
    whatToBuildOnlyAfterReplies: "transaction note intake -> missing-info detector -> client question email -> cleanup status board",
  },
  "Developer Workflow": {
    buyer: "open-source maintainers and small devtool teams reviewing AI-generated pull requests",
    paidPain: "AI-generated PRs arrive large, under-explained, and risky, so maintainers spend time asking for scope, tests, and rollback notes",
    whyNow: "Codex and Cursor make PR volume rise, but maintainers still need review-ready summaries and risk checks",
    firstOffer: "$19 PR Risk Summary Pack",
    price: "$19 one-time or $12/month",
    distributionChannel: "GitHub maintainer posts + devtool X threads + DMs to repo owners discussing AI PRs",
    postHook: "Developers do not need more AI-generated code. Maintainers need AI PRs turned into reviewable risk summaries.",
    dmTarget: "open-source maintainers, devtool founders, engineering managers at small teams, repo owners with active issues",
    fortyEightHourValidation: [
      "Pick 5 public PRs and write review-ready risk summaries.",
      "Post 3 examples showing scope, files touched, tests, and rollback notes.",
      "DM 20 maintainers asking if they want one PR summarized manually.",
    ],
    whatToBuildOnlyAfterReplies: "PR URL/input -> changed-file summary -> risk checklist -> maintainer reply draft",
  },
  "Agriculture / Field Ops": {
    buyer: "small farms, greenhouse operators, and local field teams",
    paidPain: "daily farm work is scattered across LINE messages, sensor logs, weather notes, crop checks, paper notes, and schedules",
    whyNow: "Japanese farmers are already testing ChatGPT and Codex for practical farm work, but the first paid wedge is a manual daily operations cleanup",
    firstOffer: "Farm Operations Cleanup Pack",
    price: "JPY 9,800 one-time",
    distributionChannel: "direct DM to small farms, farm consultants, greenhouse operators, and local field teams",
    postHook: "Small farms do not need a full farm platform first. They need one messy operations day turned into a clean report.",
    dmTarget: "small farms, greenhouse operators, farm consultants, local field businesses",
    fortyEightHourValidation: [
      "Pick 20 small farms or farm consultants.",
      "Create one before/after sample manually.",
      "DM the sample.",
      "Ask if they would pay JPY 9,800.",
      "Build only if 3 people reply.",
    ],
    whatToBuildOnlyAfterReplies: "LINE messages -> sensor notes -> crop checks -> daily report dashboard",
  },
};

function getMoneySignalIdPrefix(source: "candidate" | "approved") {
  return `signal-inbox-${source}`;
}

function splitSignalSentences(rawText: string) {
  return rawText
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+|\n+/g)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function getMoneyProofSentence(rawText: string) {
  const moneyPattern =
    /\b(mrr|arr|revenue|paid users?|customers?|launch|launched|sold|pricing|subscription|subscribers?|booked|sales|profit|income)\b|\$[\d,.]+|\/month|\/mo/i;
  const sentences = splitSignalSentences(rawText);

  return (
    sentences.find((sentence) => moneyPattern.test(sentence)) ||
    truncateEvidenceText(rawText, 180)
  );
}

function getSignalInboxMarket(rawText: string): MarketOption {
  const text = rawText.toLowerCase();

  if (/farm|farmer|agriculture|greenhouse|crop|sensor|field ops|line/.test(text)) {
    return "Agriculture / Field Ops";
  }

  if (/clinic|dental|patient|therapy|appointment|front desk|healthcare|med spa/.test(text)) {
    return "Healthcare";
  }

  if (/contractor|construction|jobsite|roofing|remodel|field note|daily report/.test(text)) {
    return "Construction";
  }

  if (/shopify|ecommerce|dtc|cart|sku|product page|returns?|checkout/.test(text)) {
    return "Ecommerce";
  }

  if (/creator|newsletter|youtube|tiktok|gumroad|course|audience|comment/.test(text)) {
    return "Creators";
  }

  if (/law firm|lawyer|attorney|legal|intake|immigration|estate planning/.test(text)) {
    return "Legal";
  }

  if (/property|tenant|leasing|real estate|rental|maintenance request/.test(text)) {
    return "Real Estate";
  }

  if (/bookkeeper|accountant|cfo|receipt|month-end|transaction|finance/.test(text)) {
    return "Finance";
  }

  if (/github|repo|developer|devtool|pull request|issue|maintainer|setup/.test(text)) {
    return "Developer Workflow";
  }

  return "Local Business";
}

function getSignalInboxBuyer(rawText: string, market: MarketOption) {
  const explicitBuyer = getEvidenceLine(rawText, ["buyer", "customer", "who pays"]);

  if (explicitBuyer) {
    return explicitBuyer;
  }

  const buyerByMarket: Record<MarketOption, string> = {
    "Micro SaaS": "niche operators with a repeated paid workflow",
    "Freelance Dev": "founders and operators paying for implementation help",
    "Business Automation": "operators with repeated admin work and messy handoffs",
    "Digital Product": "buyers looking for a checklist, template, or prompt pack",
    "AI Agency": "AI agency beginners selling implementation to local operators",
    "Local Business": "local service owners with visible customer messages, reviews, or missed leads",
    Healthcare: "clinic managers and front-desk operators with appointment and patient-message bottlenecks",
    Construction: "small contractors and field operators turning messy updates into client-ready reports",
    Ecommerce: "Shopify and DTC operators with product-page, support, return, or checkout friction",
    Creators: "creators with repeated audience questions across comments, replies, and DMs",
    Legal: "solo lawyers and small firm intake teams handling messy prospect requests",
    "Real Estate": "property managers and leasing teams handling tenant or prospect messages",
    Finance: "bookkeepers, accountants, and fractional CFOs handling messy client records",
    "Developer Workflow": "devtool founders and open-source maintainers with repeated support questions",
    "Agriculture / Field Ops": "small farms, greenhouse operators, and local field teams",
  };

  return buyerByMarket[market];
}

function getSignalInboxPaidPain(rawText: string, market: MarketOption) {
  const explicitPain = getEvidenceLine(rawText, ["paid pain", "pain", "problem"]);

  if (explicitPain) {
    return explicitPain;
  }

  const painByMarket: Record<MarketOption, string> = {
    "Micro SaaS": "a repeated paid workflow is still tracked across scattered tools",
    "Freelance Dev": "implementation details are stuck in messy notes, bugs, and manual handoffs",
    "Business Automation": "manual admin work repeats every week and breaks when one person is busy",
    "Digital Product": "the buyer wants a packaged shortcut instead of figuring out the process alone",
    "AI Agency": "leads and client use cases arrive from multiple channels without a fast follow-up system",
    "Local Business": "customer messages, reviews, and leads are visible but not answered fast or consistently",
    Healthcare: "patient requests, cancellations, callbacks, and prep questions pile up at the front desk",
    Construction: "field notes, photos, voice notes, and client updates are scattered before reporting",
    Ecommerce: "buyers hesitate or ask support because product pages do not answer purchase objections clearly",
    Creators: "audience questions are scattered across comments and DMs, so paid product angles are missed",
    Legal: "prospect emails lack facts, deadlines, documents, and matter details before a consult",
    "Real Estate": "tenant or prospect messages must be rewritten into vendor-ready or leasing follow-up actions",
    Finance: "client receipts, transactions, and notes arrive incomplete before month-end cleanup",
    "Developer Workflow": "users repeat the same setup, issue, and PR questions before activation or merge",
    "Agriculture / Field Ops": "farm work is scattered across LINE, sensor logs, weather notes, crop checks, and schedules",
  };

  return painByMarket[market];
}

function getSignalInboxChannels(rawText: string, market: MarketOption) {
  const explicitChannel = getEvidenceLine(rawText, ["channel", "channels", "distribution"]);

  if (explicitChannel) {
    return explicitChannel
      .split(/,|;/g)
      .map((channel) => channel.trim())
      .filter(Boolean)
      .slice(0, 4);
  }

  const channelsByMarket: Record<MarketOption, string[]> = {
    "Micro SaaS": ["X posts", "founder communities", "cold DM"],
    "Freelance Dev": ["LinkedIn", "founder DMs", "Upwork-style outreach"],
    "Business Automation": ["operator DMs", "LinkedIn", "niche communities"],
    "Digital Product": ["X posts", "Gumroad pages", "creator DMs"],
    "AI Agency": ["X posts", "GoHighLevel groups", "AI agency beginner DMs"],
    "Local Business": ["Google Maps", "Instagram DM", "local owner email"],
    Healthcare: ["clinic manager email", "LinkedIn clinic operators", "front-desk groups"],
    Construction: ["LinkedIn contractor operators", "Facebook construction groups", "direct DM"],
    Ecommerce: ["Shopify founder X", "ecommerce groups", "store owner email"],
    Creators: ["X creator threads", "newsletter replies", "creator DMs"],
    Legal: ["LinkedIn legal ops", "small firm email", "local bar groups"],
    "Real Estate": ["property manager groups", "LinkedIn multifamily ops", "direct email"],
    Finance: ["bookkeeper groups", "LinkedIn CFO posts", "finance operator DMs"],
    "Developer Workflow": ["GitHub issues", "devtool X", "maintainer DMs"],
    "Agriculture / Field Ops": ["direct DM", "farm consultants", "local operators"],
  };

  return channelsByMarket[market];
}

function getSignalInboxFirstOffer(rawText: string, market: MarketOption, paidPain: string) {
  const explicitOffer = getEvidenceLine(rawText, ["first offer", "offer"]);

  if (explicitOffer && !softwareFirstOfferPattern.test(explicitOffer)) {
    return explicitOffer;
  }

  const offerByMarket: Record<MarketOption, string> = {
    "Micro SaaS": "$19 Paid Waitlist Report",
    "Freelance Dev": "$499 Manual Implementation Audit",
    "Business Automation": "$299 Setup Assessment",
    "Digital Product": "$29 Checklist and Prompt Pack",
    "AI Agency": "$49 Lead Leak Audit",
    "Local Business": "$99 Missed Lead or Review Cleanup Pack",
    Healthcare: "$199 Front Desk Recovery Script Pack",
    Construction: "$99 Daily Report Cleanup Pack",
    Ecommerce: "$79 Product Page Conversion Cleanup",
    Creators: "$29 Audience Question Product Map",
    Legal: "$299 Intake Summary Setup",
    "Real Estate": "$199 Maintenance Request Cleanup Pack",
    Finance: "$99 Month-End Cleanup Brief",
    "Developer Workflow": "$19 Repo Setup FAQ Pack",
    "Agriculture / Field Ops": "JPY 9,800 Farm Operations Cleanup Pack",
  };

  const offer = offerByMarket[market];

  return paidPain.length > 80 ? offer : `${offer}`;
}

function getSignalInboxWhatMoneyMoved(rawText: string, proof: string, firstOffer: string) {
  const explicitWhatMoved = getEvidenceLine(rawText, [
    "what money moved",
    "what sold",
    "revenue",
    "pricing",
  ]);

  if (explicitWhatMoved) {
    return explicitWhatMoved;
  }

  if (/\bmrr|arr|subscription|\/month|\/mo\b/i.test(rawText)) {
    return "Subscription revenue or recurring paid access around this workflow.";
  }

  if (/sold|launch|customers?|paid users?/i.test(rawText)) {
    return "Customers paid for a small product, service, or packaged workflow.";
  }

  return `${firstOffer} is the manual-first wedge suggested by this proof: ${proof}`;
}

function getCandidateScore(args: {
  buyer: string;
  firstOffer: string;
  paidPain: string;
  proof: string;
}) {
  let score = 50;

  if (/\$[\d,.]+|mrr|arr|revenue|paid users?|customers?|sold|subscription|\/month|\/mo/i.test(args.proof)) {
    score += 18;
  }

  if (args.buyer.length > 35) {
    score += 10;
  }

  if (args.paidPain.length > 55) {
    score += 10;
  }

  if (/\b(pack|audit|cleanup|checklist|setup|assessment|brief|script|template)\b/i.test(args.firstOffer)) {
    score += 7;
  }

  return Math.min(95, score);
}

function extractCandidateMoneySignal(rawText: string, sourceType: string): {
  candidate: CandidateMoneySignal;
  rawSignal: RawSignal;
} {
  const trimmedText = rawText.trim();
  const market = getSignalInboxMarket(trimmedText);
  const proof = getMoneyProofSentence(trimmedText);
  const buyer = getSignalInboxBuyer(trimmedText, market);
  const paidPain = getSignalInboxPaidPain(trimmedText, market);
  const firstOffer = getSignalInboxFirstOffer(trimmedText, market, paidPain);
  const whatMoneyMoved = getSignalInboxWhatMoneyMoved(trimmedText, proof, firstOffer);
  const channels = getSignalInboxChannels(trimmedText, market);
  const missingFields = [
    /\$[\d,.]+|mrr|arr|revenue|paid users?|customers?|sold|subscription|\/month|\/mo/i.test(proof)
      ? ""
      : "strong money proof",
    buyer ? "" : "buyer",
    paidPain ? "" : "paid pain",
    /\b(pack|audit|cleanup|checklist|setup|assessment|brief|script|template)\b/i.test(firstOffer)
      ? ""
      : "manual-first first offer",
  ].filter(Boolean);
  const score = getCandidateScore({ buyer, firstOffer, paidPain, proof });
  const confidence =
    missingFields.length === 0 && score >= 80
      ? "high"
      : missingFields.length <= 1 && score >= 68
        ? "medium"
        : "low";
  const importedAt = new Date().toISOString();
  const rawSignal: RawSignal = {
    id: `raw-signal-${Date.now()}`,
    sourceType,
    sourceName: sourceType,
    subject: truncateEvidenceText(proof, 90),
    body: trimmedText,
    sourceUrl: "",
    importedAt,
    status: "candidate",
  };

  return {
    rawSignal,
    candidate: {
      id: `${getMoneySignalIdPrefix("candidate")}-${Date.now()}`,
      rawSignalId: rawSignal.id,
      market,
      source: sourceType,
      proof,
      whatMoneyMoved,
      buyer,
      paidPain,
      firstOffer,
      score,
      channels,
      confidence,
      missingFields,
      extractionNotes:
        "Rule-based extraction. Approve only if the proof, buyer, paid pain, and manual-first offer are specific enough to test today.",
      status: "candidate",
    },
  };
}

function convertCandidateToApprovedMoneySignal(
  candidate: CandidateMoneySignal,
): ApprovedMoneySignal {
  return {
    id: `${getMoneySignalIdPrefix("approved")}-${candidate.id}`,
    market: candidate.market,
    source: candidate.source,
    proof: candidate.proof,
    whatMoneyMoved: candidate.whatMoneyMoved,
    buyer: candidate.buyer,
    paidPain: candidate.paidPain,
    firstOffer: candidate.firstOffer,
    score: candidate.score,
    channels: candidate.channels,
    approvedAt: new Date().toISOString(),
  };
}

function getApprovedMoneySignalId(signal: ApprovedMoneySignal) {
  return `${getMoneySignalIdPrefix("approved")}-${signal.id}`;
}

function getApprovedBuildAfterReplies(signal: ApprovedMoneySignal) {
  return getCanonicalBuildAfterReplies({
    id: signal.id,
    market: signal.market,
    source: signal.source,
    proof: signal.proof,
    whatMoneyMoved: signal.whatMoneyMoved,
    buyer: signal.buyer,
    paidPain: signal.paidPain,
    firstOffer: signal.firstOffer,
    score: Math.round(signal.score / 2),
    channels: signal.channels,
  });
}

function convertApprovedMoneySignalToBuildSignal(signal: ApprovedMoneySignal): BuildSignal {
  const buildAfterReplies = getApprovedBuildAfterReplies(signal);
  const validationSteps = buildDirect48hValidationPlan({
    buyer: signal.buyer,
    buildAfterReplies,
    pain: signal.paidPain,
    price: signal.firstOffer,
  });

  return {
    id: getApprovedMoneySignalId(signal),
    latestSignal: `${signal.proof} What money moved: ${signal.whatMoneyMoved}`,
    sourceTitle: signal.firstOffer,
    sourceUrl: "",
    sourceType: signal.market,
    sourceNote: `Signal Inbox. Source: ${signal.source}. Channels: ${signal.channels.join(", ")}. Money signal score ${signal.score}/95.`,
    signalSourceLabel: "Signal Inbox",
    buyer: signal.buyer,
    pain: signal.paidPain,
    whyNow: `${signal.proof} ${signal.whatMoneyMoved}`,
    whatYouCanBuild: buildAfterReplies,
    coreFeatures: buildAfterReplies
      .split("->")
      .map((feature) => feature.trim())
      .filter(Boolean),
    comparablePrice: signal.firstOffer,
    buildSteps: [
      `Pick 20 reachable buyers from: ${signal.channels.join(", ")}.`,
      "Create one before/after sample manually.",
      "DM the sample.",
      `Ask if they want ${signal.firstOffer}.`,
      "Build only if 3 people reply.",
    ],
    patternMatches: [
      `Money proof: ${signal.proof}`,
      `What sold: ${signal.whatMoneyMoved}`,
      `Market: ${signal.market}`,
      `Money signal score ${signal.score}/95`,
    ],
    codeXPrompt: `Build this only after replies. Source: Signal Inbox. Market: ${signal.market}. Buyer: ${signal.buyer}. Paid pain: ${signal.paidPain}. First offer: ${signal.firstOffer}. Build later: ${buildAfterReplies}.`,
  };
}

function getCanonicalMoneySignalId(signal: CanonicalMoneySignal) {
  return `canonical-${signal.id}`;
}

function getCanonicalMoneySignalForBuildSignal(signal: BuildSignal) {
  return canonicalMoneySignals.find(
    (canonicalSignal) => getCanonicalMoneySignalId(canonicalSignal) === signal.id,
  );
}

function getCanonicalBuildAfterReplies(signal: CanonicalMoneySignal) {
  const buildByMarket: Partial<Record<MarketOption, string>> = {
    "Local Business": "review reply approval board -> follow-up message drafts -> owner copy buttons",
    Healthcare: "front-desk recovery script board -> callback checklist -> patient reply drafts",
    Construction: "field note intake -> photo summary -> daily report PDF",
    Ecommerce: "product page cleanup form -> FAQ rewrite -> objection checklist",
    Creators: "audience question intake -> offer map -> launch post drafts",
    Legal: "intake summary form -> missing-facts checklist -> client email drafts",
    "Real Estate": "maintenance request intake -> vendor-ready work order -> tenant reply drafts",
    Finance: "receipt note intake -> missing-info checklist -> client clarification emails",
    "Developer Workflow": "repo issue intake -> setup FAQ draft -> maintainer reply templates",
    "Agriculture / Field Ops": "LINE note intake -> crop and sensor summary -> daily report dashboard",
  };

  return buildByMarket[signal.market] || "manual intake -> cleanup output -> buyer-ready report";
}

function buildCanonicalMoneySignal(signal: CanonicalMoneySignal): BuildSignal {
  const buildAfterReplies = getCanonicalBuildAfterReplies(signal);
  const validationSteps = buildDirect48hValidationPlan({
    buyer: signal.buyer,
    buildAfterReplies,
    pain: signal.paidPain,
    price: signal.firstOffer,
  });

  return {
    id: getCanonicalMoneySignalId(signal),
    latestSignal: `${signal.proof} What money moved: ${signal.whatMoneyMoved}`,
    sourceTitle: signal.firstOffer,
    sourceUrl: "",
    sourceType: signal.market,
    sourceNote: `${signal.source}. Channels: ${signal.channels.join(", ")}`,
    signalSourceLabel: signal.market,
    buyer: signal.buyer,
    pain: signal.paidPain,
    whyNow: `${signal.proof} ${signal.whatMoneyMoved}`,
    whatYouCanBuild: buildAfterReplies,
    coreFeatures: buildAfterReplies
      .split("->")
      .map((feature) => feature.trim())
      .filter(Boolean),
    comparablePrice: signal.firstOffer,
    buildSteps: [
      `Post hook: ${signal.buyer} are already paying attention to this pain: ${signal.paidPain}.`,
      `DM target: ${signal.channels.join(", ")}.`,
      ...validationSteps,
    ],
    patternMatches: [
      `Money proof: ${signal.proof}`,
      `What sold: ${signal.whatMoneyMoved}`,
      `Market: ${signal.market}`,
      `Canonical score ${signal.score}/50`,
      `Channels: ${signal.channels.join(", ")}`,
    ],
    codeXPrompt: `Build this only after replies. Market: ${signal.market}. Buyer: ${signal.buyer}. Paid pain: ${signal.paidPain}. First offer: ${signal.firstOffer}. Build later: ${buildAfterReplies}.`,
  };
}

function getCanonicalOpportunityFields(signal: CanonicalMoneySignal) {
  const buildAfterReplies = getCanonicalBuildAfterReplies(signal);
  const validationSteps = buildDirect48hValidationPlan({
    buyer: signal.buyer,
    buildAfterReplies,
    pain: signal.paidPain,
    price: signal.firstOffer,
  });
  const postHook = `${signal.buyer} do not need a full platform first. They need ${signal.firstOffer} for this paid pain: ${signal.paidPain}.`;

  return {
    proof: signal.proof,
    whatSold: signal.whatMoneyMoved,
    pattern: signal.source,
    whyMoneyChangedHands: getDemandReason(signal.paidPain),
    buyer: signal.buyer,
    paidPain: signal.paidPain,
    firstOffer: signal.firstOffer,
    price: getManualOfferPrice(signal.firstOffer),
    postHook,
    dmScript: `Quick idea: I found this signal: ${signal.proof}. I am testing ${signal.firstOffer} manually before building anything. Want me to make one before/after sample for your case?`,
    distribution: signal.channels.join(", "),
    fortyEightHourTest: validationSteps.join("\n"),
    buildAfterReplies: buildCodexAfterRepliesLine(buildAfterReplies),
  };
}

function getDemandReason(paidPain: string) {
  const pain = normalizeDisplayText(paidPain).replace(/\.$/, "");

  return `They pay because ${pain.charAt(0).toLowerCase()}${pain.slice(1)}.`;
}

function getProvenMoneyPatternForMarket(market: MarketOption) {
  return (
    provenMoneyPatterns.find((pattern) => pattern.suggestedPaths.includes(market)) ||
    provenMoneyPatterns[0]!
  );
}

function getProvenMoneyPatternForSignal(signal: BuildSignal) {
  return provenMoneyPatterns.find((pattern) =>
    [signal.id, signal.sourceTitle, signal.latestSignal, signal.sourceNote, signal.patternMatches.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(pattern.id),
  );
}

function getPathFirstOfferPrice(market: MarketOption, sourceText: string) {
  if (/jpy|ﾂ･|farm|farmer|line/i.test(sourceText)) {
    return "JPY 9,800 one-time.";
  }

  if (market === "Micro SaaS") return "$19 one-time.";
  if (market === "Freelance Dev") return "$499 one-time.";
  if (market === "Business Automation") return "$299 one-time.";
  if (market === "Digital Product") return "$29 one-time.";
  if (market === "AI Agency") return "$49 one-time.";

  return getManualOfferPrice(sourceText);
}

function getManualOutcomeForPattern(sourceText: string) {
  if (/discord|community|faq|onboarding/i.test(sourceText)) {
    return "Clean up one messy onboarding flow, FAQ list, and member handoff into a community-ready operating pack.";
  }

  if (/demo|walkthrough|sales/i.test(sourceText)) {
    return "Turn one feature list into a clean demo script, walkthrough outline, and buyer-facing talk track.";
  }

  if (/automation|admin|handoff|intake/i.test(sourceText)) {
    return "Map one repeated admin task into a clear intake, output, and handoff checklist.";
  }

  if (/mobile|utility|daily annoyance/i.test(sourceText)) {
    return "Mock one small daily annoyance as a before/after checklist and single-screen utility plan.";
  }

  if (/seo|content|brief|keyword/i.test(sourceText)) {
    return "Turn one rough content idea into a search-friendly brief a writer can use.";
  }

  if (/farm|farmer|line|sensor|crop/i.test(sourceText)) {
    return "Organize one day of LINE messages, sensor notes, crop checks, and schedules into a clean daily operations report.";
  }

  return "Manually turn one messy buyer case into a clean before/after sample, checklist, and next-step report.";
}

function normalizeFromMoneyPattern(
  market: MarketOption,
  pattern: ProvenMoneyPattern,
): NormalizedOpportunity {
  const rule = pathOfferRules[market];
  const sourceText = `${pattern.patternTitle} ${pattern.whatSold} ${pattern.buyer} ${pattern.paidPain}`;
  const price = getPathFirstOfferPrice(market, sourceText);
  const buildAfterReplies = rule
    ? rule.buildAfterReplies(pattern)
    : pattern.buildAfterReplies;

  return {
    proofLabel: pattern.proofLabel,
    patternTitle: pattern.patternTitle,
    whatSold: pattern.whatSold,
    buyer: pattern.buyer,
    paidPain: pattern.paidPain,
    firstOfferName: pattern.smallVersion,
    firstOfferOutcome: getManualOutcomeForPattern(sourceText),
    price,
    postHook: pattern.postHook,
    dmScript: pattern.dmScript,
    validationSteps: buildDirect48hValidationPlan({
      buyer: pattern.buyer,
      buildAfterReplies,
      pain: pattern.paidPain,
      price,
    }),
    buildAfterReplies,
    selectedPath: market,
  };
}

function normalizeFromMarketOpportunity(
  market: MarketOption,
  opportunity: MarketSpecificOpportunity,
): NormalizedOpportunity {
  const sourceText = `${opportunity.firstOffer} ${opportunity.buyer} ${opportunity.paidPain} ${opportunity.whatToBuildOnlyAfterReplies}`;
  const firstOffer = buildManualFirstOffer({
    buyer: opportunity.buyer,
    candidate: opportunity.firstOffer,
    pain: opportunity.paidPain,
    price: opportunity.price,
  });
  const [firstOfferName = "Manual Cleanup Pack", firstOfferOutcome = getManualOutcomeForPattern(sourceText), price = getManualOfferPrice(sourceText)] =
    firstOffer.split("\n");

  return {
    proofLabel: opportunity.whyNow,
    patternTitle: getMarketSpecificTitle(opportunity),
    whatSold: opportunity.firstOffer,
    buyer: opportunity.buyer,
    paidPain: opportunity.paidPain,
    firstOfferName,
    firstOfferOutcome,
    price,
    postHook: opportunity.postHook,
    dmScript: `Quick idea: I am testing ${firstOfferName} for ${opportunity.buyer}. I can make one manual before/after sample before building anything. Worth seeing?`,
    validationSteps: buildDirect48hValidationPlan({
      buyer: opportunity.buyer,
      buildAfterReplies: opportunity.whatToBuildOnlyAfterReplies,
      pain: opportunity.paidPain,
      price,
    }),
    buildAfterReplies: opportunity.whatToBuildOnlyAfterReplies,
    selectedPath: market,
  };
}

function getNormalizedOpportunityForMarket(market: MarketOption) {
  const pattern = getProvenMoneyPatternForMarket(market);

  if (pathOfferRules[market]) {
    return normalizeFromMoneyPattern(market, pattern);
  }

  return normalizeFromMarketOpportunity(market, marketSpecificOpportunities[market]);
}

function getFirstOfferText(opportunity: NormalizedOpportunity) {
  return `${opportunity.firstOfferName}
${opportunity.firstOfferOutcome}
${opportunity.price}`;
}

function getMarketSpecificSignalId(market: MarketOption) {
  return `market-specific-${market.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function getMarketSpecificContextForSignal(signal: BuildSignal) {
  const market = marketOptions.find(
    (option) => signal.id === getMarketSpecificSignalId(option),
  );

  return market
    ? {
        market,
        opportunity: getNormalizedOpportunityForMarket(market),
      }
    : null;
}

function getMarketSpecificTitle(opportunity: MarketSpecificOpportunity) {
  return opportunity.firstOffer
    .replace(/^\$[\d,]+(?:\s*[a-z]+)?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildMarketSpecificSignal(market: MarketOption): BuildSignal {
  const opportunity = getNormalizedOpportunityForMarket(market);
  const firstOffer = getFirstOfferText(opportunity);

  return {
    id: getMarketSpecificSignalId(market),
    latestSignal: `${opportunity.proofLabel}: ${opportunity.whatSold}. ${opportunity.postHook}`,
    sourceTitle: opportunity.firstOfferName,
    sourceUrl: "",
    sourceType: market,
    sourceNote: opportunity.postHook,
    signalSourceLabel: market,
    buyer: opportunity.buyer,
    pain: opportunity.paidPain,
    whyNow: `${opportunity.proofLabel}: ${opportunity.whatSold}.`,
    whatYouCanBuild: opportunity.buildAfterReplies,
    coreFeatures: opportunity.buildAfterReplies
      .split("->")
      .map((feature) => feature.trim())
      .filter(Boolean),
    comparablePrice: firstOffer,
    buildSteps: [
      opportunity.postHook,
      opportunity.dmScript,
      ...opportunity.validationSteps,
    ],
    patternMatches: [
      `Money proof: ${opportunity.proofLabel}`,
      `Proven pattern: ${opportunity.patternTitle}`,
      `Selected market: ${market}`,
      opportunity.validationSteps.join(" "),
    ],
    codeXPrompt: `Build this only after someone replies, clicks, or asks for the offer. Build a mobile-first MVP for ${opportunity.buyer}. Paid pain: ${opportunity.paidPain}. First offer: ${firstOffer}. Start with: ${opportunity.buildAfterReplies}. Include launch copy, DM script, validation tracker, copy buttons, and mock data. Use local state/localStorage only. No auth, no database, no payment integration, and no external APIs.`,
  };
}

function buildMarketFallbackSignal(
  market: MarketOption,
  index: number,
  title: string,
  proof: string,
  offer: string,
): BuildSignal {
  const base = marketSpecificOpportunities[market];
  const normalized = normalizeFromMarketOpportunity(market, {
    ...base,
    whyNow: proof,
    firstOffer: offer,
  });
  const firstOffer = getFirstOfferText(normalized);

  return {
    id: `market-fallback-${market.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    latestSignal: proof,
    sourceTitle: title,
    sourceUrl: "",
    sourceType: market,
    sourceNote: normalized.postHook,
    signalSourceLabel: market,
    buyer: normalized.buyer,
    pain: normalized.paidPain,
    whyNow: proof,
    whatYouCanBuild: normalized.buildAfterReplies,
    coreFeatures: normalized.buildAfterReplies
      .split("->")
      .map((feature) => feature.trim())
      .filter(Boolean),
    comparablePrice: firstOffer,
    buildSteps: [normalized.postHook, normalized.dmScript, ...normalized.validationSteps],
    patternMatches: [
      `Money proof: ${normalized.proofLabel}`,
      `Market: ${market}`,
      normalized.validationSteps.join(" "),
    ],
    codeXPrompt: `Build this only after replies. Market: ${market}. Buyer: ${normalized.buyer}. Pain: ${normalized.paidPain}. First offer: ${firstOffer}. Build later: ${normalized.buildAfterReplies}.`,
  };
}

function getStaticMoneySignalsForMarket(market: MarketOption): BuildSignal[] {
  const canonicalSignals = canonicalMoneySignals
    .filter((signal) => signal.market === market)
    .sort((a, b) => b.score - a.score)
    .map(buildCanonicalMoneySignal);

  if (canonicalSignals.length >= 3) {
    return canonicalSignals.slice(0, 3);
  }

  return [...canonicalSignals, buildMarketSpecificSignal(market)].slice(0, 3);
}

const nextActionOptions: Array<{
  action: NextAction;
  label: string;
  helper: string;
}> = [
  {
    action: "post",
    label: "Turn into X post",
    helper: "Convert the brief into one demand-test post.",
  },
  {
    action: "sell",
    label: "Turn into 3-slide carousel",
    helper: "Convert the brief into a short validation carousel.",
  },
  {
    action: "dm",
    label: "Turn into DM",
    helper: "Convert the brief into one buyer-specific DM.",
  },
  {
    action: "build",
    label: "Copy to Codex",
    helper: "Codex-ready MVP prompt and scope.",
  },
];

type DailyGoal =
  | "Get replies today"
  | "Find a buyer"
  | "Test a $99 offer"
  | "Validate a micro SaaS"
  | "Create launch assets"
  | "Get a Codex build prompt";

type BuyerPreference =
  | "Developers"
  | "Creators"
  | "Local businesses"
  | "Ecommerce"
  | "Agencies"
  | "Indie founders";

type MonetizationPreference =
  | "Manual service"
  | "Micro SaaS"
  | "Prompt pack"
  | "Setup offer"
  | "Content product";

type TransformType =
  | "X Post"
  | "3-slide Carousel"
  | "Buyer DM"
  | "TikTok Script"
  | "Landing Page Copy"
  | "Codex Prompt"
  | "Validation Plan";

type AngleOutputMode =
  | "X post"
  | "Buyer DM"
  | "5-slide carousel outline"
  | "Free pack outline"
  | "Codex proof asset prompt";

type MoneyMoveAngle = {
  id: string;
  title: string;
  hook: string;
  output: string;
  nextAction: string;
  defaultMode: AngleOutputMode;
};

type MoneyMoveMetadata = {
  offerType: string;
  painType: string;
  proofAssetType: string;
  distributionChannel: string;
  buildGate: string;
  fingerprint: string;
};

type MoneyMoveOfferFields = {
  firstOfferName: string;
  offerDescription: string;
  deliverables: string[];
  price: string;
};

type MoneyMoveQualityLabel =
  | "Strong Money Move"
  | "Needs polish"
  | "Weak / too generic";

type MoneyMoveQuality = {
  label: MoneyMoveQualityLabel;
  reasons: string[];
  score: number;
};

type RemixType =
  | "Make it simpler"
  | "Make it premium"
  | "Make it local"
  | "Make it for developers"
  | "Make it for creators"
  | "Turn it into a $99 service"
  | "Turn it into a $9.99/mo product";

type ValidationQueueStatus =
  | "Draft"
  | "Ready"
  | "Posted"
  | "Got Replies"
  | "Paid Interest"
  | "Winner"
  | "Build"
  | "Drop";

type ValidationQueueItem = {
  id: string;
  signalTitle: string;
  outputType: TransformType | "Business Start Pack";
  buyer: string;
  offer: string;
  output: string;
  status: ValidationQueueStatus;
  views: number;
  likes: number;
  saves: number;
  replies: number;
  dms: number;
  paidInterest: number;
  notes: string;
  winner: boolean;
};

type BusinessStartPack = {
  angleName: BusinessAngleName;
  businessName: string;
  buyer: string;
  paidPain: string;
  firstOffer: string;
  price: string;
  xPost: string;
  carousel: string;
  dmScript: string;
  freeLeadMagnet: string;
  validationPlan: string;
  buildDropRule: string;
  codexMvpPrompt: string;
};

type BusinessOfferType =
  | "audit"
  | "setup service"
  | "micro SaaS"
  | "template pack"
  | "agency offer";

type BusinessChannel = "X" | "TikTok" | "Instagram" | "LinkedIn" | "DM";
type BusinessTone = "direct" | "premium" | "beginner-friendly" | "contrarian";
type BusinessDifficulty = "simple" | "medium" | "advanced";
type BusinessAngleName = "Safe angle" | "Aggressive angle" | "Premium angle" | "Beginner angle" | "Agency angle";

type BusinessStartControls = {
  targetBuyer: string;
  offerType: BusinessOfferType;
  pricePoint: string;
  channel: BusinessChannel;
  tone: BusinessTone;
  difficulty: BusinessDifficulty;
};

type BilionIntentEventName =
  | "copy_today_offer_test"
  | "add_to_validation_queue"
  | "click_unlock_bilion_pro"
  | "copy_x_post"
  | "copy_buyer_dm"
  | "copy_codex_prompt"
  | "mark_queue_item_winner";

type BilionIntentEventPayload = {
  selectedSignalTitle: string;
  buyer: string;
  userGoal: DailyGoal;
  monetizationStyle: MonetizationPreference;
  hasProAccess: boolean;
};

const dailyGoalOptions: DailyGoal[] = [
  "Get replies today",
  "Find a buyer",
  "Test a $99 offer",
  "Validate a micro SaaS",
  "Create launch assets",
  "Get a Codex build prompt",
];

const buyerPreferenceOptions: BuyerPreference[] = [
  "Developers",
  "Creators",
  "Local businesses",
  "Ecommerce",
  "Agencies",
  "Indie founders",
];

const monetizationPreferenceOptions: MonetizationPreference[] = [
  "Manual service",
  "Micro SaaS",
  "Prompt pack",
  "Setup offer",
  "Content product",
];

const transformOptions: TransformType[] = [
  "X Post",
  "Buyer DM",
  "Codex Prompt",
  "3-slide Carousel",
  "TikTok Script",
  "Landing Page Copy",
  "Validation Plan",
];

const remixOptions: RemixType[] = [
  "Make it simpler",
  "Make it premium",
  "Make it local",
  "Make it for developers",
  "Make it for creators",
  "Turn it into a $99 service",
  "Turn it into a $9.99/mo product",
];

const validationQueueStatuses: ValidationQueueStatus[] = [
  "Draft",
  "Ready",
  "Posted",
  "Got Replies",
  "Paid Interest",
  "Winner",
  "Build",
  "Drop",
];

const businessOfferTypes: BusinessOfferType[] = [
  "audit",
  "setup service",
  "micro SaaS",
  "template pack",
  "agency offer",
];

const businessChannels: BusinessChannel[] = ["X", "TikTok", "Instagram", "LinkedIn", "DM"];
const businessTones: BusinessTone[] = ["direct", "premium", "beginner-friendly", "contrarian"];
const businessDifficulties: BusinessDifficulty[] = ["simple", "medium", "advanced"];
const businessAngleNames: BusinessAngleName[] = [
  "Safe angle",
  "Aggressive angle",
  "Premium angle",
  "Beginner angle",
  "Agency angle",
];

const angleOutputModes: AngleOutputMode[] = [
  "X post",
  "Buyer DM",
  "5-slide carousel outline",
  "Free pack outline",
  "Codex proof asset prompt",
];

type SavedSignal = {
  id: string;
  createdAt: string;
  sourceTitle: string;
  buyer: string;
  pain: string;
  whyNow: string;
  coreFeatures: string[];
  comparablePrice: string;
  buildSteps: string[];
  patternMatches: string[];
  fullCodeXPrompt: string;
  latestSignal: string;
  whatYouCanBuild: string;
  sourceUrl: string;
  sourceType: string;
  sourceNote: string;
};

type MasterPrompt = {
  angleLabel: string;
  promptTitle: string;
  originalCase: string;
  provenPattern: string;
  whyItSold: string;
  marketProof: {
    comparablePattern: string;
    revenueOrPricingSignal: string;
    whyBuyersPay: string;
    distributionChannel: string;
    evidenceStrength: "Strong" | "Medium" | "Directional";
    note: string;
  };
  whoPays: string;
  yourProductAngle: string;
  firstPaidOffer: string;
  buyer: string;
  pain: string;
  revenueSignal: string;
  distributionChannel: string;
  productAngle: string;
  whatToBuild: string;
  firstVersion: string;
  price: string;
  leadMagnet: string;
  launchCopy: {
    xPost: string;
    lpHeadline: string;
    dmMessage: string;
  };
  firstCustomerPlan: {
    whoToContactFirst: string;
    whereToFindThem: string;
    whatToSay: string;
    whatToOffer: string;
    validationWithin48h: string;
  };
  coreFeatures: string[];
  validationPlan: string[];
  buildSteps: string[];
  uxStructure: string[];
  dataModel: string[];
  copyExportBehavior: string[];
  constraints: string[];
  fullCodeXMasterPrompt: string;
  aiReveal?: AiOpportunityReveal;
};

type HighQualityBusinessSpark = {
  path: string;
  sparkTitle: string;
  whyItWorks: string;
  buyer: string;
  pain: string;
  firstOffer: string;
  distributionChannel?: string;
  dmTarget?: string;
  fortyEightHourTest: string[];
  launchPost: string;
  dmScript: string;
  codexPromptPreview: string;
  codexBuildPrompt: string;
};

const highQualityBusinessSparks: HighQualityBusinessSpark[] = [
  {
    path: "Business Automation",
    sparkTitle: "Invoice Follow-up Sprint",
    whyItWorks:
      "Freelancers hate chasing overdue invoices. AI can turn invoice status and client context into polite follow-up emails while keeping the owner in control.",
    buyer: "Freelancers and solo agencies",
    pain: "Invoice follow-up is awkward, easy to postpone, and scattered across email and spreadsheets.",
    firstOffer:
      "$500 setup + $150/month. Set up a simple overdue invoice follow-up workflow.",
    fortyEightHourTest: [
      "Create one before/after sample from a messy overdue invoice note.",
      "Send it to 20 freelancers or solo agencies.",
      "Build only if people reply, click, or ask for the workflow.",
    ],
    launchPost:
      "Freelancers lose money because invoice follow-up is awkward. A simple offer: Invoice Follow-up Sprint. Turn overdue invoice notes into polite follow-up emails and a simple tracker. $500 setup + $150/month. Build after replies.",
    dmScript:
      "Quick idea: I am testing an invoice follow-up workflow for freelancers. It turns overdue invoice details into polite follow-up emails and a simple tracker. Want me to send a before/after sample?",
    codexPromptPreview:
      "Build a mobile-first invoice follow-up MVP for freelancers. Include invoice input, generated follow-up email, saved records, and copy buttons.",
    codexBuildPrompt:
      "Build this only after someone replies, clicks, or asks for the offer. Build a mobile-first MVP called Invoice Follow-up Sprint for freelancers and solo agencies. The tool helps users paste overdue invoice details, generate polite follow-up emails, track follow-up status, and copy next actions. Use Next.js, React, and TypeScript. Use local state and localStorage only. No auth, no database, no external APIs, no payment integration. Include screens for landing/offer, invoice input form, generated email output, saved follow-up records, and validation panel. Input fields: client name, invoice amount, due date, days overdue, relationship tone, previous follow-up status, context notes. Outputs: subject line, polite follow-up email, priority, next action, internal note. Include 3 mock invoices. Add copy buttons. Make the UI mobile-first with no horizontal scroll. Include a validation panel with DM script, 48-hour test, kill criteria, and first offer. Done criteria: it should feel like a demo-ready internal tool that can be shown to freelancers before building a real SaaS.",
  },
  {
    path: "Business Automation",
    sparkTitle: "Field Notes to Reports",
    whyItWorks:
      "Contractors already write daily updates from messy notes, photos, and texts. AI can turn that scattered input into a consistent client-ready report.",
    buyer: "Small contractors and field service teams",
    pain: "Daily reports are copied from texts, photos, and messy site notes.",
    firstOffer: "$49/month jobsite report generator.",
    fortyEightHourTest: [
      "Create one before/after daily report sample.",
      "Send it to 10 small contractors.",
      "Build only if they ask for weekly reports or a reusable tool.",
    ],
    launchPost:
      "Small contractors still turn messy field notes into daily reports by hand. Launch Assets: Field Notes to Reports. Buyer: small contractors. Offer: $49/month jobsite report generator. Test it with one before/after report before building.",
    dmScript:
      "Quick idea: I am testing a workflow that turns messy jobsite notes into clean daily reports. Want me to turn one sample note into a client-ready report?",
    codexPromptPreview:
      "Build a mobile-first daily report generator for small contractors with note input, generated report, saved reports, and copy/export actions.",
    codexBuildPrompt:
      "Build this only after someone replies, clicks, or asks for the offer. Build a mobile-first MVP called Field Notes to Reports for small contractors. The tool turns messy jobsite notes into client-ready daily reports. Use Next.js, React, and TypeScript. Use local state and localStorage only. No auth, no database, no external APIs. Include screens for offer overview, report input, generated report, saved reports, and validation panel. Inputs: jobsite name, date, crew, weather, work completed, blockers, materials, safety notes, client notes. Outputs: daily report summary, work completed section, issues section, next steps, client-ready message. Include 3 mock reports. Add copy/export buttons. Mobile-first UI. Include validation panel with DM script, 48-hour test, kill criteria, and first offer.",
  },
  {
    path: "Local Business",
    sparkTitle: "Review Reply Copilot",
    whyItWorks:
      "Local businesses know reviews matter, but writing replies is repetitive and easy to delay. AI can create polite, brand-safe responses quickly.",
    buyer: "Restaurants, clinics, salons, and local shops",
    pain: "Owners know reviews matter, but replying is repetitive and easy to delay.",
    firstOffer: "$500 setup + $150/month managed review reply workflow.",
    fortyEightHourTest: [
      "Rewrite 5 real reviews for local owners.",
      "Send the before/after samples.",
      "Build only if they want the next month handled.",
    ],
    launchPost:
      "Local businesses lose trust when reviews sit unanswered. Launch Assets: Review Reply Copilot. Buyer: restaurants, clinics, salons. Offer: $500 setup + $150/month. Test by rewriting 5 reviews before building.",
    dmScript:
      "Quick idea: I rewrote a few review replies for local businesses using a simple AI workflow. Want me to send 5 before/after examples for your reviews?",
    codexPromptPreview:
      "Build a mobile-first review reply tool with review input, tone selection, generated replies, saved examples, and copy buttons.",
    codexBuildPrompt:
      "Build this only after someone replies, clicks, or asks for the offer. Build a mobile-first MVP called Review Reply Copilot for local service businesses. The tool helps owners paste customer reviews and generate polite, brand-safe replies. Use Next.js, React, and TypeScript. Use local state and localStorage only. No auth, no database, no external APIs. Screens: offer overview, review input, generated reply output, saved replies, validation panel. Inputs: business type, review text, star rating, tone, owner note. Outputs: short reply, warm reply, recovery reply, internal note. Include 5 mock reviews. Add copy buttons. Mobile-first UI. Include validation panel with DM script, 48-hour test, kill criteria, and first offer.",
  },
  {
    path: "Micro SaaS",
    sparkTitle: "Name Tracing Worksheets",
    whyItWorks:
      "Parents and teachers already pay for printable learning materials. A simple generator can turn a child's name into a personalized worksheet.",
    buyer: "Parents, preschool teachers, and homeschool creators",
    pain: "They want personalized worksheets but do not want to design them manually.",
    firstOffer: "$9 one-time or $5/month custom worksheet generator.",
    fortyEightHourTest: [
      "Post 3 worksheet examples.",
      "Offer custom samples to 20 parent or teacher creators.",
      "Build only if people request their own worksheet.",
    ],
    launchPost:
      "Tiny SaaS idea: personalized name tracing worksheets. Buyer: parents and preschool teachers. Offer: $9 one-time or $5/month. Test with 3 examples before building.",
    dmScript:
      "Quick idea: I am testing custom name tracing worksheets for parents and teachers. Want me to make one free sample and see if it is useful?",
    codexPromptPreview:
      "Build a simple worksheet generator with name input, style options, preview, and download/copy actions.",
    codexBuildPrompt:
      "Build this only after someone replies, clicks, or asks for the offer. Build a mobile-first MVP called Name Tracing Worksheets. The tool lets parents and teachers enter a child's name and generate a printable tracing worksheet. Use Next.js, React, and TypeScript. Use local state only. No auth, no database, no external APIs, no payment integration. Screens: landing/offer, worksheet form, worksheet preview, saved examples, validation panel. Inputs: child name, letter size, line style, number of rows, theme. Outputs: printable worksheet preview and copy/download placeholder. Include 3 sample names. Mobile-first UI. Include validation panel with launch post, DM script, 48-hour test, kill criteria, and first offer.",
  },
  {
    path: "AI Agency",
    sparkTitle: "AI Workflow Setup Pack",
    whyItWorks:
      "AI consultants need reusable workflow templates instead of rebuilding every client delivery from scratch.",
    buyer: "AI consultants, automation agencies, and internal AI leads",
    pain: "They need reusable client workflow templates instead of one-off AI demos.",
    firstOffer: "$29 template pack or $199 setup.",
    fortyEightHourTest: [
      "Post 3 workflow examples.",
      "DM 20 AI consultants.",
      "Build only if they ask for the template pack or setup help.",
    ],
    launchPost:
      "AI agency idea: do not sell vague chatbot setups. Sell a client delivery setup pack. Buyer: AI consultants. Offer: $29 template pack or $199 setup. Test with 3 examples before building.",
    dmScript:
      "Quick idea: I am testing an AI workflow setup pack for consultants. It turns client use cases into reusable workflow templates. Want me to send an example?",
    codexPromptPreview:
      "Build a workflow template generator for AI consultants with client type, process, pain, output, and proposal sections.",
    codexBuildPrompt:
      "Build this only after someone replies, clicks, or asks for the offer. Build a mobile-first MVP called AI Workflow Setup Pack for AI consultants and automation agencies. The tool turns client use cases into reusable workflow templates. Use Next.js, React, and TypeScript. Use local state and localStorage only. No auth, no database, no external APIs. Screens: offer overview, workflow input, generated workflow, saved templates, validation panel. Inputs: client type, workflow name, current tools, pain, desired outcome, delivery format. Outputs: workflow map, implementation steps, proposal copy, delivery checklist. Include 3 mock client workflows. Add copy buttons. Mobile-first UI. Include validation panel with DM script, 48-hour test, kill criteria, and first offer.",
  },
];

type AiOpportunityReveal = {
  heroSummary: {
    title: string;
    signal: string;
    aha: string;
    buyer: string;
    price: string;
    firstWedge: string;
  };
  whyThisMatters: {
    holyShit: string;
    whatEveryoneMisses: string;
    moneyAngle: string;
    marketShift: string;
  };
  opportunityScore: {
    total: number;
    buyerUrgency: number;
    painFrequency: number;
    distributionEase: number;
    speedToValidate: number;
    buildComplexity: number;
    reason: string;
  };
  carousel: Array<{
    slide: number;
    title: string;
    body: string;
  }>;
  sellThisFirst: {
    whoBuys: string;
    firstOffer: string;
    price: string;
    whereToFindThem: string;
    dmScript: string;
    xPost: string;
  };
  attack48h: string[];
  buildAfterReplies: {
    doNotBuildYet: string;
    buildOnlyIf: string;
    mvpScope: string;
    codexPrompt: string;
  };
  evidence: {
    whatIsFact: string[];
    whatIsInference: string[];
    risk: string;
    confidence: "High" | "Medium" | "Low";
  };
};

/*
const lockedItems = [
  "Core Features locked",
  "Comparable Price locked",
  "Full Code X Prompt locked",
  "Pattern Matches locked",
];
*/

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEZY_CHECKOUT_URL || "";
const SAVED_SIGNALS_STORAGE_KEY = "bilion.savedSignals";
const DISTRIBUTION_QUEUE_STORAGE_KEY = "bilion.distributionQueue";
const VALIDATION_RECORDS_STORAGE_KEY = "bilion.validationRecords";
const EVIDENCE_DRAFTS_STORAGE_KEY = "bilion.evidenceDrafts";
const APPROVED_EVIDENCE_STORAGE_KEY = "bilion.approvedEvidenceSignals";
const RAW_SIGNAL_INBOX_STORAGE_KEY = "bilion_raw_signals";
const CANDIDATE_MONEY_SIGNALS_STORAGE_KEY = "bilion_candidate_money_signals";
const APPROVED_MONEY_SIGNALS_STORAGE_KEY = "bilion_approved_money_signals";
const SEEN_SIGNAL_IDS_STORAGE_KEY = "bilion_seen_signal_ids";
const SAVED_SIGNAL_IDS_STORAGE_KEY = "bilion_saved_signal_ids";
const WINNER_SIGNAL_IDS_STORAGE_KEY = "bilion_winner_signal_ids";
const REJECTED_SIGNAL_IDS_STORAGE_KEY = "bilion_rejected_signal_ids";
const LAUNCH_QUEUE_STORAGE_KEY = "bilion_launch_queue";
const FREE_GENERATION_LIMIT = 3;
const FREE_USAGE_STORAGE_KEY_EN = "bilion_free_generation_count_en";
const MAX_SAVED_SIGNALS = 10;
const GITHUB_SAMPLE_ACTIVITY =
  "Repo: open-analytics/warehouse-dashboard. 8.4k stars, +420 this month. Repeated issues ask for setup help around environment variables, warehouse permissions, first dashboard import, and missing onboarding docs. Maintainers answer duplicate setup questions every week. Consultants mention trial users dropping before first dashboard.";

const masterPromptAngles = [
  {
    label: "Micro SaaS",
    price: "$29/month",
    promptTitle: (signal: BuildSignal) =>
      `${workflowBrandName(signal)} SaaS for ${titleCase(compactBuyer(signal))}`,
    buyer: (signal: BuildSignal) =>
      `${signal.buyer || "Niche operators"} who repeat ${workflowName(signal)} every week and want a small subscription app that keeps the work organized.`,
    pain: (signal: BuildSignal) =>
      `${signal.pain || "The workflow is manual, repeated, and easy to lose track of."} The SaaS pain is that the buyer needs one reliable place to capture inputs, generate the output, save records, and reuse the result next week.`,
    productAngle: (signal: BuildSignal) =>
      `A small subscription app for ${compactBuyer(signal)} that turns ${workflowInput(signal)} into ${workflowOutcome(signal)}.`,
    firstVersion: (signal: BuildSignal) =>
      `A subscription-style app with one focused input flow, ${featureSummary(signal)}, saved records, a simple dashboard, and copy/export actions.`,
    validationPlan: (signal: BuildSignal) => [
      `Create a one-page landing page for ${compactBuyer(signal)} showing the messy input and the saved output.`,
      `Record a 90-second demo of ${workflowName(signal)} moving from input to generated result to saved record.`,
      "Send the demo to 20 niche operators and ask for 3 paid beta users at $29/month.",
    ],
    buildInstruction:
      "Tell Code X to build a small subscription-style app with input, saved records, dashboard, generated outputs, and copy/export.",
  },
  {
    label: "Local business tool",
    price: "$199 setup + $29/month",
    promptTitle: (signal: BuildSignal) =>
      workflowConsoleName(signal),
    buyer: (signal: BuildSignal) =>
      `${signal.buyer || "Local operators"} who need practical admin relief, faster response speed, and a tool staff can use during the workday.`,
    pain: (signal: BuildSignal) =>
      `${signal.pain || "Admin work is scattered across messages, notes, and memory."} The local tool pain is urgent, operational, and staff-facing: the buyer needs the next action to be clear without adopting a complex platform.`,
    productAngle: (signal: BuildSignal) =>
      `A practical operator dashboard for ${compactBuyer(signal)} that turns ${workflowInput(signal)} into ${workflowOutcome(signal)} for faster daily handoffs.`,
    firstVersion: (signal: BuildSignal) =>
      `One local-operator dashboard with sample jobs or requests, ${featureSummary(signal)}, status controls, staff notes, and copyable summaries.`,
    validationPlan: (signal: BuildSignal) => [
      `Contact 15 local operators similar to ${compactBuyer(signal)} with a before/after sample.`,
      `Show how one messy ${workflowName(signal)} input becomes a staff-ready output.`,
      "Offer a 48-hour setup at $199 setup + $29/month and ask what would make it usable by staff tomorrow.",
    ],
    buildInstruction:
      "Tell Code X to build a practical local operator dashboard focused on one urgent admin workflow.",
  },
  {
    label: "AI workflow tool",
    price: "$49/month",
    promptTitle: (signal: BuildSignal) =>
      `${workflowInputTitle(signal)} to ${workflowOutputTitle(signal)} AI Workflow`,
    buyer: (signal: BuildSignal) =>
      `${signal.buyer || "Operators and internal teams"} who already have messy inputs and need AI to turn them into structured decisions, summaries, and next actions.`,
    pain: (signal: BuildSignal) =>
      `${signal.pain || "Messy inputs take too long to structure by hand."} The workflow-tool pain is the gap between raw notes and a clean operational output people can act on.`,
    productAngle: (signal: BuildSignal) =>
      `An AI workflow layer for ${compactBuyer(signal)} that turns ${workflowInput(signal)} into ${workflowOutcome(signal)} with classification, next actions, and saved history.`,
    firstVersion: (signal: BuildSignal) =>
      `A paste/import workflow with AI-style classification, generated structured output, ${featureSummary(signal)}, saved history, and export actions.`,
    validationPlan: () => [
      "Find 10 target users who already do this workflow manually each week.",
      "Ask each user for one real anonymized input and run it through the prototype.",
      "Measure whether the generated output is good enough to justify $49/month before adding more features.",
    ],
    buildInstruction:
      "Tell Code X to build an AI workflow layer that turns messy inputs into structured outputs and next actions.",
  },
  {
    label: "Prompt pack",
    price: "$19 one-time",
    promptTitle: (signal: BuildSignal) =>
      `${workflowOutputTitle(signal)} Prompt System for ${titleCase(compactBuyer(signal))}`,
    buyer: (signal: BuildSignal) =>
      `Builders, freelancers, operators, and consultants who need repeatable AI outputs for ${workflowName(signal)} without designing the prompt system themselves.`,
    pain: () =>
      "Generic prompts produce inconsistent output, and users need a commercial prompt system with examples, usage notes, and before/after results.",
    productAngle: (signal: BuildSignal) =>
      `A curated prompt system for ${compactBuyer(signal)} that uses reusable prompts, examples, and before/after outputs to produce ${workflowOutcome(signal)}.`,
    firstVersion: (signal: BuildSignal) =>
      `A digital product with 15 prompts, example inputs, before/after outputs, usage instructions, and copy buttons organized around ${workflowName(signal)}.`,
    validationPlan: () => [
      "Create 5 public sample prompts with before/after screenshots.",
      "Publish a simple checkout-ready page with the full prompt pack positioned at $19 one-time.",
      "Send the samples to 30 builders or consultants and ask for 5 purchases or explicit objections.",
    ],
    buildInstruction:
      "Tell Code X to build a sellable prompt-pack product page with prompts, examples, before/after outputs, and copy buttons.",
  },
  {
    label: "Agency service",
    price: "$500 setup + $150/month",
    promptTitle: (signal: BuildSignal) =>
      `Done-for-You ${workflowOutputTitle(signal)} Setup`,
    buyer: (signal: BuildSignal) =>
      `Businesses that want ${workflowOutcome(signal)} but do not want to buy, configure, or maintain software themselves.`,
    pain: (signal: BuildSignal) =>
      `${signal.pain || "The business wants the outcome but lacks time to implement a new process."} The agency-service pain is that the buyer wants the result delivered for them, not another tool to manage.`,
    productAngle: (signal: BuildSignal) =>
      `A done-for-you service for ${compactBuyer(signal)} that uses AI behind the scenes to turn ${workflowInput(signal)} into ${workflowOutcome(signal)} on a recurring basis.`,
    firstVersion: (signal: BuildSignal) =>
      `A service landing page plus internal delivery workflow with client intake, before/after sample output, fulfillment checklist, ${featureSummary(signal)}, and proposal copy.`,
    validationPlan: () => [
      "Create one before/after sample that shows the messy input and the polished deliverable.",
      "Send the sample to 20 likely buyers with a clear $500 setup + $150/month offer.",
      "Ask which part they would want done for them this week and use replies to refine the service package.",
    ],
    buildInstruction:
      "Tell Code X to build a service landing page plus internal delivery workflow for a done-for-you implementation service.",
  },
];

const buildSignals: BuildSignal[] = [
  {
    id: "hokkaido-farm-ops",
    latestSignal:
      "A Japanese farmer in Hokkaido uses ChatGPT and Codex to automate practical farm work, including greenhouse temperature checks, LINE-based remote controls, field data, schedules, sensor logs, and crop troubleshooting.",
    sourceTitle:
      "Japanese farmer uses ChatGPT and Codex to automate farm operations",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A practical AI use case from a local operator using AI as an always-available engineer.",
    buyer: "Small farms and local field businesses",
    pain:
      "Tasks, logs, schedules, and sensor checks are scattered across daily operations.",
    whyNow:
      "Local operators already use chat tools, while AI coding tools make small internal workflow apps fast to prototype.",
    whatYouCanBuild:
      "A LINE-based operations bot for small farms or local field businesses.",
    coreFeatures: [
      "Check today's tasks",
      "Add a work log",
      "Check greenhouse temperature from mock sensor data",
      "Show the next task for a field",
      "Simple admin screen for tasks and fields",
    ],
    comparablePrice:
      "Simple internal automation tools can be sold as setup fee + monthly maintenance. A realistic starting reference is JPY 49,800 setup + JPY 9,800/month or $299 setup + $29/month.",
    buildSteps: [
      "Create a small database for fields, tasks, work logs, and sensor readings.",
      "Build a simple LINE webhook or mock chat interface.",
      "Add commands for today's tasks, add log, greenhouse temperature, and next field task.",
      "Add mock sensor data first.",
      "Add a minimal admin page to edit fields and tasks.",
    ],
    patternMatches: [
      "Agriculture",
      "Construction",
      "Property Management",
      "Local Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Farm Operations Chat Console

Goal:
Help small farms and local field businesses manage daily tasks, work logs, fields, and mock greenhouse sensor readings from one simple operations dashboard.

Target user:
Small farm owners, greenhouse operators, local field teams, and hands-on managers who need a lightweight daily operations tool.

Core workflow:
1. The user selects a mock field or greenhouse.
2. The user checks today's task list and mock sensor readings.
3. The user sends or selects a mock chat command.
4. The app shows the matching task, field, sensor, or next-action response.
5. The user adds a work log.
6. The user can copy the chat summary or saved work log.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include a mock chat panel with commands for today's tasks, add log, greenhouse temperature, and next field task.
- Include a field selector, today's tasks, mock sensor readings, work log form, saved work logs, and simple admin controls for task status.
- Include preview/output sections for chat responses and daily work summaries.
- Include save/copy buttons for generated responses and work logs.
- Include at least 3 mock fields or greenhouse areas with realistic tasks, readings, and statuses.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "clinic-call-triage",
    latestSignal:
      "Small clinics are using AI assistants to summarize phone inquiries, extract patient intent, and route routine requests before staff follow up.",
    sourceTitle: "Clinic teams use AI to triage routine front-desk requests",
    sourceUrl: "",
    sourceType: "AI Use Case",
    sourceNote:
      "A recurring operator pattern: AI structures messy intake before a human callback.",
    buyer: "Small clinics and appointment-based local offices",
    pain:
      "Front desks handle repeated calls with unclear intent, urgency, and next steps.",
    whyNow:
      "AI can structure call notes instantly, and small teams need lighter tools than full call-center software.",
    whatYouCanBuild:
      "A clinic inquiry triage tool that turns call notes into intent, urgency, and next action.",
    coreFeatures: [
      "Paste call notes",
      "Detect inquiry type",
      "Flag urgent requests",
      "Draft staff follow-up",
      "Simple dashboard for open requests",
    ],
    comparablePrice:
      "A small intake automation can start at $499 setup + $49/month for local clinics or service offices.",
    buildSteps: [
      "Create request types and urgency levels.",
      "Build a paste-in call notes screen.",
      "Generate structured intent, urgency, and next action.",
      "Add a list view for unresolved requests.",
      "Add copy buttons for staff follow-up messages.",
    ],
    patternMatches: [
      "Healthcare",
      "Dental Clinics",
      "Veterinary Offices",
      "Repair Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Clinic Inquiry Triage Desk

Goal:
Help small clinics turn messy phone inquiry notes into structured intent, urgency, next actions, and staff follow-up messages.

Target user:
Small clinics, dental offices, veterinary offices, wellness practices, and appointment-based local teams with busy front desks.

Core workflow:
1. The user selects or pastes sample call notes.
2. The user clicks "Triage Inquiry."
3. The app classifies inquiry type and urgency.
4. The app generates next actions and a staff follow-up draft.
5. The user saves the inquiry to an open requests queue.
6. The user can copy the follow-up message or mark the request resolved.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include call notes input, sample call note buttons, triage result preview, inquiry type, urgency badge, next action checklist, and follow-up message output.
- Include an open requests queue with status controls, urgency filter, and resolved state.
- Include save/copy buttons for the triage result and follow-up draft.
- Include at least 4 mock inquiry types such as appointment request, medication question, billing question, and urgent symptom.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "construction-daily-report",
    latestSignal:
      "Construction teams are using AI to turn messy site notes, photos, and chat updates into daily reports for clients and managers.",
    sourceTitle: "Construction teams use AI to turn field notes into reports",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A field-operations pattern where AI converts scattered updates into a standard report.",
    buyer: "Small contractors and field service teams",
    pain:
      "Daily updates live in chats, notebooks, and memory, making client reporting slow and inconsistent.",
    whyNow:
      "Mobile-first AI tools can turn messy notes into consistent reports without a full project management rollout.",
    whatYouCanBuild:
      "A construction daily report generator for small contractors.",
    coreFeatures: [
      "Paste jobsite notes",
      "Add weather and crew count",
      "Generate client-ready report",
      "List blockers and materials",
      "Save reports by project",
    ],
    comparablePrice:
      "A simple reporting workflow can sell for $299 setup + $29/month per small contractor team.",
    buildSteps: [
      "Create projects and daily report records.",
      "Build a notes input screen.",
      "Generate progress, blockers, materials, and next steps.",
      "Add a saved report view by project.",
      "Add copy/export buttons for sending to clients.",
    ],
    patternMatches: [
      "Construction",
      "Landscaping",
      "Property Maintenance",
      "Field Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Construction Daily Report Generator

Goal:
Create a minimal working prototype that helps small contractors turn messy jobsite notes into clean client-ready daily reports.

Target user:
Small contractors, renovation teams, landscapers, property maintenance teams, and field service operators who need to send daily progress updates to clients or managers.

Core workflow:
1. The user selects a mock project.
2. The user enters work date, weather, and crew count.
3. The user pastes messy jobsite notes.
4. The user clicks "Generate Daily Report."
5. The app turns the messy notes into a structured report.
6. The user can copy the report.
7. The user can save the report to a local saved reports list.
8. Saved reports appear immediately on the page.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample messy notes so the demo works immediately.
- Include obvious buttons for Generate, Save Report, and Copy Report.

Report output sections:
- Client-ready summary
- Progress completed today
- Blockers or risks
- Materials used or needed
- Crew and weather details
- Next steps
- Full client update message

Saved reports:
- Show saved reports below the generator.
- Each saved report should include project name, date, short summary, and full report preview.
- Saved reports only need to persist during the current session.

Sample project data:
Include at least 3 mock projects:
1. Kitchen Remodel - Tanaka Residence
2. Roof Repair - Green Valley Office
3. Parking Lot Drainage - Northside Plaza

Sample messy notes:
Include a realistic messy note example with scattered details about work completed, materials, weather, blockers, and next steps.

Acceptance criteria:
- The app loads successfully.
- The user can generate a report from the sample notes.
- The generated report has all required sections.
- The save button adds the report to the saved reports list immediately.
- The copy button copies the report text.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "property-maintenance-router",
    latestSignal:
      "Property managers are using AI to classify tenant maintenance messages, identify urgency, and prepare vendor-ready work orders.",
    sourceTitle: "Property managers use AI to route maintenance messages",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A support-operations pattern where AI turns unstructured customer messages into routed work.",
    buyer: "Small property managers and local facility operators",
    pain:
      "Tenant requests arrive with missing details, unclear urgency, and messy vendor handoff information.",
    whyNow:
      "AI classification is good enough to structure requests before a manager assigns the work.",
    whatYouCanBuild:
      "A tenant maintenance request router for small property managers.",
    coreFeatures: [
      "Paste tenant message",
      "Classify issue category",
      "Estimate urgency",
      "Generate missing-detail questions",
      "Create vendor-ready work order",
    ],
    comparablePrice:
      "Small property operators can pay $399 setup + $39/month for a lightweight maintenance coordination tool.",
    buildSteps: [
      "Define maintenance categories and urgency levels.",
      "Build a request intake screen.",
      "Generate classification, urgency, and missing questions.",
      "Create a vendor work order output.",
      "Add a simple queue for open requests.",
    ],
    patternMatches: [
      "Property Management",
      "HOA Management",
      "Facility Management",
      "Local Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Tenant Maintenance Request Router

Goal:
Help small property managers turn messy tenant messages into categorized, prioritized, vendor-ready maintenance work orders.

Target user:
Small property managers, HOA managers, facility operators, and local landlords who coordinate tenant maintenance without a large operations team.

Core workflow:
1. The user selects or pastes a sample tenant maintenance message.
2. The user clicks "Route Request."
3. The app classifies the issue category and urgency.
4. The app generates missing-detail questions and a vendor-ready work order.
5. The user saves the request to an open queue.
6. The user can copy the work order or move the request through queue statuses.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include tenant message input, sample request buttons, route request button, triage preview, category badge, urgency badge, missing-detail questions, and vendor work order output.
- Include an open request queue with category filter, status controls, and saved request cards.
- Include save/copy buttons for work orders and tenant follow-up questions.
- Include at least 5 maintenance categories such as plumbing, electrical, HVAC, appliance, and exterior.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "restaurant-shift-brief",
    latestSignal:
      "Restaurant operators are using AI to turn sales notes, staff updates, reservations, and inventory issues into shift briefs.",
    sourceTitle: "Restaurant operators use AI for clearer shift handoffs",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A shift-operations pattern where AI turns messy manager notes into a consistent handoff.",
    buyer: "Independent restaurants and shift-based local teams",
    pain:
      "Shift handoffs are informal, easy to miss, and scattered across notes, chats, reservations, and inventory issues.",
    whyNow:
      "Managers can use AI to produce a useful shift brief without adopting a heavy restaurant operations platform.",
    whatYouCanBuild:
      "A restaurant shift brief generator for independent restaurants.",
    coreFeatures: [
      "Paste manager notes",
      "Add reservations and staffing",
      "Flag stock or prep issues",
      "Generate shift brief",
      "Save briefs by date",
    ],
    comparablePrice:
      "A lightweight shift operations tool can start at $199 setup + $19/month for independent restaurants.",
    buildSteps: [
      "Create a simple shift brief data model.",
      "Build inputs for notes, reservations, staffing, and inventory issues.",
      "Generate a concise shift brief.",
      "Add saved briefs by date.",
      "Add copy buttons for sharing in chat.",
    ],
    patternMatches: [
      "Restaurants",
      "Retail",
      "Hospitality",
      "Local Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Restaurant Shift Brief Generator

Goal:
Help independent restaurant managers turn scattered notes, reservations, staffing updates, and stock issues into a clear shift handoff brief.

Target user:
Independent restaurant owners, general managers, shift leads, cafe operators, and hospitality teams that need reliable daily handoffs.

Core workflow:
1. The user enters shift date, shift type, and manager notes.
2. The user reviews sample reservations, staffing, and inventory issues.
3. The user clicks "Generate Shift Brief."
4. The app creates a concise brief for the next team.
5. The user can copy the brief.
6. The user can save the brief to a local saved briefs list.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include manager notes input, shift selector, reservations list, staffing panel, inventory/prep issue checklist, generated brief preview, and saved briefs section.
- Include output sections for service focus, reservation notes, staffing risks, stock/prep issues, and handoff message.
- Include save/copy buttons for the generated brief.
- Include at least 3 sample shifts with realistic reservations, staff notes, and inventory issues.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "local-review-reply-copilot",
    latestSignal:
      "Local operators are using AI to respond faster to customer reviews while keeping replies polite, specific, and on-brand.",
    sourceTitle: "Local businesses use AI to handle review replies",
    sourceUrl: "",
    sourceType: "AI Use Case",
    sourceNote:
      "A local-operations pattern where AI reduces repeated customer communication work.",
    buyer: "Restaurants, clinics, salons, and small shops",
    pain:
      "Owners know reviews matter, but replying consistently takes time and often gets delayed.",
    whyNow:
      "Review volume keeps growing, and AI can draft useful replies from a review, tone, and business context in seconds.",
    whatYouCanBuild:
      "A local review reply copilot for restaurants, clinics, salons, and small shops.",
    coreFeatures: [
      "Paste a customer review",
      "Choose business type and tone",
      "Generate three reply options",
      "Flag negative reviews for owner review",
      "Save reusable brand details",
    ],
    comparablePrice:
      "A small review reply workflow can start at $99 setup + $19/month for local businesses.",
    buildSteps: [
      "Create mock business profiles for restaurant, clinic, salon, and shop.",
      "Build a review input and tone selector.",
      "Generate three reply options from mock rules.",
      "Add negative review flagging.",
      "Add copy buttons and a simple saved replies area.",
    ],
    patternMatches: [
      "Restaurants",
      "Clinics",
      "Salons",
      "Small Shops",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Local Review Reply Copilot

Goal:
Help local businesses quickly draft polite, specific, on-brand replies to customer reviews while flagging negative reviews for owner attention.

Target user:
Restaurant owners, clinic managers, salon owners, small shop operators, and local service teams who need consistent review replies.

Core workflow:
1. The user selects a mock business profile.
2. The user selects or pastes a customer review.
3. The user chooses a reply tone.
4. The user clicks "Generate Replies."
5. The app generates three reply options and flags negative reviews.
6. The user can copy a reply or save it to a local saved replies list.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include business profile selector, brand detail card, review input, sample review buttons, tone selector, negative review alert, and three generated reply cards.
- Include save/copy buttons for each reply and a saved replies section.
- Include at least 4 mock business profiles and sample positive, neutral, and negative reviews.
- Include output labels that show tone, sentiment, and whether owner review is recommended.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "invoice-follow-up-assistant",
    latestSignal:
      "Freelancers and solo agencies are using AI to turn unpaid invoice context into polite follow-up messages and next-step reminders.",
    sourceTitle: "Solo operators use AI to follow up on overdue invoices",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A solo-operator pattern where AI helps with uncomfortable but recurring admin communication.",
    buyer: "Freelancers and solo agencies",
    pain:
      "Invoice follow-up is awkward, easy to postpone, and often scattered across email, spreadsheets, and accounting notes.",
    whyNow:
      "AI can draft polite follow-ups from invoice status and client context while keeping the owner in control.",
    whatYouCanBuild:
      "An invoice follow-up assistant for freelancers and solo agencies.",
    coreFeatures: [
      "Add mock invoices",
      "Filter overdue invoices",
      "Generate polite follow-up email",
      "Generate firmer second reminder",
      "Track next follow-up date",
    ],
    comparablePrice:
      "A lightweight freelancer admin assistant can start at $49 one-time or $9/month.",
    buildSteps: [
      "Create mock clients and invoices.",
      "Build overdue and due-soon filters.",
      "Generate follow-up messages by reminder stage.",
      "Add next follow-up date actions.",
      "Add copy buttons for email drafts.",
    ],
    patternMatches: [
      "Freelancers",
      "Solo Agencies",
      "Consultants",
      "Bookkeepers",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Invoice Follow-Up Assistant

Goal:
Help freelancers and solo agencies turn unpaid invoice context into polite follow-up emails, firmer reminders, and next follow-up dates.

Target user:
Freelancers, solo agencies, consultants, bookkeepers, and independent service providers who need to follow up on unpaid invoices without awkward manual drafting.

Core workflow:
1. The user views a list of mock invoices.
2. The user filters overdue or due-soon invoices.
3. The user selects an invoice.
4. The user chooses a reminder style and clicks "Generate Follow-Up."
5. The app generates an email draft and suggested next follow-up date.
6. The user can copy the email and save the follow-up note in local state.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include invoice list, overdue/due-soon filters, selected invoice details, reminder style controls, generated email preview, next follow-up date control, and saved follow-up notes.
- Include save/copy buttons for generated emails.
- Include at least 5 mock invoices with client name, amount, due date, status, reminder stage, and project context.
- Include output sections for subject line, email body, tone, and next step.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "micro-saas-ticket-triage",
    latestSignal:
      "Micro SaaS founders are using AI to categorize support tickets, detect urgency, and draft short replies before they lose focus on product work.",
    sourceTitle: "Micro SaaS founders use AI to triage support tickets",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A founder-operations pattern where AI protects maker time by structuring customer support work.",
    buyer: "Micro SaaS founders",
    pain:
      "Support tickets interrupt product work and mix bugs, billing questions, feature requests, and urgent customer issues in one queue.",
    whyNow:
      "Solo founders can use AI classification to keep support manageable without adopting a full helpdesk.",
    whatYouCanBuild:
      "A support ticket triage board for micro SaaS founders.",
    coreFeatures: [
      "Paste or load mock tickets",
      "Classify ticket type",
      "Detect urgency",
      "Draft short customer reply",
      "Move tickets across triage columns",
    ],
    comparablePrice:
      "A focused support triage tool can start at $79 one-time or $15/month for micro SaaS founders.",
    buildSteps: [
      "Create mock tickets with type, urgency, and status.",
      "Build a mobile-first triage board.",
      "Add ticket classification and urgency labels.",
      "Generate short reply drafts.",
      "Add column movement and copy buttons.",
    ],
    patternMatches: [
      "Micro SaaS",
      "Indie Hackers",
      "Productized Services",
      "Developer Tools",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Micro SaaS Support Triage Board

Goal:
Help micro SaaS founders categorize support tickets, detect urgency, draft short replies, and move requests through a lightweight triage board.

Target user:
Micro SaaS founders, indie hackers, productized service owners, and small developer-tool teams who need to manage support without a full helpdesk.

Core workflow:
1. The user views a board of mock support tickets.
2. The user selects a ticket.
3. The user clicks "Triage Ticket."
4. The app classifies type, urgency, and recommended next action.
5. The app generates a short customer reply.
6. The user can copy the reply and move the ticket across columns.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include a ticket board, ticket detail panel, ticket text preview, type selector or generated type badge, urgency badge, reply draft output, and column movement controls.
- Include columns for New, Needs Reply, Waiting, and Resolved.
- Include save/copy buttons for reply drafts and triage summaries.
- Include at least 6 mock tickets covering bugs, billing questions, feature requests, onboarding questions, and urgent customer issues.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
];

function buildResult(signal: BuildSignal): ApiResult {
  return {
    free: {
      latest_signal: signal.latestSignal,
      what_you_can_build: signal.whatYouCanBuild,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
    },
    paid: {
      latest_signal: signal.latestSignal,
      source_title: signal.sourceTitle,
      source_url: signal.sourceUrl,
      source_type: signal.sourceType,
      source_note: signal.sourceNote,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
      what_you_can_build: signal.whatYouCanBuild,
      core_features: signal.coreFeatures,
      comparable_price: signal.comparablePrice,
      build_steps: signal.buildSteps,
      pattern_matches: signal.patternMatches,
      code_x_prompt: signal.codeXPrompt,
    },
  };
}

function getAngle(index: number) {
  return masterPromptAngles[index % masterPromptAngles.length];
}

function cleanPromptSubject(signal: BuildSignal) {
  const subject = (signal.whatYouCanBuild || signal.sourceTitle || "Buildable Tool")
    .replace(/^(a|an)\s+/i, "")
    .replace(/\s+(for|to)\s+.+$/i, "")
    .replace(/\.$/, "")
    .trim();

  return subject
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function compactBuyer(signal: BuildSignal) {
  return (signal.buyer || "niche operators")
    .split(/,| and |\/| with /i)[0]
    .replace(/^small\s+/i, "")
    .trim()
    .toLowerCase();
}

function workflowName(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "shift brief";
  if (signal.id.includes("property")) return "tenant maintenance request";
  if (signal.id.includes("clinic")) return "clinic inquiry triage";
  if (signal.id.includes("construction")) return "daily jobsite report";
  if (signal.id.includes("farm")) return "farm operations brief";

  return cleanPromptSubject(signal)
    .replace(/\bGenerator\b/i, "")
    .replace(/\bRouter\b/i, "")
    .replace(/\bAssistant\b/i, "")
    .replace(/\bTool\b/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function workflowBrandName(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "ShiftBrief";
  if (signal.id.includes("property")) return "MaintRouter";
  if (signal.id.includes("clinic")) return "InquiryDesk";
  if (signal.id.includes("construction")) return "JobsiteBrief";
  if (signal.id.includes("farm")) return "FarmOps";

  return titleCase(workflowName(signal)).replace(/\s+/g, "");
}

function workflowConsoleName(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "ShiftBrief Desk";
  if (signal.id.includes("property")) return "MaintRouter Desk";
  if (signal.id.includes("clinic")) return "Clinic Triage Desk";
  if (signal.id.includes("construction")) return "SiteReport Desk";
  if (signal.id.includes("farm")) return "FarmOps Brief Desk";

  return `${workflowBrandName(signal)} Desk`;
}

function workflowInput(signal: BuildSignal) {
  const subject = workflowName(signal);

  if (signal.id.includes("restaurant")) {
    return "messy manager notes, reservation updates, staffing notes, and inventory issues";
  }
  if (signal.id.includes("property")) {
    return "messy tenant maintenance messages, photos, and missing request details";
  }
  if (signal.id.includes("clinic")) {
    return "front-desk call notes, patient questions, and follow-up requests";
  }
  if (signal.id.includes("construction")) {
    return "jobsite notes, weather updates, crew counts, and blocker notes";
  }
  if (signal.id.includes("farm")) {
    return "field tasks, greenhouse readings, work logs, and crop notes";
  }

  return `messy notes and requests around ${subject}`;
}

function workflowOutcome(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) {
    return "saved shift briefs, prep lists, blockers, and handoff summaries for independent restaurant teams";
  }
  if (signal.id.includes("property")) {
    return "categorized, urgent, vendor-ready work orders for small property managers";
  }
  if (signal.id.includes("clinic")) {
    return "triaged inquiry summaries, urgency labels, and staff follow-up drafts for small clinics";
  }
  if (signal.id.includes("construction")) {
    return "client-ready daily reports, blockers, materials lists, and next-step summaries for contractors";
  }
  if (signal.id.includes("farm")) {
    return "daily task lists, sensor summaries, field logs, and next actions for farm teams";
  }

  return `structured outputs, next actions, and saved records for ${compactBuyer(signal)}`;
}

function workflowInputTitle(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "Manager Notes";
  if (signal.id.includes("property")) return "Tenant Messages";
  if (signal.id.includes("clinic")) return "Call Notes";
  if (signal.id.includes("construction")) return "Jobsite Notes";
  if (signal.id.includes("farm")) return "Field Logs";
  return titleCase(workflowName(signal));
}

function workflowOutputTitle(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "Shift Briefs";
  if (signal.id.includes("property")) return "Vendor Work Orders";
  if (signal.id.includes("clinic")) return "Inquiry Triage";
  if (signal.id.includes("construction")) return "Daily Reports";
  if (signal.id.includes("farm")) return "Farm Ops Briefs";
  return `${titleCase(workflowName(signal))} Outputs`;
}

function featureSummary(signal: BuildSignal) {
  const features = signal.coreFeatures.length
    ? signal.coreFeatures.slice(0, 3)
    : ["structured input", "generated output", "copy-ready result"];

  return features
    .map((feature) => feature.charAt(0).toLowerCase() + feature.slice(1))
    .join(", ");
}

function normalizeLocalOnlyBuildStep(step: string) {
  return step
    .replace(
      /^Create a small database for fields, tasks, work logs, and sensor readings\.$/i,
      "Create local mock records for fields, tasks, work logs, and sensor readings using React state.",
    )
    .replace(
      /^Build a simple LINE webhook or mock chat interface\.$/i,
      "Build a mock chat-style command panel that simulates LINE-style operations without external APIs.",
    )
    .replace(/\b[Cc]reate a small database\b/g, "Create local mock records")
    .replace(/\b[Cc]reate a database\b/g, "Create local mock records")
    .replace(/\b[Bb]uild a simple LINE webhook\b/g, "Build a mock chat-style command panel");
}

function buildPromptTitle(signal: BuildSignal, angleIndex: number) {
  const angle = getAngle(angleIndex);
  return angle.promptTitle(signal);
}

function getBuyerOptions(signal: BuildSignal) {
  const options = [
    signal.buyer,
    ...signal.patternMatches.slice(0, 3).map((match) => `${match} operators`),
    "AI builders and implementation consultants",
  ]
    .map((option) => option.trim())
    .filter(Boolean);

  return Array.from(new Set(options)).slice(0, 5);
}

function getActionAngleIndex(action: NextAction) {
  if (action === "sell") {
    return 4;
  }

  if (action === "post" || action === "dm") {
    return 3;
  }

  return 2;
}

function getActionLabel(action: NextAction) {
  return nextActionOptions.find((option) => option.action === action)?.label || "Turn into X post";
}

function cleanSignalText(value: string) {
  return value
    .replace(/[\uE000-\uF8FF\uFFFD]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\u{1F000}-\u{1FAFF}]/gu, "")
    .replace(/^[\s:|/,.-]+/g, "")
    .replace(/[\s:|/,.-]+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*[:|/,-]\s*$/g, "")
    .replace(/^[\s:|/,.-]+/g, "")
    .trim();
}

function stripNewsletterPrefix(value: string) {
  return cleanSignalText(value)
    .replace(/^(what'?s new|daily|weekly|newsletter|issue\s+\d+)\s*[:|-]\s*/i, "")
    .replace(/\s*,\s*/g, " / ")
    .split("/")
    .map((part) => cleanSignalText(part))
    .filter(Boolean)
    .join(" / ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getDisplaySignalTitle(signal: BuildSignal) {
  const cleanedTitle = cleanSignalText(signal.sourceTitle);
  const isNewsletterSignal =
    signal.signalSourceLabel === "Gmail Signal" ||
    /newsletter|gmail/i.test(signal.sourceType);
  const match = cleanedTitle.match(/^(.+?)\s+(signal|newsletter)\s*:\s*(.+)$/i);

  if (isNewsletterSignal && match) {
    const publisher = cleanSignalText(match[1]);
    const subject = stripNewsletterPrefix(
      cleanSignalText(match[3]).replace(
        new RegExp(`^${escapeRegExp(publisher)}\\s*[:|-]\\s*`, "i"),
        "",
      ),
    );

    return {
      title: `${publisher} Signal`,
      detail: subject,
    };
  }

  return {
    title: cleanedTitle,
    detail: "",
  };
}

function isNewsletterSignal(signal: BuildSignal) {
  return (
    signal.signalSourceLabel === "Gmail Signal" ||
    /newsletter|gmail/i.test(`${signal.sourceType} ${signal.signalSourceLabel || ""}`)
  );
}

function isGmailSignal(signal: BuildSignal) {
  return signal.signalSourceLabel === "Gmail Signal";
}

function getSignalKey(signal: BuildSignal | string) {
  return typeof signal === "string" ? signal : signal.id;
}

function getSignalSourceKey(signal: BuildSignal) {
  return signal.signalSourceLabel || signal.sourceType || getSignalMarket(signal);
}

function getMarketClassification(signal: BuildSignal): MarketClassification {
  return getSignalMarket(signal);
}

function getSignalEvidenceLevel(signal: BuildSignal) {
  const hasPrice = /\d|\$|mrr|arr|revenue|paid|month|year/i.test(signal.comparablePrice);
  const hasPatterns = signal.patternMatches.length > 0;
  const hasSpecificSource = Boolean(signal.sourceTitle && signal.latestSignal);

  if (hasPrice && hasPatterns && hasSpecificSource) {
    return "Strong";
  }

  if ((hasPrice && hasSpecificSource) || (hasPatterns && hasSpecificSource)) {
    return "Medium";
  }

  return "Directional";
}

function getSignalOpportunityScore(signal: BuildSignal) {
  const scoreText = `${signal.sourceNote} ${signal.patternMatches.join(" ")}`;
  const inboxScore = scoreText.match(/Money signal score\s+(\d+)\/95/i);
  const canonicalScore = scoreText.match(/Canonical score\s+(\d+)\/50/i);

  if (inboxScore?.[1]) {
    return Math.min(50, Math.max(1, Math.round((Number(inboxScore[1]) / 95) * 50)));
  }

  if (canonicalScore?.[1]) {
    return Math.min(50, Math.max(1, Number(canonicalScore[1])));
  }

  const evidenceLevel = getSignalEvidenceLevel(signal);
  const evidenceScore =
    evidenceLevel === "Strong" ? 14 : evidenceLevel === "Medium" ? 10 : 7;
  const buyerScore = signal.buyer.length > 18 ? 10 : 7;
  const painScore = signal.pain.length > 32 ? 10 : 7;
  const distributionScore =
    /x|twitter|youtube|tiktok|reddit|seo|newsletter|github|community|ads/i.test(
      `${signal.sourceNote} ${signal.whyNow} ${signal.patternMatches.join(" ")}`,
    )
      ? 9
      : 6;
  const buildScore = signal.whatYouCanBuild.length > 24 ? 7 : 5;

  return Math.min(50, evidenceScore + buyerScore + painScore + distributionScore + buildScore);
}

function getTopOpportunitySignal(signals: BuildSignal[]) {
  return signals
    .slice()
    .sort((a, b) => getSignalOpportunityScore(b) - getSignalOpportunityScore(a))[0];
}

function getSignalMarket(signal: BuildSignal) {
  const explicitMarket = appMarketOptions.find(
    (market) =>
      signal.id === getMarketSpecificSignalId(market) ||
      signal.sourceType === market ||
      signal.signalSourceLabel === market,
  );

  if (explicitMarket) {
    return explicitMarket;
  }

  const haystack = [
    signal.sourceTitle,
    signal.latestSignal,
    signal.sourceType,
    signal.sourceNote,
    signal.buyer,
    signal.pain,
    signal.whyNow,
    signal.whatYouCanBuild,
    signal.patternMatches.join(" "),
  ].join(" ").toLowerCase();

  if (/healthcare|clinic|dental|therapy|appointment|patient|cancellation|voicemail/.test(haystack)) {
    return "Healthcare";
  }

  if (/agriculture|farm|farmer|greenhouse|crop|sensor log|field ops|field crew|line note|line message/.test(haystack)) {
    return "Agriculture / Field Ops";
  }

  if (/construction|contractor|jobsite|field note|daily report|roofing|remodel/.test(haystack)) {
    return "Construction";
  }

  if (/shopify|ecommerce|cart|abandoned cart|sku|product page|product description|returns?|faq|dtc|etsy/.test(haystack)) {
    return "Ecommerce";
  }

  if (/creator|newsletter|youtube|gumroad|course|audience|comment/.test(haystack)) {
    return "Creators";
  }

  if (/legal|law firm|lawyer|attorney|intake|estate|immigration/.test(haystack)) {
    return "Legal";
  }

  if (/real estate|property manager|tenant|maintenance|rental|leasing|listing|showing|open house|broker|realtor/.test(haystack)) {
    return "Real Estate";
  }

  if (/finance|bookkeeper|cfo|receipt|transaction|month-end|accountant|invoice|overdue|payment follow|cashflow|cash flow|reconciliation|expense/.test(haystack)) {
    return "Finance";
  }

  if (/developer|github|pull request|pr risk|repo|devtool|maintainer|ai agent cost|token spend|model usage|rag eval|tool-call|prompt regression/.test(haystack)) {
    return "Developer Workflow";
  }

  if (/freelance|bug|client|api integration|fix|coding service|developer service|upwork|fiverr/.test(haystack)) {
    return "Developer Workflow";
  }

  if (/restaurant|salon|review|google business|local owner|home-service|missed call|appointment|quote request|repeat customer/.test(haystack)) {
    return "Local Business";
  }

  if (/plugin|extension|template|prompt pack|script|chrome|digital product|bundle|downloadable/.test(haystack)) {
    return "Creators";
  }

  if (/automation|spreadsheet|rpa|email|report|lead|operations|handoff|admin task|manual task/.test(haystack)) {
    return "Local Business";
  }

  if (/agency|consultant|client delivery|dashboard|chatbot|internal tool|implementation/.test(haystack)) {
    return "Local Business";
  }

  return "Local Business";
}

function getTopMarketOpportunities(signals: BuildSignal[], market: MarketOption) {
  const marketSignal = buildMarketSpecificSignal(market);
  const matchedSignals = signals
    .filter((signal) => getSignalMarket(signal) === market)
    .sort((a, b) => getSignalOpportunityScore(b) - getSignalOpportunityScore(a))
    .filter((signal) => signal.id !== marketSignal.id);

  return [marketSignal, ...matchedSignals].slice(0, 3);
}

function getTopMoneySignalsForMarket(signals: BuildSignal[], market: MarketOption) {
  const matchedSignals = signals
    .filter((signal) => getSignalMarket(signal) === market)
    .sort((a, b) => getSignalOpportunityScore(b) - getSignalOpportunityScore(a));
  const fallbackSignals = getStaticMoneySignalsForMarket(market);
  const seenIds = new Set<string>();

  return [...fallbackSignals, ...matchedSignals]
    .filter((signal) => {
      if (seenIds.has(signal.id)) {
        return false;
      }

      seenIds.add(signal.id);
      return true;
    })
    .sort((a, b) => getSignalOpportunityScore(b) - getSignalOpportunityScore(a))
    .slice(0, 3);
}

function getExpectedFirstOffer(signal: BuildSignal) {
  if (/\$|month|mrr|arr|paid/i.test(signal.comparablePrice)) {
    return `${signal.comparablePrice} first offer`;
  }

  return `$19-$49 ${workflowOutputTitle(signal)} starter offer`;
}

function getOpportunityDetailFields(signal: BuildSignal) {
  if (signal.id.startsWith(getMoneySignalIdPrefix("approved"))) {
    const validationSteps = buildDirect48hValidationPlan({
      buyer: signal.buyer,
      buildAfterReplies: signal.whatYouCanBuild,
      pain: signal.pain,
      price: signal.comparablePrice,
    });

    return {
      proof: signal.latestSignal,
      whatSold: signal.whyNow,
      pattern: signal.sourceNote,
      whyMoneyChangedHands: getDemandReason(signal.pain),
      buyer: signal.buyer,
      paidPain: signal.pain,
      firstOffer: signal.comparablePrice,
      price: getManualOfferPrice(signal.comparablePrice),
      postHook: `${signal.buyer} do not need a full platform first. They need ${signal.comparablePrice} because ${signal.pain}.`,
      dmScript: `Quick idea: I found this signal: ${signal.latestSignal}. I am testing ${signal.comparablePrice} manually before building anything. Want me to make one before/after sample for your case?`,
      distribution: signal.sourceNote,
      fortyEightHourTest: validationSteps.join("\n"),
      buildAfterReplies: buildCodexAfterRepliesLine(signal.whatYouCanBuild),
    };
  }

  const canonicalSignal = getCanonicalMoneySignalForBuildSignal(signal);

  if (canonicalSignal) {
    return getCanonicalOpportunityFields(canonicalSignal);
  }

  const context = getMarketSpecificContextForSignal(signal);

  if (context) {
    const opportunity = context.opportunity;

    return {
      proof: `${opportunity.proofLabel}: ${opportunity.whatSold}`,
      whatSold: opportunity.whatSold,
      pattern: opportunity.patternTitle,
      whyMoneyChangedHands: getDemandReason(opportunity.paidPain),
      buyer: opportunity.buyer,
      paidPain: opportunity.paidPain,
      firstOffer: getFirstOfferText(opportunity),
      price: opportunity.price,
      postHook: opportunity.postHook,
      dmScript: opportunity.dmScript,
      distribution: opportunity.postHook,
      fortyEightHourTest: opportunity.validationSteps.join("\n"),
      buildAfterReplies: buildCodexAfterRepliesLine(
        opportunity.buildAfterReplies,
      ),
    };
  }

  const pattern = getProvenMoneyPatternForSignal(signal);
  const firstOffer = buildManualFirstOffer({
    buyer: signal.buyer,
    candidate: getExpectedFirstOffer(signal),
    pain: signal.pain,
    price: signal.comparablePrice,
  });

  return {
    proof: signal.latestSignal || (pattern ? `${pattern.proofLabel}: ${pattern.whatSold}` : getSignalEvidenceLevel(signal)),
    whatSold: pattern?.whatSold || signal.sourceTitle || "A narrow paid offer",
    pattern: pattern?.patternTitle || signal.sourceType || "Evidence-backed signal",
    whyMoneyChangedHands: pattern?.moneyReason || getDemandReason(signal.pain),
    buyer: signal.buyer,
    paidPain: signal.pain,
    firstOffer,
    price: getManualOfferPrice(firstOffer),
    postHook:
      pattern?.postHook ||
      `Most ${compactBuyer(signal)} do not need a full platform first. They need one messy case cleaned up.`,
    dmScript:
      pattern?.dmScript ||
      `Quick idea: I can clean up one messy case for ${compactBuyer(signal)} before building anything. Want to see a sample?`,
    distribution:
      signal.patternMatches[2] ||
      signal.sourceNote ||
      "Post the insight, then DM likely buyers.",
    fortyEightHourTest: buildDirect48hValidationPlan({
      buyer: signal.buyer,
      buildAfterReplies: signal.whatYouCanBuild,
      pain: signal.pain,
      price: firstOffer,
    }).join("\n"),
    buildAfterReplies: buildCodexAfterRepliesLine(signal.whatYouCanBuild),
  };
}

function getOutputPackProductName(firstOffer: string) {
  const firstLine = firstOffer
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || "Validation Offer";

  return firstLine
    .replace(/^\$[\d,]+(?:-\$?[\d,]+)?\s*/i, "")
    .replace(/^JPY\s?[\d,]+\s*/i, "")
    .replace(/\s+(one-time|setup|monthly|\/month).*$/i, "")
    .trim() || "Validation Offer";
}

function getOutputPackBuildScope(detail: ReturnType<typeof getOpportunityDetailFields>) {
  return detail.buildAfterReplies
    .replace(/^Build after replies\.\s*/i, "")
    .replace(/^If\s+3\s+buyers\s+reply,\s*/i, "")
    .trim() || "a small tool that creates the same manual output faster";
}

function getMoneyMoveMetadata(
  signal: BuildSignal,
  detail: ReturnType<typeof getOpportunityDetailFields>,
): MoneyMoveMetadata {
  const haystack = [
    signal.sourceTitle,
    signal.latestSignal,
    signal.whyNow,
    signal.pain,
    signal.whatYouCanBuild,
    signal.patternMatches.join(" "),
    detail.proof,
    detail.whatSold,
    detail.buyer,
    detail.paidPain,
    detail.firstOffer,
    detail.distribution,
  ].join(" ").toLowerCase();
  const offer = detail.firstOffer.toLowerCase();
  const pain = detail.paidPain.toLowerCase();
  const productName = getOutputPackProductName(detail.firstOffer);
  const isInvoiceFollowUp = /invoice|overdue|payment|cashflow|cash flow|collections?|follow-?up|follow up/.test(haystack);
  const isLaunchReply =
    /product hunt|launch|comments?|dms?|objections?|feature requests?|growth templates?|launch services?/.test(
      haystack,
    );
  const offerType = isInvoiceFollowUp
    ? "cleanup pack"
    : isLaunchReply
      ? "cleanup pack"
    : /audit/.test(offer)
    ? "audit"
    : /cleanup/.test(offer)
      ? "cleanup"
      : /setup/.test(offer)
        ? "setup"
        : /report/.test(offer)
          ? "report"
          : /pack|template|checklist/.test(offer)
            ? "pack"
            : "manual offer";
  const painType = isInvoiceFollowUp
    ? "awkward follow-up / cash collection"
    : isLaunchReply
      ? "launch reply triage"
    : /lead|call|quote|estimate/.test(pain)
    ? "lost revenue follow-up"
    : /review|trust|rating/.test(pain)
      ? "trust and reputation"
      : /report|note|documentation/.test(pain)
        ? "messy reporting"
        : /onboarding|faq|support|question/.test(pain)
          ? "repeated support friction"
          : "repeated workflow pain";
  const proofAssetType = isInvoiceFollowUp
    ? "Invoice Follow-up Before/After Builder"
    : isLaunchReply
      ? "Launch Reply Kit Builder"
    : /agent|cost|spend|usage|token|bill/.test(haystack)
      ? "AI Agent Cost Leak Audit Report Generator"
      : /blog|pin|pinterest/.test(haystack)
        ? "Blog-to-Pin Repurposing Generator"
        : /candidate|recruit|applicant|hiring/.test(haystack)
          ? "Candidate Follow-up Tracker"
          : /review|rating/.test(pain)
    ? "Review Reply Proof Pack"
    : /lead|call|quote|estimate/.test(pain)
      ? "Lead Recovery Proof Sheet"
      : /report|note|documentation/.test(pain)
        ? "Client Report Cleanup Dashboard"
        : /onboarding|faq|support|question/.test(pain)
          ? "FAQ Cleanup Proof Pack"
          : `${productName} Proof Asset`;
  const distributionChannel = isInvoiceFollowUp
    ? "freelancer DMs / X posts / agency communities"
    : isLaunchReply
      ? "Product Hunt founders / X posts / indie founder communities"
    : detail.distribution ||
    signal.patternMatches.find((item) =>
      /x|twitter|linkedin|dm|seo|community|reddit|newsletter/i.test(item),
    ) ||
    "X post + buyer DM";
  const buildGate =
    "Build only after 3 buyer replies, 1 buying-intent reply, or a buyer asks for the paid version.";
  const fingerprint = [
    getSignalMarket(signal),
    compactBuyer(signal).toLowerCase(),
    offerType,
    painType,
  ]
    .join(" / ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    buildGate,
    distributionChannel,
    fingerprint,
    offerType,
    painType,
    proofAssetType,
  };
}

function getOfferPriceFromText(firstOffer: string, fallbackPrice: string) {
  const priceMatch =
    firstOffer.match(/(?:JPY\s?)?[$¥]?\d[\d,]*(?:\.\d+)?(?:\s?-\s?[$¥]?\d[\d,]*)?\s?(?:one-time|\/month|per month|monthly|setup)?/i);

  return normalizeDisplayText(priceMatch?.[0] || fallbackPrice || "Price to test in DM");
}

function removePriceFromOfferText(value: string, price: string) {
  return normalizeDisplayText(value)
    .replace(price, "")
    .replace(/(?:JPY\s?)?[$¥]?\d[\d,]*(?:\.\d+)?(?:\s?-\s?[$¥]?\d[\d,]*)?\s?(?:one-time|\/month|per month|monthly|setup)?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function getMoneyMoveOfferFields(
  signal: BuildSignal,
  detail: ReturnType<typeof getOpportunityDetailFields>,
  metadata: MoneyMoveMetadata,
): MoneyMoveOfferFields {
  const haystack = [
    signal.sourceTitle,
    signal.latestSignal,
    signal.pain,
    detail.buyer,
    detail.paidPain,
    detail.firstOffer,
  ].join(" ").toLowerCase();
  const price = getOfferPriceFromText(detail.firstOffer, detail.price);

  if (/invoice|overdue|payment|cashflow|cash flow|collections?|follow-?up|follow up/.test(haystack)) {
    const agencyBuyer = /agency|agencies|client/.test(detail.buyer.toLowerCase());

    return {
      deliverables: [
        "polite follow-up message",
        "next-step payment checklist",
        "before/after follow-up sample",
      ],
      firstOfferName: agencyBuyer
        ? "Client Payment Follow-up Cleanup Pack"
        : "Freelancer Invoice Follow-up Cleanup Pack",
      offerDescription:
        "Turn one overdue invoice situation into a clean follow-up sequence the buyer can send today.",
      price: price || "$49 one-time",
    };
  }

  if (/product hunt|launch|comments?|dms?|objections?|feature requests?|growth templates?|launch services?/.test(haystack)) {
    return {
      deliverables: [
        "before/after launch reply sample",
        "objection response checklist",
        "next-step follow-up messages",
      ],
      firstOfferName: "Launch Reply Kit - Cleanup Pack",
      offerDescription:
        "Turn one messy launch thread into sorted replies, objection responses, and next actions.",
      price: price || "$79 one-time",
    };
  }

  const cleanedOffer = removePriceFromOfferText(detail.firstOffer, price);
  const firstLine = cleanedOffer
    .split(/\r?\n|\. /)
    .map((line) => line.trim())
    .find(Boolean);
  const firstOfferName = firstLine && firstLine.length <= 80
    ? firstLine
    : getOutputPackProductName(detail.firstOffer);
  const offerDescription =
    cleanedOffer
      .replace(firstOfferName, "")
      .replace(/^\W+/, "")
      .trim() ||
    `Turn one messy ${metadata.painType} case into a buyer-ready before/after result.`;
  const deliverables = /audit/.test(metadata.offerType)
    ? ["one-page audit", "before/after sample", "priority fix list"]
    : /setup/.test(metadata.offerType)
      ? ["setup map", "implementation checklist", "buyer handoff note"]
      : /pack|template|checklist/.test(metadata.offerType)
        ? ["checklist", "template", "example output"]
        : ["buyer-ready sample", "next-step checklist", "short handoff note"];

  return {
    deliverables,
    firstOfferName,
    offerDescription,
    price,
  };
}

function getBuyerFacingPainClause(paidPain: string) {
  const normalized = normalizeDisplayText(paidPain).replace(/\.$/, "");
  const becauseSplit = normalized.split(/\bbecause\b/i);
  const clause = becauseSplit.length > 1 ? becauseSplit.slice(1).join(" because ") : normalized;

  return clause
    .replace(/^that\s+/i, "")
    .replace(/^their\s+/i, "")
    .replace(/^./, (character) => character.toLowerCase())
    .trim();
}

function getShortBuyerLabel(buyer: string) {
  const normalized = normalizeDisplayText(buyer);
  const firstSegment = normalized.split(/,| and /)[0]?.trim();

  return firstSegment || normalized || "the buyer";
}

function buildMoneyMoveQuality(
  detail: ReturnType<typeof getOpportunityDetailFields>,
  metadata: MoneyMoveMetadata,
  offerFields: MoneyMoveOfferFields,
): MoneyMoveQuality {
  const buyer = normalizeDisplayText(detail.buyer).toLowerCase();
  const pain = normalizeDisplayText(detail.paidPain).toLowerCase();
  const proof = normalizeDisplayText(detail.proof).toLowerCase();
  const offer = normalizeDisplayText(offerFields.firstOfferName).toLowerCase();
  const genericBuyer = /^(users|people|businesses|companies|teams|customers)$/i.test(buyer);
  const genericPain = /\b(save time|productivity|workflow|automation|efficiency)\b/i.test(pain) &&
    !/\b(invoice|review|launch|lead|quote|report|onboarding|reply|dm|faq|tax|rent|inspection|field|checkout|cart)\b/i.test(pain);
  let score = 0;

  if (buyer.length >= 18 && !genericBuyer) score += 15;
  if (pain.length >= 45 && !genericPain) score += 15;
  if (/\$|mrr|arr|revenue|paid|customers?|users?|pricing|sold|sales|month|year/i.test(proof)) score += 15;
  if (offerFields.firstOfferName.length >= 8 && offerFields.price) score += 15;
  if (offerFields.deliverables.length >= 3) score += 10;
  if (!/saas|platform|app|dashboard|copilot/i.test(offer)) score += 10;
  if (!/proof asset$/i.test(metadata.proofAssetType)) score += 10;
  if (!/repeated workflow pain|manual offer/i.test(`${metadata.painType} ${metadata.offerType}`)) score += 10;

  const label: MoneyMoveQualityLabel =
    score >= 75 ? "Strong Money Move" : score >= 55 ? "Needs polish" : "Weak / too generic";
  const reasons: string[] = [];

  if (label === "Strong Money Move") {
    reasons.push("Specific buyer, paid pain, and price are ready to test.");
    reasons.push(`${metadata.proofAssetType} can prove demand before a full product.`);
  } else {
    if (genericBuyer || buyer.length < 18) {
      reasons.push("Buyer needs to be more specific.");
    }
    if (genericPain || pain.length < 45) {
      reasons.push("Paid pain needs a more concrete workflow or moment.");
    }
    if (!/\$|mrr|arr|revenue|paid|customers?|users?|pricing|sold|sales|month|year/i.test(proof)) {
      reasons.push("Money proof is light; use a stronger revenue signal if possible.");
    }
    if (reasons.length === 0) {
      reasons.push("Offer is usable, but the proof asset could be sharper.");
    }
  }

  return {
    label,
    reasons: reasons.slice(0, 2),
    score,
  };
}

function buildCodexProofAssetPrompt(
  detail: ReturnType<typeof getOpportunityDetailFields>,
  metadata: MoneyMoveMetadata,
  offerFields?: MoneyMoveOfferFields,
) {
  const fields = offerFields || {
    deliverables: ["buyer-ready proof output"],
    firstOfferName: getOutputPackProductName(detail.firstOffer),
    offerDescription: `Recreate the manual result promised by ${detail.firstOffer}.`,
    price: detail.price,
  };

  return [
    "Build the smallest sellable proof asset for this manual offer.",
    "",
    `Proof asset name: ${metadata.proofAssetType}`,
    `Target buyer: ${detail.buyer}`,
    `Paid pain: ${detail.paidPain}`,
    `Manual offer: ${fields.firstOfferName}`,
    `Offer description: ${fields.offerDescription}`,
    `Price: ${fields.price}`,
    `Build gate: ${metadata.buildGate}`,
    "",
    "What it should do:",
    `- Recreate the manual result promised by the offer: ${fields.firstOfferName}`,
    "- Give the user one clear input field for a messy real-world case.",
    "- Produce one useful buyer-ready output that can be copied, exported, sent, or shown as proof.",
    ...fields.deliverables.map((deliverable) => `- Include: ${deliverable}.`),
    "- Include the money proof, buyer, pain, price, and validation note on screen.",
    "",
    "What not to build:",
    "- No full SaaS.",
    "- No auth.",
    "- No database.",
    "- No payments.",
    "- No external APIs.",
    "- No complex dashboard.",
    "",
    "Build constraints:",
    "- Next.js / React.",
    "- Mobile-first.",
    "- Local state only.",
    "- Mock data allowed.",
    "- Copyable output.",
    "- Include copy/export actions for the generated result.",
    "- Use a mobile-first polished demo UI.",
    "- Clean proof-asset UI.",
    "- Build only after replies.",
  ].join("\n");
}

function buildMoneyMoveAngles(signal: BuildSignal): {
  angles: MoneyMoveAngle[];
  detail: ReturnType<typeof getOpportunityDetailFields>;
  metadata: MoneyMoveMetadata;
  offerFields: MoneyMoveOfferFields;
} {
  const detail = getOpportunityDetailFields(signal);
  const metadata = getMoneyMoveMetadata(signal, detail);
  const offerFields = getMoneyMoveOfferFields(signal, detail, metadata);
  const smallBuyer = /freelancer|solo|indie|creator|operator/.test(detail.buyer.toLowerCase());
  const premiumBuyer = smallBuyer
    ? "Small agencies with 5-20 active clients"
    : detail.buyer;
  const premiumPrice = smallBuyer ? "$199-$499" : "$499-$1,500";
  const premiumOffer = smallBuyer
    ? `${offerFields.firstOfferName.replace(/cleanup pack/i, "Cashflow Cleanup Sprint")}`
    : `${offerFields.firstOfferName} Implementation Sprint`;

  return {
    detail,
    metadata,
    offerFields,
    angles: [
      {
        id: "manual-offer",
        title: "Manual Offer Angle",
        hook: `Sell ${offerFields.firstOfferName} manually before building software.`,
        output: [
          `Buyer: ${detail.buyer}`,
          `Paid pain: ${detail.paidPain}`,
          "",
          "First offer:",
          offerFields.firstOfferName,
          "",
          "What you deliver:",
          ...offerFields.deliverables.map((deliverable) => `- ${deliverable}`),
          "",
          `Price: ${offerFields.price}`,
          "",
          "Best next action: DM 10 reachable buyers with one sample and ask if they want the same cleanup.",
        ].join("\n"),
        nextAction: "DM 10 buyers with a manual sample today.",
        defaultMode: "Buyer DM",
      },
      {
        id: "free-content",
        title: "Free Content Angle",
        hook: "Teach the pain publicly, then offer a free pack that reveals buyer intent.",
        output: [
          `X hook: ${detail.buyer} do not need more software. They need one painful workflow cleaned up today.`,
          `Carousel title: The hidden paid pain behind ${offerFields.firstOfferName}`,
          `Short caption: ${detail.paidPain}`,
          `Free pack idea: ${offerFields.firstOfferName} checklist with one before/after example.`,
        ].join("\n"),
        nextAction: "Publish the hook and offer the free pack to anyone who replies.",
        defaultMode: "X post",
      },
      {
        id: "high-ticket-b2b",
        title: "High-ticket B2B Angle",
        hook: "Turn the same pain into a higher-touch implementation offer.",
        output: [
          `Higher-priced version: ${premiumPrice} ${premiumOffer}`,
          `Target buyer: ${premiumBuyer}`,
          `Why they would pay more: they have more repeated cases, more client pressure, and more money stuck in the workflow.`,
          "Validation move: send one sample to 5 higher-intent operators and ask if they want a done-with-you setup.",
        ].join("\n"),
        nextAction: "Send the premium angle only to buyers who show urgency or buying intent.",
        defaultMode: "Buyer DM",
      },
      {
        id: "codex-proof-asset",
        title: "Codex Proof Asset Angle",
        hook: "Do not build a SaaS. Build a proof asset that proves the manual offer works.",
        output: [
          `Smallest sellable proof asset: ${metadata.proofAssetType}`,
          `What it should do: turn one messy buyer case into the promised output for ${offerFields.firstOfferName}`,
          `Manual offer: ${offerFields.firstOfferName}`,
          `Price: ${offerFields.price}`,
          "What not to build: accounts, billing, dashboards, integrations, or a full platform.",
          `Build gate condition: ${metadata.buildGate}`,
        ].join("\n"),
        nextAction: "Build only after replies, saves, clicks, or buyer interest.",
        defaultMode: "Codex proof asset prompt",
      },
      {
        id: "founder-story",
        title: "Founder Story Angle",
        hook: "Show how a real money signal becomes a testable business move.",
        output: [
          `Build-in-public post: I found this money signal: ${detail.proof}`,
          `Why this signal matters: ${detail.paidPain}`,
          "How Bilion turns it into a testable move: buyer -> offer -> post/DM -> validation -> proof asset.",
          `Fingerprint: ${metadata.fingerprint}`,
        ].join("\n"),
        nextAction: "Post the story, then reply with the manual offer when buyers engage.",
        defaultMode: "5-slide carousel outline",
      },
    ],
  };
}

function buildAngleOutput(
  angle: MoneyMoveAngle,
  mode: AngleOutputMode,
  detail: ReturnType<typeof getOpportunityDetailFields>,
  metadata: MoneyMoveMetadata,
  offerFields: MoneyMoveOfferFields,
) {
  const buyerLabel = getShortBuyerLabel(detail.buyer);
  const painClause = getBuyerFacingPainClause(detail.paidPain);

  if (mode === "X post") {
    return [
      `${buyerLabel} are already paying around this pain.`,
      "",
      `Money Move: ${detail.proof}`,
      "",
      `Buyer: ${detail.buyer}`,
      `Paid pain: ${detail.paidPain}`,
      "",
      `Offer to test today: ${offerFields.firstOfferName}`,
      `Price: ${offerFields.price}`,
      "",
      `Today: make one sample with ${offerFields.deliverables[0] || "a before/after result"} and DM 10 buyers.`,
      "Ask if they want the same cleanup for their own case.",
      "Build only after replies.",
    ].join("\n");
  }

  if (mode === "Buyer DM") {
    return [
      "Hey - quick question.",
      "",
      `Are you dealing with ${painClause}?`,
      "",
      `I made a small ${offerFields.firstOfferName} for ${buyerLabel}.`,
      `It includes ${offerFields.deliverables[0] || "one before/after sample"}.`,
      "",
      "Want me to send one example for your case?",
    ].join("\n");
  }

  if (mode === "5-slide carousel outline") {
    return [
      `Slide 1: ${buyerLabel} are paying to fix this`,
      "Do not start with a full product.",
      "",
      "Slide 2: Money Move",
      detail.proof,
      "",
      "Slide 3: Buyer + Paid Pain",
      `${detail.buyer} struggle with ${painClause}.`,
      "",
      "Slide 4: First Offer",
      `${offerFields.firstOfferName} - ${offerFields.price}`,
      "",
      "Slide 5: Build only after replies",
      "Post it, DM buyers, and build only after replies, saves, clicks, or buying intent.",
    ].join("\n");
  }

  if (mode === "Free pack outline") {
    return [
      `${offerFields.firstOfferName} Starter Pack`,
      "",
      `Who it is for: ${detail.buyer}`,
      `Result: one clean sample that helps them handle ${metadata.painType}.`,
      "",
      "Inside:",
      ...offerFields.deliverables.slice(0, 5).map((deliverable) => `- ${deliverable}`),
      "- One before/after example",
      "- Short checklist they can use today",
      "",
      "CTA: Reply with one messy case and I will make a sample.",
    ].join("\n");
  }

  return buildCodexProofAssetPrompt(detail, metadata, offerFields);
}

function getDefaultBusinessStartControls(signal: BuildSignal): BusinessStartControls {
  const detail = getOpportunityDetailFields(signal);

  return {
    channel: "X",
    difficulty: "simple",
    offerType: "audit",
    pricePoint: getOfferPriceFromText(detail.firstOffer, detail.price) || "$99 one-time",
    targetBuyer: detail.buyer,
    tone: "direct",
  };
}

function getAngleDefaults(angleName: BusinessAngleName): Pick<BusinessStartControls, "offerType" | "pricePoint" | "tone" | "difficulty"> {
  if (angleName === "Aggressive angle") {
    return { difficulty: "medium", offerType: "setup service", pricePoint: "$299 one-time", tone: "contrarian" };
  }

  if (angleName === "Premium angle") {
    return { difficulty: "advanced", offerType: "agency offer", pricePoint: "$1,500 setup", tone: "premium" };
  }

  if (angleName === "Beginner angle") {
    return { difficulty: "simple", offerType: "template pack", pricePoint: "$29 one-time", tone: "beginner-friendly" };
  }

  if (angleName === "Agency angle") {
    return { difficulty: "medium", offerType: "agency offer", pricePoint: "$499 setup", tone: "direct" };
  }

  return { difficulty: "simple", offerType: "audit", pricePoint: "$99 one-time", tone: "direct" };
}

function getOfferNameForControls(
  offerFields: MoneyMoveOfferFields,
  controls: BusinessStartControls,
  angleName: BusinessAngleName,
) {
  const baseName = offerFields.firstOfferName
    .replace(/\s+-\s+Cleanup Pack$/i, "")
    .replace(/\s+Pack$/i, "")
    .trim();
  const suffixByType: Record<BusinessOfferType, string> = {
    "agency offer": "Done-for-You Sprint",
    "audit": "Audit",
    "micro SaaS": "Micro MVP",
    "setup service": "Setup Sprint",
    "template pack": "Template Pack",
  };

  return `${baseName} ${suffixByType[controls.offerType]} (${angleName.replace(" angle", "")})`;
}

function buildBusinessStartPack(
  signal: BuildSignal,
  controls: BusinessStartControls,
  angleName: BusinessAngleName,
): BusinessStartPack {
  const detail = getOpportunityDetailFields(signal);
  const metadata = getMoneyMoveMetadata(signal, detail);
  const offerFields = getMoneyMoveOfferFields(signal, detail, metadata);
  const title = getDisplaySignalTitle(signal).title || getOutputPackProductName(detail.firstOffer);
  const buyer = normalizeDisplayText(controls.targetBuyer || detail.buyer);
  const offerName = getOfferNameForControls(offerFields, controls, angleName);
  const price = controls.pricePoint || offerFields.price || detail.price;
  const painClause = getBuyerFacingPainClause(detail.paidPain);
  const toneHook: Record<BusinessTone, string> = {
    "beginner-friendly": `Simple business to test: help ${getShortBuyerLabel(buyer)} fix one painful workflow.`,
    "contrarian": `${getShortBuyerLabel(buyer)} do not need another product. They need this pain handled now.`,
    "direct": `${getShortBuyerLabel(buyer)} are already paying around this pain.`,
    "premium": `Premium buyers pay when ${painClause}.`,
  };
  const baseAngle: MoneyMoveAngle = {
    defaultMode: "X post",
    hook: toneHook[controls.tone],
    id: "business-start-pack",
    nextAction: "Post the offer, DM 10 buyers, then build only after replies.",
    output: "",
    title: "Business Start Pack",
  };
  const controlledDetail = { ...detail, buyer, firstOffer: `${offerName} ${price}` };
  const controlledOfferFields = {
    ...offerFields,
    firstOfferName: offerName,
    price,
  };
  const validationPlan = [
    "48-hour validation plan:",
    "Day 1:",
    `- Publish the ${controls.channel} version today.`,
    `- Send the DM to 10 reachable buyers: ${buyer}.`,
    "- Offer one before/after sample, not a product demo.",
    "",
    "Day 2:",
    "- Follow up with anyone who replied, saved, clicked, or asked a question.",
    "- Ask one payment question: would you pay for this sample for your own case?",
    "- Log replies, DMs, paid interest, and notes in My Tests.",
  ].join("\n");
  const buildDropRule = [
    "Build / Drop rule:",
    "- Build next if replies >= 3 or paid interest >= 1.",
    "- Re-angle or drop if replies = 0 and paid interest = 0.",
    "- Codex comes after demand, not before it.",
  ].join("\n");

  return {
    angleName,
    businessName: title,
    buyer,
    paidPain: detail.paidPain,
    firstOffer: offerName,
    price,
    xPost: [
      toneHook[controls.tone],
      "",
      `Money Move: ${detail.proof}`,
      `Buyer: ${buyer}`,
      `Pain: ${detail.paidPain}`,
      `Offer: ${offerName}`,
      `Price: ${price}`,
      "",
      `Today: post on ${controls.channel}, DM 10 buyers, and offer one sample.`,
      "Build only after replies.",
    ].join("\n"),
    carousel: buildAngleOutput(baseAngle, "5-slide carousel outline", controlledDetail, metadata, controlledOfferFields),
    dmScript: buildAngleOutput(baseAngle, "Buyer DM", controlledDetail, metadata, controlledOfferFields),
    freeLeadMagnet: buildAngleOutput(baseAngle, "Free pack outline", controlledDetail, metadata, controlledOfferFields),
    validationPlan,
    buildDropRule,
    codexMvpPrompt: [
      buildCodexProofAssetPrompt(controlledDetail, metadata, controlledOfferFields),
      "",
      `Difficulty: ${controls.difficulty}.`,
      `Angle: ${angleName}.`,
      "Build After Replies only.",
    ].join("\n"),
  };
}

function getLaunchPackAngleNote(angle: NextAction) {
  if (angle === "sell") {
    return "Lead with the buyer, paid pain, first offer, price, and a low-friction DM or checkout angle.";
  }

  if (angle === "dm") {
    return "Lead with a short qualification line, one helpful sample, a no-link first DM, and a simple follow-up.";
  }

  if (angle === "build") {
    return "Lead with the MVP scope and Codex prompt, but keep the validate-before-building warning visible.";
  }

  return "Lead with the X post, 3-slide carousel, source-backed hook, and CTA.";
}

function buildOutputPackFromSignal(signal: BuildSignal, angle: NextAction = "post"): OutputPack {
  const detail = getOpportunityDetailFields(signal);
  const title = getDisplaySignalTitle(signal);
  const productName = getOutputPackProductName(detail.firstOffer);
  const buildScope = getOutputPackBuildScope(detail);
  const market = getSignalMarket(signal);
  const generatedAt = new Date().toISOString();
  const signalTitle = title.detail || title.title || signal.sourceTitle || "Money Move";
  const angleNote = getLaunchPackAngleNote(angle);
  const metadata = getMoneyMoveMetadata(signal, detail);
  const validationPlan = [
    `Codex Build Brief angle: ${getActionLabel(angle)}`,
    angleNote,
    "",
    "Day 1:",
    `- Publish this X post: ${detail.postHook}`,
    `- Create a carousel from the proof: ${detail.proof}`,
    `- Send 10 targeted DMs to ${detail.buyer}.`,
    `- Ask this buyer-specific question: Is this pain happening in your current process? ${detail.paidPain}`,
    "",
    "Day 2:",
    "- Follow up with people who replied, clicked, saved, or asked a question.",
    "- Collect objections in their exact words.",
    `- Offer the manual-first version: ${detail.firstOffer}`,
    "- Decide build / do-not-build from real buyer replies.",
    "",
    "Success criteria:",
    "- 3+ replies.",
    "- 1+ buyer asks for details.",
    "- 1+ person says they want the workflow/report/audit.",
    "",
    "Do-not-build criteria:",
    "- No replies.",
    "- Only vanity likes.",
    "- No buyer-specific pain.",
    "- People like the idea but do not want the offer.",
  ].join("\n");
  const carouselSlides = [
    `Slide 1: Money Move\n${detail.proof}\n\n${detail.buyer} are already paying around this problem.`,
    `Slide 2: Why buyers pay\n${detail.paidPain}\n\nSell this first: ${detail.firstOffer}`,
    `Slide 3: Validate before building\nCreate one manual before/after sample, DM 10-20 reachable buyers, and ask if they want the same result.\n\n${detail.buildAfterReplies}`,
  ];

  return {
    id: `output-pack-${signal.id}-${Date.now()}`,
    signalId: signal.id,
    angle,
    market,
    generatedAt,
    xPost: [
      `Angle: ${getActionLabel(angle)}`,
      `${detail.buyer} do not need another AI idea.`,
      "They need one paid pain handled this week.",
      "",
      `Money proof: ${detail.proof}`,
      `What money moved: ${detail.whatSold}`,
      "",
      `Buyer: ${detail.buyer}`,
      `Pain: ${detail.paidPain}`,
      "",
      `First offer to test: ${detail.firstOffer}`,
      angle === "sell" ? `Make the ask: want this manual version for ${detail.price}?` : "",
      angle === "dm" ? "DM buyers with one sample before sending any link." : "",
      angle === "build" ? `MVP scope later: ${buildScope}` : "",
      `Post the proof, DM the buyer, and sell the manual version first.`,
      "Build only after replies.",
    ].filter(Boolean).join("\n"),
    shortVideoScript: [
      `Angle: ${getActionLabel(angle)}`,
      `Hook: ${signalTitle} is a money signal, not just an idea.`,
      `Proof: ${detail.proof}`,
      `Buyer: ${detail.buyer}`,
      `Pain: ${detail.paidPain}`,
      `Offer to test: ${detail.firstOffer}`,
      "Do not build the full product first.",
      "Post the proof.",
      "DM reachable buyers.",
      "Make one manual sample.",
      "If 3 people reply, build the small version with Codex.",
      "CTA: want this output pack for your market?",
    ].join("\n"),
    carouselSlides,
    coldDm: [
      `Angle: ${getActionLabel(angle)}`,
      `Hey, I noticed ${detail.buyer} keep running into this: ${detail.paidPain}`,
      "",
      `I found a money signal behind it: ${detail.proof}`,
      "",
      `I made a small ${productName} sample instead of building software first.`,
      "Want me to send the sample and see if it would fit your case?",
      "",
      "Follow-up: If this is not a priority, what is the messiest part of this workflow right now?",
    ].join("\n"),
    validationPlan,
    codexBuildPrompt: [
      "Build the smallest sellable proof asset for this manual offer.",
      "Build this only after someone replies, clicks, or asks for the offer.",
      "",
      `Proof asset name: ${metadata.proofAssetType}`,
      `Target buyer: ${detail.buyer}`,
      `Paid pain: ${detail.paidPain}`,
      `First offer and price: ${detail.firstOffer}`,
      `Offer type: ${metadata.offerType}`,
      `Pain type: ${metadata.painType}`,
      `Distribution channel: ${metadata.distributionChannel}`,
      `Build gate: ${metadata.buildGate}`,
      `Fingerprint: ${metadata.fingerprint}`,
      "",
      `Proof asset scope: ${buildScope}`,
      "",
      "What not to build:",
      "- Do not build a full platform.",
      "- Do not build a SaaS by default.",
      "- Do not add accounts, teams, billing, integrations, or AI APIs.",
      "- Do not build extra dashboards before validation.",
      "- Do not add features that are not needed to recreate the manual first offer.",
      "",
      "UI requirements:",
      "- Mobile-first.",
      "- Clean dark proof-asset UI.",
      "- One clear input area.",
      "- One generated output area.",
      "- Copy buttons for every generated output.",
      "- Pricing CTA for the first offer.",
      "- Include a visible Build only after replies validation note.",
      "",
      "Core user flow:",
      "1. User opens the product and sees the buyer, paid pain, proof, and first offer.",
      "2. User chooses or pastes one realistic messy input.",
      "3. The app turns it into the small buyer-ready output promised in the first offer.",
      "4. The user copies the output, DM, post, and validation note.",
      "5. The user tracks whether 3+ buyers reply before building anything larger.",
      "",
      "Local mock data requirements:",
      `- Include 3 mock examples for ${detail.buyer}.`,
      `- Each example should reflect this paid pain: ${detail.paidPain}`,
      "- Mock data can be deterministic and local.",
      "",
      "Validation checklist:",
      "- 3+ replies.",
      "- 1+ buyer asks for details.",
      "- 1+ person says they want the workflow/report/audit.",
      "- Kill the build if there are no buyer-specific replies.",
      "",
      "Build constraints:",
      "- Next.js / React.",
      "- Mobile-first.",
      "- No auth.",
      "- No database.",
      "- No external API.",
      "- Local state only.",
      "- Mock data allowed.",
      "- Clean dark proof-asset UI.",
      "- Include copyable output.",
      "- Include pricing CTA.",
      "- Include Build only after replies validation note.",
    ].join("\n"),
  };
}

function getPreferenceMarket(buyerPreference: BuyerPreference): AppMarketOption | null {
  if (buyerPreference === "Developers" || buyerPreference === "Indie founders") {
    return "Developer Workflow";
  }

  if (buyerPreference === "Creators") {
    return "Creators";
  }

  if (buyerPreference === "Local businesses" || buyerPreference === "Agencies") {
    return "Local Business";
  }

  if (buyerPreference === "Ecommerce") {
    return "Ecommerce";
  }

  return null;
}

function getPreferenceFitScore(
  signal: BuildSignal,
  goal: DailyGoal,
  buyerPreference: BuyerPreference,
  monetization: MonetizationPreference,
) {
  const detail = getOpportunityDetailFields(signal);
  const haystack = `${getSignalMarket(signal)} ${detail.buyer} ${detail.paidPain} ${detail.firstOffer} ${detail.buildAfterReplies}`.toLowerCase();
  let score = Math.min(84, 54 + getSignalOpportunityScore(signal));
  const preferredMarket = getPreferenceMarket(buyerPreference);

  if (preferredMarket && getSignalMarket(signal) === preferredMarket) {
    score += 14;
  }

  if (buyerPreference === "Developers" && /developer|github|code|repo|api|workflow/.test(haystack)) {
    score += 10;
  }

  if (buyerPreference === "Creators" && /creator|content|newsletter|post|video|community/.test(haystack)) {
    score += 10;
  }

  if (buyerPreference === "Local businesses" && /local|clinic|salon|restaurant|contractor|service/.test(haystack)) {
    score += 10;
  }

  if (buyerPreference === "Agencies" && /agency|client|lead|setup|audit/.test(haystack)) {
    score += 8;
  }

  if (goal === "Get replies today" && /dm|reply|lead|buyer|client|local|post/.test(haystack)) {
    score += 6;
  }

  if (goal === "Find a buyer" && /buyer|client|operator|owner|founder|developer|creator/.test(haystack)) {
    score += 6;
  }

  if (goal === "Test a $99 offer" && /\$99|audit|cleanup|report|pack/.test(haystack)) {
    score += 8;
  }

  if (goal === "Validate a micro SaaS" && /month|monthly|micro|subscription|saas|mvp|tool|app/.test(haystack)) {
    score += 8;
  }

  if (goal === "Create launch assets" && /post|dm|content|creator|newsletter|x |carousel|tiktok/.test(haystack)) {
    score += 6;
  }

  if (goal === "Get a Codex build prompt" && /mvp|build|codex|tool|software|app/.test(haystack)) {
    score += 6;
  }

  if (monetization === "Manual service" && /manual|audit|cleanup|setup|service/.test(haystack)) {
    score += 8;
  }

  if (monetization === "Micro SaaS" && /mvp|tool|dashboard|app|month|saas/.test(haystack)) {
    score += 8;
  }

  if (monetization === "Prompt pack" && /prompt|template|pack|checklist/.test(haystack)) {
    score += 8;
  }

  if (monetization === "Setup offer" && /setup|implementation|workflow|automation/.test(haystack)) {
    score += 8;
  }

  if (monetization === "Content product" && /content|newsletter|post|video|template/.test(haystack)) {
    score += 8;
  }

  return Math.max(72, Math.min(94, score));
}

function getFitLabel(score: number) {
  if (score >= 90) {
    return "Strong fit";
  }

  if (score >= 84) {
    return "High fit";
  }

  return "Good fit";
}

function getWhySignalMatches(
  signal: BuildSignal,
  goal: DailyGoal,
  buyerPreference: BuyerPreference,
  monetization: MonetizationPreference,
) {
  const detail = getOpportunityDetailFields(signal);
  const preferredMarket = getPreferenceMarket(buyerPreference);
  const marketMatch = preferredMarket && getSignalMarket(signal) === preferredMarket;

  return [
    marketMatch ? `built around ${buyerPreference.toLowerCase()}` : `the buyer is specific: ${detail.buyer}`,
    `it fits "${goal.toLowerCase()}" because there is proof, pain, and a small offer to test`,
    `it can start as a ${monetization.toLowerCase()} without building a full product first`,
  ].join(". ");
}

function getRecommendedSignals(
  signals: BuildSignal[],
  goal: DailyGoal,
  buyerPreference: BuyerPreference,
  monetization: MonetizationPreference,
) {
  const seenIds = new Set<string>();

  return signals
    .filter((signal) => {
      if (seenIds.has(signal.id)) {
        return false;
      }

      seenIds.add(signal.id);
      return true;
    })
    .map((signal) => ({
      fitScore: getPreferenceFitScore(signal, goal, buyerPreference, monetization),
      signal,
      why: getWhySignalMatches(signal, goal, buyerPreference, monetization),
    }))
    .sort((a, b) => b.fitScore - a.fitScore || getSignalOpportunityScore(b.signal) - getSignalOpportunityScore(a.signal))
    .slice(0, 3);
}

function buildLandingPageCopy(signal: BuildSignal) {
  const detail = getOpportunityDetailFields(signal);
  const productName = getOutputPackProductName(detail.firstOffer);

  return [
    `Headline: ${productName} for ${detail.buyer}`,
    "",
    `Subheadline: Turn ${detail.paidPain} into a clean buyer-ready output before building a full product.`,
    "",
    "Proof block:",
    detail.proof,
    "",
    "Offer:",
    detail.firstOffer,
    "",
    "CTA:",
    "Want the manual version? Reply and I will send one before/after sample.",
    "",
    "Build note:",
    "Build only after replies, saves, clicks, or buyer interest.",
  ].join("\n");
}

function buildTransformOutput(
  signal: BuildSignal,
  transform: TransformType,
  hasFounderAccess: boolean,
) {
  const pack = buildOutputPackFromSignal(signal);

  if (transform === "X Post") {
    return pack.xPost;
  }

  if (transform === "3-slide Carousel") {
    return pack.carouselSlides.join("\n\n");
  }

  if (transform === "Buyer DM") {
    return pack.coldDm;
  }

  if (transform === "TikTok Script") {
    return pack.shortVideoScript;
  }

  if (transform === "Landing Page Copy") {
    return buildLandingPageCopy(signal);
  }

  if (transform === "Validation Plan") {
    return pack.validationPlan;
  }

  if (hasFounderAccess) {
    return pack.codexBuildPrompt;
  }

  return `${pack.codexBuildPrompt.split("\n").slice(0, 12).join("\n")}\n\nBilion Pro unlocks the full build-after-replies plan.`;
}

function buildRemixOutput(signal: BuildSignal, remix: RemixType) {
  const detail = getOpportunityDetailFields(signal);
  const cleanOfferName = getOutputPackProductName(detail.firstOffer);
  const remixRules: Record<RemixType, { buyer: string; offer: string; price: string; note: string }> = {
    "Make it simpler": {
      buyer: detail.buyer,
      offer: `${cleanOfferName} Lite`,
      price: "$29-$49 one-time",
      note: "remove software and sell one manual before/after output",
    },
    "Make it premium": {
      buyer: detail.buyer,
      offer: `${cleanOfferName} Premium Setup`,
      price: "$499-$1,500 setup",
      note: "package the cleanup, implementation, and handoff as a premium service",
    },
    "Make it local": {
      buyer: "local operators with the same repeated workflow",
      offer: `Local ${cleanOfferName}`,
      price: "$99-$299 one-time",
      note: "sell a concrete local before/after sample by DM",
    },
    "Make it for developers": {
      buyer: "developers and technical founders",
      offer: `Developer ${cleanOfferName}`,
      price: "$49-$99 one-time",
      note: "turn the pain into a repo, setup, or workflow brief developers can inspect fast",
    },
    "Make it for creators": {
      buyer: "creators and newsletter operators",
      offer: `Creator ${cleanOfferName}`,
      price: "$19-$49 one-time",
      note: "turn the proof into a content operating asset creators can reuse",
    },
    "Turn it into a $99 service": {
      buyer: detail.buyer,
      offer: `$99 ${cleanOfferName}`,
      price: "$99 one-time",
      note: "make one fixed-scope manual result and sell it before software",
    },
    "Turn it into a $9.99/mo product": {
      buyer: detail.buyer,
      offer: `${cleanOfferName} Micro Subscription`,
      price: "$9.99/month",
      note: "turn the manual output into a tiny recurring checklist or generator only after replies",
    },
  };
  const rule = remixRules[remix];

  return [
    `Buyer: ${rule.buyer}`,
    `Paid pain: ${detail.paidPain}`,
    `First offer: ${rule.offer}`,
    `Price: ${rule.price}`,
    `Why it could work: ${rule.note}. Money proof: ${detail.proof}`,
    `First validation action: DM 10 reachable buyers with one before/after sample and ask if they want ${rule.offer}.`,
  ].join("\n");
}

function buildTodaysOfferTest(signal: BuildSignal) {
  const detail = getOpportunityDetailFields(signal);
  const metadata = getMoneyMoveMetadata(signal, detail);
  const offerFields = getMoneyMoveOfferFields(signal, detail, metadata);
  const painClause = normalizeDisplayText(detail.paidPain)
    .replace(/\.$/, "")
    .replace(/^./, (character) => character.toLowerCase());

  return [
    `Today's offer test: ${offerFields.firstOfferName}`,
    "",
    `What you deliver:`,
    ...offerFields.deliverables.map((deliverable) => `- ${deliverable}`),
    "",
    `Price: ${offerFields.price}`,
    "",
    `Buyer: ${detail.buyer}`,
    `Paid pain: ${detail.paidPain}`,
    "",
    `Money proof: ${detail.proof}`,
    "",
    "Test copy:",
    `I noticed ${detail.buyer} often lose momentum when ${painClause}.`,
    `I'm making a small ${offerFields.firstOfferName} for teams with this problem.`,
    `It includes ${offerFields.deliverables.slice(0, 2).join(" and ")}.`,
    `Would you want to see one before/after sample for your own case?`,
    "",
    "Build only after replies.",
  ].join("\n");
}

function getValidationQueueNextAction(status: ValidationQueueStatus) {
  if (status === "Ready") {
    return "Post today";
  }

  if (status === "Posted") {
    return "DM 10 buyers";
  }

  if (status === "Got Replies") {
    return "Ask for payment";
  }

  if (status === "Paid Interest") {
    return "Mark as Winner or Build";
  }

  if (status === "Winner") {
    return "Open full Launch Assets and build after replies";
  }

  if (status === "Build") {
    return "Build with Codex";
  }

  if (status === "Drop") {
    return "Re-angle or drop";
  }

  return "Post today";
}

function getValidationRecommendation(item: ValidationQueueItem) {
  if (item.replies >= 3 || item.paidInterest >= 1 || item.status === "Build" || item.status === "Winner") {
    return "Recommendation: Build next.";
  }

  if (item.replies === 0 && item.paidInterest === 0 && (item.status === "Posted" || item.dms > 0)) {
    return "Recommendation: Re-angle or drop.";
  }

  return "Recommendation: keep testing until replies or paid interest appear.";
}

function readLaunchQueueItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LAUNCH_QUEUE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.map((item) => ({
        buyer: item.buyer || "",
        dms: Number(item.dms) || 0,
        id: item.id || `launch-${Date.now()}`,
        likes: Number(item.likes) || 0,
        notes: item.notes || "",
        offer: item.offer || "",
        output: item.output || "",
        outputType: item.outputType || "Business Start Pack",
        paidInterest: Number(item.paidInterest) || 0,
        replies: Number(item.replies) || 0,
        saves: Number(item.saves) || 0,
        signalTitle: item.signalTitle || "Money Move",
        status: validationQueueStatuses.includes(item.status) ? item.status : "Draft",
        views: Number(item.views) || 0,
        winner: Boolean(item.winner),
      })) as ValidationQueueItem[]
      : [];
  } catch {
    return [];
  }
}

function writeLaunchQueueItems(items: ValidationQueueItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LAUNCH_QUEUE_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function getDailyFeedSeed() {
  const today = new Date();

  return Number(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`);
}

function rotateSignalsForDailyFeed(signals: BuildSignal[], seed: number, offset: number) {
  if (signals.length === 0) {
    return signals;
  }

  const startIndex = Math.abs(seed + offset) % signals.length;

  return [...signals.slice(startIndex), ...signals.slice(0, startIndex)];
}

function trackBilionIntentEvent(
  name: BilionIntentEventName,
  payload: BilionIntentEventPayload,
) {
  const properties = {
    eventName: name,
    selectedSignalTitle: truncateDisplayText(payload.selectedSignalTitle, 120),
    buyer: truncateDisplayText(payload.buyer, 120),
    userGoal: payload.userGoal,
    monetizationStyle: payload.monetizationStyle,
    hasProAccess: payload.hasProAccess,
  };

  try {
    track(name, properties);

    if (process.env.NODE_ENV === "development") {
      console.info("[Bilion analytics]", name, properties);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.info("[Bilion analytics skipped]", name, error);
    }
  }
}

function truncateEvidenceText(value: string, maxLength = 220) {
  const normalized = normalizeDisplayText(value).replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

function getEvidenceLine(rawText: string, labels: string[]) {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const label of labels) {
    const match = lines.find((line) =>
      line.toLowerCase().startsWith(`${label.toLowerCase()}:`),
    );

    if (match) {
      return match.slice(match.indexOf(":") + 1).trim();
    }
  }

  return "";
}

function getEvidencePrice(rawText: string) {
  const explicitPrice = getEvidenceLine(rawText, ["price", "pricing"]);
  const priceMatch =
    rawText.match(/\$[\d,]+(?:\s?\/\s?(?:month|mo|year|yr))?/i) ||
    rawText.match(/\b\d+\s?(?:usd|dollars)\b/i);

  return explicitPrice || priceMatch?.[0] || "Test a $19-$49 first offer.";
}

function getEvidenceMarket(rawText: string) {
  const explicitMarket = getEvidenceLine(rawText, ["market", "category"]);
  const lowerText = rawText.toLowerCase();

  if (explicitMarket) return explicitMarket;
  if (/codex|agency|automation consultant/.test(lowerText)) return "AI agency workflow";
  if (/worksheet|teacher|preschool|homeschool|student|education/.test(lowerText)) return "Education printables";
  if (/review|restaurant|clinic|contractor|local business|google business/.test(lowerText)) return "Local business operations";
  if (/github|repo|issue|developer|readme/.test(lowerText)) return "Developer workflow";
  if (/youtube|tiktok|creator|newsletter|x post/.test(lowerText)) return "Creator distribution";

  return "Market evidence";
}

function getEvidenceBuyer(rawText: string) {
  const explicitBuyer = getEvidenceLine(rawText, ["buyer", "who buys", "customer"]);
  const lowerText = rawText.toLowerCase();

  if (explicitBuyer) return explicitBuyer;
  if (/codex|agency|automation consultant/.test(lowerText)) return "AI agency founders and automation consultants";
  if (/worksheet|teacher|preschool|homeschool/.test(lowerText)) return "Teachers, homeschool parents, and printable sellers";
  if (/review|restaurant|clinic|contractor|local business/.test(lowerText)) return "Local business owners and office managers";
  if (/github|repo|developer/.test(lowerText)) return "Developers and technical founders";

  return "Buyers already trying to solve this workflow manually";
}

function getEvidenceProduct(rawText: string, market: string) {
  const explicitProduct = getEvidenceLine(rawText, ["product", "product idea"]);

  if (explicitProduct) return explicitProduct;
  return `${market} action brief`;
}

function getEvidenceScore(rawText: string) {
  const moneySignals = (
    rawText.match(/\$|mrr|arr|revenue|paid|customers?|pricing|subscription|bought|sales/gi) ||
    []
  ).length;
  const buyerSignals = (
    rawText.match(/buyer|customer|founder|teacher|owner|agency|consultant|business|parent/gi) ||
    []
  ).length;
  const distributionSignals = (
    rawText.match(/x post|twitter|tiktok|youtube|newsletter|seo|community|dm|cold email|github/gi) ||
    []
  ).length;
  const workflowSignals = (
    rawText.match(/workflow|repeat|manual|template|dashboard|monitor|report|generator|checklist/gi) ||
    []
  ).length;

  return Math.min(
    100,
    42 +
      Math.min(24, moneySignals * 6) +
      Math.min(14, buyerSignals * 3) +
      Math.min(10, distributionSignals * 3) +
      Math.min(10, workflowSignals * 2),
  );
}

function getEvidenceLevelFromScore(score: number): EvidenceDraft["evidenceLevel"] {
  if (score >= 82) return "strong";
  if (score >= 65) return "medium";
  return "weak";
}

function getRecommendedUse(score: number): EvidenceDraft["recommendedUse"] {
  if (score >= 78) return "build_sell_post";
  if (score >= 60) return "sell_post";
  return "research_more";
}

function createEvidenceDraft(rawText: string, index: number, sourceType = "Raw Paste"): EvidenceDraft {
  const market = getEvidenceMarket(rawText);
  const product = getEvidenceProduct(rawText, market);
  const buyer = getEvidenceBuyer(rawText);
  const paidPain =
    getEvidenceLine(rawText, ["paid pain", "pain"]) ||
    truncateEvidenceText(rawText, 180) ||
    "The buyer has a repeated workflow pain worth validating.";
  const price = getEvidencePrice(rawText);
  const distributionChannel =
    getEvidenceLine(rawText, ["distribution", "distribution channel", "channel"]) ||
    "X posts, direct DMs, niche communities, and buyer-specific teardown posts.";
  const leadMagnet =
    getEvidenceLine(rawText, ["lead magnet", "free offer"]) ||
    `Free ${product} teardown or checklist`;
  const offer =
    getEvidenceLine(rawText, ["offer"]) ||
    `${price} ${product} starter pack for ${buyer}`;
  const revenueEvidence =
    getEvidenceLine(rawText, ["revenue evidence", "revenue"]) ||
    "Look for paid behavior: price, MRR, ARR, customers, subscriptions, or repeated buying behavior in the source.";
  const sourceEvidence =
    getEvidenceLine(rawText, ["source evidence", "source"]) ||
    truncateEvidenceText(rawText, 220);
  const whyItWorked =
    getEvidenceLine(rawText, ["why it worked"]) ||
    "The evidence points to a repeated buyer workflow, a visible pain, and a small offer that can be tested before building.";
  const adaptationIdea =
    getEvidenceLine(rawText, ["adaptation", "adaptation idea"]) ||
    `Turn this into a Bilion Opportunity Reveal for ${buyer}: post the insight, DM the offer, and build only after replies.`;
  const opportunityScore = getEvidenceScore(rawText);

  return {
    id: `evidence-draft-${Date.now()}-${index}`,
    createdAt: new Date().toISOString(),
    rawText: rawText.trim(),
    sourceType,
    market,
    product,
    buyer,
    paidPain,
    offer,
    price,
    revenueEvidence,
    sourceEvidence,
    distributionChannel,
    leadMagnet,
    whyItWorked,
    adaptationIdea,
    opportunityScore,
    evidenceLevel: getEvidenceLevelFromScore(opportunityScore),
    recommendedUse: getRecommendedUse(opportunityScore),
    launchPackSeed: [
      `Hook: ${adaptationIdea}`,
      `DM: I noticed this paid pain for ${buyer}. Want a quick teardown of the workflow and first offer?`,
      `48h test: post the insight, DM 15 buyers, track replies, then build only after interest.`,
    ].join("\n"),
  };
}

function convertEvidenceDraftToSignal(draft: EvidenceDraft): BuildSignal {
  return {
    id: `approved-${draft.id}`,
    latestSignal: draft.sourceEvidence,
    sourceTitle: `Evidence Intake: ${draft.product}`,
    sourceUrl: "",
    sourceType: "Evidence Intake",
    sourceNote: [
      `Source: ${draft.sourceType}`,
      `Market: ${draft.market}`,
      `Revenue evidence: ${draft.revenueEvidence}`,
      `Evidence: ${draft.evidenceLevel}`,
      `Recommended: ${draft.recommendedUse}`,
    ].join(" | "),
    buyer: draft.buyer,
    pain: draft.paidPain,
    whyNow: draft.whyItWorked,
    whatYouCanBuild: draft.adaptationIdea,
    coreFeatures: [
      "Evidence summary",
      "Buyer and paid pain",
      "Launch pack seed",
      "48-hour validation plan",
    ],
    comparablePrice: draft.price,
    buildSteps: [
      "Turn the evidence into one sharp public post.",
      "Send the offer to 15 likely buyers.",
      "Track replies, objections, and willingness to pay.",
      "Build the narrow version only after buyer replies.",
    ],
    patternMatches: [
      draft.market,
      draft.distributionChannel,
      draft.leadMagnet,
      `Opportunity score ${draft.opportunityScore}/100`,
    ],
    codeXPrompt: `Build a local-only Opportunity Reveal prototype from this approved evidence record.

Market:
${draft.market}

Product:
${draft.product}

Buyer:
${draft.buyer}

Paid pain:
${draft.paidPain}

Offer:
${draft.offer}

Price:
${draft.price}

Distribution:
${draft.distributionChannel}

Lead magnet:
${draft.leadMagnet}

Launch pack seed:
${draft.launchPackSeed}

Requirements:
- Use local React state only.
- Do not add auth, payments, external APIs, or a database.
- Show the opportunity, sell-first assets, validation tracker, and build prompt after replies.`,
    signalSourceLabel: "Evidence Intake",
  };
}

function pickNextSignal(
  options: BuildSignal[],
  {
    currentSignal,
    rejectedSignalIds = [],
    seenSignalIds = [],
  }: {
    currentSignal?: BuildSignal;
    rejectedSignalIds?: string[];
    seenSignalIds?: string[];
  } = {},
) {
  const currentId = currentSignal ? getSignalKey(currentSignal) : "";
  const currentSource = currentSignal ? getSignalSourceKey(currentSignal) : "";
  const rejectedIds = new Set(rejectedSignalIds);
  const seenIds = new Set(seenSignalIds);
  const candidates = options.filter((signal) => getSignalKey(signal) !== currentId);
  const pool = candidates.length ? candidates : options;

  return pool
    .slice()
    .sort((a, b) => {
      const aRejected = rejectedIds.has(getSignalKey(a)) ? 1 : 0;
      const bRejected = rejectedIds.has(getSignalKey(b)) ? 1 : 0;
      const aSeen = seenIds.has(getSignalKey(a)) ? 1 : 0;
      const bSeen = seenIds.has(getSignalKey(b)) ? 1 : 0;
      const aSameSource = getSignalSourceKey(a) === currentSource ? 1 : 0;
      const bSameSource = getSignalSourceKey(b) === currentSource ? 1 : 0;

      return (
        aRejected - bRejected ||
        aSeen - bSeen ||
        aSameSource - bSameSource ||
        getSignalOpportunityScore(b) - getSignalOpportunityScore(a) ||
        a.id.localeCompare(b.id)
      );
    })[0];
}

function getSignalGroups(
  signals: BuildSignal[],
  githubSignal?: BuildSignal,
  seenSignalIds: string[] = [],
  rejectedSignalIds: string[] = [],
) {
  const gmailSignals = signals.filter(isGmailSignal);
  const newsletterSignals = signals.filter(
    (signal) => isNewsletterSignal(signal) && !isGmailSignal(signal),
  );
  const nonNewsletterSignals = signals.filter(
    (signal) => !isNewsletterSignal(signal) && !isGmailSignal(signal),
  );
  const recommendedPool = [
    ...gmailSignals,
    ...nonNewsletterSignals,
    ...newsletterSignals,
  ]
    .filter((signal) => !rejectedSignalIds.includes(getSignalKey(signal)))
    .sort((a, b) => {
      const aSeen = seenSignalIds.includes(getSignalKey(a)) ? 1 : 0;
      const bSeen = seenSignalIds.includes(getSignalKey(b)) ? 1 : 0;

      return (
        aSeen - bSeen ||
        getSignalOpportunityScore(b) - getSignalOpportunityScore(a) ||
        a.id.localeCompare(b.id)
      );
    });
  const recommendedBySource = new Map<string, BuildSignal>();

  for (const signal of recommendedPool) {
    const sourceKey = getSignalSourceKey(signal);

    if (!recommendedBySource.has(sourceKey)) {
      recommendedBySource.set(sourceKey, signal);
    }
  }

  const recommendedSignals = Array.from(
    new Map(
      [...recommendedBySource.values(), ...recommendedPool].map((signal) => [
        signal.id,
        signal,
      ]),
    ).values(),
  ).slice(0, 8);
  const recommendedIds = new Set(recommendedSignals.map((signal) => signal.id));
  const localSignals = nonNewsletterSignals.filter(
    (signal) => !recommendedIds.has(signal.id),
  );

  return [
    {
      label: "Recommended",
      signals: recommendedSignals,
    },
    {
      label: "Local AI Use Cases",
      signals: localSignals,
    },
    {
      label: "Gmail Signals",
      signals: gmailSignals,
    },
    {
      label: "Newsletter Signals",
      signals: newsletterSignals,
    },
    {
      label: "GitHub Signal",
      signals: githubSignal ? [githubSignal] : [],
    },
  ].filter((group) => group.signals.length > 0);
}

function getActionSignal(signal: BuildSignal, buyer: string): BuildSignal {
  const selectedBuyer = buyer.trim() || signal.buyer;

  return {
    ...signal,
    buyer: selectedBuyer,
    pain: `${signal.pain} For ${selectedBuyer}, the urgent question is what to build, sell, or post next from this proven signal.`,
  };
}

function buildActionMasterPrompt(
  signal: BuildSignal,
  buyer: string,
  action: NextAction,
) {
  const actionSignal = getActionSignal(signal, buyer);
  const prompt = buildMasterPrompt(actionSignal, getActionAngleIndex(action));
  const seed = selectHighQualityBusinessSpark(actionSignal);
  const actionLabel = getActionLabel(action);
  const actionTitle =
    action === "build"
      ? `${workflowBrandName(actionSignal)} MVP for ${titleCase(buyer || actionSignal.buyer)}`
      : action === "sell"
        ? `${workflowOutputTitle(actionSignal)} Offer for ${titleCase(buyer || actionSignal.buyer)}`
        : `${workflowOutputTitle(actionSignal)} Market Post for ${titleCase(buyer || actionSignal.buyer)}`;
  const postCopy = `Hook: ${actionSignal.buyer} do not need another AI idea. They need a faster way to handle ${workflowName(actionSignal)}.\n\nSignal: ${actionSignal.latestSignal}\n\nWhy it matters: ${actionSignal.whyNow}\n\nWhat to build: ${actionSignal.whatYouCanBuild}\n\nCTA: Want the 48h validation plan for this pattern?`;

  return applyBusinessSparkSeed({
    ...prompt,
    angleLabel: actionLabel,
    promptTitle: actionTitle,
    buyer: actionSignal.buyer,
    whoPays: actionSignal.buyer,
    pain: actionSignal.pain,
    originalCase: actionSignal.latestSignal,
    provenPattern: `${actionSignal.sourceTitle}: ${actionSignal.latestSignal}`,
    whyItSold: `${actionSignal.whyNow} ${actionSignal.comparablePrice}`,
    launchCopy: {
      ...prompt.launchCopy,
      xPost: action === "post" ? postCopy : prompt.launchCopy.xPost,
      dmMessage:
        action === "sell"
          ? `Quick idea: I am testing a ${prompt.price} ${workflowOutputTitle(actionSignal)} offer for ${actionSignal.buyer}. Want me to send a before/after sample and see if it fits your workflow?`
          : prompt.launchCopy.dmMessage,
    },
    firstPaidOffer:
      action === "sell"
        ? `${workflowOutputTitle(actionSignal)} Sprint for ${actionSignal.buyer}: ${prompt.firstVersion}`
        : prompt.firstPaidOffer,
  }, seed);
}

function buildMasterPrompt(signal: BuildSignal, angleIndex: number): MasterPrompt {
  const angle = getAngle(angleIndex);
  const promptTitle = buildPromptTitle(signal, angleIndex);
  const buyer = angle.buyer(signal);
  const pain = angle.pain(signal);
  const productAngle = angle.productAngle(signal);
  const firstVersion = angle.firstVersion(signal);
  const price = angle.price;
  const validationPlan = angle.validationPlan(signal);
  const features = signal.coreFeatures.length
    ? signal.coreFeatures
    : ["Main input form", "Generated output", "Saved examples", "Copy button"];
  const buildSteps = signal.buildSteps.length
    ? signal.buildSteps.map(normalizeLocalOnlyBuildStep)
    : [
        "Create the main page and mock data.",
        "Build the primary workflow.",
        "Add generated output and copy buttons.",
      ];
  const originalCase = signal.latestSignal || signal.sourceTitle;
  const revenueSignal = `${price}. ${signal.comparablePrice || "The buyer has a repeated workflow pain and can justify a small paid tool or setup offer."}`;
  const distributionChannel = validationPlan[1] || `Reach ${compactBuyer(signal)} with a before/after demo and ask for paid pilot objections.`;
  const provenPattern = `${signal.sourceTitle || "A real business signal"}: ${originalCase}`;
  const whyItSold = `${signal.whyNow || "The timing is strong because the buyer already has a repeated painful workflow."} ${signal.comparablePrice || "The pattern can be monetized as a small paid tool, prompt pack, or setup offer."}`;
  const hasPricingSignal = Boolean(signal.comparablePrice.trim());
  const hasPatternMatches = signal.patternMatches.length > 0;
  const marketProof = {
    comparablePattern: signal.patternMatches.length
      ? signal.patternMatches.slice(0, 3).join(" / ")
      : signal.sourceType || "Comparable workflow pattern",
    revenueOrPricingSignal: signal.comparablePrice || "No hard revenue number available. Proof is directional, not guaranteed.",
    whyBuyersPay: `${buyer} already pay when a repeated, annoying workflow becomes faster, clearer, or easier to hand off.`,
    distributionChannel,
    evidenceStrength: hasPricingSignal && hasPatternMatches
      ? "Strong" as const
      : hasPricingSignal
        ? "Medium" as const
        : "Directional" as const,
    note: hasPricingSignal
      ? "Pricing signal exists, but demand still needs direct validation."
      : "Proof is directional, not guaranteed.",
  };
  const whoPays = buyer;
  const yourProductAngle = productAngle;
  const firstPaidOffer = `${firstVersion} Sell it as ${price} before adding extra features.`;
  const manualFirstPaidOffer = buildManualFirstOffer({
    buyer,
    candidate: firstPaidOffer,
    pain,
    price,
  });
  const directValidationPlan = buildDirect48hValidationPlan({
    buyer,
    buildAfterReplies: firstVersion,
    pain,
    price: manualFirstPaidOffer,
  });
  const leadMagnet = `Free ${workflowOutputTitle(signal)} teardown: show one messy ${workflowName(signal)} input, the cleaned output, and the exact prompt or workflow used to produce it.`;
  const launchCopy = {
    xPost: `I found a proven pattern: ${compactBuyer(signal)} need ${workflowOutcome(signal)} but the work is still manual. I would sell ${promptTitle} at ${price}: one focused offer, one before/after demo, and a 48-hour validation sprint.`,
    lpHeadline: `${workflowOutputTitle(signal)} for ${titleCase(compactBuyer(signal))}`,
    dmMessage: `Quick idea: I am testing a ${price} offer that turns ${workflowInput(signal)} into ${workflowOutcome(signal)} for ${compactBuyer(signal)}. Want me to send a before/after sample?`,
  };
  const firstCustomerPlan = {
    whoToContactFirst: compactBuyer(signal),
    whereToFindThem: distributionChannel,
    whatToSay: launchCopy.dmMessage,
    whatToOffer: manualFirstPaidOffer,
    validationWithin48h: directValidationPlan.join(" "),
  };
  const uxStructure = [
    `Header with ${promptTitle}, buyer, pain, product angle, and ${price} offer.`,
    `Primary workflow panel for ${workflowInput(signal)} with sample input selectors and editable fields.`,
    `Generated output panel that turns the input into ${workflowOutcome(signal)}.`,
    "Saved records panel with status, created date, buyer context, notes, and copy/export actions.",
    "48h validation panel with outreach copy, proof asset checklist, and next actions.",
  ];
  const dataModel = [
    "Use local React state only.",
    "Create a source input record with id, title, raw input, buyer, pain, status, createdAt, and notes.",
    "Create generated output records with id, sourceId, summary, sections, nextActions, price, and copied/saved state.",
    "Create sample records grounded in the original case so the app works immediately.",
    "Persist nothing to a database; saved records can live in local component state for the demo.",
  ];
  const copyExportBehavior = [
    "Add copy buttons for the generated output, buyer-facing summary, validation outreach, and full report.",
    "Add a save button that stores the current generated record in local React state.",
    "Show copied/saved feedback without changing layout size.",
    "Use navigator.clipboard when available and keep the UI usable if copying fails.",
  ];
  const constraints = [
    "Mobile-first.",
    "No auth.",
    "No database.",
    "No external API.",
    "Mock data/local React state only.",
    "No payments.",
    "No environment variables.",
  ];

  const fullCodeXMasterPrompt = `Build a standalone new web app from scratch.

1. Product name:
${promptTitle}

2. Buyer:
${buyer}

3. Pain:
${pain}

4. Product angle:
${productAngle}

5. First version scope:
${firstVersion}

6. Original case:
${originalCase}

Source context:
- Title: ${signal.sourceTitle || "Practical AI adoption signal"}
- Type: ${signal.sourceType || "Founder Story"}
- Note: ${signal.sourceNote || signal.whyNow}
${signal.sourceUrl ? `- URL: ${signal.sourceUrl}` : ""}

7. Revenue signal:
${revenueSignal}

8. Distribution channel:
${distributionChannel}

9. What to build:
${signal.whatYouCanBuild || productAngle}

10. Core screens:
${uxStructure.map((section) => `- ${section}`).join("\n")}

11. Core features:
${features.map((feature) => `- ${feature}`).join("\n")}

12. Input fields:
- Raw ${workflowInput(signal)} input textarea or structured form.
- Buyer or account name.
- Pain severity or urgency selector.
- Status selector.
- Notes field.
- Sample input buttons using realistic mock records.

13. Output sections:
- Product opportunity summary.
- Buyer pain and why it matters now.
- Generated ${workflowOutcome(signal)}.
- Next actions.
- Revenue signal and price.
- 48h validation plan.
- Copy-ready outreach or client-facing summary.
- Saved records list.

14. State/data model:
${dataModel.map((item) => `- ${item}`).join("\n")}

15. UI direction:
- Mobile-first layout.
- Screenshot-worthy, premium SaaS-style interface.
- Clear sections for the workflow, generated output, saved examples, and next action.
- Include sample data so the app works immediately.
- Avoid generic startup copy. Make every label specific to this product.
- Show the price ${price} consistently wherever pricing appears.

16. Copy/export buttons:
${copyExportBehavior.map((item) => `- ${item}`).join("\n")}

17. Validation plan:
${validationPlan.map((step, index) => `${index + 1}. ${step}`).join("\n")}

18. Build steps:
${buildSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

19. Constraints:
${constraints.map((item) => `- ${item}`).join("\n")}

20. Commercial build instructions:
${angle.buildInstruction}

21. Core workflow:
1. The user opens the product and sees the product name, buyer, pain, and ${price} pricing.
2. The user enters or selects realistic sample input related to ${workflowInput(signal)}.
3. The app transforms that input into a structured commercial output.
4. The user reviews recommended next actions, status, and saved records.
5. The user can copy or export the output and see a clear validation asset for selling the product.

22. Mock AI behavior:
- Use deterministic mock AI behavior.
- Classify the input, extract key details, generate the structured output, and recommend next actions.
- Do not call external AI APIs.

23. Pattern matches:
${(signal.patternMatches.length ? signal.patternMatches : ["AI workflow", "Local operations"])
  .map((match) => `- ${match}`)
  .join("\n")}

24. Technical requirements:
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.
- Keep the scope narrow, commercial, and shippable.

25. Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Copy buttons work where relevant.
- The product name, buyer, pain, product angle, price, and validation plan are visible.
- The core screens, input fields, output sections, local state model, and copy/export behavior are implemented.
- The result feels ready to paste into Code X and build now.`;

  return {
    angleLabel: angle.label,
    promptTitle,
    originalCase,
    provenPattern,
    whyItSold,
    marketProof,
    whoPays,
    yourProductAngle,
    firstPaidOffer: manualFirstPaidOffer,
    buyer,
    pain,
    revenueSignal,
    distributionChannel,
    productAngle,
    whatToBuild: signal.whatYouCanBuild || productAngle,
    firstVersion,
    price,
    leadMagnet,
    launchCopy,
    firstCustomerPlan,
    coreFeatures: features,
    validationPlan: directValidationPlan,
    buildSteps,
    uxStructure,
    dataModel,
    copyExportBehavior,
    constraints,
    fullCodeXMasterPrompt,
  };
}

function getSeedSearchText(signal: BuildSignal) {
  return [
    signal.sourceTitle,
    signal.latestSignal,
    signal.buyer,
    signal.pain,
    signal.whyNow,
    signal.whatYouCanBuild,
    signal.comparablePrice,
    signal.patternMatches.join(" "),
  ].join(" ").toLowerCase();
}

function buildHighQualitySparkFromCanonicalSignal(signal: BuildSignal): HighQualityBusinessSpark | null {
  const canonicalSignal = getCanonicalMoneySignalForBuildSignal(signal);

  if (!canonicalSignal) {
    return null;
  }

  const fields = getCanonicalOpportunityFields(canonicalSignal);
  const validationSteps = fields.fortyEightHourTest.split("\n").filter(Boolean);
  const buildLater = getCanonicalBuildAfterReplies(canonicalSignal);
  const metadata = getMoneyMoveMetadata(signal, fields);

  return {
    path: canonicalSignal.market,
    sparkTitle: canonicalSignal.firstOffer,
    whyItWorks: `${canonicalSignal.proof} ${canonicalSignal.whatMoneyMoved}`,
    buyer: canonicalSignal.buyer,
    pain: canonicalSignal.paidPain,
    firstOffer: canonicalSignal.firstOffer,
    distributionChannel: canonicalSignal.channels.join(", "),
    dmTarget: canonicalSignal.buyer,
    fortyEightHourTest: validationSteps,
    launchPost: `${fields.postHook}\n\nMoney proof: ${canonicalSignal.proof}\nWhat sold: ${canonicalSignal.whatMoneyMoved}\nBuild Brief: ${canonicalSignal.firstOffer}\nBuyer: ${canonicalSignal.buyer}\nPain: ${canonicalSignal.paidPain}\nFirst offer: ${canonicalSignal.firstOffer}\nTest: ${validationSteps.join(" ")}`,
    dmScript: fields.dmScript,
    codexPromptPreview: `Build after replies. Start with ${buildLater}.`,
    codexBuildPrompt: `Build the smallest sellable proof asset for this manual offer. Build only after someone replies, clicks, or asks for the offer. Proof asset: ${metadata.proofAssetType}. Money proof: ${canonicalSignal.proof}. What money moved: ${canonicalSignal.whatMoneyMoved}. Market: ${canonicalSignal.market}. Target buyer: ${canonicalSignal.buyer}. Paid pain: ${canonicalSignal.paidPain}. Manual offer already tested: ${canonicalSignal.firstOffer}. Build only this proof asset: ${buildLater}. Build gate: ${metadata.buildGate}. Use Next.js, React, and TypeScript. Use local state and localStorage only. No auth, no database, no payment integration, and no external APIs. Include an offer overview, input form, generated proof output, launch copy, DM script, copy buttons, and validation panel. The validation panel must include this 48-hour plan: ${validationSteps.join(" ")}. Done criteria: demo-ready, mobile-first, and useful for testing demand before building anything larger.`,
  };
}

function buildHighQualitySparkFromSignalInbox(signal: BuildSignal): HighQualityBusinessSpark | null {
  if (!signal.id.startsWith(getMoneySignalIdPrefix("approved"))) {
    return null;
  }

  const detail = getOpportunityDetailFields(signal);
  const validationSteps = detail.fortyEightHourTest.split("\n").filter(Boolean);
  const metadata = getMoneyMoveMetadata(signal, detail);

  return {
    path: getSignalMarket(signal),
    sparkTitle: signal.sourceTitle,
    whyItWorks: `${detail.proof} ${detail.whatSold}`,
    buyer: detail.buyer,
    pain: detail.paidPain,
    firstOffer: detail.firstOffer,
    distributionChannel: detail.distribution,
    dmTarget: detail.buyer,
    fortyEightHourTest: validationSteps,
    launchPost: `${detail.postHook}\n\nMoney proof: ${detail.proof}\nWhat moved: ${detail.whatSold}\nBuild Brief: ${detail.firstOffer}\nBuyer: ${detail.buyer}\nPaid pain: ${detail.paidPain}\n48h test: ${validationSteps.join(" ")}`,
    dmScript: detail.dmScript,
    codexPromptPreview: `Build after replies. Start with ${detail.buildAfterReplies}.`,
    codexBuildPrompt: `Build the smallest sellable proof asset for this manual offer. Build only after someone replies, clicks, or asks for the offer. Source: Signal Inbox. Proof asset: ${metadata.proofAssetType}. Money proof: ${detail.proof}. What money moved: ${detail.whatSold}. Market: ${getSignalMarket(signal)}. Buyer: ${detail.buyer}. Paid pain: ${detail.paidPain}. Manual offer already tested: ${detail.firstOffer}. Build only this proof asset: ${signal.whatYouCanBuild}. Build gate: ${metadata.buildGate}. Use Next.js, React, and TypeScript. Use local state and localStorage only. No auth, no database, no payment integration, and no external APIs. Include an offer overview, input form, generated proof output, launch copy, DM script, copy buttons, and validation panel. The validation panel must include this 48-hour plan: ${validationSteps.join(" ")}. Done criteria: demo-ready, mobile-first, and useful for testing demand before building anything larger.`,
  };
}

function buildHighQualitySparkFromMarketSignal(signal: BuildSignal): HighQualityBusinessSpark | null {
  const context = getMarketSpecificContextForSignal(signal);

  if (!context) {
    return null;
  }

  const { market, opportunity } = context;
  const sparkTitle = opportunity.firstOfferName;
  const firstOffer = getFirstOfferText(opportunity);
  const validationText = opportunity.validationSteps.join(" ");
  const proofAssetName = `${sparkTitle} Proof Asset`;

  return {
    path: market,
    sparkTitle,
    whyItWorks: `${opportunity.proofLabel}: ${opportunity.whatSold}.`,
    buyer: opportunity.buyer,
    pain: opportunity.paidPain,
    firstOffer,
    distributionChannel: opportunity.postHook,
    dmTarget: opportunity.buyer,
    fortyEightHourTest: opportunity.validationSteps,
    launchPost: `${opportunity.postHook}\n\nMoney proof: ${opportunity.proofLabel} - ${opportunity.whatSold}\nPattern: ${opportunity.patternTitle}\nBuild Brief: ${sparkTitle}\nBuyer: ${opportunity.buyer}\nPain: ${opportunity.paidPain}\nFirst offer: ${firstOffer}\nTest: ${validationText}`,
    dmScript: opportunity.dmScript,
    codexPromptPreview: `Build a mobile-first MVP for ${sparkTitle}. Start with ${opportunity.buildAfterReplies}.`,
    codexBuildPrompt: `Build the smallest sellable proof asset for this manual offer. Build only after someone replies, clicks, or asks for the offer. Proof asset: ${proofAssetName}. Money proof: ${opportunity.proofLabel} for ${opportunity.whatSold}. Pattern: ${opportunity.patternTitle}. Market: ${market}. Target buyer: ${opportunity.buyer}. Paid pain: ${opportunity.paidPain}. Manual offer: ${firstOffer}. Build only this proof asset: ${opportunity.buildAfterReplies}. Build gate: build only after 3 buyer replies or 1 buying-intent reply. Use Next.js, React, and TypeScript. Use local state and localStorage only. No auth, no database, no payment integration, and no external APIs. Include an offer overview, input form, generated proof output, launch copy, DM script, copy buttons, and validation panel. The validation panel must include this 48-hour plan: ${validationText}. Done criteria: demo-ready, mobile-first, and useful for testing demand before building anything larger.`,
  };
}

function selectHighQualityBusinessSpark(signal: BuildSignal): HighQualityBusinessSpark {
  const signalInboxSeed = buildHighQualitySparkFromSignalInbox(signal);

  if (signalInboxSeed) {
    return signalInboxSeed;
  }

  const canonicalSeed = buildHighQualitySparkFromCanonicalSignal(signal);

  if (canonicalSeed) {
    return canonicalSeed;
  }

  const marketSeed = buildHighQualitySparkFromMarketSignal(signal);

  if (marketSeed) {
    return marketSeed;
  }

  const text = getSeedSearchText(signal);

  if (/invoice|freelancer|agency|overdue|follow.?up|payment/.test(text)) {
    return highQualityBusinessSparks[0]!;
  }

  if (/contractor|construction|field|jobsite|daily report|site note/.test(text)) {
    return highQualityBusinessSparks[1]!;
  }

  if (/review|restaurant|clinic|salon|local shop|google business|reply/.test(text)) {
    return highQualityBusinessSparks[2]!;
  }

  if (/worksheet|teacher|parent|preschool|homeschool|education|child|tracing/.test(text)) {
    return highQualityBusinessSparks[3]!;
  }

  if (/agency|consultant|workflow|agent|codex|cursor|claude code|automation/.test(text)) {
    return highQualityBusinessSparks[4]!;
  }

  const market = getSignalMarket(signal);
  return (
    highQualityBusinessSparks.find((spark) => spark.path === market) ||
    highQualityBusinessSparks[0]!
  );
}

const softwareFirstOfferPattern =
  /\b(bot|dashboard|generator|copilot|automation platform|saas|app|ai assistant)\b/i;

function getManualOfferPrice(value: string) {
  const text = normalizeDisplayText(value);

  if (/jpy|ﾂ･|farm|farmer|line/i.test(text)) {
    return "JPY 9,800 one-time.";
  }

  const dollarMatch = text.match(/\$[\d,]+/);

  if (dollarMatch) {
    return `${dollarMatch[0]} one-time.`;
  }

  return "$99 one-time.";
}

function getManualOfferName(value: string) {
  const cleaned = titleCase(
    normalizeDisplayText(value)
      .replace(softwareFirstOfferPattern, "")
      .replace(/\b(mvp|software|tool|platform|with codex)\b/gi, "")
      .replace(/[^a-z0-9\s-]/gi, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
  const compactName = cleaned.split(/\s+/).slice(0, 4).join(" ");

  if (/farm|farmer|line|sensor|crop/i.test(value)) {
    return "Farm Operations Cleanup Pack";
  }

  if (/audit/i.test(value)) {
    return compactName ? `${compactName} Audit` : "Manual Audit Pack";
  }

  if (/checklist/i.test(value)) {
    return compactName ? `${compactName} Checklist Pack` : "Manual Checklist Pack";
  }

  if (/prompt/i.test(value)) {
    return compactName ? `${compactName} Prompt Pack` : "Manual Prompt Pack";
  }

  return compactName ? `${compactName} Cleanup Pack` : "Manual Cleanup Pack";
}

function buildManualFirstOffer({
  buyer,
  candidate,
  pain,
  price,
}: {
  buyer: string;
  candidate: string;
  pain: string;
  price: string;
}) {
  const sourceText = `${candidate} ${buyer} ${pain}`;
  const offerName = getManualOfferName(sourceText);
  const oneTimePrice = getManualOfferPrice(`${price} ${sourceText}`);
  const outcome = /farm|farmer|line|sensor|crop/i.test(sourceText)
    ? "Organize one day of LINE messages, sensor notes, crop checks, and schedules into a clean daily operations report."
    : `Manually turn one messy buyer case into a clean before/after sample, checklist, and next-step report for ${compactBuyer({ buyer } as BuildSignal)}.`;

  return `${offerName}
${outcome}
${oneTimePrice}`;
}

function buildDirect48hValidationPlan({
  buyer,
  buildAfterReplies,
  pain,
  price,
}: {
  buyer: string;
  buildAfterReplies: string;
  pain: string;
  price: string;
}) {
  const sourceText = `${buyer} ${pain} ${buildAfterReplies}`;
  const buyerTarget = /farm|farmer|line|sensor|crop/i.test(sourceText)
    ? "small farms or farm consultants"
    : compactBuyer({ buyer } as BuildSignal);
  const offerPrice = getManualOfferPrice(`${price} ${sourceText}`).replace(/\.$/, "");

  return [
    `Pick 20 ${buyerTarget}.`,
    "Create one before/after sample manually.",
    "DM the sample.",
    `Ask if they would pay ${offerPrice}.`,
    "Build only if 3 people reply.",
  ];
}

function buildCodexAfterRepliesLine(value: string) {
  const normalized = normalizeDisplayText(value)
    .replace(/^if\s+\d+[^,]+,\s*/i, "")
    .replace(/^build\s+/i, "")
    .replace(/\.$/, "");

  if (/farm|farmer|line|sensor|crop/i.test(normalized)) {
    return "Build a LINE-based daily report bot only after replies.";
  }

  return `Build ${normalized} only after replies.`;
}

function extractSeedPrice(seed: HighQualityBusinessSpark) {
  return seed.firstOffer.split(".")[0]?.trim() || seed.firstOffer;
}

function applyBusinessSparkSeed(
  fallbackPrompt: MasterPrompt,
  seed: HighQualityBusinessSpark,
): MasterPrompt {
  const price = extractSeedPrice(seed);
  const firstVersion = seed.codexPromptPreview;
  const distributionChannel =
    seed.distributionChannel || "X posts, direct DMs, and buyer communities.";
  const manualFirstOffer = buildManualFirstOffer({
    buyer: seed.buyer,
    candidate: seed.firstOffer,
    pain: seed.pain,
    price,
  });
  const directValidationPlan = buildDirect48hValidationPlan({
    buyer: seed.buyer,
    buildAfterReplies: firstVersion,
    pain: seed.pain,
    price: manualFirstOffer,
  });

  return {
    ...fallbackPrompt,
    aiReveal: undefined,
    promptTitle: seed.sparkTitle,
    originalCase: seed.whyItWorks,
    provenPattern: seed.whyItWorks,
    whyItSold: seed.whyItWorks,
    marketProof: {
      ...fallbackPrompt.marketProof,
      comparablePattern: seed.path,
      revenueOrPricingSignal: price,
      whyBuyersPay: seed.whyItWorks,
      distributionChannel,
      evidenceStrength: "Strong",
      note: "Seeded from a reviewed Bilion Build Brief pattern.",
    },
    whoPays: seed.buyer,
    yourProductAngle: seed.codexPromptPreview,
    firstPaidOffer: manualFirstOffer,
    buyer: seed.buyer,
    pain: seed.pain,
    revenueSignal: price,
    distributionChannel,
    productAngle: seed.codexPromptPreview,
    whatToBuild: seed.codexPromptPreview,
    firstVersion,
    price,
    leadMagnet: `One before/after sample for ${seed.sparkTitle}.`,
    launchCopy: {
      xPost: seed.launchPost,
      lpHeadline: seed.sparkTitle,
      dmMessage: seed.dmScript,
    },
    firstCustomerPlan: {
      whoToContactFirst: seed.buyer,
      whereToFindThem:
        seed.dmTarget || distributionChannel,
      whatToSay: seed.dmScript,
      whatToOffer: manualFirstOffer,
      validationWithin48h: directValidationPlan.join(" "),
    },
    coreFeatures: [
      "Input form",
      "Generated output",
      "Saved records",
      "Copy buttons",
      "Validation panel",
    ],
    validationPlan: directValidationPlan,
    buildSteps: [
      "Build the input and mock examples.",
      "Generate the core output from local state.",
      "Add saved records, copy buttons, and validation panel.",
    ],
    fullCodeXMasterPrompt: seed.codexBuildPrompt,
  };
}

function applyBusinessSparkSeedToResult(
  fallbackResult: ApiResult,
  seed: HighQualityBusinessSpark,
): ApiResult {
  const manualFirstOffer = buildManualFirstOffer({
    buyer: seed.buyer,
    candidate: seed.firstOffer,
    pain: seed.pain,
    price: extractSeedPrice(seed),
  });
  const directValidationPlan = buildDirect48hValidationPlan({
    buyer: seed.buyer,
    buildAfterReplies: seed.codexPromptPreview,
    pain: seed.pain,
    price: manualFirstOffer,
  });

  return {
    free: {
      latest_signal: seed.whyItWorks,
      what_you_can_build: seed.codexPromptPreview,
      buyer: seed.buyer,
      pain: seed.pain,
      why_now: seed.whyItWorks,
    },
    paid: {
      ...fallbackResult.paid,
      latest_signal: seed.whyItWorks,
      source_title: seed.sparkTitle,
      buyer: seed.buyer,
      pain: seed.pain,
      why_now: seed.whyItWorks,
      what_you_can_build: seed.codexPromptPreview,
      comparable_price: manualFirstOffer,
      build_steps: directValidationPlan,
      pattern_matches: [
        seed.path,
        seed.distributionChannel || "Reviewed Build Brief seed",
        seed.dmTarget ? `DM target: ${seed.dmTarget}` : "Sell first, build after replies",
      ],
      code_x_prompt: seed.codexBuildPrompt,
    },
  };
}

function buildFreeSavedSignalCopy(signal: SavedSignal) {
  return `Bilion signal preview

Latest Signal:
${signal.latestSignal}

Buyer:
${signal.buyer}

Pain:
${signal.pain}

What You Can Build:
${signal.whatYouCanBuild}

Why Now:
${signal.whyNow}`;
}

function buildFreeMasterPromptCopy(masterPrompt: MasterPrompt) {
  return `Bilion Codex Build Brief preview

What already sold:
${masterPrompt.provenPattern}

Why it sold:
${masterPrompt.whyItSold}

Market proof:
- Evidence strength: ${masterPrompt.marketProof.evidenceStrength}
- Similar business / comparable pattern: ${masterPrompt.marketProof.comparablePattern}
- Revenue or pricing signal: ${masterPrompt.marketProof.revenueOrPricingSignal}
- Why buyers already pay: ${masterPrompt.marketProof.whyBuyersPay}
- Distribution channel that worked: ${masterPrompt.marketProof.distributionChannel}
- Note: ${masterPrompt.marketProof.note}

Your AI-native version:
${masterPrompt.yourProductAngle}

Who pays:
${masterPrompt.whoPays}

First paid offer:
${masterPrompt.firstPaidOffer}

Price:
${masterPrompt.price}

X post:
${masterPrompt.launchCopy.xPost}

DM script:
${masterPrompt.launchCopy.dmMessage}

48-hour validation plan:
${masterPrompt.validationPlan.map((step, index) => `${index + 1}. ${step}`).join("\n")}

Unlock Bilion Pro — $9.99/month
Includes unlimited Money Moves, more versions, saved tests, and build-after-replies plans.`;
}

function buildValidationPlanCopy(masterPrompt: MasterPrompt) {
  return `48-hour validation plan:

${masterPrompt.validationPlan.map((step, index) => `${index + 1}. ${step}`).join("\n")}`;
}

function buildCodexExportSection(
  masterPrompt: MasterPrompt,
  includeCodexPrompt: boolean,
) {
  if (!includeCodexPrompt) {
    return "";
  }

  return `

Codex prompt:
${masterPrompt.fullCodeXMasterPrompt}`;
}

function buildExportAssetCopy(
  masterPrompt: MasterPrompt,
  kind: ExportAssetKind,
  includeCodexPrompt: boolean,
) {
  const validationPlan = masterPrompt.validationPlan
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");
  const codexSection = buildCodexExportSection(
    masterPrompt,
    includeCodexPrompt,
  );
  const sharedFields = `Title:
${masterPrompt.promptTitle}

Buyer:
${masterPrompt.buyer}

Pain:
${masterPrompt.pain}

Why now:
${masterPrompt.whyItSold}

First product / what to build:
${masterPrompt.whatToBuild}

Price:
${masterPrompt.price}

Distribution angle:
${masterPrompt.distributionChannel}

Lead magnet angle:
${masterPrompt.leadMagnet}

48h validation plan:
${validationPlan}`;

  if (kind === "pdf") {
    return `Free PDF page

${sharedFields}

CTA:
Use this as a free teaser. Invite readers to get the full $19 Pattern Pack with launch copy, buyer DM, and build prompt.${codexSection}`;
  }

  if (kind === "pack") {
    return `$19 Pattern Pack entry

${sharedFields}

What already sold:
${masterPrompt.provenPattern}

Market proof:
- Comparable pattern: ${masterPrompt.marketProof.comparablePattern}
- Revenue or pricing signal: ${masterPrompt.marketProof.revenueOrPricingSignal}
- Why buyers pay: ${masterPrompt.marketProof.whyBuyersPay}
- Evidence strength: ${masterPrompt.marketProof.evidenceStrength}

Launch copy:
${masterPrompt.launchCopy.xPost}

DM script:
${masterPrompt.launchCopy.dmMessage}${codexSection}`;
  }

  if (kind === "tiktok") {
    return `TikTok script

Title:
${masterPrompt.promptTitle}

Hook:
Most people ask AI what to build. This pattern starts with a buyer, a pain, and a price.

Scene 1 - The signal:
${masterPrompt.provenPattern}

Scene 2 - The buyer:
${masterPrompt.buyer}

Scene 3 - The pain:
${masterPrompt.pain}

Scene 4 - Why now:
${masterPrompt.whyItSold}

Scene 5 - The first product:
${masterPrompt.whatToBuild}

Scene 6 - Price:
${masterPrompt.price}

Scene 7 - Distribution:
${masterPrompt.distributionChannel}

Scene 8 - Free lead magnet:
${masterPrompt.leadMagnet}

CTA:
Comment "pattern" and I will send the 48h validation plan.

48h validation plan:
${validationPlan}${codexSection}`;
  }

  if (kind === "x") {
    return `X post

${masterPrompt.launchCopy.xPost}

Title: ${masterPrompt.promptTitle}
Buyer: ${masterPrompt.buyer}
Pain: ${masterPrompt.pain}
Why now: ${masterPrompt.whyItSold}
First product: ${masterPrompt.whatToBuild}
Price: ${masterPrompt.price}
Distribution: ${masterPrompt.distributionChannel}
Lead magnet: ${masterPrompt.leadMagnet}

48h validation:
${validationPlan}${codexSection}`;
  }

  return `Gumroad description

${masterPrompt.promptTitle}

A $19 Pattern Pack entry for builders who want a clear product angle instead of another vague AI idea.

What you get:
- Title: ${masterPrompt.promptTitle}
- Buyer: ${masterPrompt.buyer}
- Pain: ${masterPrompt.pain}
- Why now: ${masterPrompt.whyItSold}
- First product / what to build: ${masterPrompt.whatToBuild}
- Price: ${masterPrompt.price}
- Distribution angle: ${masterPrompt.distributionChannel}
- Lead magnet angle: ${masterPrompt.leadMagnet}
- X post and DM script
- 48h validation plan
${includeCodexPrompt ? "- Codex build prompt" : ""}

48h validation plan:
${validationPlan}

Who this is for:
Builders, consultants, and solo founders who want to turn real market signals into a small product they can test this week.

What this is not:
This is not a guaranteed business outcome. It is a sell-first brief designed to help you test buyer response fast.${codexSection}`;
}

function buildShortBriefCopy(masterPrompt: MasterPrompt) {
  return `Why it works:
${buildHolyShit(masterPrompt)}

Buyer:
${masterPrompt.buyer}

What Everyone Misses:
${buildWhatEveryoneMisses(masterPrompt)}

Money Angle:
${buildMoneyAngle(masterPrompt)}

First Wedge:
${buildFirstWedge(masterPrompt)}`;
}

function buildHolyShit(masterPrompt: MasterPrompt) {
  if (masterPrompt.aiReveal) {
    return masterPrompt.aiReveal.whyThisMatters.holyShit;
  }

  return `The interesting part is not the app idea. It is that ${masterPrompt.buyer} already show a repeated paid pain, and AI turns that pain into a tiny productized wedge instead of a full startup bet.`;
}

function buildWhatEveryoneMisses(masterPrompt: MasterPrompt) {
  if (masterPrompt.aiReveal) {
    return masterPrompt.aiReveal.whyThisMatters.whatEveryoneMisses;
  }

  return `Most people will summarize this as a problem/solution idea. The missed truth is the buying behavior: ${masterPrompt.marketProof.whyBuyersPay} That is the signal to study before deciding what to build.`;
}

function buildMoneyAngle(masterPrompt: MasterPrompt) {
  if (masterPrompt.aiReveal) {
    return masterPrompt.aiReveal.whyThisMatters.moneyAngle;
  }

  return `This can become money because the buyer, pain, and price are already visible. Revenue signal: ${masterPrompt.marketProof.revenueOrPricingSignal}. Distribution signal: ${masterPrompt.marketProof.distributionChannel}.`;
}

function buildFirstWedge(masterPrompt: MasterPrompt) {
  if (masterPrompt.aiReveal) {
    return masterPrompt.aiReveal.heroSummary.firstWedge;
  }

  return `Enter through the smallest useful slice: ${masterPrompt.firstPaidOffer} Do not start with a platform. Start with the buyer's most urgent before/after moment.`;
}

function getOpportunityScore(masterPrompt: MasterPrompt) {
  if (masterPrompt.aiReveal) {
    const score = masterPrompt.aiReveal.opportunityScore;

    return {
      scores: {
        "Buyer Urgency": score.buyerUrgency,
        "Pain Frequency": score.painFrequency,
        "Distribution Ease": score.distributionEase,
        "Speed To Validate": score.speedToValidate,
        "Build Complexity": score.buildComplexity,
      },
      total: score.total,
    };
  }

  const evidenceBonus =
    masterPrompt.marketProof.evidenceStrength === "Strong"
      ? 2
      : masterPrompt.marketProof.evidenceStrength === "Medium"
        ? 1
        : 0;
  const hasPrice = /\d|\$|ﾂ･|竄ｬ|ﾂ｣|mrr|arr|paid|price/i.test(
    `${masterPrompt.price} ${masterPrompt.marketProof.revenueOrPricingSignal}`,
  );
  const hasSharpBuyer = masterPrompt.buyer.length >= 16;
  const hasDistribution = masterPrompt.distributionChannel.length >= 12;
  const hasValidationPlan = masterPrompt.validationPlan.length >= 3;

  const scores = {
    Money: Math.min(10, 7 + evidenceBonus + (hasPrice ? 1 : 0)),
    Leverage: Math.min(10, 7 + evidenceBonus),
    "Buyer Clarity": Math.min(10, 7 + (hasSharpBuyer ? 2 : 0)),
    Virality: Math.min(10, 6 + (hasDistribution ? 2 : 0) + evidenceBonus),
    "48h Test": Math.min(10, 7 + (hasValidationPlan ? 2 : 0)),
  };
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

  return { scores, total };
}

function buildOpportunityScore(masterPrompt: MasterPrompt) {
  const { scores, total } = getOpportunityScore(masterPrompt);
  const scoreTotal = masterPrompt.aiReveal ? `${total}/50` : `${total}/50`;

  return [
    ...Object.entries(scores).map(([label, score]) => `${label}: ${score}/10`),
    `Total: ${scoreTotal}`,
    ...(masterPrompt.aiReveal ? [`Reason: ${masterPrompt.aiReveal.opportunityScore.reason}`] : []),
  ].join("\n");
}

function buildAttackPlan(masterPrompt: MasterPrompt) {
  if (masterPrompt.aiReveal) {
    return masterPrompt.aiReveal.attack48h
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n");
  }

  return masterPrompt.validationPlan
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");
}

function normalizeDisplayText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function truncateDisplayText(value: string, maxLength = 80) {
  const normalized = normalizeDisplayText(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

function formatDisplayText(value: string) {
  return value
    .split("\n")
    .map((line) => normalizeDisplayText(line))
    .filter(Boolean)
    .join("\n");
}

function buildBuildAngle(masterPrompt: MasterPrompt, includeCodexPrompt: boolean) {
  if (masterPrompt.aiReveal) {
    const codexNote = includeCodexPrompt
      ? `\n\nCodex prompt is available below, but only after the market angle is clear.`
      : "\n\nBilion Pro unlocks the full build-after-replies plan.";

    return `${masterPrompt.aiReveal.buildAfterReplies.doNotBuildYet}\n\nBuild only if: ${masterPrompt.aiReveal.buildAfterReplies.buildOnlyIf}\n\nMVP scope: ${masterPrompt.aiReveal.buildAfterReplies.mvpScope}${codexNote}`;
  }

  const codexNote = includeCodexPrompt
    ? `\n\nCodex prompt is available below, but only after the market angle is clear.`
    : "\n\nBilion Pro unlocks the full build-after-replies plan.";

  return `${buildCodexAfterRepliesLine(masterPrompt.firstVersion)}${codexNote}`;
}

function buildActionBriefFields(
  masterPrompt: MasterPrompt,
  _action: NextAction,
  includeCodexPrompt: boolean,
) {
  return [
    ["Money proof", masterPrompt.originalCase],
    ["Pattern", masterPrompt.marketProof.comparablePattern],
    ["Why money changed hands", masterPrompt.whyItSold],
    ["Buyer", masterPrompt.buyer],
    ["Paid pain", masterPrompt.pain],
    ["Your first offer", masterPrompt.firstPaidOffer],
    ["Price", getManualOfferPrice(masterPrompt.firstPaidOffer)],
    ["Post hook", masterPrompt.launchCopy.xPost],
    ["DM script", masterPrompt.launchCopy.dmMessage],
    ["48h validation", buildAttackPlan(masterPrompt)],
    [
      "Build with Codex after replies",
      buildBuildAngle(masterPrompt, includeCodexPrompt),
    ],
  ] satisfies [string, string][];
}

function buildActionBriefCopy(
  masterPrompt: MasterPrompt,
  action: NextAction,
  includeCodexPrompt: boolean,
) {
  const fields = buildActionBriefFields(
    masterPrompt,
    action,
    includeCodexPrompt,
  );

  return `${getActionLabel(action)} Money Move plan

${fields.map(([label, value]) => `${label}:\n${value}`).join("\n\n")}`;
}

function buildCarouselSlides(masterPrompt: MasterPrompt) {
  const cleanSentence = (value: string, fallback: string) => {
    const cleaned = normalizeDisplayText(value)
      .replace(/^Slide\s*\d+:\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();

    return cleaned || fallback;
  };

  const moneyProof = cleanSentence(
    masterPrompt.originalCase || masterPrompt.provenPattern,
    "A real buyer paid for a narrow business outcome.",
  );
  const paidPain = cleanSentence(
    masterPrompt.pain || masterPrompt.marketProof.whyBuyersPay,
    "The buyer has a repeated paid pain that is expensive to leave messy.",
  );
  const firstOffer = cleanSentence(
    masterPrompt.firstPaidOffer || masterPrompt.revenueSignal,
    "$99 cleanup pack",
  );
  const validationStep = cleanSentence(
    (masterPrompt.validationPlan.length
      ? masterPrompt.validationPlan.map((step, index) => `${index + 1}. ${step}`).join(" ")
      : "") ||
      masterPrompt.firstCustomerPlan.validationWithin48h ||
      masterPrompt.firstCustomerPlan.whatToSay,
    "DM 20 likely buyers and offer to do one manual cleanup before building.",
  );
  const buildAfterReplies = cleanSentence(
    masterPrompt.firstVersion || masterPrompt.whatToBuild || masterPrompt.productAngle,
    "Build the smallest Codex tool only after buyers reply.",
  );

  return [
    {
      title: "Slide 1: Money proof",
      body: moneyProof,
    },
    {
      title: "Slide 2: Why money changes hands",
      body: paidPain,
    },
    {
      title: "Slide 3: Sell the small version first",
      body: `${firstOffer} Sell this before building software.`,
    },
    {
      title: "Slide 4: Validate in 48 hours",
      body: validationStep,
    },
    {
      title: "Slide 5: Build after replies",
      body: buildCodexAfterRepliesLine(buildAfterReplies),
    },
  ];
}

function buildCarouselCopy(masterPrompt: MasterPrompt, _hasFounderAccess: boolean) {
  return buildCarouselSlides(masterPrompt)
    .slice(0, 5)
    .map((slide) => `${slide.title}\n${slide.body}`)
    .join("\n\n---\n\n");
}

function buildLaunchPackCopy(masterPrompt: MasterPrompt, hasFounderAccess: boolean) {
  const carouselCopy = buildCarouselCopy(masterPrompt, hasFounderAccess);
  const buildAfterReplies = buildCodexAfterRepliesLine(
    masterPrompt.firstVersion || masterPrompt.whatToBuild || masterPrompt.productAngle,
  );
  const killCriteria = [
    "No replies after 20 targeted DMs.",
    "No saves, comments, or profile clicks from the public post.",
    "Buyers understand the idea but will not commit to a call, preorder, or paid pilot.",
  ].join("\n");
  const codexPrompt = hasFounderAccess
    ? masterPrompt.fullCodeXMasterPrompt
    : "Bilion Pro unlocks the full build-after-replies plan after demand is validated.";

  return [
    "Bilion Money Move plan",
    "",
    "Money proof:",
    masterPrompt.originalCase,
    "",
    "Pattern:",
    masterPrompt.marketProof.comparablePattern,
    "",
    "Buyer:",
    masterPrompt.buyer,
    "",
    "Paid pain:",
    masterPrompt.pain,
    "",
    "Small first offer:",
    masterPrompt.firstPaidOffer,
    "",
    "Price:",
    getManualOfferPrice(masterPrompt.firstPaidOffer),
    "",
    "Post hook:",
    masterPrompt.launchCopy.xPost,
    "",
    "DM script:",
    masterPrompt.launchCopy.dmMessage,
    "",
    "48h validation:",
    masterPrompt.validationPlan
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n"),
    "",
    "Build with Codex after replies:",
    buildAfterReplies,
    "",
    "X post:",
    masterPrompt.launchCopy.xPost,
    "",
    "TikTok carousel text:",
    carouselCopy,
    "",
    "Instagram carousel text:",
    carouselCopy,
    "",
    "DM pitch:",
    masterPrompt.launchCopy.dmMessage,
    "",
    "Kill criteria:",
    killCriteria,
    "",
    "Codex-ready build prompt:",
    codexPrompt,
  ].join("\n");
}

function applyAiRevealToMasterPrompt(
  aiReveal: AiOpportunityReveal,
  fallbackPrompt: MasterPrompt,
): MasterPrompt {
  const attack48h = aiReveal.attack48h.length
    ? aiReveal.attack48h
    : fallbackPrompt.validationPlan;
  const coreFeatures = [
    aiReveal.buildAfterReplies.doNotBuildYet,
    aiReveal.buildAfterReplies.buildOnlyIf,
    aiReveal.buildAfterReplies.mvpScope,
  ].filter(Boolean);

  return {
    ...fallbackPrompt,
    aiReveal,
    promptTitle: aiReveal.heroSummary.title || fallbackPrompt.promptTitle,
    originalCase: aiReveal.heroSummary.signal || fallbackPrompt.originalCase,
    provenPattern: aiReveal.heroSummary.signal || fallbackPrompt.provenPattern,
    whyItSold: aiReveal.whyThisMatters.marketShift || fallbackPrompt.whyItSold,
    marketProof: {
      comparablePattern: fallbackPrompt.marketProof.comparablePattern,
      revenueOrPricingSignal: aiReveal.sellThisFirst.price || fallbackPrompt.price,
      whyBuyersPay: aiReveal.whyThisMatters.moneyAngle || fallbackPrompt.marketProof.whyBuyersPay,
      distributionChannel:
        aiReveal.sellThisFirst.whereToFindThem || fallbackPrompt.distributionChannel,
      evidenceStrength:
        aiReveal.evidence.confidence === "High"
          ? "Strong"
          : aiReveal.evidence.confidence === "Medium"
            ? "Medium"
            : "Directional",
      note: aiReveal.evidence.risk || fallbackPrompt.marketProof.note,
    },
    whoPays: aiReveal.sellThisFirst.whoBuys || aiReveal.heroSummary.buyer,
    yourProductAngle: aiReveal.heroSummary.firstWedge || fallbackPrompt.yourProductAngle,
    firstPaidOffer: aiReveal.sellThisFirst.firstOffer || fallbackPrompt.firstPaidOffer,
    buyer: aiReveal.heroSummary.buyer || fallbackPrompt.buyer,
    pain: aiReveal.whyThisMatters.whatEveryoneMisses || fallbackPrompt.pain,
    revenueSignal: aiReveal.whyThisMatters.moneyAngle || fallbackPrompt.revenueSignal,
    distributionChannel:
      aiReveal.sellThisFirst.whereToFindThem || fallbackPrompt.distributionChannel,
    productAngle: aiReveal.heroSummary.aha || fallbackPrompt.productAngle,
    whatToBuild: aiReveal.buildAfterReplies.mvpScope || fallbackPrompt.whatToBuild,
    firstVersion: aiReveal.buildAfterReplies.mvpScope || fallbackPrompt.firstVersion,
    price: aiReveal.heroSummary.price || aiReveal.sellThisFirst.price || fallbackPrompt.price,
    launchCopy: {
      ...fallbackPrompt.launchCopy,
      xPost: aiReveal.sellThisFirst.xPost || fallbackPrompt.launchCopy.xPost,
      dmMessage: aiReveal.sellThisFirst.dmScript || fallbackPrompt.launchCopy.dmMessage,
    },
    firstCustomerPlan: {
      ...fallbackPrompt.firstCustomerPlan,
      whoToContactFirst: aiReveal.sellThisFirst.whoBuys || fallbackPrompt.firstCustomerPlan.whoToContactFirst,
      whereToFindThem:
        aiReveal.sellThisFirst.whereToFindThem || fallbackPrompt.firstCustomerPlan.whereToFindThem,
      whatToSay: aiReveal.sellThisFirst.dmScript || fallbackPrompt.firstCustomerPlan.whatToSay,
      whatToOffer: aiReveal.sellThisFirst.firstOffer || fallbackPrompt.firstCustomerPlan.whatToOffer,
      validationWithin48h: attack48h.join(" "),
    },
    coreFeatures: coreFeatures.length ? coreFeatures : fallbackPrompt.coreFeatures,
    validationPlan: attack48h,
    fullCodeXMasterPrompt:
      aiReveal.buildAfterReplies.codexPrompt || fallbackPrompt.fullCodeXMasterPrompt,
  };
}

function applyAiRevealToResult(
  aiReveal: AiOpportunityReveal,
  fallbackResult: ApiResult,
  aiMasterPrompt: MasterPrompt,
): ApiResult {
  return {
    free: {
      latest_signal: aiReveal.heroSummary.signal || fallbackResult.free.latest_signal,
      what_you_can_build:
        aiReveal.buildAfterReplies.mvpScope || fallbackResult.free.what_you_can_build,
      buyer: aiReveal.heroSummary.buyer || fallbackResult.free.buyer,
      pain: aiReveal.whyThisMatters.whatEveryoneMisses || fallbackResult.free.pain,
      why_now: aiReveal.whyThisMatters.marketShift || fallbackResult.free.why_now,
    },
    paid: {
      ...fallbackResult.paid,
      latest_signal: aiReveal.heroSummary.signal || fallbackResult.paid.latest_signal,
      source_title: aiMasterPrompt.promptTitle,
      buyer: aiMasterPrompt.buyer,
      pain: aiMasterPrompt.pain,
      why_now: aiMasterPrompt.whyItSold,
      what_you_can_build: aiMasterPrompt.whatToBuild,
      comparable_price: aiMasterPrompt.price,
      build_steps: aiReveal.attack48h.length
        ? aiReveal.attack48h
        : fallbackResult.paid.build_steps,
      pattern_matches: [
        ...aiReveal.evidence.whatIsFact,
        ...aiReveal.evidence.whatIsInference,
      ].slice(0, 6),
      code_x_prompt: aiMasterPrompt.fullCodeXMasterPrompt,
    },
  };
}

async function requestAiOpportunityReveal(
  signal: BuildSignal,
  buyer: string,
  goal: NextAction,
) {
  const response = await fetch("/api/opportunity-reveal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      signal: {
        id: signal.id,
        latestSignal: signal.latestSignal,
        sourceTitle: signal.sourceTitle,
        sourceType: signal.sourceType,
        sourceNote: signal.sourceNote,
        buyer: signal.buyer,
        pain: signal.pain,
        whyNow: signal.whyNow,
        whatYouCanBuild: signal.whatYouCanBuild,
        comparablePrice: signal.comparablePrice,
        patternMatches: signal.patternMatches,
      },
      buyer,
      goal,
    }),
  });

  if (!response.ok) {
    throw new Error("AI opportunity reveal request failed.");
  }

  return (await response.json()) as AiOpportunityReveal;
}

async function writeClipboardText(text: string) {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function buildGitHubSignalFromInput(input: string): BuildSignal {
  const sourceText = input.trim() || GITHUB_SAMPLE_ACTIVITY;
  const compactText = sourceText.replace(/\s+/g, " ").trim();
  const repoMatch =
    compactText.match(/https?:\/\/github\.com\/[^\s)]+/i) ||
    compactText.match(/Repo:\s*([^.;\n]+)/i);
  const repoName = repoMatch?.[1] || repoMatch?.[0] || "sample GitHub repo activity";
  const hasIntegrationSignal = /integration|sync|oauth|calendar|api/i.test(compactText);
  const hasPrSignal = /\bpr\b|pull request|review|diff|patch/i.test(compactText);
  const buyer = hasPrSignal
    ? "Maintainers of fast-moving developer tools"
    : hasIntegrationSignal
      ? "Solo SaaS teams and implementation consultants"
      : "Builders, maintainers, and consultants working around the repo";
  const pain = hasPrSignal
    ? "Large or AI-generated PRs create review bottlenecks, unclear risk, and repeated maintainer follow-up."
    : hasIntegrationSignal
      ? "Users like the core tool but lose workflow value when missing integrations force manual copy-paste work."
      : "Users repeatedly hit the same setup or workflow friction, while maintainers answer the same questions manually.";
  const whatYouCanBuild = hasPrSignal
    ? "A PR risk brief generator that summarizes touched modules, risks, test needs, and reviewer next actions."
    : hasIntegrationSignal
      ? "A narrow workflow sync helper that turns missing integration requests into productized setup guidance."
      : "A repo setup copilot that turns repeated issue pain into checklists, templates, and support-ready answers.";

  return {
    id: `github-signal-${Date.now()}`,
    latestSignal: compactText,
    sourceTitle: `GitHub signal: ${repoName}`,
    sourceUrl: repoName.startsWith("http") ? repoName : "",
    sourceType: "GitHub Signal Lab",
    sourceNote:
      "Manual GitHub repo activity signal using stars, repeated issues, PR friction, integration requests, and user comments.",
    buyer,
    pain,
    whyNow:
      "Open-source activity exposes repeated workflow pain before a polished product exists, making it useful for fast validation.",
    whatYouCanBuild,
    coreFeatures: [
      "Paste repo activity or issue notes",
      "Classify the repeated pain",
      "Generate buyer-ready product opportunity",
      "Create validation outreach",
      "Save and copy the Build Brief",
    ],
    comparablePrice:
      "Start with $19 one-time for a repo-specific pack, $49/month for a workflow helper, or $299 setup for implementation help.",
    buildSteps: [
      "Create local mock records for repo activity, issues, PRs, comments, and generated briefs.",
      "Build a paste-in GitHub activity input with sample buttons.",
      "Generate Repo Signal, Buyer, Pain, Revenue Signal, Product Opportunity, Distribution, and 48h Validation sections.",
      "Add saved Build Brief records using local React state.",
      "Add copy/export buttons for the Build Brief and Implementation Prompt.",
    ],
    patternMatches: [
      "GitHub activity",
      "Open-source support",
      "Developer tools",
      "Implementation services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
GitHub Signal Build Brief Console

Goal:
Help builders turn pasted GitHub repo activity, repeated issues, PR friction, integration requests, and user comments into a product opportunity, Build Brief, and Implementation Prompt.

Target user:
Builders, maintainers, consultants, and AI product operators looking for real market pain inside public repo activity.

Core workflow:
1. The user pastes GitHub repo activity or selects the included sample.
2. The app classifies the signal type.
3. The app extracts buyer, pain, revenue signal, distribution channel, product opportunity, and price.
4. The app generates a 48h validation plan and a full Build Brief.
5. The user saves the brief and copies the Implementation Prompt.

Technical requirements:
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.

Acceptance criteria:
- The app loads successfully.
- Sample GitHub activity generates immediately.
- Pasted GitHub activity generates a product opportunity.
- Build Brief and Implementation Prompt are copyable.
- Saved records stay in local state for the demo.`,
  };
}

function buildGitHubLibrarySignal(input: string): BuildSignal {
  return {
    ...buildGitHubSignalFromInput(input),
    id: "github-sample",
    signalSourceLabel: "GitHub Signal",
  };
}

function buildSavedSignal(result: ApiResult): SavedSignal {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    createdAt: new Date().toISOString(),
    sourceTitle: result.paid.source_title,
    buyer: result.paid.buyer,
    pain: result.paid.pain,
    whyNow: result.paid.why_now,
    coreFeatures: result.paid.core_features,
    comparablePrice: result.paid.comparable_price,
    buildSteps: result.paid.build_steps,
    patternMatches: result.paid.pattern_matches,
    fullCodeXPrompt: result.paid.code_x_prompt,
    latestSignal: result.paid.latest_signal,
    whatYouCanBuild: result.paid.what_you_can_build,
    sourceUrl: result.paid.source_url,
    sourceType: result.paid.source_type,
    sourceNote: result.paid.source_note,
  };
}

function buildResultFromSavedSignal(signal: SavedSignal): ApiResult {
  return {
    free: {
      latest_signal: signal.latestSignal,
      what_you_can_build: signal.whatYouCanBuild,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
    },
    paid: {
      latest_signal: signal.latestSignal,
      source_title: signal.sourceTitle,
      source_url: signal.sourceUrl,
      source_type: signal.sourceType,
      source_note: signal.sourceNote,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
      what_you_can_build: signal.whatYouCanBuild,
      core_features: signal.coreFeatures,
      comparable_price: signal.comparablePrice,
      build_steps: signal.buildSteps,
      pattern_matches: signal.patternMatches,
      code_x_prompt: signal.fullCodeXPrompt,
    },
  };
}

function readSavedSignals(): SavedSignal[] {
  try {
    const rawSignals = window.localStorage.getItem(SAVED_SIGNALS_STORAGE_KEY);

    if (!rawSignals) {
      return [];
    }

    const parsedSignals = JSON.parse(rawSignals);

    if (!Array.isArray(parsedSignals)) {
      return [];
    }

    return parsedSignals
      .filter((signal): signal is SavedSignal => {
        return (
          signal &&
          typeof signal.id === "string" &&
          typeof signal.createdAt === "string" &&
          typeof signal.sourceTitle === "string" &&
          typeof signal.buyer === "string" &&
          typeof signal.pain === "string" &&
          typeof signal.whyNow === "string" &&
          Array.isArray(signal.coreFeatures) &&
          typeof signal.comparablePrice === "string" &&
          Array.isArray(signal.buildSteps) &&
          Array.isArray(signal.patternMatches) &&
          typeof signal.fullCodeXPrompt === "string"
        );
      })
      .slice(0, MAX_SAVED_SIGNALS);
  } catch {
    return [];
  }
}

function writeSavedSignals(signals: SavedSignal[]) {
  try {
    window.localStorage.setItem(
      SAVED_SIGNALS_STORAGE_KEY,
      JSON.stringify(signals.slice(0, MAX_SAVED_SIGNALS)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function readDistributionQueue(): DistributionAsset[] {
  try {
    const raw = window.localStorage.getItem(DISTRIBUTION_QUEUE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is DistributionAsset => {
      return (
        item &&
        typeof item.id === "string" &&
        typeof item.signalTitle === "string" &&
        typeof item.buyer === "string" &&
        typeof item.kind === "string" &&
        typeof item.status === "string" &&
        typeof item.title === "string" &&
        typeof item.body === "string"
      );
    });
  } catch {
    return [];
  }
}

function writeDistributionQueue(items: DistributionAsset[]) {
  try {
    window.localStorage.setItem(
      DISTRIBUTION_QUEUE_STORAGE_KEY,
      JSON.stringify(items.slice(0, 50)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function readValidationRecords(): ValidationRecord[] {
  try {
    const raw = window.localStorage.getItem(VALIDATION_RECORDS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is ValidationRecord => {
      return (
        item &&
        typeof item.id === "string" &&
        typeof item.signalTitle === "string" &&
        typeof item.buyer === "string" &&
        typeof item.dmsSent === "number" &&
        typeof item.replies === "number" &&
        typeof item.interested === "number" &&
        typeof item.clicks === "number" &&
        typeof item.objections === "string" &&
        typeof item.verdict === "string" &&
        typeof item.winner === "boolean"
      );
    });
  } catch {
    return [];
  }
}

function writeValidationRecords(records: ValidationRecord[]) {
  try {
    window.localStorage.setItem(
      VALIDATION_RECORDS_STORAGE_KEY,
      JSON.stringify(records.slice(0, 50)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function isEvidenceDraft(value: unknown): value is EvidenceDraft {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as EvidenceDraft).id === "string" &&
    typeof (value as EvidenceDraft).market === "string" &&
    typeof (value as EvidenceDraft).product === "string" &&
    typeof (value as EvidenceDraft).buyer === "string" &&
    typeof (value as EvidenceDraft).paidPain === "string" &&
    typeof (value as EvidenceDraft).offer === "string" &&
    typeof (value as EvidenceDraft).price === "string" &&
    typeof (value as EvidenceDraft).opportunityScore === "number"
  );
}

function readEvidenceDrafts() {
  try {
    const raw = window.localStorage.getItem(EVIDENCE_DRAFTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed.filter(isEvidenceDraft) : [];
  } catch {
    return [];
  }
}

function writeEvidenceDrafts(drafts: EvidenceDraft[]) {
  try {
    window.localStorage.setItem(
      EVIDENCE_DRAFTS_STORAGE_KEY,
      JSON.stringify(drafts.slice(0, 50)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function isBuildSignal(value: unknown): value is BuildSignal {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as BuildSignal).id === "string" &&
    typeof (value as BuildSignal).latestSignal === "string" &&
    typeof (value as BuildSignal).sourceTitle === "string" &&
    typeof (value as BuildSignal).buyer === "string" &&
    typeof (value as BuildSignal).pain === "string" &&
    Array.isArray((value as BuildSignal).coreFeatures) &&
    Array.isArray((value as BuildSignal).buildSteps) &&
    Array.isArray((value as BuildSignal).patternMatches)
  );
}

function readApprovedEvidenceSignals() {
  try {
    const raw = window.localStorage.getItem(APPROVED_EVIDENCE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed.filter(isBuildSignal) : [];
  } catch {
    return [];
  }
}

function writeApprovedEvidenceSignals(signals: BuildSignal[]) {
  try {
    window.localStorage.setItem(
      APPROVED_EVIDENCE_STORAGE_KEY,
      JSON.stringify(signals.slice(0, 50)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function isRawSignal(value: unknown): value is RawSignal {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as RawSignal).id === "string" &&
    typeof (value as RawSignal).sourceType === "string" &&
    typeof (value as RawSignal).body === "string" &&
    typeof (value as RawSignal).importedAt === "string"
  );
}

function isCandidateMoneySignal(value: unknown): value is CandidateMoneySignal {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as CandidateMoneySignal).id === "string" &&
    typeof (value as CandidateMoneySignal).rawSignalId === "string" &&
    typeof (value as CandidateMoneySignal).market === "string" &&
    typeof (value as CandidateMoneySignal).proof === "string" &&
    typeof (value as CandidateMoneySignal).buyer === "string" &&
    typeof (value as CandidateMoneySignal).paidPain === "string" &&
    typeof (value as CandidateMoneySignal).firstOffer === "string" &&
    typeof (value as CandidateMoneySignal).score === "number" &&
    Array.isArray((value as CandidateMoneySignal).channels) &&
    Array.isArray((value as CandidateMoneySignal).missingFields)
  );
}

function isApprovedMoneySignal(value: unknown): value is ApprovedMoneySignal {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as ApprovedMoneySignal).id === "string" &&
    typeof (value as ApprovedMoneySignal).market === "string" &&
    typeof (value as ApprovedMoneySignal).proof === "string" &&
    typeof (value as ApprovedMoneySignal).whatMoneyMoved === "string" &&
    typeof (value as ApprovedMoneySignal).buyer === "string" &&
    typeof (value as ApprovedMoneySignal).paidPain === "string" &&
    typeof (value as ApprovedMoneySignal).firstOffer === "string" &&
    typeof (value as ApprovedMoneySignal).score === "number" &&
    Array.isArray((value as ApprovedMoneySignal).channels) &&
    typeof (value as ApprovedMoneySignal).approvedAt === "string"
  );
}

function readRawSignals() {
  try {
    const raw = window.localStorage.getItem(RAW_SIGNAL_INBOX_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed.filter(isRawSignal) : [];
  } catch {
    return [];
  }
}

function writeRawSignals(signals: RawSignal[]) {
  try {
    window.localStorage.setItem(
      RAW_SIGNAL_INBOX_STORAGE_KEY,
      JSON.stringify(signals.slice(0, 50)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function readCandidateMoneySignals() {
  try {
    const raw = window.localStorage.getItem(CANDIDATE_MONEY_SIGNALS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed.filter(isCandidateMoneySignal) : [];
  } catch {
    return [];
  }
}

function writeCandidateMoneySignals(signals: CandidateMoneySignal[]) {
  try {
    window.localStorage.setItem(
      CANDIDATE_MONEY_SIGNALS_STORAGE_KEY,
      JSON.stringify(signals.slice(0, 50)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function readApprovedMoneySignals() {
  try {
    const raw = window.localStorage.getItem(APPROVED_MONEY_SIGNALS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed.filter(isApprovedMoneySignal) : [];
  } catch {
    return [];
  }
}

function writeApprovedMoneySignals(signals: ApprovedMoneySignal[]) {
  try {
    window.localStorage.setItem(
      APPROVED_MONEY_SIGNALS_STORAGE_KEY,
      JSON.stringify(signals.slice(0, 50)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function readSignalIdList(storageKey: string) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeSignalIdList(storageKey: string, ids: string[]) {
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(Array.from(new Set(ids)).slice(0, 500)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function getSeenSignalIds() {
  return readSignalIdList(SEEN_SIGNAL_IDS_STORAGE_KEY);
}

function markSignalSeen(signalId: string) {
  const nextIds = Array.from(new Set([signalId, ...getSeenSignalIds()])).slice(0, 500);

  writeSignalIdList(SEEN_SIGNAL_IDS_STORAGE_KEY, nextIds);
  return nextIds;
}

function getRejectedSignalIds() {
  return readSignalIdList(REJECTED_SIGNAL_IDS_STORAGE_KEY);
}

function getLocalDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function readFreeUsageCount() {
  try {
    const raw = window.localStorage.getItem(FREE_USAGE_STORAGE_KEY_EN);

    if (!raw) {
      return 0;
    }

    const parsed = JSON.parse(raw) as { count?: number; date?: string };

    if (parsed.date !== getLocalDateKey()) {
      return 0;
    }

    return Math.max(0, Math.min(FREE_GENERATION_LIMIT, Number(parsed.count) || 0));
  } catch {
    return 0;
  }
}

function writeFreeUsageCount(count: number) {
  try {
    window.localStorage.setItem(
      FREE_USAGE_STORAGE_KEY_EN,
      JSON.stringify({
        date: getLocalDateKey(),
        count: Math.max(0, Math.min(FREE_GENERATION_LIMIT, count)),
      }),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

export default function BilionAppClient({
  gmailMarketSignals,
  hasFounderAccess,
}: BilionAppClientProps) {
  const searchParams = useSearchParams();
  const baseMarketSignals: BuildSignal[] = [...buildSignals, ...gmailMarketSignals];
  const [evidenceDrafts, setEvidenceDrafts] = useState<EvidenceDraft[]>([]);
  const [approvedEvidenceSignals, setApprovedEvidenceSignals] = useState<BuildSignal[]>([]);
  const [rawSignals, setRawSignals] = useState<RawSignal[]>([]);
  const [candidateMoneySignals, setCandidateMoneySignals] = useState<CandidateMoneySignal[]>([]);
  const [approvedMoneySignals, setApprovedMoneySignals] = useState<ApprovedMoneySignal[]>([]);
  const [outputPack, setOutputPack] = useState<OutputPack | null>(null);
  const [seenSignalIds, setSeenSignalIds] = useState<string[]>([]);
  const [savedSignalIds, setSavedSignalIds] = useState<string[]>([]);
  const [winnerSignalIds, setWinnerSignalIds] = useState<string[]>([]);
  const [rejectedSignalIds, setRejectedSignalIds] = useState<string[]>([]);
  const approvedMoneyBuildSignals = approvedMoneySignals.map(
    convertApprovedMoneySignalToBuildSignal,
  );
  const marketSignals: BuildSignal[] = [
    ...baseMarketSignals,
    ...approvedEvidenceSignals,
    ...approvedMoneyBuildSignals,
  ];
  const [dailySignalSeed] = useState(() => Math.floor(Date.now() / 86400000));
  const todayIndex =
    marketSignals.length > 0
      ? dailySignalSeed % marketSignals.length
      : 0;
  const selectedPatternLabel =
    selectedPatternLabels[searchParams.get("pattern") || ""];
  const [signalIndex, setSignalIndex] = useState(todayIndex);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState(false);
  const [copiedSafePrompt, setCopiedSafePrompt] = useState(false);
  const [copiedSavedSignalId, setCopiedSavedSignalId] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<WorkflowTab>("library");
  const [savedSignals, setSavedSignals] = useState<SavedSignal[]>([]);
  const [distributionQueue, setDistributionQueue] = useState<DistributionAsset[]>([]);
  const [validationRecords, setValidationRecords] = useState<ValidationRecord[]>([]);
  const [workflowItemSeed, setWorkflowItemSeed] = useState(0);
  const [masterPrompt, setMasterPrompt] = useState<MasterPrompt | null>(null);
  const [masterPromptAngleIndex, setMasterPromptAngleIndex] = useState(0);
  const [freeUsageCount, setFreeUsageCount] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState<AppMarketOption>("Creators");
  const [openSignalGroups, setOpenSignalGroups] = useState<string[]>([
    "Recommended",
    "GitHub Signal",
  ]);
  const [sourceMode, setSourceMode] = useState<SourceMode>("indie");
  const [githubInput, setGithubInput] = useState("");
  const githubLibrarySignal = buildGitHubLibrarySignal(githubInput);
  const evidenceInboxSignals = [...marketSignals, githubLibrarySignal];
  const topOpportunitySignal = getTopOpportunitySignal(evidenceInboxSignals);
  const topMarketOpportunities = getTopMarketOpportunities(
    evidenceInboxSignals,
    selectedMarket,
  );
  const topMoneySignalsForMarket = getTopMoneySignalsForMarket(
    evidenceInboxSignals,
    selectedMarket,
  );
  const signalGroups = getSignalGroups(
    marketSignals,
    githubLibrarySignal,
    seenSignalIds,
    rejectedSignalIds,
  );
  const [selectedSignalId, setSelectedSignalId] = useState(
    topMoneySignalsForMarket[0]?.id || marketSignals[todayIndex]?.id || marketSignals[0]?.id || "",
  );
  const [selectedBuyer, setSelectedBuyer] = useState(
    topMoneySignalsForMarket[0]?.buyer || marketSignals[todayIndex]?.buyer || marketSignals[0]?.buyer || "",
  );
  const [selectedAction, setSelectedAction] = useState<NextAction>("post");
  const freeRunsRemaining = hasFounderAccess
    ? Infinity
    : Math.max(0, FREE_GENERATION_LIMIT - freeUsageCount);
  const canGenerate = hasFounderAccess || freeRunsRemaining > 0;
  const selectedSignal =
    selectedSignalId === "github-sample"
      ? githubLibrarySignal
      : [...topMoneySignalsForMarket, ...topMarketOpportunities, ...marketSignals].find(
          (signal) => signal.id === selectedSignalId,
        ) ||
        marketSignals[todayIndex] ||
        marketSignals[0];
  const selectedSignalDisplayTitle = selectedSignal
    ? getDisplaySignalTitle(selectedSignal)
    : null;
  const buyerOptions = selectedSignal ? getBuyerOptions(selectedSignal) : [];
  const signalMemorySummary = `${seenSignalIds.length} seen / ${savedSignalIds.length} saved / ${winnerSignalIds.length} winners / ${rejectedSignalIds.length} rejected`;

  useEffect(() => {
    const loadSavedSignals = window.setTimeout(() => {
      setSavedSignals(readSavedSignals());
      setDistributionQueue(readDistributionQueue());
      setValidationRecords(readValidationRecords());
      setEvidenceDrafts(readEvidenceDrafts());
      setApprovedEvidenceSignals(readApprovedEvidenceSignals());
      setRawSignals(readRawSignals());
      setCandidateMoneySignals(readCandidateMoneySignals());
      setApprovedMoneySignals(readApprovedMoneySignals());
      setSeenSignalIds(getSeenSignalIds());
      setSavedSignalIds(readSignalIdList(SAVED_SIGNAL_IDS_STORAGE_KEY));
      setWinnerSignalIds(readSignalIdList(WINNER_SIGNAL_IDS_STORAGE_KEY));
      setRejectedSignalIds(getRejectedSignalIds());
      setFreeUsageCount(readFreeUsageCount());

      const source = new URLSearchParams(window.location.search).get("source");
      if (source === "github") {
        const githubSignal = buildGitHubLibrarySignal("");

        setSourceMode("github");
        setSelectedSignalId(githubSignal.id);
        setSelectedBuyer(githubSignal.buyer);
        setSeenSignalIds(() => markSignalSeen(githubSignal.id));
      }
    }, 0);

    return () => window.clearTimeout(loadSavedSignals);
  }, []);

  function saveResult(nextResult: ApiResult) {
    const savedSignal = buildSavedSignal(nextResult);

    setSavedSignals((currentSignals) => {
      const nextSignals = [
        savedSignal,
        ...currentSignals.filter(
          (signal) => signal.fullCodeXPrompt !== savedSignal.fullCodeXPrompt,
        ),
      ].slice(0, MAX_SAVED_SIGNALS);

      writeSavedSignals(nextSignals);
      return nextSignals;
    });
  }

  function incrementFreeUsage() {
    if (hasFounderAccess) {
      return;
    }

    setFreeUsageCount((currentCount) => {
      const nextCount = Math.min(FREE_GENERATION_LIMIT, currentCount + 1);
      writeFreeUsageCount(nextCount);
      return nextCount;
    });
  }

  function rememberSignalId(
    storageKey: string,
    signalId: string,
    setter: (updater: (currentIds: string[]) => string[]) => void,
  ) {
    if (!signalId) {
      return;
    }

    setter((currentIds) => {
      const nextIds = Array.from(new Set([signalId, ...currentIds])).slice(0, 500);

      writeSignalIdList(storageKey, nextIds);
      return nextIds;
    });
  }

  function rememberSeenSignal(signal: BuildSignal | string) {
    const signalId = getSignalKey(signal);

    if (!signalId) {
      return;
    }

    setSeenSignalIds(() => markSignalSeen(signalId));
  }

  function rememberWinnerSignal(signalId: string) {
    rememberSignalId(
      WINNER_SIGNAL_IDS_STORAGE_KEY,
      signalId,
      setWinnerSignalIds,
    );
  }

  function rememberRejectedSignal(signalId: string) {
    rememberSignalId(
      REJECTED_SIGNAL_IDS_STORAGE_KEY,
      signalId,
      setRejectedSignalIds,
    );
  }

  function selectSignal(signal: BuildSignal, buyer = signal.buyer) {
    setSelectedSignalId(signal.id);
    setSelectedBuyer(buyer);
    rememberSeenSignal(signal);
  }

  async function generateIdea() {
    if (!canGenerate) {
      return;
    }

    setLoading(true);
    setError("");
    if (!selectedSignal) {
      setError("Select a market signal first.");
      setLoading(false);
      return;
    }

    const nextSignal = selectedSignal;
    rememberSeenSignal(nextSignal);
    const actionSignal = getActionSignal(nextSignal, selectedBuyer);
    const seed = selectHighQualityBusinessSpark(actionSignal);
    const nextResult = applyBusinessSparkSeedToResult(buildResult(actionSignal), seed);
    const builtMaster = applyBusinessSparkSeed(
      buildActionMasterPrompt(nextSignal, selectedBuyer, selectedAction),
      seed,
    );
    const nextSignalIndex =
      selectedSignalId === "github-sample" ? 0 : marketSignals.indexOf(nextSignal);
    const nextAngleIndex = getActionAngleIndex(selectedAction);

    setSignalIndex(nextSignalIndex < 0 ? 0 : nextSignalIndex);
    setMasterPromptAngleIndex(nextAngleIndex);
    setResult(nextResult);
    setMasterPrompt(builtMaster);
    setCopiedMasterPrompt(false);
    setCopiedSafePrompt(false);
    setCopyFeedback(null);
    incrementFreeUsage();
    setActiveWorkflowTab("studio");
    saveResult(nextResult);
    setLoading(false);
  }

  function viewSavedSignal(signal: SavedSignal) {
    setCopiedMasterPrompt(false);
    setCopiedSafePrompt(false);
    setCopyFeedback(null);
    setResult(buildResultFromSavedSignal(signal));
    setMasterPrompt(null);
  }

  async function copySavedSignalPrompt(signal: SavedSignal) {
    const text = hasFounderAccess
      ? signal.fullCodeXPrompt
      : buildFreeSavedSignalCopy(signal);

    const copied = await writeClipboardText(text);

    if (copied) {
      setCopiedSavedSignalId(signal.id);
      window.setTimeout(() => setCopiedSavedSignalId(""), 1000);
      return;
    }

    setCopyFeedback({
      message: "Clipboard blocked. Open the signal, select the prompt text, and copy it manually.",
      tone: "error",
    });
  }

  function generateMasterPrompt() {
    void generateIdea();
  }

  function generateAnotherAngle() {
    if (!canGenerate) {
      return;
    }

    if (!selectedSignal) {
      return;
    }

    const currentActionIndex = nextActionOptions.findIndex(
      (option) => option.action === selectedAction,
    );
    const nextAction =
      nextActionOptions[(currentActionIndex + 1) % nextActionOptions.length]
        ?.action || "build";
    const nextSignal = selectedSignal;
    const actionSignal = getActionSignal(nextSignal, selectedBuyer);
    const seed = selectHighQualityBusinessSpark(actionSignal);
    const nextResult = applyBusinessSparkSeedToResult(buildResult(actionSignal), seed);
    const builtMaster = applyBusinessSparkSeed(
      buildActionMasterPrompt(nextSignal, selectedBuyer, nextAction),
      seed,
    );
    const nextSignalIndex =
      selectedSignalId === "github-sample" ? 0 : marketSignals.indexOf(nextSignal);

    setCopiedMasterPrompt(false);
    setCopiedSafePrompt(false);
    setCopyFeedback(null);
    setSelectedAction(nextAction);
    setSignalIndex(nextSignalIndex < 0 ? 0 : nextSignalIndex);
    setMasterPromptAngleIndex(getActionAngleIndex(nextAction));
    setResult(nextResult);
    setMasterPrompt(builtMaster);
    saveResult(nextResult);
    incrementFreeUsage();
    setActiveWorkflowTab("studio");
  }

  function selectAnotherSignal() {
    const marketOptionsForSelection = getTopMoneySignalsForMarket(
      evidenceInboxSignals,
      selectedMarket,
    );
    const nextSignal = pickNextSignal(marketOptionsForSelection, {
      currentSignal: selectedSignal,
      rejectedSignalIds,
      seenSignalIds,
    });

    if (!nextSignal) {
      return;
    }

    selectSignal(nextSignal);
    setSelectedAction("post");
    setOutputPack(null);
    setResult(null);
    setMasterPrompt(null);
    setActiveWorkflowTab("library");
  }

  function generateOutputPack(signal: BuildSignal) {
    rememberSeenSignal(signal);
    setOutputPack(buildOutputPackFromSignal(signal, selectedAction));
    setCopyFeedback(null);
  }

  function buildQueueAssetsFromCurrentBrief(seed: number): DistributionAsset[] {
    const now = new Date().toISOString();
    const signalTitle =
      selectedSignalDisplayTitle?.detail ||
      selectedSignalDisplayTitle?.title ||
      selectedSignal?.sourceTitle ||
      "Selected signal";
    const buyer = selectedBuyer || selectedSignal?.buyer || "Selected buyer";

    return [
      {
        id: `queue-x-${seed}`,
        action: selectedAction,
        body:
          masterPrompt?.launchCopy.xPost ||
          `Draft X post from this signal: ${signalTitle}. Buyer: ${buyer}. Action: ${getActionLabel(selectedAction)}.`,
        buyer,
        createdAt: now,
        kind: "X post",
        signalTitle,
        status: "Not tested",
        title: "Draft X post from this signal",
      },
      {
        id: `queue-dm-${seed}`,
        action: selectedAction,
        body:
          masterPrompt?.launchCopy.dmMessage ||
          `Draft DM from this offer for ${buyer}. Ask if they want a before/after sample from ${signalTitle}.`,
        buyer,
        createdAt: now,
        kind: "DM script",
        signalTitle,
        status: "Not tested",
        title: "Draft DM from this offer",
      },
      {
        id: `queue-log-${seed}`,
        action: selectedAction,
        body:
          masterPrompt?.validationPlan.join("\n") ||
          `Prepare validation log for ${buyer}: DMs sent, replies, interested, clicks, objections, verdict.`,
        buyer,
        createdAt: now,
        kind: "Validation log",
        signalTitle,
        status: "Not tested",
        title: "Prepare validation log",
      },
      {
        id: `queue-video-${seed}`,
        action: selectedAction,
        body: `Short video angle: show the signal, name the buyer pain, then say what to ${selectedAction} today.`,
        buyer,
        createdAt: now,
        kind: "Short video angle",
        signalTitle,
        status: "Not tested",
        title: "Short video angle",
      },
    ];
  }

  function saveDistributionAssets() {
    const nextSeed = workflowItemSeed + 1;
    const nextQueue = [...buildQueueAssetsFromCurrentBrief(nextSeed), ...distributionQueue].slice(0, 50);
    setWorkflowItemSeed(nextSeed);
    setDistributionQueue(nextQueue);
    writeDistributionQueue(nextQueue);
  }

  function updateDistributionStatus(assetId: string, status: DistributionStatus) {
    setDistributionQueue((currentQueue) => {
      const nextQueue = currentQueue.map((item) =>
        item.id === assetId ? { ...item, status } : item,
      );

      writeDistributionQueue(nextQueue);
      return nextQueue;
    });
  }

  function addValidationRecord() {
    const nextSeed = workflowItemSeed + 1;
    const signalTitle =
      selectedSignalDisplayTitle?.detail ||
      selectedSignalDisplayTitle?.title ||
      selectedSignal?.sourceTitle ||
      "Selected signal";
    const nextRecord: ValidationRecord = {
      id: `validation-${nextSeed}`,
      action: selectedAction,
      buyer: selectedBuyer || selectedSignal?.buyer || "Selected buyer",
      clicks: 0,
      createdAt: new Date().toISOString(),
      dmsSent: 0,
      interested: 0,
      objections: "",
      replies: 0,
      signalTitle,
      verdict: "Pivot",
      winner: false,
    };
    const nextRecords = [nextRecord, ...validationRecords].slice(0, 50);

    setWorkflowItemSeed(nextSeed);
    setValidationRecords(nextRecords);
    writeValidationRecords(nextRecords);
  }

  function updateValidationRecord(
    recordId: string,
    updates: Partial<ValidationRecord>,
  ) {
    setValidationRecords((currentRecords) => {
      const nextRecords = currentRecords.map((record) =>
        record.id === recordId ? { ...record, ...updates } : record,
      );

      writeValidationRecords(nextRecords);
      return nextRecords;
    });
  }

  function markWinner(recordId: string) {
    const record = validationRecords.find((item) => item.id === recordId);

    if (record) {
      rememberWinnerSignal(record.signalTitle);
    }

    updateValidationRecord(recordId, {
      verdict: "Build",
      winner: true,
    });
  }

  function importEvidenceSnippets(rawInput: string, sourceType: string) {
    const snippets = rawInput
      .split(/\n\s*---+\s*\n/g)
      .map((snippet) => snippet.trim())
      .filter((snippet) => snippet.length > 24);

    if (!snippets.length) {
      setCopyFeedback({
        message: "Paste at least one evidence snippet before importing.",
        tone: "error",
      });
      return;
    }

    const nextDrafts = snippets.map((snippet, index) =>
      createEvidenceDraft(snippet, index, sourceType),
    );

    setEvidenceDrafts((currentDrafts) => {
      const mergedDrafts = [...nextDrafts, ...currentDrafts].slice(0, 50);
      writeEvidenceDrafts(mergedDrafts);
      return mergedDrafts;
    });
    setCopyFeedback({
      message: `Created ${nextDrafts.length} Evidence Draft${nextDrafts.length === 1 ? "" : "s"}.`,
      tone: "success",
    });
  }

  function approveEvidenceDraft(draft: EvidenceDraft) {
    const approvedSignal = convertEvidenceDraftToSignal(draft);

    setApprovedEvidenceSignals((currentSignals) => {
      const nextSignals = [
        approvedSignal,
        ...currentSignals.filter((signal) => signal.id !== approvedSignal.id),
      ].slice(0, 50);

      writeApprovedEvidenceSignals(nextSignals);
      return nextSignals;
    });
    setEvidenceDrafts((currentDrafts) => {
      const nextDrafts = currentDrafts.filter((item) => item.id !== draft.id);

      writeEvidenceDrafts(nextDrafts);
      return nextDrafts;
    });
    selectSignal(approvedSignal);
    setActiveWorkflowTab("library");
    setCopyFeedback({
      message: "Approved evidence and added it to Signal Library.",
      tone: "success",
    });
  }

  function rejectEvidenceDraft(draftId: string) {
    rememberRejectedSignal(draftId);
    setEvidenceDrafts((currentDrafts) => {
      const nextDrafts = currentDrafts.filter((draft) => draft.id !== draftId);

      writeEvidenceDrafts(nextDrafts);
      return nextDrafts;
    });
    setCopyFeedback({
      message: "Rejected evidence draft.",
      tone: "success",
    });
  }

  function extractSignalInboxCandidate(rawInput: string, sourceType: string) {
    if (rawInput.trim().length < 30) {
      setCopyFeedback({
        message: "Paste a longer startup story, newsletter, Gmail text, or revenue signal first.",
        tone: "error",
      });
      return;
    }

    const { candidate, rawSignal } = extractCandidateMoneySignal(rawInput, sourceType);

    setRawSignals((currentRawSignals) => {
      const nextRawSignals = [rawSignal, ...currentRawSignals].slice(0, 50);

      writeRawSignals(nextRawSignals);
      return nextRawSignals;
    });
    setCandidateMoneySignals((currentCandidates) => {
      const nextCandidates = [candidate, ...currentCandidates].slice(0, 50);

      writeCandidateMoneySignals(nextCandidates);
      return nextCandidates;
    });
    if (isAppMarketOption(candidate.market)) {
      setSelectedMarket(candidate.market);
    }
    setCopyFeedback({
      message: "Extracted a candidate Money Move. Review it before approving.",
      tone: "success",
    });
  }

  function approveCandidateMoneySignal(candidate: CandidateMoneySignal) {
    const approvedSignal = convertCandidateToApprovedMoneySignal(candidate);
    const buildSignal = convertApprovedMoneySignalToBuildSignal(approvedSignal);

    setApprovedMoneySignals((currentSignals) => {
      const nextSignals = [
        approvedSignal,
        ...currentSignals.filter((signal) => signal.id !== approvedSignal.id),
      ].slice(0, 50);

      writeApprovedMoneySignals(nextSignals);
      return nextSignals;
    });
    setCandidateMoneySignals((currentCandidates) => {
      const nextCandidates = currentCandidates.map((item) =>
        item.id === candidate.id ? { ...item, status: "approved" as const } : item,
      );

      writeCandidateMoneySignals(nextCandidates);
      return nextCandidates;
    });
    setRawSignals((currentRawSignals) => {
      const nextRawSignals = currentRawSignals.map((signal) =>
        signal.id === candidate.rawSignalId
          ? { ...signal, status: "approved" as const }
          : signal,
      );

      writeRawSignals(nextRawSignals);
      return nextRawSignals;
    });
    if (isAppMarketOption(candidate.market)) {
      setSelectedMarket(candidate.market);
    }
    selectSignal(buildSignal);
    setSelectedAction("sell");
    setActiveWorkflowTab("library");
    setCopyFeedback({
      message: "Approved to Money Moves. It can now rank in the feed and power the best move today.",
      tone: "success",
    });
  }

  function rejectCandidateMoneySignal(candidateId: string) {
    rememberRejectedSignal(candidateId);
    setCandidateMoneySignals((currentCandidates) => {
      const nextCandidates = currentCandidates.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, status: "rejected" as const }
          : candidate,
      );

      writeCandidateMoneySignals(nextCandidates);
      return nextCandidates;
    });
    setCopyFeedback({
      message: "Rejected candidate. It will not appear in the Money Move Feed.",
      tone: "success",
    });
  }

  function clearSignalInbox() {
    setRawSignals([]);
    setCandidateMoneySignals([]);
    writeRawSignals([]);
    writeCandidateMoneySignals([]);
    setCopyFeedback({
      message: "Cleared raw and candidate inbox records. Approved Money Moves were kept.",
      tone: "success",
    });
  }

  async function copyMasterPrompt() {
    if (!masterPrompt) return;

    const copied = await writeClipboardText(
      hasFounderAccess && selectedAction === "build"
        ? masterPrompt.fullCodeXMasterPrompt
        : buildFreeMasterPromptCopy(masterPrompt),
    );

    if (copied) {
      setCopiedMasterPrompt(true);
      setCopyFeedback({
        message:
          hasFounderAccess && selectedAction === "build"
            ? "Copied Code X prompt"
            : "Copied action brief preview",
        tone: "success",
      });
      window.setTimeout(() => setCopiedMasterPrompt(false), 1000);
      return;
    }

    setCopyFeedback({
      message: hasFounderAccess
        ? "Clipboard blocked. Select the Product Brief or Build Prompt text below and copy it manually."
        : "Clipboard blocked. Select the visible brief fields and copy them manually.",
      tone: "error",
    });
  }

  async function copyShortBrief() {
    if (!masterPrompt) {
      return;
    }

    const copied = await writeClipboardText(buildShortBriefCopy(masterPrompt));

    if (copied) {
      setCopiedSafePrompt(true);
      setCopyFeedback({
        message: "Copied brief",
        tone: "success",
      });
      window.setTimeout(() => setCopiedSafePrompt(false), 1000);
      return;
    }

    setCopyFeedback({
      message: "Clipboard blocked. Select the Product Name, Buyer, Pain, Price, and What to Build fields and copy them manually.",
      tone: "error",
    });
  }

  function deleteSavedSignal(signalId: string) {
    setSavedSignals((currentSignals) => {
      const nextSignals = currentSignals.filter(
        (signal) => signal.id !== signalId,
      );

      writeSavedSignals(nextSignals);
      return nextSignals;
    });
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden bg-[#070707] text-white">
      <div
        className={[
          "grid min-h-screen w-full max-w-full grid-cols-1 overflow-hidden",
          result && activeWorkflowTab === "studio"
            ? "lg:grid-cols-[1fr_340px]"
            : "lg:grid-cols-1",
        ].join(" ")}
      >
        <section className="w-full max-w-full overflow-hidden px-4 py-4 sm:px-6 md:p-8">
          <header className="mb-4 md:mb-8">
            <div className="flex min-w-0 items-center justify-between gap-4">
              <div />
              <LanguageSwitch />
            </div>

            <h1 className="mt-3 max-w-4xl break-words text-3xl font-black tracking-tight md:mt-4 md:text-6xl">
              Bilion
            </h1>
            <div className="mt-1 text-base font-bold text-zinc-200 md:mt-2 md:text-xl">
              Where did money move today?
            </div>

            <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-zinc-400 md:mt-4 md:text-base md:leading-7">
              Bilion discovers real businesses people already paid for, helps you make one your own, then shows you exactly how to test it before building.
            </p>
            <div className="mt-4 inline-flex max-w-full rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-400">
              Discover Money Moves &rarr; Make It Yours &rarr; Test Today &rarr; Build After Replies
            </div>
          </header>

          {selectedPatternLabel && (
            <div className="mb-5 min-w-0 break-words rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-3 text-sm font-bold text-emerald-100">
              Selected pattern: {selectedPatternLabel}
            </div>
          )}

          {(activeWorkflowTab === "library" || (activeWorkflowTab === "studio" && !result)) && (
            <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101011] p-4 shadow-2xl md:rounded-3xl md:p-8">
              <div className="grid gap-4 md:gap-6">
                {activeWorkflowTab === "library" && (
                <section>
                  <MarketSelectionSection
                    allSignals={evidenceInboxSignals}
                    hasFounderAccess={hasFounderAccess}
                    opportunities={topMarketOpportunities}
                    moneySignals={topMoneySignalsForMarket}
                    outputPack={outputPack}
                    selectedMarket={selectedMarket}
                    onGenerateOutputPack={generateOutputPack}
                    onSignalSeen={rememberSeenSignal}
                    onMarketChange={(market) => {
                      setSelectedMarket(market);
                      const [bestSignalForMarket] = getTopMoneySignalsForMarket(
                        evidenceInboxSignals,
                        market,
                      );

                      if (bestSignalForMarket) {
                        selectSignal(bestSignalForMarket);
                        setSelectedAction("post");
                      }
                    }}
                  />
                  <details className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <summary className="cursor-pointer list-none">
                      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                            Advanced / Archive
                          </div>
                          <p className="mt-1 break-words text-sm font-bold leading-6 text-zinc-300">
                            Signal Inbox, evidence imports, saved prompts, and archived market patterns.
                          </p>
                        </div>
                        <div className="text-xs font-bold text-zinc-600">
                          Open if needed
                        </div>
                      </div>
                    </summary>
                  <SignalInboxSection
                    approvedCount={approvedMoneySignals.length}
                    candidate={candidateMoneySignals.find(
                      (signal) => signal.status === "candidate",
                    )}
                    candidateCount={candidateMoneySignals.filter(
                      (signal) => signal.status === "candidate",
                    ).length}
                    onApprove={approveCandidateMoneySignal}
                    onClear={clearSignalInbox}
                    onExtract={extractSignalInboxCandidate}
                    onReject={rejectCandidateMoneySignal}
                    rawCount={rawSignals.length}
                  />
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Signal memory: {signalMemorySummary}
                  </div>
                  <div className="mt-5 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                        More money patterns
                      </div>
                      <h3 className="mt-1 break-words text-lg font-black text-white">
                        Pick another proven pattern if this one does not fit.
                      </h3>
                    </div>
                    <p className="min-w-0 break-words text-xs font-bold text-zinc-600">
                      Secondary. Start with the Top Opportunity above.
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4">
                    {signalGroups.map((group) => {
                      const groupOpen = openSignalGroups.includes(group.label);

                      return (
                      <details
                        key={group.label}
                        open={groupOpen}
                        onToggle={(event) => {
                          const isOpen = event.currentTarget.open;

                          setOpenSignalGroups((currentGroups) =>
                            isOpen
                              ? Array.from(new Set([...currentGroups, group.label]))
                              : currentGroups.filter((label) => label !== group.label),
                          );
                        }}
                        className={[
                          "min-w-0 rounded-2xl border p-3",
                          group.label === "Recommended" || group.label === "GitHub Signal"
                            ? "border-emerald-300/20 bg-emerald-300/[0.045]"
                            : "border-white/[0.07] bg-black/15",
                        ].join(" ")}
                      >
                        <summary className="mb-3 flex cursor-pointer list-none flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 break-words text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                            {group.label} · {group.signals.length}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                            <span>{group.signals.length}</span>
                            <span>
                              {groupOpen
                                ? "Open"
                                : "Tap to open"}
                            </span>
                          </div>
                        </summary>
                        {groupOpen && (
                        <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                          {group.signals.map((signal) => {
                            const active = selectedSignalId === signal.id;
                            const signalLabel =
                              signal.signalSourceLabel ||
                              signal.sourceType ||
                              "Market Signal";
                            const displayTitle = getDisplaySignalTitle(signal);
                            const classification = getMarketClassification(signal);
                            const evidenceLevel = getSignalEvidenceLevel(signal);
                            const opportunityScore = getSignalOpportunityScore(signal);

                            return (
                              <article
                                key={signal.id}
                                onClick={() => {
                                  setSourceMode(
                                    signal.id === "github-sample" ? "github" : "indie",
                                  );
                                  selectSignal(signal);
                                }}
                                className={[
                                  "min-h-36 min-w-0 overflow-hidden rounded-2xl border px-4 py-3 text-left transition",
                                  active
                                    ? "border-emerald-300/70 bg-emerald-300/[0.12] text-white shadow-lg shadow-emerald-950/30"
                                    : "border-white/10 bg-black/30 text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                                ].join(" ")}
                              >
                                <span className="mb-2 inline-flex max-w-full rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-200 break-words">
                                  {signalLabel}
                                </span>
                                <div className="mb-2 flex flex-wrap gap-1.5">
                                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                                    {classification}
                                  </span>
                                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                                    Score {opportunityScore}/50
                                  </span>
                                  <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                                    {evidenceLevel}
                                  </span>
                                </div>
                                <span className="block break-words text-sm font-black leading-5">
                                  {displayTitle.title}
                                </span>
                                {displayTitle.detail && (
                                  <span className="mt-1 line-clamp-2 block break-words text-xs font-bold leading-5 text-zinc-300">
                                    {displayTitle.detail}
                                  </span>
                                )}
                                <span className="mt-2 block break-words text-xs leading-5 text-zinc-500">
                                  {signal.buyer}
                                </span>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSourceMode(
                                      signal.id === "github-sample" ? "github" : "indie",
                                    );
                                    selectSignal(signal);
                                    setSelectedAction("build");
                                    setActiveWorkflowTab("studio");
                                  }}
                                  className="mt-3 w-full rounded-xl bg-emerald-300 px-3 py-2.5 text-xs font-black text-black transition hover:bg-emerald-200"
                                >
                                  Test first
                                </button>
                                <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                                  {nextActionOptions.map((option) => (
                                    <button
                                      key={option.action}
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setSourceMode(
                                          signal.id === "github-sample" ? "github" : "indie",
                                        );
                                        selectSignal(signal);
                                        setSelectedAction(option.action);
                                        setActiveWorkflowTab("studio");
                                      }}
                                      className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-xs font-bold text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                                    >
                                      {option.label.split(" ")[0]}
                                    </button>
                                  ))}
                                </div>
                              </article>
                            );
                          })}
                        </div>
                        )}
                      </details>
                      );
                    })}

                  </div>
                  <EvidenceInboxSummary
                    signals={evidenceInboxSignals}
                    topSignal={topOpportunitySignal}
                    onRevealTop={(signal) => {
                      setSourceMode(signal.id === "github-sample" ? "github" : "indie");
                      selectSignal(signal);
                      setSelectedAction("build");
                      setActiveWorkflowTab("studio");
                    }}
                  />
                  <EvidenceIntakeSection
                    approvedCount={approvedEvidenceSignals.length}
                    drafts={evidenceDrafts}
                    onApprove={approveEvidenceDraft}
                    onImport={importEvidenceSnippets}
                    onReject={rejectEvidenceDraft}
                  />
                  </details>
                </section>
                )}

                {activeWorkflowTab === "studio" && (
                <>
                <section>
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                      Step 2
                    </div>
                    <h3 className="mt-1 text-lg font-black text-white">
                      Choose a buyer
                    </h3>
                  </div>
                  <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                    {buyerOptions.map((buyer) => {
                      const active = selectedBuyer === buyer;

                      return (
                        <button
                          key={buyer}
                          type="button"
                          onClick={() => setSelectedBuyer(buyer)}
                          className={[
                            "min-h-11 rounded-full border px-4 py-2 text-sm font-bold transition",
                            active
                              ? "border-white/40 bg-white text-zinc-950"
                              : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white",
                          ].join(" ")}
                        >
                          {buyer}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                      Step 3
                    </div>
                    <h3 className="mt-1 text-lg font-black text-white">
                      Choose your next action
                    </h3>
                  </div>
                  <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-3">
                    {nextActionOptions.map((option) => {
                      const active = selectedAction === option.action;

                      return (
                        <button
                          key={option.action}
                          type="button"
                          onClick={() => setSelectedAction(option.action)}
                          className={[
                            "min-w-0 rounded-2xl border px-4 py-4 text-left transition",
                            active
                              ? "border-emerald-300/70 bg-emerald-300/[0.12] text-white shadow-lg shadow-emerald-950/30"
                              : "border-white/10 bg-black/30 text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                          ].join(" ")}
                        >
                          <span className="block break-words text-sm font-black">
                            {option.label}
                          </span>
                          <span className="mt-1 block break-words text-xs leading-5 text-zinc-500">
                            {option.helper}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

              {sourceMode === "github" && (
                <label className="mt-5 block">
                  <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    GitHub repo/activity text
                  </span>
                  <textarea
                    value={githubInput}
                    onChange={(event) => setGithubInput(event.target.value)}
                    placeholder={GITHUB_SAMPLE_ACTIVITY}
                    rows={5}
                    className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none ring-white/10 placeholder:text-zinc-600 focus:ring-2"
                  />
                </label>
              )}

              {selectedSignal && (
                <div className="mt-5 min-w-0 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.04] p-4">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    You are about to generate:
                  </div>
                  <div className="mt-3 grid min-w-0 gap-3 text-sm leading-6 md:grid-cols-3">
                    <div className="min-w-0 break-words rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="text-zinc-500">Signal</div>
                      <div className="font-bold text-zinc-100">
                        {selectedSignalDisplayTitle?.title || selectedSignal.sourceTitle}
                      </div>
                      {selectedSignalDisplayTitle?.detail && (
                        <div className="mt-1 text-xs font-bold leading-5 text-zinc-300">
                          {selectedSignalDisplayTitle.detail}
                        </div>
                      )}
                      <div className="mt-1 text-xs font-bold text-emerald-200">
                        {selectedSignal.signalSourceLabel ||
                          selectedSignal.sourceType ||
                          "Market Signal"}
                      </div>
                    </div>
                    <div className="min-w-0 break-words rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="text-zinc-500">Buyer</div>
                      <div className="font-bold text-zinc-100">{selectedBuyer}</div>
                    </div>
                    <div className="min-w-0 break-words rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="text-zinc-500">Action</div>
                      <div className="font-bold text-zinc-100">
                        {getActionLabel(selectedAction)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={generateIdea}
                disabled={loading || !canGenerate}
                className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Generating..." : "Try 1 free Money Move"}
              </button>
              {!canGenerate && (
                <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-5">
                  <h3 className="text-lg font-black text-yellow-100">
                    You&apos;ve used your 3 free Money Moves today.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Bilion Pro unlocks unlimited Money Moves, saved tests, and build-after-replies plans.
                  </p>
                  {CHECKOUT_URL ? (
                    <a
                      href={CHECKOUT_URL}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-zinc-200 sm:w-auto"
                    >
                      Unlock Bilion Pro — $9.99/month
                    </a>
                  ) : (
                    <a
                      href="/founder"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-zinc-200 sm:w-auto"
                    >
                      Unlock Bilion Pro — $9.99/month
                    </a>
                  )}
                </div>
              )}
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                </>
                )}
              </div>
            </div>
          )}

          {result && activeWorkflowTab === "studio" && (
            <div className="mt-8 grid gap-6">
              {!masterPrompt && (
              <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <div className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">
                      Your Business
                    </div>
                    <h2 className="mt-4 break-words text-2xl font-black tracking-tight sm:text-3xl">
                      Money Move ready
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Signal #{signalIndex + 1}
                  </div>
                </div>

                <div className="mt-6 grid min-w-0 gap-4 md:grid-cols-2">
                  <InfoBlock
                    label="Why it works"
                    value={
                      masterPrompt
                        ? buildHolyShit(masterPrompt)
                        : result.free.latest_signal
                    }
                  />
                  <InfoBlock
                    label="Buyer"
                    value={
                      masterPrompt
                        ? buildWhatEveryoneMisses(masterPrompt)
                        : result.free.why_now
                    }
                  />
                  <InfoBlock
                    label="First Offer"
                    value={
                      masterPrompt
                        ? buildMoneyAngle(masterPrompt)
                        : result.free.why_now
                    }
                  />
                  <InfoBlock
                    label="Move Score"
                    value={
                      masterPrompt
                        ? buildOpportunityScore(masterPrompt)
                        : result.free.pain
                    }
                  />
                  <InfoBlock
                    label="First Wedge"
                    value={
                      masterPrompt
                        ? buildFirstWedge(masterPrompt)
                        : result.free.what_you_can_build
                    }
                  />
                  <InfoBlock
                    label="48h Test"
                    value={
                      masterPrompt
                        ? buildAttackPlan(masterPrompt)
                        : result.free.why_now
                    }
                  />
                  <InfoBlock label="Codex Build Prompt" value={result.free.what_you_can_build} />
                </div>
              </div>
              )}

              {canGenerate ? (
              <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
                <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0">
                    <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
                      Your Business
                    </div>
                    <h2 className="mt-4 break-words text-2xl font-black tracking-tight sm:text-3xl">
                      Generate from your selected signal, buyer, and action.
                    </h2>
                    <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-zinc-400">
                      {hasFounderAccess
                        ? "Bilion Pro unlocks unlimited Money Moves, more versions, saved tests, and build-after-replies plans."
                        : `Free Money Moves today: ${freeUsageCount} of ${FREE_GENERATION_LIMIT} used. Bilion Pro unlocks unlimited discovery.`}
                    </p>
                  </div>

                  <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row">
                    <button
                      type="button"
                      onClick={selectAnotherSignal}
                      className="w-full rounded-2xl border border-emerald-300/30 px-5 py-4 text-center text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10 sm:w-auto"
                    >
                      Another Signal
                    </button>
                    <button
                      type="button"
                      onClick={generateMasterPrompt}
                      disabled={!canGenerate}
                      className="w-full rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      Make It Yours
                    </button>
                    <button
                      type="button"
                      onClick={generateAnotherAngle}
                      disabled={!masterPrompt || !canGenerate}
                      className="w-full rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      Another Angle
                    </button>
                  </div>
                </div>
                <details className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3">
                  <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-wide text-zinc-500">
                    Advanced actions
                  </summary>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={saveDistributionAssets}
                      className="w-full rounded-2xl border border-emerald-300/30 px-5 py-4 text-center text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10 sm:w-auto"
                    >
                      Save to Queue
                    </button>
                    <button
                      type="button"
                      onClick={addValidationRecord}
                      className="w-full rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04] sm:w-auto"
                    >
                      Track Validation
                    </button>
                  </div>
                </details>

              </section>
              ) : (
                <section className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6 shadow-2xl">
                  <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-yellow-300">
                    Bilion Pro
                  </div>
                  <h2 className="mt-4 text-3xl font-black tracking-tight">
                    You&apos;ve used your 3 free Money Moves today.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                    Bilion Pro unlocks unlimited Money Moves, saved tests, and build-after-replies plans.
                  </p>
                  {CHECKOUT_URL ? (
                    <a
                      href={CHECKOUT_URL}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-zinc-200 sm:w-auto"
                    >
                      Unlock Bilion Pro — $9.99/month
                    </a>
                  ) : (
                    <a
                      href="/founder"
                      className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-zinc-200 sm:w-auto"
                    >
                      Unlock Bilion Pro — $9.99/month
                    </a>
                  )}
                </section>
              )}

              {masterPrompt && (
                <MasterPromptCard
                  copied={copiedMasterPrompt}
                  copiedSafe={copiedSafePrompt}
                  hasFounderAccess={hasFounderAccess}
                  masterPrompt={masterPrompt}
                  selectedAction={selectedAction}
                  onCopy={copyMasterPrompt}
                  onCopyBrief={copyShortBrief}
                  copyFeedback={copyFeedback}
                  angleNumber={masterPromptAngleIndex + 1}
                  signalNumber={signalIndex + 1}
                />
              )}
            </div>
          )}

          <SecondaryToolsSection
            canSaveAssets={Boolean(result || masterPrompt)}
            copiedSignalId={copiedSavedSignalId}
            distributionQueue={distributionQueue}
            hasFounderAccess={hasFounderAccess}
            onAddValidationRecord={addValidationRecord}
            onCopySavedPrompt={copySavedSignalPrompt}
            onDeleteSavedSignal={deleteSavedSignal}
            onMarkWinner={markWinner}
            onSaveDistributionAssets={saveDistributionAssets}
            onUpdateDistributionStatus={updateDistributionStatus}
            onUpdateValidationRecord={updateValidationRecord}
            onViewSavedSignal={viewSavedSignal}
            savedSignals={savedSignals}
            validationRecords={validationRecords}
          />
        </section>

        {result && activeWorkflowTab === "studio" && (
          <aside className="border-l border-white/10 bg-[#0b0b0c] p-5">
            <div className="sticky top-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-300">
                  Distribution Kit
                </div>

                <h2 className="mt-4 text-2xl font-black">
                  Turn the brief into attention, replies, and buyers.
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Use the Mobile Share Kit at the bottom of the brief to post on
                  X, reply to interest, DM likely buyers, and offer the paid
                  first tiny product.
                </p>

                <div className="mt-5 space-y-3">
                  <RightPanelItem title="Copy X Post" />
                  <RightPanelItem title="Copy DM Script" />
                  <RightPanelItem title="Copy Validation Plan" />
                  <RightPanelItem title="Copy Codex Prompt" />
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}

function EvidenceInboxSummary({
  onRevealTop,
  signals,
  topSignal,
}: {
  onRevealTop: (signal: BuildSignal) => void;
  signals: BuildSignal[];
  topSignal?: BuildSignal;
}) {
  const classifications = Array.from(
    new Set(signals.map((signal) => getMarketClassification(signal))),
  ).slice(0, 4);
  const strongCount = signals.filter(
    (signal) => getSignalEvidenceLevel(signal) === "Strong",
  ).length;

  return (
    <details className="mt-4 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
              Evidence Inbox
            </div>
            <p className="mt-1 text-sm font-bold leading-6 text-zinc-300">
              {signals.length} signals feeding the ranking engine.
            </p>
          </div>
          <div className="text-xs font-bold text-zinc-600">Open evidence</div>
        </div>
      </summary>
      <div className="mt-4 min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            Evidence Inbox
          </div>
          <h3 className="mt-1 break-words text-lg font-black text-white">
            Market-backed opportunities, ranked before generation.
          </h3>
          <p className="mt-2 break-words text-sm leading-6 text-zinc-300">
            {signals.length} market signals / {strongCount} strong evidence /{" "}
            {classifications.join(", ")}
          </p>
          <p className="mt-1 break-words text-xs font-bold leading-5 text-zinc-500">
            Evidence feeds the ranking engine. Approved evidence makes Bilion smarter about what to post, DM, and build after replies.
          </p>
        </div>

        {topSignal && (
          <div className="min-w-0 rounded-2xl border border-emerald-300/40 bg-emerald-300/[0.09] p-4 shadow-lg shadow-emerald-950/20 lg:min-w-80">
            <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-300">
              Money Move
            </div>
            <div className="mt-1 break-words text-sm font-black text-white">
              {truncateDisplayText(getDisplaySignalTitle(topSignal).title, 64)}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-zinc-300">
                {getMarketClassification(topSignal)}
              </span>
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/[0.1] px-2 py-1 text-emerald-200">
                Opportunity Score {getSignalOpportunityScore(topSignal)}/50
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRevealTop(topSignal)}
              className="mt-3 w-full rounded-xl bg-emerald-300 px-3 py-2.5 text-xs font-black text-black transition hover:bg-emerald-200"
            >
              Test first
            </button>
          </div>
        )}
      </div>
      </div>
    </details>
  );
}

function MarketSelectionSection({
  allSignals,
  hasFounderAccess,
  moneySignals,
  onGenerateOutputPack,
  onMarketChange,
  onSignalSeen,
  opportunities,
  outputPack,
  selectedMarket,
}: {
  allSignals: BuildSignal[];
  hasFounderAccess: boolean;
  moneySignals: BuildSignal[];
  onGenerateOutputPack: (signal: BuildSignal) => void;
  onMarketChange: (market: AppMarketOption) => void;
  onSignalSeen: (signal: BuildSignal | string) => void;
  opportunities: BuildSignal[];
  outputPack: OutputPack | null;
  selectedMarket: AppMarketOption;
}) {
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>("Get replies today");
  const [buyerPreference, setBuyerPreference] = useState<BuyerPreference>("Creators");
  const [monetizationPreference, setMonetizationPreference] = useState<MonetizationPreference>("Manual service");
  const [deepDiveSignalId, setDeepDiveSignalId] = useState("");
  const [selectedTransform, setSelectedTransform] = useState<TransformType>("X Post");
  const [selectedRemix, setSelectedRemix] = useState<RemixType>("Make it simpler");
  const [validationQueue, setValidationQueue] = useState<ValidationQueueItem[]>(() => readLaunchQueueItems());
  const [savedTransformKeys, setSavedTransformKeys] = useState<string[]>([]);
  const [activePackCopied, setActivePackCopied] = useState("");
  const [activeBusinessAngle, setActiveBusinessAngle] = useState<BusinessAngleName>("Safe angle");
  const [activeStartedSignalId, setActiveStartedSignalId] = useState("");
  const [generatingSignalId, setGeneratingSignalId] = useState("");
  const [generationMessage, setGenerationMessage] = useState("");
  const [dailyFeedSeed] = useState(() => getDailyFeedSeed());
  const [feedOffset, setFeedOffset] = useState(0);
  const [businessControls, setBusinessControls] = useState<BusinessStartControls>({
    channel: "X",
    difficulty: "simple",
    offerType: "audit",
    pricePoint: "$99 one-time",
    targetBuyer: "",
    tone: "direct",
  });
  const topMoneySignals = moneySignals.length
    ? moneySignals
    : getStaticMoneySignalsForMarket(selectedMarket);
  const marketScopedSignals = allSignals
    .filter((signal) => getSignalMarket(signal) === selectedMarket)
    .filter((signal, index, signals) =>
      signals.findIndex((candidate) => candidate.id === signal.id) === index,
    );
  const diverseFeedSignals = allSignals
    .filter((signal, index, signals) =>
      signals.findIndex((candidate) => candidate.id === signal.id) === index,
    );
  const dailyFeedSignals = rotateSignalsForDailyFeed(
    diverseFeedSignals.length ? diverseFeedSignals : marketScopedSignals,
    dailyFeedSeed,
    feedOffset,
  );
  const recommendationSource = dailyFeedSignals.length
    ? dailyFeedSignals
    : topMoneySignals.length
      ? topMoneySignals
      : opportunities.length > 0
        ? opportunities
        : [buildMarketSpecificSignal(selectedMarket)];
  const recommendations = getRecommendedSignals(
    recommendationSource,
    dailyGoal,
    buyerPreference,
    monetizationPreference,
  );
  const primaryRecommendation = recommendations[0];
  const deepDiveSignal =
    recommendations.find((recommendation) => recommendation.signal.id === deepDiveSignalId)?.signal ||
    primaryRecommendation?.signal ||
    topMoneySignals[0] ||
    buildMarketSpecificSignal(selectedMarket);
  const feedRecommendations = recommendations.slice(0, hasFounderAccess ? 12 : 4);
  const lockedDailyCount = hasFounderAccess ? 0 : Math.max(0, recommendations.length - feedRecommendations.length);
  const deepDiveDetail = getOpportunityDetailFields(deepDiveSignal);
  const effectiveBusinessControls = {
    ...businessControls,
    targetBuyer: businessControls.targetBuyer || deepDiveDetail.buyer,
  };
  const businessStartPack = buildBusinessStartPack(
    deepDiveSignal,
    effectiveBusinessControls,
    activeBusinessAngle,
  );
  const businessAnglePacks = businessAngleNames.map((angleName) =>
    buildBusinessStartPack(
      deepDiveSignal,
      {
        ...effectiveBusinessControls,
        ...getAngleDefaults(angleName),
      },
      angleName,
    ),
  );
  const hasEnoughMarketSignals = marketScopedSignals.length >= 3;
  const selectedTransformOutput = buildTransformOutput(
    deepDiveSignal,
    selectedTransform,
    hasFounderAccess,
  );
  const selectedRemixOutput = buildRemixOutput(deepDiveSignal, selectedRemix);
  const queueLimitReached = !hasFounderAccess && validationQueue.length >= 2;
  const transformAllowed =
    hasFounderAccess ||
    selectedTransform === "X Post" ||
    selectedTransform === "Buyer DM" ||
    selectedTransform === "Codex Prompt";
  const winnerItems = validationQueue.filter((item) => item.winner);
  const showGeneratedBusiness = activeStartedSignalId === deepDiveSignal.id && !generatingSignalId;
  const analyticsPayload = {
    buyer: deepDiveDetail.buyer,
    hasProAccess: hasFounderAccess,
    monetizationStyle: monetizationPreference,
    selectedSignalTitle: getDisplaySignalTitle(deepDiveSignal).title,
    userGoal: dailyGoal,
  };

  function trackUnlockProClick() {
    trackBilionIntentEvent("click_unlock_bilion_pro", analyticsPayload);
  }

  useEffect(() => {
    writeLaunchQueueItems(validationQueue);
  }, [validationQueue]);

  function createQueueItem(
    outputType: TransformType | "Business Start Pack",
    output: string,
  ): ValidationQueueItem {
    return {
      id: `launch-${deepDiveSignal.id}-${outputType}-${validationQueue.length + 1}`,
      buyer: deepDiveDetail.buyer,
      dms: 0,
      likes: 0,
      notes: "",
      offer: `${businessStartPack.firstOffer} (${businessStartPack.price})`,
      output,
      outputType,
      paidInterest: 0,
      replies: 0,
      saves: 0,
      signalTitle: businessStartPack.businessName,
      status: "Draft",
      views: 0,
      winner: false,
    };
  }

  function startBusiness(signal: BuildSignal) {
    setDeepDiveSignalId(signal.id);
    setBusinessControls(getDefaultBusinessStartControls(signal));
    setActiveBusinessAngle("Safe angle");
    setGeneratingSignalId(signal.id);
    setGenerationMessage("Turning money into your version...");
    onSignalSeen(signal);
    onGenerateOutputPack(signal);

    window.setTimeout(() => {
      setGenerationMessage("Finding your angle...");
    }, 450);
    window.setTimeout(() => {
      setGenerationMessage("Generating your business...");
    }, 900);
    window.setTimeout(() => {
      setActiveStartedSignalId(signal.id);
      setGeneratingSignalId("");
      setGenerationMessage("");
    }, 1300);
  }

  function showNextMoneyMove() {
    setActiveStartedSignalId("");
    setGeneratingSignalId("");
    setGenerationMessage("");
    setFeedOffset((currentOffset) => currentOffset + 1);
  }

  function addTransformToQueue() {
    if (queueLimitReached || !transformAllowed) {
      return;
    }

    trackBilionIntentEvent("add_to_validation_queue", analyticsPayload);

    setValidationQueue((currentItems) => [
      {
        id: `queue-${deepDiveSignal.id}-${selectedTransform}-${Date.now()}`,
        buyer: deepDiveDetail.buyer,
        offer: deepDiveDetail.firstOffer,
        output: selectedTransformOutput,
        outputType: selectedTransform,
        signalTitle: getDisplaySignalTitle(deepDiveSignal).title,
        status: "Draft",
        views: 0,
        likes: 0,
        saves: 0,
        replies: 0,
        dms: 0,
        paidInterest: 0,
        notes: "",
        winner: false,
      },
      ...currentItems,
    ]);
  }

  function addTodaysMoveToQueue() {
    if (queueLimitReached) {
      return;
    }

    trackBilionIntentEvent("add_to_validation_queue", analyticsPayload);

    setValidationQueue((currentItems) => [
      createQueueItem(
        "Business Start Pack",
        [
          `Business: ${businessStartPack.businessName}`,
          `Angle: ${businessStartPack.angleName}`,
          `Buyer: ${businessStartPack.buyer}`,
          `Offer: ${businessStartPack.firstOffer}`,
          `Price: ${businessStartPack.price}`,
          "",
          "X Post:",
          businessStartPack.xPost,
          "",
          "Carousel:",
          businessStartPack.carousel,
          "",
          "DM:",
          businessStartPack.dmScript,
          "",
          businessStartPack.validationPlan,
          "",
          businessStartPack.buildDropRule,
        ].join("\n"),
      ),
      ...currentItems,
    ]);
  }

  function updateQueueStatus(itemId: string, status: ValidationQueueStatus) {
    setValidationQueue((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, status } : item,
      ),
    );

    if (status === "Build") {
      const winnerItem = validationQueue.find((item) => item.id === itemId);

      trackBilionIntentEvent("mark_queue_item_winner", {
        buyer: winnerItem?.buyer || analyticsPayload.buyer,
        hasProAccess: hasFounderAccess,
        monetizationStyle: monetizationPreference,
        selectedSignalTitle: winnerItem?.signalTitle || analyticsPayload.selectedSignalTitle,
        userGoal: dailyGoal,
      });
    }
  }

  function updateQueueItem(
    itemId: string,
    updates: Partial<ValidationQueueItem>,
  ) {
    setValidationQueue((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      ),
    );
  }

  function markQueueWinner(itemId: string) {
    const winnerItem = validationQueue.find((item) => item.id === itemId);

    setValidationQueue((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, status: "Winner", winner: true } : item,
      ),
    );

    trackBilionIntentEvent("mark_queue_item_winner", {
      buyer: winnerItem?.buyer || analyticsPayload.buyer,
      hasProAccess: hasFounderAccess,
      monetizationStyle: monetizationPreference,
      selectedSignalTitle: winnerItem?.signalTitle || analyticsPayload.selectedSignalTitle,
      userGoal: dailyGoal,
    });
  }

  async function copyBusinessStartPackPart(label: string, value: string) {
    const didCopy = await writeClipboardText(value);

    setActivePackCopied(didCopy ? label : "");
    window.setTimeout(() => setActivePackCopied(""), 1200);
  }

  function saveTransformOutput() {
    setSavedTransformKeys((currentKeys) =>
      Array.from(new Set([`${deepDiveSignal.id}-${selectedTransform}`, ...currentKeys])),
    );
  }

  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.055] p-4 shadow-2xl md:rounded-3xl md:p-6">
      <MoneyMoveFeedIntro
        hasFounderAccess={hasFounderAccess}
        lockedDailyCount={lockedDailyCount}
        selectedMarket={selectedMarket}
      />

      <details className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
          Tune feed
        </summary>
        <div className="mt-4">
          <PreferencePanel
            buyerPreference={buyerPreference}
            dailyGoal={dailyGoal}
            monetizationPreference={monetizationPreference}
            onBuyerPreferenceChange={(nextBuyer) => {
              setBuyerPreference(nextBuyer);
              const nextMarket = getPreferenceMarket(nextBuyer);

              if (nextMarket) {
                onMarketChange(nextMarket);
              }
            }}
            onDailyGoalChange={setDailyGoal}
            onMonetizationPreferenceChange={setMonetizationPreference}
          />
          <div className="mt-3 flex min-w-0 flex-wrap gap-2 pb-1">
            {appMarketOptions.map((market) => {
              const active = selectedMarket === market;

              return (
                <button
                  key={market}
                  type="button"
                  onClick={() => onMarketChange(market)}
                  className={[
                    "min-h-11 rounded-full border px-3 py-2 text-sm font-black transition",
                    active
                      ? "border-emerald-300 bg-emerald-300 text-black"
                      : "border-white/10 bg-black/25 text-zinc-400 hover:border-white/20 hover:text-white",
                  ].join(" ")}
                >
                  {market}
                </button>
              );
            })}
          </div>
        </div>
      </details>

      {!hasEnoughMarketSignals && (
        <div className="mt-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.08] px-4 py-3 text-sm font-bold leading-6 text-yellow-100">
          Not enough strong signals in this market yet. Showing the best available signal plus adjacent fallback patterns.
        </div>
      )}

      <div className="mt-3 grid min-w-0 gap-3 md:mt-4">
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {feedRecommendations.map((recommendation, index) => {
            const signal = recommendation.signal;
            const detail = getOpportunityDetailFields(signal);
            const active = deepDiveSignal.id === signal.id;

            return (
              <MoneyMoveFeedCard
                active={active}
                detail={detail}
                fitScore={recommendation.fitScore}
                generating={generatingSignalId === signal.id}
                index={index}
                key={signal.id}
                onTry={() => startBusiness(signal)}
                signal={signal}
                whyMatches={recommendation.why}
              />
            );
          })}
        </div>

        {!hasFounderAccess && lockedDailyCount > 0 && (
          <section className="rounded-3xl border border-white/10 bg-black/30 p-5 text-center">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
              You&apos;ve discovered today&apos;s free Money Moves.
            </div>
            <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-6 text-zinc-300">
              Bilion has more proven Money Moves ready. Unlock unlimited discovery when you want five more.
            </p>
            <a
              href={CHECKOUT_URL || "/founder"}
              onClick={trackUnlockProClick}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-black transition hover:bg-emerald-200 sm:w-auto"
            >
              Unlock unlimited Money Moves
            </a>
          </section>
        )}

        {!hasFounderAccess && <ProUpgradeCard onUnlockClick={trackUnlockProClick} />}

        {generatingSignalId && (
          <section className="mt-4 rounded-3xl border border-emerald-300/30 bg-emerald-300/[0.08] p-5 text-center shadow-lg shadow-emerald-950/20">
            <div className="mx-auto h-2 w-32 overflow-hidden rounded-full bg-black/40">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-emerald-300" />
            </div>
            <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-200">
              {generationMessage || "Generating your business..."}
            </p>
          </section>
        )}

        {showGeneratedBusiness && (
          <article className="mt-2 min-w-0 overflow-hidden rounded-2xl border border-emerald-300/35 bg-black/35 p-4 shadow-lg shadow-emerald-950/20 md:rounded-3xl md:p-5">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
              Your Business
            </div>
            <h3 className="mt-2 break-words text-xl font-black text-white">
              {truncateDisplayText(getDisplaySignalTitle(deepDiveSignal).title, 90)}
            </h3>
            <div className="mt-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.08] px-4 py-3 text-sm font-black text-yellow-100">
              Build only after replies.
            </div>

            <BusinessStartPackPanel
              anglePacks={businessAnglePacks}
              controls={effectiveBusinessControls}
              copiedLabel={activePackCopied}
              onAngleChange={(angleName) => {
                setActiveBusinessAngle(angleName);
                setBusinessControls((currentControls) => ({
                  ...currentControls,
                  ...getAngleDefaults(angleName),
                }));
              }}
              onControlsChange={(nextControls) =>
                setBusinessControls((currentControls) => ({
                  ...currentControls,
                  ...nextControls,
                }))
              }
              onCopy={copyBusinessStartPackPart}
              onSaveToQueue={addTodaysMoveToQueue}
              pack={businessStartPack}
              queueLimitReached={queueLimitReached}
            />

            <button
              type="button"
              onClick={showNextMoneyMove}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-center text-sm font-black text-zinc-100 transition hover:border-emerald-300/35 hover:bg-emerald-300/[0.08]"
            >
              Show Me Another Money Move
            </button>

            <details className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                Show advanced tools
              </summary>
              <MoneyMoveAngleExpander signal={deepDiveSignal} />
              <section className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.06] p-4">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                      Launch assets
                    </div>
                    <p className="mt-1 break-words text-sm font-bold leading-6 text-zinc-200">
                      Extra formats for later. Your next move is still the X post.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onGenerateOutputPack(deepDiveSignal)}
                    className="w-full rounded-2xl bg-emerald-300 px-5 py-4 text-center text-sm font-black text-black transition hover:bg-emerald-200 sm:w-auto"
                  >
                    Generate launch assets
                  </button>
                </div>
                {outputPack && outputPack.signalId === deepDiveSignal.id && (
                  <BuildBriefPanel
                    codexBuildPrompt={outputPack.codexBuildPrompt}
                    detail={deepDiveDetail}
                    signalTitle={getDisplaySignalTitle(deepDiveSignal).title}
                  />
                )}
              </section>

              {outputPack && outputPack.signalId === deepDiveSignal.id && (
                <>
                  <TransformStudio
                    canAddToQueue={!queueLimitReached}
                    hasFounderAccess={hasFounderAccess}
                    onAddToQueue={addTransformToQueue}
                    onSave={saveTransformOutput}
                    onTransformChange={setSelectedTransform}
                    onUnlockProClick={trackUnlockProClick}
                    output={selectedTransformOutput}
                    trackingPayload={analyticsPayload}
                    selectedTransform={selectedTransform}
                    transformAllowed={transformAllowed}
                    wasSaved={savedTransformKeys.includes(`${deepDiveSignal.id}-${selectedTransform}`)}
                  />
                  {hasFounderAccess && (
                    <RemixEngine
                      onRemixChange={setSelectedRemix}
                      remixOutput={selectedRemixOutput}
                      selectedRemix={selectedRemix}
                    />
                  )}
                </>
              )}
            </details>

            <section className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                Build only after replies
              </div>
              <p className="mt-2 break-words text-sm font-bold leading-6 text-zinc-300">
                Use the Codex prompt only after replies, saves, clicks, or buyer interest.
              </p>
            </section>
            <ValidationQueuePanel
              hasFounderAccess={hasFounderAccess}
              onItemChange={updateQueueItem}
              onMarkWinner={markQueueWinner}
              onStatusChange={updateQueueStatus}
              queue={validationQueue}
            />
            <WinnerPanel winners={winnerItems} />
          </article>
        )}
      </div>
    </section>
  );
}

function MoneyMoveFeedIntro({
  hasFounderAccess,
  lockedDailyCount,
  selectedMarket,
}: {
  hasFounderAccess: boolean;
  lockedDailyCount: number;
  selectedMarket: AppMarketOption;
}) {
  return (
    <section className="mb-4 rounded-2xl border border-white/10 bg-black/30 p-4 md:rounded-3xl md:p-5">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
        Money Move Feed
      </div>
      <h2 className="mt-2 max-w-3xl break-words text-3xl font-black text-white md:text-5xl">
        Where did money move today?
      </h2>
      <p className="mt-3 max-w-3xl break-words text-sm font-bold leading-6 text-zinc-300 md:text-base">
        Bilion discovers real businesses people already paid for, helps you make one your own, then shows you exactly how to test it before building.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide text-zinc-400">
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/[0.08] px-3 py-2 text-emerald-100">
          Feed: {selectedMarket}
        </span>
        <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2">
          Discover Money Moves &rarr; Make It Yours &rarr; Test Today &rarr; Build After Replies
        </span>
        <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2">
          {hasFounderAccess ? "Unlimited daily discovery" : `Free today: ${lockedDailyCount > 0 ? "try one, unlock more" : "try one Money Move"}`}
        </span>
      </div>
    </section>
  );
}

function MoneyMoveFeedCard({
  active,
  detail,
  fitScore,
  generating,
  index,
  onTry,
  signal,
  whyMatches,
}: {
  active: boolean;
  detail: ReturnType<typeof getOpportunityDetailFields>;
  fitScore: number;
  generating: boolean;
  index: number;
  onTry: () => void;
  signal: BuildSignal;
  whyMatches: string;
}) {
  return (
    <article
      className={[
        "min-w-0 overflow-hidden rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5",
        active
          ? "border-emerald-300/70 bg-emerald-300/[0.12] shadow-lg shadow-emerald-950/30"
          : "border-white/10 bg-black/25 hover:border-emerald-300/35 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      <p className="line-clamp-3 break-words text-xl font-black leading-7 text-emerald-100">
        {normalizeDisplayText(detail.proof)}
      </p>
      <h3 className="mt-2 break-words text-base font-black text-white">
        {truncateDisplayText(getDisplaySignalTitle(signal).title, 86)}
      </h3>
      <p className="mt-3 line-clamp-2 break-words text-sm font-bold leading-6 text-zinc-300">
        Who paid: {normalizeDisplayText(detail.buyer)}
      </p>
      <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-zinc-400">
        {normalizeDisplayText(detail.whyMoneyChangedHands || whyMatches)}
      </p>
      <div className="mt-3 flex min-w-0 flex-wrap gap-2">
        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-200">
          {index === 0 ? "Today's Best Opportunity" : "Next Money Move"}
        </span>
        <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-500">
          {getFitLabel(fitScore)}
        </span>
        {signal.signalSourceLabel || signal.sourceType ? (
          <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-600">
            {signal.signalSourceLabel || signal.sourceType}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onTry}
        disabled={generating}
        className={[
          "mt-4 w-full rounded-xl px-3 py-3 text-center text-sm font-black transition disabled:cursor-wait disabled:opacity-80",
          active
            ? "border border-emerald-300/35 bg-emerald-300/[0.08] text-emerald-100"
            : "bg-emerald-300 text-black hover:bg-emerald-200",
        ].join(" ")}
      >
        {generating ? "Generating..." : "Try This"}
      </button>
    </article>
  );
}

function BusinessStartPackPanel({
  anglePacks,
  controls,
  copiedLabel,
  onAngleChange,
  onControlsChange,
  onCopy,
  onSaveToQueue,
  pack,
  queueLimitReached,
}: {
  anglePacks: BusinessStartPack[];
  controls: BusinessStartControls;
  copiedLabel: string;
  onAngleChange: (angleName: BusinessAngleName) => void;
  onControlsChange: (nextControls: Partial<BusinessStartControls>) => void;
  onCopy: (label: string, value: string) => void;
  onSaveToQueue: () => void;
  pack: BusinessStartPack;
  queueLimitReached: boolean;
}) {
  const copyItems = [
    { label: "Copy X Post", value: pack.xPost },
    { label: "Copy DM", value: pack.dmScript },
    { label: "Copy Carousel", value: pack.carousel },
  ];
  const primaryCopy = copyItems[0];
  const secondaryCopyItems = copyItems.slice(1);

  return (
    <section className="mt-5 rounded-2xl border border-emerald-300/30 bg-emerald-300/[0.07] p-4 md:rounded-3xl md:p-5">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Your Business
          </div>
          <h3 className="mt-2 break-words text-xl font-black text-white md:text-2xl">
            {pack.businessName}
          </h3>
          <p className="mt-2 max-w-2xl break-words text-sm font-bold leading-6 text-zinc-300">
            Your next move is simple: copy the X post, publish it, then DM buyers who engage.
          </p>
        </div>
        <button
          type="button"
          onClick={onSaveToQueue}
          disabled={queueLimitReached}
          className="w-full rounded-2xl bg-emerald-300 px-5 py-3 text-center text-sm font-black text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
        >
          Save to My Tests
        </button>
      </div>

      <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-3">
        <MarketOpportunityField label="Buyer" value={pack.buyer} />
        <MarketOpportunityField label="First offer" value={pack.firstOffer} />
        <MarketOpportunityField label="Price" value={pack.price} />
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="text-[11px] font-black uppercase tracking-wide text-emerald-300">
          Today&apos;s task
        </div>
        <p className="mt-2 break-words text-sm font-bold leading-6 text-zinc-200">
          Post this on {controls.channel}. DM 10 buyers. Build only after replies.
        </p>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onCopy(primaryCopy.label, primaryCopy.value)}
          className="w-full rounded-2xl bg-emerald-300 px-5 py-4 text-center text-sm font-black text-black transition hover:bg-emerald-200"
        >
          {copiedLabel === primaryCopy.label ? "Copied" : primaryCopy.label}
        </button>
      </div>

      <details className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
        <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
          Make it mine
        </summary>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="min-w-0 text-[11px] font-black uppercase tracking-wide text-zinc-500">
            Target buyer
            <input
              value={controls.targetBuyer}
              onChange={(event) => onControlsChange({ targetBuyer: event.target.value })}
              className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm font-bold text-white"
            />
          </label>
          <BusinessControlSelect label="Offer type" value={controls.offerType} options={businessOfferTypes} onChange={(value) => onControlsChange({ offerType: value as BusinessOfferType })} />
          <label className="min-w-0 text-[11px] font-black uppercase tracking-wide text-zinc-500">
            Price point
            <input
              value={controls.pricePoint}
              onChange={(event) => onControlsChange({ pricePoint: event.target.value })}
              className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm font-bold text-white"
            />
          </label>
          <BusinessControlSelect label="Channel" value={controls.channel} options={businessChannels} onChange={(value) => onControlsChange({ channel: value as BusinessChannel })} />
          <BusinessControlSelect label="Tone" value={controls.tone} options={businessTones} onChange={(value) => onControlsChange({ tone: value as BusinessTone })} />
          <BusinessControlSelect label="Difficulty" value={controls.difficulty} options={businessDifficulties} onChange={(value) => onControlsChange({ difficulty: value as BusinessDifficulty })} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["Re-angle", "Safe angle"],
            ["Make it more premium", "Premium angle"],
            ["Make it simpler", "Beginner angle"],
            ["Make it more viral", "Aggressive angle"],
            ["Make it more B2B", "Agency angle"],
            ["Make it more beginner-friendly", "Beginner angle"],
          ].map(([label, angleName]) => (
            <button
              key={label}
              type="button"
              onClick={() => onAngleChange(angleName as BusinessAngleName)}
              className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-emerald-300/35 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </details>

      <details className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
        <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
          More Versions
        </summary>
        <div className="mt-3 grid gap-3 lg:grid-cols-5">
          {anglePacks.map((anglePack) => {
            const active = anglePack.angleName === pack.angleName;

            return (
              <button
                key={anglePack.angleName}
                type="button"
                onClick={() => onAngleChange(anglePack.angleName)}
                className={[
                  "min-w-0 rounded-2xl border p-3 text-left transition",
                  active
                    ? "border-emerald-300/70 bg-emerald-300/[0.12]"
                    : "border-white/10 bg-black/30 hover:border-emerald-300/35",
                ].join(" ")}
              >
                <div className="text-[11px] font-black uppercase tracking-wide text-emerald-300">
                  {anglePack.angleName}
                </div>
                <div className="mt-2 break-words text-sm font-black text-white">
                  {anglePack.firstOffer}
                </div>
                <p className="mt-2 line-clamp-3 break-words text-xs font-bold leading-5 text-zinc-400">
                  {anglePack.buyer} / {anglePack.price}
                </p>
              </button>
            );
          })}
        </div>
      </details>

      <details className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
        <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
          Show launch assets
        </summary>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {secondaryCopyItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onCopy(item.label, item.value)}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-black text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.08]"
          >
            {copiedLabel === item.label ? "Copied" : item.label}
          </button>
        ))}
        <BusinessStartPackOutput title="X post" value={pack.xPost} />
        <BusinessStartPackOutput title="3-slide carousel" value={pack.carousel} />
        <BusinessStartPackOutput title="DM script" value={pack.dmScript} />
        <BusinessStartPackOutput title="Free lead magnet" value={pack.freeLeadMagnet} />
        <BusinessStartPackOutput title="48-hour validation plan" value={pack.validationPlan} />
        <BusinessStartPackOutput title="Build / Drop rule" value={pack.buildDropRule} />
      </div>
      </details>

      <details className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <summary className="cursor-pointer list-none text-sm font-black text-zinc-200">
          Build After Replies: Codex MVP prompt
        </summary>
        <p className="mt-2 break-words text-xs font-bold leading-5 text-zinc-500">
          Secondary step. Use this only after replies, saves, clicks, or paid interest.
        </p>
        <pre className="mt-3 max-h-[360px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/60 p-4 font-sans text-sm leading-6 text-zinc-100">
          {pack.codexMvpPrompt}
        </pre>
      </details>
    </section>
  );
}

function BusinessControlSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="min-w-0 text-[11px] font-black uppercase tracking-wide text-zinc-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm font-bold text-white"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function BusinessStartPackOutput({ title, value }: { title: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-[11px] font-black uppercase tracking-wide text-emerald-300">
        {title}
      </div>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">
        {value}
      </p>
    </div>
  );
}

function ProUpgradeCard({ onUnlockClick }: { onUnlockClick: () => void }) {
  return (
    <section className="mb-5 rounded-2xl border border-white/10 bg-black/30 p-4 md:rounded-3xl md:p-5">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Bilion Pro
          </div>
          <h3 className="mt-2 break-words text-2xl font-black text-white">
            Want five more?
          </h3>
          <p className="mt-2 max-w-2xl break-words text-sm font-bold leading-6 text-zinc-400">
            Never run out of Money Moves. Keep discovering proven opportunities until one catches your eye.
          </p>
          <div className="mt-4 grid gap-2 text-sm font-bold leading-6 text-zinc-300 md:grid-cols-2">
            <span>Unlimited discovery</span>
            <span>Unlimited Try This</span>
            <span>More versions when one catches your eye</span>
            <span>Save tests and winning moves</span>
          </div>
        </div>
        <div className="w-full shrink-0 rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.08] p-4 lg:w-72">
          <div className="text-sm font-black text-white">Early access: $9.99/month</div>
          <a
            href={CHECKOUT_URL || "/founder"}
            onClick={onUnlockClick}
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-300 px-5 py-3 text-center text-sm font-black text-black transition hover:bg-emerald-200"
          >
            Unlock unlimited Money Moves
          </a>
          <p className="mt-3 text-xs font-bold leading-5 text-zinc-400">
            Find a winner faster by testing more proven signals, not by generating random ideas.
          </p>
        </div>
      </div>
    </section>
  );
}

function MoneyMoveAngleExpander({ signal }: { signal: BuildSignal }) {
  const { angles, detail, metadata, offerFields } = buildMoneyMoveAngles(signal);
  const [selectedModes, setSelectedModes] = useState<Record<string, AngleOutputMode>>({});
  const [copiedAngleId, setCopiedAngleId] = useState("");

  async function copyAngle(angle: MoneyMoveAngle, mode: AngleOutputMode) {
    const output = [
      `${angle.title}`,
      "",
      `Hook: ${angle.hook}`,
      "",
      buildAngleOutput(angle, mode, detail, metadata, offerFields),
      "",
      `Next action: ${angle.nextAction}`,
    ].join("\n");
    const didCopy = await writeClipboardText(output);

    setCopiedAngleId(didCopy ? `${angle.id}-${mode}` : "");
    window.setTimeout(() => setCopiedAngleId(""), 1200);
  }

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 md:rounded-3xl md:p-5">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Money Move Angle Expander
          </div>
          <h3 className="mt-1 break-words text-lg font-black text-white">
            Turn one Money Move into multiple testable directions.
          </h3>
          <p className="mt-2 max-w-2xl break-words text-sm font-bold leading-6 text-zinc-400">
            Money Move first. Product second. Build only after replies.
          </p>
        </div>
        <div className="grid min-w-0 gap-2 text-[11px] font-black uppercase tracking-wide text-zinc-500 sm:grid-cols-2 lg:w-[360px]">
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2">
            Offer: {metadata.offerType}
          </span>
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2">
            Pain: {metadata.painType}
          </span>
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2">
            Channel: {metadata.distributionChannel}
          </span>
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-2">
            Asset: {metadata.proofAssetType}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4">
        <div className="text-[11px] font-black uppercase tracking-wide text-emerald-300">
          Clean first offer
        </div>
        <div className="mt-2 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div className="min-w-0">
            <div className="text-[11px] font-black uppercase tracking-wide text-zinc-600">
              First offer
            </div>
            <p className="mt-1 break-words text-sm font-black text-white">
              {offerFields.firstOfferName}
            </p>
            <p className="mt-1 break-words text-xs font-bold leading-5 text-zinc-400">
              {offerFields.offerDescription}
            </p>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-black uppercase tracking-wide text-zinc-600">
              What you deliver
            </div>
            <ul className="mt-1 space-y-1 text-xs font-bold leading-5 text-zinc-300">
              {offerFields.deliverables.map((deliverable) => (
                <li key={deliverable}>- {deliverable}</li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-black uppercase tracking-wide text-zinc-600">
              Price
            </div>
            <p className="mt-1 whitespace-nowrap text-sm font-black text-white">
              {offerFields.price}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {angles.map((angle) => {
          const selectedMode = selectedModes[angle.id] || angle.defaultMode;
          const output = buildAngleOutput(angle, selectedMode, detail, metadata, offerFields);
          const copied = copiedAngleId === `${angle.id}-${selectedMode}`;

          return (
            <article
              key={angle.id}
              className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-4"
            >
              <div className="text-[11px] font-black uppercase tracking-wide text-emerald-300">
                {angle.title}
              </div>
              <h4 className="mt-2 break-words text-base font-black text-white">
                {angle.hook}
              </h4>
              <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3">
                <div className="text-[11px] font-black uppercase tracking-wide text-zinc-600">
                  Angle output
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">
                  {angle.output}
                </p>
              </div>
              <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-3">
                <div className="text-[11px] font-black uppercase tracking-wide text-emerald-300">
                  Turn into
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {angleOutputModes.map((mode) => {
                    const active = selectedMode === mode;

                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setSelectedModes((currentModes) => ({
                            ...currentModes,
                            [angle.id]: mode,
                          }))
                        }
                        className={[
                          "rounded-full border px-3 py-2 text-xs font-black transition",
                          active
                            ? "border-emerald-300 bg-emerald-300 text-black"
                            : "border-white/10 bg-black/25 text-zinc-400 hover:border-white/20 hover:text-white",
                        ].join(" ")}
                      >
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>
              <pre className="mt-3 max-h-[300px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/60 p-4 font-sans text-sm leading-6 text-zinc-100">
                {output}
              </pre>
              <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-words text-xs font-bold leading-5 text-zinc-400">
                  Next action: {angle.nextAction}
                </p>
                <button
                  type="button"
                  onClick={() => copyAngle(angle, selectedMode)}
                  className="w-full rounded-xl bg-white px-4 py-2.5 text-center text-xs font-black text-black transition hover:bg-zinc-200 sm:w-auto"
                >
                  {copied ? "Copied" : "Copy angle"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CompactSignalField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-black uppercase tracking-wide text-zinc-600">
        {label}
      </div>
      <p className="mt-1 line-clamp-2 break-words text-xs font-bold leading-5 text-zinc-300">
        {normalizeDisplayText(value)}
      </p>
    </div>
  );
}

function MarketOpportunityField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="break-words text-[11px] font-black uppercase tracking-wide text-zinc-600">
        {label}
      </div>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">
        {normalizeDisplayText(value)}
      </p>
    </div>
  );
}

function PreferencePanel({
  buyerPreference,
  dailyGoal,
  monetizationPreference,
  onBuyerPreferenceChange,
  onDailyGoalChange,
  onMonetizationPreferenceChange,
}: {
  buyerPreference: BuyerPreference;
  dailyGoal: DailyGoal;
  monetizationPreference: MonetizationPreference;
  onBuyerPreferenceChange: (value: BuyerPreference) => void;
  onDailyGoalChange: (value: DailyGoal) => void;
  onMonetizationPreferenceChange: (value: MonetizationPreference) => void;
}) {
  return (
    <section className="mb-5 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
        Personalize today
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <PreferenceChoiceGroup
          label="What do you want to achieve today?"
          options={dailyGoalOptions}
          selected={dailyGoal}
          onSelect={onDailyGoalChange}
        />
        <PreferenceChoiceGroup
          label="Who do you want to sell to?"
          options={buyerPreferenceOptions}
          selected={buyerPreference}
          onSelect={onBuyerPreferenceChange}
        />
        <PreferenceChoiceGroup
          label="How do you want to monetize?"
          options={monetizationPreferenceOptions}
          selected={monetizationPreference}
          onSelect={onMonetizationPreferenceChange}
        />
      </div>
    </section>
  );
}

function PreferenceChoiceGroup<T extends string>({
  label,
  onSelect,
  options,
  selected,
}: {
  label: string;
  onSelect: (value: T) => void;
  options: T[];
  selected: T;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-black uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={[
                "rounded-full border px-3 py-2 text-xs font-black transition",
                active
                  ? "border-emerald-300 bg-emerald-300 text-black"
                  : "border-white/10 bg-black/25 text-zinc-400 hover:border-white/20 hover:text-white",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TransformStudio({
  canAddToQueue,
  hasFounderAccess,
  onAddToQueue,
  onSave,
  onTransformChange,
  onUnlockProClick,
  output,
  selectedTransform,
  trackingPayload,
  transformAllowed,
  wasSaved,
}: {
  canAddToQueue: boolean;
  hasFounderAccess: boolean;
  onAddToQueue: () => void;
  onSave: () => void;
  onTransformChange: (value: TransformType) => void;
  onUnlockProClick: () => void;
  output: string;
  selectedTransform: TransformType;
  trackingPayload: BilionIntentEventPayload;
  transformAllowed: boolean;
  wasSaved: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const primaryTransforms = transformOptions.slice(0, 3);
  const secondaryTransforms = transformOptions.slice(3);

  async function copyOutput() {
    if (!transformAllowed) {
      return;
    }

    const didCopy = await writeClipboardText(output);

    if (didCopy) {
      if (selectedTransform === "X Post") {
        trackBilionIntentEvent("copy_x_post", trackingPayload);
      }

      if (selectedTransform === "Buyer DM") {
        trackBilionIntentEvent("copy_buyer_dm", trackingPayload);
      }

      if (selectedTransform === "Codex Prompt") {
        trackBilionIntentEvent("copy_codex_prompt", trackingPayload);
      }
    }

    setCopied(didCopy);
    setCopyError(!didCopy);
    window.setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, 1200);
  }

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Turn this signal into launch assets
          </div>
          <h3 className="mt-1 break-words text-lg font-black text-white">
            Convert today&apos;s move into a post, DM, prompt, or validation asset.
          </h3>
          <p className="mt-1 break-words text-sm font-bold leading-6 text-zinc-400">
            Build only after replies.
          </p>
        </div>
        {!hasFounderAccess && (
          <a
            href={CHECKOUT_URL || "/founder"}
            onClick={onUnlockProClick}
            className="w-full rounded-2xl border border-emerald-300/30 px-4 py-3 text-center text-xs font-black text-emerald-100 transition hover:bg-emerald-300/10 sm:w-auto"
          >
            Unlock Bilion Pro
          </a>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {primaryTransforms.map((transform) => {
          const active = selectedTransform === transform;
          const locked =
            !hasFounderAccess &&
            transform !== "X Post" &&
            transform !== "Buyer DM" &&
            transform !== "Codex Prompt";

          return (
            <button
              key={transform}
              type="button"
              onClick={() => onTransformChange(transform)}
              className={[
                "min-w-0 rounded-2xl border px-3 py-3 text-left text-xs font-black transition",
                active
                  ? "border-emerald-300/70 bg-emerald-300/[0.12] text-white"
                  : "border-white/10 bg-black/30 text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                locked ? "opacity-60" : "",
              ].join(" ")}
            >
              {transform}
              {locked && <span className="ml-2 text-zinc-600">Pro</span>}
            </button>
          );
        })}
      </div>
      <details className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3">
        <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-wide text-zinc-500">
          More launch asset formats
        </summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {secondaryTransforms.map((transform) => {
            const active = selectedTransform === transform;
            const locked = !hasFounderAccess;

            return (
              <button
                key={transform}
                type="button"
                onClick={() => onTransformChange(transform)}
                className={[
                  "min-w-0 rounded-2xl border px-3 py-3 text-left text-xs font-black transition",
                  active
                    ? "border-emerald-300/70 bg-emerald-300/[0.12] text-white"
                    : "border-white/10 bg-black/30 text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                  locked ? "opacity-60" : "",
                ].join(" ")}
              >
                {transform}
                {locked && <span className="ml-2 text-zinc-600">Pro</span>}
              </button>
            );
          })}
        </div>
      </details>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-black text-white">{selectedTransform}</div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={copyOutput}
              disabled={!transformAllowed}
              className="w-full rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!transformAllowed}
              className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-xs font-black text-zinc-200 transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {wasSaved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={onAddToQueue}
              disabled={!transformAllowed || !canAddToQueue}
              className="w-full rounded-xl border border-emerald-300/30 px-4 py-2.5 text-xs font-black text-emerald-100 transition hover:bg-emerald-300/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Save to My Tests
            </button>
          </div>
        </div>
        {!transformAllowed && (
          <p className="mt-3 text-sm font-bold leading-6 text-yellow-100">
            Free users get today&apos;s best Money Move. Pro users can test more signals and find winners faster.
          </p>
        )}
        {!canAddToQueue && transformAllowed && (
          <p className="mt-3 text-sm font-bold leading-6 text-yellow-100">
            Free users get today&apos;s best Money Move. Pro users can test more signals and find winners faster.
          </p>
        )}
        {copyError && (
          <p className="mt-3 text-sm font-bold leading-6 text-yellow-100">
            Clipboard blocked. Select the output and copy manually.
          </p>
        )}
        <pre className="mt-3 max-h-[420px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/60 p-4 font-sans text-sm leading-6 text-zinc-100">
          {transformAllowed
            ? output
            : "Free users get today's best Money Move. Pro users can test more signals, generate every launch asset, remix offers, and save winners faster."}
        </pre>
      </div>
    </section>
  );
}

function RemixEngine({
  onRemixChange,
  remixOutput,
  selectedRemix,
}: {
  onRemixChange: (value: RemixType) => void;
  remixOutput: string;
  selectedRemix: RemixType;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
        Remix this signal
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {remixOptions.map((remix) => (
          <button
            key={remix}
            type="button"
            onClick={() => onRemixChange(remix)}
            className={[
              "rounded-full border px-3 py-2 text-xs font-black transition",
              selectedRemix === remix
                ? "border-emerald-300 bg-emerald-300 text-black"
                : "border-white/10 bg-black/25 text-zinc-400 hover:border-white/20 hover:text-white",
            ].join(" ")}
          >
            {remix}
          </button>
        ))}
      </div>
      <pre className="mt-4 max-h-[320px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/60 p-4 font-sans text-sm leading-6 text-zinc-100">
        {remixOutput}
      </pre>
    </section>
  );
}

function ValidationQueuePanel({
  hasFounderAccess,
  onItemChange,
  onMarkWinner,
  onStatusChange,
  queue,
}: {
  hasFounderAccess: boolean;
  onItemChange: (itemId: string, updates: Partial<ValidationQueueItem>) => void;
  onMarkWinner: (itemId: string) => void;
  onStatusChange: (itemId: string, status: ValidationQueueStatus) => void;
  queue: ValidationQueueItem[];
}) {
  function updateNumber(itemId: string, field: keyof Pick<ValidationQueueItem, "views" | "likes" | "saves" | "replies" | "dms" | "paidInterest">, value: string) {
    onItemChange(itemId, {
      [field]: Math.max(0, Number(value) || 0),
    } as Partial<ValidationQueueItem>);
  }

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            My Tests
          </div>
          <p className="mt-1 break-words text-sm font-bold leading-6 text-zinc-400">
            Save your business, post it, DM buyers, log results, then decide Build or Drop.
          </p>
        </div>
        {!hasFounderAccess && (
          <div className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs font-black text-zinc-400">
            Free queue: 2 items
          </div>
        )}
      </div>

      {queue.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4 text-sm font-bold leading-6 text-zinc-500">
          Save your business to track results.
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {queue.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-wide text-emerald-300">
                    {item.outputType}
                  </div>
                  <h4 className="mt-1 break-words text-sm font-black text-white">
                    {item.signalTitle}
                  </h4>
                  <p className="mt-1 break-words text-xs font-bold leading-5 text-zinc-500">
                    {item.buyer} / {item.offer}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto">
                  <select
                    value={item.status}
                    onChange={(event) =>
                      onStatusChange(item.id, event.target.value as ValidationQueueStatus)
                    }
                    className="min-h-10 rounded-xl border border-white/10 bg-black px-3 py-2 text-xs font-black text-zinc-200"
                  >
                    {validationQueueStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => onStatusChange(item.id, "Posted")}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-zinc-200 transition hover:bg-white/[0.04]"
                  >
                    Mark as Posted
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-3">
                <div className="text-[11px] font-black uppercase tracking-wide text-emerald-300">
                  Results
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {([
                    ["views", "Views"],
                    ["likes", "Likes"],
                    ["saves", "Saves"],
                    ["replies", "Replies"],
                    ["dms", "DMs"],
                    ["paidInterest", "Paid interest"],
                  ] as const).map(([field, label]) => (
                    <label key={field} className="min-w-0 text-[11px] font-black uppercase tracking-wide text-zinc-500">
                      {label}
                      <input
                        type="number"
                        min={0}
                        value={item[field]}
                        onChange={(event) => updateNumber(item.id, field, event.target.value)}
                        className="mt-1 min-h-10 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm font-black text-white"
                      />
                    </label>
                  ))}
                </div>
                <label className="mt-3 block text-[11px] font-black uppercase tracking-wide text-zinc-500">
                  Notes
                  <textarea
                    value={item.notes}
                    onChange={(event) => onItemChange(item.id, { notes: event.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm font-bold leading-6 text-white"
                    placeholder="Objections, buyer words, pricing signals..."
                  />
                </label>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-black text-zinc-100">
                  {getValidationRecommendation(item)}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => onStatusChange(item.id, "Got Replies")}
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-zinc-200 transition hover:bg-white/[0.04]"
                >
                  Log Results
                </button>
                <button
                  type="button"
                  onClick={() => onMarkWinner(item.id)}
                  className="rounded-xl border border-emerald-300/35 px-3 py-2 text-xs font-black text-emerald-100 transition hover:bg-emerald-300/10"
                >
                  Mark Winning Move
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(item.id, "Build")}
                  className="rounded-xl bg-emerald-300 px-3 py-2 text-xs font-black text-black transition hover:bg-emerald-200"
                >
                  Build with Codex
                </button>
              </div>

              <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-zinc-400 sm:grid-cols-2">
                <span className="font-black text-emerald-200">
                  Next action: {getValidationQueueNextAction(item.status)}
                </span>
                <span>Checklist: 3+ replies</span>
                <span>1+ buyer asks for details</span>
                <span>1+ person says they want it</span>
                <span>Kill if no buyer-specific replies</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function WinnerPanel({ winners }: { winners: ValidationQueueItem[] }) {
  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
        Winning Moves
      </div>
      <p className="mt-2 break-words text-sm font-bold leading-6 text-zinc-400">
        Moves that got real response belong here. A Winning Move unlocks the full build plan: landing page copy, pricing page copy, next 3 posts, follow-up DM, and the Codex MVP prompt after proof.
      </p>
      {winners.length === 0 ? (
        <p className="mt-3 text-sm font-bold leading-6 text-zinc-500">
          No winning moves yet. Mark one after replies, saves, clicks, or buyer interest.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {winners.map((winner) => (
            <article key={winner.id} className="rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.06] p-4">
              <div className="text-xs font-black uppercase tracking-wide text-emerald-300">
                Winning Move
              </div>
              <h4 className="mt-2 break-words text-sm font-black text-white">
                {winner.signalTitle}
              </h4>
              <p className="mt-2 break-words text-xs font-bold leading-5 text-zinc-300">
                Buyer: {winner.buyer}
              </p>
              <p className="mt-1 break-words text-xs font-bold leading-5 text-zinc-300">
                Offer: {winner.offer}
              </p>
              <p className="mt-3 break-words text-xs font-bold leading-5 text-zinc-400">
                Winning output: {winner.outputType}
              </p>
              <div className="mt-3 grid gap-2 text-xs font-black text-zinc-200 sm:grid-cols-2">
                <span className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">Full build plan</span>
                <span className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">Codex MVP Prompt</span>
                <span className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">Landing + pricing copy</span>
                <span className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">Next 3 posts + follow-up DM</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function BuildBriefPanel({
  codexBuildPrompt,
  detail,
  signalTitle,
}: {
  codexBuildPrompt: string;
  detail: ReturnType<typeof getOpportunityDetailFields>;
  signalTitle: string;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copyCodexPrompt() {
    const didCopy = await writeClipboardText(codexBuildPrompt);

    setCopied(didCopy);
    setCopyError(!didCopy);
    window.setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, 1200);
  }

  return (
    <section className="mt-4 rounded-2xl border border-emerald-300/30 bg-[#101011] p-4 shadow-2xl md:p-5">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Launch assets generated
          </div>
          <h3 className="mt-1 break-words text-lg font-black text-white">
            {truncateDisplayText(signalTitle, 96)}
          </h3>
          <p className="mt-1 break-words text-sm font-bold leading-6 text-zinc-200">
            Start with the offer, buyer message, and validation plan. Use the Codex prompt only after replies, saves, clicks, or buyer interest.
          </p>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
        <MarketOpportunityField label="1. Money Proof" value={detail.proof} />
        <MarketOpportunityField label="2. Target Buyer" value={detail.buyer} />
        <MarketOpportunityField label="3. Paid Pain" value={detail.paidPain} />
        <MarketOpportunityField label="4. First Tiny Product" value={detail.firstOffer} />
        <MarketOpportunityField label="5. Validation Plan" value={detail.fortyEightHourTest} />
        <MarketOpportunityField label="6. Build Later Scope" value={detail.buildAfterReplies} />
      </div>

      <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.08] px-4 py-3 text-sm font-bold leading-6 text-yellow-100">
        Build only after replies, saves, clicks, or buyer interest. Use Codex after proof.
      </div>

      <details className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
        <summary className="cursor-pointer list-none">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                Codex-ready prompt
              </div>
              <p className="mt-1 text-sm font-bold leading-6 text-zinc-300">
                Open this after the offer gets replies.
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-2 text-xs font-black text-zinc-300">
              Build later
            </span>
          </div>
        </summary>
        <button
          type="button"
          onClick={copyCodexPrompt}
          className="mt-4 w-full rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-black transition hover:bg-zinc-200 sm:w-auto"
        >
          {copied ? "Copied MVP Prompt" : "Copy Codex MVP Prompt"}
        </button>
        {copyError && (
          <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-100">
            Clipboard blocked. Select the prompt and copy manually.
          </div>
        )}
        <pre className="mt-4 max-h-[420px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/50 p-4 font-sans text-sm leading-6 text-zinc-100">
          {codexBuildPrompt}
        </pre>
      </details>

      <div className="mt-4">
        <MarketOpportunityField
          label="What Not To Build"
          value="Do not build a full platform, marketplace, account system, analytics suite, payment flow, or external API integration first. Start with the smallest MVP that proves the buyer wants this workflow solved."
        />
      </div>
    </section>
  );
}

function SignalInboxSection({
  approvedCount,
  candidate,
  candidateCount,
  onApprove,
  onClear,
  onExtract,
  onReject,
  rawCount,
}: {
  approvedCount: number;
  candidate?: CandidateMoneySignal;
  candidateCount: number;
  onApprove: (candidate: CandidateMoneySignal) => void;
  onClear: () => void;
  onExtract: (rawInput: string, sourceType: string) => void;
  onReject: (candidateId: string) => void;
  rawCount: number;
}) {
  const [rawInput, setRawInput] = useState("");
  const [sourceType, setSourceType] = useState("Gmail/newsletter");

  function handleExtract() {
    onExtract(rawInput, sourceType);
  }

  function handleClear() {
    setRawInput("");
    onClear();
  }

  return (
    <section className="mt-4 w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4 md:rounded-3xl md:p-5">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Signal Inbox
          </div>
          <h3 className="mt-1 break-words text-lg font-black text-white md:text-xl">
            Paste a startup story, newsletter, Gmail text, or founder revenue signal.
          </h3>
          <p className="mt-2 max-w-2xl break-words text-sm leading-relaxed text-zinc-400">
            Bilion turns it into today&apos;s offer before you build.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-400">
            {rawCount} raw
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-400">
            {candidateCount} candidates
          </span>
          <span className="rounded-full border border-emerald-300/25 bg-emerald-300/[0.08] px-2 py-1 text-emerald-200">
            {approvedCount} approved
          </span>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101011] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <label
              className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500"
              htmlFor="signal-inbox-raw-input"
            >
              Raw text
            </label>
            <label className="text-xs font-bold text-zinc-500">
              Source
              <select
                value={sourceType}
                onChange={(event) => setSourceType(event.target.value)}
                className="mt-1 block min-h-10 rounded-xl border border-white/10 bg-black px-3 py-2 text-xs font-bold text-zinc-200"
              >
                {[
                  "Gmail/newsletter",
                  "Indie Hackers",
                  "Starter Story",
                  "X post",
                  "YouTube transcript",
                  "Founder story",
                ].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            id="signal-inbox-raw-input"
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
            placeholder={[
              "Paste the raw signal here.",
              "Example: a founder story with revenue, paid users, customers, pricing, launch result, buyer, or repeated pain.",
            ].join("\n")}
            className="mt-3 min-h-48 w-full min-w-0 resize-y rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/50"
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="break-words text-xs font-bold leading-5 text-zinc-600">
              Manual paste only. No Gmail API, OAuth, external API, database, or server extraction.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleClear}
                className="min-h-11 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-black text-zinc-400 transition hover:border-white/20 hover:text-white"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleExtract}
                className="min-h-11 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-black text-black transition hover:bg-emerald-200"
              >
                Extract Money Move
              </button>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101011] p-4">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            Candidate Preview
          </div>
          {candidate ? (
            <>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-400">
                  {candidate.market}
                </span>
                <span className="rounded-full border border-emerald-300/25 bg-emerald-300/[0.08] px-2 py-1 text-emerald-200">
                  Score {candidate.score}/95
                </span>
                <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-zinc-400">
                  {candidate.confidence} confidence
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                <MarketOpportunityField label="Market" value={candidate.market} />
                <MarketOpportunityField label="Source" value={candidate.source} />
                <MarketOpportunityField label="Money proof" value={candidate.proof} />
                <MarketOpportunityField
                  label="What money moved"
                  value={candidate.whatMoneyMoved}
                />
                <MarketOpportunityField label="Buyer" value={candidate.buyer} />
                <MarketOpportunityField label="Paid pain" value={candidate.paidPain} />
                <MarketOpportunityField label="First offer" value={candidate.firstOffer} />
                <MarketOpportunityField
                  label="Missing fields"
                  value={
                    candidate.missingFields.length
                      ? candidate.missingFields.join(", ")
                      : "None"
                  }
                />
                <MarketOpportunityField
                  label="Extraction notes"
                  value={candidate.extractionNotes}
                />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onApprove(candidate)}
                  className="min-h-11 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-black text-black transition hover:bg-emerald-200"
                >
                  Approve to Money Moves
                </button>
                <button
                  type="button"
                  onClick={() => onReject(candidate.id)}
                  className="min-h-11 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-black text-zinc-400 transition hover:border-red-300/30 hover:text-red-200"
                >
                  Reject
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-500">
              No candidate yet. Paste raw text and extract a Money Move before approving it.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EvidenceIntakeSection({
  approvedCount,
  drafts,
  onApprove,
  onImport,
  onReject,
}: {
  approvedCount: number;
  drafts: EvidenceDraft[];
  onApprove: (draft: EvidenceDraft) => void;
  onImport: (rawInput: string, sourceType: string) => void;
  onReject: (draftId: string) => void;
}) {
  const [rawInput, setRawInput] = useState("");
  const [sourceType, setSourceType] = useState("Gmail/newsletter");

  function handleImport() {
    onImport(rawInput, sourceType);
    setRawInput("");
  }

  return (
    <details className="mt-4 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
              Evidence Paste Importer
            </div>
            <h3 className="mt-1 text-lg font-black text-white">
              Paste market proof. Review it before it becomes a signal.
            </h3>
          </div>
          <div className="text-xs font-bold text-zinc-500">
            {drafts.length} drafts / {approvedCount} approved
          </div>
        </div>
      </summary>

      <div className="mt-4 grid gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#101011] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <label
              className="text-xs font-black uppercase tracking-[0.14em] text-emerald-300"
              htmlFor="evidence-paste-input"
            >
              Bulk paste mode
            </label>
            <label className="text-xs font-bold text-zinc-500">
              Source type
              <select
                value={sourceType}
                onChange={(event) => setSourceType(event.target.value)}
                className="mt-1 block rounded-xl border border-white/10 bg-black px-3 py-2 text-xs font-bold text-zinc-200"
              >
                {[
                  "Gmail/newsletter",
                  "Indie Hackers",
                  "YouTube transcript",
                  "X post",
                  "GitHub README/Issue",
                  "Article",
                ].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Paste Gmail, Indie Hackers, YouTube transcript, X post, GitHub issue, README, or article notes.
            Separate multiple snippets with a line containing three hyphens. Prioritize money evidence: revenue, MRR, ARR, paid customers, price,
            buyer behavior, distribution, and repeatable workflow.
          </p>
          <textarea
            id="evidence-paste-input"
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
            placeholder={[
              "Market: Local business reviews",
              "Buyer: clinic owners",
              "Paid pain: unanswered reviews hurt trust and leads",
              "Price: $29/month",
              "Revenue evidence: reputation tools and agencies already charge for review management",
              "---",
              "Paste another evidence snippet here",
            ].join("\n")}
            className="mt-3 min-h-44 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/50"
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold text-zinc-600">
              Local mock conversion only. No external API, database, or app route changes.
            </p>
            <button
              type="button"
              onClick={handleImport}
              className="rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-black text-black transition hover:bg-emerald-200"
            >
              Create Evidence Drafts
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
              Evidence Draft Review
            </div>
            <div className="text-xs font-bold text-zinc-600">
              Approve records to add them to Signal Library and Evidence Inbox.
            </div>
          </div>

          {drafts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-500">
              No drafts yet. Paste one or more snippets to create reviewable market evidence.
            </div>
          ) : (
            drafts.map((draft) => (
              <EvidenceDraftCard
                key={draft.id}
                draft={draft}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))
          )}
        </div>
      </div>
    </details>
  );
}

function EvidenceDraftCard({
  draft,
  onApprove,
  onReject,
}: {
  draft: EvidenceDraft;
  onApprove: (draft: EvidenceDraft) => void;
  onReject: (draftId: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#101011] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide">
            <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-zinc-400">
              {draft.evidenceLevel} evidence
            </span>
            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/[0.08] px-2 py-1 text-emerald-200">
              Score {draft.opportunityScore}/100
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-zinc-400">
              {draft.recommendedUse.replaceAll("_", " ")}
            </span>
          </div>
          <h4 className="mt-3 text-lg font-black text-white">{draft.product}</h4>
          <p className="mt-1 text-sm leading-6 text-zinc-500">{draft.market}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onApprove(draft)}
            className="rounded-xl bg-emerald-300 px-3 py-2 text-xs font-black text-black transition hover:bg-emerald-200"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => onReject(draft.id)}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-zinc-400 transition hover:border-red-300/30 hover:text-red-200"
          >
            Reject
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <EvidenceDraftField label="Buyer" value={draft.buyer} />
        <EvidenceDraftField label="Source type" value={draft.sourceType || "Raw Paste"} />
        <EvidenceDraftField label="Paid pain" value={draft.paidPain} />
        <EvidenceDraftField label="Offer" value={draft.offer} />
        <EvidenceDraftField label="Price" value={draft.price} />
        <EvidenceDraftField label="Revenue evidence" value={draft.revenueEvidence} />
        <EvidenceDraftField label="Source evidence" value={draft.sourceEvidence} />
        <EvidenceDraftField label="Distribution channel" value={draft.distributionChannel} />
        <EvidenceDraftField label="Lead magnet" value={draft.leadMagnet} />
        <EvidenceDraftField label="Why it worked" value={draft.whyItWorked} />
        <EvidenceDraftField label="Adaptation idea" value={draft.adaptationIdea} />
      </div>
      <div className="mt-3">
        <EvidenceDraftField label="Launch pack seed" value={draft.launchPackSeed} />
      </div>
    </article>
  );
}

function EvidenceDraftField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="text-[11px] font-black uppercase tracking-wide text-zinc-600">
        {label}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
        {normalizeDisplayText(value)}
      </p>
    </div>
  );
}

function DistributionQueueSection({
  canSaveAssets,
  onSaveAssets,
  onStatusChange,
  queue,
}: {
  canSaveAssets: boolean;
  onSaveAssets: () => void;
  onStatusChange: (assetId: string, status: DistributionStatus) => void;
  queue: DistributionAsset[];
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Distribution Queue
          </div>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            Move validation assets into the queue.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Save the X post, DM script, validation log, and short video angle from the Build Brief.
            No scheduling or external posting.
          </p>
        </div>
        <button
          type="button"
          onClick={onSaveAssets}
          disabled={!canSaveAssets}
          className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save assets from current brief
        </button>
      </div>

      {queue.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
          Try a Money Move, then save launch assets here.
        </div>
      ) : (
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {queue.map((asset) => (
            <article
              key={asset.id}
              className="rounded-2xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-emerald-300">
                    {asset.kind}
                  </div>
                  <h3 className="mt-2 text-lg font-black text-white">{asset.title}</h3>
                  <p className="mt-1 text-xs font-bold text-zinc-500">
                    {asset.signalTitle} / {asset.buyer}
                  </p>
                </div>
                <select
                  value={asset.status}
                  onChange={(event) =>
                    onStatusChange(asset.id, event.target.value as DistributionStatus)
                  }
                  className="rounded-xl border border-white/10 bg-black px-3 py-2 text-xs font-bold text-zinc-200"
                >
                  {[
                    "Not tested",
                    "Posted",
                    "DM sent",
                    "Got replies",
                    "Winner",
                    "Rejected",
                  ].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                {asset.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SecondaryToolsSection({
  canSaveAssets,
  copiedSignalId,
  distributionQueue,
  hasFounderAccess,
  onAddValidationRecord,
  onCopySavedPrompt,
  onDeleteSavedSignal,
  onMarkWinner,
  onSaveDistributionAssets,
  onUpdateDistributionStatus,
  onUpdateValidationRecord,
  onViewSavedSignal,
  savedSignals,
  validationRecords,
}: {
  canSaveAssets: boolean;
  copiedSignalId: string;
  distributionQueue: DistributionAsset[];
  hasFounderAccess: boolean;
  onAddValidationRecord: () => void;
  onCopySavedPrompt: (signal: SavedSignal) => void;
  onDeleteSavedSignal: (signalId: string) => void;
  onMarkWinner: (recordId: string) => void;
  onSaveDistributionAssets: () => void;
  onUpdateDistributionStatus: (assetId: string, status: DistributionStatus) => void;
  onUpdateValidationRecord: (
    recordId: string,
    updates: Partial<ValidationRecord>,
  ) => void;
  onViewSavedSignal: (signal: SavedSignal) => void;
  savedSignals: SavedSignal[];
  validationRecords: ValidationRecord[];
}) {
  const [archiveOpen, setArchiveOpen] = useState(false);

  return (
    <section className="mt-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-4">
      <details
        open={archiveOpen}
        onToggle={(event) => setArchiveOpen(event.currentTarget.open)}
      >
        <summary className="cursor-pointer list-none rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-4">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            Advanced / Archive
          </div>
          <h2 className="mt-2 text-xl font-black text-zinc-200">
            Saved prompts, validation tracker, winners, and showcase examples.
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Open archive
          </p>
        </summary>

        {archiveOpen && (
        <div className="mt-4 grid gap-4">
          <details className="rounded-2xl border border-white/[0.08] bg-black/20 p-3">
            <summary className="cursor-pointer list-none text-sm font-black text-zinc-300">
              Workflow note
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Money Move - Your Business - Launch Assets - Replies - Build with Codex.
            </p>
          </details>

          <DistributionQueueSection
            canSaveAssets={canSaveAssets}
            queue={distributionQueue}
            onSaveAssets={onSaveDistributionAssets}
            onStatusChange={onUpdateDistributionStatus}
          />

          <ValidationTrackerSection
            records={validationRecords}
            onAddRecord={onAddValidationRecord}
            onMarkWinner={onMarkWinner}
            onUpdateRecord={onUpdateValidationRecord}
          />

          <WinnersSection records={validationRecords} onMarkWinner={onMarkWinner} />

          <SavedSignalsSection
            hasFounderAccess={hasFounderAccess}
            copiedSignalId={copiedSignalId}
            onCopyPrompt={onCopySavedPrompt}
            onDelete={onDeleteSavedSignal}
            onView={onViewSavedSignal}
            savedSignals={savedSignals}
          />

          <InlineShowcaseSection />
        </div>
        )}
      </details>
    </section>
  );
}

function ValidationTrackerSection({
  onAddRecord,
  onMarkWinner,
  onUpdateRecord,
  records,
}: {
  onAddRecord: () => void;
  onMarkWinner: (recordId: string) => void;
  onUpdateRecord: (recordId: string, updates: Partial<ValidationRecord>) => void;
  records: ValidationRecord[];
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Validation Tracker
          </div>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            Track replies before you build.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Manually log DMs, replies, interest, clicks, objections, and verdict.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddRecord}
          className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-zinc-200"
        >
          Add validation record
        </button>
      </div>

      {records.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
          Add a record after you send the first post or DM.
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {records.map((record) => (
            <article
              key={record.id}
              className="rounded-2xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">{record.signalTitle}</h3>
                  <p className="mt-1 text-xs font-bold text-zinc-500">
                    {record.buyer} / {getActionLabel(record.action)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onMarkWinner(record.id)}
                  className="rounded-xl border border-emerald-300/30 px-3 py-2 text-xs font-black text-emerald-200 transition hover:bg-emerald-300/10"
                >
                  Mark Winner
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["DMs sent", "dmsSent"],
                  ["Replies", "replies"],
                  ["Interested", "interested"],
                  ["Clicks", "clicks"],
                ].map(([label, key]) => (
                  <label key={key} className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {label}
                    <input
                      type="number"
                      min={0}
                      value={record[key as keyof ValidationRecord] as number}
                      onChange={(event) =>
                        onUpdateRecord(record.id, {
                          [key]: Math.max(0, Number(event.target.value) || 0),
                        } as Partial<ValidationRecord>)
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_180px]">
                <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Objections
                  <textarea
                    value={record.objections}
                    onChange={(event) =>
                      onUpdateRecord(record.id, { objections: event.target.value })
                    }
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm leading-6 text-white"
                  />
                </label>
                <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Verdict
                  <select
                    value={record.verdict}
                    onChange={(event) =>
                      onUpdateRecord(record.id, {
                        verdict: event.target.value as ValidationVerdict,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white"
                  >
                    {["Build", "Kill", "Pivot"].map((verdict) => (
                      <option key={verdict}>{verdict}</option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function WinnersSection({
  onMarkWinner,
  records,
}: {
  onMarkWinner: (recordId: string) => void;
  records: ValidationRecord[];
}) {
  const winners = records.filter(
    (record) =>
      record.winner ||
      record.replies > 0 ||
      record.interested > 0 ||
      record.verdict === "Build",
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
        Winners
      </div>
      <h2 className="mt-2 break-words text-2xl font-black tracking-tight sm:text-3xl">
        What worked in the market.
      </h2>
      <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-zinc-500">
        Winners are opportunities that earned replies, likes, saves, clicks, DMs, purchases, or a strong manual signal.
        Feed winners back into future market decisions.
      </p>

      {winners.length === 0 ? (
        <div className="mt-6 min-w-0 break-words rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-500 md:p-5">
          No winners yet. Run the loop first: Money Move &rarr; Your Business &rarr; Launch Assets &rarr; Market response &rarr; Winning Move.
        </div>
      ) : (
        <div className="mt-6 grid min-w-0 gap-3 md:grid-cols-2">
          {winners.map((record) => (
            <article
              key={record.id}
              className="min-w-0 overflow-hidden rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.05] p-4"
            >
              <div className="text-xs font-black uppercase tracking-wide text-emerald-300">
                Winner
              </div>
              <h3 className="mt-2 break-words text-lg font-black text-white">{record.signalTitle}</h3>
              <p className="mt-1 break-words text-sm leading-6 text-zinc-400">{record.buyer}</p>
              <div className="mt-4 grid grid-cols-1 gap-2 text-center text-xs font-black text-zinc-300 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                  {record.replies} replies
                </div>
                <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                  {record.interested} interested
                </div>
                <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                  {record.verdict}
                </div>
              </div>
              {!record.winner && (
                <button
                  type="button"
                  onClick={() => onMarkWinner(record.id)}
                  className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-xs font-black text-black transition hover:bg-zinc-200 sm:w-auto"
                >
                  Save as Winner
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function MasterPromptCard({
  angleNumber,
  copied,
  copiedSafe,
  copyFeedback,
  hasFounderAccess,
  masterPrompt,
  onCopy,
  onCopyBrief,
  selectedAction,
  signalNumber,
}: {
  angleNumber: number;
  copied: boolean;
  copiedSafe: boolean;
  copyFeedback: CopyFeedback | null;
  hasFounderAccess: boolean;
  masterPrompt: MasterPrompt;
  onCopy: () => void | Promise<void>;
  onCopyBrief: () => void | Promise<void>;
  selectedAction: NextAction;
  signalNumber: number;
}) {
  const [copiedCarousel, setCopiedCarousel] = useState(false);
  const [copiedLaunchPack, setCopiedLaunchPack] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedDm, setCopiedDm] = useState(false);
  const [carouselCopyError, setCarouselCopyError] = useState(false);
  const opportunityScore = getOpportunityScore(masterPrompt);
  const shortSignalTitle = truncateDisplayText(masterPrompt.provenPattern);
  const shortProductTitle = truncateDisplayText(masterPrompt.promptTitle);
  const oneLineAha = truncateDisplayText(buildHolyShit(masterPrompt), 140);

  async function copyCarouselFromSummary() {
    const copiedText = await writeClipboardText(
      buildCarouselCopy(masterPrompt, hasFounderAccess),
    );

    setCopiedCarousel(copiedText);
    setCarouselCopyError(!copiedText);
    window.setTimeout(() => {
      setCopiedCarousel(false);
      setCarouselCopyError(false);
    }, 1200);
  }

  async function copyLaunchPack() {
    const copiedText = await writeClipboardText(
      buildLaunchPackCopy(masterPrompt, hasFounderAccess),
    );

    setCopiedLaunchPack(copiedText);
    setCarouselCopyError(!copiedText);
    window.setTimeout(() => {
      setCopiedLaunchPack(false);
      setCarouselCopyError(false);
    }, 1200);
  }

  async function copyPostFromSummary() {
    const copiedText = await writeClipboardText(masterPrompt.launchCopy.xPost);

    setCopiedPost(copiedText);
    setCarouselCopyError(!copiedText);
    window.setTimeout(() => {
      setCopiedPost(false);
      setCarouselCopyError(false);
    }, 1200);
  }

  async function copyDmFromSummary() {
    const copiedText = await writeClipboardText(masterPrompt.launchCopy.dmMessage);

    setCopiedDm(copiedText);
    setCarouselCopyError(!copiedText);
    window.setTimeout(() => {
      setCopiedDm(false);
      setCarouselCopyError(false);
    }, 1200);
  }

  return (
    <article className="min-w-0 space-y-5">
      <section className="min-w-0 overflow-hidden rounded-3xl border border-emerald-400/20 bg-[#0f1512] p-5 shadow-2xl md:p-6">
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">
                Today&apos;s Opportunity
              </div>
              <div className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-400">
                Signal #{signalNumber} / Angle #{angleNumber}
              </div>
            </div>
            <h2 className="mt-4 break-words text-3xl font-black tracking-tight md:text-4xl">
              {shortProductTitle}
            </h2>
            <p className="mt-3 break-words text-sm font-bold leading-6 text-emerald-200">
              {shortSignalTitle}
            </p>
            <p className="mt-4 max-w-2xl break-words text-base leading-7 text-zinc-200">
              {oneLineAha}
            </p>
          </div>

          <div className="grid w-full min-w-0 gap-3 sm:grid-cols-3 lg:w-[420px]">
            <button
              type="button"
              onClick={copyPostFromSummary}
              className="w-full rounded-2xl bg-emerald-300 px-5 py-4 text-center text-sm font-black text-black shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-200"
            >
              {copiedPost ? "Copied Post" : "Copy Post"}
            </button>
            <button
              type="button"
              onClick={copyDmFromSummary}
              className="w-full rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-black transition hover:bg-zinc-200"
            >
              {copiedDm ? "Copied DM" : "Copy DM"}
            </button>
            <button
              type="button"
              onClick={copyCarouselFromSummary}
              className="w-full rounded-2xl border border-emerald-300/30 bg-emerald-300/[0.08] px-5 py-4 text-center text-sm font-black text-emerald-100 transition hover:bg-emerald-300/[0.14]"
            >
              {copiedCarousel ? "Copied Carousel" : "Copy Carousel"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-5">
          <SummaryMetric label="Money proof" value={`${opportunityScore.total}/50 spark score`} />
          <SummaryMetric label="Who buys" value={truncateDisplayText(masterPrompt.buyer, 72)} />
          <SummaryMetric label="Paid pain" value={truncateDisplayText(masterPrompt.pain, 72)} />
          <SummaryMetric
            label="Sell this first"
            value={truncateDisplayText(masterPrompt.firstPaidOffer, 80)}
          />
          <SummaryMetric label="Do this in 48h" value={getActionLabel(selectedAction)} />
        </div>

        {(copyFeedback || carouselCopyError) && (
          <div
            className={[
              "mt-5 rounded-2xl border px-4 py-3 text-sm font-bold",
              copyFeedback?.tone === "success" && !carouselCopyError
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                : "border-yellow-400/20 bg-yellow-400/10 text-yellow-100",
            ].join(" ")}
            role="status"
          >
            {carouselCopyError
              ? "Clipboard blocked. Select the carousel text and copy manually."
              : copyFeedback?.message}
          </div>
        )}

        {!hasFounderAccess && (
          <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-yellow-300">
              Free
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              3 free Money Moves per day. See the buyer, pain, first offer, and
              48h test. Bilion Pro unlocks unlimited discovery, saved tests,
              and build-after-replies plans.
            </p>
          </div>
        )}
      </section>

      <details className="rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
        <summary className="cursor-pointer list-none">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            Advanced / Archive
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Why this spark works.
          </h3>
        </summary>
        <button
          type="button"
          onClick={onCopyBrief}
          className="mt-5 w-full rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04] sm:w-auto"
        >
          {copiedSafe ? "Copied Short Brief" : "Copy Short Brief"}
        </button>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <StarterStoryCard label="Why it works" value={buildHolyShit(masterPrompt)} />
          <StarterStoryCard
            label="Buyer"
            value={buildWhatEveryoneMisses(masterPrompt)}
          />
          <StarterStoryCard label="First Offer" value={buildMoneyAngle(masterPrompt)} />
          <StarterStoryCard
            label="Why now"
            value={normalizeDisplayText(masterPrompt.whyItSold)}
          />
        </div>
      </details>

      <details className="rounded-3xl border border-white/10 bg-black/30 p-5 md:p-6">
        <summary className="cursor-pointer list-none">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            Advanced / Carousel
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Optional post assets.
          </h3>
        </summary>
        <CarouselGenerator
          hasFounderAccess={hasFounderAccess}
          masterPrompt={masterPrompt}
        />
      </details>

      <section className="rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
              Build After Replies
            </div>
            <h3 className="mt-2 text-2xl font-black tracking-tight">
              Sell this first. Build after replies.
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Copy the post, carousel, DM pitch, first offer, validation checklist, kill criteria, and Codex prompt gate.
            </p>
          </div>
          <button
            type="button"
            onClick={copyLaunchPack}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
          >
            {copiedLaunchPack ? "Copied Build Brief" : "Copy Build Brief"}
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <MasterPromptField label="Business Pattern" value={masterPrompt.promptTitle} />
          <MasterPromptField label="Why it works" value={masterPrompt.whyItSold} />
          <MasterPromptField label="Buyer" value={masterPrompt.buyer} />
          <MasterPromptField label="Pain" value={masterPrompt.pain} />
          <MasterPromptField label="First Offer" value={`${masterPrompt.firstPaidOffer}\n${masterPrompt.price}`} />
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            48h Test
          </div>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-zinc-100">
            {masterPrompt.validationPlan.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="text-zinc-500">{index + 1}.</span>
                <span>{normalizeDisplayText(step)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <MasterPromptField label="Launch Post" value={masterPrompt.launchCopy.xPost} />
          <MasterPromptField label="DM Script" value={masterPrompt.launchCopy.dmMessage} />
        </div>
      </section>

      <details className="rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
        <summary className="cursor-pointer list-none">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            Codex Build Prompt
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Open this after the carousel or DM gets a reply.
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Build after replies. Use this Codex prompt only after someone replies, clicks, or asks for the offer.
          </p>
        </summary>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <MasterPromptField label="Build summary" value={masterPrompt.firstVersion} />
          <MasterPromptField label="Small wedge" value={masterPrompt.yourProductAngle} />
          <MasterPromptField
            label="Core workflow"
            value={[
              "1. Capture the buyer's input or repeated workflow.",
              "2. Generate the useful output tied to the first paid offer.",
              "3. Let the user copy, save, and reuse the output.",
              "4. Use the result as a demo for the next buyer conversation.",
            ].join("\n")}
          />
          <MasterPromptField
            label="Core features"
            value={masterPrompt.coreFeatures.join("\n")}
          />
        </div>

        {hasFounderAccess ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                Full Codex Build Prompt
              </div>
              <button
                type="button"
                onClick={onCopy}
                className="w-full rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-black transition hover:bg-zinc-200 sm:w-auto"
              >
                {copied ? "Copied Codex prompt" : "Copy Codex Prompt"}
              </button>
            </div>
            <pre className="mt-3 max-h-[520px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/60 p-4 font-sans text-sm leading-6 text-zinc-100">
              {masterPrompt.fullCodeXMasterPrompt}
            </pre>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Codex Build Prompt Preview
            </div>
            <pre className="mt-3 max-h-[260px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/60 p-4 font-sans text-sm leading-6 text-zinc-100">
              {masterPrompt.fullCodeXMasterPrompt.split("\n").slice(0, 12).join("\n")}
            </pre>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Full build-after-replies plan is locked. Bilion Pro unlocks the full Codex prompt after demand is validated.
            </p>
            <a
              href={CHECKOUT_URL || "/founder"}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Unlock Bilion Pro — $9.99/month
            </a>
          </div>
        )}
      </details>

      <details className="rounded-3xl border border-white/10 bg-black/30 p-5 md:p-6">
        <summary className="cursor-pointer list-none">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            Advanced / Archive
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Full brief, exports, proof, and share kit.
          </h3>
        </summary>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <MasterPromptField label="What already sold" value={masterPrompt.provenPattern} />
          <MasterPromptField label="Why it sold" value={masterPrompt.whyItSold} />
          <MasterPromptField label="Who pays" value={masterPrompt.whoPays} />
          <MasterPromptField
            label="Revenue or pricing signal"
            value={masterPrompt.marketProof.revenueOrPricingSignal}
          />
          <MasterPromptField
            label="Similar business / comparable pattern"
            value={masterPrompt.marketProof.comparablePattern}
          />
          <MasterPromptField
            label="Distribution channel that worked"
            value={masterPrompt.marketProof.distributionChannel}
          />
          <MasterPromptField
            label="Evidence strength"
            value={`${masterPrompt.marketProof.evidenceStrength}. ${masterPrompt.marketProof.note}`}
          />
        </div>

        <ActionBriefSection
          action={selectedAction}
          hasFounderAccess={hasFounderAccess}
          masterPrompt={masterPrompt}
        />

        <ExportAssets
          hasFounderAccess={hasFounderAccess}
          masterPrompt={masterPrompt}
        />

        <MobileShareKit masterPrompt={masterPrompt} />
      </details>

      {!hasFounderAccess && (
        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
          <h3 className="text-xl font-black text-white">
            Unlock Bilion Pro — $9.99/month
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Get unlimited Money Moves, more versions, saved tests, and build-after-replies plans.
          </p>
          <a
            href={CHECKOUT_URL || "/founder"}
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-black transition hover:bg-zinc-200 sm:w-auto"
          >
            Unlock Bilion Pro — $9.99/month
          </a>
        </div>
      )}
    </article>
  );
}

function CarouselGenerator({
  hasFounderAccess,
  masterPrompt,
}: {
  hasFounderAccess: boolean;
  masterPrompt: MasterPrompt;
}) {
  const [copiedKey, setCopiedKey] = useState("");
  const [copyError, setCopyError] = useState(false);
  const slides = buildCarouselSlides(masterPrompt);
  const visibleSlides = hasFounderAccess ? slides : slides.slice(0, 2);

  async function copyText(key: string, text: string) {
    const copied = await writeClipboardText(text);
    setCopiedKey(copied ? key : "");
    setCopyError(!copied);
    window.setTimeout(() => {
      setCopiedKey("");
      setCopyError(false);
    }, 1200);
  }

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Carousel Generator
          </div>
          <h3 className="mt-2 text-2xl font-black text-white">
            5-slide brief-to-content carousel
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Turn this hidden opportunity into TikTok, Instagram, or X carousel copy.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            copyText("all", buildCarouselCopy(masterPrompt, hasFounderAccess))
          }
          className="rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-black shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-200"
        >
          {copiedKey === "all" ? "Copied All" : "Copy All"}
        </button>
      </div>

      {!hasFounderAccess && (
        <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-4 text-sm leading-6 text-yellow-100">
          Free preview shows Slide 1-2. Bilion Pro unlocks all 5 slides.
        </div>
      )}

      <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-5">
        {visibleSlides.map((slide, index) => (
          <article
            key={slide.title}
            className="flex min-h-56 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4"
          >
            <div className="text-xs font-black uppercase tracking-wide text-zinc-500">
              Slide {index + 1}
            </div>
            <h4 className="mt-2 break-words text-base font-black leading-6 text-white">
              {slide.title.replace(/^Slide \d+:\s*/, "")}
            </h4>
            <p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
              {slide.body}
            </p>
            <button
              type="button"
              onClick={() => copyText(slide.title, `${slide.title}\n${slide.body}`)}
              className="mt-4 w-full rounded-xl border border-white/10 px-3 py-3 text-xs font-black text-white transition hover:bg-white/[0.06]"
            >
              {copiedKey === slide.title ? "Copied" : "Copy Slide"}
            </button>
          </article>
        ))}
      </div>

      {copyError && (
        <p className="mt-3 text-sm font-bold text-yellow-100">
          Clipboard blocked. Select the visible carousel text and copy manually.
        </p>
      )}
    </section>
  );
}

function ActionBriefSection({
  action,
  hasFounderAccess,
  masterPrompt,
}: {
  action: NextAction;
  hasFounderAccess: boolean;
  masterPrompt: MasterPrompt;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const fields = buildActionBriefFields(masterPrompt, action, hasFounderAccess);

  async function copyActionBrief() {
    const copiedText = await writeClipboardText(
      buildActionBriefCopy(masterPrompt, action, hasFounderAccess),
    );

    setCopied(copiedText);
    setCopyError(!copiedText);
    window.setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, 1200);
  }

  return (
    <section className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Brief-to-content test
          </div>
          <h3 className="mt-2 text-2xl font-black text-white">
            {getActionLabel(action)}
          </h3>
        </div>
        <button
          type="button"
          onClick={copyActionBrief}
          className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
        >
          {copied ? "Copied Brief" : "Copy Brief"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className={[
              "rounded-2xl border border-white/10 bg-black/35 p-4",
              label === "Codex-ready build prompt" ? "md:col-span-2" : "",
            ].join(" ")}
          >
            <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
              {label}
            </div>
            <div className="mt-2 max-h-[420px] overflow-auto whitespace-pre-wrap text-sm leading-6 text-zinc-100">
              {value}
            </div>
          </div>
        ))}
      </div>

      {copyError && (
        <p className="mt-3 text-sm font-bold text-yellow-100">
          Clipboard blocked. Select the visible action brief fields and copy them manually.
        </p>
      )}
    </section>
  );
}

function ExportAssets({
  hasFounderAccess,
  masterPrompt,
}: {
  hasFounderAccess: boolean;
  masterPrompt: MasterPrompt;
}) {
  const [copiedKey, setCopiedKey] = useState("");
  const exportItems = [
    {
      key: "pdf",
      label: "Copy Free PDF Page",
      helper: "Use as a lead magnet page",
      text: buildExportAssetCopy(masterPrompt, "pdf", hasFounderAccess),
    },
    {
      key: "pack",
      label: "Copy $19 Pattern Pack Entry",
      helper: "Paste into a paid pack",
      text: buildExportAssetCopy(masterPrompt, "pack", hasFounderAccess),
    },
    {
      key: "tiktok",
      label: "Copy TikTok Script",
      helper: "Turn the pattern into a short video",
      text: buildExportAssetCopy(masterPrompt, "tiktok", hasFounderAccess),
    },
    {
      key: "x",
      label: "Copy X Post",
      helper: "Post the idea and test replies",
      text: buildExportAssetCopy(masterPrompt, "x", hasFounderAccess),
    },
    {
      key: "gumroad",
      label: "Copy Gumroad Description",
      helper: "Use as the product listing draft",
      text: buildExportAssetCopy(masterPrompt, "gumroad", hasFounderAccess),
    },
  ];

  async function copyExportAsset(key: string, text: string) {
    const copied = await writeClipboardText(text);
    setCopiedKey(copied ? key : "error");
    window.setTimeout(() => setCopiedKey(""), 1200);
  }

  return (
    <div className="mt-4 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-4 md:p-5">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Distribution Assets
          </div>
          <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-zinc-300">
            Copy the current Build Brief into carousel, post, DM, lead magnet,
            and product listing assets.
          </p>
        </div>
        {!hasFounderAccess && (
          <div className="break-words rounded-xl border border-yellow-400/20 bg-yellow-400/[0.06] px-3 py-2 text-xs font-bold leading-5 text-yellow-100">
            Build-after-replies plan included with Bilion Pro
          </div>
        )}
      </div>

      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {exportItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => copyExportAsset(item.key, item.text)}
            className="min-h-24 min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm font-black text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/10"
          >
            <span className="block break-words">
              {copiedKey === item.key ? "Copied" : item.label}
            </span>
            <span className="mt-1 block break-words text-xs font-bold leading-5 text-zinc-400">
              {item.helper}
            </span>
          </button>
        ))}
      </div>

      {copiedKey === "error" && (
        <p className="mt-3 text-sm font-bold text-yellow-100">
          Clipboard blocked. Select the visible brief fields and copy them manually.
        </p>
      )}
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="break-words text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-black leading-5 text-white">
        {formatDisplayText(value)}
      </div>
    </div>
  );
}

function StarterStoryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="break-words text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <p className="mt-2 break-words text-sm leading-6 text-zinc-100">
        {normalizeDisplayText(value)}
      </p>
    </div>
  );
}

function MasterPromptField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="break-words text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-100">
        {normalizeDisplayText(value)}
      </div>
    </div>
  );
}

function MobileShareKit({ masterPrompt }: { masterPrompt: MasterPrompt }) {
  const [copiedKey, setCopiedKey] = useState("");
  const shareItems = [
    {
      key: "x-post",
      label: "Copy X Post",
      helper: "Post this brief on X",
      text: masterPrompt.launchCopy.xPost,
    },
    {
      key: "dm",
      label: "Copy DM Script",
      helper: "DM a likely buyer with this",
      text: masterPrompt.launchCopy.dmMessage,
    },
    {
      key: "validation-plan",
      label: "Copy Validation Plan",
      helper: "Use this as the 48-hour test",
      text: buildValidationPlanCopy(masterPrompt),
    },
  ];

  async function copyShareText(key: string, text: string) {
    const copied = await writeClipboardText(text);
    setCopiedKey(copied ? key : "error");
    window.setTimeout(() => setCopiedKey(""), 1200);
  }

  return (
    <div className="mt-4 min-w-0 overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 md:p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-emerald-300">
        Mobile Share Kit
      </div>
      <p className="mt-2 break-words text-sm leading-6 text-zinc-300">
        Copy the sales-facing pieces from this brief, then test buyer response
        before building.
      </p>
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
        {shareItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => copyShareText(item.key, item.text)}
            className="min-h-20 min-w-0 rounded-2xl bg-white px-5 py-4 text-left text-sm font-black text-black transition hover:bg-zinc-200"
          >
            <span className="block break-words">
              {copiedKey === item.key ? "Copied" : item.label}
            </span>
            <span className="mt-1 block break-words text-xs font-bold leading-5 text-zinc-600">
              {item.helper}
            </span>
          </button>
        ))}
      </div>
      {copiedKey === "error" && (
        <p className="mt-3 text-sm font-bold text-yellow-100">
          Clipboard blocked. Select the text and copy it manually.
        </p>
      )}
    </div>
  );
}

function MasterPromptList({
  label,
  items,
  ordered = false,
}: {
  label: string;
  items: string[];
  ordered?: boolean;
}) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <div className="min-w-0">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <ListTag className="mt-3 space-y-2 text-sm leading-6 text-zinc-100">
        {items.map((item, index) => (
          <li key={`${label}-${item}`} className="flex gap-3">
            <span className="text-zinc-500">{ordered ? `${index + 1}.` : "-"}</span>
            <span>{item}</span>
          </li>
        ))}
      </ListTag>
    </div>
  );
}

function SavedSignalsSection({
  hasFounderAccess,
  copiedSignalId,
  onCopyPrompt,
  onDelete,
  onView,
  savedSignals,
}: {
  hasFounderAccess: boolean;
  copiedSignalId: string;
  onCopyPrompt: (signal: SavedSignal) => void;
  onDelete: (signalId: string) => void;
  onView: (signal: SavedSignal) => void;
  savedSignals: SavedSignal[];
}) {
  return (
    <section className="mt-8 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <details>
        <summary className="flex cursor-pointer list-none flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight text-zinc-300">
              Past Prompts
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Secondary archive. Open when you need an older saved brief.
            </p>
          </div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            {savedSignals.length}/10 saved
          </div>
        </summary>

        {savedSignals.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-500">
            No saved build signals yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-3">
            {savedSignals.slice(0, 3).map((signal) => (
            <article
              key={signal.id}
              className="rounded-2xl border border-white/[0.08] bg-black/25 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {new Date(signal.createdAt).toLocaleString()}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-zinc-100">
                    {signal.sourceTitle}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
                    {signal.pain}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.04] px-2.5 py-1 text-xs font-bold text-emerald-300">
                      Saved Angle
                    </span>
                    {signal.patternMatches.slice(0, 3).map((match) => (
                      <span
                        key={match}
                        className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400"
                      >
                        {match}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid w-full shrink-0 grid-cols-1 gap-2 sm:grid-cols-3 lg:w-36 lg:grid-cols-1">
                  <button
                    type="button"
                    onClick={() => onView(signal)}
                    className="rounded-xl border border-white/10 px-3 py-3 text-xs font-bold text-white transition hover:bg-white/[0.04]"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onCopyPrompt(signal)}
                    className="rounded-xl bg-white px-3 py-3 text-xs font-bold text-black transition hover:bg-zinc-200"
                  >
                    {copiedSignalId === signal.id
                      ? "Copied"
                      : hasFounderAccess
                        ? "Copy to Code X"
                        : "Copy Preview"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(signal.id)}
                    className="rounded-xl border border-red-400/20 px-3 py-3 text-xs font-bold text-red-300 transition hover:bg-red-400/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
            ))}
          </div>
        )}
      </details>
    </section>
  );
}

function InlineShowcaseSection() {
  return (
    <section className="mt-8 min-w-0 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 md:p-5">
      <details>
        <summary className="flex min-w-0 cursor-pointer list-none flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-tight text-zinc-300">Showcase</h2>
            <p className="mt-1 break-words text-sm leading-6 text-zinc-600">
              Secondary examples. Open when you want reference builds.
            </p>
          </div>
          <Link
            href="/showcase"
            className="text-sm font-bold text-zinc-400 transition hover:text-white"
            onClick={(event) => event.stopPropagation()}
          >
            Open full showcase
          </Link>
        </summary>

        <div className="mt-6 grid min-w-0 gap-3 lg:grid-cols-3">
          {showcaseItems.slice(0, 5).map((item) => (
          <article
            key={item.route}
            className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/25 p-4"
          >
            <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Product built
            </div>
            <h3 className="mt-2 break-words text-base font-bold text-zinc-100">
              {item.name}
            </h3>
            <div className="mt-4 grid gap-3 text-sm leading-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Source signal
                </div>
                <p className="mt-1 break-words text-zinc-300">{item.signal}</p>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Buyer
                </div>
                <p className="mt-1 break-words text-zinc-300">{item.buyer}</p>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Revenue idea
                </div>
                <p className="mt-1 break-words text-zinc-300">{item.revenueIdea}</p>
              </div>
            </div>
            <Link
              href={item.route}
              className="mt-5 inline-flex w-full rounded-xl border border-white/10 px-3 py-3 text-center text-xs font-bold text-white transition hover:bg-white/[0.04] sm:w-auto"
            >
              Open demo route
            </Link>
          </article>
          ))}
        </div>
      </details>
    </section>
  );
}

/*
function FounderPromptView({
  copied,
  onCopyPrompt,
  onNextSignal,
  pack,
}: {
  copied: boolean;
  onCopyPrompt: () => void;
  onNextSignal: () => void;
  pack: BuildPromptPack;
}) {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
          Founder Build Prompt
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onNextSignal}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.04]"
          >
            Next Build Prompt
          </button>
          <button
            type="button"
            onClick={onCopyPrompt}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            {copied ? "Copied" : "Copy Full Code X Prompt"}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <SourceBlock pack={pack} />
        <PaidBlock
          label="Core Features"
          value={pack.core_features.map((item) => "- " + item).join("\n")}
        />
        <PaidBlock label="Comparable Price" value={pack.comparable_price} />
        <PaidBlock
          label="Build Steps"
          value={pack.build_steps
            .map((item, index) => index + 1 + ". " + item)
            .join("\n")}
        />
        <PaidBlock
          label="Pattern Matches"
          value={pack.pattern_matches.join("\n")}
        />
        <HowToUsePromptBlock />
        <PaidBlock label="Full Code X Prompt" value={pack.code_x_prompt} />
      </div>
    </div>
  );
}

function HowToUsePromptBlock() {
  const steps = [
    "Create a new empty project folder on your computer.",
    "Open that folder in VS Code, Cursor, or another AI coding tool.",
    "Open Codex / Code X.",
    "Paste the Full Code X Prompt below.",
    "Let the AI build the standalone MVP.",
    "Run the app locally and record the result.",
  ];

  return (
    <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        How to use this prompt
      </div>
      <ol className="mt-3 space-y-2 text-sm leading-6 text-zinc-100">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="text-zinc-500">{index + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function SourceBlock({ pack }: { pack: BuildPromptPack }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        Source
      </div>
      <div className="mt-3 grid gap-3 text-sm leading-6 text-zinc-100">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Latest Signal
          </div>
          <div className="mt-1">{pack.latest_signal}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Title
          </div>
          <div className="mt-1">{pack.source_title}</div>
        </div>
        {pack.source_url && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Source URL
            </div>
            <a
              href={pack.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-words underline underline-offset-4 hover:text-white"
            >
              {pack.source_url}
            </a>
          </div>
        )}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Type
          </div>
          <div className="mt-1">{pack.source_type}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Note
          </div>
          <div className="mt-1">{pack.source_note}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Buyer
          </div>
          <div className="mt-1">{pack.buyer}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Pain
          </div>
          <div className="mt-1">{pack.pain}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Why Now
          </div>
          <div className="mt-1">{pack.why_now}</div>
        </div>
      </div>
    </article>
  );
}

function LockedFounderView() {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
        Bilion Pro
      </div>

      <h3 className="mt-3 text-2xl font-black">
        Pro preview
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        The full Code X Prompt and matching domains are hidden in the free
        preview.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {lockedItems.map((item) => (
          <LockedItem key={item} text={item} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
        <h4 className="text-xl font-black">Unlock Bilion Pro</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Get unlimited Money Moves, more versions, saved tests, and build-after-replies plans.
        </p>

        {CHECKOUT_URL ? (
          <a
            href={CHECKOUT_URL}
            className="mt-5 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Unlock Bilion Pro — $9.99/month
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-zinc-500"
          >
            Checkout link not configured
          </button>
        )}
      </div>
    </div>
  );
}

*/
function SidebarItem({
  label,
  active,
  locked,
}: {
  label: string;
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between rounded-2xl px-3 py-3 text-sm",
        active
          ? "bg-white text-black"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>
      {locked && <span className="text-xs opacity-60">Locked</span>}
    </div>
  );
}

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium text-zinc-500">
      <span className="rounded-full bg-white px-3 py-1.5 text-zinc-950">English</span>
      <Link href="/jp/app" className="rounded-full px-3 py-1.5 transition hover:text-white">Japanese</Link>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="break-words text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 break-words text-sm leading-6 text-zinc-100">{value}</div>
    </div>
  );
}

function RightPanelItem({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-zinc-500">Founder</div>
      </div>
    </div>
  );
}
