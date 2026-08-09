"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import BilionCoreClient from "../../app/BilionCoreClient";
import { showcaseItems } from "../../showcase/showcase-data";

const FREE_DAILY_LIMIT_JP = 3;
const FREE_USAGE_STORAGE_KEY_JP = "bilion_free_usage_jp";

type SourceType = "github" | "indie";

type SourceOutput = {
  label: string;
  proof: string;
  title: string;
  businessFields: [string, string][];
  validationSteps: string[];
  masterPrompt: string;
};

type JapaneseMarketKey =
  | "education"
  | "healthcare"
  | "local"
  | "ecommerce"
  | "aiAgency"
  | "creators"
  | "construction"
  | "finance"
  | "legal"
  | "realEstate"
  | "developer";

type JapaneseBilionAppClientProps = {
  hasFounderAccess: boolean;
};

type GoldmineFreeResult = {
  title?: string;
  latest_signal?: string;
  what_happened?: string;
  what_you_can_build?: string;
  why_its_useful?: string;
  comparable_price?: string;
  build_steps?: string[];
  code_x_prompt?: string;
  pattern_matches?: string[];
  source_url?: string;
};

type GoldmineMatchResponse = {
  free?: GoldmineFreeResult;
};

const buildTypes = [
  "AI tool",
  "Micro SaaS",
  "Automation",
  "Local business tool",
  "Prompt pack",
  "Agency service",
  "B2B workflow",
];

const audiences = [
  "founders",
  "local businesses",
  "agencies",
  "consultants",
  "creators",
  "property managers",
  "restaurants",
  "clinics",
  "contractors",
  "solo developers",
];

const japaneseMarketOptions: Array<{
  key: JapaneseMarketKey;
  label: string;
}> = [
  { key: "education", label: "小さなSaaS" },
  { key: "developer", label: "開発代行" },
  { key: "local", label: "業務自動化" },
  { key: "ecommerce", label: "デジタル商品" },
  { key: "aiAgency", label: "AIエージェンシー" },
];

function createSourceOutput({
  label,
  proof,
  title,
  signal,
  buyer,
  pain,
  product,
  price,
  whyNow,
  validationSteps,
  masterPrompt,
}: {
  label: string;
  proof: string;
  title: string;
  signal: string;
  buyer: string;
  pain: string;
  product: string;
  price: string;
  whyNow: string;
  validationSteps: string[];
  masterPrompt: string;
}): SourceOutput {
  return {
    label,
    proof,
    title,
    businessFields: [
      ["売れた型", signal],
      ["なぜ売れたか", whyNow],
      ["誰が払うか", buyer],
      ["痛み", pain],
      ["収益機会の角度", product],
      ["最初の有料オファー", title],
      ["価格", price],
      ["リードマグネット", `${product}のBefore/After例を1つ無料で見せる。`],
      ["ローンチコピー", `X投稿: ${buyer}向けに、${pain}を解決する${product}を検証中。LP見出し: ${title}。DM: Before/Afterサンプルを送ってもいいですか？`],
    ],
    validationSteps,
    masterPrompt,
  };
}

function createJapaneseMasterPrompt({
  productName,
  buyer,
  pain,
  productAngle,
  firstVersion,
  price,
  validationSteps,
}: {
  productName: string;
  buyer: string;
  pain: string;
  productAngle: string;
  firstVersion: string;
  price: string;
  validationSteps: string[];
}) {
  return `以下の収益機会を、反応があったあとに実装するためのCodex向けプロンプトです。

製品名:
${productName}

買う相手:
${buyer}

痛み:
${pain}

価値提案:
${productAngle}

最初の実装:
${firstVersion}

価格:
${price}

48時間の検証計画:
${validationSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

実装の基本フロー:
1. ユーザーが画面を開く。
2. ユーザーが現実的な入力を入れる。
3. アプリが入力内容を整理し、商材として使える出力を作る。
4. 次に進むためのアクションと、コピーしやすい見出しを表示する。
5. ユーザーがその結果をコピーしたり、営業デモとして使う。

技術要件:
- Next.js と React を使う。
- ローカル状態だけで完結させる。
- ダミーデータのみを使う。
- 認証は入れない。
- 決済は入れない。
- データベースは使わない。
- 外部APIは呼ばない。
- 環境変数を必要としない。

UI要件:
- モバイルファーストで作る。
- ダークで落ち着いたSaaSっぽい見た目にする。
- 入力元や入力欄を明確にする。
- 出力カードを見やすくする。
- 生成結果をすぐコピーできるようにする。
- 見た目の飾りは最小限にする。`;
}

function createMasterPrompt(props: Parameters<typeof createJapaneseMasterPrompt>[0]) {
  return createJapaneseMasterPrompt(props);
}

function getNextOutputIndex(poolLength: number, currentIndex: number) {
  if (poolLength <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * poolLength);

  if (nextIndex === currentIndex) {
    nextIndex = (nextIndex + 1) % poolLength;
  }

  return nextIndex;
}

function pickRandom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)] || items[0]!;
}

function deriveBuyerFromPatternMatches(patternMatches?: string[]) {
  if (!patternMatches || patternMatches.length === 0) {
    return "AIで小さな収益機会を検証したい個人開発者・小規模事業者";
  }

  return `${patternMatches.slice(0, 3).join(" / ")} 向けの小型AI収益機会を探している人`;
}

function buildGoldmineFallbackPrompt(free: GoldmineFreeResult) {
  const productName =
    free.what_you_can_build || free.title || "AI Workflow Product";

  return `Build a standalone new web app from scratch.

Product name:
${productName}

Buyer:
${deriveBuyerFromPatternMatches(free.pattern_matches)}

Pain:
${free.why_its_useful || free.what_happened || "The buyer has a repeated workflow, but does not know how to turn it into a small AI product."}

Product angle:
${free.what_you_can_build || productName}

First version:
A focused one-page MVP with a specific input, structured output, validation plan, and copy-ready AI build prompt.

Price:
${free.comparable_price || "$19 one-time or $29/month."}

48h validation plan:
1. Record a 60-second demo.
2. Send it to 20 likely buyers.
3. Ask whether this would save time or make the workflow easier.
4. Offer 3 paid beta slots.

Technical requirements:
- Use Next.js and React.
- Use local React state only.
- Use mock data only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not call external APIs.
- Do not require environment variables.`;
}

function mapGoldmineResultToSourceOutput(free: GoldmineFreeResult): SourceOutput {
  const title = free.what_you_can_build || free.title || "AI Workflow Product";

  return {
    label: "Indie Hackers DB",
    proof: "参照元 Indie Hackers DB / goldmine signals",
    title,
    businessFields: [
      [
        "売れた型",
        free.latest_signal ||
          free.what_happened ||
          "海外の小型AI収益シグナル",
      ],
      [
        "なぜ売れたか",
        free.why_its_useful ||
          free.what_happened ||
          "手作業の業務をAIで短縮したいが、どの収益機会から検証すべきか分からない。",
      ],
      ["誰が払うか", deriveBuyerFromPatternMatches(free.pattern_matches)],
      ["収益機会の角度", free.what_you_can_build || free.title || "小型AIワークフロー収益機会"],
      ["最初の有料オファー", title],
      [
        "価格",
        free.comparable_price || "$19 one-time または $29/month",
      ],
      [
        "リードマグネット",
        `${title}のBefore/After例、LP見出し、検証DMを無料で1セット見せる。`,
      ],
      [
        "ローンチコピー",
        `X投稿: 売れた型を${title}に変換する。LP見出し: ${title}。DM: Before/Afterサンプルを送ってもいいですか？`,
      ],
    ],
    validationSteps:
      free.build_steps && free.build_steps.length > 0
        ? free.build_steps
        : [
            "60秒デモを作る。",
            "想定購入者20人に送る。",
            "「これがあれば今の作業が楽になるか？」を聞く。",
            "3人に有料βを提案する。",
          ],
    masterPrompt:
      free.code_x_prompt && free.code_x_prompt.trim().length > 0
        ? free.code_x_prompt
        : buildGoldmineFallbackPrompt(free),
  };
}

function containsJapaneseText(value?: string) {
  return Boolean(value && /[ぁ-んァ-ヶ一-龠々]/u.test(value));
}

function hasUsableJapaneseGoldmineResult(free: GoldmineFreeResult) {
  const hasJapaneseBuyer = free.pattern_matches?.some(containsJapaneseText) ?? false;
  const hasJapaneseSteps =
    free.build_steps?.length && free.build_steps.every(containsJapaneseText);

  return Boolean(
    containsJapaneseText(free.title || free.what_you_can_build) &&
      containsJapaneseText(free.why_its_useful || free.what_happened) &&
      hasJapaneseBuyer &&
      hasJapaneseSteps,
  );
}

function trimJapaneseSentenceEnding(value: string) {
  return value.trim().replace(/[。.!！?？]+$/u, "");
}

function getFieldValueJa(
  output: SourceOutput,
  labels: string[],
  fallback: string,
) {
  const field = output.businessFields.find(([label]) => labels.includes(label));
  return field?.[1] || fallback;
}

