"use client";

import { useMemo, useRef, useState } from "react";

type Score = {
  score: number;
  reasoning: string;
};

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
    scroll_stop_score: Score;
    retention_score: Score;
    clarity_score: Score;
    reproducibility_score: Score;
    commercial_opportunity_score: Score;
  };
  gpt_gap: {
    why_gpt_alone_is_not_enough: string;
    system_advantage: string;
  };
};

type AnalyzeResponse = {
  ok?: boolean;
  mode?: string;
  warning?: string;
  transcript?: string;
  frameCount?: number;
  analysis?: VideoPatternAnalysis;
  error?: string;
};

type SavedAnalysis = {
  id: number;
  fileName: string;
  savedAt: string;
  mode: string;
  analysis: VideoPatternAnalysis;
};

const price = "$19 one-time or $49 creator lab";

const fallbackAnalysis: VideoPatternAnalysis = {
  summary: {
    product_name: "Bilion",
    niche: "AI builders",
    offer: price,
    platform_fit: "TikTok, Reels, and Shorts where the opening frame shows a useful transformation.",
    transcript_source: "Demo state before upload.",
  },
  stop_scroll: {
    why_it_stops_the_scroll:
      "The first frame should make the viewer understand the result or pain before they understand the full context.",
    primary_hook: "Show the outcome first, then reveal the system.",
    hook_category: "Transformation",
    reasoning: "The product is designed to prioritize 0, 1, 2, and 3 second frames.",
  },
  retention: {
    why_viewers_keep_watching:
      "Viewers stay when there is an unresolved gap between what they see and how the creator achieved it.",
    pacing_notes: "First three seconds should contain a visual result, a text label, and a mechanism hint.",
    retention_mechanism: "Open loop plus system reveal.",
    reasoning: "Short videos need a reason to keep watching before the viewer hears the full explanation.",
  },
  analysis: {
    visual_analysis: "Upload a video to inspect the opening frames, visuals, subtitles, and pacing.",
    speech_analysis: "OpenAI transcription appears here after analysis.",
    subtitle_analysis: "Frame extraction helps detect whether the video works without sound.",
    psychological_trigger: "Competence shortcut.",
    viewer_desire: "Repeat viral structures without guessing.",
    viewer_fear: "Copying the wrong part of a viral video.",
    silent_viewing_effectiveness: "Pending video upload.",
  },
  pattern: {
    reproducible_pattern: "Outcome-first opener, pain label, fast mechanism reveal, repeatable rewrite.",
    what_to_copy: ["Opening contrast", "Specific hook", "Mechanism reveal"],
    what_not_to_copy: ["Private assets", "Exact creator language", "Unverified claims"],
  },
  bilion_rewrite: {
    bilion_version: "Most people collect AI tools. Bilion turns AI signals into products.",
    ai_builder_version: "Stop saving viral videos. Extract the system and build from the pattern.",
    vibe_coder_version: "I pulled the hook, rebuilt the structure, and shipped the product screen.",
    founder_version: "The content idea is the buyer pain hiding inside the video.",
    fifteen_second_script:
      "0-2s: Show the viral opening. 2-5s: Label why it works. 5-10s: Extract the reusable pattern. 10-15s: rewrite it for Bilion.",
    thirty_second_script:
      "0-3s: Show the first frame. 3-8s: Explain the hook. 8-15s: Identify retention. 15-23s: list what to copy and avoid. 23-30s: present the Bilion rewrite.",
    caption: "GPT analyzes. Video Pattern Lab systemizes.",
    cta: "Try Video Pattern Lab for $19 one-time or $49 creator lab.",
  },
  scores: {
    scroll_stop_score: { score: 8, reasoning: "Outcome-first hooks stop the scroll when the first frame is specific." },
    retention_score: { score: 7, reasoning: "Retention depends on how quickly the mechanism is revealed." },
    clarity_score: { score: 7, reasoning: "Clarity increases when speech, subtitle, and visual signals align." },
    reproducibility_score: { score: 9, reasoning: "The structure can be adapted across niches." },
    commercial_opportunity_score: { score: 8, reasoning: "The pattern can become scripts, captions, and offers." },
  },
  gpt_gap: {
    why_gpt_alone_is_not_enough: "GPT analyzes, but users repeat the same workflow every time.",
    system_advantage: "Video Pattern Lab systemizes upload, frame extraction, transcript, scoring, rewrites, and saved analyses.",
  },
};

