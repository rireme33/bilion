import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FounderPageProps = {
  searchParams: Promise<{
    access?: string | string[];
  }>;
};

const fields = [
  {
    id: "businessWin",
    label: "Real business win",
    placeholder: "Example: A founder sold a tiny AI SEO tool to agencies.",
  },
  {
    id: "buyer",
    label: "Buyer",
    placeholder: "Example: small agencies, solo founders, local businesses",
  },
  {
    id: "paidPain",
    label: "Paid pain",
    placeholder: "What painful workflow did people pay to solve?",
  },
  {
    id: "whatWorked",
    label: "What worked",
    placeholder: "What positioning, feature, channel, or offer worked?",
  },
  {
    id: "sourceUrl",
    label: "Source URL",
    placeholder: "https://...",
  },
  {
    id: "notes",
    label: "Notes",
    placeholder: "Extra context, constraints, proof, objections, or angles",
  },
];

export default async function FounderPage({ searchParams }: FounderPageProps) {
  const params = await searchParams;
  const access = Array.isArray(params.access) ? params.access[0] : params.access;

  if (access) {
    redirect(`/api/founder/access?access=${encodeURIComponent(access)}`);
  }

  const hasFounderAccess =
    (await cookies()).get("founder_access")?.value === "1";

  if (!hasFounderAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-white">
        <h1 className="text-xl font-black tracking-tight">
          Founder access required
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-14">
        <header className="mb-8">
          <a
            href="/"
            className="text-sm font-semibold text-zinc-500 transition hover:text-white"
          >
            Back to Bilion
          </a>

          <div className="mt-8 inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
            Founder Mode
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Turn real startup wins into Founder Launch Kits.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Private Bilion workspace for the founder. Turn one real startup win
            into a tiny product you can build with Code X, without changing the
            public free preview or checkout flow.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
            <div className="mb-5">
              <div className="text-sm font-bold text-zinc-200">
                Startup pattern input
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Use one real win. The kit gets sharper when the paid pain and
                what worked are concrete.
              </p>
            </div>

            <form id="founder-form" className="space-y-4">
              {fields.map((field) => (
                <label key={field.id} className="block">
                  <span className="text-sm font-medium text-zinc-300">
                    {field.label}
                  </span>
                  <textarea
                    id={field.id}
                    rows={field.id === "notes" ? 5 : 3}
                    placeholder={field.placeholder}
                    className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-white/40"
                  />
                </label>
              ))}

              <button
                type="submit"
                className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                Generate Founder Launch Kit
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#101011] p-5 shadow-2xl md:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-bold text-zinc-200">
                  Founder Launch Kit
                </div>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Generated locally from your inputs. No API call is used.
                </p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-500">
                Private
              </div>
            </div>

            <div id="output" className="grid gap-4">
              <EmptyState />
            </div>
          </section>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: `
const form = document.getElementById("founder-form");
const output = document.getElementById("output");
const ids = ["businessWin", "buyer", "paidPain", "whatWorked", "sourceUrl", "notes"];

function value(id) {
  const el = document.getElementById(id);
  return el && el.value.trim() ? el.value.trim() : "";
}

function fallback(text, fallbackText) {
  return text || fallbackText;
}

function esc(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function section(label, body) {
  return '<article class="rounded-2xl border border-white/10 bg-black/40 p-4">' +
    '<div class="flex items-start justify-between gap-3">' +
    '<h2 class="text-xs font-bold uppercase tracking-wide text-zinc-500">' + esc(label) + '</h2>' +
    '<button type="button" data-copy="' + esc(body) + '" class="copy-btn shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300 transition hover:bg-white/[0.04] hover:text-white">Copy</button>' +
    '</div>' +
    '<pre class="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-100">' + esc(body) + '</pre>' +
    '</article>';
}

function buildKit(data) {
  const win = fallback(data.businessWin, "A small AI product made money by solving a narrow workflow.");
  const buyer = fallback(data.buyer, "solo founders and small service businesses");
  const pain = fallback(data.paidPain, "They have a repeated manual workflow that costs time or lost revenue.");
  const worked = fallback(data.whatWorked, "The product won by staying narrow, fast to try, and easy to buy.");
  const source = fallback(data.sourceUrl, "Source not provided");
  const notes = fallback(data.notes, "No extra notes.");
  const idea = "A focused AI assistant for " + buyer + " that turns " + pain + " into a done-for-you workflow.";
  const price = "$19 one-time for the first version, then $9/mo if users need it weekly.";

  return [
    ["Why people paid", "People paid because " + pain + "\\n\\nThe win: " + win + "\\n\\nThe key signal is urgency: the buyer can understand the value without a long demo."],
    ["What to steal", "Steal the narrow buyer, the simple promise, and the proof-backed workflow.\\n\\nUse this angle: " + worked + "\\n\\nSource: " + source],
    ["What to change", "Make it smaller, more specific, and easier to validate in 48 hours. Avoid accounts, dashboards, analytics, subscriptions, and complex settings until buyers ask."],
    ["Tiny product idea", idea],
    ["No-API version", "Build a form-based version that uses fixed templates first. Inputs: buyer, pain, context, tone, and desired output. Output: 3 useful drafts with copy buttons."],
    ["CodeX build prompt", "Build a clean dark Bilion-style web app for " + buyer + ". The app should solve this paid pain: " + pain + ". Inputs: business context, buyer, pain, notes, tone, and source. Outputs: why people paid, product idea, landing copy, pricing, X posts, DM scripts, and a 48-hour validation plan. Do not add auth, database, webhooks, or new dependencies. Add copy buttons for every output."],
    ["Landing page copy", "Headline: Solve " + pain + " in minutes.\\n\\nSubhead: A tiny AI workflow for " + buyer + " inspired by real startup success patterns.\\n\\nCTA: Try the workflow\\n\\nProof angle: Based on this win - " + win],
    ["Gumroad product description", "A tiny launch-ready AI workflow for " + buyer + ". It helps with: " + pain + "\\n\\nYou get a simple tool concept, copy-ready outputs, and a 48-hour validation plan. Built for founders who want to test demand before overbuilding.\\n\\nNotes: " + notes],
    ["X posts 5", "1. I found a tiny paid pain for " + buyer + ": " + pain + ". Building a small AI tool around it.\\n\\n2. The pattern: " + worked + ". The product does not need to be big. It needs to remove one painful workflow.\\n\\n3. Most builders start with features. I am starting with a buyer, a paid pain, and a 48-hour validation test.\\n\\n4. Tiny MVP: " + idea + "\\n\\n5. If 3 people ask to use this after seeing a manual sample, I will build the first version."],
    ["DM messages 5", "1. Hey - saw you work with " + buyer + ". I am testing a tiny workflow for this pain: " + pain + ". Want me to run one sample?\\n\\n2. Quick question: do you currently handle this manually - " + pain + "?\\n\\n3. I am validating a small AI tool for " + buyer + ". If I send a free sample, would you tell me if it is useful?\\n\\n4. I noticed this pattern from a real business win: " + win + ". Curious if the same pain shows up in your work.\\n\\n5. If this saved you time weekly, would " + price + " feel reasonable?"],
    ["Price", price],
    ["48-hour sales plan", "Hour 0-4: Write the manual sample workflow and pick 20 target buyers.\\nHour 4-12: Send 20 DMs with one concrete sample offer.\\nHour 12-24: Generate free samples for anyone who replies.\\nHour 24-36: Ask if they would pay " + price + ".\\nHour 36-48: Build only if 3+ people ask to use it again or agree to pay."]
  ];
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  const data = {};
  ids.forEach(function(id) {
    data[id] = value(id);
  });

  output.innerHTML = buildKit(data)
    .map(function(item) {
      return section(item[0], item[1]);
    })
    .join("");
});

document.addEventListener("click", async function(event) {
  const target = event.target;
  if (!target || !target.matches(".copy-btn")) return;

  const text = target.getAttribute("data-copy") || "";
  await navigator.clipboard.writeText(text);
  const previous = target.textContent;
  target.textContent = "Copied";
  window.setTimeout(function() {
    target.textContent = previous;
  }, 900);
});
`,
        }}
      />
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
      <h2 className="text-xl font-bold">Paste a win to generate the kit.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
        Founder Mode will create the paid-equivalent Bilion output from your
        startup pattern notes.
      </p>
    </div>
  );
}