function buildJapaneseImplementationPrompt(output: SourceOutput) {
  const buyer = getOpportunityValueByLabelJa(output, "誰が払うか");
  const pain = getOpportunityValueByLabelJa(output, "痛み");
  const firstOffer = getOpportunityValueByLabelJa(output, "初回有料オファー");
  const price = getOpportunityValueByLabelJa(output, "価格");

  return `以下の収益機会を、反応があったあとに実装するためのCodex向けプロンプトです。

製品名:
${output.title}

買う相手:
${buyer}

痛み:
${pain}

初回オファー:
${firstOffer}

価格:
${price}

実装方針:
- まずは1ページのMVPとして、入力・生成結果・コピーの流れだけを作る。
- 認証、決済、外部API連携は入れず、ローカル状態で検証できる形にする。
- モバイルファーストで、見た目よりも「売れるか」を確認しやすい構成にする。
- 反応があったら、次の改善フェーズに進めるようにする。

実装要件:
- Next.js と React と TypeScript を使う。
- ローカル状態のみ使用する。
- 外部APIやデータベースは使わない。
- まずは最小機能で検証できる形にする。
- コピーや共有しやすいUIにする。`;
}

function getOpportunityFieldsJa(output: SourceOutput): [string, string][] {
  const pattern = getFieldValueJa(
    output,
    ["売れた型", "シグナル"],
    output.proof,
  );
  const whySold = getFieldValueJa(
    output,
    ["なぜ売れたか", "どんな痛みを解決するか", "なぜ今買うか"],
    "買い手の既存業務に痛みがあり、短時間で改善できるため。",
  );
  const pain = getFieldValueJa(
    output,
    ["痛み", "どんな痛みを解決するか"],
    "手作業で繰り返している業務が散らばり、毎回時間と判断コストがかかる。",
  );
  const whoPays = getFieldValueJa(
    output,
    ["誰が払うか", "誰が買うか"],
    "この業務をすでに手作業で行っている小規模事業者",
  );
  const productAngle = getFieldValueJa(
    output,
    ["収益機会の角度", "あなたの商品角度", "何を売るか"],
    output.title,
  );
  const firstOffer = getFieldValueJa(
    output,
    ["最初の有料オファー", "何が金になるか"],
    output.title,
  );
  const price = getFieldValueJa(
    output,
    ["価格", "いくらで売るか"],
    "$19 one-time または $29/month",
  );
  const launchPain = trimJapaneseSentenceEnding(pain);
  const launchPost = getFieldValueJa(
    output,
    ["Launch Post", "ローンチ投稿"],
    `${whoPays}向けに、${launchPain}という課題を解決する「${firstOffer}」を検証中です。まずBefore/Afterサンプルで反応を見ます。`,
  );
  const dmScript = getFieldValueJa(
    output,
    ["DM Script", "DM文"],
    `今、${whoPays}向けに${firstOffer}を検証しています。Before/Afterサンプルを1つ送ってもいいですか？`,
  );
  const firstCustomerPlan = output.validationSteps.slice(0, 3).join("\n");

  return [
    ["Money Move", firstOffer || productAngle || pattern],
    ["なぜ販売になるか", whySold],
    ["買う相手", whoPays],
    ["痛み", pain],
    ["初回オファー", `${firstOffer}\n${price}`],
    ["48時間検証", firstCustomerPlan],
    ["ローンチ投稿", launchPost],
    ["DM文", dmScript],
    ["Codex実装プロンプト", buildJapaneseImplementationPrompt(output)],
  ];
}

function getOpportunityValueByLabelJa(output: SourceOutput, targetLabel: string) {
  const aliases: Record<string, string[]> = {
    "売れた型": ["売れた型", "シグナル"],
    "なぜ売れたか": ["なぜ売れたか", "どんな痛みを解決するか", "なぜ今買うか"],
    "痛み": ["痛み", "どんな痛みを解決するか"],
    "誰が払うか": ["誰が払うか", "誰が買うか"],
    "初回有料オファー": ["最初の有料オファー", "何が金になるか"],
    "価格": ["価格", "いくらで売るか"],
  };
  const matchingAliases = aliases[targetLabel];

  if (matchingAliases) {
    return getFieldValueJa(output, matchingAliases, output.title);
  }

  return (
    getOpportunityFieldsJa(output).find(([label]) => label === targetLabel)?.[1] ||
    ""
  );
}

function getSourceOutputTextJa(output: SourceOutput) {
  return [
    output.label,
    output.proof,
    output.title,
    ...output.businessFields.flat(),
    ...output.validationSteps,
  ].join(" ");
}

function getJapaneseMarketForOutput(output: SourceOutput): JapaneseMarketKey {
  const text = getSourceOutputTextJa(output).toLowerCase();

  if (/github|repo|repository|codex|cursor|developer|devrel|bug|api|freelance|開発代行|受託|issue|pr/.test(text)) return "developer";
  if (/automation|自動化|spreadsheet|email|report|レポート|メール|業務|ローカル|口コミ|clinic|restaurant|review/.test(text)) return "local";
  if (/plugin|extension|template|gumroad|etsy|shopify|chrome|テンプレ|プラグイン|デジタル/.test(text)) return "ecommerce";
  if (/agency|エージェンシー|consultant|client|コンサル|納品/.test(text)) return "aiAgency";
  if (/教育|学校|先生|教師|worksheet|student|homeschool|preschool|saas|micro/.test(text)) return "education";

  return "education";
}

function getJapaneseOpportunityScore(output: SourceOutput) {
  const text = getSourceOutputTextJa(output);
  const moneySignals = (text.match(/\$|円|月額|setup|paid|価格|売上|購入|有料/gi) || []).length;
  const buyerSignals = (text.match(/買う|払う|buyer|会社|店舗|クリニック|開発者|ビルダー|管理/gi) || []).length;
  const distributionSignals = (text.match(/x|dm|投稿|デモ|送る|メール|github|コミュニティ/gi) || []).length;
  const validationSignals = (text.match(/48時間|20|30|β|検証|有料β|購入/gi) || []).length;

  return Math.min(
    50,
    22 +
      Math.min(10, moneySignals * 2) +
      Math.min(8, buyerSignals) +
      Math.min(6, distributionSignals) +
      Math.min(4, validationSignals),
  );
}

function getJapaneseEvidenceLevel(output: SourceOutput) {
  const score = getJapaneseOpportunityScore(output);

  if (score >= 42) return "強い";
  if (score >= 34) return "中程度";
  return "参考";
}

function getMarketLabelJa(key: JapaneseMarketKey) {
  return japaneseMarketOptions.find((market) => market.key === key)?.label || "市場";
}

function getMarketFallbackOutputJa(market: JapaneseMarketKey): SourceOutput {
  const label = getMarketLabelJa(market);
  const details: Record<JapaneseMarketKey, {
    buyer: string;
    pain: string;
    product: string;
    price: string;
    channel: string;
  }> = {
    education: {
      buyer: "幼児教育の先生、教材販売者、ホームスクール家庭",
      pain: "名前入り教材や個別ワークシートを毎回手作業で作るのが面倒。",
      product: "名前なぞりワークシート生成ツール",
      price: "$9 worksheet pack",
      channel: "Pinterest、TikTok、先生向けコミュニティ",
    },
    healthcare: {
      buyer: "歯科、整体、予約制クリニック",
      pain: "キャンセル後の再予約フォローが漏れ、空き枠が売上損失になる。",
      product: "予約キャンセル回収アシスタント",
      price: "$399 setup + $49/month",
      channel: "クリニック向けDM、Loom監査、紹介",
    },
    local: {
      buyer: "地域店舗、サロン、飲食店、ローカル代理店",
      pain: "口コミ返信や低評価対応が遅れ、来店前の信頼を落とす。",
      product: "口コミ監視・返信ドラフトツール",
      price: "$29/month",
      channel: "Google Maps監査、DM、無料レビュー診断",
    },
    ecommerce: {
      buyer: "小規模EC運営者、Shopifyストア、商品ページ担当",
      pain: "商品説明、FAQ、レビュー要約、改善案を継続的に作れない。",
      product: "EC商品ページ改善パック",
      price: "$19 report",
      channel: "X投稿、Shopifyコミュニティ、商品ページ無料診断",
    },
    aiAgency: {
      buyer: "AI受託開発者、AIエージェンシー、業務自動化コンサル",
      pain: "顧客要望をCodexで作れる仕様・検収条件・納品物に変換するのが毎回重い。",
      product: "Codex納品ブリーフ生成パック",
      price: "$49 template pack",
      channel: "X投稿、LinkedIn、AI agencyコミュニティ、DM",
    },
    creators: {
      buyer: "YouTuber、ニュースレター運営者、X発信者",
      pain: "ネタはあるが、投稿・カルーセル・CTAに変換するのに時間がかかる。",
      product: "Signal to Carousel Pack",
      price: "$19 one-time",
      channel: "X、TikTok、ニュースレター返信",
    },
    construction: {
      buyer: "小規模工務店、造園会社、現場保守チーム",
      pain: "現場メモから日報や顧客報告を作るのに毎日時間がかかる。",
      product: "工事現場日報ジェネレーター",
      price: "$49/month",
      channel: "施工会社へのデモDM、現場日報Before/After",
    },
    finance: {
      buyer: "フリーランス、小規模事業者、経理代行",
      pain: "請求催促、入金確認、月次メモが散らばりキャッシュ回収が遅れる。",
      product: "請求フォローアップ文面生成ツール",
      price: "$19 one-time",
      channel: "フリーランス向け投稿、テンプレ配布、DM",
    },
    legal: {
      buyer: "小規模法律事務所、契約レビュー担当、士業",
      pain: "問い合わせや契約メモを整理し、確認事項に変換する作業が重い。",
      product: "契約確認メモ整理ツール",
      price: "$49 report pack",
      channel: "士業向けメール、LinkedIn、無料チェックリスト",
    },
    realEstate: {
      buyer: "不動産管理会社、物件管理担当、大家",
      pain: "入居者連絡や修理依頼を緊急度・業者指示に変換するのが遅い。",
      product: "入居者修理依頼ルーター",
      price: "$299 setup + $29/month",
      channel: "管理会社へのDM、修理依頼Before/Afterデモ",
    },
    developer: {
      buyer: "Codex/Cursorユーザー、個人開発者、Dev tool創業者",
      pain: "GitHubの公開シグナルを収益機会、価格、検証文に変換できない。",
      product: "GitHub Repo Signal Brief Generator",
      price: "$19 one-time",
      channel: "X、GitHubコミュニティ、AIビルダーDM",
    },
  };
  const item = details[market];

  return createSourceOutput({
    label: "市場サンプル",
    proof: `参照元 確認用サンプル / ${label}`,
    title: item.product,
    signal: `${label}市場では、すでに手作業で行われている反復業務に小さな有料ツールの余地がある。`,
    buyer: item.buyer,
    pain: item.pain,
    product: item.product,
    price: item.price,
    whyNow: "AIで作るコストは下がったが、先に買う相手と販売導線を検証する必要があるから。",
    validationSteps: [
      "Before/Afterデモを1つ作る。",
      "想定購入者20人に投稿またはDMする。",
      "3件以上の返信、1件の購入意思、または実データ提供を確認する。",
      "反応があった場合だけCodexで小さく作る。",
    ],
    masterPrompt: createMasterPrompt({
      productName: item.product,
      buyer: item.buyer,
      pain: item.pain,
      productAngle: item.product,
      firstVersion: "入力、生成結果、コピー、検証ログだけを持つ小さな1ページ版。",
      price: item.price,
      validationSteps: [
        "Before/Afterデモを1つ作る。",
        "想定購入者20人に投稿またはDMする。",
        "3件以上の返信、1件の購入意思、または実データ提供を確認する。",
        "反応があった場合だけCodexで小さく作る。",
      ],
    }),
  });
}

