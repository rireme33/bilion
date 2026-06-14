"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type FreeIdea = {
  latest_signal: string;
  what_you_can_build: string;
  buyer: string;
  pain: string;
  why_now: string;
};

type BuildPromptPack = {
  latest_signal: string;
  source_title: string;
  source_url: string;
  source_type: string;
  source_note: string;
  buyer: string;
  pain: string;
  why_now: string;
  what_you_can_build: string;
  core_features: string[];
  comparable_price: string;
  build_steps: string[];
  pattern_matches: string[];
  code_x_prompt: string;
};

type ApiResult = {
  free: FreeIdea;
  paid: BuildPromptPack;
};

type BuildSignal = {
  id: string;
  latestSignal: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: string;
  sourceNote: string;
  buyer: string;
  pain: string;
  whyNow: string;
  whatYouCanBuild: string;
  coreFeatures: string[];
  comparablePrice: string;
  buildSteps: string[];
  patternMatches: string[];
  codeXPrompt: string;
};

type BilionAppClientProps = {
  hasFounderAccess: boolean;
};

type SavedSignal = {
  id: string;
  createdAt: string;
  sourceTitle: string;
  buyer: string;
  pain: string;
  whyNow: string;
  coreFeatures: string[];
  comparablePrice: string;
  buildSteps: string[];
  patternMatches: string[];
  fullCodeXPrompt: string;
  latestSignal: string;
  whatYouCanBuild: string;
  sourceUrl: string;
  sourceType: string;
  sourceNote: string;
};

type MasterPrompt = {
  angleLabel: string;
  promptTitle: string;
  buyer: string;
  pain: string;
  productAngle: string;
  firstVersion: string;
  price: string;
  validationPlan: string[];
  fullCodeXMasterPrompt: string;
};

/*
const lockedItems = [
  "Core Features 🔒",
  "Comparable Price 🔒",
  "Full Code X Prompt 🔒",
  "Pattern Matches 🔒",
];
*/

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEZY_CHECKOUT_URL || "";
const SAVED_SIGNALS_STORAGE_KEY = "bilion.savedSignals";
const FREE_DAILY_LIMIT = 3;
const FREE_USAGE_STORAGE_KEY_EN = "bilion_free_usage_en";
const MAX_SAVED_SIGNALS = 10;

const masterPromptAngles = [
  {
    label: "Micro SaaS",
    price: "$29/month",
    promptTitle: (signal: BuildSignal) =>
      `${workflowBrandName(signal)} SaaS for ${titleCase(compactBuyer(signal))}`,
    buyer: (signal: BuildSignal) =>
      `${signal.buyer || "Niche operators"} who repeat ${workflowName(signal)} every week and want a small subscription app that keeps the work organized.`,
    pain: (signal: BuildSignal) =>
      `${signal.pain || "The workflow is manual, repeated, and easy to lose track of."} The SaaS pain is that the buyer needs one reliable place to capture inputs, generate the output, save records, and reuse the result next week.`,
    productAngle: (signal: BuildSignal) =>
      `A small subscription app for ${compactBuyer(signal)} that turns ${workflowInput(signal)} into ${workflowOutcome(signal)}.`,
    firstVersion: (signal: BuildSignal) =>
      `A subscription-style app with one focused input flow, ${featureSummary(signal)}, saved records, a simple dashboard, and copy/export actions.`,
    validationPlan: (signal: BuildSignal) => [
      `Create a one-page landing page for ${compactBuyer(signal)} showing the messy input and the saved output.`,
      `Record a 90-second demo of ${workflowName(signal)} moving from input to generated result to saved record.`,
      "Send the demo to 20 niche operators and ask for 3 paid beta users at $29/month.",
    ],
    buildInstruction:
      "Tell Code X to build a small subscription-style app with input, saved records, dashboard, generated outputs, and copy/export.",
  },
  {
    label: "Local business tool",
    price: "$199 setup + $29/month",
    promptTitle: (signal: BuildSignal) =>
      workflowConsoleName(signal),
    buyer: (signal: BuildSignal) =>
      `${signal.buyer || "Local operators"} who need practical admin relief, faster response speed, and a tool staff can use during the workday.`,
    pain: (signal: BuildSignal) =>
      `${signal.pain || "Admin work is scattered across messages, notes, and memory."} The local tool pain is urgent, operational, and staff-facing: the buyer needs the next action to be clear without adopting a complex platform.`,
    productAngle: (signal: BuildSignal) =>
      `A practical operator dashboard for ${compactBuyer(signal)} that turns ${workflowInput(signal)} into ${workflowOutcome(signal)} for faster daily handoffs.`,
    firstVersion: (signal: BuildSignal) =>
      `One local-operator dashboard with sample jobs or requests, ${featureSummary(signal)}, status controls, staff notes, and copyable summaries.`,
    validationPlan: (signal: BuildSignal) => [
      `Contact 15 local operators similar to ${compactBuyer(signal)} with a before/after sample.`,
      `Show how one messy ${workflowName(signal)} input becomes a staff-ready output.`,
      "Offer a 48-hour setup at $199 setup + $29/month and ask what would make it usable by staff tomorrow.",
    ],
    buildInstruction:
      "Tell Code X to build a practical local operator dashboard focused on one urgent admin workflow.",
  },
  {
    label: "AI workflow tool",
    price: "$49/month",
    promptTitle: (signal: BuildSignal) =>
      `${workflowInputTitle(signal)} to ${workflowOutputTitle(signal)} AI Workflow`,
    buyer: (signal: BuildSignal) =>
      `${signal.buyer || "Operators and internal teams"} who already have messy inputs and need AI to turn them into structured decisions, summaries, and next actions.`,
    pain: (signal: BuildSignal) =>
      `${signal.pain || "Messy inputs take too long to structure by hand."} The workflow-tool pain is the gap between raw notes and a clean operational output people can act on.`,
    productAngle: (signal: BuildSignal) =>
      `An AI workflow layer for ${compactBuyer(signal)} that turns ${workflowInput(signal)} into ${workflowOutcome(signal)} with classification, next actions, and saved history.`,
    firstVersion: (signal: BuildSignal) =>
      `A paste/import workflow with AI-style classification, generated structured output, ${featureSummary(signal)}, saved history, and export actions.`,
    validationPlan: () => [
      "Find 10 target users who already do this workflow manually each week.",
      "Ask each user for one real anonymized input and run it through the prototype.",
      "Measure whether the generated output is good enough to justify $49/month before adding more features.",
    ],
    buildInstruction:
      "Tell Code X to build an AI workflow layer that turns messy inputs into structured outputs and next actions.",
  },
  {
    label: "Prompt pack",
    price: "$19 one-time",
    promptTitle: (signal: BuildSignal) =>
      `${workflowOutputTitle(signal)} Prompt System for ${titleCase(compactBuyer(signal))}`,
    buyer: (signal: BuildSignal) =>
      `Builders, freelancers, operators, and consultants who need repeatable AI outputs for ${workflowName(signal)} without designing the prompt system themselves.`,
    pain: () =>
      "Generic prompts produce inconsistent output, and users need a commercial prompt system with examples, usage notes, and before/after results.",
    productAngle: (signal: BuildSignal) =>
      `A curated prompt system for ${compactBuyer(signal)} that uses reusable prompts, examples, and before/after outputs to produce ${workflowOutcome(signal)}.`,
    firstVersion: (signal: BuildSignal) =>
      `A digital product with 15 prompts, example inputs, before/after outputs, usage instructions, and copy buttons organized around ${workflowName(signal)}.`,
    validationPlan: () => [
      "Create 5 public sample prompts with before/after screenshots.",
      "Publish a simple checkout-ready page with the full prompt pack positioned at $19 one-time.",
      "Send the samples to 30 builders or consultants and ask for 5 purchases or explicit objections.",
    ],
    buildInstruction:
      "Tell Code X to build a sellable prompt-pack product page with prompts, examples, before/after outputs, and copy buttons.",
  },
  {
    label: "Agency service",
    price: "$500 setup + $150/month",
    promptTitle: (signal: BuildSignal) =>
      `Done-for-You ${workflowOutputTitle(signal)} Setup`,
    buyer: (signal: BuildSignal) =>
      `Businesses that want ${workflowOutcome(signal)} but do not want to buy, configure, or maintain software themselves.`,
    pain: (signal: BuildSignal) =>
      `${signal.pain || "The business wants the outcome but lacks time to implement a new process."} The agency-service pain is that the buyer wants the result delivered for them, not another tool to manage.`,
    productAngle: (signal: BuildSignal) =>
      `A done-for-you service for ${compactBuyer(signal)} that uses AI behind the scenes to turn ${workflowInput(signal)} into ${workflowOutcome(signal)} on a recurring basis.`,
    firstVersion: (signal: BuildSignal) =>
      `A service landing page plus internal delivery workflow with client intake, before/after sample output, fulfillment checklist, ${featureSummary(signal)}, and proposal copy.`,
    validationPlan: () => [
      "Create one before/after sample that shows the messy input and the polished deliverable.",
      "Send the sample to 20 likely buyers with a clear $500 setup + $150/month offer.",
      "Ask which part they would want done for them this week and use replies to refine the service package.",
    ],
    buildInstruction:
      "Tell Code X to build a service landing page plus internal delivery workflow for a done-for-you implementation service.",
  },
];