function extractVideoFrames(file: File) {
  return new Promise<string[]>((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const objectUrl = URL.createObjectURL(file);
    const frames: string[] = [];
    let times: number[] = [];
    let index = 0;

    if (!context) {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Canvas is unavailable for frame extraction."));
      return;
    }

    const canvasContext = context;

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    function cleanup() {
      URL.revokeObjectURL(objectUrl);
    }

    function captureCurrentFrame() {
      canvas.width = Math.min(video.videoWidth || 720, 960);
      canvas.height = Math.round((canvas.width / (video.videoWidth || 720)) * (video.videoHeight || 1280));
      canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL("image/jpeg", 0.72));
    }

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 4;
      const required = [0, 1, 2, 3].filter((time) => time <= duration);
      const representative = [0.25, 0.5, 0.75]
        .map((ratio) => Math.max(0, Math.min(duration - 0.1, duration * ratio)))
        .filter((time) => time >= 0);
      times = Array.from(new Set([...required, ...representative].map((time) => Number(time.toFixed(2))))).slice(0, 8);
      video.currentTime = times[index] ?? 0;
    };

    video.onseeked = () => {
      try {
        captureCurrentFrame();
        index += 1;

        if (index >= times.length) {
          cleanup();
          resolve(frames);
          return;
        }

        video.currentTime = times[index];
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Could not load the uploaded video for frame extraction."));
    };
  });
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#101827] p-4 shadow-xl shadow-black/20">
      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">{title}</h3>
      <div className="mt-3 text-sm leading-6 text-slate-200">{children}</div>
    </section>
  );
}

function ScoreCard({ label, score }: { label: string; score: Score }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      <div className="flex items-end justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</div>
        <div className="text-3xl font-black text-white">{score.score}</div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">{score.reasoning}</p>
    </div>
  );
}

