import type { ContentStudioRecord } from "@/lib/content-studio";

export type OfferTone = "direct" | "founder" | "calm" | "premium";

export type OfferLadderPrices = {
  lowTicket: 770 | 1980 | 2980;
  core: 9800 | 14800 | 19800 | 29800;
  premium: 49800 | 98000 | 198000;
};

export type OfferBlock = {
  name: string;
  format?: string;
  price?: string;
  buyer?: string;
  promise: string;
  whatUserGets?: string[];
  contents?: string[];
  cta?: string;
  whyBuyNow?: string;
  deliveryFormat?: string;
  deliveryTime?: string;
  whyThisCanSell?: string;
  whoShouldBuy?: string;
  manualSteps?: string[];
  whyManualIsOkay?: string;
};

export type SalesPageSections = {
  heading: string;
  forWho: string;
  pain: string;
  outcome: string;
  contents: string[];
  price: string;
  deliveryFormat: string;
  faq: string[];
  cta: string;
};

export type ValidationPlan = {
  xPost: string;
  dmSendCount: string;
  freeSampleCount: string;
  reactionCheck: string;
  sellCriteria: string;
  killCriteria: string;
};

export type OfferLadderPack = {
  sourceTitle: string;
  sourceType: string;
  buyer: string;
  paidPain: string;
  moneyProof: string;
  freeBait: OfferBlock;
  lowTicketOffer: OfferBlock;
  coreOffer9800: OfferBlock;
  premiumOffer29800: OfferBlock;
  doneForYouOffer49800: OfferBlock;
  deliveryAssets: string[];
  xPost: string;
  dmScript: string;
  salesPageSections: SalesPageSections;
  validationPlan: ValidationPlan;
  buildPrompt: string;
  riskNotes: string[];
  nextAction: string;
};

const FALLBACK = "不明";

function cleanText(value: string | undefined, fallback = FALLBACK) {
  const trimmed = value?.replace(/\s+/g, " ").trim();

  return trimmed && trimmed !== "Not extracted yet" ? trimmed : fallback;
}

function compact(value: string, maxLength: number) {
  const cleanValue = cleanText(value);

  if (cleanValue.length <= maxLength) {
    return cleanValue;
  }

  return `${cleanValue.slice(0, maxLength).trim()}...`;
}

function yen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}

function normalizeSourceType(sourceType: ContentStudioRecord["sourceType"]) {
  if (sourceType === "money move") {
    return "money signal";
  }

  if (sourceType === "signal") {
    return "gmail signal";
  }

  return "success pattern";
}

function toneLine(tone: OfferTone) {
  const lines: Record<OfferTone, string> = {
    calm: "煽らず、相手の作業負担と機会損失を具体的に見せる。",
    direct: "結論から入り、買う理由と納品物をはっきり出す。",
    founder: "検証中の提案として、創業者目線で一緒に磨く温度感にする。",
    premium: "安売りではなく、個別設計と実務削減の価値を前面に出す。",
  };

  return lines[tone];
}

function buildRiskNotes(record: ContentStudioRecord) {
  const text = `${record.title} ${record.buyer} ${record.pain} ${record.productIdea}`.toLowerCase();
  const notes = [
    "数字や実績は元ネタにある範囲だけ使い、推測で売上・CVR・効果を盛らない。",
    "DMは一括送信感を出さず、無料サンプルの許可を取る形にする。",
    "最初から外部API連携や自動化を約束せず、手作業納品で検証する。",
  ];

  if (/health|clinic|dental|medical|patient|医療|患者|治療/.test(text)) {
    notes.push("医療領域は診断・治療効果を断定しない。受付、事務、コミュニケーション改善に限定する。");
  }

  if (/finance|insurance|tax|legal|law|金融|保険|税|法律|士業/.test(text)) {
    notes.push("金融・法律・税務領域は専門助言に見える表現を避け、情報整理と業務補助の納品に限定する。");
  }

  if (/google|review|platform|instagram|x|reddit|linkedin/.test(text)) {
    notes.push("口コミ、SNS、コミュニティ施策は各プラットフォーム規約とスパム判定に注意する。");
  }

  return notes;
}

