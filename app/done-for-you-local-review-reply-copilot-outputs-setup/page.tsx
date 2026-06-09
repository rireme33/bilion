"use client";

import { useMemo, useState } from "react";

type BusinessType = "restaurant" | "clinic" | "salon" | "shop";
type Tone = "warm" | "professional" | "concise" | "recovery";

type BusinessProfile = {
  type: BusinessType;
  label: string;
  brandDetails: string;
  signature: string;
};

type SampleRecord = {
  id: number;
  buyer: string;
  businessType: BusinessType;
  tone: Tone;
  sourceInput: string;
  generatedOutput: string;
  status: string;
  createdDate: string;
  price: string;
  notes: string;
};

type GeneratedReply = {
  label: string;
  text: string;
};

const price = "$500 setup + $150/month";

const businessProfiles: BusinessProfile[] = [
  {
    type: "restaurant",
    label: "Restaurant",
    brandDetails:
      "Neighborhood dining room, fast apology on delays, invite guests back with a manager-reviewed fix.",
    signature: "The Harbor Table team",
  },
  {
    type: "clinic",
    label: "Clinic",
    brandDetails:
      "Calm, privacy-aware language, no medical claims, encourage direct follow-up with the front desk.",
    signature: "Care desk",
  },
  {
    type: "salon",
    label: "Salon",
    brandDetails:
      "Personal, polished tone with stylist accountability and an offer to make the next visit smoother.",
    signature: "The Studio & Co. team",
  },
  {
    type: "shop",
    label: "Small Shop",
    brandDetails:
      "Friendly retail voice, mention local ownership, route product or service issues to a named contact.",
    signature: "The shop team",
  },
];

const sampleRecords: SampleRecord[] = [
  {
    id: 1,
    buyer: "Harbor Table, independent restaurant",
    businessType: "restaurant",
    tone: "recovery",
    sourceInput:
      "2-star review: Food was good but we waited 45 minutes after our reservation and nobody checked on us. Host seemed overwhelmed. We used to love this place.",
    generatedOutput:
      "Apologize for the reservation delay, acknowledge the missed check-in, invite the guest to contact the manager, and reinforce that the team wants to earn the next visit.",
    status: "Owner review required",
    createdDate: "2026-06-09",
    price,
    notes:
      "Negative review flagged. Include a manager handoff and save delay-response language for future use.",
  },
  {
    id: 2,
    buyer: "BrightPath Clinic",
    businessType: "clinic",
    tone: "professional",
    sourceInput:
      "4-star review: Front desk was kind and my appointment started on time. Parking was confusing and I had to circle twice.",
    generatedOutput:
      "Thank the patient for the kind note, acknowledge the parking friction, and mention that directions are being clarified.",
    status: "Ready to send",
    createdDate: "2026-06-09",
    price,
    notes:
      "Positive with operational note. No private health details. Save parking language as reusable detail.",
  },
  {
    id: 3,
    buyer: "Luna Salon",
    businessType: "salon",
    tone: "warm",
    sourceInput:
      "5-star review: Maya listened to what I wanted and my color looks amazing. Booking was easy too.",
    generatedOutput:
      "Celebrate Maya, thank the client for naming the booking experience, and invite them back for the next refresh.",
    status: "Ready to send",
    createdDate: "2026-06-08",
    price,
    notes:
      "Strong testimonial. Save stylist-specific praise as proof for the validation asset.",
  },
];

const toneLabels: Record<Tone, string> = {
  warm: "Warm",
  professional: "Professional",
  concise: "Concise",
  recovery: "Service recovery",
};

const negativeSignals = [
  "1-star",
  "2-star",
  "bad",
  "terrible",
  "rude",
  "waited",
  "overcharged",
  "dirty",
  "never",
  "disappointed",
  "cold",
  "wrong",
];

function classifyReview(input: string) {
  const text = input.toLowerCase();
  const isNegative = negativeSignals.some((signal) => text.includes(signal));
  const isPositive =
    text.includes("5-star") ||
    text.includes("amazing") ||
    text.includes("kind") ||
    text.includes("great") ||
    text.includes("love");

  if (isNegative) {
    return "Negative review flagged for owner review";
  }

  if (isPositive) {
    return "Positive review ready for reply";
  }

  return "Mixed review ready for operator polish";
}