function getTopMarketOpportunityJa(market: JapaneseMarketKey) {
  const allOutputs = Object.values(sourceOutputPools).flat();
  const match = allOutputs
    .filter((output) => getJapaneseMarketForOutput(output) === market)
    .sort((a, b) => getJapaneseOpportunityScore(b) - getJapaneseOpportunityScore(a))[0];

  return match || getMarketFallbackOutputJa(market);
}

function getWhyThisOpportunityJa(output: SourceOutput) {
  const why = getOpportunityValueByLabelJa(output, "なぜ売れたか");

  return `${why} 買う相手、価格仮説、配布導線、48時間以内の検証方法が見えているため、今すぐテストする価値があります。`;
}

function buildJapaneseMobileXPost(output: SourceOutput) {
  return `Bilionで証拠つきの収益機会を見つけた。

売れた型：
${getOpportunityValueByLabelJa(output, "売れた型")}

誰が払うか：
${getOpportunityValueByLabelJa(output, "誰が払うか")}

初回オファー：
${getOpportunityValueByLabelJa(output, "初回有料オファー")}

価格：
${getOpportunityValueByLabelJa(output, "価格")}

48時間検証：
${output.validationSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

作る前に、投稿/DMで売れるかを見る。`;
}

const japaneseMobileReplyCopy = `売りたい相手、強み、考えている案を送ってください。
BilionでMoney Moveに変換し、まず何を売るべきかを整理してお返しします。`;

const japaneseMobileDmCopy = `Bilionで市場の証拠をもとに収益機会を整理しています。
売れた型、価格、投稿文、48時間検証まで一緒に出せます。あなたの案で、まずは一度無料で見てもらえますか？`;

const japaneseMobileSalesCtaCopy = `Bilion Proを解除 — $9.99/月

Money Moveの無制限閲覧、追加バージョン、保存、検証後の実装プランが使えます。`;

const reviewedJapaneseBusinessSparks: SourceOutput[] = [
  createSourceOutput({
    label: "Money Move Seed",
    proof: "確認済みサンプル / 業務自動化",
    title: "Invoice Follow-up Sprint",
    signal:
      "フリーランスや小規模制作会社では、請求書の催促がメール、スプレッドシート、記憶に散らばりやすい。",
    buyer: "フリーランスと小規模制作会社",
    pain:
      "請求書の催促は気まずく、後回しになりやすく、メールと表計算に分散している。",
    product:
      "未払い請求の状況を貼ると、丁寧な催促メール、優先度、次の対応、簡単な管理メモを生成するワークフロー。",
    price: "$500 setup + $150/month",
    whyNow:
      "回収漏れはそのままキャッシュフローに響き、AIで文面作成と管理を小さく自動化できるから。",
    validationSteps: [
      "未払い請求メモから催促メールになるBefore/Afterサンプルを1つ作る。",
      "フリーランスまたは小規模制作会社20人に送る。",
      "返信、クリック、ワークフロー希望が出た場合だけ作る。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "Invoice Follow-up Sprint",
      buyer: "フリーランスと小規模制作会社",
      pain: "請求書の催促は気まずく、後回しになりやすく、メールと表計算に分散している。",
      productAngle: "未払い請求の状況を貼ると、丁寧な催促メール、優先度、次の対応、簡単な管理メモを生成するワークフロー。",
      firstVersion: "請求書情報を入力すると、催促メール、優先度、次のアクション、管理メモを生成するモバイルファーストのMVP。",
      price: "$500 setup + $150/month",
      validationSteps: [
        "未払い請求メモから催促メールになるBefore/Afterサンプルを1つ作る。",
        "フリーランスまたは小規模制作会社20人に送る。",
        "返信、クリック、ワークフロー希望が出た場合だけ作る。",
      ],
    }),
  }),
  createSourceOutput({
    label: "Money Move Seed",
    proof: "確認済みサンプル / 地域ビジネス",
    title: "Review Reply Copilot",
    signal:
      "ローカル店舗は口コミが売上に直結するが、返信文を書く作業は反復的で後回しになりやすい。",
    buyer: "飲食店、クリニック、美容室、地域店舗",
    pain:
      "オーナーは口コミ返信の重要性を分かっているが、毎回トーンや謝罪文を考えるのが重い。",
    product:
      "口コミを貼ると、短い返信、丁寧な返信、低評価向け返信、オーナー確認メモを生成する小型ツール。",
    price: "$500 setup + $150/month",
    whyNow:
      "Google口コミや予約サイトの印象が来店判断に直結し、返信の速さと品質が見込み客に見えるから。",
    validationSteps: [
      "実際の口コミ5件をBefore/Afterで書き換える。",
      "近隣店舗オーナーにサンプルを送る。",
      "翌月分も任せたいと言われた場合だけ作る。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "Review Reply Copilot",
      buyer: "飲食店、クリニック、美容室、地域店舗",
      pain: "口コミ返信の重要性を分かっているが、毎回トーンや謝罪文を考えるのが重い。",
      productAngle: "口コミを貼ると、短い返信、丁寧な返信、低評価向け返信、オーナー確認メモを生成する小型ツール。",
      firstVersion: "口コミを入力すると、返信案、要注意フラグ、オーナー確認メモを生成するモバイルファーストのMVP。",
      price: "$500 setup + $150/month",
      validationSteps: [
        "実際の口コミ5件をBefore/Afterで書き換える。",
        "近隣店舗オーナーにサンプルを送る。",
        "翌月分も任せたいと言われた場合だけ作る。",
      ],
    }),
  }),
  createSourceOutput({
    label: "Money Move Seed",
    proof: "確認済みサンプル / 小規模SaaS",
    title: "Name Tracing Worksheets",
    signal:
      "保護者や先生は、子どもの名前入りプリントのような個別教材にすでにお金を払っている。",
    buyer: "保護者、幼児教室の先生、ホームスクール家庭",
    pain:
      "個別ワークシートを作りたいが、毎回デザインするのは面倒で時間がかかる。",
    product:
      "名前を入力すると、なぞり書き用の印刷ワークシートを生成する小さなSaaS。",
    price: "$9 one-time または $5/month",
    whyNow:
      "AIビルダーなら生成とプレビューだけの小さな教材ツールを短時間で作れ、投稿サンプルで先に反応を見られるから。",
    validationSteps: [
      "名前なぞりワークシートのサンプルを3つ投稿する。",
      "保護者・先生クリエイター20人に無料サンプルを提案する。",
      "自分の子ども用が欲しいと言われた場合だけ作る。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "Name Tracing Worksheets",
      buyer: "保護者、幼児教室の先生、ホームスクール家庭",
      pain: "個別ワークシートを作りたいが、毎回デザインするのは面倒で時間がかかる。",
      productAngle: "名前を入力すると、なぞり書き用の印刷ワークシートを生成する小さなSaaS。",
      firstVersion: "名前を入力すると、印刷用のワークシートプレビューを生成するモバイルファーストのMVP。",
      price: "$9 one-time または $5/month",
      validationSteps: [
        "名前なぞりワークシートのサンプルを3つ投稿する。",
        "保護者・先生クリエイター20人に無料サンプルを提案する。",
        "自分の子ども用が欲しいと言われた場合だけ作る。",
      ],
    }),
  }),
];

