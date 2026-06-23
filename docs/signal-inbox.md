# Bilion Signal Inbox

Signal Inbox is a manual, file-based import workflow for Gmail/newsletter-derived Bilion signals.

It does not connect to Gmail, use OAuth, call external APIs, call OpenAI, or write to a database.

## Batch Input

Create one JSON file per batch with up to 20 records:

```text
scripts/gmail-signal-batch-001.json
scripts/gmail-signal-batch-002.json
scripts/gmail-signal-batch-003.json
scripts/gmail-signal-batch-004.json
scripts/gmail-signal-batch-005.json
```

Each file must contain a JSON array. Each record should use this schema:

```json
{
  "id": "gmail-batch-001-001",
  "status": "draft",
  "source": "gmail",
  "sender": "newsletter@example.com",
  "subject": "Newsletter subject",
  "received_at": "2026-06-01T09:00:00.000Z",
  "summary": "Short human-readable summary.",
  "category": "newsletter_pattern",
  "raw_signal": "The actual market signal extracted from the email.",
  "buyer": "Solo AI builders",
  "pain": "The buyer pain.",
  "why_now": "Why this matters now.",
  "product_idea": "The product angle.",
  "first_product": "The first sellable product.",
  "price": "USD 19 one-time validation pack",
  "distribution": "X, newsletter replies, communities, direct outreach.",
  "lead_magnet_angle": "The free PDF angle.",
  "content_angle": "The public post angle.",
  "bilion_access_angle": "How Bilion turns this into Build/Sell/Post outputs.",
  "evidence_level": "medium",
  "hype_risk": "medium",
  "score": 75,
  "recommended_use": "build_sell_post"
}
```

Required validation fields:

- `id`
- `status`
- `subject`
- `raw_signal`
- `buyer`
- `score`

The importer also blocks duplicate IDs across the batch and existing imported files.

## Import

Run one batch at a time:

```bash
npm run import:gmail-signals -- scripts/gmail-signal-batch-001.json
```

The old command still works and defaults to `scripts/sample-gmail-signals.json`:

```bash
npm run signals:import
```

## Routing

The importer routes each record by `score` and writes a separate `{id}.json` file:

```text
score >= 80       -> data/signal-inbox/published/
score >= 55 < 80  -> data/signal-inbox/drafts/
score < 55        -> data/signal-inbox/rejected/
```

The saved record status is updated to the routed status.

Older Signal Inbox records that use `score.total` from the original 35-point rubric are normalized to a 100-point score for review/import decisions.

## Review Drafts

Run:

```bash
npm run signals:review
```

This prints draft records sorted by score and shows a review action:

- `publish_candidate`
- `review_more`
- `reject_candidate`

The reviewer supports both the current flat batch schema and older nested Signal Inbox records.

## Publish Or Reject

Manual review stays file-based.

To publish a draft:

1. Open the JSON file in `data/signal-inbox/drafts/`.
2. Confirm buyer, pain, evidence, hype risk, and score.
3. Set `"status": "published"`.
4. Move the file to `data/signal-inbox/published/`.

To reject a draft:

1. Open the JSON file in `data/signal-inbox/drafts/`.
2. Set `"status": "rejected"`.
3. Move the file to `data/signal-inbox/rejected/`.

Do not auto-publish unreviewed records.

## App Visibility

`/app` reads Gmail/newsletter signals from:

```text
data/signal-inbox/published/
data/signal-inbox/drafts/
```

Rejected records are not shown in the app.

Visible Gmail/newsletter records are added to Step 1: Pick a proven market signal and are labeled as `Gmail Signal`. Selecting one affects the existing Build it / Sell it / Post it output flow.

## Sample 100-Record Workflow

Import the five sample batches in order:

```bash
npm run import:gmail-signals -- scripts/gmail-signal-batch-001.json
npm run import:gmail-signals -- scripts/gmail-signal-batch-002.json
npm run import:gmail-signals -- scripts/gmail-signal-batch-003.json
npm run import:gmail-signals -- scripts/gmail-signal-batch-004.json
npm run import:gmail-signals -- scripts/gmail-signal-batch-005.json
```

Then review:

```bash
npm run signals:review
```
