# Bilion Signal Diversity Audit

## Summary

Bilion has enough static signal supply to feel like a Money Signal OS, but the selection layer was too fixed. The app could repeatedly surface the same high-score signals because Recommended was mostly static and the app did not remember what the user had already opened.

DB quantity is not the current bottleneck. Signal selection, rotation, and memory are the bottleneck.

## 1. Total Normalized Signals Available In `/app`

Static sources available to `/app` before localStorage additions:

- In-app `buildSignals`: 8
- Gmail seed signals: 13
- Canonical money signals: 80
- Static total: 101

Runtime sources can add more:

- Signal Inbox approved money signals from localStorage
- Approved evidence intake signals from localStorage
- GitHub Signal Lab input/sample signal

## 2. Signals Per Source

- Gmail Signals: 13 from `data/gmail-signals.ts`, normalized by `normalizeGmailSignal`.
- GitHub signals: 1 generated sample/input signal from the GitHub Signal Lab path.
- Success records: not directly loaded into `/app` as raw success-record JSON. Some founder/story patterns are represented in static in-app signals.
- Money signals: 80 from `data/money-signals.ts`.
- Signal Inbox: dynamic localStorage source, depending on approved user imports.
- Other source: 8 static in-app `buildSignals`.

## 3. Signals Per Visible Market

Approximate static counts by visible market/category:

- Creators: 21
- Ecommerce: 8
- Local Business: 11
- Healthcare: 9
- Construction: 4
- Finance: 6
- Legal: 4
- Real Estate: 6
- Developer Workflow: 20
- Agriculture / Field Ops: 4

These counts exclude user-approved localStorage Signal Inbox records.

## 4. Is Recommended Fixed Or Dynamic?

Previously, Recommended favored a fixed set of Gmail signals and then filled from the static list. This made the product feel smaller than the actual signal pool.

Recommended is now lightly dynamic:

- Rejected signals are avoided.
- Unseen signals are preferred.
- Multiple sources are represented before filling the rest of the list.
- Higher opportunity score is still used as a tie-breaker.

## 5. Current Display / Generation Selection

Main flow:

1. User picks a visible market.
2. Bilion ranks Top Money Signals for that market.
3. User opens a Deep Dive.
4. User picks a Launch Pack angle.
5. Bilion generates a Launch Pack from that exact signal.

Advanced flow:

- Signal Library cards can select a signal.
- Another Signal now picks a different signal from the selected market.
- Another Angle keeps the same signal and cycles the framing angle.

## 6. Seen Signal Tracking

The app now tracks seen signal IDs in localStorage:

- `bilion_seen_signal_ids`

A signal is marked seen when:

- The user selects it from the Signal Library.
- The user opens it in Deep Dive.
- The user turns it into a Launch Pack.
- Another Signal lands on it.

## 7. Avoiding Repetition

The app now avoids repetition by:

- Preferring unseen signals in Recommended.
- Preferring unseen signals in Another Signal.
- Avoiding rejected signals.
- Preferring a different source than the current signal when possible.
- Falling back only when the pool is exhausted.

## 8. Saved, Winner, And Rejected Signals

The app now stores lightweight signal memory keys:

- `bilion_seen_signal_ids`
- `bilion_saved_signal_ids`
- `bilion_winner_signal_ids`
- `bilion_rejected_signal_ids`

Saved Launch Packs add their source signal to saved IDs.
Rejected Signal Inbox/Evidence records add their IDs to rejected IDs.
Winner records are tracked from validation records.

## 9. Where Repetition Came From

Repetition came from four places:

- Recommended was too fixed.
- Selection did not know which signals were already seen.
- Another Angle could feel like another idea even though it reused the same signal.
- Source and market counts were hidden, so the app felt smaller than the data pool.

## 10. Bottleneck

DB quantity is not the current bottleneck.

The current bottleneck is signal rotation and workflow memory. Bilion already has enough signal supply to demonstrate abundance. The app needs to keep making it obvious that users are moving through a large money-signal library toward Launch Packs, validation, and winners.