export default function VideoPatternLabPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [productName, setProductName] = useState("Bilion");
  const [niche, setNiche] = useState("AI tools");
  const [offer, setOffer] = useState(price);
  const [frames, setFrames] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<VideoPatternAnalysis>(fallbackAnalysis);
  const [status, setStatus] = useState("Upload an MP4, MOV, or short video file to begin.");
  const [warning, setWarning] = useState("");
  const [mode, setMode] = useState("demo");
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [copied, setCopied] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const jsonOutput = useMemo(() => JSON.stringify(analysis, null, 2), [analysis]);

  const fullScript = `${analysis.bilion_rewrite.bilion_version}

AI builder version:
${analysis.bilion_rewrite.ai_builder_version}

Vibe coder version:
${analysis.bilion_rewrite.vibe_coder_version}

Founder version:
${analysis.bilion_rewrite.founder_version}

15-second script:
${analysis.bilion_rewrite.fifteen_second_script}

30-second script:
${analysis.bilion_rewrite.thirty_second_script}

Caption:
${analysis.bilion_rewrite.caption}

CTA:
${analysis.bilion_rewrite.cta}`;

  function handleFile(nextFile: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setWarning("");
    setTranscript("");
    setFrames([]);

    if (!nextFile) {
      setFile(null);
      setPreviewUrl("");
      setStatus("Upload an MP4, MOV, or short video file to begin.");
      return;
    }

    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setStatus(`Ready to analyze ${nextFile.name}.`);
  }

  async function copyValue(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  async function analyzeVideo() {
    if (!file) {
      setWarning("Upload a short video first.");
      return;
    }

    setIsAnalyzing(true);
    setWarning("");
    setStatus("Extracting 0s, 1s, 2s, 3s, and representative frames...");

    try {
      const extractedFrames = await extractVideoFrames(file);
      setFrames(extractedFrames);
      setStatus("Sending frames and video to the isolated analysis endpoint...");

      const body = new FormData();
      body.append("video", file, file.name);
      body.append("productName", productName);
      body.append("niche", niche);
      body.append("offer", offer);
      body.append("frames", JSON.stringify(extractedFrames));

      const response = await fetch("/api/video-pattern-lab/analyze", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as AnalyzeResponse;

      if (!response.ok || data.error || !data.analysis) {
        throw new Error(data.error || "Video analysis failed.");
      }

      setAnalysis(data.analysis);
      setTranscript(data.transcript || "");
      setMode(data.mode || "openai");
      setWarning(data.warning || "");
      setStatus(`Analysis complete. ${data.frameCount ?? extractedFrames.length} frames processed.`);
    } catch (error) {
      setWarning(error instanceof Error ? error.message : "Analysis failed.");
      setStatus("Analysis could not complete. The demo result is still available below.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function saveAnalysis() {
    const saved: SavedAnalysis = {
      id: savedAnalyses.length + 1,
      fileName: file?.name || "unsaved-video.mp4",
      savedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      mode,
      analysis,
    };

    setSavedAnalyses([saved, ...savedAnalyses]);
  }

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,#0e749033,transparent_35%),linear-gradient(135deg,#070a12,#0f172a_55%,#111827)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                Bilion showcase product
              </span>
              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-100">
                {price}
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">Video Pattern Lab</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold text-cyan-100">
              Upload a short-form video and discover why it works.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Built for creators, AI builders, vibe coders, solo founders, and product marketers who want repeatable
              short-form content systems. GPT analyzes. Video Pattern Lab systemizes.
            </p>
          </div>

          <aside className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white">Why GPT alone is not enough</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              GPT can analyze a video, but you repeat the same workflow every time: pull frames, transcribe audio, inspect
              subtitles, score hooks, rewrite scripts, and save patterns. Video Pattern Lab turns that into one reusable
              system.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="text-xs text-slate-500">Upload</div>
                <div className="mt-1 text-sm font-bold">MP4 / MOV / short video</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="text-xs text-slate-500">AI process</div>
                <div className="mt-1 text-sm font-bold">Transcript + vision frames</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-5">
          <section className="rounded-lg border border-white/10 bg-[#101827] p-4 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">Upload</h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Choose video
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/*"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
              className="hidden"
            />
            <div className="mt-4 rounded-lg border border-dashed border-white/15 bg-black/25 p-4">
              {previewUrl ? (
                <video src={previewUrl} controls className="aspect-video w-full rounded-lg bg-black object-contain" />
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-video w-full items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-slate-400"
                >
                  Upload video file
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-400">{status}</p>
            {warning ? (
              <p className="mt-3 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
                {warning}
              </p>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Product name</span>
                <input
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm outline-none ring-cyan-300/30 focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Niche</span>
                <input
                  value={niche}
                  onChange={(event) => setNiche(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm outline-none ring-cyan-300/30 focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Offer</span>
                <input
                  value={offer}
                  onChange={(event) => setOffer(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-sm outline-none ring-cyan-300/30 focus:ring-2"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={analyzeVideo}
                disabled={isAnalyzing}
                className="rounded-lg bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze video"}
              </button>
              <button
                onClick={saveAnalysis}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                Save analysis
              </button>
            </div>
          </section>

          <Panel title="Video preview frames">
            {frames.length ? (
              <div className="grid grid-cols-2 gap-3">
                {frames.map((frame, index) => (
                  <figure key={`${frame.slice(0, 32)}-${index}`} className="rounded-lg border border-white/10 bg-black/30 p-2">
                    <img src={frame} alt={`Extracted video frame ${index + 1}`} className="aspect-video w-full rounded object-cover" />
                    <figcaption className="mt-2 text-xs text-slate-500">
                      {index < 4 ? `${index}s frame` : `Representative ${index - 3}`}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Extracted 0s, 1s, 2s, 3s, and representative frames appear here.</p>
            )}
          </Panel>

          <Panel title="Saved analyses">
            {savedAnalyses.length ? (
              <div className="space-y-3">
                {savedAnalyses.map((saved) => (
                  <article key={saved.id} className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-white">{saved.fileName}</h3>
                      <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                        {saved.mode}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{saved.savedAt}</p>
                    <p className="mt-3 text-sm text-slate-300">{saved.analysis.stop_scroll.primary_hook}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Saved analyses stay in local React state during this session.</p>
            )}
          </Panel>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-cyan-300/30 bg-slate-950 p-4 shadow-2xl shadow-cyan-950/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">Analysis</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Mode: {mode} / {price}
                </p>
              </div>
              <button
                onClick={() => copyValue("json", jsonOutput)}
                className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-200"
              >
                {copied === "json" ? "Copied" : "Copy analysis JSON"}
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              <ScoreCard label="Scroll Stop" score={analysis.scores.scroll_stop_score} />
              <ScoreCard label="Retention" score={analysis.scores.retention_score} />
              <ScoreCard label="Clarity" score={analysis.scores.clarity_score} />
              <ScoreCard label="Reusable" score={analysis.scores.reproducibility_score} />
              <ScoreCard label="Commercial" score={analysis.scores.commercial_opportunity_score} />
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="Why it stops the scroll">
              <p className="font-bold text-white">{analysis.stop_scroll.primary_hook}</p>
              <p className="mt-2">{analysis.stop_scroll.why_it_stops_the_scroll}</p>
              <p className="mt-2 text-cyan-100">Hook category: {analysis.stop_scroll.hook_category}</p>
            </Panel>
            <Panel title="Why viewers keep watching">
              <p>{analysis.retention.why_viewers_keep_watching}</p>
              <p className="mt-2 text-slate-400">{analysis.retention.retention_mechanism}</p>
            </Panel>
            <Panel title="Visual analysis">
              <p>{analysis.analysis.visual_analysis}</p>
            </Panel>
            <Panel title="Speech analysis">
              <p>{analysis.analysis.speech_analysis}</p>
            </Panel>
            <Panel title="Subtitle analysis">
              <p>{analysis.analysis.subtitle_analysis}</p>
            </Panel>
            <Panel title="Psychological trigger">
              <p>{analysis.analysis.psychological_trigger}</p>
              <p className="mt-2 text-slate-400">Desire: {analysis.analysis.viewer_desire}</p>
              <p className="mt-2 text-slate-400">Fear: {analysis.analysis.viewer_fear}</p>
            </Panel>
          </div>

          <Panel title="Pattern">
            <p className="font-bold text-white">{analysis.pattern.reproducible_pattern}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-100">What to copy</div>
                <ul className="mt-2 space-y-2 text-sm">
                  {analysis.pattern.what_to_copy.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-rose-100">What NOT to copy</div>
                <ul className="mt-2 space-y-2 text-sm">
                  {analysis.pattern.what_not_to_copy.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>

          <section className="rounded-lg border border-amber-300/30 bg-amber-300/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">Scripts</h2>
              <button
                onClick={() => copyValue("scripts", fullScript)}
                className="rounded-lg bg-amber-200 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-amber-100"
              >
                {copied === "scripts" ? "Copied" : "Copy scripts"}
              </button>
            </div>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              <Panel title="Bilion version">
                <p>{analysis.bilion_rewrite.bilion_version}</p>
              </Panel>
              <Panel title="AI builder version">
                <p>{analysis.bilion_rewrite.ai_builder_version}</p>
              </Panel>
              <Panel title="Vibe coder version">
                <p>{analysis.bilion_rewrite.vibe_coder_version}</p>
              </Panel>
              <Panel title="Founder version">
                <p>{analysis.bilion_rewrite.founder_version}</p>
              </Panel>
              <Panel title="15-second script">
                <p>{analysis.bilion_rewrite.fifteen_second_script}</p>
              </Panel>
              <Panel title="30-second script">
                <p>{analysis.bilion_rewrite.thirty_second_script}</p>
              </Panel>
            </div>
          </section>

          <Panel title="Captions">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-white">{analysis.bilion_rewrite.caption}</p>
                <p className="mt-2 text-slate-400">{analysis.bilion_rewrite.cta}</p>
              </div>
              <button
                onClick={() => copyValue("caption", `${analysis.bilion_rewrite.caption}\n\n${analysis.bilion_rewrite.cta}`)}
                className="rounded-lg border border-white/15 px-3 py-2 text-xs font-black text-white transition hover:bg-white/10"
              >
                {copied === "caption" ? "Copied" : "Copy caption"}
              </button>
            </div>
          </Panel>

          <Panel title="Transcript">
            <pre className="max-h-52 overflow-auto whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-xs leading-5 text-slate-300">
              {transcript || "Transcript appears after OpenAI transcription or graceful fallback."}
            </pre>
          </Panel>

          <Panel title="Raw JSON">
            <pre className="max-h-[28rem] overflow-auto rounded-lg bg-black/40 p-3 text-xs leading-5 text-cyan-50">
              {jsonOutput}
            </pre>
          </Panel>
        </div>
      </section>
    </main>
  );
}