function extractDetails(input: string) {
  const text = input.toLowerCase();
  const details = [];

  if (text.includes("wait") || text.includes("reservation")) {
    details.push("reservation or wait-time issue");
  }
  if (text.includes("parking")) {
    details.push("parking friction");
  }
  if (text.includes("booking")) {
    details.push("booking experience");
  }
  if (text.includes("staff") || text.includes("host") || text.includes("front desk")) {
    details.push("staff interaction");
  }
  if (text.includes("food") || text.includes("color") || text.includes("product")) {
    details.push("core service quality");
  }

  return details.length ? details : ["specific customer experience"];
}

function buildReplies(input: string, profile: BusinessProfile, tone: Tone): GeneratedReply[] {
  const details = extractDetails(input);
  const classification = classifyReview(input);
  const isNegative = classification.includes("Negative");
  const detailText = details.join(", ");

  const opener =
    tone === "concise"
      ? "Thank you for the review."
      : tone === "professional"
        ? "Thank you for taking the time to share this feedback."
        : tone === "recovery"
          ? "Thank you for being candid with us."
          : "Thank you so much for sharing this with us.";

  const recoveryLine = isNegative
    ? "We are sorry the visit missed the mark, and we are routing this to the owner before posting."
    : "We are glad this stood out and will share it with the team.";

  return [
    {
      label: "Option 1: polished public reply",
      text: `${opener} We noticed your note about ${detailText}. ${recoveryLine} Please contact us directly so we can make the next step clear. - ${profile.signature}`,
    },
    {
      label: "Option 2: specific and on-brand",
      text: `${opener} Your experience around ${detailText} matters to our local team. ${profile.brandDetails} We appreciate the chance to respond thoughtfully. - ${profile.signature}`,
    },
    {
      label: "Option 3: short owner-safe version",
      text: `${opener} We appreciate the specifics in your review and are using them to follow up on ${detailText}. ${
        isNegative ? "A manager will review this before we post publicly." : "We will pass this along internally."
      } - ${profile.signature}`,
    },
  ];
}

