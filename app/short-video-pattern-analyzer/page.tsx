"use client";

import { useMemo, useState } from "react";

type SampleInput = {
  id: string;
  name: string;
  video_url: string;
  platform: string;
  transcript_with_timestamps: string;
  ocr_text_timeline: string;
  first_frame_description: string;
  opening_frames_descriptions: string;
  scene_changes: string;
  detected_objects: string;
  audio_features: string;
  creator_caption: string;
  metadata: string;
};

type PatternAnalysis = {
  video_summary: {
    platform: string;
    core_topic: string;
    target_audience: string;
    main_promise: string;
    confidence: number;
  };
  observations: {
    first_frame: {
      visible_elements: string[];
      text_on_screen: string;
      human_or_object_focus: string;
      clarity_score_1_to_5: number;
    };
    first_1_second: {
      what_is_understood: string;
      visual_signal: string;
      subtitle_signal: string;
      speech_signal: string;
      confidence: number;
    };
    first_3_seconds: {
      hook_type: string[];
      reason_to_stop_scrolling: string;
      reason_to_keep_watching: string;
      curiosity_gap: string;
      confidence: number;
    };
  };
  structure_analysis: {
    hook_pattern: string;
    retention_mechanism: string;
    visual_pacing: string;
    subtitle_readability: string;
    audio_role: string;
    visual_speech_alignment: string;
    silent_viewing_score_1_to_5: number;
  };
  psychological_triggers: {
    primary_trigger: string;
    secondary_triggers: string[];
    viewer_desire: string;
    viewer_fear_or_pain: string;
    why_it_feels_relevant_now: string;
    confidence: number;
  };
  reproducible_pattern: {
    pattern_name: string;
    template: string;
    must_keep_elements: string[];
    can_change_elements: string[];
    do_not_copy_elements: string[];
    best_for_niches: string[];
  };
  video_specific_elements: {
    unique_context: string;
    creator_specific_assets: string[];
    hard_to_replicate_parts: string[];
    confidence: number;
  };
  rewrite_guidance: {
    for_ai_business_content: {
      recommended_hook: string;
      recommended_visual: string;
      recommended_caption: string;
      "15_second_script": string;
    };
    for_bilion_content: {
      angle: string;
      hook: string;
      shot_sequence: string[];
      caption: string;
    };
  };
  scores: {
    scroll_stop_score_1_to_10: number;
    retention_score_1_to_10: number;
    clarity_score_1_to_10: number;
    reproducibility_score_1_to_10: number;
    commercial_reuse_score_1_to_10: number;
  };
  final_takeaway: {
    one_sentence_pattern: string;
    what_to_replicate: string;
    what_to_avoid: string;
    confidence: number;
  };
};

type SavedAnalysis = {
  id: number;
  title: string;
  platform: string;
  savedAt: string;
  analysis: PatternAnalysis;
};

const price = "$19 pattern pack or $49/month creator lab";

const analysisRules = [
  "Separate observation from inference.",
  "Prioritize the 0-1 second opening.",
  "Avoid vague language.",
  "Split visual, subtitle, speech, and psychological elements.",
  "Separate reproducible pattern from video-specific elements.",
  "Lower confidence when evidence is weak.",
  "Use deterministic mock AI behavior only.",
  "Do not call external AI APIs.",
];

