"use client";

import { useMemo, useState } from "react";

type Intent = "reply" | "decline" | "follow up";
type Tone = "concise" | "friendly" | "direct";

const toneOpeners: Record<Tone, string> = {
  concise: "Thanks for the note.",
  friendly: "Thanks for reaching out. I appreciate the context.",
  direct: "Thanks. I read through your message.",
};

const intentLines: Record<Intent, string> = {
  reply:
    "This sounds useful. I can take a look and send a clear answer once I confirm the details.",
  decline:
    "I do not think I can take this on right now, but I wanted to reply clearly instead of leaving it open.",
  "follow up":
    "I am following up so this does not get lost. Could you send the missing detail or confirm the next step?",
};

const taskLabels: Record<Intent, string> = {
  reply: "Send a clear reply and confirm the next step.",
  decline: "Close the loop politely and remove it from the active list.",
  "follow up": "Check for a response and bump the thread if needed.",
};

export default function ReplyTaskPage() {
  const [message, setMessage] = useState("");
  const [intent, setIntent] = useState<Intent>("reply");
  const [tone, setTone] = useState<Tone>("concise");
  const [copied, setCopied] = useState("");

  const outputs = useMemo(() => {
    const trimmed = message.trim();
    const context = trimmed
      ? `\n\nContext I understood: ${trimmed.slice(0, 220)}${trimmed.length > 220 ? "..." : ""}`
      : "";

    const cleanReply = `${toneOpeners[tone]}\n\n${intentLines[intent]}${context}\n\nBest,`;
    const nextTask = `${taskLabels[intent]}${trimmed ? " Use the original message as the source of truth." : " Paste the messy message first, then send the reply."}`;
    const reminder =
      intent === "decline"
        ? "No follow-up needed unless they reply with a new request."
        : "Follow up in 2 business days if there is no response.";

    return {
      cleanReply,
      nextTask,
      reminder,
    };
  }, [intent, message, tone]);

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 900);
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-14">
        <header className="mb-8 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <a
              href="/products"
              className="text-sm font-semibold text-zinc-500 transition hover:text-white"
            >
              Back to products
            </a>

            <div className="mt-8 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              Built with Bilion
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
              ReplyTask
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-400">
              Turn one messy message into a reply and next task.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101011] px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Price
            </div>
            <div className="mt-1 text-2xl font-black">$9 one-time</div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-2xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
            <label className="block">
              <span className="text-sm font-bold text-zinc-200">
                Messy email or DM
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={10}
                placeholder="Paste the message that is sitting in your inbox..."
                className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-white/40"
              />
            </label>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <OptionGroup
                label="Reply intent"
                value={intent}
                options={["reply", "decline", "follow up"]}
                onChange={(value) => setIntent(value as Intent)}
              />
              <OptionGroup
                label="Tone"
                value={tone}
                options={["concise", "friendly", "direct"]}
                onChange={(value) => setTone(value as Tone)}
              />
            </div>
          </section>

          <section className="grid gap-4">
            <OutputCard
              label="Clean reply"
              value={outputs.cleanReply}
              copied={copied === "Clean reply"}
              onCopy={() => copy("Clean reply", outputs.cleanReply)}
            />
            <OutputCard
              label="Next task"
              value={outputs.nextTask}
              copied={copied === "Next task"}
              onCopy={() => copy("Next task", outputs.nextTask)}
            />
            <OutputCard
              label="Follow-up reminder"
              value={outputs.reminder}
              copied={copied === "Follow-up reminder"}
              onCopy={() => copy("Follow-up reminder", outputs.reminder)}
            />
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/products"
            className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Back to products
          </a>
          <a
            href="/goldmine"
            className="rounded-2xl border border-white/10 px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-white/[0.04]"
          >
            Try another idea
          </a>
        </div>
      </section>
    </main>
  );
}

function OptionGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="text-sm font-bold text-zinc-200">{label}</div>
      <div className="mt-3 grid gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={[
              "rounded-2xl border px-4 py-3 text-left text-sm font-bold capitalize transition",
              value === option
                ? "border-white bg-white text-black"
                : "border-white/10 bg-black text-zinc-300 hover:bg-white/[0.04] hover:text-white",
            ].join(" ")}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function OutputCard({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#101011] p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
          {label}
        </h2>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-100">
        {value}
      </pre>
    </article>
  );
}