export default function DoneForYouLocalReviewReplyCopilotOutputsSetupPage() {
  const [review, setReview] = useState(sampleRecords[0].sourceInput);
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const [tone, setTone] = useState<Tone>("recovery");
  const [brandDetails, setBrandDetails] = useState(businessProfiles[0].brandDetails);
  const [generatedAt, setGeneratedAt] = useState("Not generated yet");
  const [savedReplies, setSavedReplies] = useState<SampleRecord[]>(sampleRecords);
  const [copied, setCopied] = useState("");

  const activeProfile = useMemo(
    () => businessProfiles.find((profile) => profile.type === businessType) ?? businessProfiles[0],
    [businessType],
  );

  const classification = classifyReview(review);
  const isNegative = classification.includes("Negative");
  const replies = useMemo(
    () => buildReplies(review, { ...activeProfile, brandDetails }, tone),
    [activeProfile, brandDetails, review, tone],
  );

  const structuredOutput = `Classification: ${classification}
Business type: ${activeProfile.label}
Tone: ${toneLabels[tone]}
Extracted details: ${extractDetails(review).join(", ")}
Recommended next action: ${
    isNegative
      ? "Owner reviews the reply, confirms the recovery path, then posts."
      : "Operator copies the preferred reply, posts it, and saves the reusable phrasing."
  }
Price: ${price}

${replies.map((reply) => `${reply.label}\n${reply.text}`).join("\n\n")}`;

  function loadSample(record: SampleRecord) {
    setReview(record.sourceInput);
    setBusinessType(record.businessType);
    setTone(record.tone);
    const profile = businessProfiles.find((item) => item.type === record.businessType);
    setBrandDetails(profile?.brandDetails ?? brandDetails);
    setGeneratedAt("Sample loaded");
  }

  function generateOutput() {
    setGeneratedAt(new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }));
  }

  function saveReply() {
    const nextRecord: SampleRecord = {
      id: savedReplies.length + 1,
      buyer: `${activeProfile.label} delivery client`,
      businessType,
      tone,
      sourceInput: review,
      generatedOutput: replies[0].text,
      status: isNegative ? "Owner review required" : "Ready to send",
      createdDate: new Date().toISOString().slice(0, 10),
      price,
      notes: `${classification}. Saved brand detail: ${brandDetails}`,
    };

    setSavedReplies([nextRecord, ...savedReplies]);
  }

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#171717]">
      <section className="border-b border-[#ded6ca] bg-[#fffaf2]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-10">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f6255]">
                Done-for-you implementation service
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-[#111111] sm:text-5xl">
                Done-for-You Local Review Reply Copilot Outputs Setup
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#554d45]">
                For businesses that want structured outputs, next actions, and saved records for restaurants without buying,
                configuring, or maintaining another tool. Owners know reviews matter, but consistent replies get delayed.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Buyer", "Restaurants, clinics, salons, and small shops that want the result delivered for them."],
                ["Pain", "Review replies are repetitive, visible, and often postponed during busy service windows."],
                ["Product angle", "AI works behind the scenes to turn messy review notes into polished deliverables."],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-[#ded6ca] bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a4b2f]">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#342f2a]">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-lg border border-[#111111] bg-[#151515] p-5 text-white shadow-xl">
            <p className="text-sm font-medium text-[#c7f1d8]">Commercial offer</p>
            <p className="mt-2 text-3xl font-semibold">{price}</p>
            <p className="mt-3 text-sm leading-6 text-[#d7d4cf]">
              Setup includes intake, brand details, sample outputs, saved reply records, and a recurring delivery workflow.
            </p>
            <div className="mt-5 rounded-md bg-[#f4d35e] p-4 text-[#171717]">
              <p className="text-sm font-semibold">48h validation asset</p>
              <p className="mt-1 text-sm">
                One before/after sample plus outreach copy for 20 likely local buyers.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-5">
          <div className="rounded-lg border border-[#ded6ca] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Sample data selector</h2>
              <span className="rounded-full bg-[#e6f4ec] px-3 py-1 text-xs font-semibold text-[#13643a]">
                Mock records only
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {sampleRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => loadSample(record)}
                  className="rounded-md border border-[#ded6ca] bg-[#fffaf2] p-3 text-left transition hover:border-[#8a4b2f] hover:bg-[#fff4df]"
                >
                  <span className="block text-sm font-semibold text-[#171717]">{record.buyer}</span>
                  <span className="mt-1 block text-xs text-[#6f6255]">
                    {record.status} | {record.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#ded6ca] bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Client intake</h2>
            <label className="mt-4 block text-sm font-semibold text-[#342f2a]" htmlFor="review">
              Paste a customer review
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              className="mt-2 min-h-36 w-full resize-y rounded-md border border-[#cfc5b8] bg-[#fffdf8] p-3 text-sm leading-6 outline-none ring-[#8a4b2f] focus:ring-2"
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-[#342f2a]">
                Business type
                <select
                  value={businessType}
                  onChange={(event) => {
                    const nextType = event.target.value as BusinessType;
                    setBusinessType(nextType);
                    const nextProfile = businessProfiles.find((profile) => profile.type === nextType);
                    setBrandDetails(nextProfile?.brandDetails ?? brandDetails);
                  }}
                  className="mt-2 w-full rounded-md border border-[#cfc5b8] bg-white p-3 text-sm"
                >
                  {businessProfiles.map((profile) => (
                    <option key={profile.type} value={profile.type}>
                      {profile.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#342f2a]">
                Reply tone
                <select
                  value={tone}
                  onChange={(event) => setTone(event.target.value as Tone)}
                  className="mt-2 w-full rounded-md border border-[#cfc5b8] bg-white p-3 text-sm"
                >
                  {Object.entries(toneLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block text-sm font-semibold text-[#342f2a]" htmlFor="brand">
              Reusable brand details
            </label>
            <textarea
              id="brand"
              value={brandDetails}
              onChange={(event) => setBrandDetails(event.target.value)}
              className="mt-2 min-h-24 w-full resize-y rounded-md border border-[#cfc5b8] bg-[#fffdf8] p-3 text-sm leading-6 outline-none ring-[#8a4b2f] focus:ring-2"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={generateOutput}
                className="rounded-md bg-[#111111] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
              >
                Generate three reply options
              </button>
              <button
                onClick={saveReply}
                className="rounded-md border border-[#111111] bg-white px-4 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#f1ece5]"
              >
                Save reusable reply record
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-[#111111] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Structured output preview</h2>
                <p className="mt-1 text-sm text-[#6f6255]">Generated status: {generatedAt}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isNegative ? "bg-[#ffe0dc] text-[#9d2719]" : "bg-[#e6f4ec] text-[#13643a]"
                }`}
              >
                {classification}
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {replies.map((reply) => (
                <article key={reply.label} className="rounded-md border border-[#ded6ca] bg-[#fffaf2] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">{reply.label}</h3>
                    <button
                      onClick={() => copyText(reply.label, reply.text)}
                      className="rounded-md bg-[#2f6f57] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#245742]"
                    >
                      {copied === reply.label ? "Copied" : "Copy reply"}
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#342f2a]">{reply.text}</p>
                </article>
              ))}
            </div>

            <div className="mt-4 rounded-md bg-[#f1ece5] p-4">
              <h3 className="text-sm font-semibold">Recommended next actions</h3>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-[#342f2a]">
                <li>{isNegative ? "Owner reviews the negative-review flag before posting." : "Operator posts the preferred reply today."}</li>
                <li>Save the brand detail and extracted issue for recurring monthly delivery.</li>
                <li>Use this proof sample in the 48h validation outreach at {price}.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-[#ded6ca] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Copy/export commercial output</h2>
              <button
                onClick={() => copyText("full-output", structuredOutput)}
                className="rounded-md bg-[#111111] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#333333]"
              >
                {copied === "full-output" ? "Copied" : "Copy full output"}
              </button>
            </div>
            <pre className="mt-4 max-h-64 overflow-auto rounded-md bg-[#151515] p-4 text-xs leading-5 text-[#f5f1e8]">
              {structuredOutput}
            </pre>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="rounded-lg border border-[#ded6ca] bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Saved records and examples</h2>
          <div className="mt-4 grid gap-3">
            {savedReplies.slice(0, 5).map((record) => (
              <article key={`${record.id}-${record.createdDate}`} className="rounded-md border border-[#ded6ca] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{record.buyer}</p>
                  <span className="rounded-full bg-[#f1ece5] px-3 py-1 text-xs font-semibold text-[#6f6255]">
                    {record.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#6f6255]">
                  {record.createdDate} | {record.price}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#342f2a]">{record.generatedOutput}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#111111] bg-[#fffaf2] p-4 shadow-sm">
          <h2 className="text-lg font-semibold">48h validation asset</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-md border border-[#ded6ca] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a4b2f]">Before</p>
              <p className="mt-2 text-sm leading-6 text-[#342f2a]">
                Messy review notes, delayed owner approval, no saved reply record, and no consistent brand detail.
              </p>
            </div>
            <div className="rounded-md border border-[#ded6ca] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2f6f57]">After</p>
              <p className="mt-2 text-sm leading-6 text-[#342f2a]">
                Three reply options, negative-review flag, owner next action, saved reusable details, and a record ready for monthly delivery.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-md bg-[#151515] p-4 text-white">
            <p className="text-sm font-semibold">Outreach copy</p>
            <p className="mt-2 text-sm leading-6 text-[#e9e3d8]">
              I made a before/after sample showing how your review replies could be handled for you every month. The offer is
              {" "}
              {price}: we set up the brand details, turn messy review notes into three polished replies, flag anything that needs
              owner review, and keep saved records so your team is not managing another tool. Which part would you want done for
              you this week?
            </p>
            <button
              onClick={() =>
                copyText(
                  "outreach",
                  `I made a before/after sample showing how your review replies could be handled for you every month. The offer is ${price}: we set up the brand details, turn messy review notes into three polished replies, flag anything that needs owner review, and keep saved records so your team is not managing another tool. Which part would you want done for you this week?`,
                )
              }
              className="mt-4 rounded-md bg-[#f4d35e] px-3 py-2 text-xs font-semibold text-[#171717] transition hover:bg-[#e8c748]"
            >
              {copied === "outreach" ? "Copied" : "Copy outreach copy"}
            </button>
          </div>

          <ol className="mt-4 space-y-2 text-sm leading-6 text-[#342f2a]">
            <li>1. Create one before/after sample from the current generated output.</li>
            <li>2. Send the sample to 20 likely buyers with the {price} offer.</li>
            <li>3. Ask which part they want done for them this week and refine the package.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
