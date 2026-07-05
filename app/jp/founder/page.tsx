import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "";

type JapaneseFounderPageProps = {
  searchParams: Promise<{
    access?: string | string[];
    error?: string | string[];
  }>;
};

export default async function JapaneseFounderPage({
  searchParams,
}: JapaneseFounderPageProps) {
  const params = await searchParams;
  const access = Array.isArray(params.access) ? params.access[0] : params.access;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  if (access) {
    redirect(
      `/api/founder/access?access=${encodeURIComponent(access)}&next=${encodeURIComponent("/app")}`,
    );
  }

  const cookieStore = await cookies();
  const hasFounderAccess =
    cookieStore.get("founder_access")?.value === "1" ||
    cookieStore.get("paid_access")?.value === "1";

  if (hasFounderAccess) {
    redirect("/app");
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden bg-[#0b0c0e] px-4 py-5 text-white sm:px-6 md:py-7">
      <section className="mx-auto w-full max-w-3xl overflow-hidden">
        <header className="flex min-w-0 items-center justify-between gap-4">
          <Link href="/jp" className="group flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="truncate text-xs text-zinc-500">Money Move Feed</div>
            </div>
          </Link>
          <Link
            href="/founder?next=/app"
            className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:text-white"
          >
            English
          </Link>
        </header>

        <div className="mt-14 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111214] p-5 shadow-xl shadow-black/20 sm:p-6 md:p-8">
          <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
            BILION PRO
          </div>
          <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight md:text-4xl">
            Bilion Proを解除 — $9.99/月
          </h1>
          <p className="mt-4 break-words text-sm leading-7 text-zinc-400">
            Money Moveの無制限閲覧、追加バージョン、保存、検証後のBuildプランが使えます。
          </p>
          <p className="mt-3 break-words text-sm leading-7 text-zinc-500">
            AIビルダーが、作る前に需要を検証するためのProアクセスです。
          </p>
          {error === "invalid_access" && (
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
              アクセスコードが正しくありません。
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.04] sm:w-auto"
            >
              日本語アプリに戻る
            </Link>
            {CHECKOUT_URL ? (
              <a
                href={CHECKOUT_URL}
                className="w-full rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 sm:w-auto"
              >
                Bilion Proを解除 — $9.99/月
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="w-full rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-zinc-500 sm:w-auto"
              >
                Checkout link not configured
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
