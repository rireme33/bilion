"use client";

import { useMemo, useState } from "react";

type PromptCard = {
  codexPrompt: string;
  dm: string;
  firstProduct: string;
  inputs: string[];
  moneyReason: string;
  outputItems: string[];
  priceUpPath: string;
  salesPath: string;
  screenImage: string;
  sourceCase: string;
  title: string;
  validation48h: string[];
  xPost: string;
  japanAngle: string;
};

type SingleProductKit = PromptCard & {
  brainNoteCopy: string;
  buyer: string;
  caution: string;
  kitContents: string[];
  productName: string;
  productPrice: string;
  toolTheme: string;
  usage: string[];
};

const outlineItems = [
  "Local Business Review Reply Tool",
  "Invoice Follow-up Assistant",
  "Client Proposal Generator",
  "AI Meeting Follow-up Tool",
  "Shopify Product Page Optimizer",
  "Clinic Cancellation Slot Recovery Tool",
  "Construction Daily Report Builder",
  "Legal Intake Question Generator",
  "Real Estate Showing Follow-up Tool",
  "Bookkeeper Month-End Cleanup Assistant",
  "Creator Comment-to-Product Mapper",
  "Newsletter Lead Magnet Builder",
  "SaaS Trial Drop-off Email Tool",
  "Local SEO Client Report Builder",
  "Course Objection FAQ Generator",
  "LINE First Reply Template Maker",
  "Agency Weekly Report Assistant",
  "App Store Review Mining Tool",
  "Ecommerce Return Reason Analyzer",
  "YouTube Script Offer Extractor",
  "DM Reply Improvement Tool",
  "Notion Template Product Fixer",
  "Reddit Pain Post Mapper",
  "Cursor MVP Spec Builder",
  "Claude Code Requirement Cleaner",
  "Lovable App Prompt Formatter",
  "Bolt Landing Page Brief Maker",
  "v0 UI Prompt Generator",
  "Small Service Pricing Ladder Builder",
  "48-hour Validation Action Planner",
];

function buildToolPrompt({
  title,
  user,
  pain,
  tool,
  inputs,
  outputs,
  sample,
  tone,
  monetization,
}: {
  title: string;
  user: string;
  pain: string;
  tool: string;
  inputs: string[];
  outputs: string[];
  sample: string;
  tone: string;
  monetization: string;
}) {
  return [
    `# ${title}`,
    "",
    "## 役割",
    "あなたは日本語UIに強い、実務向けの小さなAIツール設計者です。見た目よりも、売る前の検証に使える具体性を優先してください。",
    "",
    "## 目的",
    "このプロンプトは、770円商品のサンプルとして見せられる小さなWebツールを作るためのものです。まず入力、生成、コピーの3つだけ動けば十分です。作り込む前に、買い手が反応するかを確認できる形にしてください。",
    "",
    "## 対象ユーザー",
    user,
    "",
    "## 有料の痛み",
    pain,
    "",
    "## 作るツールの説明",
    tool,
    "最初の実装では保存、ログイン、外部API連携は不要です。入力フォーム、生成ボタン、結果カード、コピー用textareaだけ作ってください。",
    "",
    "## 入力項目",
    ...inputs.map((item) => `- ${item}`),
    "",
    "## 出力項目",
    ...outputs.map((item) => `- ${item}`),
    "",
    "## 画面構成",
    "- 上部: ツール名、対象ユーザー、何を短くするツールかを1行で表示",
    "- 左側または上部: 入力フォーム",
    "- 入力フォーム下: 「生成する」ボタン",
    "- 右側または下部: 生成結果カード",
    "- 結果カード: 3から5個の見出し付きブロック",
    "- 各結果カードにCopyボタン",
    "- 下部: 全文コピー用の読み取り専用textarea",
    "- スマホでは入力、生成、結果の順で縦に並べる",
    "",
    "## UX要件",
    "- Mobile-first",
    "- 入力項目は少なくする",
    "- 生成結果はカード形式",
    "- Copy buttons required",
    "- Result cards required",
    "- ボタン文言、見出し、プレースホルダーは日本語",
    "- 余計な説明文は入れすぎない",
    "",
    "## サンプルデータ",
    sample,
    "",
    "## コピーのトーン",
    tone,
    "",
    "## 制約",
    "- No auth",
    "- No database",
    "- No external API",
    "- Local state only",
    "- Mock generation is OK",
    "- Japanese UI copy",
    "- Do not add backend routes",
    "- Do not install new packages",
    "- TypeScriptで書く",
    "",
    "## マネタイズヒント",
    monetization,
    "",
    "## 検証ステップ",
    "1. まずツールを作らず、出力サンプルを1枚作る",
    "2. 対象ユーザーを20件探す",
    "3. 投稿またはDMでサンプルを見せる",
    "4. 770円で欲しいか聞く",
    "5. 反応があった部分だけCodex、Claude、Cursorで作る",
    "",
    "## 完成条件",
    "- 入力から実務で使える日本語出力が出る",
    "- サンプルデータを入れるとモック結果が表示される",
    "- スマホで使える",
    "- コピーしやすい",
    "- 770円商品のサンプルとして見せられる",
    "- 収益保証のような表現を使わない",
  ].join("\n");
}

