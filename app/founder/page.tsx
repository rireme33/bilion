import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FounderPageProps = {
  searchParams: Promise<{
    access?: string | string[];
    next?: string | string[];
  }>;
};

export default async function FounderPage({ searchParams }: FounderPageProps) {
  const params = await searchParams;
  const access = Array.isArray(params.access) ? params.access[0] : params.access;
  const requestedNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const safeNext = requestedNext === "/jp/app" ? "/jp/app" : "/app";

  if (access) {
    redirect(
      `/api/founder/access?access=${encodeURIComponent(access)}&next=${encodeURIComponent(safeNext)}`,
    );
  }

  const cookieStore = await cookies();
  const hasFounderAccess =
    cookieStore.get("founder_access")?.value === "1" ||
    cookieStore.get("paid_access")?.value === "1";

  if (hasFounderAccess) {
    redirect(safeNext);
  }

  return (
    <main className="flex min-h-screen w-full max-w-full items-center justify-center overflow-hidden bg-[#070707] px-4 text-white sm:px-6">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#101011] p-6 text-center sm:p-8">
        <h1 className="break-words text-xl font-black tracking-tight">
          Unlock Founder Access — $19
        </h1>
        <p className="mt-3 break-words text-sm leading-6 text-zinc-500">
          Get unlimited Sparks, full Launch Packs, saved Winners, and full
          Codex Build Prompts. Built for AI builders who want to sell before
          they build.
        </p>
      </section>
    </main>
  );
}
