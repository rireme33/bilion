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
    <main className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-white">
      <section className="max-w-md rounded-3xl border border-white/10 bg-[#101011] p-8 text-center">
        <h1 className="text-xl font-black tracking-tight">
          Founder access required
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Founder access unlocks the full Build Prompt Engine output in the
          Bilion app.
        </p>
      </section>
    </main>
  );
}