const topCards: PromptCard[] = [
  {
    title: "Local Business Review Reply Tool",
    sourceCase:
      "海外では、Googleレビュー返信、評判管理、ローカルSEO改善が店舗向けの有料サービスとして売られている。",
    moneyReason:
      "店舗側は悪い口コミを放置したくない。でも返信文を考えるのが重い。感情的にも、事務的にも見えない文章にしたいところに金が動いたっぽい。",
    japanAngle:
      "日本向けに小さく売るなら、飲食店、美容室、整体院、クリニック向けの口コミ返信テンプレ生成ツール。最初から管理SaaSにしない。",
    firstProduct: "770円 Googleレビュー返信テンプレ10本 + 入力シート",
    xPost:
      "Codexで大きいアプリを作る前に、こういう小さい痛みを売る方が早い。Googleレビュー返信。悪い口コミにどう返すか、店舗オーナーは普通に悩む。まずは770円の返信テンプレで反応を見る。",
    dm:
      "Googleレビュー返信、地味に面倒じゃないですか。悪い口コミ向けの返信テンプレを10本だけ作りました。サンプル見ます？",
    validation48h: [
      "Googleレビューが未返信の店舗を20件探す",
      "悪い口コミ1件に対して返信サンプルを作る",
      "Instagram、問い合わせフォーム、メールでサンプルを送る",
      "770円でテンプレ10本が欲しいか聞く",
    ],
    screenImage:
      "上に店舗ジャンル、口コミ本文、返信トーンを入れるフォーム。下に公開返信文、個別フォロー文、再発防止メモがカードで出る。",
    inputs: ["店舗ジャンル", "口コミ本文", "返信トーン", "お店側の事情", "避けたい表現"],
    outputItems: ["公開返信文", "個別フォロー文", "再発防止メモ", "オーナー確認質問"],
    salesPath:
      "最初はXでサンプルを出し、未返信レビューがある店舗へDM。売れたら業種別テンプレに増やす。",
    priceUpPath: "770円から始めて、業種別30本パックを2,980円、月次返信補助を9,800円にする。",
    codexPrompt: buildToolPrompt({
      title: "Local Business Review Reply Tool",
      user: "Googleレビュー返信で詰まっている日本の地域店舗オーナー",
      pain: "悪い口コミを放置したくないが、変にこじれない返信文を書くのが難しい。",
      tool: "Googleレビューを貼ると、自然な公開返信、個別フォロー文、再発防止メモを出す小さな日本語ツール。",
      inputs: ["店舗ジャンル", "口コミ本文", "返信トーン", "お店側の事情", "避けたい表現"],
      outputs: ["公開返信文", "個別フォロー文", "再発防止メモ", "確認質問"],
      sample:
        "店舗ジャンル: 整体院 / 口コミ: 予約したのに待たされた。説明も少なかった。 / トーン: 丁寧、言い訳しない",
      tone: "落ち着いた日本語。謝りすぎず、言い訳せず、店舗の信頼を守る。",
      monetization:
        "最初は770円の返信テンプレ10本。反応があれば業種別パック、月次レビュー返信代行、Googleプロフィール改善へ広げる。",
    }),
  },
  {
    title: "Invoice Follow-up Assistant",
    sourceCase:
      "海外では、請求書の支払い遅れを減らすリマインド文、回収メール、フリーランス向け経理テンプレが売れている。",
    moneyReason:
      "未払いフォローは気まずい。強く言いすぎても関係が悪くなるし、弱すぎると払われない。ここは普通にお金の痛みがある。",
    japanAngle:
      "日本なら、フリーランス、制作会社、小規模事業者向けに、角が立たない請求フォロー文を作るツールとして小さくできる。",
    firstProduct: "770円 請求フォロー文テンプレ + 入金確認チェック",
    xPost:
      "未払いの請求書フォロー、これ普通にきつい。強く言いすぎたくない。でも放置もできない。まずは角が立たない文面テンプレを770円で売って反応を見る方が早い。",
    dm:
      "請求書の支払いフォローで使える、角が立たない文面テンプレを作っています。制作業やフリーランス向けです。サンプル見ます？",
    validation48h: [
      "フリーランス、制作会社、士業の投稿から未払い悩みを探す",
      "初回、再送、最終確認の3パターンを作る",
      "Xにサンプルを投稿する",
      "DMで770円テンプレが必要か聞く",
    ],
    screenImage:
      "請求日、金額、相手との関係、遅延日数を入れると、初回確認、再送、少し強めの文面が出る。",
    inputs: ["請求日", "金額", "支払期限", "遅延日数", "相手との関係", "文面の強さ"],
    outputItems: ["初回リマインド", "再送文", "少し強めの確認文", "件名案", "送信前チェック"],
    salesPath:
      "フリーランス向けにX投稿。反応があれば制作会社や士業向けに業種別テンプレを増やす。",
    priceUpPath: "770円のテンプレから、2,980円の未払い対応パック、9,800円の請求管理文面集へ。",
    codexPrompt: buildToolPrompt({
      title: "Invoice Follow-up Assistant",
      user: "請求書の未払いフォローで気まずさを感じるフリーランス、制作会社、小規模事業者",
      pain: "支払いを促したいが、関係を壊さずに送る文面が浮かばない。",
      tool: "請求情報と相手との関係を入れると、自然な日本語の入金確認文を複数出すツール。",
      inputs: ["請求日", "支払期限", "金額", "遅延日数", "相手との関係", "文面の強さ"],
      outputs: ["件名", "初回確認文", "再送文", "少し強めの文面", "送信前チェック"],
      sample:
        "請求日: 6月30日 / 支払期限: 7月5日 / 遅延日数: 3日 / 相手: 継続クライアント / 強さ: 丁寧",
      tone: "日本のビジネスメールとして自然。責めない。でも支払期限はぼかさない。",
      monetization:
        "770円で文面テンプレ。反応があれば業種別、税理士監修風チェック、請求管理SaaSの前段商品にする。",
    }),
  },
  {
    title: "Client Proposal Generator",
    sourceCase:
      "海外では、提案書テンプレ、営業資料、スコープ整理、見積もり文面がフリーランスや代理店向けに売れている。",
    moneyReason:
      "提案書は売上に直結するのに、毎回ゼロから作るのが重い。安く見られたくない、でも長く作り込みたくない痛みがある。",
    japanAngle:
      "日本なら、制作代行、AI導入支援、Web制作、SNS運用向けに、短い提案書の下書きツールとして売れる。",
    firstProduct: "770円 1ページ提案書テンプレ + ヒアリング項目",
    xPost:
      "提案書づくりで止まる人は多い。きれいな資料より先に、相手の課題、納品物、価格、次の一手を1ページにする方が早い。770円の商品にするならここ。",
    dm:
      "提案書を毎回ゼロから作る人向けに、1ページ提案書テンプレを作っています。サンプル見ます？",
    validation48h: [
      "制作代行、AI導入支援、SNS運用者を20人探す",
      "1ページ提案書サンプルを1つ作る",
      "Xで提案書の悩み投稿に反応する",
      "770円でテンプレが欲しいか聞く",
    ],
    screenImage:
      "案件概要、相手の悩み、提案内容、納品物、価格を入れると、1ページ提案書とDM追撃文が出る。",
    inputs: ["相手の業種", "相手の悩み", "提案したいサービス", "納品物", "価格", "納期"],
    outputItems: ["1ページ提案書", "見積もり前の確認質問", "DM追撃文", "価格の言い方"],
    salesPath:
      "AI副業者、Web制作者、SNS運用者に売る。サンプル提案書を見せると価値が伝わりやすい。",
    priceUpPath: "770円から、2,980円の業種別提案書パック、19,800円の提案書添削へ。",
    codexPrompt: buildToolPrompt({
      title: "Client Proposal Generator",
      user: "提案書づくりで止まるフリーランス、AI導入支援者、Web制作者、SNS運用者",
      pain: "案件相談は来るが、何をいくらでどう提案するかを毎回まとめるのが重い。",
      tool: "案件情報を入れると、1ページ提案書、確認質問、追撃DM、価格の言い方を出すツール。",
      inputs: ["相手の業種", "課題", "提案サービス", "納品物", "価格", "納期"],
      outputs: ["提案書", "確認質問", "追撃DM", "価格説明", "次のアクション"],
      sample:
        "相手: 整体院 / 課題: Instagramから予約につながらない / 提案: 投稿改善とLINE導線整理 / 価格: 30,000円",
      tone: "営業臭すぎない。短く、実務的で、相手が判断しやすい日本語。",
      monetization:
        "770円の1ページ提案テンプレ。反応があれば業種別テンプレ、提案書添削、営業導線設計に上げる。",
    }),
  },
  {
    title: "AI Meeting Follow-up Tool",
    sourceCase:
      "海外では、会議メモ、アクション整理、フォローアップメール、営業後の要約ツールにお金が動いている。",
    moneyReason:
      "会議後のフォローを放置すると案件が進まない。議事録だけでは足りず、次に何を送るかまで必要になる。",
    japanAngle:
      "日本なら、営業、制作打ち合わせ、コンサル面談のあとに送るフォロー文と次アクション整理ツールとして小さく売れる。",
    firstProduct: "770円 会議後フォロー文テンプレ + 次アクション整理シート",
    xPost:
      "会議メモを取るだけでは売上に近づかない。大事なのは、その後に送る確認文、次アクション、相手の宿題。まずは会議後フォロー文を770円で売る方が現実的。",
    dm:
      "打ち合わせ後のフォロー文、毎回ちょっと面倒じゃないですか。会議メモから送信文にするテンプレを作っています。見ます？",
    validation48h: [
      "営業、制作、コンサルをしている人を20人探す",
      "会議メモ例からフォロー文を作る",
      "Xでサンプルを投稿する",
      "770円でテンプレと入力シートが欲しいか聞く",
    ],
    screenImage:
      "会議メモ、相手の発言、決まったこと、次の期日を入れると、送信文、確認事項、TODOが出る。",
    inputs: ["会議メモ", "相手の発言", "決まったこと", "未決事項", "次の期日"],
    outputItems: ["フォローアップ文", "TODO", "確認事項", "相手に送る宿題", "次回までの流れ"],
    salesPath:
      "営業代行、制作会社、コンサル向けに売る。議事録ツールではなく、送る文面に寄せる。",
    priceUpPath: "770円から、2,980円の営業フォロー文パック、月額の案件進行テンプレへ。",
    codexPrompt: buildToolPrompt({
      title: "AI Meeting Follow-up Tool",
      user: "打ち合わせ後のフォロー文作成で止まる営業、制作会社、コンサル、個人事業主",
      pain: "会議後に何を送るか迷い、案件が進むまでの動きが遅くなる。",
      tool: "会議メモから、相手に送るフォロー文、TODO、確認事項を出す日本語ツール。",
      inputs: ["会議メモ", "決定事項", "未決事項", "相手の宿題", "自分の宿題", "次回日程"],
      outputs: ["送信文", "TODO", "確認事項", "次回までの流れ", "短い要約"],
      sample:
        "会議内容: LP改善相談 / 決定事項: ファーストビューを直す / 未決事項: 価格と納期 / 次回: 来週火曜",
      tone: "丁寧だが長すぎない。相手がすぐ動ける実務文。",
      monetization:
        "770円のフォロー文テンプレ。反応があれば営業職、制作会社、コンサル別に展開する。",
    }),
  },
  {
    title: "Shopify Product Page Optimizer",
    sourceCase:
      "海外では、Shopifyの商品ページ改善、FAQ追加、返品理由分析、購入前不安の解消にお金が動いている。",
    moneyReason:
      "商品ページが弱いと、購入前の質問、カゴ落ち、返品が増える。EC側は広告費を増やす前にページを直したい。",
    japanAngle:
      "日本なら、Shopify運営者やD2C担当者向けに、商品説明、FAQ、購入前不安を直すチェックツールとして売れる。",
    firstProduct: "770円 商品ページ不安つぶしチェック + FAQ文",
    xPost:
      "Shopifyで売れない時、広告の前に商品ページを見た方がいいことがある。サイズ、配送、返品、使い方、誰向けか。ここが曖昧なら770円の改善チェックでも売れる。",
    dm:
      "商品ページの購入前不安をつぶすチェックシートを作っています。Shopify向けです。サンプル見ます？",
    validation48h: [
      "Shopify店舗を20件見る",
      "FAQが弱い商品ページを3つ選ぶ",
      "改善サンプルを1枚作る",
      "店舗運営者に770円チェックを提案する",
    ],
    screenImage:
      "商品URLや説明文を貼ると、不足しているFAQ、ベネフィット文、購入前不安、改善案が出る。",
    inputs: ["商品名", "商品説明", "価格", "想定購入者", "よくある質問", "返品理由"],
    outputItems: ["改善した商品説明", "FAQ", "購入前不安リスト", "追記すべき情報", "X投稿文"],
    salesPath:
      "EC運営者向けに、商品ページの1画面改善サンプルを見せる。売れたら商品数ごとの改善パックへ。",
    priceUpPath: "770円から、2,980円の1商品改善、9,800円の5商品改善パックへ。",
    codexPrompt: buildToolPrompt({
      title: "Shopify Product Page Optimizer",
      user: "商品ページ改善で詰まっているShopify運営者、D2C担当者、EC副業者",
      pain: "商品説明やFAQが弱く、購入前の不安が残る。広告費を増やす前にページを直したい。",
      tool: "商品説明を貼ると、不足しているFAQ、購入前不安、改善文、追記すべき情報を出す日本語ツール。",
      inputs: ["商品名", "商品説明", "価格", "想定購入者", "配送情報", "返品理由"],
      outputs: ["改善した商品説明", "FAQ", "購入前不安リスト", "追記案", "販売投稿文"],
      sample:
        "商品: 睡眠用アイマスク / 価格: 2,980円 / 説明: 遮光性が高い / 購入者: 寝つきが悪い会社員",
      tone: "EC運営者がそのまま貼れる日本語。煽りすぎず、購入前の不安を短く消す。",
      monetization:
        "770円の改善チェック。反応があれば商品数別パック、月次ページ改善、広告前チェックに広げる。",
    }),
  },
];

