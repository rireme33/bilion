import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OpportunityRevealRequest = {
  signal?: {
    id?: string;
    latestSignal?: string;
    sourceTitle?: string;
    sourceType?: string;
    sourceNote?: string;
    buyer?: string;
    pain?: string;
    whyNow?: string;
    whatYouCanBuild?: string;
    comparablePrice?: string;
    patternMatches?: string[];
  };
  buyer?: string;
  goal?: "post" | "sell" | "build";
};

const opportunityRevealSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "heroSummary",
    "whyThisMatters",
    "opportunityScore",
    "carousel",
    "sellThisFirst",
    "attack48h",
    "buildAfterReplies",
    "evidence",
  ],
  properties: {
    heroSummary: {
      type: "object",
      additionalProperties: false,
      required: ["title", "signal", "aha", "buyer", "price", "firstWedge"],
      properties: {
        title: { type: "string" },
        signal: { type: "string" },
        aha: { type: "string" },
        buyer: { type: "string" },
        price: { type: "string" },
        firstWedge: { type: "string" },
      },
    },
    whyThisMatters: {
      type: "object",
      additionalProperties: false,
      required: ["holyShit", "whatEveryoneMisses", "moneyAngle", "marketShift"],
      properties: {
        holyShit: { type: "string" },
        whatEveryoneMisses: { type: "string" },
        moneyAngle: { type: "string" },
        marketShift: { type: "string" },
      },
    },
    opportunityScore: {
      type: "object",
      additionalProperties: false,
      required: [
        "total",
        "buyerUrgency",
        "painFrequency",
        "distributionEase",
        "speedToValidate",
        "buildComplexity",
        "reason",
      ],
      properties: {
        total: { type: "number" },
        buyerUrgency: { type: "number" },
        painFrequency: { type: "number" },
        distributionEase: { type: "number" },
        speedToValidate: { type: "number" },
        buildComplexity: { type: "number" },
        reason: { type: "string" },
      },
    },
    carousel: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["slide", "title", "body"],
        properties: {
          slide: { type: "number" },
          title: { type: "string" },
          body: { type: "string" },
        },
      },
    },
    sellThisFirst: {
      type: "object",
      additionalProperties: false,
      required: [
        "whoBuys",
        "firstOffer",
        "price",
        "whereToFindThem",
        "dmScript",
        "xPost",
      ],
      properties: {
        whoBuys: { type: "string" },
        firstOffer: { type: "string" },
        price: { type: "string" },
        whereToFindThem: { type: "string" },
        dmScript: { type: "string" },
        xPost: { type: "string" },
      },
    },
    attack48h: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" },
    },
    buildAfterReplies: {
      type: "object",
      additionalProperties: false,
      required: ["doNotBuildYet", "buildOnlyIf", "mvpScope", "codexPrompt"],
      properties: {
        doNotBuildYet: { type: "string" },
        buildOnlyIf: { type: "string" },
        mvpScope: { type: "string" },
        codexPrompt: { type: "string" },
      },
    },
    evidence: {
      type: "object",
      additionalProperties: false,
      required: ["whatIsFact", "whatIsInference", "risk", "confidence"],
      properties: {
        whatIsFact: {
          type: "array",
          items: { type: "string" },
        },
        whatIsInference: {
          type: "array",
          items: { type: "string" },
        },
        risk: { type: "string" },
        confidence: {
          type: "string",
          enum: ["High", "Medium", "Low"],
        },
      },
    },
  },
};

function isValidRequest(body: OpportunityRevealRequest) {
  return Boolean(
    body.signal?.id &&
      body.signal.latestSignal &&
      body.signal.sourceTitle &&
      body.signal.buyer &&
      body.goal &&
      ["post", "sell", "build"].includes(body.goal),
  );
}

function buildPrompt(body: OpportunityRevealRequest) {
  return `Create a fresh Bilion Opportunity Reveal from this selected DB signal only.

Rules:
- Use only the signal fields below as source material.
- Do not invent fake revenue, customers, users, funding, or proof.
- Clearly separate facts from inference.
- Create a fresh angle every run.
- Produce a strong Aha Moment that changes how the reader sees the market.
- Prioritize distribution before build.
- Make the output useful for X/TikTok carousel posting.
- Keep language sharp, commercial, and non-generic.
- Avoid vague "AI business idea" language.
- If a field is weak or missing, say the evidence is directional instead of inventing proof.
- Score each opportunityScore component from 1 to 10. total must be the sum of the five component scores, max 50.

Selected buyer:
${body.buyer || body.signal?.buyer || ""}

Goal:
${body.goal}

Signal:
${JSON.stringify(body.signal, null, 2)}`;
}

function parseOpenAiJson(data: unknown) {
  const response = data as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Missing model content.");
  }

  return JSON.parse(content) as Record<string, unknown>;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 503 },
    );
  }

  let body: OpportunityRevealRequest;

  try {
    body = (await request.json()) as OpportunityRevealRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isValidRequest(body)) {
    return NextResponse.json(
      { error: "Missing required opportunity signal fields." },
      { status: 400 },
    );
  }

  const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_OPPORTUNITY_MODEL || "gpt-4.1-mini",
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "You are Bilion's Opportunity Discovery Engine. Return only valid JSON matching the requested schema.",
        },
        {
          role: "user",
          content: buildPrompt(body),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "bilion_opportunity_reveal",
          strict: true,
          schema: opportunityRevealSchema,
        },
      },
    }),
  });

  if (!openAiResponse.ok) {
    return NextResponse.json(
      { error: "AI opportunity generation failed." },
      { status: 502 },
    );
  }

  try {
    const data = await openAiResponse.json();
    return NextResponse.json(parseOpenAiJson(data));
  } catch {
    return NextResponse.json(
      { error: "AI opportunity generation returned invalid JSON." },
      { status: 502 },
    );
  }
}
