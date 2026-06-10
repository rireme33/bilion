type VideoPatternAnalysis = {
  summary: {
    product_name: string;
    niche: string;
    offer: string;
    platform_fit: string;
    transcript_source: string;
  };
  stop_scroll: {
    why_it_stops_the_scroll: string;
    primary_hook: string;
    hook_category: string;
    reasoning: string;
  };
  retention: {
    why_viewers_keep_watching: string;
    pacing_notes: string;
    retention_mechanism: string;
    reasoning: string;
  };
  analysis: {
    visual_analysis: string;
    speech_analysis: string;
    subtitle_analysis: string;
    psychological_trigger: string;
    viewer_desire: string;
    viewer_fear: string;
    silent_viewing_effectiveness: string;
  };
  pattern: {
    reproducible_pattern: string;
    what_to_copy: string[];
    what_not_to_copy: string[];
  };
  bilion_rewrite: {
    bilion_version: string;
    ai_builder_version: string;
    vibe_coder_version: string;
    founder_version: string;
    fifteen_second_script: string;
    thirty_second_script: string;
    caption: string;
    cta: string;
  };
  scores: {
    scroll_stop_score: { score: number; reasoning: string };
    retention_score: { score: number; reasoning: string };
    clarity_score: { score: number; reasoning: string };
    reproducibility_score: { score: number; reasoning: string };
    commercial_opportunity_score: { score: number; reasoning: string };
  };
  gpt_gap: {
    why_gpt_alone_is_not_enough: string;
    system_advantage: string;
  };
};

const hookCategories = [
  "Result-first",
  "Warning",
  "Contrarian",
  "Secret",
  "Transformation",
  "Failure avoidance",
  "Curiosity",
  "Numbers",
  "Authority",
  "Other",
];

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "stop_scroll",
    "retention",
    "analysis",
    "pattern",
    "bilion_rewrite",
    "scores",
    "gpt_gap",
  ],
  properties: {
    summary: {
      type: "object",
      additionalProperties: false,
      required: ["product_name", "niche", "offer", "platform_fit", "transcript_source"],
      properties: {
        product_name: { type: "string" },
        niche: { type: "string" },
        offer: { type: "string" },
        platform_fit: { type: "string" },
        transcript_source: { type: "string" },
      },
    },
    stop_scroll: {
      type: "object",
      additionalProperties: false,
      required: ["why_it_stops_the_scroll", "primary_hook", "hook_category", "reasoning"],
      properties: {
        why_it_stops_the_scroll: { type: "string" },
        primary_hook: { type: "string" },
        hook_category: { type: "string", enum: hookCategories },
        reasoning: { type: "string" },
      },
    },
    retention: {
      type: "object",
      additionalProperties: false,
      required: ["why_viewers_keep_watching", "pacing_notes", "retention_mechanism", "reasoning"],
      properties: {
        why_viewers_keep_watching: { type: "string" },
        pacing_notes: { type: "string" },
        retention_mechanism: { type: "string" },
        reasoning: { type: "string" },
      },
    },
    analysis: {
      type: "object",
      additionalProperties: false,
      required: [
        "visual_analysis",
        "speech_analysis",
        "subtitle_analysis",
        "psychological_trigger",
        "viewer_desire",
        "viewer_fear",
        "silent_viewing_effectiveness",
      ],
      properties: {
        visual_analysis: { type: "string" },
        speech_analysis: { type: "string" },
        subtitle_analysis: { type: "string" },
        psychological_trigger: { type: "string" },
        viewer_desire: { type: "string" },
        viewer_fear: { type: "string" },
        silent_viewing_effectiveness: { type: "string" },
      },
    },
    pattern: {
      type: "object",
      additionalProperties: false,
      required: ["reproducible_pattern", "what_to_copy", "what_not_to_copy"],
      properties: {
        reproducible_pattern: { type: "string" },
        what_to_copy: { type: "array", items: { type: "string" } },
        what_not_to_copy: { type: "array", items: { type: "string" } },
      },
    },
    bilion_rewrite: {
      type: "object",
      additionalProperties: false,
      required: [
        "bilion_version",
        "ai_builder_version",
        "vibe_coder_version",
        "founder_version",
        "fifteen_second_script",
        "thirty_second_script",
        "caption",
        "cta",
      ],
      properties: {
        bilion_version: { type: "string" },
        ai_builder_version: { type: "string" },
        vibe_coder_version: { type: "string" },
        founder_version: { type: "string" },
        fifteen_second_script: { type: "string" },
        thirty_second_script: { type: "string" },
        caption: { type: "string" },
        cta: { type: "string" },
      },
    },
    scores: {
      type: "object",
      additionalProperties: false,
      required: [
        "scroll_stop_score",
        "retention_score",
        "clarity_score",
        "reproducibility_score",
        "commercial_opportunity_score",
      ],
      properties: {
        scroll_stop_score: { "$ref": "#/$defs/score" },
        retention_score: { "$ref": "#/$defs/score" },
        clarity_score: { "$ref": "#/$defs/score" },
        reproducibility_score: { "$ref": "#/$defs/score" },
        commercial_opportunity_score: { "$ref": "#/$defs/score" },
      },
    },
    gpt_gap: {
      type: "object",
      additionalProperties: false,
      required: ["why_gpt_alone_is_not_enough", "system_advantage"],
      properties: {
        why_gpt_alone_is_not_enough: { type: "string" },
        system_advantage: { type: "string" },
      },
    },
  },
  $defs: {
    score: {
      type: "object",
      additionalProperties: false,
      required: ["score", "reasoning"],
      properties: {
        score: { type: "number", minimum: 1, maximum: 10 },
        reasoning: { type: "string" },
      },
    },
  },
};