const singleProductKit: SingleProductKit = {
  ...topCards[0],
  productName: "Google口コミ返信AIツール実践キット",
  productPrice: "770円",
  toolTheme: "Local Business Review Reply Tool",
  buyer:
    "AIツールは作れるが、売る相手と最初の商品化で止まっている副業者、Web制作者、SNS運用代行、個人開発者",
  sourceCase:
    "海外では、Googleレビュー返信、評判管理、ローカルSEO改善が店舗向けの有料サービスとして売られている。",
  moneyReason:
    "店舗は悪い口コミを放置したくない。でも、強く反論すると余計にこじれるし、謝りすぎると店側の事情が伝わらない。返信文を考える時間、評判を守る不安、Googleビジネスプロフィールを整えたい需要にお金が動いた。",
  japanAngle:
    "日本向けに小さく売るなら、美容室、整体、歯科、飲食店、クリニック、小規模店舗向けの口コミ返信テンプレと入力シートから始める。最初からSaaSにせず、1件の口コミに対する返信サンプルを見せて反応を見る。",
  firstProduct: "770円 Google口コミ返信テンプレ10本 + 返信入力シート",
  xPost:
    "ローカル店舗向けにAIツールを売るなら、最初は大きい管理画面よりGoogle口コミ返信の方が試しやすい。悪い口コミにどう返すかは、店側も普通に悩む。まずは770円の返信テンプレと入力シートで反応を見る。",
  dm:
    "Google口コミの返信文、考えるのが地味に重くないですか。悪い口コミ向けの返信テンプレを10本だけ作っています。サンプル1つ送っても大丈夫ですか？",
  validation48h: [
    "Googleマップで未返信または返信が弱い店舗を20件探す",
    "美容室、整体、歯科、飲食店、クリニックのどれか1業種に絞る",
    "悪い口コミ1件を選び、公開返信文と個別フォロー文のサンプルを作る",
    "Xにサンプル投稿を出す",
    "店舗の問い合わせフォーム、Instagram、メールから10件だけ送る",
    "770円でテンプレ10本と入力シートが欲しいか聞く",
  ],
  screenImage:
    "上部に商品名と対象店舗。入力欄は、店舗ジャンル、口コミ本文、返信トーン、お店側の事情、避けたい表現。生成ボタンを押すと、公開返信文、個別フォロー文、再発防止メモ、オーナー確認質問がカードで出る。各カードにCopyボタン。下部に全文コピー用textarea。",
  inputs: [
    "店舗ジャンル",
    "口コミ本文",
    "返信トーン",
    "お店側の事情",
    "避けたい表現",
  ],
  outputItems: [
    "公開返信文",
    "個別フォロー文",
    "再発防止メモ",
    "オーナー確認質問",
    "送信前チェック",
  ],
  salesPath:
    "まずXで返信サンプルを1つ出す。次に、未返信レビューがある店舗へ短いDMか問い合わせフォームで送る。売れたら業種別テンプレを増やす。返信代行ではなく、最初はテンプレと入力シートで売る。",
  priceUpPath:
    "770円の単品キットから、2,980円の業種別30本テンプレ、9,800円の月次レビュー返信補助、19,800円のGoogleビジネスプロフィール改善パックへ上げる。",
  kitContents: [
    "商品名と価格",
    "売る相手",
    "有料の痛み",
    "海外で金が動いた理由",
    "日本向けの小さい売り方",
    "店舗向けに最初に売る小さな商品案",
    "X投稿",
    "DM文",
    "48時間検証",
    "ノーコードAIツールプロンプト",
    "完成ツールの画面イメージ",
    "入力項目と出力項目",
    "売り方",
    "値上げ先",
    "Brain/note用販売文",
    "購入者向け使い方",
    "注意書き",
  ],
  usage: [
    "まずX投稿とDM文だけ使って、店舗側の反応を見る",
    "反応があったら、店舗向けの返信テンプレ10本と入力シートとして出す",
    "購入者には入力シートと返信サンプルを渡す",
    "さらに反応があれば、ノーコードAIツールプロンプトをCodex、Claude、Lovable、Bolt、v0に貼って小さい画面を作る",
    "売れた業種だけテンプレを増やす",
  ],
  caution:
    "これは収益保証ではありません。店舗への送信時は、口コミ内容をそのまま晒さず、相手の営業を邪魔しない短い文面にしてください。医療、法律、炎上案件の断定表現は避けます。完成品を作る前に、まず反応を見るためのキットです。",
  brainNoteCopy: [
    "Google口コミ返信AIツール実践キット",
    "",
    "これは、Google口コミ返信を題材にした実践キットです。",
    "店舗向けに小さいAIツールを作って売る流れを、1つの題材に絞ってまとめています。",
    "",
    "対象は、AIツールは作れるけど、商品化と売り先で止まっている人です。",
    "副業者、Web制作者、SNS運用代行、個人開発者で、ローカル店舗向けに何か売りたい人を想定しています。",
    "",
    "扱うテーマはGoogle口コミ返信です。",
    "対象店舗は、美容室、整体、歯科、飲食店、クリニック、小規模店舗に寄せています。",
    "",
    "入っているものは、売る相手、痛み、店舗向けの商品案、X投稿、DM文、48時間検証、ノーコードAIツールプロンプトです。",
    "",
    "最初から完成品を作る前提ではありません。",
    "まず投稿して、DMして、店舗側が反応するかを見るための商品です。",
    "反応があったら、その部分だけAIツールとして作る想定です。",
    "",
    "これは収益保証ではありません。",
    "口コミ返信に困っている店舗がいるか、770円の商品として出す前に試すための材料です。",
    "",
    "初版なので770円で出します。",
    "30本パックは別商品として後から出す予定です。",
  ].join("\n"),
  codexPrompt: buildToolPrompt({
    title: "Google口コミ返信AIツール",
    user: "Google口コミへの返信で詰まっている美容室、整体、歯科、飲食店、クリニック、小規模店舗のオーナー",
    pain: "悪い口コミを放置したくないが、感情的にも事務的にも見えない返信文を書くのが難しい。",
    tool: "Google口コミを貼ると、公開返信文、個別フォロー文、再発防止メモ、オーナー確認質問を出す小さな日本語Webツール。",
    inputs: ["店舗ジャンル", "口コミ本文", "返信トーン", "お店側の事情", "避けたい表現"],
    outputs: ["公開返信文", "個別フォロー文", "再発防止メモ", "オーナー確認質問", "送信前チェック"],
    sample:
      "店舗ジャンル: 美容室 / 口コミ: 予約したのに20分待った。説明も少なくて不安だった。 / トーン: 丁寧、言い訳しない / お店側の事情: 当日スタッフが1名欠勤 / 避けたい表現: こちらに非はありません",
    tone:
      "日本の店舗オーナーがそのまま読める落ち着いた文体。謝りすぎない。言い訳しない。相手を責めない。店の信頼を守る。",
    monetization:
      "最初は770円の口コミ返信テンプレ10本と入力シート。反応があれば業種別テンプレ、月次レビュー返信補助、Googleビジネスプロフィール改善へ広げる。",
  }),
};

