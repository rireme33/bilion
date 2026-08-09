export type LocalShortVideoInput = {
  faceMode: string;
  goal: string;
  industry: string;
  offer: string;
  outputCount: string;
  storeName: string;
  targetCustomer: string;
  tone: string;
};

export type LocalShortVideoIdea = {
  caption: string;
  cta: string;
  hook: string;
  id: string;
  script15s: string;
  shootingInstructions: string;
  title: string;
  whyItWorks: string;
};

export type LocalShortVideoPack = {
  bilionCta: string;
  createdAt: string;
  id: string;
  ideas: LocalShortVideoIdea[];
  markdown: string;
  paidKitPitch: string;
  proposalDm: string;
  summary: string;
};

const defaultInput: LocalShortVideoInput = {
  faceMode: "手元だけならできる",
  goal: "予約を増やす",
  industry: "美容院",
  offer: "髪質改善カラー",
  outputCount: "5本",
  storeName: "サンプル美容室",
  targetCustomer: "髪のパサつきが気になる30代女性",
  tone: "やさしい",
};

function cleanText(value: string, fallback: string) {
  const trimmed = value.replace(/\s+/g, " ").trim();

  return trimmed.length > 0 ? trimmed : fallback;
}

function getCount(value: string) {
  const match = value.match(/\d+/);

  return match ? Number(match[0]) : 5;
}

function getStoreLabel(input: LocalShortVideoInput) {
  return cleanText(input.storeName, `この${input.industry}`);
}

function getGoalCta(goal: string) {
  if (goal === "問い合わせを増やす") {
    return "気になる方は、プロフィールからお気軽にお問い合わせください。";
  }

  if (goal === "来店を増やす") {
    return "近くに来たときは、ぜひ一度のぞいてみてください。";
  }

  if (goal === "認知を増やす") {
    return "気になった方は、保存してあとで見返してください。";
  }

  if (goal === "信頼を作る") {
    return "お店選びで迷っている方は、プロフィールも見てみてください。";
  }

  if (goal === "採用につなげる") {
    return "一緒に働くことに興味がある方は、プロフィールからご連絡ください。";
  }

  return "気になる方は、プロフィールからご予約ください。";
}

function getToneLine(tone: string) {
  if (tone === "プロっぽい") {
    return "落ち着いた言葉で、仕事の丁寧さが伝わるようにする。";
  }

  if (tone === "おしゃれ") {
    return "余白のある映像と短いテロップで、雰囲気を見せる。";
  }

  if (tone === "信頼重視") {
    return "派手にせず、手順、こだわり、安心感を見せる。";
  }

  if (tone === "初心者向け") {
    return "初めての人にも分かる言葉で、難しい表現は避ける。";
  }

  if (tone === "親しみやすい") {
    return "かしこまりすぎず、近所のお店らしい距離感で見せる。";
  }

  return "やわらかい言葉で、不安を下げる見せ方にする。";
}

function getShootingBase(faceMode: string) {
  if (faceMode === "顔出しできる") {
    return "店主が最初の1秒だけ画面に入り、あとは店内、商品、手元を順番に撮る。";
  }

  if (faceMode === "手元だけならできる") {
    return "顔出しなしでOK。手元、商品、道具、店内の順で短く撮る。";
  }

  if (faceMode === "店内だけ撮りたい") {
    return "人の顔は映さず、入口、店内、席、商品棚、作業スペースを順番に撮る。";
  }

  if (faceMode === "商品だけ撮りたい") {
    return "商品やサービスの準備シーンだけを近めに撮る。背景は明るく整える。";
  }

  return "顔出しなしでOK。入口、店内、商品、手元、看板を順番に撮る。";
}

function buildScript({
  closing,
  middle,
  opening,
}: {
  closing: string;
  middle: string;
  opening: string;
}) {
  return [
    "1秒から3秒",
    opening,
    "",
    "4秒から7秒",
    middle,
    "",
    "8秒から12秒",
    "商品、店内、手元のどれかを近めに映す",
    "",
    "13秒から15秒",
    closing,
  ].join("\n");
}