async function writeClipboardTextJa(text: string) {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const sourceOutputPools: Record<SourceType, SourceOutput[]> = {
  indie: [...reviewedJapaneseBusinessSparks, {
    label: "Indie Hackers DB",
    proof: "参照元 IH42kDB / Indie Hackers成功事例",
    title: "入居者修理依頼ルーター",
    businessFields: [
      [
        "シグナル",
        "Indie Hackersや海外小型SaaS事例では、ニッチ業務の手作業を小さなAIツールに変換して販売するパターンが繰り返し出ている。不動産管理では、入居者からの修理依頼を分類し、緊急度を判断し、業者向けの作業指示書に変換するニーズがある。",
      ],
      ["何が金になるか", "入居者修理依頼ルーター"],
      ["誰が買うか", "20〜300戸を管理する小規模不動産管理会社"],
      [
        "どんな痛みを解決するか",
        "入居者の修理依頼がLINE、メール、電話メモに散らばり、緊急度判断と業者への作業指示作成に毎回10〜20分かかる。",
      ],
      [
        "何を売るか",
        "入居者メッセージを貼ると、緊急度、必要情報、業者向け作業指示、返信文を生成する小型AIツール。",
      ],
      ["いくらで売るか", "$299 setup + $29/month"],
      [
        "なぜ今買うか",
        "管理戸数が増えるほど修理依頼の処理が詰まり、対応遅れがクレームや退去リスクになるから。",
      ],
    ],
    validationSteps: [
      "60秒デモを作る。",
      "小規模不動産管理会社20社に送る。",
      "「これがあれば修理依頼処理が楽になるか？」を聞く。",
      "3社に$99〜$299の有料βを提案する。",
    ],
    masterPrompt: `Build a standalone new web app from scratch.

Product name:
Tenant Maintenance Request Router

Buyer:
Small property managers managing 20-300 rental units.

Pain:
Tenant repair requests arrive through LINE, email, phone notes, and messy messages. Managers waste time identifying urgency, missing information, vendor category, and the next tenant reply.

Product angle:
A lightweight AI work-order router that turns tenant repair messages into urgency, missing info, vendor-ready work orders, and tenant reply drafts.

First version:
A single-page tool where a property manager pastes a tenant maintenance message, reviews urgency, missing information, vendor category, work-order instructions, and a tenant reply draft, then copies the output.

Price:
$299 setup + $29/month.

48h validation plan:
1. Create a 60-second demo showing a messy tenant message becoming a vendor-ready work order.
2. Send the demo to 20 small property managers managing 20-300 rental units.
3. Ask: "Would this make maintenance request handling easier?"
4. Offer 3 paid beta slots at $99-$299.

Core workflow:
1. User opens the product.
2. User pastes a tenant maintenance request.
3. App classifies urgency and repair category.
4. App identifies missing information.
5. App generates a vendor-ready work order.
6. App generates a tenant reply draft.
7. User copies or saves the output.

Technical requirements:
- Use Next.js and React.
- Use local React state only.
- Use mock data only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not call external APIs.
- Do not require environment variables.

UI requirements:
- Mobile-first layout.
- Dark, calm SaaS style.
- Clear input area for tenant messages.
- Clear output sections for urgency, missing info, vendor work order, and tenant reply.
- Copy buttons for each output.
- No generic AI gradients.
- No decorative noise.

Acceptance criteria:
- The page loads successfully.
- User can paste or select a sample tenant repair request.
- Generated output appears immediately.
- Output includes urgency, missing information, vendor-ready work order, and tenant reply.
- Copy buttons work.
- The product clearly feels sellable to small property managers.`,
  },
  createSourceOutput({
    label: "Indie Hackers DB",
    proof: "参照元 IH42kDB / small restaurant ops pattern",
    title: "レストラン引き継ぎメモ生成ツール",
    signal:
      "Indie Hackersでは、店舗や現場の毎日の手書きメモを標準フォーマットに変換する小型AIワークフローが売れている。飲食店では、シフト交代時の申し送りが口頭、LINE、紙メモに散らばっている。",
    buyer: "独立系レストラン、カフェ、居酒屋、2〜5店舗の小規模飲食チーム",
    pain:
      "欠品、予約注意、クレーム、常連対応、明日の仕込みが人によって書き方が違い、店長が毎日確認と整理に時間を取られる。",
    product:
      "閉店後メモを貼ると、明日の引き継ぎ、重要注意、在庫補充、スタッフ向け一言に変換する小型AIツール。",
    price: "$199 setup + $19/month",
    whyNow:
      "人手不足で店長が現場と管理を兼任しており、引き継ぎミスがそのままクレームや機会損失になるから。",
    validationSteps: [
      "飲食店向けに閉店メモが引き継ぎ文になる60秒デモを作る。",
      "独立店20店舗にDMまたはメールで送る。",
      "店長に実際の匿名メモを1件もらい、その場で変換する。",
      "3店舗に$99の初期設定を提案する。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "Restaurant Shift Handoff Memo Generator",
      buyer: "Independent restaurants, cafes, bars, and small multi-location food teams.",
      pain:
        "Shift handoff notes are scattered across paper, LINE, and memory. Managers lose time finding missing inventory, guest issues, reservations, and next-day prep.",
      productAngle:
        "A lightweight AI handoff tool that turns messy closing notes into a clear next-shift brief, inventory list, guest flags, and manager summary.",
      firstVersion:
        "A single-page tool with sample closing notes, a paste box, generated handoff sections, and copy buttons for staff messages.",
      price: "$199 setup + $19/month.",
      validationSteps: [
        "Record a 60-second before/after demo using messy restaurant notes.",
        "Send it to 20 independent restaurant owners or managers.",
        "Ask for one anonymized real note and generate a sample handoff.",
        "Offer 3 paid setup slots at $99.",
      ],
    }),
  }),
  createSourceOutput({
    label: "Indie Hackers DB",
    proof: "参照元 IH42kDB / field service reporting pattern",
    title: "工事現場日報ジェネレーター",
    signal:
      "海外の小型SaaS事例では、現場メモ、天気、人数、進捗を日報に変換する業務ツールが繰り返し検証されている。建設・造園・保守では、報告作成が毎日の負担になっている。",
    buyer: "小規模工務店、造園会社、設備工事、物件保守チーム",
    pain:
      "現場の進捗、遅延理由、資材不足、明日の作業がチャットや記憶に残り、クライアント報告に毎日20〜30分かかる。",
    product:
      "現場メモ、天気、作業人数、ブロッカーを入力すると、クライアント向け日報、資材リスト、明日の作業を生成するAIワークフロー。",
    price: "$49/month",
    whyNow:
      "小規模チームでもクライアントへの説明責任が強くなり、写真とメモだけでは報告品質を保てないから。",
    validationSteps: [
      "現場メモから日報になるデモを作る。",
      "小規模施工会社20社に送る。",
      "実際の匿名メモを1件もらい、出力品質を確認してもらう。",
      "$49/monthで3社の有料βを提案する。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "Jobsite Notes to Daily Reports AI Workflow",
      buyer: "Small contractors, landscapers, maintenance teams, and field service operators.",
      pain:
        "Daily jobsite updates live in chats, notebooks, photos, and memory. Client reporting is slow, inconsistent, and easy to postpone.",
      productAngle:
        "An AI workflow that turns jobsite notes, weather, crew counts, blockers, and materials into client-ready daily reports and next actions.",
      firstVersion:
        "A paste/import workflow with sample notes, weather and crew inputs, generated report sections, saved examples, and export buttons.",
      price: "$49/month.",
      validationSteps: [
        "Find 10 contractors who already write manual daily updates.",
        "Run one anonymized real note through the prototype.",
        "Ask whether the output is good enough to send to a client.",
        "Offer paid beta at $49/month.",
      ],
    }),
  }),
  createSourceOutput({
    label: "Indie Hackers DB",
    proof: "参照元 IH42kDB / local service reply workflow",
    title: "美容室口コミ返信アシスタント",
    signal:
      "ローカルビジネス向けAIでは、口コミ返信、クレーム分類、オーナー確認フラグのような小さな運用負担を置き換える商品が売れやすい。",
    buyer: "美容室、ネイルサロン、整体院、地域密着の予約制店舗",
    pain:
      "Google口コミや予約サイトのレビュー返信が後回しになり、低評価への対応や常連への丁寧な返信に毎回迷う。",
    product:
      "口コミを貼ると、返信文、要注意フラグ、オーナー確認ポイント、再来店につなげる一言を生成する小型AIツール。",
    price: "$299 setup + $29/month",
    whyNow:
      "地域店舗は口コミが予約数に直結し、返信スピードと丁寧さが見込み客の印象を左右するから。",
    validationSteps: [
      "実際のレビュー例を3件使った返信デモを作る。",
      "近隣サロン20店舗に送る。",
      "1件の実レビューをその場で変換して見せる。",
      "月$29または$299セットアップの反応を確認する。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "Salon Review Reply Assistant",
      buyer: "Hair salons, nail salons, clinics, and local appointment-based service businesses.",
      pain:
        "Reviews pile up across Google and booking platforms. Owners delay replies because tone, complaint risk, and next-step wording take mental effort.",
      productAngle:
        "A review reply copilot that turns customer reviews into owner-safe reply options, risk flags, and repeat-visit language.",
      firstVersion:
        "A one-page tool with review input, tone selector, generated reply options, owner flags, and copy buttons.",
      price: "$299 setup + $29/month.",
      validationSteps: [
        "Create before/after examples for 3 real-looking salon reviews.",
        "Send the demo to 20 local salons.",
        "Ask for one anonymized review and generate replies.",
        "Offer setup at $299 or monthly support at $29/month.",
      ],
    }),
  }),
  createSourceOutput({
    label: "Indie Hackers DB",
    proof: "参照元 IH42kDB / appointment recovery pattern",
    title: "歯科クリニック予約キャンセル回収ツール",
    signal:
      "海外のニッチSaaSでは、予約キャンセル後の再予約メッセージや未処理リストを自動化する小さな運用改善が売れている。",
    buyer: "歯科クリニック、矯正歯科、整体院、予約枠が売上に直結する医療系店舗",
    pain:
      "キャンセル後の再予約連絡がスタッフ任せになり、空き枠が埋まらず、売上と患者フォローが漏れる。",
    product:
      "キャンセル理由と患者メモを入れると、再予約候補、LINE文面、電話メモ、優先度を生成するキャンセル回収ツール。",
    price: "$399 setup + $49/month",
    whyNow:
      "人件費が上がる中で、空き枠の回収は新規集客より安く、すぐ売上に戻るから。",
    validationSteps: [
      "キャンセル患者リストから再予約文面が出るデモを作る。",
      "歯科・整体20院に送る。",
      "空き枠1件あたりの損失を聞く。",
      "3院に$199初期設定を提案する。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "Clinic Cancellation Recovery Tool",
      buyer: "Dental clinics, orthodontists, chiropractors, and appointment-based clinics.",
      pain:
        "Canceled appointments become lost revenue because follow-up messages, priority, and rescheduling scripts are handled manually by busy staff.",
      productAngle:
        "A lightweight recovery tool that turns cancellation notes into reschedule priority, patient-friendly messages, call notes, and next actions.",
      firstVersion:
        "A single-page workflow with sample cancellation records, generated recovery scripts, status tags, and copy buttons.",
      price: "$399 setup + $49/month.",
      validationSteps: [
        "Build a demo showing a cancellation list becoming recovery actions.",
        "Send it to 20 clinics.",
        "Ask the value of filling one canceled appointment slot.",
        "Offer 3 paid setup slots at $199.",
      ],
    }),
  })],
  github: [{
    label: "GitHubシグナル",
    proof: "参照元 GitHubトレンド / AIリポジトリシグナル",
    title: "GitHub Repo Signal Brief Generator",
    businessFields: [
      [
        "シグナル",
        "GitHubでAIエージェント、ローカル自動化、開発者ワークフロー系のリポジトリが伸びている。AIビルダーは毎日トレンドを見るが、それを「誰に売るか」「どの収益機会を検証するか」「いくらで売るか」に変換できていない。",
      ],
      ["何が金になるか", "GitHub Repo Signal Brief Generator"],
      [
        "誰が買うか",
        "Codex、Cursor、Claude Code、Lovableを使うAIビルダー・個人開発者",
      ],
      [
        "どんな痛みを解決するか",
        "GitHubトレンドやAIリポジトリを見ても、そこから売れる小さな収益機会、買う相手、価格、検証手順に変換できない。",
      ],
      [
        "何を売るか",
        "GitHubリポジトリURLやトレンド名を入力すると、買う相手、痛み、価格、48時間検証、Launch Assets、反応後のBuildプランに変換する市場検証ツール。",
      ],
      ["いくらで売るか", "$19 one-time または $9/month"],
      [
        "なぜ今買うか",
        "Codex、Cursor、Claude Codeで作れる人が増えたが、作る前の「どの市場に先に売るか」がボトルネックになっているから。",
      ],
    ],
    validationSteps: [
      "GitHubトレンド1件を収益機会とLaunch Assetsに変換する60秒デモを作る。",
      "XでAIビルダー向けに投稿する。",
      "Codex / Cursor / Claude Codeユーザー30人にDMする。",
      "5人から「使いたい」または$19購入を取れるか確認する。",
    ],
    masterPrompt: `Build a standalone new web app from scratch.

Product name:
GitHub Repo Signal Brief Generator

Buyer:
AI builders, solo developers, Codex users, Cursor users, Claude Code users, and Lovable users who watch GitHub trends but do not know how to turn them into sellable product ideas.

Pain:
The buyer sees trending AI repositories, developer tools, and public builder activity, but cannot convert those signals into a clear product angle, buyer pain, price, validation plan, and build-ready implementation prompt.

Product angle:
A lightweight signal-to-product workspace that turns one GitHub repository signal into a buyer profile, pain statement, small product idea, pricing hypothesis, 48-hour validation plan, and build-ready Code X prompt.

First version:
A single-page web app where the user pastes a GitHub repository name, URL, or trend note, then receives a commercial brief and a build-ready prompt.

Price:
$19 one-time or $9/month.

48h validation plan:
1. Record a 60-second demo showing one GitHub repository signal becoming a product brief.
2. Post the demo on X for AI builders.
3. DM 30 Codex, Cursor, Claude Code, or Lovable users.
4. Ask for 5 purchases at $19 or 5 explicit objections.

Core workflow:
1. User opens the product.
2. User pastes a GitHub repository URL, repo name, or trend note.
3. App generates buyer, pain, product idea, price, and validation plan.
4. App generates a build-ready Code X prompt.
5. User copies the output.

Technical requirements:
- Use Next.js and React.
- Use local React state only.
- Use mock data only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not call external APIs.
- Do not require environment variables.

UI requirements:
- Mobile-first layout.
- Dark, calm SaaS style.
- Clear source selector.
- Clear output cards.
- Copy button for the master prompt.
- No generic AI gradients.
- No decorative noise.

Acceptance criteria:
- The page loads successfully.
- User can select GitHubシグナル or Indie Hackers DB.
- User clicks Launch Assetsを作る.
- Output appears only after click.
- Output changes based on selected source.
- Copy button copies the selected source's Build Prompt.`,
  },
  createSourceOutput({
    label: "GitHubシグナル",
    proof: "参照元 GitHubトレンド / agent workflow repos",
    title: "AI Agent Workflow Template Generator",
    signal:
      "GitHubではAIエージェントのテンプレート、ワークフロー、ツール接続例が伸びている。開発者は試すが、自分の業務や顧客向けに再利用できる型へ整理できていない。",
    buyer: "Codex、Cursor、Claude Codeを使うAIビルダー、受託開発者、社内自動化担当",
    pain:
      "エージェント構成、ツール権限、入力例、失敗時の処理を毎回ゼロから考えるため、デモまでは作れても実運用の型にならない。",
    product:
      "目的を選ぶと、AIエージェントの役割、ツール、入力例、制約、テスト手順を含む実装テンプレートを生成するワークフローツール。",
    price: "$29初回セットアップ、または $12/月",
    whyNow:
      "AIエージェントを試す人は増えていますが、実務に落とし込める設計テンプレートはまだ不足しています。",
    validationSteps: [
      "営業リサーチ、議事録、請求チェックの3テンプレートを作る。",
      "XでAIビルダー向けに60秒デモを出す。",
      "Codex/Cursorユーザー30人にDMする。",
      "5人から購入または明確な反論を取る。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "AI Agent Workflow Template Generator",
      buyer: "AI builders, automation consultants, Codex users, Cursor users, and internal operators building agent workflows.",
      pain:
        "Builders can create quick agent demos, but repeatable production-style workflows require role definitions, tool boundaries, sample inputs, fallback rules, and tests.",
      productAngle:
        "A template generator that turns one agent goal into a structured workflow spec, tool map, test checklist, and build-ready AI prompt.",
      firstVersion:
        "A single-page app with workflow type selector, generated agent spec, tool checklist, example input, test cases, and copy buttons.",
      price: "$29 one-time or $12/month.",
      validationSteps: [
        "Create 3 public templates for common agent workflows.",
        "Record a 60-second demo showing one goal becoming a full agent spec.",
        "DM 30 AI builders using Codex or Cursor.",
        "Ask for 5 purchases or explicit objections.",
      ],
    }),
  }),
  createSourceOutput({
    label: "GitHubシグナル",
    proof: "参照元 GitHub issues / maintainer comment patterns",
    title: "PR / Issue Summary Brief Tool",
    signal:
      "GitHubのIssue、PR、メンテナーコメントには、ユーザーの不満、未解決ニーズ、導入障壁が集まっている。だが読むだけでは市場判断に変換しづらい。",
    buyer: "OSSを追うAIビルダー、開発者向けSaaS創業者、DevRel、技術マーケター",
    pain:
      "IssueやPRを読んでも、どの不満が買う痛みなのか、どの機能が収益機会になるのか、検証すべき相手が誰か整理できない。",
    product:
      "IssueやPRメモを貼ると、ユーザー痛み、頻出要望、収益機会、検証メッセージ、Code X用プロンプトに変換する分析ツール。",
    price: "$19 one-time",
    whyNow:
      "OSS周辺のユーザー発言は公開された市場調査データであり、AIビルダーが市場選定に使えるから。",
    validationSteps: [
      "人気OSSのIssue 5件を市場検証ブリーフに変換するデモを作る。",
      "開発者向けにXへ投稿する。",
      "Dev tool創業者とAIビルダー30人に送る。",
      "$19で5件の購入または反論を取る。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "PR / Issue Summary Brief Tool",
      buyer: "AI builders, developer-tool founders, DevRel teams, and technical marketers using public GitHub activity as market research.",
      pain:
        "GitHub issues and PR comments contain buyer pain, but the signal is messy and hard to turn into product ideas, outreach, and build prompts.",
      productAngle:
        "A brief generator that turns GitHub issue notes into pain clusters, product opportunities, evidence, outreach copy, and Code X prompts.",
      firstVersion:
        "A one-page paste workflow with sample issue notes, generated brief cards, evidence bullets, validation plan, and copy buttons.",
      price: "$19 one-time.",
      validationSteps: [
        "Analyze 5 public issue threads manually and show before/after output.",
        "Post the demo for dev-tool founders.",
        "DM 30 AI builders and developer marketers.",
        "Ask for 5 purchases at $19.",
      ],
    }),
  }),
  createSourceOutput({
    label: "GitHubシグナル",
    proof: "参照元 GitHub local automation repos",
    title: "Local Automation Command Center",
    signal:
      "ローカルPC上でファイル整理、CLI実行、ブラウザ操作、社内ツール連携を自動化するリポジトリが増えている。非エンジニアは何を自動化すべきか整理できない。",
    buyer: "小規模事業者、業務改善担当、AIで社内作業を減らしたい個人事業主",
    pain:
      "日次ファイル整理、CSVチェック、請求前確認、メール下書きなどの作業が散らばり、AI自動化できそうでも設計できない。",
    product:
      "業務メモを入力すると、自動化候補、コマンド手順、リスク、反応後のBuild Promptを生成するローカル自動化設計ツール。",
    price: "$49 setup template",
    whyNow:
      "ローカル自動化とAI coding toolsが揃い、非エンジニア業務でも小さな自動化を売りやすくなったから。",
    validationSteps: [
      "CSV整理やファイル命名の自動化デモを作る。",
      "小規模事業者20人に送る。",
      "毎週繰り返すPC作業を1つ聞く。",
      "$49の自動化設計テンプレートを提案する。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "Local Automation Command Center",
      buyer: "Small operators, solo business owners, and internal ops people who want AI-assisted local automation without designing scripts themselves.",
      pain:
        "Repeated desktop tasks are scattered across files, folders, CSVs, browser tabs, and email drafts. The buyer knows automation is possible but cannot define the workflow safely.",
      productAngle:
        "A local automation planner that turns messy task notes into automation candidates, command steps, risk checks, and build-ready prompts.",
      firstVersion:
        "A single-page app with task input, automation classifier, command plan, risk checklist, and prompt output.",
      price: "$49 setup template.",
      validationSteps: [
        "Record a demo turning one repetitive desktop task into an automation plan.",
        "Send it to 20 small operators.",
        "Ask for one real weekly task.",
        "Offer the template at $49.",
      ],
    }),
  }),
  createSourceOutput({
    label: "GitHubシグナル",
    proof: "参照元 GitHub MCP ecosystem / tool server patterns",
    title: "MCP Tool Idea Generator",
    signal:
      "MCPサーバーやツール連携のリポジトリが増え、AIツールが外部データや業務アプリに接続しやすくなっている。だが開発者はどのMCPツールが売れるか判断しづらい。",
    buyer: "MCPに興味があるAIビルダー、社内ツール開発者、業務SaaSの拡張機能を作る個人開発者",
    pain:
      "MCPの技術例は多いが、買う相手、業務痛み、価格、最初のデモに落とせないため、作る対象が決まらない。",
    product:
      "業務カテゴリを選ぶと、MCPツール案、接続対象、ユーザー痛み、最初のデモ、反応後のBuild Promptを生成する市場検証ツール。",
    price: "$19 one-time",
    whyNow:
      "MCPは開発者の注目が高く、早い段階で業務別テンプレートや証拠つきの収益機会を欲しがる層がいるから。",
    validationSteps: [
      "Gmail、Notion、GitHub向けMCPアイデア3件を作る。",
      "AIビルダー向けにXで投稿する。",
      "MCP関連投稿に反応する30人にDMする。",
      "$19で5件の購入または待機リスト登録を取る。",
    ],
    masterPrompt: createMasterPrompt({
      productName: "MCP Tool Idea Generator",
      buyer: "AI builders, MCP experimenters, internal tool developers, and solo founders exploring tool-server products.",
      pain:
        "Developers see MCP examples but struggle to turn them into buyer-specific products with a clear workflow, value, price, and demo.",
      productAngle:
        "A signal-to-tool workspace that turns one workflow category into MCP tool ideas, buyer pain, connection targets, validation plans, and build prompts.",
      firstVersion:
        "A one-page app with workflow category selector, generated MCP tool cards, buyer notes, first-demo checklist, and copyable prompts.",
      price: "$19 one-time.",
      validationSteps: [
        "Generate 3 MCP tool ideas for popular workflow categories.",
        "Record a 60-second demo.",
        "Share it with MCP and AI builder audiences.",
        "Ask for 5 purchases or waitlist signups.",
      ],
    }),
  })],
};

function getLocalDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function readFreeUsageCount() {
  try {
    const raw = window.localStorage.getItem(FREE_USAGE_STORAGE_KEY_JP);

    if (!raw) {
      return 0;
    }

    const parsed = JSON.parse(raw) as { date?: string; count?: number };

    if (parsed.date !== getLocalDateKey()) {
      return 0;
    }

    return Math.max(0, Math.min(FREE_DAILY_LIMIT_JP, Number(parsed.count) || 0));
  } catch {
    return 0;
  }
}

function writeFreeUsageCount(count: number) {
  try {
    window.localStorage.setItem(
      FREE_USAGE_STORAGE_KEY_JP,
      JSON.stringify({
        date: getLocalDateKey(),
        count: Math.max(0, Math.min(FREE_DAILY_LIMIT_JP, count)),
      }),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium text-zinc-500">
      <Link href="/app" className="rounded-full px-3 py-1.5 transition hover:text-white">
        英語
      </Link>
      <span className="rounded-full bg-white px-3 py-1.5 text-zinc-950">日本語</span>
    </div>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-semibold transition sm:w-auto",
        variant === "primary"
          ? "bg-white text-zinc-950 hover:bg-zinc-200"
          : "border border-white/10 text-zinc-100 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function JapaneseMarketSelectionSection({
  canGenerate,
  onMarketChange,
  onReveal,
  opportunity,
  selectedMarket,
}: {
  canGenerate: boolean;
  onMarketChange: (market: JapaneseMarketKey) => void;
  onReveal: () => void;
  opportunity: SourceOutput;
  selectedMarket: JapaneseMarketKey;
}) {
  const marketLabel = getMarketLabelJa(selectedMarket);
  const buyer = getOpportunityValueByLabelJa(opportunity, "誰が払うか");
  const pain = getOpportunityValueByLabelJa(opportunity, "痛み");
  const firstOffer = getOpportunityValueByLabelJa(opportunity, "初回有料オファー");
  const price = getOpportunityValueByLabelJa(opportunity, "価格");

  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.055] p-4 shadow-2xl md:rounded-3xl md:p-6">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            ここから開始
          </div>
          <h2 className="mt-1 break-words text-2xl font-black tracking-tight text-white md:mt-2 md:text-4xl">
            AIに「何を作ればいいか」を聞くのをやめる
          </h2>
          <p className="mt-2 max-w-2xl break-words text-sm leading-relaxed text-zinc-400 md:mt-3 md:leading-7">
            Codexで商売を始めるために、最初の火種を出します。種と方向を選ぶだけで、買う相手、痛み、初回オファー、48時間検証、Codex Promptまで整理します。
          </p>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-black uppercase tracking-wide text-zinc-400 md:block">
          収益機会を選ぶ → 自分向けに変える → 今日検証する → 反応後に作る
        </div>
      </div>

      <div className="mt-3 flex min-w-0 flex-wrap gap-2 pb-1 md:mt-5">
        {japaneseMarketOptions.map((market) => {
          const active = selectedMarket === market.key;

          return (
            <button
              key={market.key}
              type="button"
              onClick={() => onMarketChange(market.key)}
              className={[
                "min-h-11 rounded-full border px-3 py-2 text-sm font-black transition",
                active
                  ? "border-emerald-300 bg-emerald-300 text-black"
                  : "border-white/10 bg-black/25 text-zinc-400 hover:border-white/20 hover:text-white",
              ].join(" ")}
            >
              {market.label}
            </button>
          );
        })}
      </div>

      <article className="mt-3 min-w-0 overflow-hidden rounded-2xl border border-emerald-300/35 bg-black/35 p-4 shadow-lg shadow-emerald-950/20 md:mt-5 md:rounded-3xl md:p-5">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-400">
                {marketLabel}
              </span>
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/[0.08] px-2 py-1 text-emerald-200">
                スコア {getJapaneseOpportunityScore(opportunity)}/50
              </span>
              <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-zinc-500">
                根拠の目安 {getJapaneseEvidenceLevel(opportunity)}
              </span>
            </div>
            <div className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-500 md:mt-4">
              Money Move
            </div>
            <h3 className="mt-2 break-words text-xl font-black tracking-tight text-white md:text-2xl">
              {opportunity.title}
            </h3>
            <p className="mt-2 break-words text-sm leading-relaxed text-zinc-400 md:mt-3 md:leading-7">
              買う相手: {buyer}
            </p>
            <p className="mt-2 line-clamp-3 break-words text-sm leading-relaxed text-zinc-200 md:line-clamp-none md:leading-7">
              お金を払ってでも解決したい課題: {pain}
            </p>
          </div>
          <button
            type="button"
            onClick={onReveal}
            disabled={!canGenerate}
            className="w-full rounded-xl bg-emerald-300 px-4 py-3 text-center text-sm font-black text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto lg:rounded-2xl lg:px-5 lg:py-4"
          >
            無料でMoney Moveを試す
          </button>
        </div>

        <details className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 md:hidden">
          <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-wide text-zinc-500">
            詳細を見る
          </summary>
          <div className="mt-3 grid gap-2">
            <JapaneseMarketField label="なぜ販売になるか" value={getWhyThisOpportunityJa(opportunity)} />
            <JapaneseMarketField label="初回オファー" value={`${firstOffer}\n${price}`} />
            <JapaneseMarketField label="参照元" value={opportunity.proof} />
            <JapaneseMarketField
              label="48時間検証"
              value="48時間で投稿/DMを検証。返信があった場合だけCodexで小さく作る。"
            />
          </div>
        </details>

        <div className="mt-4 hidden min-w-0 gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
          <JapaneseMarketField label="なぜ販売になるか" value={getWhyThisOpportunityJa(opportunity)} />
          <JapaneseMarketField label="初回オファー" value={`${firstOffer}\n${price}`} />
          <JapaneseMarketField label="参照元" value={opportunity.proof} />
          <JapaneseMarketField
            label="48時間検証"
            value="48時間で投稿/DMを検証。返信があった場合だけCodexで小さく作る。"
          />
        </div>
      </article>
    </section>
  );
}