function buildMockCard(raw: string): PromptCard {
  const source = raw.trim()
    ? raw.trim()
    : "海外で、小さな業務改善テンプレや診断シートが売れている事例";

  return {
    ...topCards[0],
    sourceCase: source,
    moneyReason:
      "貼られた海外事例を見る限り、面倒な業務を短くするところに金が動いた可能性がある。日本では大きく作らず、まず入力シートと出力サンプルで試す。",
    japanAngle:
      "日本向けには、対象ユーザーを1つに絞り、770円のテンプレ、チェックシート、簡易ツール設計図として小さく売る。",
    firstProduct: "770円 業務改善AIツール設計図 + 投稿文 + DM文",
    xPost:
      "海外で売れた型をそのまま真似るのはきつい。でも日本向けに小さく切れば試せる。まずは770円の商品にして、反応があったらCodexでその部分だけ作る。",
    dm:
      "海外事例を日本向けの小さなAIツール案にする設計図を作っています。770円で試せる形です。サンプル見ます？",
    validation48h: [
      "対象ユーザーを1つ決める",
      "サンプル出力を1枚作る",
      "Xに投稿する",
      "20人へDMして770円で欲しいか聞く",
    ],
    codexPrompt: buildToolPrompt({
      title: "Overseas Pattern to Japanese AI Tool Prompt",
      user: "AIで作れるが、誰に何を売るかで止まっている日本の個人開発者",
      pain: "海外事例を見ても、日本で売る小さな商品に落とせない。",
      tool: "海外事例を貼ると、日本向けの770円商品、投稿文、DM文、検証手順、ツール設計を出すページ。",
      inputs: ["海外事例", "想定ユーザー", "売れそうな痛み", "価格", "販売チャネル"],
      outputs: ["日本向けリメイク", "770円商品", "投稿文", "DM文", "検証手順"],
      sample: source,
      tone: "実務的。煽らない。収益保証に見える表現は避ける。",
      monetization:
        "まず770円の設計図として販売。反応があればツール化、テンプレ集、個別添削に広げる。",
    }),
  };
}

