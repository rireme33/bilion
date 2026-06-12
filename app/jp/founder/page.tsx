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
      `/api/founder/access?access=${encodeURIComponent(access)}&next=${encodeURIComponent("/jp/app")}`,
    );
  }

  const cookieStore = await cookies();
  const hasFounderAccess =
    cookieStore.get("founder_access")?.value === "1" ||
    cookieStore.get("paid_access")?.value === "1";

  if (hasFounderAccess) {
    redirect("/jp/app");
  }

  return (
    <main className="min-h-screen bg-[#0b0c0e] px-5 py-5 text-white sm:px-6 md:py-7">
      <section className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/jp" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div>
              <div className="text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">AIビルダー向け商品シグナル</div>
            </div>
          </Link>
          <Link
            href="/founder?next=/jp/app"
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:text-white"
          >
            英語
          </Link>
        </header>

        <div className="mt-14 rounded-2xl border border-white/10 bg-[#111214] p-6 shadow-xl shadow-black/20 md:p-8">
          <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
            実装プロンプトアクセス
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            実装プロンプトアクセスが必要です。
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            実装プロンプトアクセスでは、買う相手・痛み・価格・48時間検証手順・Full Code X Master Promptを確認できます。
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-500">
            アクセス後は日本語UIの /jp/app に戻ります。
          </p>

          {error === "invalid_access" && (
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
              アクセスコードが正しくありません。
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jp/app"
              className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.04]"
            >
              日本語シグナルに戻る
            </Link>
            {CHECKOUT_URL ? (
              <a
                href={CHECKOUT_URL}
                className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                $19で実装プロンプトアクセスを購入
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-zinc-500"
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
