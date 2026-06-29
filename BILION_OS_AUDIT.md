# Bilion OS Audit

## Current Feel

Bilion is between a static signal database and a real workflow OS.

It already has the main OS ingredients: money signal sources, normalization, Launch Pack-style generation, copyable assets, a distribution queue, validation tracker, winners, and Codex prompts. The weak spot is not signal quantity. The weak spot is that some OS pieces feel secondary or archived, so a first-time user can still read the product as a database or prompt generator instead of a loop.

## 1. Signal Sources

- Static in-app `buildSignals` in `app/app/BilionAppClient.tsx`
- `canonicalMoneySignals` from `data/money-signals.ts`
- Static Gmail seed signals from `data/gmail-signals.ts`
- File-based Gmail/signal-inbox records loaded from `data/signal-inbox`
- Approved Signal Inbox records saved in localStorage
- Evidence Intake records saved in localStorage
- GitHub Signal Lab sample/input signal
- Showcase and success-record data exist elsewhere, but `/app` primarily consumes normalized market signals

## 2. Signal Normalization

- Gmail seed records are normalized in `lib/gmail-signals.ts` via `normalizeGmailSignal(signal)`.
- Signal Inbox approvals are normalized in `convertApprovedMoneySignalToBuildSignal`.
- Canonical money signals are normalized in `buildCanonicalMoneySignal`.
- Market-specific fallback signals are normalized through `buildMarketSpecificSignal`.
- UI output fields are unified through `getOpportunityDetailFields`.

## 3. Main `/app` UI

- `app/app/page.tsx` loads founder cookies and calls `getGmailMarketSignals()`.
- `app/app/BilionAppClient.tsx` renders the full client app.
- The first-screen market flow is in `MarketSelectionSection`.
- Output generation is handled by `buildOutputPackFromSignal`.
- Queue, tracker, winners, and saved prompts live in `SecondaryToolsSection`.

## 4. Current User Flow

Current visible flow:

1. Pick a market.
2. Choose a money signal.
3. Open Deep Dive.
4. Generate a Launch Pack.
5. Copy post, carousel, DM, validation plan, and Codex prompt.
6. Save assets to Distribution Queue.
7. Track replies in Validation Tracker.
8. Save Winners.
9. Build with Codex only after demand is proven.

## 5. Repetitive Areas

- Some older copy still says Business Spark in legacy/secondary sections.
- There are multiple generation surfaces: Deep Dive Launch Pack, older Studio generation, saved prompts, and advanced archives.
- Output Pack and Launch Pack naming were mixed; Launch Pack should be the main customer-facing concept.
- Queue and validation existed, but felt hidden under Advanced/Archive.

## 6. Existing Launch Pack Behavior

Bilion already supports Launch Pack behavior through:

- `buildOutputPackFromSignal`
- Copyable X post
- Carousel slides
- Cold DM
- 48-hour validation plan
- Codex build prompt
- localStorage saved output packs under `bilion_output_packs`
- Distribution Queue under `bilion.distributionQueue`
- Validation records under localStorage
- Winners section from validation records

## 7. Missing Compared To Tweet Hunter-like OS

- Queue is local/manual only; no scheduling.
- No analytics or engagement import.
- No reply inbox.
- No automatic winner detection from real distribution data.
- No campaign calendar.
- No team/account model.
- No cross-session cloud storage.

These are product expansions, not blockers for the current local-first OS loop.

## 8. Safe Changes Implemented Now

- Made Launch Pack the main output wording in the first-time flow.
- Added angle-based framing: Post it, Sell it, DM buyers, Build MVP.
- Made generated Launch Packs vary deterministically by selected angle.
- Saving a Launch Pack now also adds assets to Distribution Queue.
- Queue statuses now reflect the validation loop: Not tested, Posted, DM sent, Got replies, Winner, Rejected.
- Added `docs/signal-intake-rules.md` to protect DB quality.

## Risk Notes

- The old Studio generation path still uses the existing free usage logic. I only changed customer-facing copy toward Launch Packs. I did not refactor billing, cookies, or access checks.
- Japanese copy was not changed in this pass because the request prioritized preserving `/jp/app`.
- DB quantity is not the current bottleneck. Bilion has enough signals to demonstrate the OS. The bottleneck is making generation, distribution, validation, and winners feel like one obvious loop.