function formatCard(card: PromptCard) {
  return [
    `# ${card.title}`,
    "",
    "## 元ネタ",
    card.sourceCase,
    "",
    "## 金が動いた理由",
    card.moneyReason,
    "",
    "## 日本向けに小さく売るなら",
    card.japanAngle,
    "",
    "## 最初に売る小さな商品案",
    card.firstProduct,
    "",
    "## X投稿",
    card.xPost,
    "",
    "## DM文",
    card.dm,
    "",
    "## 48時間検証",
    card.validation48h.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## 完成ツールの画面イメージ",
    card.screenImage,
    "",
    "## 入力項目",
    card.inputs.map((item) => `- ${item}`).join("\n"),
    "",
    "## 出力項目",
    card.outputItems.map((item) => `- ${item}`).join("\n"),
    "",
    "## 売り方",
    card.salesPath,
    "",
    "## 値上げ先",
    card.priceUpPath,
    "",
    "## ノーコードAIツールプロンプト",
    card.codexPrompt,
  ].join("\n");
}

function formatSingleProductKit(kit: SingleProductKit) {
  return [
    `# ${kit.productName}`,
    "",
    "## 価格",
    kit.productPrice,
    "",
    "## このキットで作るもの",
    kit.toolTheme,
    "",
    "## 売る相手",
    kit.buyer,
    "",
    "## 有料の痛み",
    kit.codexPrompt
      .split("## 有料の痛み\n")[1]
      ?.split("\n\n## 作るツールの説明")[0] || "",
    "",
    "## 海外で金が動いた理由",
    kit.moneyReason,
    "",
    "## 日本向けに小さく売るなら",
    kit.japanAngle,
    "",
    "## 店舗向けに最初に売る小さな商品案",
    kit.firstProduct,
    "",
    "## X投稿",
    kit.xPost,
    "",
    "## DM文",
    kit.dm,
    "",
    "## 48時間検証",
    kit.validation48h.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## 完成ツールの画面イメージ",
    kit.screenImage,
    "",
    "## 入力項目",
    kit.inputs.map((item) => `- ${item}`).join("\n"),
    "",
    "## 出力項目",
    kit.outputItems.map((item) => `- ${item}`).join("\n"),
    "",
    "## 売り方",
    kit.salesPath,
    "",
    "## 値上げ先",
    kit.priceUpPath,
    "",
    "## Brain/note用販売文",
    kit.brainNoteCopy,
    "",
    "## 購入者向け使い方",
    kit.usage.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "## 注意書き",
    kit.caution,
    "",
    "## ノーコードAIツールプロンプト",
    kit.codexPrompt,
  ].join("\n");
}

