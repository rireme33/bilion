# Bilion Signal Inbox v0

Signal Inbox v0 is an isolated file-based import flow for Gmail-derived Bilion signal drafts.

It does not connect to Gmail, call OpenAI, scrape, write to a database, or publish records into the Bilion app.

## 1. Paste Gmail-Derived JSON

Paste an array of Gmail-derived signal objects into:

```text
scripts/sample-gmail-signals.json
```

Each object must include:

```json
{
  "id": "unique-signal-id",
  "status": "draft"
}
```

Allowed statuses:

- `draft`
- `rejected`
- `published`

All other fields are preserved exactly as written.

## 2. Run The Importer

Run:

```bash
npm run signals:import
```

The importer validates that `scripts/sample-gmail-signals.json` is an array, ensures target directories exist, and writes each object as its own pretty-printed JSON file.

## 3. Generated Files

Records are written by status:

```text
data/signal-inbox/drafts/{id}.json
data/signal-inbox/rejected/{id}.json
data/signal-inbox/published/{id}.json
```

The importer preserves all fields exactly and pretty-prints with 2 spaces.

## 4. Future TODO

- Gmail API integration
- OpenAI extraction
- Auto scoring
- Review UI
- Publish to Bilion app