function buildIdeaTemplates(input: LocalShortVideoInput) {
  const store = getStoreLabel(input);
  const offer = cleanText(input.offer, "おすすめの商品やサービス");
  const target = cleanText(input.targetCustomer, "初めてのお客さん");
  const cta = getGoalCta(input.goal);
  const toneLine = getToneLine(input.tone);
  const shootingBase = getShootingBase(input.faceMode);

  return [
    {
      caption: `初めてのお店は少し緊張しますよね。${store}では、${target}にも入りやすい雰囲気づくりを大切にしています。`,
      hook: "初めてのお店に入るのが不安な人へ",
      script15s: buildScript({
        closing: "初めての方もお気軽にどうぞ、とテロップを入れる",
        middle: "店内の雰囲気、席、商品まわりをゆっくり映す",
        opening: "入口と外観を映す",
      }),
      shootingInstructions: `${shootingBase} ${toneLine}`,
      title: "初めての人が入りやすくなる店内紹介",
      whyItWorks:
        "初回来店前の不安を下げられるため、予約や来店前の心理的ハードルを下げやすい。",
    },
    {
      caption: `${offer}について、よく聞かれるポイントを短くまとめました。迷っている方の参考になればうれしいです。`,
      hook: `${offer}が気になっている人へ`,
      script15s: buildScript({
        closing: "気になる方はプロフィールへ、と表示する",
        middle: "商品やサービスの特徴を3つだけテロップで出す",
        opening: "商品やサービスのアップを映す",
      }),
      shootingInstructions: `${shootingBase} 説明は詰め込みすぎず、1本で伝えることは3つまでにする。`,
      title: "よく聞かれる質問に先回りする動画",
      whyItWorks:
        "お客さんが聞きたいことを先に出すと、問い合わせや予約前の迷いを減らしやすい。",
    },
    {
      caption: `${store}で大切にしている準備の様子です。派手ではありませんが、こういう小さなところを丁寧にしています。`,
      hook: "お店の裏側を少しだけ",
      script15s: buildScript({
        closing: "丁寧に準備してお待ちしています、と表示する",
        middle: "準備中の手元や道具を映す",
        opening: "開店前や準備中の短いカットを映す",
      }),
      shootingInstructions: `${shootingBase} 生活感が出すぎる場所は避け、手元と道具を中心に撮る。`,
      title: "お店の丁寧さが伝わる準備シーン",
      whyItWorks:
        "裏側を見せると、価格やサービスの理由が伝わりやすくなり、信頼につながりやすい。",
    },
    {
      caption: `${target}に向けて、${offer}を選ぶときのポイントを短くまとめました。`,
      hook: "選ぶ前にここだけ見てください",
      script15s: buildScript({
        closing: "迷ったら一度相談してください、と表示する",
        middle: "選ぶポイントを3つテロップで出す",
        opening: "商品やメニュー表を映す",
      }),
      shootingInstructions: `${shootingBase} 専門用語を避け、見た人がすぐ分かる言葉にする。`,
      title: "選び方のポイントを教える動画",
      whyItWorks:
        "売り込みではなく選び方を伝えることで、保存されやすく、相談のきっかけにもなりやすい。",
    },
    {
      caption: `${store}では、${target}が使いやすいように、こんな流れでご案内しています。`,
      hook: "来店後の流れを15秒で紹介します",
      script15s: buildScript({
        closing: "初めてでも流れが分かれば安心、と表示する",
        middle: "受付、説明、商品やサービスの流れを順番に映す",
        opening: "入口または受付まわりを映す",
      }),
      shootingInstructions: `${shootingBase} 時系列で撮る。難しい演出はいらない。`,
      title: "来店後の流れが分かる動画",
      whyItWorks:
        "来店後の流れが分かると、初めての人が行動しやすくなる。",
    },
    {
      caption: `今日は${offer}の細かいこだわりを1つだけ紹介します。こういう部分で仕上がりや使いやすさが変わります。`,
      hook: "実はここを見てほしいです",
      script15s: buildScript({
        closing: "細かいところも丁寧に見ています、と表示する",
        middle: "こだわりの部分を近めに映す",
        opening: "商品や作業中の手元をアップで映す",
      }),
      shootingInstructions: `${shootingBase} 1本で1つのこだわりだけに絞る。`,
      title: "こだわりを1つだけ見せる動画",
      whyItWorks:
        "細かいこだわりを見せると、価格ではなく信頼や納得感で選ばれやすくなる。",
    },
    {
      caption: `${target}からよくある不安について、短く答えます。気になる方は参考にしてください。`,
      hook: "これ、よく聞かれます",
      script15s: buildScript({
        closing: "不安なことは気軽に聞いてください、と表示する",
        middle: "よくある不安と答えを1つずつ見せる",
        opening: "質問風のテロップを大きく出す",
      }),
      shootingInstructions: `${shootingBase} 断定しすぎず、店舗として答えられる範囲で伝える。`,
      title: "よくある不安に答える動画",
      whyItWorks:
        "不安を先に扱うことで、問い合わせ前の迷いを減らしやすい。",
    },
    {
      caption: `${offer}を初めて使う方に向けて、見るべきポイントを15秒でまとめました。`,
      hook: "初めてならここを見てください",
      script15s: buildScript({
        closing: "保存して、あとで見返してください、と表示する",
        middle: "見るべきポイントを順番に映す",
        opening: "商品やサービス全体が分かるカットを映す",
      }),
      shootingInstructions: `${shootingBase} テロップは短く、1画面1メッセージにする。`,
      title: "初めての方向けポイント紹介",
      whyItWorks:
        "初心者向けの説明は保存されやすく、あとから来店や問い合わせにつながりやすい。",
    },
    {
      caption: `${store}の雰囲気が少しでも伝わるように、店内の様子を短くまとめました。`,
      hook: "店内の雰囲気だけ見てください",
      script15s: buildScript({
        closing: "気になった方はプロフィールへ、と表示する",
        middle: "席、棚、商品、照明などを順番に映す",
        opening: "入口から店内へ入るように撮る",
      }),
      shootingInstructions: `${shootingBase} 人が映り込む場合は許可を取り、無理なら開店前に撮る。`,
      title: "雰囲気が伝わる店内ショート",
      whyItWorks:
        "お店の空気感が分かると、初めて行く不安を下げやすい。",
    },
    {
      caption: `${target}に向けて、${offer}を使う前に知っておくとよいことをまとめました。`,
      hook: "来る前に知っておくと安心です",
      script15s: buildScript({
        closing: cta,
        middle: "事前に知ってほしいことを3つだけ出す",
        opening: "商品、店内、メニューのどれかを映す",
      }),
      shootingInstructions: `${shootingBase} 高リスクな助言に見える表現は避け、お店の利用案内にとどめる。`,
      title: "来店前に知っておくと安心なこと",
      whyItWorks:
        "来店前の疑問を減らすことで、行動前の迷いを減らしやすい。",
    },
  ].map((idea, index): LocalShortVideoIdea => ({
    ...idea,
    cta,
    id: `idea-${index + 1}`,
  }));
}