const brainCopy = [
  "AIで作れるのに1円にもならない人へ",
  "Codex Claudeに貼って作る AI商売ツールプロンプト30",
  "",
  "BilionのDBから、まず5本だけ商品として切り出しました。",
  "海外で金が動いた型を、日本人が今日試せる小さなAIツール設計図に落としています。",
  "",
  "Codex、Claude、Cursor、GPT、Lovable、Bolt、v0で画面は作れる。",
  "でも、誰に何を売るかが決まっていないと、作ったものがそのまま止まります。",
  "",
  "この30本パックは、単品キットの反応を見たあとに整える予定です。",
  "価格は1980円から2980円を想定しています。",
  "まずは単品キットから出します。",
  "",
  "入っているもの:",
  "・30個の海外ビジネス型",
  "・30個の日本向けAIリメイク",
  "・30個の最初に売る小さな商品案",
  "・30個のX投稿",
  "・30個のDM文",
  "・30個の48時間検証",
  "・30個の長文ノーコードAIツールプロンプト",
  "",
  "上位5本は、元ネタ、金が動いた理由、最初の商品案、X投稿、DM文、48時間検証、ノーコードAIツールプロンプトまで長めに入れています。",
  "",
  "これは収益保証ではありません。",
  "作る前に反応を見るためのプロンプト集です。",
  "反応があったものだけ、Codex、Claude、Lovable、Bolt、v0で小さく作る想定です。",
].join("\n");

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);

    return true;
  } catch {
    return false;
  }
}