const samples: SampleInput[] = [
  {
    id: "ai-tool-demo",
    name: "AI tool demo video",
    video_url: "https://short.video/sample/ai-tool-demo",
    platform: "TikTok",
    transcript_with_timestamps:
      "0.0s: I stopped writing customer replies manually. 1.1s: Watch this spreadsheet turn one angry review into three owner-safe replies. 3.0s: The AI pulls the complaint, the tone, and the next action. 7.5s: Now the owner only approves the final version.",
    ocr_text_timeline:
      "0.0s: Stop replying manually. 0.8s: Angry review -> 3 replies. 2.5s: Complaint / tone / next action. 6.0s: Owner approval queue.",
    first_frame_description:
      "Split screen: red negative review on the left, clean AI reply dashboard on the right, cursor hovering over Generate.",
    opening_frames_descriptions:
      "0.0s red review card fills half the screen. 0.6s cursor clicks Generate. 1.2s three reply cards appear with green status tags.",
    scene_changes:
      "Fast cut from review screenshot to dashboard, then zoom on generated reply cards, then final approval checklist.",
    detected_objects:
      "Laptop screen, review card, cursor, dashboard cards, green status badges, small business logo.",
    audio_features:
      "Fast ticking sound on first click, upbeat synth bed, voiceover starts immediately, subtle success chime at 3 seconds.",
    creator_caption:
      "Small businesses do not need another tool. They need replies handled for them.",
    metadata:
      "42s video, 184k views, 9.6k likes, 1.1k saves, posted by AI automation consultant, comments ask for the prompt.",
  },
  {
    id: "founder-build-public",
    name: "Solo founder build-in-public video",
    video_url: "https://short.video/sample/founder-build-public",
    platform: "Reels",
    transcript_with_timestamps:
      "0.0s: I built a tiny product in one night because this DM annoyed me. 1.4s: A founder asked why their landing page gets clicks but no trials. 3.2s: So I made a teardown bot that scores the first screen before they ship.",
    ocr_text_timeline:
      "0.0s: Built in one night. 1.0s: This DM was the trigger. 2.8s: Landing page clicks, no trials. 4.0s: First-screen teardown bot.",
    first_frame_description:
      "Founder selfie beside a blurred customer DM with one highlighted sentence: clicks but no trials.",
    opening_frames_descriptions:
      "0.0s face plus DM. 0.7s zoom into highlighted pain line. 1.5s screen recording of product name appearing in editor.",
    scene_changes:
      "Selfie opener, DM zoom, code editor, rough UI demo, Stripe test sale screenshot.",
    detected_objects:
      "Founder face, phone screenshot, code editor, landing page preview, revenue notification.",
    audio_features:
      "Direct talking head voice, no intro music, keyboard clicks under build montage, quick bass hit at sale screenshot.",
    creator_caption:
      "The fastest product ideas come from annoying specific problems.",
    metadata:
      "31s video, 76k views, 4.2k likes, 670 saves, founder audience, high comment volume about pricing.",
  },
  {
    id: "local-business-transformation",
    name: "Local business transformation video",
    video_url: "https://short.video/sample/local-business-transformation",
    platform: "YouTube Shorts",
    transcript_with_timestamps:
      "0.0s: This salon lost bookings every time someone asked for color examples. 1.2s: We turned their best reviews into a style matcher. 3.1s: Now every inquiry gets a photo-safe reply and a next appointment prompt.",
    ocr_text_timeline:
      "0.0s: Lost bookings from slow replies. 1.3s: Reviews -> style matcher. 3.2s: Reply + appointment prompt. 6.0s: 18 booked consultations.",
    first_frame_description:
      "Before and after salon booking inbox: left side has unanswered DMs, right side shows organized style categories.",
    opening_frames_descriptions:
      "0.0s messy inbox. 0.8s bold text says slow replies lose bookings. 1.6s transition into organized style matcher board.",
    scene_changes:
      "Inbox before, stylist photo board, automated reply preview, calendar with booked consultation slots.",
    detected_objects:
      "Phone inbox, salon chair, hair color swatches, booking calendar, review snippets.",
    audio_features:
      "Soft pop beat, quick whoosh transition, calm narrator, notification ping when booking appears.",
    creator_caption:
      "Local AI products work when they remove one repeated operational delay.",
    metadata:
      "28s video, 118k views, 5.8k likes, 920 saves, local business audience, strong shares from salon owners.",
  },
];

const emptyInput: SampleInput = {
  id: "custom",
  name: "Custom video notes",
  video_url: "",
  platform: "",
  transcript_with_timestamps: "",
  ocr_text_timeline: "",
  first_frame_description: "",
  opening_frames_descriptions: "",
  scene_changes: "",
  detected_objects: "",
  audio_features: "",
  creator_caption: "",
  metadata: "",
};

const inputFields: Array<{ key: keyof SampleInput; label: string; rows?: number }> = [
  { key: "video_url", label: "video_url" },
  { key: "platform", label: "platform" },
  { key: "transcript_with_timestamps", label: "transcript_with_timestamps", rows: 4 },
  { key: "ocr_text_timeline", label: "ocr_text_timeline", rows: 3 },
  { key: "first_frame_description", label: "first_frame_description", rows: 3 },
  { key: "opening_frames_descriptions", label: "opening_frames_descriptions", rows: 3 },
  { key: "scene_changes", label: "scene_changes", rows: 3 },
  { key: "detected_objects", label: "detected_objects", rows: 2 },
  { key: "audio_features", label: "audio_features", rows: 3 },
  { key: "creator_caption", label: "creator_caption", rows: 2 },
  { key: "metadata", label: "metadata", rows: 3 },
];