const buildSignals: BuildSignal[] = [
  {
    id: "hokkaido-farm-ops",
    latestSignal:
      "A Japanese farmer in Hokkaido uses ChatGPT and Codex to automate practical farm work, including greenhouse temperature checks, LINE-based remote controls, field data, schedules, sensor logs, and crop troubleshooting.",
    sourceTitle:
      "Japanese farmer uses ChatGPT and Codex to automate farm operations",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A practical AI use case from a local operator using AI as an always-available engineer.",
    buyer: "Small farms and local field businesses",
    pain:
      "Tasks, logs, schedules, and sensor checks are scattered across daily operations.",
    whyNow:
      "Local operators already use chat tools, while AI coding tools make small internal workflow apps fast to prototype.",
    whatYouCanBuild:
      "A LINE-based operations bot for small farms or local field businesses.",
    coreFeatures: [
      "Check today's tasks",
      "Add a work log",
      "Check greenhouse temperature from mock sensor data",
      "Show the next task for a field",
      "Simple admin screen for tasks and fields",
    ],
    comparablePrice:
      "Simple internal automation tools can be sold as setup fee + monthly maintenance. A realistic starting reference is JPY 49,800 setup + JPY 9,800/month or $299 setup + $29/month.",
    buildSteps: [
      "Create a small database for fields, tasks, work logs, and sensor readings.",
      "Build a simple LINE webhook or mock chat interface.",
      "Add commands for today's tasks, add log, greenhouse temperature, and next field task.",
      "Add mock sensor data first.",
      "Add a minimal admin page to edit fields and tasks.",
    ],
    patternMatches: [
      "Agriculture",
      "Construction",
      "Property Management",
      "Local Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Farm Operations Chat Console

Goal:
Help small farms and local field businesses manage daily tasks, work logs, fields, and mock greenhouse sensor readings from one simple operations dashboard.

Target user:
Small farm owners, greenhouse operators, local field teams, and hands-on managers who need a lightweight daily operations tool.

Core workflow:
1. The user selects a mock field or greenhouse.
2. The user checks today's task list and mock sensor readings.
3. The user sends or selects a mock chat command.
4. The app shows the matching task, field, sensor, or next-action response.
5. The user adds a work log.
6. The user can copy the chat summary or saved work log.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include a mock chat panel with commands for today's tasks, add log, greenhouse temperature, and next field task.
- Include a field selector, today's tasks, mock sensor readings, work log form, saved work logs, and simple admin controls for task status.
- Include preview/output sections for chat responses and daily work summaries.
- Include save/copy buttons for generated responses and work logs.
- Include at least 3 mock fields or greenhouse areas with realistic tasks, readings, and statuses.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "clinic-call-triage",
    latestSignal:
      "Small clinics are using AI assistants to summarize phone inquiries, extract patient intent, and route routine requests before staff follow up.",
    sourceTitle: "Clinic teams use AI to triage routine front-desk requests",
    sourceUrl: "",
    sourceType: "AI Use Case",
    sourceNote:
      "A recurring operator pattern: AI structures messy intake before a human callback.",
    buyer: "Small clinics and appointment-based local offices",
    pain:
      "Front desks handle repeated calls with unclear intent, urgency, and next steps.",
    whyNow:
      "AI can structure call notes instantly, and small teams need lighter tools than full call-center software.",
    whatYouCanBuild:
      "A clinic inquiry triage tool that turns call notes into intent, urgency, and next action.",
    coreFeatures: [
      "Paste call notes",
      "Detect inquiry type",
      "Flag urgent requests",
      "Draft staff follow-up",
      "Simple dashboard for open requests",
    ],
    comparablePrice:
      "A small intake automation can start at $499 setup + $49/month for local clinics or service offices.",
    buildSteps: [
      "Create request types and urgency levels.",
      "Build a paste-in call notes screen.",
      "Generate structured intent, urgency, and next action.",
      "Add a list view for unresolved requests.",
      "Add copy buttons for staff follow-up messages.",
    ],
    patternMatches: [
      "Healthcare",
      "Dental Clinics",
      "Veterinary Offices",
      "Repair Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Clinic Inquiry Triage Desk

Goal:
Help small clinics turn messy phone inquiry notes into structured intent, urgency, next actions, and staff follow-up messages.

Target user:
Small clinics, dental offices, veterinary offices, wellness practices, and appointment-based local teams with busy front desks.

Core workflow:
1. The user selects or pastes sample call notes.
2. The user clicks "Triage Inquiry."
3. The app classifies inquiry type and urgency.
4. The app generates next actions and a staff follow-up draft.
5. The user saves the inquiry to an open requests queue.
6. The user can copy the follow-up message or mark the request resolved.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include call notes input, sample call note buttons, triage result preview, inquiry type, urgency badge, next action checklist, and follow-up message output.
- Include an open requests queue with status controls, urgency filter, and resolved state.
- Include save/copy buttons for the triage result and follow-up draft.
- Include at least 4 mock inquiry types such as appointment request, medication question, billing question, and urgent symptom.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "construction-daily-report",
    latestSignal:
      "Construction teams are using AI to turn messy site notes, photos, and chat updates into daily reports for clients and managers.",
    sourceTitle: "Construction teams use AI to turn field notes into reports",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A field-operations pattern where AI converts scattered updates into a standard report.",
    buyer: "Small contractors and field service teams",
    pain:
      "Daily updates live in chats, notebooks, and memory, making client reporting slow and inconsistent.",
    whyNow:
      "Mobile-first AI tools can turn messy notes into consistent reports without a full project management rollout.",
    whatYouCanBuild:
      "A construction daily report generator for small contractors.",
    coreFeatures: [
      "Paste jobsite notes",
      "Add weather and crew count",
      "Generate client-ready report",
      "List blockers and materials",
      "Save reports by project",
    ],
    comparablePrice:
      "A simple reporting workflow can sell for $299 setup + $29/month per small contractor team.",
    buildSteps: [
      "Create projects and daily report records.",
      "Build a notes input screen.",
      "Generate progress, blockers, materials, and next steps.",
      "Add a saved report view by project.",
      "Add copy/export buttons for sending to clients.",
    ],
    patternMatches: [
      "Construction",
      "Landscaping",
      "Property Maintenance",
      "Field Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Construction Daily Report Generator

Goal:
Create a minimal working prototype that helps small contractors turn messy jobsite notes into clean client-ready daily reports.

Target user:
Small contractors, renovation teams, landscapers, property maintenance teams, and field service operators who need to send daily progress updates to clients or managers.

Core workflow:
1. The user selects a mock project.
2. The user enters work date, weather, and crew count.
3. The user pastes messy jobsite notes.
4. The user clicks "Generate Daily Report."
5. The app turns the messy notes into a structured report.
6. The user can copy the report.
7. The user can save the report to a local saved reports list.
8. Saved reports appear immediately on the page.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample messy notes so the demo works immediately.
- Include obvious buttons for Generate, Save Report, and Copy Report.

Report output sections:
- Client-ready summary
- Progress completed today
- Blockers or risks
- Materials used or needed
- Crew and weather details
- Next steps
- Full client update message

Saved reports:
- Show saved reports below the generator.
- Each saved report should include project name, date, short summary, and full report preview.
- Saved reports only need to persist during the current session.

Sample project data:
Include at least 3 mock projects:
1. Kitchen Remodel - Tanaka Residence
2. Roof Repair - Green Valley Office
3. Parking Lot Drainage - Northside Plaza

Sample messy notes:
Include a realistic messy note example with scattered details about work completed, materials, weather, blockers, and next steps.

Acceptance criteria:
- The app loads successfully.
- The user can generate a report from the sample notes.
- The generated report has all required sections.
- The save button adds the report to the saved reports list immediately.
- The copy button copies the report text.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "property-maintenance-router",
    latestSignal:
      "Property managers are using AI to classify tenant maintenance messages, identify urgency, and prepare vendor-ready work orders.",
    sourceTitle: "Property managers use AI to route maintenance messages",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A support-operations pattern where AI turns unstructured customer messages into routed work.",
    buyer: "Small property managers and local facility operators",
    pain:
      "Tenant requests arrive with missing details, unclear urgency, and messy vendor handoff information.",
    whyNow:
      "AI classification is good enough to structure requests before a manager assigns the work.",
    whatYouCanBuild:
      "A tenant maintenance request router for small property managers.",
    coreFeatures: [
      "Paste tenant message",
      "Classify issue category",
      "Estimate urgency",
      "Generate missing-detail questions",
      "Create vendor-ready work order",
    ],
    comparablePrice:
      "Small property operators can pay $399 setup + $39/month for a lightweight maintenance coordination tool.",
    buildSteps: [
      "Define maintenance categories and urgency levels.",
      "Build a request intake screen.",
      "Generate classification, urgency, and missing questions.",
      "Create a vendor work order output.",
      "Add a simple queue for open requests.",
    ],
    patternMatches: [
      "Property Management",
      "HOA Management",
      "Facility Management",
      "Local Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Tenant Maintenance Request Router

Goal:
Help small property managers turn messy tenant messages into categorized, prioritized, vendor-ready maintenance work orders.

Target user:
Small property managers, HOA managers, facility operators, and local landlords who coordinate tenant maintenance without a large operations team.

Core workflow:
1. The user selects or pastes a sample tenant maintenance message.
2. The user clicks "Route Request."
3. The app classifies the issue category and urgency.
4. The app generates missing-detail questions and a vendor-ready work order.
5. The user saves the request to an open queue.
6. The user can copy the work order or move the request through queue statuses.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include tenant message input, sample request buttons, route request button, triage preview, category badge, urgency badge, missing-detail questions, and vendor work order output.
- Include an open request queue with category filter, status controls, and saved request cards.
- Include save/copy buttons for work orders and tenant follow-up questions.
- Include at least 5 maintenance categories such as plumbing, electrical, HVAC, appliance, and exterior.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "restaurant-shift-brief",
    latestSignal:
      "Restaurant operators are using AI to turn sales notes, staff updates, reservations, and inventory issues into shift briefs.",
    sourceTitle: "Restaurant operators use AI for clearer shift handoffs",
    sourceUrl: "",
    sourceType: "Operator Use Case",
    sourceNote:
      "A shift-operations pattern where AI turns messy manager notes into a consistent handoff.",
    buyer: "Independent restaurants and shift-based local teams",
    pain:
      "Shift handoffs are informal, easy to miss, and scattered across notes, chats, reservations, and inventory issues.",
    whyNow:
      "Managers can use AI to produce a useful shift brief without adopting a heavy restaurant operations platform.",
    whatYouCanBuild:
      "A restaurant shift brief generator for independent restaurants.",
    coreFeatures: [
      "Paste manager notes",
      "Add reservations and staffing",
      "Flag stock or prep issues",
      "Generate shift brief",
      "Save briefs by date",
    ],
    comparablePrice:
      "A lightweight shift operations tool can start at $199 setup + $19/month for independent restaurants.",
    buildSteps: [
      "Create a simple shift brief data model.",
      "Build inputs for notes, reservations, staffing, and inventory issues.",
      "Generate a concise shift brief.",
      "Add saved briefs by date.",
      "Add copy buttons for sharing in chat.",
    ],
    patternMatches: [
      "Restaurants",
      "Retail",
      "Hospitality",
      "Local Services",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Restaurant Shift Brief Generator

Goal:
Help independent restaurant managers turn scattered notes, reservations, staffing updates, and stock issues into a clear shift handoff brief.

Target user:
Independent restaurant owners, general managers, shift leads, cafe operators, and hospitality teams that need reliable daily handoffs.

Core workflow:
1. The user enters shift date, shift type, and manager notes.
2. The user reviews sample reservations, staffing, and inventory issues.
3. The user clicks "Generate Shift Brief."
4. The app creates a concise brief for the next team.
5. The user can copy the brief.
6. The user can save the brief to a local saved briefs list.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include manager notes input, shift selector, reservations list, staffing panel, inventory/prep issue checklist, generated brief preview, and saved briefs section.
- Include output sections for service focus, reservation notes, staffing risks, stock/prep issues, and handoff message.
- Include save/copy buttons for the generated brief.
- Include at least 3 sample shifts with realistic reservations, staff notes, and inventory issues.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "local-review-reply-copilot",
    latestSignal:
      "Local operators are using AI to respond faster to customer reviews while keeping replies polite, specific, and on-brand.",
    sourceTitle: "Local businesses use AI to handle review replies",
    sourceUrl: "",
    sourceType: "AI Use Case",
    sourceNote:
      "A local-operations pattern where AI reduces repeated customer communication work.",
    buyer: "Restaurants, clinics, salons, and small shops",
    pain:
      "Owners know reviews matter, but replying consistently takes time and often gets delayed.",
    whyNow:
      "Review volume keeps growing, and AI can draft useful replies from a review, tone, and business context in seconds.",
    whatYouCanBuild:
      "A local review reply copilot for restaurants, clinics, salons, and small shops.",
    coreFeatures: [
      "Paste a customer review",
      "Choose business type and tone",
      "Generate three reply options",
      "Flag negative reviews for owner review",
      "Save reusable brand details",
    ],
    comparablePrice:
      "A small review reply workflow can start at $99 setup + $19/month for local businesses.",
    buildSteps: [
      "Create mock business profiles for restaurant, clinic, salon, and shop.",
      "Build a review input and tone selector.",
      "Generate three reply options from mock rules.",
      "Add negative review flagging.",
      "Add copy buttons and a simple saved replies area.",
    ],
    patternMatches: [
      "Restaurants",
      "Clinics",
      "Salons",
      "Small Shops",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Local Review Reply Copilot

Goal:
Help local businesses quickly draft polite, specific, on-brand replies to customer reviews while flagging negative reviews for owner attention.

Target user:
Restaurant owners, clinic managers, salon owners, small shop operators, and local service teams who need consistent review replies.

Core workflow:
1. The user selects a mock business profile.
2. The user selects or pastes a customer review.
3. The user chooses a reply tone.
4. The user clicks "Generate Replies."
5. The app generates three reply options and flags negative reviews.
6. The user can copy a reply or save it to a local saved replies list.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include business profile selector, brand detail card, review input, sample review buttons, tone selector, negative review alert, and three generated reply cards.
- Include save/copy buttons for each reply and a saved replies section.
- Include at least 4 mock business profiles and sample positive, neutral, and negative reviews.
- Include output labels that show tone, sentiment, and whether owner review is recommended.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "invoice-follow-up-assistant",
    latestSignal:
      "Freelancers and solo agencies are using AI to turn unpaid invoice context into polite follow-up messages and next-step reminders.",
    sourceTitle: "Solo operators use AI to follow up on overdue invoices",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A solo-operator pattern where AI helps with uncomfortable but recurring admin communication.",
    buyer: "Freelancers and solo agencies",
    pain:
      "Invoice follow-up is awkward, easy to postpone, and often scattered across email, spreadsheets, and accounting notes.",
    whyNow:
      "AI can draft polite follow-ups from invoice status and client context while keeping the owner in control.",
    whatYouCanBuild:
      "An invoice follow-up assistant for freelancers and solo agencies.",
    coreFeatures: [
      "Add mock invoices",
      "Filter overdue invoices",
      "Generate polite follow-up email",
      "Generate firmer second reminder",
      "Track next follow-up date",
    ],
    comparablePrice:
      "A lightweight freelancer admin assistant can start at $49 one-time or $9/month.",
    buildSteps: [
      "Create mock clients and invoices.",
      "Build overdue and due-soon filters.",
      "Generate follow-up messages by reminder stage.",
      "Add next follow-up date actions.",
      "Add copy buttons for email drafts.",
    ],
    patternMatches: [
      "Freelancers",
      "Solo Agencies",
      "Consultants",
      "Bookkeepers",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Invoice Follow-Up Assistant

Goal:
Help freelancers and solo agencies turn unpaid invoice context into polite follow-up emails, firmer reminders, and next follow-up dates.

Target user:
Freelancers, solo agencies, consultants, bookkeepers, and independent service providers who need to follow up on unpaid invoices without awkward manual drafting.

Core workflow:
1. The user views a list of mock invoices.
2. The user filters overdue or due-soon invoices.
3. The user selects an invoice.
4. The user chooses a reminder style and clicks "Generate Follow-Up."
5. The app generates an email draft and suggested next follow-up date.
6. The user can copy the email and save the follow-up note in local state.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include invoice list, overdue/due-soon filters, selected invoice details, reminder style controls, generated email preview, next follow-up date control, and saved follow-up notes.
- Include save/copy buttons for generated emails.
- Include at least 5 mock invoices with client name, amount, due date, status, reminder stage, and project context.
- Include output sections for subject line, email body, tone, and next step.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
  {
    id: "micro-saas-ticket-triage",
    latestSignal:
      "Micro SaaS founders are using AI to categorize support tickets, detect urgency, and draft short replies before they lose focus on product work.",
    sourceTitle: "Micro SaaS founders use AI to triage support tickets",
    sourceUrl: "",
    sourceType: "Founder Story",
    sourceNote:
      "A founder-operations pattern where AI protects maker time by structuring customer support work.",
    buyer: "Micro SaaS founders",
    pain:
      "Support tickets interrupt product work and mix bugs, billing questions, feature requests, and urgent customer issues in one queue.",
    whyNow:
      "Solo founders can use AI classification to keep support manageable without adopting a full helpdesk.",
    whatYouCanBuild:
      "A support ticket triage board for micro SaaS founders.",
    coreFeatures: [
      "Paste or load mock tickets",
      "Classify ticket type",
      "Detect urgency",
      "Draft short customer reply",
      "Move tickets across triage columns",
    ],
    comparablePrice:
      "A focused support triage tool can start at $79 one-time or $15/month for micro SaaS founders.",
    buildSteps: [
      "Create mock tickets with type, urgency, and status.",
      "Build a mobile-first triage board.",
      "Add ticket classification and urgency labels.",
      "Generate short reply drafts.",
      "Add column movement and copy buttons.",
    ],
    patternMatches: [
      "Micro SaaS",
      "Indie Hackers",
      "Productized Services",
      "Developer Tools",
    ],
    codeXPrompt: `Build a standalone new web app from scratch.

Product:
Micro SaaS Support Triage Board

Goal:
Help micro SaaS founders categorize support tickets, detect urgency, draft short replies, and move requests through a lightweight triage board.

Target user:
Micro SaaS founders, indie hackers, productized service owners, and small developer-tool teams who need to manage support without a full helpdesk.

Core workflow:
1. The user views a board of mock support tickets.
2. The user selects a ticket.
3. The user clicks "Triage Ticket."
4. The app classifies type, urgency, and recommended next action.
5. The app generates a short customer reply.
6. The user can copy the reply and move the ticket across columns.

Technical requirements:
- Build this as a standalone working web app.
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.

UI requirements:
- Mobile-first layout.
- Clean premium SaaS-style interface.
- Clear cards and sections.
- Good spacing and readable typography.
- No generic AI gradients.
- No unnecessary animations.
- Include sample data so the demo works immediately.
- Include obvious action buttons.

Feature requirements:
- Include a ticket board, ticket detail panel, ticket text preview, type selector or generated type badge, urgency badge, reply draft output, and column movement controls.
- Include columns for New, Needs Reply, Waiting, and Resolved.
- Include save/copy buttons for reply drafts and triage summaries.
- Include at least 6 mock tickets covering bugs, billing questions, feature requests, onboarding questions, and urgent customer issues.

Acceptance criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Save/copy buttons work where relevant.
- The app works without external services.
- The result is polished enough to record in a short demo video.`,
  },
];

const todayIndex = Math.floor(Date.now() / 86400000) % buildSignals.length;

function createClientSeed() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0];
  }

  return Date.now();
}

function buildResult(signal: BuildSignal): ApiResult {
  return {
    free: {
      latest_signal: signal.latestSignal,
      what_you_can_build: signal.whatYouCanBuild,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
    },
    paid: {
      latest_signal: signal.latestSignal,
      source_title: signal.sourceTitle,
      source_url: signal.sourceUrl,
      source_type: signal.sourceType,
      source_note: signal.sourceNote,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
      what_you_can_build: signal.whatYouCanBuild,
      core_features: signal.coreFeatures,
      comparable_price: signal.comparablePrice,
      build_steps: signal.buildSteps,
      pattern_matches: signal.patternMatches,
      code_x_prompt: signal.codeXPrompt,
    },
  };
}

function getAngle(index: number) {
  return masterPromptAngles[index % masterPromptAngles.length];
}

function cleanPromptSubject(signal: BuildSignal) {
  const subject = (signal.whatYouCanBuild || signal.sourceTitle || "Buildable Tool")
    .replace(/^(a|an)\s+/i, "")
    .replace(/\s+(for|to)\s+.+$/i, "")
    .replace(/\.$/, "")
    .trim();

  return subject
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function compactBuyer(signal: BuildSignal) {
  return (signal.buyer || "niche operators")
    .split(/,| and |\/| with /i)[0]
    .replace(/^small\s+/i, "")
    .trim()
    .toLowerCase();
}

function workflowName(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "shift brief";
  if (signal.id.includes("property")) return "tenant maintenance request";
  if (signal.id.includes("clinic")) return "clinic inquiry triage";
  if (signal.id.includes("construction")) return "daily jobsite report";
  if (signal.id.includes("farm")) return "farm operations brief";

  return cleanPromptSubject(signal)
    .replace(/\bGenerator\b/i, "")
    .replace(/\bRouter\b/i, "")
    .replace(/\bAssistant\b/i, "")
    .replace(/\bTool\b/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function workflowBrandName(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "ShiftBrief";
  if (signal.id.includes("property")) return "MaintRouter";
  if (signal.id.includes("clinic")) return "InquiryDesk";
  if (signal.id.includes("construction")) return "JobsiteBrief";
  if (signal.id.includes("farm")) return "FarmOps";

  return titleCase(workflowName(signal)).replace(/\s+/g, "");
}

function workflowConsoleName(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "ShiftBrief Desk";
  if (signal.id.includes("property")) return "MaintRouter Desk";
  if (signal.id.includes("clinic")) return "Clinic Triage Desk";
  if (signal.id.includes("construction")) return "SiteReport Desk";
  if (signal.id.includes("farm")) return "FarmOps Brief Desk";

  return `${workflowBrandName(signal)} Desk`;
}

function workflowInput(signal: BuildSignal) {
  const subject = workflowName(signal);

  if (signal.id.includes("restaurant")) {
    return "messy manager notes, reservation updates, staffing notes, and inventory issues";
  }
  if (signal.id.includes("property")) {
    return "messy tenant maintenance messages, photos, and missing request details";
  }
  if (signal.id.includes("clinic")) {
    return "front-desk call notes, patient questions, and follow-up requests";
  }
  if (signal.id.includes("construction")) {
    return "jobsite notes, weather updates, crew counts, and blocker notes";
  }
  if (signal.id.includes("farm")) {
    return "field tasks, greenhouse readings, work logs, and crop notes";
  }

  return `messy notes and requests around ${subject}`;
}

function workflowOutcome(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) {
    return "saved shift briefs, prep lists, blockers, and handoff summaries for independent restaurant teams";
  }
  if (signal.id.includes("property")) {
    return "categorized, urgent, vendor-ready work orders for small property managers";
  }
  if (signal.id.includes("clinic")) {
    return "triaged inquiry summaries, urgency labels, and staff follow-up drafts for small clinics";
  }
  if (signal.id.includes("construction")) {
    return "client-ready daily reports, blockers, materials lists, and next-step summaries for contractors";
  }
  if (signal.id.includes("farm")) {
    return "daily task lists, sensor summaries, field logs, and next actions for farm teams";
  }

  return `structured outputs, next actions, and saved records for ${compactBuyer(signal)}`;
}

function workflowInputTitle(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "Manager Notes";
  if (signal.id.includes("property")) return "Tenant Messages";
  if (signal.id.includes("clinic")) return "Call Notes";
  if (signal.id.includes("construction")) return "Jobsite Notes";
  if (signal.id.includes("farm")) return "Field Logs";
  return titleCase(workflowName(signal));
}

function workflowOutputTitle(signal: BuildSignal) {
  if (signal.id.includes("restaurant")) return "Shift Briefs";
  if (signal.id.includes("property")) return "Vendor Work Orders";
  if (signal.id.includes("clinic")) return "Inquiry Triage";
  if (signal.id.includes("construction")) return "Daily Reports";
  if (signal.id.includes("farm")) return "Farm Ops Briefs";
  return `${titleCase(workflowName(signal))} Outputs`;
}

function featureSummary(signal: BuildSignal) {
  const features = signal.coreFeatures.length
    ? signal.coreFeatures.slice(0, 3)
    : ["structured input", "generated output", "copy-ready result"];

  return features
    .map((feature) => feature.charAt(0).toLowerCase() + feature.slice(1))
    .join(", ");
}

function normalizeLocalOnlyBuildStep(step: string) {
  return step
    .replace(
      /^Create a small database for fields, tasks, work logs, and sensor readings\.$/i,
      "Create local mock records for fields, tasks, work logs, and sensor readings using React state.",
    )
    .replace(
      /^Build a simple LINE webhook or mock chat interface\.$/i,
      "Build a mock chat-style command panel that simulates LINE-style operations without external APIs.",
    )
    .replace(/\b[Cc]reate a small database\b/g, "Create local mock records")
    .replace(/\b[Cc]reate a database\b/g, "Create local mock records")
    .replace(/\b[Bb]uild a simple LINE webhook\b/g, "Build a mock chat-style command panel");
}

function slugifyProductName(productName?: string) {
  const slug = (productName || "bilion-build-demo")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
    .replace(/-$/g, "");

  return slug || "bilion-build-demo";
}

function buildSafeCodeXPrompt(masterPrompt: MasterPrompt) {
  const routeSlug = slugifyProductName(masterPrompt.promptTitle);
  const routePath = `/${routeSlug}`;

  return `Important implementation constraint:

Do not modify the existing Bilion app routes, access logic, API routes, data files, package files, global layout, or existing production pages.

Build this as a new isolated demo route inside the existing Next.js app.

Create or edit only the files required for this isolated route.

Preferred route:
${routePath}

Preferred file:
app/${routeSlug}/page.tsx

Do not edit:
app/app/BilionAppClient.tsx
app/app/page.tsx
app/page.tsx
API routes
data files
package files
global CSS
layout files

The goal is to create a screenshot-worthy demo product generated from this Bilion master prompt without breaking Bilion itself.

--- FULL CODE X MASTER PROMPT ---

${masterPrompt.fullCodeXMasterPrompt}`;
}

function buildPromptTitle(signal: BuildSignal, angleIndex: number) {
  const angle = getAngle(angleIndex);
  return angle.promptTitle(signal);
}

function getSeededPromptIndexes(previousPromptTitle?: string) {
  const seed = createClientSeed();
  let signalIndex = seed % buildSignals.length;
  let angleIndex =
    Math.floor(seed / Math.max(buildSignals.length, 1)) %
    masterPromptAngles.length;

  if (
    previousPromptTitle &&
    buildPromptTitle(buildSignals[signalIndex], angleIndex) ===
      previousPromptTitle
  ) {
    angleIndex = (angleIndex + 1) % masterPromptAngles.length;

    if (
      buildPromptTitle(buildSignals[signalIndex], angleIndex) ===
        previousPromptTitle &&
      buildSignals.length > 1
    ) {
      signalIndex = (signalIndex + 1) % buildSignals.length;
    }
  }

  return { angleIndex, signalIndex };
}

function buildMasterPrompt(signal: BuildSignal, angleIndex: number): MasterPrompt {
  const angle = getAngle(angleIndex);
  const promptTitle = buildPromptTitle(signal, angleIndex);
  const buyer = angle.buyer(signal);
  const pain = angle.pain(signal);
  const productAngle = angle.productAngle(signal);
  const firstVersion = angle.firstVersion(signal);
  const price = angle.price;
  const validationPlan = angle.validationPlan(signal);
  const features = signal.coreFeatures.length
    ? signal.coreFeatures
    : ["Main input form", "Generated output", "Saved examples", "Copy button"];
  const buildSteps = signal.buildSteps.length
    ? signal.buildSteps.map(normalizeLocalOnlyBuildStep)
    : [
        "Create the main page and mock data.",
        "Build the primary workflow.",
        "Add generated output and copy buttons.",
      ];

  const fullCodeXMasterPrompt = `Build a standalone new web app from scratch.

Product name:
${promptTitle}

Source Signal:
${signal.latestSignal || signal.sourceTitle}

Source Context:
- Title: ${signal.sourceTitle || "Practical AI adoption signal"}
- Type: ${signal.sourceType || "Founder Story"}
- Note: ${signal.sourceNote || signal.whyNow}
${signal.sourceUrl ? `- URL: ${signal.sourceUrl}` : ""}

Buyer:
${buyer}

Pain:
${pain}

Product Angle:
${productAngle}

First Version:
${firstVersion}

Price:
Show this exact price in the product: ${price}

48h Validation Plan:
${validationPlan.map((step, index) => `${index + 1}. ${step}`).join("\n")}

Commercial Build Instructions:
${angle.buildInstruction}

Core workflow:
1. The user opens the product and sees the product name, buyer, pain, and ${price} pricing.
2. The user enters or selects realistic sample input related to ${workflowInput(signal)}.
3. The app transforms that input into a structured commercial output.
4. The user reviews recommended next actions, status, and saved records.
5. The user can copy or export the output and see a clear validation asset for selling the product.

Required pages or sections:
- Main generator/workflow screen
- Sample data selector
- Structured output preview
- Saved records or examples
- Pricing/offer panel showing ${price}
- 48h validation asset section with outreach copy or sample proof

Data model:
- Use local React state only.
- Create mock records for source input, generated output, status, created date, buyer, price, and notes.
- Include at least 3 realistic sample records grounded in the source signal.

AI behavior:
- Use deterministic mock AI behavior.
- Classify the input, extract key details, generate the structured output, and recommend next actions.
- Do not call external AI APIs.

Core Features:
${features.map((feature) => `- ${feature}`).join("\n")}

Build Steps:
${buildSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

Pattern Matches:
${(signal.patternMatches.length ? signal.patternMatches : ["AI workflow", "Local operations"])
  .map((match) => `- ${match}`)
  .join("\n")}

Technical Requirements:
- Use Next.js and React.
- Use mock data only.
- Use local React state only.
- Do not add authentication.
- Do not add payments.
- Do not add a database.
- Do not use external APIs.
- Do not require environment variables.
- Do not ask clarifying questions.
- Make reasonable product decisions and implement the MVP.
- Prioritize a working demo over perfect architecture.
- Keep the scope narrow, commercial, and shippable.

UI Requirements:
- Mobile-first layout.
- Screenshot-worthy, premium SaaS-style interface.
- Clear sections for the workflow, generated output, saved examples, and next action.
- Include sample data so the app works immediately.
- Include obvious buttons for generate, save, and copy.
- Avoid generic startup copy. Make every label specific to this product.
- Show the price ${price} consistently wherever pricing appears.

Acceptance Criteria:
- The app loads successfully.
- The main workflow works from sample data.
- Generated output appears immediately.
- Copy buttons work where relevant.
- The product name, buyer, pain, product angle, price, and validation plan are visible.
- The result feels ready to paste into Code X and build now.`;

  return {
    angleLabel: angle.label,
    promptTitle,
    buyer,
    pain,
    productAngle,
    firstVersion,
    price,
    validationPlan,
    fullCodeXMasterPrompt,
  };
}

function buildFreeSavedSignalCopy(signal: SavedSignal) {
  return `Bilion signal preview

Latest Signal:
${signal.latestSignal}

Buyer:
${signal.buyer}

Pain:
${signal.pain}

What You Can Build:
${signal.whatYouCanBuild}

Why Now:
${signal.whyNow}`;
}

function buildSavedSignal(result: ApiResult): SavedSignal {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    createdAt: new Date().toISOString(),
    sourceTitle: result.paid.source_title,
    buyer: result.paid.buyer,
    pain: result.paid.pain,
    whyNow: result.paid.why_now,
    coreFeatures: result.paid.core_features,
    comparablePrice: result.paid.comparable_price,
    buildSteps: result.paid.build_steps,
    patternMatches: result.paid.pattern_matches,
    fullCodeXPrompt: result.paid.code_x_prompt,
    latestSignal: result.paid.latest_signal,
    whatYouCanBuild: result.paid.what_you_can_build,
    sourceUrl: result.paid.source_url,
    sourceType: result.paid.source_type,
    sourceNote: result.paid.source_note,
  };
}

function buildResultFromSavedSignal(signal: SavedSignal): ApiResult {
  return {
    free: {
      latest_signal: signal.latestSignal,
      what_you_can_build: signal.whatYouCanBuild,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
    },
    paid: {
      latest_signal: signal.latestSignal,
      source_title: signal.sourceTitle,
      source_url: signal.sourceUrl,
      source_type: signal.sourceType,
      source_note: signal.sourceNote,
      buyer: signal.buyer,
      pain: signal.pain,
      why_now: signal.whyNow,
      what_you_can_build: signal.whatYouCanBuild,
      core_features: signal.coreFeatures,
      comparable_price: signal.comparablePrice,
      build_steps: signal.buildSteps,
      pattern_matches: signal.patternMatches,
      code_x_prompt: signal.fullCodeXPrompt,
    },
  };
}

function readSavedSignals(): SavedSignal[] {
  try {
    const rawSignals = window.localStorage.getItem(SAVED_SIGNALS_STORAGE_KEY);

    if (!rawSignals) {
      return [];
    }

    const parsedSignals = JSON.parse(rawSignals);

    if (!Array.isArray(parsedSignals)) {
      return [];
    }

    return parsedSignals
      .filter((signal): signal is SavedSignal => {
        return (
          signal &&
          typeof signal.id === "string" &&
          typeof signal.createdAt === "string" &&
          typeof signal.sourceTitle === "string" &&
          typeof signal.buyer === "string" &&
          typeof signal.pain === "string" &&
          typeof signal.whyNow === "string" &&
          Array.isArray(signal.coreFeatures) &&
          typeof signal.comparablePrice === "string" &&
          Array.isArray(signal.buildSteps) &&
          Array.isArray(signal.patternMatches) &&
          typeof signal.fullCodeXPrompt === "string"
        );
      })
      .slice(0, MAX_SAVED_SIGNALS);
  } catch {
    return [];
  }
}

function writeSavedSignals(signals: SavedSignal[]) {
  try {
    window.localStorage.setItem(
      SAVED_SIGNALS_STORAGE_KEY,
      JSON.stringify(signals.slice(0, MAX_SAVED_SIGNALS)),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

function getLocalDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function readFreeUsageCount() {
  try {
    const raw = window.localStorage.getItem(FREE_USAGE_STORAGE_KEY_EN);

    if (!raw) {
      return 0;
    }

    const parsed = JSON.parse(raw) as { date?: string; count?: number };

    if (parsed.date !== getLocalDateKey()) {
      return 0;
    }

    return Math.max(0, Math.min(FREE_DAILY_LIMIT, Number(parsed.count) || 0));
  } catch {
    return 0;
  }
}

function writeFreeUsageCount(count: number) {
  try {
    window.localStorage.setItem(
      FREE_USAGE_STORAGE_KEY_EN,
      JSON.stringify({
        date: getLocalDateKey(),
        count: Math.max(0, Math.min(FREE_DAILY_LIMIT, count)),
      }),
    );
  } catch {
    // localStorage can be unavailable in private modes or locked-down browsers.
  }
}

export default function BilionAppClient({
  hasFounderAccess,
}: BilionAppClientProps) {
  const [signalIndex, setSignalIndex] = useState(todayIndex);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState(false);
  const [copiedSafePrompt, setCopiedSafePrompt] = useState(false);
  const [copiedSavedSignalId, setCopiedSavedSignalId] = useState("");
  const [savedSignals, setSavedSignals] = useState<SavedSignal[]>([]);
  const [masterPrompt, setMasterPrompt] = useState<MasterPrompt | null>(null);
  const [masterPromptAngleIndex, setMasterPromptAngleIndex] = useState(0);
  const [freeUsageCount, setFreeUsageCount] = useState(0);
  const freeRunsRemaining = hasFounderAccess
    ? Infinity
    : Math.max(0, FREE_DAILY_LIMIT - freeUsageCount);
  const canGenerate = hasFounderAccess || freeRunsRemaining > 0;

  useEffect(() => {
    const loadSavedSignals = window.setTimeout(() => {
      setSavedSignals(readSavedSignals());
      setFreeUsageCount(readFreeUsageCount());
    }, 0);

    return () => window.clearTimeout(loadSavedSignals);
  }, []);

  function saveResult(nextResult: ApiResult) {
    const savedSignal = buildSavedSignal(nextResult);

    setSavedSignals((currentSignals) => {
      const nextSignals = [
        savedSignal,
        ...currentSignals.filter(
          (signal) => signal.fullCodeXPrompt !== savedSignal.fullCodeXPrompt,
        ),
      ].slice(0, MAX_SAVED_SIGNALS);

      writeSavedSignals(nextSignals);
      return nextSignals;
    });
  }

  function incrementFreeUsage() {
    if (hasFounderAccess) {
      return;
    }

    setFreeUsageCount((currentCount) => {
      const nextCount = Math.min(FREE_DAILY_LIMIT, currentCount + 1);
      writeFreeUsageCount(nextCount);
      return nextCount;
    });
  }

  function generateIdea() {
    if (!canGenerate) {
      return;
    }

    setLoading(true);
    setError("");
    const nextIndexes = getSeededPromptIndexes(masterPrompt?.promptTitle);
    const nextSignal = buildSignals[nextIndexes.signalIndex];
    const nextResult = buildResult(nextSignal);
    const builtMaster = buildMasterPrompt(nextSignal, nextIndexes.angleIndex);

    setSignalIndex(nextIndexes.signalIndex);
    setMasterPromptAngleIndex(nextIndexes.angleIndex);
    setResult(nextResult);
    setMasterPrompt(builtMaster);
    setCopiedMasterPrompt(false);
    setCopiedSafePrompt(false);
    saveResult(nextResult);
    incrementFreeUsage();

    setLoading(false);
  }

  function viewSavedSignal(signal: SavedSignal) {
    setCopiedMasterPrompt(false);
    setCopiedSafePrompt(false);
    setResult(buildResultFromSavedSignal(signal));
    setMasterPrompt(null);
  }

  async function copySavedSignalPrompt(signal: SavedSignal) {
    const text = hasFounderAccess
      ? signal.fullCodeXPrompt
      : buildFreeSavedSignalCopy(signal);

    await navigator.clipboard.writeText(text);
    setCopiedSavedSignalId(signal.id);
    window.setTimeout(() => setCopiedSavedSignalId(""), 1000);
  }

  function generateMasterPrompt() {
    if (!canGenerate) {
      return;
    }

    const nextIndexes = getSeededPromptIndexes(masterPrompt?.promptTitle);
    const nextSignal = buildSignals[nextIndexes.signalIndex];
    const nextResult = buildResult(nextSignal);
    const builtMaster = buildMasterPrompt(nextSignal, nextIndexes.angleIndex);

    setCopiedMasterPrompt(false);
    setCopiedSafePrompt(false);
    setSignalIndex(nextIndexes.signalIndex);
    setMasterPromptAngleIndex(nextIndexes.angleIndex);
    setResult(nextResult);
    setMasterPrompt(builtMaster);
    saveResult(nextResult);
    incrementFreeUsage();
  }

  function generateAnotherAngle() {
    if (!canGenerate) {
      return;
    }

    const nextAngleIndex =
      (masterPromptAngleIndex + 1) % masterPromptAngles.length;
    const nextSignalIndex =
      nextAngleIndex === 0 && buildSignals.length > 1
        ? (signalIndex + 1) % buildSignals.length
        : signalIndex;
    let nextSignal = buildSignals[nextSignalIndex];
    let safeAngleIndex = nextAngleIndex;

    if (
      masterPrompt &&
      buildPromptTitle(nextSignal, safeAngleIndex) === masterPrompt.promptTitle
    ) {
      safeAngleIndex = (safeAngleIndex + 1) % masterPromptAngles.length;

      if (
        buildPromptTitle(nextSignal, safeAngleIndex) ===
          masterPrompt.promptTitle &&
        buildSignals.length > 1
      ) {
        nextSignal = buildSignals[(nextSignalIndex + 1) % buildSignals.length];
      }
    }

    const nextResult = buildResult(nextSignal);

    setCopiedMasterPrompt(false);
    setCopiedSafePrompt(false);
    setSignalIndex(buildSignals.indexOf(nextSignal));
    setMasterPromptAngleIndex(safeAngleIndex);
    setResult(nextResult);
    setMasterPrompt(buildMasterPrompt(nextSignal, safeAngleIndex));
    saveResult(nextResult);
    incrementFreeUsage();
  }

  async function copyMasterPrompt() {
    if (!masterPrompt) return;

    await navigator.clipboard.writeText(masterPrompt.fullCodeXMasterPrompt);
    setCopiedMasterPrompt(true);
    window.setTimeout(() => setCopiedMasterPrompt(false), 1000);
  }

  async function copySafeBuildPrompt() {
    if (!masterPrompt) {
      return;
    }

    await navigator.clipboard.writeText(buildSafeCodeXPrompt(masterPrompt));
    setCopiedSafePrompt(true);
    window.setTimeout(() => setCopiedSafePrompt(false), 1000);
  }

  function deleteSavedSignal(signalId: string) {
    setSavedSignals((currentSignals) => {
      const nextSignals = currentSignals.filter(
        (signal) => signal.id !== signalId,
      );

      writeSavedSignals(nextSignals);
      return nextSignals;
    });
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div
        className={[
          "grid min-h-screen grid-cols-1",
          result ? "lg:grid-cols-[260px_1fr_340px]" : "lg:grid-cols-[260px_1fr]",
        ].join(" ")}
      >
        <aside className="hidden border-r border-white/10 bg-[#0b0b0c] p-5 lg:block">
          <div className="mb-8">
            <div className="text-2xl font-black tracking-tight">Bilion</div>
            <div className="mt-1 text-xs text-zinc-500">
              Build Intelligence Console
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem active label="Build Signals" />
            <SidebarItem label="Commercial Angles" locked={!hasFounderAccess} />
            <SidebarItem label="Founder Access" locked={!hasFounderAccess} />
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-semibold">
              {hasFounderAccess ? "Full Prompt Access" : "Free Preview"}
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              {hasFounderAccess
                ? "Unlimited access unlocked."
                : `Free runs today: ${freeUsageCount} / ${FREE_DAILY_LIMIT}. Founder Access unlocks unlimited generation.`}
            </p>
          </div>
        </aside>

        <section className="p-4 md:p-8">
          <header className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-300">
                Build Intelligence
              </div>
              <LanguageSwitch />
            </div>

            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Build and launch in 1 hour
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Bilion finds product ideas from GitHub signals and Indie Hackers
              patterns, then generates the buyer, pain, price, validation plan,
              and AI build prompt. Paste it into Code X, Codex, Cursor, Claude
              Code, or Lovable and turn it into an MVP.
            </p>
          </header>

          {!result && (
            <div className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl md:p-8">
              <h2 className="text-2xl font-black tracking-tight">
                Today&apos;s Build Signal
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Free runs today: {freeUsageCount} / {FREE_DAILY_LIMIT}. Free users get 3 full build prompts per day. Founder Access unlocks unlimited generation.
              </p>
              <button
                onClick={generateIdea}
                disabled={loading || !canGenerate}
                className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate a product"}
              </button>
              {!canGenerate && (
                <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-5">
                  <h3 className="text-lg font-black text-yellow-100">
                    You&apos;ve used today&apos;s 3 free build prompts.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Free users get 3 full-quality outputs per day. Founder Access unlocks unlimited generation, unlimited angles, and unlimited copying.
                  </p>
                  {CHECKOUT_URL ? (
                    <a
                      href={CHECKOUT_URL}
                      className="mt-4 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
                    >
                      Unlock Founder Access — $19
                    </a>
                  ) : (
                    <a
                      href="/founder"
                      className="mt-4 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
                    >
                      Unlock Founder Access — $19
                    </a>
                  )}
                </div>
              )}
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            </div>
          )}

          {result && (
            <div className="mt-8 grid gap-6">
              <div className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">
                      Latest Build Signal
                    </div>
                    <h2 className="mt-4 text-3xl font-black tracking-tight">
                      Commercial signal extracted from real AI adoption.
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Signal #{signalIndex + 1}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <InfoBlock
                    label="Signal"
                    value={result.free.latest_signal}
                  />
                  <InfoBlock
                    label="Product idea"
                    value={result.free.what_you_can_build}
                  />
                  <InfoBlock label="Buyer" value={result.free.buyer} />
                  <InfoBlock label="Next action" value={result.free.why_now} />
                </div>
              </div>

              {canGenerate ? (
              <section className="rounded-3xl border border-white/10 bg-[#101011] p-6 shadow-2xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
                      Full Code X Master Prompt
                    </div>
                    <h2 className="mt-4 text-3xl font-black tracking-tight">
                      Generate a commercial build angle from this signal.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                      {hasFounderAccess
                        ? "Paid users can copy the full Code X Master Prompt and generate additional commercial angles."
                        : `Free runs today: ${freeUsageCount} / ${FREE_DAILY_LIMIT}. Free users get 3 full build prompts per day. Founder Access unlocks unlimited generation.`}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={generateMasterPrompt}
                      disabled={!canGenerate}
                      className="rounded-2xl bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Generate Master Prompt
                    </button>
                    <button
                      type="button"
                      onClick={generateAnotherAngle}
                      disabled={!masterPrompt || !canGenerate}
                      className="rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Generate Another Angle
                    </button>
                  </div>
                </div>

              </section>
              ) : (
                <section className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6 shadow-2xl">
                  <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-yellow-300">
                    Full Prompt Access
                  </div>
                  <h2 className="mt-4 text-3xl font-black tracking-tight">
                    You&apos;ve used today&apos;s 3 free build prompts.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                    Free users get 3 full-quality outputs per day. Founder Access unlocks unlimited generation, unlimited angles, and unlimited copying.
                  </p>
                  {CHECKOUT_URL ? (
                    <a
                      href={CHECKOUT_URL}
                      className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
                    >
                      Unlock Founder Access — $19
                    </a>
                  ) : (
                    <a
                      href="/founder"
                      className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
                    >
                      Unlock Founder Access — $19
                    </a>
                  )}
                </section>
              )}

              {masterPrompt && (
                <MasterPromptCard
                  copied={copiedMasterPrompt}
                  copiedSafe={copiedSafePrompt}
                  hasFounderAccess={hasFounderAccess}
                  masterPrompt={masterPrompt}
                  onCopy={copyMasterPrompt}
                  onCopySafe={copySafeBuildPrompt}
                  angleNumber={masterPromptAngleIndex + 1}
                  signalNumber={signalIndex + 1}
                />
              )}
            </div>
          )}

          <SavedSignalsSection
            hasFounderAccess={hasFounderAccess}
            copiedSignalId={copiedSavedSignalId}
            onCopyPrompt={copySavedSignalPrompt}
            onDelete={deleteSavedSignal}
            onView={viewSavedSignal}
            savedSignals={savedSignals}
          />
        </section>

        {result && (
          <aside className="border-l border-white/10 bg-[#0b0b0c] p-5">
            <div className="sticky top-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-300">
                  Founder Access
                </div>

                <h2 className="mt-4 text-2xl font-black">
                  The paid asset is the complete build spec.
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Founder Access reveals the full Code X Master Prompt, build
                  steps, pattern matches, and copy workflow.
                </p>

                <div className="mt-5 space-y-3">
                  <RightPanelItem title="Core features" />
                  <RightPanelItem title="Comparable price" />
                  <RightPanelItem title="Full Code X Master Prompt" />
                  <RightPanelItem title="Pattern Matches" />
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}

function MasterPromptCard({
  angleNumber,
  copied,
  copiedSafe,
  hasFounderAccess,
  masterPrompt,
  onCopy,
  onCopySafe,
  signalNumber,
}: {
  angleNumber: number;
  copied: boolean;
  copiedSafe: boolean;
  hasFounderAccess: boolean;
  masterPrompt: MasterPrompt;
  onCopy: () => void;
  onCopySafe: () => void;
  signalNumber: number;
}) {
  return (
    <article className="rounded-3xl border border-emerald-400/20 bg-[#0f1512] p-5 shadow-2xl md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">
              Commercial Angle
            </div>
            <div className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-400">
              {masterPrompt.angleLabel}
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight">
            {masterPrompt.promptTitle}
          </h2>
          <p className="mt-3 text-sm font-bold text-emerald-200">
            Variant: Signal #{signalNumber} / Angle #{angleNumber} /{" "}
            {masterPrompt.angleLabel}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Built from the current build signal for Code X, Codex, Cursor,
            Claude Code, Lovable, and solo builder workflows.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onCopySafe}
            className="rounded-2xl bg-emerald-300 px-5 py-4 text-sm font-bold text-black transition hover:bg-emerald-200"
          >
            {copiedSafe ? "Copied" : "Copy Safe Build Prompt"}
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="rounded-2xl bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            {copied ? "Copied" : "Copy to Code X"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <MasterPromptField label="Buyer" value={masterPrompt.buyer} />
        <MasterPromptField label="Pain" value={masterPrompt.pain} />
        <MasterPromptField
          label="Product Angle"
          value={masterPrompt.productAngle}
        />
        <MasterPromptField
          label="First Version"
          value={masterPrompt.firstVersion}
        />
        <MasterPromptField label="Price" value={masterPrompt.price} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          48h Validation Plan
        </div>
        <ol className="mt-3 space-y-2 text-sm leading-6 text-zinc-100">
          {masterPrompt.validationPlan.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="text-zinc-500">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Full Code X Master Prompt
          </div>
          {!hasFounderAccess && (
            <div className="text-xs font-bold text-yellow-300">
              Free generated output
            </div>
          )}
        </div>
        <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/60 p-4 font-sans text-sm leading-6 text-zinc-100">
          {masterPrompt.fullCodeXMasterPrompt}
        </pre>
      </div>
    </article>
  );
}

function MasterPromptField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
    </div>
  );
}

function SavedSignalsSection({
  hasFounderAccess,
  copiedSignalId,
  onCopyPrompt,
  onDelete,
  onView,
  savedSignals,
}: {
  hasFounderAccess: boolean;
  copiedSignalId: string;
  onCopyPrompt: (signal: SavedSignal) => void;
  onDelete: (signalId: string) => void;
  onView: (signal: SavedSignal) => void;
  savedSignals: SavedSignal[];
}) {
  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-[#101011] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            Saved Build Signals
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Your latest 10 generated build signals and commercial angle
            previews are saved in this browser.
          </p>
        </div>
        <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          {savedSignals.length}/10
        </div>
      </div>

      {savedSignals.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-500">
          No saved build signals yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-3">
          {savedSignals.map((signal) => (
            <article
              key={signal.id}
              className="rounded-2xl border border-white/10 bg-black/40 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {new Date(signal.createdAt).toLocaleString()}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-zinc-100">
                    {signal.sourceTitle}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
                    {signal.pain}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.04] px-2.5 py-1 text-xs font-bold text-emerald-300">
                      Saved Angle
                    </span>
                    {signal.patternMatches.slice(0, 3).map((match) => (
                      <span
                        key={match}
                        className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400"
                      >
                        {match}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid shrink-0 grid-cols-3 gap-2 lg:w-36 lg:grid-cols-1">
                  <button
                    type="button"
                    onClick={() => onView(signal)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.04]"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onCopyPrompt(signal)}
                    className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-black transition hover:bg-zinc-200"
                  >
                    {copiedSignalId === signal.id
                      ? "Copied"
                      : hasFounderAccess
                        ? "Copy to Code X"
                        : "Copy Preview"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(signal.id)}
                    className="rounded-xl border border-red-400/20 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/*
function FounderPromptView({
  copied,
  onCopyPrompt,
  onNextSignal,
  pack,
}: {
  copied: boolean;
  onCopyPrompt: () => void;
  onNextSignal: () => void;
  pack: BuildPromptPack;
}) {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
          Founder Build Prompt
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onNextSignal}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.04]"
          >
            Next Build Prompt
          </button>
          <button
            type="button"
            onClick={onCopyPrompt}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            {copied ? "Copied" : "Copy Full Code X Prompt"}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <SourceBlock pack={pack} />
        <PaidBlock
          label="Core Features"
          value={pack.core_features.map((item) => "- " + item).join("\n")}
        />
        <PaidBlock label="Comparable Price" value={pack.comparable_price} />
        <PaidBlock
          label="Build Steps"
          value={pack.build_steps
            .map((item, index) => index + 1 + ". " + item)
            .join("\n")}
        />
        <PaidBlock
          label="Pattern Matches"
          value={pack.pattern_matches.join("\n")}
        />
        <HowToUsePromptBlock />
        <PaidBlock label="Full Code X Prompt" value={pack.code_x_prompt} />
      </div>
    </div>
  );
}

function HowToUsePromptBlock() {
  const steps = [
    "Create a new empty project folder on your computer.",
    "Open that folder in VS Code, Cursor, or another AI coding tool.",
    "Open Codex / Code X.",
    "Paste the Full Code X Prompt below.",
    "Let the AI build the standalone MVP.",
    "Run the app locally and record the result.",
  ];

  return (
    <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        How to use this prompt
      </div>
      <ol className="mt-3 space-y-2 text-sm leading-6 text-zinc-100">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="text-zinc-500">{index + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function SourceBlock({ pack }: { pack: BuildPromptPack }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        Source
      </div>
      <div className="mt-3 grid gap-3 text-sm leading-6 text-zinc-100">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Latest Signal
          </div>
          <div className="mt-1">{pack.latest_signal}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Title
          </div>
          <div className="mt-1">{pack.source_title}</div>
        </div>
        {pack.source_url && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Source URL
            </div>
            <a
              href={pack.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-words underline underline-offset-4 hover:text-white"
            >
              {pack.source_url}
            </a>
          </div>
        )}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Type
          </div>
          <div className="mt-1">{pack.source_type}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Source Note
          </div>
          <div className="mt-1">{pack.source_note}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Buyer
          </div>
          <div className="mt-1">{pack.buyer}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Pain
          </div>
          <div className="mt-1">{pack.pain}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Why Now
          </div>
          <div className="mt-1">{pack.why_now}</div>
        </div>
      </div>
    </article>
  );
}

function LockedFounderView() {
  return (
    <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6">
      <div className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
        Founder only
      </div>

      <h3 className="mt-3 text-2xl font-black">
        Founder preview
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        The full Code X Prompt and matching domains are hidden in the free
        preview.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {lockedItems.map((item) => (
          <LockedItem key={item} text={item} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
        <h4 className="text-xl font-black">Unlock Founder Access</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Get the full Code X prompt, build steps, comparable price, and pattern
          matches.
        </p>

        {CHECKOUT_URL ? (
          <a
            href={CHECKOUT_URL}
            className="mt-5 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Unlock Founder Access — $19
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-bold text-zinc-500"
          >
            Checkout link not configured
          </button>
        )}
      </div>
    </div>
  );
}

*/
function SidebarItem({
  label,
  active,
  locked,
}: {
  label: string;
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between rounded-2xl px-3 py-3 text-sm",
        active
          ? "bg-white text-black"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>
      {locked && <span className="text-xs opacity-60">Locked</span>}
    </div>
  );
}

function LanguageSwitch() {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium text-zinc-500">
      <span className="rounded-full bg-white px-3 py-1.5 text-zinc-950">English</span>
      <Link href="/jp/app" className="rounded-full px-3 py-1.5 transition hover:text-white">
        日本語
      </Link>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm leading-6 text-zinc-100">{value}</div>
    </div>
  );
}

function RightPanelItem({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-zinc-500">Founder</div>
      </div>
    </div>
  );
}