export function buildOfferLadderPack(
  record: ContentStudioRecord,
  prices: OfferLadderPrices,
  buyerOverride: string,
  tone: OfferTone,
): OfferLadderPack {
  const buyer = compact(buyerOverride || record.buyer, 90);
  const sourceTitle = cleanText(record.title);
  const paidPain = compact(record.pain, 150);
  const proof = cleanText(record.proof, "不明");
  const productIdea = compact(record.productIdea, 110);
  const firstProduct = compact(record.firstProduct, 110);
  const corePrice = yen(prices.core);
  const premiumPrice = yen(Math.max(prices.premium, 49800));
  const doneForYouPrice = yen(Math.max(prices.premium, 49800));
  const toneInstruction = toneLine(tone);

  const deliveryAssets = [
    "30日分のネタまたは改善テーマ",
    "X投稿文10本",
    "初回DM文10通",
    "無料サンプル提案文",
    "販売ページ見出しと構成",
    "納品チェックリスト",
    "NotionまたはMarkdown納品テンプレ",
    "Googleスプレッドシート管理表",
    "CodeXプロンプト",
    "48時間検証ログ",
  ];

  const freeBaitName = `${buyer}向け ${compact(productIdea, 34)} 無料診断`;
  const coreName = `${buyer}向け ${compact(productIdea, 34)} 実行キット`;
  const premiumName = `${buyer}向け ${compact(productIdea, 32)} 30日パック`;
  const doneForYouName = `${buyer}向け ${compact(productIdea, 30)} 個別セットアップ`;

  const xPost = [
    `${buyer}向けに、1つ無料で作ります。`,
    "",
    `テーマは「${productIdea}」。`,
    `よくある痛みは、${paidPain}`,
    "",
    `無料版では、現状を見て「最初に直すべき1箇所」と「そのまま使える文面」を返します。`,
    `反応があれば、${corePrice}の実行キットとして30日分のネタ、DM、販売ページ構成までまとめます。`,
    "",
    "必要な人は「診断」と返信してください。",
  ].join("\n");

  const dmScript = [
    "はじめまして。突然すみません。",
    "",
    `${buyer}向けに、${productIdea}の無料サンプルを作っています。`,
    `見ている限り、${paidPain} が起きやすそうだと思いました。`,
    "",
    "売り込みではなく、まず1件だけ無料で、",
    "・今すぐ直せるポイント",
    "・そのまま使える文面",
    "・売上や作業時間に効きそうな次の一手",
    "を短くまとめて送れます。",
    "",
    "必要なら、このメッセージに「サンプル希望」とだけ返してください。",
    `よさそうなら、あとで${corePrice}の実行キットか個別作成も案内します。不要なら返信なしで大丈夫です。`,
  ].join("\n");

  const salesPageSections: SalesPageSections = {
    heading: `${buyer}のための${productIdea}実行キット`,
    forWho: `${buyer}で、${paidPain}を放置したくない人向けです。`,
    pain: `作業負担、機会損失、外注費、返信遅れ、売上化までの迷いが増えることが本当の痛みです。`,
    outcome: `${firstProduct}を、すぐ使える納品物として受け取れます。`,
    contents: [
      "現状整理シート",
      "30日分の実行ネタ",
      "X投稿文",
      "DM文",
      "販売ページ構成",
      "納品チェックリスト",
      "48時間検証手順",
    ],
    price: `${corePrice} / 上位版 ${premiumPrice} / 個別対応 ${doneForYouPrice}`,
    deliveryFormat: "Markdown、PDF、Notion、Googleスプレッドシートのいずれかで納品",
    faq: [
      "Q. ツールは必要ですか？ A. 最初は不要です。手作業で検証できる形にしています。",
      "Q. 業種に合わせられますか？ A. Premium以上は個別の文面調整を含みます。",
      "Q. 成果保証はありますか？ A. 売上保証はしません。48時間で反応を見るための実行資産を納品します。",
    ],
    cta: "まず無料診断を受け取る / すぐ実行キットを購入する",
  };

  const validationPlan: ValidationPlan = {
    xPost: "上記X投稿を1本出し、固定またはプロフィール導線に無料診断CTAを置く。",
    dmSendCount: "見込み客10件に、個別に文脈を入れてDMを送る。",
    freeSampleCount: "返信があった相手へ無料サンプルを3件まで手作業で作る。",
    reactionCheck: "返信率20%以上、無料サンプル希望2件以上、有料相談1件以上を強い反応とする。",
    sellCriteria: `${corePrice}以上で1件売れる、または${premiumPrice}以上の相談が1件出たら継続する。`,
    killCriteria: "10DM、1X投稿、3無料サンプルで返信ゼロなら、buyerか痛みを変更する。",
  };

  return {
    sourceTitle,
    sourceType: normalizeSourceType(record.sourceType),
    buyer,
    paidPain,
    moneyProof: proof,
    freeBait: {
      name: freeBaitName,
      format: "無料診断 / チェックリスト / 1件サンプル",
      promise: `${buyer}が最初に直すべき有料化ポイントを1つ見つける。`,
      whatUserGets: [
        "現状の痛みの要約",
        "最初に直す1箇所",
        "そのまま使える文面1つ",
        "有料化できる次の提案",
      ],
      cta: "「診断」と返信してください。",
    },
    lowTicketOffer: {
      name: `${buyer}向け ${compact(productIdea, 34)} スターターキット`,
      price: yen(prices.lowTicket),
      buyer,
      promise: "買ったその日に、無料診断から有料提案までの型を使える。",
      contents: [
        "チェックリスト",
        "プロンプト集",
        "X投稿5本",
        "DM文5通",
        "販売ページの骨子",
      ],
      whyBuyNow: "低単価で買う人がいるかを確認し、反応があれば本命商品へ案内できる。",
    },
    coreOffer9800: {
      name: coreName,
      price: corePrice,
      buyer,
      promise: `${paidPain}を、30日分の実行資産に変える。`,
      contents: deliveryAssets.slice(0, 8),
      deliveryFormat: "Markdown + Googleスプレッドシート + コピペ用文面",
      deliveryTime: "購入後24〜72時間で初版納品",
      whyThisCanSell: `${buyer}は時間、売上機会、外注費の痛みがあり、無料ツールよりもすぐ使える納品物にお金を払いやすい。`,
    },
    premiumOffer29800: {
      name: premiumName,
      price: premiumPrice,
      buyer,
      promise: "業種や顧客状況に合わせた30日分の販売・発信・追客資産をまとめて受け取る。",
      contents: [
        "30日分コンテンツパック",
        "DM追客30日パック",
        "販売ページ構成",
        "無料診断テンプレ",
        "反応管理シート",
        "改善案3パターン",
      ],
      deliveryFormat: "個別ヒアリング後、NotionまたはGoogle Driveで納品",
      whoShouldBuy: "自分でゼロから作る時間がなく、すぐテストできる状態まで欲しい人。",
    },
    doneForYouOffer49800: {
      name: doneForYouName,
      price: doneForYouPrice,
      buyer,
      promise: "無料診断、投稿、DM、販売ページ、初回納品物まで個別に作成する。",
      contents: [
        "個別ヒアリング",
        "オファー設計",
        "無料サンプル作成",
        "X投稿とDM文の作成",
        "販売ページ初稿",
        "納品物一式",
      ],
      deliveryFormat: "手作業の個別セットアップ / 3〜7営業日",
      manualSteps: [
        "見込み客と既存導線を確認する",
        "痛みと買う理由を1つに絞る",
        "無料サンプルを作る",
        "投稿とDMを10件分作る",
        "販売ページ構成と納品物を渡す",
      ],
      whyManualIsOkay: "49,800円以上は自動化より個別精度が価値になる。少数販売で学習し、反応が出た工程だけ後でツール化する。",
    },
    deliveryAssets,
    xPost,
    dmScript,
    salesPageSections,
    validationPlan,
    buildPrompt: [
      `Build a small internal delivery generator for Bilion after replies are confirmed.`,
      "",
      `Source: ${sourceTitle}`,
      `Buyer: ${buyer}`,
      `Paid pain: ${paidPain}`,
      `Core offer: ${coreName} at ${corePrice}`,
      "",
      "Scope:",
      "- Generate delivery assets only for buyers who replied.",
      "- Include fields for buyer, pain, offer, tone, price, sample notes, and final deliverables.",
      "- Output X posts, 10 DMs, sales page sections, delivery checklist, and Markdown export.",
      "- Use local state and localStorage only.",
      "- No auth, billing, database writes, external APIs, or OpenAI API.",
      "- Keep it mobile-friendly and operator-focused.",
      "",
      `Copy tone: ${toneInstruction}`,
    ].join("\n"),
    riskNotes: buildRiskNotes(record),
    nextAction: `今日、${buyer}を10件リストアップし、1件だけ無料サンプルを作ってからDMを送る。`,
  };
}

