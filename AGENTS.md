# AGENTS.md

## Project

This repository is Bilion.

Bilion turns real-world AI business signals, startup stories, newsletters, and market patterns into buildable AI business opportunities, prompts, lead magnets, content angles, and product offers.

The current priority is to grow Bilion into an AI business opportunity OS without breaking the existing product.

## Non-Negotiable Rules

- Do not modify existing routes unless explicitly requested.
- Do not modify the landing pages unless explicitly requested.
- Do not modify Founder/Paid access logic unless explicitly requested.
- Do not refactor unrelated files.
- Do not rename existing data fields unless explicitly requested.
- Do not delete existing files or data.
- Do not introduce external API calls unless explicitly requested.
- Do not add new dependencies unless necessary and explained.
- Keep all changes small, isolated, and reversible.
- Prefer adding new files over changing existing working files.
- Always preserve the current app behavior.

## Current Product Context

Bilion has existing landing pages, app routes, Founder/Paid access logic, and data-driven signal/product flows.

The product is evolving toward:

1. Starter Stories
   - Success patterns from real startup, AI, and business stories.
   - Used to generate buildable product ideas and CodeX prompts.

2. Gmail Signal Inbox
   - Gmail/newsletter-derived market signals.
   - Sources include Indie Hackers, Product Hunt, Failory, God of Prompt, Liam Ottley, and selected Skool communities.
   - These are saved first as draft records, not published records.

3. Opportunity Engine
   - Converts signals into:
     - buyer
     - pain
     - why_now
     - product_idea
     - first_product
     - price
     - distribution
     - validation_plan
     - lead_magnet_angle
     - content_angle
     - bilion_access_angle

4. Execution Generator
   - Future feature.
   - Generates:
     - CodeX build prompts
     - landing page copy
     - X posts
     - DM scripts
     - validation plans
     - paid report angles

## Data Philosophy

Bilion should separate raw signals from reviewed/published opportunities.

Use this status flow:

- draft
- rejected
- published

Do not auto-publish new records.

Use these evidence fields where relevant:

- evidence_level: strong | medium | weak
- hype_risk: low | medium | high

Use scoring where relevant:

- buyer_clarity
- pain_intensity
- urgency
- buildability
- distribution
- monetization
- evidence_strength
- total

## Gmail Signal Inbox Rules

When implementing Gmail-derived signal features:

- Keep the system isolated.
- Use file-based JSON import first.
- Do not connect Gmail API yet unless explicitly requested.
- Do not call OpenAI API yet unless explicitly requested.
- Do not build review UI yet unless explicitly requested.

Start with:

- scripts/sample-gmail-signals.json
- scripts/import-gmail-signals.ts
- data/signal-inbox/drafts/
- data/signal-inbox/rejected/
- data/signal-inbox/published/
- docs/signal-inbox.md

The importer should:

- Read scripts/sample-gmail-signals.json
- Validate that it is an array
- Write each object as a separate JSON file
- Use {id}.json as filename
- Preserve all fields exactly
- Pretty-print JSON with 2 spaces

## Coding Style

- Use TypeScript.
- Keep strict, readable types.
- Prefer small utility functions.
- Avoid clever abstractions.
- Add comments only where they clarify intent.
- Keep scripts deterministic.
- Make file paths explicit and safe.
- Ensure directories exist before writing files.

## Validation

After changes, run the smallest useful checks available.

Prefer:

- npm run signals:import
- npm run lint
- npm run build

If a command fails, report:

- what failed
- likely cause
- exact next fix

Do not hide errors.

## Communication Style

When reporting back, include:

1. Changed files
2. What was added
3. What was not touched
4. Commands run
5. Errors, if any
6. Next recommended step

## Current Priority

The next task is likely:

Create Bilion Signal Inbox v0.

Goal:
Add an isolated data import system for Gmail-derived Bilion signal drafts.

Do not modify existing routes.
Do not modify existing UI.
Do not modify Founder/Paid access logic.
