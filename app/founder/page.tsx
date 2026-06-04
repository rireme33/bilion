import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type FounderPageProps = {
  searchParams: Promise<{
    access?: string | string[];
  }>;
};

const founderSignal = {
  latestSignal:
    "A Japanese farmer in Hokkaido uses ChatGPT and Codex to automate practical farm work, including greenhouse temperature checks, LINE-based remote controls, field data, schedules, sensor logs, and crop troubleshooting.",
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
    "Simple internal automation tools can be sold as setup fee + monthly maintenance. A realistic starting reference is ¥49,800 setup + ¥9,800/month or $299 setup + $29/month.",
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
  codeXPrompt:
    "Build a minimal prototype of a LINE-based operations bot for a small farm or local field business. Use Next.js or Cloudflare Workers with a simple database. The bot should support checking today's tasks, adding a work log, checking greenhouse temperature from mock sensor data, and showing the next task for a field. Include a minimal admin screen for tasks, fields, and mock sensor readings. Keep the UI and code simple. Prioritize a working MVP over complex architecture.",
};

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
        <section className="max-w-md rounded-3xl border border-white/10 bg-[#101011] p-8 text-center">
          <h1 className="text-xl font-black tracking-tight">
            Founder access required
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Founder access unlocks the full Build Prompt Engine output.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-14">
        <header className="mb-8">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-500 transition hover:text-white"
          >
            Back to Bilion
          </Link>

          <div className="mt-8 inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
            Founder Build Prompt Engine
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Full Code X Prompt for the latest build signal.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Founder view shows the buildable tool, core features, comparable
            price, build steps, and the full Code X Prompt.
          </p>
        </header>

        <div className="grid gap-4">
          <FounderBlock label="Latest Signal" value={founderSignal.latestSignal} />
          <FounderBlock
            label="What You Can Build"
            value={founderSignal.whatYouCanBuild}
          />
          <FounderBlock
            label="Core Features"
            value={founderSignal.coreFeatures
              .map((item) => "- " + item)
              .join("\n")}
          />
          <FounderBlock
            label="Comparable Price"
            value={founderSignal.comparablePrice}
          />
          <FounderBlock
            label="Build Steps"
            value={founderSignal.buildSteps
              .map((item, index) => index + 1 + ". " + item)
              .join("\n")}
          />
          <FounderBlock
            label="Pattern Matches"
            value={founderSignal.patternMatches.join("\n")}
          />
          <FounderBlock label="Code X Prompt" value={founderSignal.codeXPrompt} />
        </div>
      </section>
    </main>
  );
}

function FounderBlock({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#101011] p-5 shadow-2xl">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-100">
        {value}
      </pre>
    </article>
  );
}
