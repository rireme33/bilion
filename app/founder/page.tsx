import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FounderPageProps = {
  searchParams: Promise<{
    access?: string | string[];
  }>;
};

export default async function FounderPage({ searchParams }: FounderPageProps) {
  const params = await searchParams;
  const access = Array.isArray(params.access) ? params.access[0] : params.access;

  if (access) {
    redirect(`/api/founder/access?access=${encodeURIComponent(access)}`);
  }

  const hasFounderAccess =
    (await cookies()).get("founder_access")?.value === "1";

  if (hasFounderAccess) {
    redirect("/app");
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