function buildProposalDm(input: LocalShortVideoInput) {
  const industry = cleanText(input.industry, "店舗");

  return [
    "突然すみません。",
    `${industry}向けに、ショート動画のネタと15秒台本を作る無料サンプルを作っています。`,
    "SNSをやった方がいいけど、何を撮ればいいかわからない店舗向けです。",
    "もしよければ、御社の業種に合わせて3本分だけ無料で作れます。",
    "押し売りではないので、不要でしたらそのままスルーしてください。",
  ].join("\n");
}

function buildPaidKitPitch() {
  return [
    "小さな店舗のためのショート動画ネタ生成AIキット",
    "",
    "価格案: 770円",
    "",
    "中身:",
    "- 業種別ネタ100本",
    "- 15秒台本テンプレ",
    "- 撮影指示テンプレ",
    "- 投稿文テンプレ",
    "- 店舗向け提案DM",
    "- 無料サンプル作成手順",
    "- CodeX Build Prompt",
  ].join("\n");
}

function buildMarkdown(input: LocalShortVideoInput, pack: Omit<LocalShortVideoPack, "markdown">) {
  return [
    "# 小さな店舗のためのショート動画ネタ",
    "",
    "## 入力条件",
    `業種: ${input.industry}`,
    `店舗名: ${cleanText(input.storeName, "未入力")}`,
    `商品やサービス: ${input.offer}`,
    `来てほしいお客さん: ${input.targetCustomer}`,
    `投稿の目的: ${input.goal}`,
    `動画の雰囲気: ${input.tone}`,
    `顔出し: ${input.faceMode}`,
    "",
    "## 動画ネタ一覧",
    ...pack.ideas.flatMap((idea, index) => [
      "",
      `### ${index + 1}. ${idea.title}`,
      "",
      `冒頭フック: ${idea.hook}`,
      "",
      "15秒台本",
      idea.script15s,
      "",
      "撮影指示",
      idea.shootingInstructions,
      "",
      "投稿文",
      idea.caption,
      "",
      "CTA",
      idea.cta,
      "",
      "なぜ効くか",
      idea.whyItWorks,
    ]),
    "",
    "## 提案DM",
    pack.proposalDm,
    "",
    "## 有料キット案",
    pack.paidKitPitch,
    "",
    "## Bilionへの導線",
    pack.bilionCta,
  ].join("\n");
}

export function getInitialLocalShortVideoInput(): LocalShortVideoInput {
  return defaultInput;
}

export function generateLocalShortVideoPack(input: LocalShortVideoInput): LocalShortVideoPack {
  const safeInput = {
    ...input,
    offer: cleanText(input.offer, defaultInput.offer),
    targetCustomer: cleanText(input.targetCustomer, defaultInput.targetCustomer),
  };
  const count = getCount(safeInput.outputCount);
  const ideas = buildIdeaTemplates(safeInput).slice(0, count);
  const createdAt = new Date().toISOString();
  const summary = `${safeInput.industry}向けに、${safeInput.offer}の15秒ショート動画ネタを${ideas.length}本作りました。`;
  const packWithoutMarkdown = {
    bilionCta:
      "Bilionでは、海外で金が動いたAIビジネスやツールを見つけ、日本向けに変換し、無料ツール、記事、スターターキットとして試しています。",
    createdAt,
    id: `local-short-video-${Date.now()}`,
    ideas,
    paidKitPitch: buildPaidKitPitch(),
    proposalDm: buildProposalDm(safeInput),
    summary,
  };
  const markdown = buildMarkdown(safeInput, packWithoutMarkdown);

  return {
    ...packWithoutMarkdown,
    markdown,
  };
}