function JapaneseMarketField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="break-words text-[11px] font-black uppercase tracking-wide text-zinc-600">
        {label}
      </div>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">{value}</p>
    </div>
  );
}

function JapaneseEvidenceToolsSection() {
  return (
    <div className="mt-4 grid min-w-0 gap-3">
      <details className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <summary className="cursor-pointer list-none">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                証拠インボックス
              </div>
              <p className="mt-1 break-words text-sm font-bold leading-6 text-zinc-300">
                収益、価格、買う相手、販売導線など、「実際にお金が動いた可能性がある証拠」を確認する場所です。
              </p>
            </div>
            <div className="text-xs font-bold text-zinc-600">開く</div>
          </div>
        </summary>
        <p className="mt-4 break-words border-t border-white/10 pt-4 text-sm leading-7 text-zinc-500">
          証拠はランキングエンジンに入ります。承認された証拠が増えるほど、Bilionは「どの市場で、何を先に売るべきか」を判断しやすくなります。
        </p>
      </details>

      <details className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <summary className="cursor-pointer list-none">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                証拠貼り付けインポート
              </div>
              <p className="mt-1 break-words text-sm font-bold leading-6 text-zinc-300">
                市場の証拠を貼り付けて、収益機会に変換できるかを確認します。
              </p>
            </div>
            <div className="text-xs font-bold text-zinc-600">準備中</div>
          </div>
        </summary>
        <p className="mt-4 break-words border-t border-white/10 pt-4 text-sm leading-7 text-zinc-500">
          証拠貼り付けインポートは英語版で先行テスト中です。日本語版では、まず市場選定と販売素材の生成を使ってください。
        </p>
      </details>
    </div>
  );
}