export default function JapaneseInfoProductPage() {
  const [rawExample, setRawExample] = useState("");
  const [generatedCard, setGeneratedCard] = useState<PromptCard>(topCards[0]);
  const [copiedKey, setCopiedKey] = useState("");
  const allText = useMemo(
    () =>
      [
        brainCopy,
        "",
        "---",
        "",
        ...topCards.map((card, index) =>
          [`# ${index + 1}. ${card.title}`, formatCard(card)].join("\n\n"),
        ),
      ].join("\n\n"),
    [],
  );
  const generatedText = useMemo(() => formatCard(generatedCard), [generatedCard]);
  const singleProductText = useMemo(
    () => formatSingleProductKit(singleProductKit),
    [],
  );

  async function handleCopy(key: string, value: string) {
    const copied = await copyText(value);
    setCopiedKey(copied ? key : "error");
    window.setTimeout(() => setCopiedKey(""), 1200);
  }

  function handleGenerate() {
    setGeneratedCard(buildMockCard(rawExample));
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid min-h-[70vh] content-center gap-6 border-b border-white/10 py-10">
          <div className="w-fit rounded-md border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
            Internal Brain / note product factory
          </div>
          <div className="grid gap-5">
            <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
              AIで作れるのに1円にもならない人へ
              <span className="block text-emerald-200">
                Codex Claudeに貼って作る AI商売ツールプロンプト30
              </span>
            </h1>
            <p className="max-w-3xl text-base font-bold leading-8 text-zinc-300 sm:text-xl">
              BilionのDBから、まず5本だけ商品として切り出しました。
              作る前に反応を見て、反応があったものだけ小さく作るためのプロンプト集です。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#cards"
              className="min-h-12 rounded-md bg-emerald-300 px-5 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-emerald-200"
            >
              上位5件を見る
            </a>
            <a
              href="#brain-copy"
              className="min-h-12 rounded-md border border-white/10 px-5 py-3 text-center text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
            >
              Brain用本文を見る
            </a>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-black text-white">対象</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              "AIで作れるのに1円にもならない人",
              "Codex、Claude、Cursor、GPT、Lovable、Bolt、v0を使えるが、何を誰に売るかで止まっている人",
              "AI副業や個人開発をしたいが、作っても売れない人",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-bold leading-7 text-zinc-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                最初に売る単品キット
              </h2>
              <p className="mt-2 text-sm font-bold leading-7 text-zinc-400">
                30本パックの前に、まず770円で出す単品商品です。作る前に店舗側の反応を見るための材料だけに絞っています。
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleCopy("single-kit-all", singleProductText)}
              className="min-h-11 rounded-md border border-white/10 px-4 text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
            >
              {copiedKey === "single-kit-all" ? "Copied" : "単品キット全体コピー"}
            </button>
          </div>
          <SingleProductKitView
            copiedKey={copiedKey}
            kit={singleProductKit}
            onCopy={handleCopy}
            singleProductText={singleProductText}
          />
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-black text-white">商品に入れる価値</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "30個の海外ビジネス型",
              "30個の日本向けAIリメイク",
              "30個の最初に売る小さな商品案",
              "30個のX投稿",
              "30個のDM文",
              "30個の48時間検証",
              "30個の長文ノーコードAIツールプロンプト",
              "Brain/noteに貼れる商品本文",
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-white/10 bg-black/25 p-3 text-sm font-black text-zinc-100"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.05] p-5">
          <h2 className="text-2xl font-black text-white">価格コピー</h2>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="text-5xl font-black text-emerald-200">初版だけ770円</div>
              <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-zinc-300">
                この30本パックは、単品キットの反応を見たあとに整える予定です。
                価格は1980円から2980円を想定しています。まずは単品キットから出します。
                収益保証ではありません。
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleCopy("brain-copy", brainCopy)}
              className="min-h-12 rounded-md bg-white px-5 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-zinc-200"
            >
              {copiedKey === "brain-copy" ? "Copied" : "Brain本文コピー"}
            </button>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-black text-white">30 item outline</h2>
          <p className="text-sm font-bold leading-7 text-zinc-400">
            ここはプロンプト集の目次です。まず上位5件だけ、商品本文として使える長文カードにしています。
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {outlineItems.map((item, index) => (
              <div
                key={item}
                className="grid grid-cols-[2.25rem_1fr] gap-3 rounded-md border border-white/10 bg-zinc-900 p-3 text-sm leading-6"
              >
                <span className="font-black text-emerald-200">
                  {index + 1}.
                </span>
                <span className="font-bold text-zinc-200">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="cards" className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">上位5件の商品カード</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-zinc-400">
                Brain/noteにそのまま貼れるように、売る相手、痛み、最初の商品案、検証手順まで入れています。
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleCopy("all-text", allText)}
              className="min-h-11 rounded-md border border-white/10 px-4 text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
            >
              {copiedKey === "all-text" ? "Copied" : "全文コピー"}
            </button>
          </div>
          <div className="grid gap-4">
            {topCards.map((card, index) => (
              <PromptCardView
                card={card}
                copiedKey={copiedKey}
                index={index}
                key={card.title}
                onCopy={handleCopy}
              />
            ))}
          </div>
        </section>

        <section id="generator" className="grid gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">
              海外事例から商品カードを生成
            </h2>
            <p className="mt-2 text-sm font-bold leading-7 text-zinc-400">
              外部APIなしのモック生成です。貼った事例を、商品カード形式に寄せます。
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                Raw overseas example
              </span>
              <textarea
                value={rawExample}
                onChange={(event) => setRawExample(event.target.value)}
                className="min-h-72 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm leading-7 text-zinc-100 outline-none transition focus:border-emerald-300/60"
                placeholder="例: A solo founder sells invoice follow-up templates to freelancers..."
              />
              <button
                type="button"
                onClick={handleGenerate}
                className="min-h-11 rounded-md bg-emerald-300 px-4 text-sm font-black text-zinc-950 transition hover:bg-emerald-200"
              >
                商品カードを生成
              </button>
            </label>
            <div className="grid gap-3">
              <PromptCardView
                card={generatedCard}
                copiedKey={copiedKey}
                index={99}
                onCopy={handleCopy}
              />
              <textarea
                readOnly
                value={generatedText}
                className="min-h-72 rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-zinc-200 outline-none"
              />
            </div>
          </div>
        </section>

        <section id="brain-copy" className="grid gap-4 pb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-black text-white">Brain / note 用本文</h2>
            <button
              type="button"
              onClick={() => void handleCopy("brain-copy-bottom", brainCopy)}
              className="min-h-11 rounded-md border border-white/10 px-4 text-sm font-black text-zinc-100 transition hover:bg-white/[0.06]"
            >
              {copiedKey === "brain-copy-bottom" ? "Copied" : "コピー"}
            </button>
          </div>
          <textarea
            readOnly
            value={brainCopy}
            className="min-h-80 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm leading-7 text-zinc-100 outline-none"
          />
        </section>

        {copiedKey === "error" && (
          <div className="rounded-md border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100">
            Clipboard blocked. textareaから手動でコピーしてください。
          </div>
        )}
      </div>
    </main>
  );
}

