"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

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

type JapaneseBilionAppClientProps = {
  hasFounderAccess: boolean;
};

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
      ["シグナル", signal],
      ["何が金になるか", title],
      ["誰が買うか", buyer],
      ["どんな痛みを解決するか", pain],
      ["何を売るか", product],
      ["いくらで売るか", price],
      ["なぜ今買うか", whyNow],
    ],
    validationSteps,
    masterPrompt,
  };
}

function createMasterPrompt({
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
  return `Build a standalone new web app from scratch.

Product name:
${productName}

Buyer:
${buyer}

Pain:
${pain}

Product angle:
${productAngle}

First version:
${firstVersion}

Price:
${price}

48h validation plan:
${validationSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

Core workflow:
1. User opens the product.
2. User enters or selects a realistic sample input.
3. App classifies the input and generates the commercial output.
4. App shows next actions, status, and copy-ready sections.
5. User copies the output or uses it as a sales demo.

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
- Clear source or input selector.
- Clear output cards.
- Copy button for generated sections.
- No generic AI gradients.
- No decorative noise.`;
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

const sourceOutputPools: Record<SourceType, SourceOutput[]> = {
  indie: [{
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
        "GitHubでAIエージェント、ローカル自動化、開発者ワークフロー系のリポジトリが伸びている。AIビルダーは毎日トレンドを見るが、それを「誰に売るか」「何を作るか」「いくらで売るか」に変換できていない。",
      ],
      ["何が金になるか", "GitHub Repo Signal Brief Generator"],
      [
        "誰が買うか",
        "Codex、Cursor、Claude Code、Lovableを使うAIビルダー・個人開発者",
      ],
      [
        "どんな痛みを解決するか",
        "GitHubトレンドやAIリポジトリを見ても、そこから売れる小型商品、買う相手、価格、検証手順に変換できない。",
      ],
      [
        "何を売るか",
        "GitHubリポジトリURLやトレンド名を入力すると、商品案、買う相手、痛み、価格、48時間検証、実装プロンプトに変換する小型AIツール。",
      ],
      ["いくらで売るか", "$19 one-time または $9/month"],
      [
        "なぜ今買うか",
        "Codex、Cursor、Claude Codeで作れる人が増えたが、作る前の「何を作れば売れるか」がボトルネックになっているから。",
      ],
    ],
    validationSteps: [
      "GitHubトレンド1件を商品案に変換する60秒デモを作る。",
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
- User clicks 商品を作成する.
- Output appears only after click.
- Output changes based on selected source.
- Copy button copies the selected source's Master Prompt.`,
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
    price: "$29 one-time または $12/month",
    whyNow:
      "AIエージェントを試す人は増えたが、実務で使える設計テンプレートが不足しているから。",
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
      "GitHubのIssue、PR、メンテナーコメントには、ユーザーの不満、未解決ニーズ、導入障壁が集まっている。だが読むだけでは商品判断に変換しづらい。",
    buyer: "OSSを追うAIビルダー、開発者向けSaaS創業者、DevRel、技術マーケター",
    pain:
      "IssueやPRを読んでも、どの不満が買う痛みなのか、どの機能が商品化できるのか、検証すべき相手が誰か整理できない。",
    product:
      "IssueやPRメモを貼ると、ユーザー痛み、頻出要望、商品機会、検証メッセージ、Code X用プロンプトに変換する分析ツール。",
    price: "$19 one-time",
    whyNow:
      "OSS周辺のユーザー発言は公開された市場調査データであり、AIビルダーが商品選定に使えるから。",
    validationSteps: [
      "人気OSSのIssue 5件を商品ブリーフに変換するデモを作る。",
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
      "業務メモを入力すると、自動化候補、コマンド手順、リスク、実装プロンプトを生成するローカル自動化設計ツール。",
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
      "業務カテゴリを選ぶと、MCPツール案、接続対象、ユーザー痛み、最初のデモ、実装プロンプトを生成するアイデア発見ツール。",
    price: "$19 one-time",
    whyNow:
      "MCPは開発者の注目が高く、早い段階で業務別テンプレートや商品案を欲しがる層がいるから。",
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

const cards = [
  {
    title: "買う相手",
    text: "誰が困っていて、なぜ今買うのか。",
  },
  {
    title: "商品案",
    text: "小型AIツール、Prompt Pack、Agency serviceなどに変換。",
  },
  {
    title: "実装プロンプト",
    text: "Code X、Codex、Cursor、Claude Code、Lovableに貼れる仕様。",
  },
];

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
        "rounded-xl px-4 py-3 text-center text-sm font-semibold transition",
        variant === "primary"
          ? "bg-white text-zinc-950 hover:bg-zinc-200"
          : "border border-white/10 text-zinc-100 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function JapaneseBilionAppClient({
  hasFounderAccess,
}: JapaneseBilionAppClientProps) {
  const [freeUsageCount, setFreeUsageCount] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [sourceType, setSourceType] = useState<SourceType>("indie");
  const [currentOutputIndex, setCurrentOutputIndex] = useState(0);

  useEffect(() => {
    const loadAccess = window.setTimeout(() => {
      const usageCount = readFreeUsageCount();

      setFreeUsageCount(usageCount);
      setShowOutput(false);
    }, 0);

    return () => window.clearTimeout(loadAccess);
  }, []);

  const selectedPool = sourceOutputPools[sourceType];
  const selectedOutput = selectedPool[currentOutputIndex] ?? selectedPool[0]!;
  const freeRunsRemaining = hasFounderAccess
    ? Infinity
    : Math.max(0, FREE_DAILY_LIMIT_JP - freeUsageCount);
  const canGenerate = hasFounderAccess || freeRunsRemaining > 0;

  function generateOutput() {
    if (!canGenerate) {
      return;
    }

    const nextIndex = showOutput
      ? getNextOutputIndex(selectedPool.length, currentOutputIndex)
      : currentOutputIndex;
    setCurrentOutputIndex(nextIndex);

    if (!hasFounderAccess) {
      const nextCount = freeUsageCount + 1;
      writeFreeUsageCount(nextCount);
      setFreeUsageCount(nextCount);
    }

    setShowOutput(true);
  }

  async function copyMasterPrompt() {
    await navigator.clipboard.writeText(selectedOutput.masterPrompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1200);
  }

  return (
    <main className="min-h-screen bg-[#0b0c0e] text-white">
      <section className="mx-auto max-w-6xl px-5 py-5 sm:px-6 md:py-7">
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
          <LanguageSwitch />
        </header>

        <section className="grid gap-8 py-14 md:py-18 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              今日のシグナル
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              1時間実装＆リリース
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              GitHubシグナルとIndie Hackers DBから、需要のある商品ネタを厳選。買う相手・痛み・価格・48時間検証・AIビルド用プロンプトまで生成します。
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-[#111214] p-4">
              <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">
                ソースを選択
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(Object.keys(sourceOutputPools) as SourceType[]).map((source) => {
                  const active = sourceType === source;

                  return (
                    <button
                      key={source}
                      type="button"
                      onClick={() => {
                        setSourceType(source);
                        setCurrentOutputIndex(0);
                        setShowOutput(false);
                        setCopiedPrompt(false);
                      }}
                      className={[
                        "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
                        active
                          ? "border-white/30 bg-white text-zinc-950"
                          : "border-white/10 bg-black/20 text-zinc-300 hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      {sourceOutputPools[source][0]!.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-500">
                参照元 IH42kDB + GitHubシグナル
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {canGenerate ? (
                <button
                  type="button"
                  onClick={generateOutput}
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  商品を作成する
                </button>
              ) : (
                <ButtonLink href="/jp/founder">実装プロンプトアクセスを見る</ButtonLink>
              )}
              <ButtonLink href="/jp" variant="secondary">
                トップに戻る
              </ButtonLink>
            </div>
            {!hasFounderAccess && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                無料でも有料版と同じ品質の出力を1日3回まで確認できます。Founder
                Accessでは、無制限生成・無制限コピー・追加角度の生成が使えます。
              </p>
            )}
            {hasFounderAccess && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                Unlimited access unlocked. 何度でも商品案とMaster Promptを生成できます。
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111214] p-5 shadow-xl shadow-black/20">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">
                {showOutput ? "商売判断" : "未生成"}
              </div>
              {showOutput ? (
                <>
                  <h2 className="mt-1 text-lg font-semibold text-white">{selectedOutput.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{selectedOutput.proof}</p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    ソースを選んで、商品を作成するを押してください。
                  </p>
                  <p className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-500">
                    参照元 IH42kDB + GitHubシグナル
                  </p>
                </>
              )}
            </div>

            {showOutput && (
              <div className="mt-4 grid gap-3">
                {selectedOutput.businessFields.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-3.5">
                    <div className="text-xs font-semibold tracking-wide text-zinc-500">
                      {label}
                    </div>
                    <div className="mt-1.5 text-sm leading-6 text-zinc-100">{value}</div>
                  </div>
                ))}
                <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
                  <div className="text-xs font-semibold tracking-wide text-zinc-500">
                    48時間検証
                  </div>
                  <ol className="mt-2 space-y-1 text-sm leading-6 text-zinc-100">
                    {selectedOutput.validationSteps.map((step, index) => (
                      <li key={step} className="flex gap-2">
                        <span className="text-zinc-500">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </section>

        {!hasFounderAccess && freeUsageCount >= FREE_DAILY_LIMIT_JP && (
          <section className="border-t border-white/10 py-10">
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-yellow-100">
                今日の無料生成3回を使用済みです。
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                無料でも有料版と同じ品質の出力を確認できます。追加の生成、無制限コピー、追加角度の生成は実装プロンプトアクセスで解放されます。
              </p>
              <div className="mt-5">
                <ButtonLink href="/jp/founder">実装プロンプトアクセスを見る</ButtonLink>
              </div>
            </div>
          </section>
        )}

        {showOutput && (
          <section className="border-t border-white/10 py-10">
            <div className="rounded-2xl border border-white/10 bg-[#111214] p-5 md:p-6">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    MASTER PROMPT
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Full Code X Master Prompt
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                    この英語プロンプトをCode X / Codex / Cursor / Claude Code / Lovableに貼ってください。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyMasterPrompt}
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  {copiedPrompt ? "コピー済み" : "Master Promptをコピー"}
                </button>
              </div>
              <pre className="mt-5 max-h-[620px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/35 p-4 font-sans text-sm leading-6 text-zinc-100">
                {selectedOutput.masterPrompt}
              </pre>
            </div>
          </section>
        )}

        <section className="border-t border-white/10 py-10">
          <div className="mb-5">
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              Bilionで確認できること
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-[#111214] p-5">
                <h2 className="text-base font-semibold text-white">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{card.text}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