function splitSignals(value: string) {
  return value
    .split(/,|\.|\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function hasAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function clampScore(score: number, min: number, max: number) {
  return Math.max(min, Math.min(max, score));
}

function confidenceFor(input: SampleInput, required: Array<keyof SampleInput>) {
  const filled = required.filter((key) => String(input[key]).trim().length > 12).length;
  return Number((0.42 + filled * 0.09).toFixed(2));
}

function inferTopic(input: SampleInput) {
  const text = `${input.transcript_with_timestamps} ${input.creator_caption} ${input.metadata}`.toLowerCase();

  if (hasAny(text, ["review", "reply", "small business"])) {
    return "AI-assisted customer response workflow";
  }

  if (hasAny(text, ["landing page", "founder", "built", "product"])) {
    return "Solo founder product validation";
  }

  if (hasAny(text, ["salon", "booking", "local"])) {
    return "Local business operational transformation";
  }

  return "Short-form video pattern extraction";
}

function inferAudience(input: SampleInput) {
  const text = `${input.creator_caption} ${input.metadata} ${input.transcript_with_timestamps}`.toLowerCase();

  if (hasAny(text, ["salon", "local", "small business"])) {
    return "Local business owners and AI service builders";
  }

  if (hasAny(text, ["founder", "landing page", "pricing"])) {
    return "Solo founders and build-in-public creators";
  }

  if (hasAny(text, ["automation", "prompt", "ai"])) {
    return "AI builders and product marketers";
  }

  return "Creators studying reusable short-form content structure";
}

function inferPromise(input: SampleInput) {
  const text = `${input.transcript_with_timestamps} ${input.ocr_text_timeline}`.toLowerCase();

  if (hasAny(text, ["manual", "replies", "approval"])) {
    return "Turn repeated manual work into an owner-safe AI workflow.";
  }

  if (hasAny(text, ["one night", "dm", "teardown"])) {
    return "Convert one painful message into a shippable product idea.";
  }

  if (hasAny(text, ["bookings", "appointment", "consultations"])) {
    return "Show a before-and-after system that creates local business appointments.";
  }

  return "Convert a strong video opening into a repeatable script pattern.";
}

function analyzePattern(input: SampleInput): PatternAnalysis {
  const fullText = Object.values(input).join(" ").toLowerCase();
  const visualSignals = splitSignals(`${input.first_frame_description}. ${input.opening_frames_descriptions}`);
  const objectSignals = splitSignals(input.detected_objects);
  const ocrSignals = splitSignals(input.ocr_text_timeline);
  const sceneCount = splitSignals(input.scene_changes).length;

  const painLed = hasAny(fullText, ["angry", "annoyed", "lost", "slow", "manual", "no trials"]);
  const proofLed = hasAny(fullText, ["views", "likes", "saves", "booked", "sale", "comments"]);
  const transformationLed = hasAny(fullText, ["before", "after", "turn", "now", "into"]);
  const founderLed = hasAny(fullText, ["founder", "built", "dm", "ship"]);

  const clarity5 = clampScore(
    2 +
      (input.first_frame_description.length > 30 ? 1 : 0) +
      (input.ocr_text_timeline.length > 30 ? 1 : 0) +
      (input.detected_objects.length > 20 ? 1 : 0),
    1,
    5,
  );
  const silent5 = clampScore(2 + (ocrSignals.length >= 3 ? 2 : 0) + (visualSignals.length >= 3 ? 1 : 0), 1, 5);
  const confidence = clampScore(
    confidenceFor(input, [
      "transcript_with_timestamps",
      "ocr_text_timeline",
      "first_frame_description",
      "opening_frames_descriptions",
      "scene_changes",
      "audio_features",
    ]),
    0.35,
    0.95,
  );

  const hookTypes = [
    painLed ? "specific pain interrupt" : "pattern curiosity",
    transformationLed ? "before-after contrast" : "workflow reveal",
    proofLed ? "implicit proof" : "open loop",
  ];

  const patternName = painLed
    ? "Pain Snapshot to System Reveal"
    : founderLed
      ? "Annoying Trigger to Build Proof"
      : "Before State to Repeatable Fix";

  const template =
    "Open with one visible pain signal in the first frame, name the cost in the first second, reveal the system by second three, then show the reusable transformation.";

  const scrollStop = clampScore(5 + (painLed ? 2 : 0) + (clarity5 >= 4 ? 1 : 0) + (ocrSignals.length >= 3 ? 1 : 0), 1, 10);
  const retention = clampScore(5 + (sceneCount >= 4 ? 2 : 0) + (transformationLed ? 1 : 0) + (proofLed ? 1 : 0), 1, 10);
  const commercial = clampScore(5 + (hasAny(fullText, ["business", "founder", "owner"]) ? 2 : 0) + (proofLed ? 1 : 0), 1, 10);

  return {
    video_summary: {
      platform: input.platform || "Unknown platform",
      core_topic: inferTopic(input),
      target_audience: inferAudience(input),
      main_promise: inferPromise(input),
      confidence,
    },
    observations: {
      first_frame: {
        visible_elements: [...visualSignals.slice(0, 4), ...objectSignals.slice(0, 2)].slice(0, 6),
        text_on_screen: ocrSignals[0] || "No clear text-on-screen evidence provided.",
        human_or_object_focus: objectSignals[0] || "Primary focus cannot be confirmed from provided notes.",
        clarity_score_1_to_5: clarity5,
      },
      first_1_second: {
        what_is_understood:
          ocrSignals[0] || visualSignals[0] || "The first second needs stronger transcript, OCR, or frame evidence.",
        visual_signal: visualSignals[0] || "Weak visual evidence.",
        subtitle_signal: ocrSignals.slice(0, 2).join(" / ") || "No subtitle signal provided.",
        speech_signal:
          input.transcript_with_timestamps.split(".")[0]?.trim() || "No opening speech evidence provided.",
        confidence: clampScore(confidence - 0.04, 0.3, 0.9),
      },
      first_3_seconds: {
        hook_type: hookTypes,
        reason_to_stop_scrolling: painLed
          ? "The opening names a recognizable operational pain before explaining the solution."
          : "The opening creates curiosity by showing a result before the full method is explained.",
        reason_to_keep_watching: transformationLed
          ? "The viewer expects to see how the before state becomes the after state."
          : "The viewer expects a concrete method, proof point, or reusable workflow.",
        curiosity_gap: "What exact system or script produced the visible change?",
        confidence: clampScore(confidence - 0.02, 0.3, 0.92),
      },
    },
    structure_analysis: {
      hook_pattern: `${patternName}: pain or proof appears visually first, then the narrator explains the mechanism.`,
      retention_mechanism:
        "The video uses progressive disclosure: pain, mechanism, output, then proof or next action.",
      visual_pacing:
        sceneCount >= 4
          ? "Fast enough for short-form: multiple scene states are visible before the viewer can resolve the whole story."
          : "Moderate pacing: add one more scene state before second three to increase retention.",
      subtitle_readability:
        ocrSignals.length >= 3
          ? "Strong silent-viewing path because the OCR timeline carries the argument without audio."
          : "Subtitle evidence is thin; add specific on-screen text for the first three seconds.",
      audio_role: input.audio_features || "No audio notes provided, so audio impact has low confidence.",
      visual_speech_alignment:
        input.transcript_with_timestamps && input.opening_frames_descriptions
          ? "Speech describes the same transformation the visuals are showing."
          : "Alignment cannot be confirmed without both transcript and frame descriptions.",
      silent_viewing_score_1_to_5: silent5,
    },
    psychological_triggers: {
      primary_trigger: painLed ? "relief from repeated operational pain" : "curiosity about a useful transformation",
      secondary_triggers: [
        transformationLed ? "before-after momentum" : "open-loop curiosity",
        proofLed ? "social proof from metrics or visible result" : "competence signaling",
        founderLed ? "maker credibility" : "commercial applicability",
      ],
      viewer_desire:
        "The viewer wants a repeatable content or product pattern they can use without guessing why the original worked.",
      viewer_fear_or_pain:
        "The viewer fears making content that looks polished but does not stop the scroll or explain the value fast enough.",
      why_it_feels_relevant_now:
        "AI builders and marketers can produce assets quickly, so the bottleneck is choosing a pattern that converts attention into action.",
      confidence: clampScore(confidence - 0.06, 0.3, 0.9),
    },
    reproducible_pattern: {
      pattern_name: patternName,
      template,
      must_keep_elements: [
        "Specific first-frame pain or proof",
        "Text-on-screen that makes sense without audio",
        "Mechanism reveal by second three",
        "Concrete output, score, booking, sale, or saved-work result",
      ],
      can_change_elements: [
        "Niche",
        "Tool category",
        "Visual workspace",
        "Narrator",
        "Final call to action",
      ],
      do_not_copy_elements: [
        "Creator face, private customer messages, exact brand assets, exact phrasing, or unverifiable performance claims",
      ],
      best_for_niches: [
        "AI builders",
        "Solo founder products",
        "Local service businesses",
        "Product marketing teardowns",
        "Creator education",
      ],
    },
    video_specific_elements: {
      unique_context: input.creator_caption || "Unique context is not available from the provided caption.",
      creator_specific_assets: [
        objectSignals[0] || "Creator workspace",
        proofLed ? "Visible performance or outcome proof" : "Personal framing",
      ],
      hard_to_replicate_parts: [
        "Original audience trust",
        "Exact timing of the viral topic",
        "Private screenshots or customer evidence",
      ],
      confidence: clampScore(confidence - 0.08, 0.3, 0.88),
    },
    rewrite_guidance: {
      for_ai_business_content: {
        recommended_hook: "This repeated business task is quietly costing you attention, replies, or bookings.",
        recommended_visual:
          "Open on a split screen: messy manual input on the left, structured AI-ready output on the right.",
        recommended_caption:
          "Steal the structure, not the video: pain first, system second, proof third.",
        "15_second_script":
          "0-1s: Show the painful manual task. 1-3s: Name the cost. 3-7s: Reveal the AI workflow. 7-12s: Show the reusable output. 12-15s: Offer the pattern pack or creator lab.",
      },
      for_bilion_content: {
        angle: "Bilion turns viral structure into a productized AI builder pattern.",
        hook: "This short video worked because the first frame sold the pain before the product appeared.",
        shot_sequence: [
          "Show the first frame and label visual, subtitle, and speech signals.",
          "Reveal the hook pattern and retention mechanism.",
          "Turn the pattern into an AI business script.",
          `End with ${price}.`,
        ],
        caption:
          "Bilion pattern read: extract the hook, keep the mechanism, replace the niche. Built for AI builders who want repeatable content ideas.",
      },
    },
    scores: {
      scroll_stop_score_1_to_10: scrollStop,
      retention_score_1_to_10: retention,
      clarity_score_1_to_10: clampScore(clarity5 * 2, 1, 10),
      reproducibility_score_1_to_10: clampScore(6 + (template.length > 80 ? 1 : 0) + (silent5 >= 4 ? 1 : 0), 1, 10),
      commercial_reuse_score_1_to_10: commercial,
    },
    final_takeaway: {
      one_sentence_pattern:
        "The video works by making the viewer understand the painful before-state instantly, then delaying the system reveal just long enough to earn the next three seconds.",
      what_to_replicate:
        "Replicate the first-frame contrast, the 0-1 second pain label, the second-three mechanism reveal, and the concrete final output.",
      what_to_avoid:
        "Do not copy the creator-specific assets, unverifiable metrics, private screenshots, or exact script.",
      confidence,
    },
  };
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: { key: keyof SampleInput; label: string; rows?: number };
  value: string;
  onChange: (key: keyof SampleInput, value: string) => void;
}) {
  if (!field.rows) {
    return (
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{field.label}</span>
        <input
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none ring-cyan-300/30 transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{field.label}</span>
      <textarea
        value={value}
        rows={field.rows}
        onChange={(event) => onChange(field.key, event.target.value)}
        className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm leading-6 text-slate-100 outline-none ring-cyan-300/30 transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2"
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function AnalysisCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-black/20">
      <h3 className="text-sm font-black uppercase tracking-[0.14em] text-cyan-200">{title}</h3>
      <div className="mt-3 text-sm leading-6 text-slate-200">{children}</div>
    </section>
  );
}

export default function ShortVideoPatternAnalyzerPage() {
  const [input, setInput] = useState<SampleInput>(samples[0]);
  const [analysis, setAnalysis] = useState<PatternAnalysis>(() => analyzePattern(samples[0]));
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [copied, setCopied] = useState("");
  const [lastAnalyzed, setLastAnalyzed] = useState("Sample loaded");

  const jsonOutput = useMemo(() => JSON.stringify(analysis, null, 2), [analysis]);

  const bilionScript = analysis.rewrite_guidance.for_bilion_content.shot_sequence
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");

  function updateField(key: keyof SampleInput, value: string) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function loadSample(sample: SampleInput) {
    setInput(sample);
    const nextAnalysis = analyzePattern(sample);
    setAnalysis(nextAnalysis);
    setLastAnalyzed(`${sample.name} loaded`);
  }

  function clearForCustom() {
    setInput(emptyInput);
    setLastAnalyzed("Custom input ready");
  }

  function runAnalysis() {
    setAnalysis(analyzePattern(input));
    setLastAnalyzed(new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }));
  }

  function saveAnalysis() {
    const saved: SavedAnalysis = {
      id: savedAnalyses.length + 1,
      title: input.name || analysis.reproducible_pattern.pattern_name,
      platform: input.platform || "Unknown platform",
      savedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      analysis,
    };

    setSavedAnalyses([saved, ...savedAnalyses]);
  }

  async function copyValue(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_36%),linear-gradient(135deg,#09111f,#0f172a_55%,#111827)]">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                Bilion demo product
              </span>
              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-100">
                {price}
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Short Video Pattern Analyzer
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              A short-form video analysis workspace that turns one viral video transcript, OCR text, opening frames,
              scene changes, audio notes, caption, and metadata into a structured viral pattern report and reusable
              scripts.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Buyer</div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  AI builders, solo founders, creators, and product marketers studying why short videos convert.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Pain</div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Strong videos are visible, but the hook, retention structure, and trigger are hard to explain.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Product angle</div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Convert messy video evidence into reusable content patterns for AI business scripts and Bilion marketing.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30">
            <div className="text-sm font-bold text-cyan-200">Analysis rules</div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
              {analysisRules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-lg border border-amber-300/30 bg-amber-300/10 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">Pricing</div>
              <div className="mt-2 text-2xl font-black text-white">{price}</div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <section className="rounded-lg border border-white/10 bg-slate-900/80 p-4 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">Input workspace</h2>
              <button
                onClick={clearForCustom}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10"
              >
                Blank custom input
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => loadSample(sample)}
                  className="rounded-lg border border-white/10 bg-slate-950/70 p-3 text-left transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                >
                  <span className="block text-sm font-bold text-white">{sample.name}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {sample.platform} - {price}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4">
              {inputFields.map((field) => (
                <FieldEditor
                  key={field.key}
                  field={field}
                  value={String(input[field.key])}
                  onChange={updateField}
                />
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={runAnalysis}
                className="rounded-lg bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Analyze Pattern
              </button>
              <button
                onClick={saveAnalysis}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                Save Analysis
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-slate-900/80 p-4 shadow-xl shadow-black/20">
            <h2 className="text-lg font-black text-white">Saved examples</h2>
            <div className="mt-4 space-y-3">
              {savedAnalyses.length === 0 ? (
                <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-slate-400">
                  Saved analyses will appear here after you click Save Analysis.
                </p>
              ) : (
                savedAnalyses.map((saved) => (
                  <article key={saved.id} className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-white">{saved.title}</h3>
                      <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
                        {saved.platform}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{saved.savedAt}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {saved.analysis.final_takeaway.one_sentence_pattern}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-cyan-300/30 bg-slate-950 p-4 shadow-2xl shadow-cyan-950/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">Pattern report</h2>
                <p className="mt-1 text-sm text-slate-400">Last analyzed: {lastAnalyzed}</p>
              </div>
              <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-100">
                {price}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              <Metric label="Scroll stop" value={analysis.scores.scroll_stop_score_1_to_10} />
              <Metric label="Retention" value={analysis.scores.retention_score_1_to_10} />
              <Metric label="Clarity" value={analysis.scores.clarity_score_1_to_10} />
              <Metric label="Reusable" value={analysis.scores.reproducibility_score_1_to_10} />
              <Metric label="Commercial" value={analysis.scores.commercial_reuse_score_1_to_10} />
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <AnalysisCard title="Video Summary">
              <p>{analysis.video_summary.main_promise}</p>
              <p className="mt-2 text-slate-400">
                {analysis.video_summary.platform} / {analysis.video_summary.target_audience} / confidence{" "}
                {analysis.video_summary.confidence}
              </p>
            </AnalysisCard>

            <AnalysisCard title="First Frame Analysis">
              <p>{analysis.observations.first_frame.text_on_screen}</p>
              <p className="mt-2 text-slate-400">
                Focus: {analysis.observations.first_frame.human_or_object_focus}. Clarity{" "}
                {analysis.observations.first_frame.clarity_score_1_to_5}/5.
              </p>
            </AnalysisCard>

            <AnalysisCard title="First 1 Second Analysis">
              <p>{analysis.observations.first_1_second.what_is_understood}</p>
              <p className="mt-2 text-slate-400">Visual: {analysis.observations.first_1_second.visual_signal}</p>
            </AnalysisCard>

            <AnalysisCard title="First 3 Seconds Analysis">
              <p>{analysis.observations.first_3_seconds.reason_to_stop_scrolling}</p>
              <p className="mt-2 text-slate-400">{analysis.observations.first_3_seconds.curiosity_gap}</p>
            </AnalysisCard>

            <AnalysisCard title="Hook Pattern">
              <p>{analysis.structure_analysis.hook_pattern}</p>
            </AnalysisCard>

            <AnalysisCard title="Retention Mechanism">
              <p>{analysis.structure_analysis.retention_mechanism}</p>
              <p className="mt-2 text-slate-400">{analysis.structure_analysis.visual_pacing}</p>
            </AnalysisCard>

            <AnalysisCard title="Psychological Triggers">
              <p>{analysis.psychological_triggers.primary_trigger}</p>
              <p className="mt-2 text-slate-400">{analysis.psychological_triggers.viewer_fear_or_pain}</p>
            </AnalysisCard>

            <AnalysisCard title="Reproducible Pattern">
              <p className="font-bold text-white">{analysis.reproducible_pattern.pattern_name}</p>
              <p className="mt-2">{analysis.reproducible_pattern.template}</p>
            </AnalysisCard>

            <AnalysisCard title="Video-Specific Elements">
              <p>{analysis.video_specific_elements.unique_context}</p>
              <p className="mt-2 text-slate-400">
                Avoid copying: {analysis.reproducible_pattern.do_not_copy_elements.join(", ")}
              </p>
            </AnalysisCard>

            <AnalysisCard title="Rewrite Guidance for AI Business Content">
              <p>{analysis.rewrite_guidance.for_ai_business_content.recommended_hook}</p>
              <p className="mt-2 text-slate-400">
                {analysis.rewrite_guidance.for_ai_business_content["15_second_script"]}
              </p>
            </AnalysisCard>
          </div>

          <section className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">Rewrite Guidance for Bilion Content</h2>
              <button
                onClick={() => copyValue("bilion-script", bilionScript)}
                className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-200"
              >
                {copied === "bilion-script" ? "Copied" : "Copy Bilion Script"}
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-200">{analysis.rewrite_guidance.for_bilion_content.hook}</p>
            <ol className="mt-4 grid gap-3 md:grid-cols-2">
              {analysis.rewrite_guidance.for_bilion_content.shot_sequence.map((shot, index) => (
                <li key={shot} className="rounded-lg border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-200">
                  <span className="font-black text-cyan-200">{index + 1}. </span>
                  {shot}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm font-bold text-amber-100">{analysis.rewrite_guidance.for_bilion_content.caption}</p>
          </section>

          <section className="rounded-lg border border-white/10 bg-slate-900/80 p-4 shadow-xl shadow-black/20">
            <h2 className="text-lg font-black text-white">Scores</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              {Object.entries(analysis.scores).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-950/70 p-3">
                  <div className="text-xs text-slate-500">{key}</div>
                  <div className="mt-2 text-xl font-black text-white">{value}/10</div>
                </div>
              ))}
            </div>
          </section>

          <AnalysisCard title="Final Takeaway">
            <p className="font-bold text-white">{analysis.final_takeaway.one_sentence_pattern}</p>
            <p className="mt-2">Replicate: {analysis.final_takeaway.what_to_replicate}</p>
            <p className="mt-2 text-slate-400">Avoid: {analysis.final_takeaway.what_to_avoid}</p>
          </AnalysisCard>

          <section className="rounded-lg border border-white/10 bg-slate-950 p-4 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">Raw JSON Output</h2>
              <button
                onClick={() => copyValue("json", jsonOutput)}
                className="rounded-lg bg-white px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-slate-200"
              >
                {copied === "json" ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <pre className="mt-4 max-h-[32rem] overflow-auto rounded-lg border border-white/10 bg-black/60 p-4 text-xs leading-5 text-cyan-50">
              {jsonOutput}
            </pre>
          </section>
        </div>
      </section>
    </main>
  );
}
