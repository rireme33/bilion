# Bilion Data Architecture

Bilion is evolving into a business opportunity OS.

The data architecture should keep raw material, reviewed signals, success patterns, and user-facing opportunities separate. Each layer has a different job and should not be mixed with the others.

## Flow

```text
raw-sources
-> signal-inbox / success-records
-> opportunities
-> Bilion app / content / paid products
```

## 1. raw-sources

`raw-sources` is the input layer.

It contains raw, unprocessed source material such as:

- Gmail emails
- newsletters
- Product Hunt digests
- Failory emails
- YouTube transcripts
- Indie Hackers URLs
- founder stories
- other unprocessed market sources

Raw sources are not shown directly to users. They are evidence and extraction inputs only.

Raw source records may include fields such as:

- source name
- source URL
- sender
- subject
- received date
- transcript text
- raw body
- source type
- import date

This layer should preserve source material as faithfully as possible. It should not decide whether something is a good opportunity.

## 2. signal-inbox

`signal-inbox` is the market signal review layer.

It contains extracted signals from Gmail, newsletters, and current market sources. These are not yet final user-facing opportunities.

Signal Inbox uses this status flow:

```text
draft -> rejected / published
```

Signal records should capture:

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
- evidence_level: strong | medium | weak
- hype_risk: low | medium | high
- score

Score fields should include:

- buyer_clarity
- pain_intensity
- urgency
- buildability
- distribution
- monetization
- evidence_strength
- total

Signal Inbox is for triage and review. A signal can be valuable without being ready to publish.

## 3. success-records

`success-records` is the Starter Story and success pattern layer.

It contains reusable business patterns from:

- videos
- articles
- Indie Hackers posts
- founder stories
- case studies
- manually imported Glasp/Bilion records

Success Records should explain why a business worked and how the pattern can be reused.

Success Records should capture:

- business name
- source URL
- source type
- industry
- revenue signal
- buyer
- pain
- offer
- pricing model
- growth channel
- distribution notes
- why it worked
- AI-native remake
- starter product
- validation plan
- X post ideas
- short script ideas
- image prompt
- CodeX build prompt
- monetization path
- replication score
- AI leverage score
- monetization clarity
- build difficulty

This layer is not a raw source archive. It is a reviewed pattern layer.

## 4. opportunities

`opportunities` is the future normalized output layer.

It should combine useful records from `signal-inbox` and `success-records` into final user-facing product opportunities.

Each opportunity should be able to generate:

- AI-native business idea
- starter product
- X post
- short video script
- CodeX build prompt
- monetization plan
- validation plan
- lead magnet
- offer

Opportunities are the final layer before user-facing surfaces such as:

- Bilion app
- content workflows
- paid reports
- lead magnets
- founder/paid products

The opportunity layer should normalize differences between source types. A Gmail newsletter signal and a YouTube founder story may both support the same final opportunity, but they should remain separate evidence inputs.

## Do Not Mix Layers

Keep the layers separate.

- Do not store raw Gmail emails directly as opportunities.
- Do not store Starter Stories directly as signal-inbox records.
- Do not auto-publish records.
- Keep `draft`, `rejected`, and `published` separation.
- Use `opportunities` as the final user-facing layer.

This separation keeps Bilion reliable:

- raw sources preserve evidence
- signal-inbox supports current market triage
- success-records preserve reusable patterns
- opportunities become polished user-facing business outputs

## Current Direction

Near-term work should stay file-based and review-first.

Recommended next steps:

- Continue importing Gmail-derived signals into `data/signal-inbox/drafts/`.
- Review drafts before publishing.
- Continue importing Starter Stories into `data/success-records/imports/`.
- Avoid connecting Gmail API, OpenAI extraction, or automatic publishing until the review flow is stable.