export const runtime = "nodejs";

function text(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function getFallbackTranscript(fileName: string) {
  return `Fallback transcript for ${fileName}: opening frame shows a short-form video. The creator appears to present a transformation, result, or warning. OpenAI transcription was unavailable, so this analysis uses uploaded frames, optional product context, and deterministic fallback reasoning.`;
}

async function transcribeVideo(video: File, apiKey: string) {
  const body = new FormData();
  body.append("file", video, video.name || "video.mp4");
  body.append("model", process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe");
  body.append("response_format", "json");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed with ${response.status}`);
  }

  const data = (await response.json()) as { text?: string };
  return data.text?.trim() || "";
}

function fallbackAnalysis({
  productName,
  niche,
  offer,
  transcript,
  frameCount,
}: {
  productName: string;
  niche: string;
  offer: string;
  transcript: string;
  frameCount: number;
}): VideoPatternAnalysis {
  const lower = transcript.toLowerCase();
  const resultLed = lower.includes("built") || lower.includes("result") || lower.includes("before");
  const warningLed = lower.includes("mistake") || lower.includes("avoid") || lower.includes("stop");
  const hookCategory = resultLed ? "Result-first" : warningLed ? "Warning" : "Transformation";
  const base = productName || "your product";
  const target = niche || "AI builders";
  const productOffer = offer || "$19 one-time or $49 creator lab";

  return {
    summary: {
      product_name: base,
      niche: target,
      offer: productOffer,
      platform_fit: "Shorts, Reels, and TikTok videos where the first three seconds show a visible before-after change.",
      transcript_source: "Fallback transcript because OpenAI analysis was unavailable.",
    },
    stop_scroll: {
      why_it_stops_the_scroll:
        "The video appears to open with a visible change or problem, which gives the viewer a reason to decode the outcome immediately.",
      primary_hook: "Show the outcome first, then explain the mechanism.",
      hook_category: hookCategory,
      reasoning: `Fallback used ${frameCount} extracted frame snapshots plus the transcript context.`,
    },
    retention: {
      why_viewers_keep_watching:
        "The viewer keeps watching to understand the steps between the visible opening state and the promised useful result.",
      pacing_notes: "Keep the first three seconds dense: frame 0 names the pain, frame 1 shows proof, frame 2 reveals the system.",
      retention_mechanism: "Open loop plus progressive reveal.",
      reasoning: "The workflow prioritizes 0, 1, 2, and 3 second frames because those moments decide whether the viewer stays.",
    },
    analysis: {
      visual_analysis: "Use a split-screen, dashboard, result card, or visible transformation instead of a generic talking head opener.",
      speech_analysis: "Speech should name the painful old behavior and the useful new system in one sentence.",
      subtitle_analysis: "Subtitles should be readable without sound and should carry the hook independently.",
      psychological_trigger: "Competence shortcut: the viewer wants the system without repeating the trial-and-error.",
      viewer_desire: `Create repeatable short-form content for ${target}.`,
      viewer_fear: "Making polished content that does not explain why anyone should keep watching.",
      silent_viewing_effectiveness: "Medium to high if the first frame includes the promise as text.",
    },
    pattern: {
      reproducible_pattern:
        "Outcome-first opener, one-sentence pain label, fast system reveal, then a reusable script or proof point.",
      what_to_copy: [
        "First-frame contrast",
        "Specific pain in on-screen text",
        "Mechanism reveal by second three",
        "Concrete adaptation for the viewer's niche",
      ],
      what_not_to_copy: [
        "Exact creator phrasing",
        "Private screenshots",
        "Unverified performance claims",
        "Brand-specific visual assets",
      ],
    },
    bilion_rewrite: {
      bilion_version: "Most people collect AI tools. Bilion turns AI signals into products you can actually build.",
      ai_builder_version: `Stop saving random viral videos. Extract the structure and turn it into a ${base} content system.`,
      vibe_coder_version: "I watched the first three seconds, pulled the pattern, and turned it into a working product screen.",
      founder_version: "The content idea is not the video. The content idea is the repeatable buyer pain hiding inside it.",
      fifteen_second_script:
        "0-2s: Show the viral opening. 2-5s: Label why it stops the scroll. 5-10s: Extract the reusable pattern. 10-15s: Rewrite it for your product.",
      thirty_second_script:
        "0-3s: Show the first frame and name the hook. 3-8s: Explain what viewers understand without sound. 8-15s: Identify the retention mechanic. 15-23s: Show what to copy and what not to copy. 23-30s: Rewrite it for Bilion, AI builders, and founders.",
      caption: `GPT analyzes. Video Pattern Lab systemizes. Use it to turn viral structure into repeatable content for ${target}.`,
      cta: `Get the pattern for ${priceLabel()}.`,
    },
    scores: {
      scroll_stop_score: { score: 8, reasoning: "The pattern has a clear opening contrast and fast promise." },
      retention_score: { score: 7, reasoning: "Retention depends on how quickly the mechanism is revealed after the hook." },
      clarity_score: { score: 7, reasoning: "The fallback has enough context, but transcript and frame OCR would improve precision." },
      reproducibility_score: { score: 9, reasoning: "The structure can be reused across tools, founders, agencies, and local business niches." },
      commercial_opportunity_score: { score: 8, reasoning: "The pattern naturally turns into scripts, captions, audits, and productized analysis." },
    },
    gpt_gap: {
      why_gpt_alone_is_not_enough:
        "GPT can analyze one video, but users must rebuild the same workflow every time.",
      system_advantage:
        "Video Pattern Lab standardizes upload, frame extraction, transcription, scoring, rewrites, saved analyses, and copy-ready outputs.",
    },
  };
}

function priceLabel() {
  return "$19 one-time or $49 creator lab";
}

function buildPrompt({
  productName,
  niche,
  offer,
  transcript,
  frameCount,
}: {
  productName: string;
  niche: string;
  offer: string;
  transcript: string;
  frameCount: number;
}) {
  return `You are Video Pattern Lab, a practical short-form video analysis system for creators, AI builders, vibe coders, solo founders, and product marketers.

Analyze the uploaded video frames and transcript. Separate observation from inference. Prioritize 0 sec, 1 sec, 2 sec, and 3 sec frames. Avoid vague language. Explain what is reusable and what is video-specific.

Context:
- Product name: ${productName || "Not provided"}
- Niche: ${niche || "Not provided"}
- Offer: ${offer || "Not provided"}
- Price shown in product: ${priceLabel()}
- Extracted frame count: ${frameCount}

Transcript:
${transcript}

Return only valid JSON matching the schema. Scores must be 1-10 and each score must include reasoning. Use one of these hook categories exactly: ${hookCategories.join(", ")}.

Commercial positioning to include:
- GPT analyzes.
- Video Pattern Lab systemizes.
- Why GPT alone is not enough: users repeat the same workflow every time.`;
}

function parseOutputText(data: unknown) {
  if (!data || typeof data !== "object") {
    return "";
  }

  const maybe = data as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string; type?: string }> }>;
  };

  if (typeof maybe.output_text === "string") {
    return maybe.output_text;
  }

  return (
    maybe.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((value): value is string => typeof value === "string")
      .join("\n") ?? ""
  );
}

async function analyzeWithOpenAI({
  apiKey,
  productName,
  niche,
  offer,
  transcript,
  frames,
}: {
  apiKey: string;
  productName: string;
  niche: string;
  offer: string;
  transcript: string;
  frames: string[];
}) {
  const content = [
    {
      type: "input_text",
      text: buildPrompt({ productName, niche, offer, transcript, frameCount: frames.length }),
    },
    ...frames.slice(0, 10).map((frame) => ({
      type: "input_image",
      image_url: frame,
    })),
  ];

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VISION_MODEL || "gpt-4.1-mini",
      input: [{ role: "user", content }],
      text: {
        format: {
          type: "json_schema",
          name: "video_pattern_lab_analysis",
          schema: jsonSchema,
          strict: false,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Vision analysis failed with ${response.status}`);
  }

  const data = await response.json();
  const outputText = parseOutputText(data);

  if (!outputText) {
    throw new Error("Vision analysis returned no text");
  }

  return JSON.parse(outputText) as VideoPatternAnalysis;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const video = formData.get("video");
    const productName = text(formData.get("productName"));
    const niche = text(formData.get("niche"));
    const offer = text(formData.get("offer"));
    const framePayload = text(formData.get("frames"), "[]");
    const frames = JSON.parse(framePayload) as string[];
    const apiKey = process.env.OPENAI_API_KEY;

    if (!(video instanceof File)) {
      return Response.json({ error: "Upload an MP4, MOV, or short video file." }, { status: 400 });
    }

    if (!apiKey) {
      const transcript = getFallbackTranscript(video.name || "uploaded video");
      return Response.json({
        ok: true,
        mode: "fallback",
        warning: "OPENAI_API_KEY is not configured. Showing graceful fallback analysis.",
        transcript,
        frameCount: frames.length,
        analysis: fallbackAnalysis({ productName, niche, offer, transcript, frameCount: frames.length }),
      });
    }

    let transcript = "";
    let warning = "";

    try {
      transcript = await transcribeVideo(video, apiKey);
    } catch (error) {
      warning = error instanceof Error ? error.message : "Transcription failed";
      transcript = getFallbackTranscript(video.name || "uploaded video");
    }

    try {
      const analysis = await analyzeWithOpenAI({ apiKey, productName, niche, offer, transcript, frames });

      return Response.json({
        ok: true,
        mode: warning ? "partial-openai" : "openai",
        warning,
        transcript,
        frameCount: frames.length,
        analysis,
      });
    } catch (error) {
      const analysisWarning = error instanceof Error ? error.message : "Analysis failed";

      return Response.json({
        ok: true,
        mode: "fallback",
        warning: warning ? `${warning}. ${analysisWarning}` : analysisWarning,
        transcript,
        frameCount: frames.length,
        analysis: fallbackAnalysis({ productName, niche, offer, transcript, frameCount: frames.length }),
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected analysis error";
    return Response.json({ error: message }, { status: 500 });
  }
}