function PromptCardView({
  card,
  copiedKey,
  index,
  onCopy,
}: {
  card: PromptCard;
  copiedKey: string;
  index: number;
  onCopy: (key: string, value: string) => Promise<void>;
}) {
  const copyKey = `card-${index}`;
  const rows = [
    ["元ネタ", card.sourceCase],
    ["金が動いた理由", card.moneyReason],
    ["日本向けに小さく売るなら", card.japanAngle],
    ["最初に売る小さな商品案", card.firstProduct],
    ["X投稿", card.xPost],
    ["DM文", card.dm],
    ["48時間検証", card.validation48h.join("\n")],
    ["完成ツールの画面イメージ", card.screenImage],
    ["入力項目", card.inputs.join("\n")],
    ["出力項目", card.outputItems.join("\n")],
    ["売り方", card.salesPath],
    ["値上げ先", card.priceUpPath],
    ["ノーコードAIツールプロンプト", card.codexPrompt],
  ];

  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-200">
            Prompt card
          </div>
          <h3 className="mt-2 text-xl font-black text-white">{card.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onCopy(copyKey, formatCard(card))}
          className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
        >
          {copiedKey === copyKey ? "Copied" : "Copy card"}
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md bg-black/25 p-3">
            <div className="text-xs font-black text-zinc-500">{label}</div>
            <div className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-zinc-200">
              {value}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function SingleProductKitView({
  copiedKey,
  kit,
  onCopy,
  singleProductText,
}: {
  copiedKey: string;
  kit: SingleProductKit;
  onCopy: (key: string, value: string) => Promise<void>;
  singleProductText: string;
}) {
  const rows = [
    ["商品名", kit.productName],
    ["価格", kit.productPrice],
    ["このキットで作るもの", kit.toolTheme],
    ["売る相手", kit.buyer],
    ["海外で金が動いた理由", kit.moneyReason],
    ["日本向けに小さく売るなら", kit.japanAngle],
    ["店舗向けに最初に売る小さな商品案", kit.firstProduct],
    ["X投稿", kit.xPost],
    ["DM文", kit.dm],
    ["48時間検証", kit.validation48h.join("\n")],
    ["完成ツールの画面イメージ", kit.screenImage],
    ["入力項目", kit.inputs.join("\n")],
    ["出力項目", kit.outputItems.join("\n")],
    ["売り方", kit.salesPath],
    ["値上げ先", kit.priceUpPath],
    ["Brain/note用販売文", kit.brainNoteCopy],
    ["購入者向け使い方", kit.usage.join("\n")],
    ["注意書き", kit.caution],
    ["ノーコードAIツールプロンプト", kit.codexPrompt],
  ];

  return (
    <article className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.035] p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-200">
            770 yen single kit
          </div>
          <h3 className="mt-2 text-2xl font-black text-white">
            {kit.productName}
          </h3>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-zinc-300">
            Google口コミ返信を題材に、店舗向けの小さいAIツールを売る前に検証するための単品キットです。
          </p>
        </div>
        <div className="grid shrink-0 gap-2 sm:grid-cols-2 lg:w-[28rem]">
          <button
            type="button"
            onClick={() => void onCopy("single-kit-all-card", singleProductText)}
            className="min-h-10 rounded-md bg-white px-3 text-xs font-black text-zinc-950 transition hover:bg-zinc-200"
          >
            {copiedKey === "single-kit-all-card" ? "Copied" : "全体コピー"}
          </button>
          <button
            type="button"
            onClick={() => void onCopy("single-kit-brain", kit.brainNoteCopy)}
            className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
          >
            {copiedKey === "single-kit-brain" ? "Copied" : "販売文コピー"}
          </button>
          <button
            type="button"
            onClick={() => void onCopy("single-kit-prompt", kit.codexPrompt)}
            className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
          >
            {copiedKey === "single-kit-prompt" ? "Copied" : "プロンプトコピー"}
          </button>
          <button
            type="button"
            onClick={() => void onCopy("single-kit-x", kit.xPost)}
            className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06]"
          >
            {copiedKey === "single-kit-x" ? "Copied" : "X投稿コピー"}
          </button>
          <button
            type="button"
            onClick={() => void onCopy("single-kit-dm", kit.dm)}
            className="min-h-10 rounded-md border border-white/10 px-3 text-xs font-black text-zinc-100 transition hover:bg-white/[0.06] sm:col-span-2"
          >
            {copiedKey === "single-kit-dm" ? "Copied" : "DM文コピー"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-white/10 bg-black/25 p-3">
          <div className="text-xs font-black text-zinc-500">このキットに入れる内容</div>
          <div className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-zinc-200">
            {kit.kitContents.join("\n")}
          </div>
        </div>
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-black/25 p-3">
            <div className="text-xs font-black text-zinc-500">{label}</div>
            <div className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-zinc-200">
              {value}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