export function buildOfferLadderMarkdown(pack: OfferLadderPack) {
  const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

  return [
    `# Offer Ladder Pack: ${pack.sourceTitle}`,
    "",
    `sourceType: ${pack.sourceType}`,
    `buyer: ${pack.buyer}`,
    `paidPain: ${pack.paidPain}`,
    `moneyProof: ${pack.moneyProof}`,
    "",
    "## Free Bait",
    `name: ${pack.freeBait.name}`,
    `format: ${pack.freeBait.format}`,
    `promise: ${pack.freeBait.promise}`,
    list(pack.freeBait.whatUserGets || []),
    `cta: ${pack.freeBait.cta}`,
    "",
    "## Low Ticket",
    `name: ${pack.lowTicketOffer.name}`,
    `price: ${pack.lowTicketOffer.price}`,
    `buyer: ${pack.lowTicketOffer.buyer}`,
    `promise: ${pack.lowTicketOffer.promise}`,
    list(pack.lowTicketOffer.contents || []),
    `whyBuyNow: ${pack.lowTicketOffer.whyBuyNow}`,
    "",
    "## Core Offer 9,800円以上",
    `name: ${pack.coreOffer9800.name}`,
    `price: ${pack.coreOffer9800.price}`,
    `buyer: ${pack.coreOffer9800.buyer}`,
    `promise: ${pack.coreOffer9800.promise}`,
    list(pack.coreOffer9800.contents || []),
    `deliveryFormat: ${pack.coreOffer9800.deliveryFormat}`,
    `deliveryTime: ${pack.coreOffer9800.deliveryTime}`,
    `whyThisCanSell: ${pack.coreOffer9800.whyThisCanSell}`,
    "",
    "## Premium Offer 29,800円以上",
    `name: ${pack.premiumOffer29800.name}`,
    `price: ${pack.premiumOffer29800.price}`,
    `buyer: ${pack.premiumOffer29800.buyer}`,
    `promise: ${pack.premiumOffer29800.promise}`,
    list(pack.premiumOffer29800.contents || []),
    `deliveryFormat: ${pack.premiumOffer29800.deliveryFormat}`,
    `whoShouldBuy: ${pack.premiumOffer29800.whoShouldBuy}`,
    "",
    "## Done For You 49,800円以上",
    `name: ${pack.doneForYouOffer49800.name}`,
    `price: ${pack.doneForYouOffer49800.price}`,
    `buyer: ${pack.doneForYouOffer49800.buyer}`,
    `promise: ${pack.doneForYouOffer49800.promise}`,
    list(pack.doneForYouOffer49800.contents || []),
    `deliveryFormat: ${pack.doneForYouOffer49800.deliveryFormat}`,
    list(pack.doneForYouOffer49800.manualSteps || []),
    `whyManualIsOkay: ${pack.doneForYouOffer49800.whyManualIsOkay}`,
    "",
    "## Launch Assets",
    "### X Post",
    pack.xPost,
    "",
    "### DM Script",
    pack.dmScript,
    "",
    "## Delivery Assets",
    list(pack.deliveryAssets),
    "",
    "## Sales Page Sections",
    `見出し: ${pack.salesPageSections.heading}`,
    `誰向けか: ${pack.salesPageSections.forWho}`,
    `悩み: ${pack.salesPageSections.pain}`,
    `何が手に入るか: ${pack.salesPageSections.outcome}`,
    list(pack.salesPageSections.contents),
    `価格: ${pack.salesPageSections.price}`,
    `納品形式: ${pack.salesPageSections.deliveryFormat}`,
    list(pack.salesPageSections.faq),
    `CTA: ${pack.salesPageSections.cta}`,
    "",
    "## Validation Plan",
    `X投稿: ${pack.validationPlan.xPost}`,
    `DM送信数: ${pack.validationPlan.dmSendCount}`,
    `無料サンプル数: ${pack.validationPlan.freeSampleCount}`,
    `反応判定: ${pack.validationPlan.reactionCheck}`,
    `売る基準: ${pack.validationPlan.sellCriteria}`,
    `捨てる基準: ${pack.validationPlan.killCriteria}`,
    "",
    "## Build After Replies",
    pack.buildPrompt,
    "",
    "## Risk Notes",
    list(pack.riskNotes),
    "",
    "## Next Action",
    pack.nextAction,
  ].join("\n");
}