export default function JapaneseBilionAppClient(
  props: JapaneseBilionAppClientProps,
) {
  if (!props.hasFounderAccess) {
    return <BilionCoreClient hasFounderAccess={false} />;
  }

  return <JapaneseBilionPaidAppClient {...props} />;
}

function JapaneseBilionPaidAppClient({
  hasFounderAccess,
}: JapaneseBilionAppClientProps) {
  const [freeUsageCount, setFreeUsageCount] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [copyPromptStatus, setCopyPromptStatus] =
    useState<"" | "copied" | "error">("");
  const [sourceType, setSourceType] = useState<SourceType>("indie");
  const [selectedMarket, setSelectedMarket] =
    useState<JapaneseMarketKey>("education");
  const [currentOutputIndex, setCurrentOutputIndex] = useState(0);
  const [currentOutput, setCurrentOutput] = useState<SourceOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = "ja";
    const loadAccess = window.setTimeout(() => {
      const usageCount = readFreeUsageCount();

      setFreeUsageCount(usageCount);
      setShowOutput(false);
    }, 0);

    return () => {
      document.documentElement.lang = previousLanguage;
      window.clearTimeout(loadAccess);
    };
  }, []);

  const selectedPool = sourceOutputPools[sourceType];
  const selectedOutput =
    currentOutput ?? selectedPool[currentOutputIndex] ?? selectedPool[0]!;
  const topMarketOpportunity = getTopMarketOpportunityJa(selectedMarket);
  const freeRunsRemaining = hasFounderAccess
    ? Infinity
    : Math.max(0, FREE_DAILY_LIMIT_JP - freeUsageCount);
  const canGenerate = hasFounderAccess || freeRunsRemaining > 0;

  function incrementFreeUsage() {
    if (hasFounderAccess) {
      return;
    }

    const nextCount = freeUsageCount + 1;
    writeFreeUsageCount(nextCount);
    setFreeUsageCount(nextCount);
  }

  function generateLocalOutput() {
    const nextIndex = showOutput
      ? getNextOutputIndex(selectedPool.length, currentOutputIndex)
      : currentOutputIndex;
    setCurrentOutputIndex(nextIndex);
    setCurrentOutput(selectedPool[nextIndex] ?? selectedPool[0]!);
  }

  async function generateIndieOutput() {
    try {
      const response = await fetch("/api/goldmine/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buildType: pickRandom(buildTypes),
          audience: pickRandom(audiences),
          seed: Date.now(),
          offset: freeUsageCount + currentOutputIndex,
          excludeTitle: showOutput ? selectedOutput.title : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Goldmine request failed");
      }

      const data = (await response.json()) as GoldmineMatchResponse;

      if (!data.free) {
        throw new Error("Goldmine response missing free result");
      }

      if (!hasUsableJapaneseGoldmineResult(data.free)) {
        generateLocalOutput();
        return;
      }

      setCurrentOutput(mapGoldmineResultToSourceOutput(data.free));
    } catch {
      generateLocalOutput();
    }
  }

  async function generateOutput() {
    if (!canGenerate || isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      if (sourceType === "indie") {
        await generateIndieOutput();
      } else {
        generateLocalOutput();
      }

      incrementFreeUsage();
      setShowOutput(true);
    } finally {
      setIsGenerating(false);
    }
  }

  function revealMarketOpportunity() {
    if (!canGenerate || isGenerating) {
      return;
    }

    setCurrentOutput(topMarketOpportunity);
    setShowOutput(true);
    setCopyPromptStatus("");
    incrementFreeUsage();
  }

  async function copyMasterPrompt() {
    const promptText = buildJapaneseImplementationPrompt(selectedOutput);

    const copied = await writeClipboardTextJa(promptText);
    setCopyPromptStatus(copied ? "copied" : "error");
    window.setTimeout(() => setCopyPromptStatus(""), 1500);
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden bg-[#0b0c0e] text-white">
      <section className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-4 sm:px-6 md:py-7">
        <header className="flex min-w-0 items-center justify-between gap-4">
          <Link href="/jp" className="group flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-black text-zinc-950">
              B
            </div>
            <div className="min-w-0">
              <div className="break-words text-lg font-black tracking-tight transition group-hover:text-zinc-200">
                Bilion
              </div>
              <div className="text-xs text-zinc-500">AIビルダー向け市場シグナル</div>
            </div>
          </Link>
          <LanguageSwitch />
        </header>

        <section className="w-full max-w-full overflow-hidden py-4 md:py-12">
          <JapaneseMarketSelectionSection
            canGenerate={canGenerate}
            onMarketChange={(market) => {
              setSelectedMarket(market);
              setShowOutput(false);
              setCopyPromptStatus("");
            }}
            onReveal={revealMarketOpportunity}
            opportunity={topMarketOpportunity}
            selectedMarket={selectedMarket}
          />
          <JapaneseEvidenceToolsSection />
        </section>

        <section className="grid min-w-0 gap-5 pb-10 md:gap-8 md:pb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="min-w-0">
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              その他のシグナル
            </div>
            <h1 className="mt-3 max-w-2xl break-words text-3xl font-semibold leading-tight tracking-tight md:mt-5 md:text-5xl">
              まずは上の「Money Move」から始めてください。
            </h1>
            <p className="mt-3 max-w-xl break-words text-sm leading-relaxed text-zinc-400 md:mt-5 md:text-base md:leading-7">
              さらに探したい場合は、GitHubシグナルやIndie Hackers DBから別の火種を確認できます。BilionはランダムにAIアイデアを出すツールではなく、作る前に買う相手・痛み・初回オファーを決めるためのツールです。
            </p>

            <div className="mt-4 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111214] p-4 md:mt-7">
              <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">
                ソースを選択
              </div>
              <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
                {(Object.keys(sourceOutputPools) as SourceType[]).map((source) => {
                  const active = sourceType === source;

                  return (
                    <button
                      key={source}
                      type="button"
                      onClick={() => {
                        setSourceType(source);
                        setCurrentOutputIndex(0);
                        setCurrentOutput(null);
                        setShowOutput(false);
                        setCopyPromptStatus("");
                      }}
                      className={[
                        "min-w-0 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition break-words",
                        active
                          ? "border-white/30 bg-white text-zinc-950"
                          : "border-white/10 bg-black/20 text-zinc-300 hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      {source === "indie" ? "Indie Hackers DB" : "GitHubシグナル"}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 break-words rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-500">
                参照元 IH42kDB + GitHubシグナル
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {canGenerate ? (
                <button
                  type="button"
                  onClick={generateOutput}
                  disabled={isGenerating}
                  className="w-full rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isGenerating ? "生成中..." : "別のMoney Moveを表示"}
                </button>
              ) : (
                <ButtonLink href="/jp/founder">Bilion Proを見る</ButtonLink>
              )}
              <ButtonLink href="/jp" variant="secondary">
                トップに戻る
              </ButtonLink>
            </div>
            {!hasFounderAccess && (
              <p className="mt-4 max-w-xl break-words text-sm leading-6 text-zinc-500">
                無料でも有料版と同じ品質の出力を1日3回まで確認できます。Bilion Proでは、
                Money Moveの無制限閲覧、追加バージョン、保存、検証後のBuildプランが使えます。
              </p>
            )}
            <p className="mt-3 max-w-xl break-words text-xs leading-5 text-zinc-500">
              まず売る。反応があったものだけ作る。Codex実装プロンプトは、市場反応を見たあとに使います。
            </p>
            {hasFounderAccess && (
              <p className="mt-4 max-w-xl break-words text-sm leading-6 text-zinc-500">
                Bilion Proが有効です。Money Moveの無制限閲覧、追加バージョン、保存、検証後の実装プランが使えます。
              </p>
            )}
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111214] p-4 shadow-xl shadow-black/20 md:p-5">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">
                {showOutput ? "販売素材" : "まだ表示されていません"}
              </div>
              {showOutput ? (
                <>
                  <h2 className="mt-1 break-words text-lg font-semibold text-white">{selectedOutput.title}</h2>
                  <p className="mt-2 break-words text-xs leading-5 text-zinc-500">{selectedOutput.proof}</p>
                  <p className="mt-3 break-words rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-2 text-xs leading-5 text-emerald-100">
                    まず投稿/DMで売る。返信、保存、クリック、購入意思が出たらCodexで作る。
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 break-words text-sm leading-7 text-zinc-400">
                    市場を選び、「無料でMoney Moveを試す」を押してください。
                  </p>
                  <p className="mt-3 break-words rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-500">
                    参照元 IH42kDB + GitHubシグナル
                  </p>
                </>
              )}
            </div>

            {showOutput && (
              <div className="mt-4 grid min-w-0 gap-3">
                {getOpportunityFieldsJa(selectedOutput).map(([label, value]) => (
                  <div key={label} className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/25 p-3.5">
                    <div className="text-xs font-semibold tracking-wide text-zinc-500">
                      {label}
                    </div>
                    <div className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-100">
                      {value}
                    </div>
                  </div>
                ))}
                <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/25 p-3.5">
                  <div className="text-xs font-semibold tracking-wide text-zinc-500">
                    48時間検証プラン
                  </div>
                  <ol className="mt-2 space-y-1 text-sm leading-6 text-zinc-100">
                    {selectedOutput.validationSteps.map((step, index) => (
                      <li key={step} className="flex min-w-0 gap-2">
                        <span className="text-zinc-500">{index + 1}.</span>
                        <span className="min-w-0 break-words">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {!hasFounderAccess && (
                  <div className="min-w-0 overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                    <h3 className="break-words text-lg font-semibold text-white">
                      Bilion Proを解除 — $9.99/月
                    </h3>
                    <p className="mt-2 break-words text-sm leading-6 text-zinc-400">
                      Money Moveの無制限閲覧、追加バージョン、保存、検証後のBuildプランを含みます。
                    </p>
                    <div className="mt-4">
                      <ButtonLink href="/jp/founder">完全版を見る</ButtonLink>
                    </div>
                  </div>
                )}
                <JapaneseMobileShareKit output={selectedOutput} />
              </div>
            )}
          </div>
        </section>

        {!hasFounderAccess && freeUsageCount >= FREE_DAILY_LIMIT_JP && (
          <section className="w-full max-w-full overflow-hidden border-t border-white/10 py-10">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-4 md:p-6">
              <h2 className="break-words text-2xl font-semibold tracking-tight text-yellow-100">
                本日の無料Money Move 3件を使い切りました。
              </h2>
              <p className="mt-3 max-w-3xl break-words text-sm leading-7 text-zinc-400">
                Bilion Proでは、Money Moveの無制限閲覧、追加バージョン、保存、検証後のBuildプランが使えます。
              </p>
              <div className="mt-5">
                <ButtonLink href="/jp/founder">Bilion Proを解除 — $9.99/月</ButtonLink>
              </div>
            </div>
          </section>
        )}

        {showOutput && (
          <section className="w-full max-w-full overflow-hidden border-t border-white/10 py-10">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111214] p-4 md:p-6">
              <div className="flex min-w-0 flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    CODEX実装プロンプト
                  </div>
                  <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight">
                    反応があったら作る。
                  </h2>
                  <p className="mt-3 max-w-3xl break-words text-sm leading-7 text-zinc-400">
                    返信、クリック、購入意思が出たあとに、このCodexプロンプトを使ってください。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyMasterPrompt}
                  className="w-full rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 sm:w-auto"
                >
                  {copyPromptStatus === "copied"
                    ? "コピー済み"
                    : copyPromptStatus === "error"
                      ? "コピーできませんでした"
                      : "Codexプロンプトをコピー"}
                </button>
              </div>
              <pre className="mt-5 max-h-[620px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/35 p-4 font-sans text-sm leading-6 text-zinc-100">
                {buildJapaneseImplementationPrompt(selectedOutput)}
              </pre>
              {!hasFounderAccess && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Codex実装プロンプトのプレビュー
                  </div>
                  <p className="mt-2 break-words text-sm leading-6 text-zinc-400">
                    プロンプト全文はロックされています。Bilion Proで検証後の実装プラン全文を利用できます。
                  </p>
                  <div className="mt-4">
                    <ButtonLink href="/jp/founder">Bilion Proを解除 — $9.99/月</ButtonLink>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="w-full max-w-full overflow-hidden border-t border-white/10 py-8">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111214] p-4 md:p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              勝ち筋の確認
            </div>
            <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight">
              勝ち筋とは、市場から反応があった収益機会です。
            </h2>
            <p className="mt-3 max-w-3xl break-words text-sm leading-7 text-zinc-400">
              証拠 → 収益機会 → 販売素材 → 市場反応 → 勝ち筋。返信、保存、クリック、DM、購入意思が出たものだけを、次に作るべき候補として残します。
            </p>
          </div>
        </section>

        <JapaneseInlineShowcaseSection />
      </section>
    </main>
  );
}

function JapaneseInlineShowcaseSection() {
  return (
    <section className="w-full max-w-full overflow-hidden border-t border-white/10 py-10">
      <div className="mb-5">
        <h2 className="break-words text-2xl font-semibold tracking-tight text-white">
          検証デモ
        </h2>
        <p className="mt-2 break-words text-sm leading-6 text-zinc-500">
          Bilionのシグナルから作った、検証用の小さなデモです。
        </p>
      </div>

      <div className="grid min-w-0 gap-3 lg:grid-cols-3">
        {showcaseItems.slice(0, 5).map((item) => (
          <article
            key={item.route}
            className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111214] p-4 md:p-5"
          >
            <div className="text-xs font-semibold tracking-wide text-zinc-500">
                  検証デモ
            </div>
            <h3 className="mt-2 break-words text-base font-semibold text-white">
              {item.name}
            </h3>

            <div className="mt-4 grid min-w-0 gap-3 text-sm leading-6">
              <div>
                <div className="text-xs font-semibold tracking-wide text-zinc-500">
                  元シグナル
                </div>
                <p className="mt-1 break-words text-zinc-300">{item.signal}</p>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-wide text-zinc-500">
                  買う相手
                </div>
                <p className="mt-1 break-words text-zinc-300">{item.buyer}</p>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-wide text-zinc-500">
                  価格仮説
                </div>
                <p className="mt-1 break-words text-zinc-300">{item.revenueIdea}</p>
              </div>
            </div>

            <Link
              href={item.route}
              className="mt-5 inline-flex w-full rounded-xl border border-white/10 px-3 py-3 text-center text-xs font-semibold text-white transition hover:bg-white/[0.04] sm:w-auto"
            >
              デモを見る
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function JapaneseMobileShareKit({ output }: { output: SourceOutput }) {
  const [copiedKey, setCopiedKey] = useState("");
  const shareItems = [
    {
      key: "x-post",
      label: "X投稿をコピー",
      helper: "この内容をX投稿用にコピー",
      text: buildJapaneseMobileXPost(output),
    },
    {
      key: "reply",
      label: "返信をコピー",
      helper: "興味を示した相手への返信文",
      text: japaneseMobileReplyCopy,
    },
    {
      key: "dm",
      label: "DMをコピー",
      helper: "見込み客へ送るDM文",
      text: japaneseMobileDmCopy,
    },
    {
      key: "sales-cta",
      label: "販売CTAをコピー",
      helper: "Bilion Proの案内文",
      text: japaneseMobileSalesCtaCopy,
    },
  ];

  async function copyShareText(key: string, text: string) {
    const copied = await writeClipboardTextJa(text);
    setCopiedKey(copied ? key : "error");
    window.setTimeout(() => setCopiedKey(""), 1200);
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
      <div className="text-xs font-semibold tracking-wide text-emerald-300">
        モバイル共有セット
      </div>
      <p className="mt-2 break-words text-sm leading-6 text-zinc-400">
        Xへ投稿し、興味を示した相手へ返信し、Bilion Proを案内するための文面です。
      </p>
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
        {shareItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => copyShareText(item.key, item.text)}
            className="min-h-20 min-w-0 rounded-xl bg-white px-4 py-4 text-left text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            <span className="block break-words">
              {copiedKey === item.key ? "コピー済み" : item.label}
            </span>
            <span className="mt-1 block break-words text-xs leading-5 text-zinc-600">
              {item.helper}
            </span>
          </button>
        ))}
      </div>
      {copiedKey === "error" && (
        <p className="mt-3 text-sm font-semibold text-yellow-100">
          コピーできませんでした。テキストを選択して手動でコピーしてください。
        </p>
      )}
    </div>
  );
}
