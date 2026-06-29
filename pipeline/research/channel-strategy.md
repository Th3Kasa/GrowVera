# GrowVera lead-channel strategy

This file is the engine's working channel playbook. It starts from researched
benchmarks and is meant to be refreshed by `last30days` + the optimizer
(`pipeline/research/optimizer-report.md`). The data picks the winners over time.

## Starting hypothesis (cheapest high-converting first)

For Sydney trades & local services, pre-revenue and solo:

1. **Personalised demo + warm outreach** is the spine. We build a real site for a
   specific prospect, then point them to their `/offer/[id]` page (demo + price +
   booking). This is the single highest-converting tactic (signal-based,
   personalised demos report ~5–7× the reply rate of generic cold outreach).
2. **Channel priority to start:**
   - **Instagram / Facebook DM** — where Sydney trades actually are; high open
     rates; founder-sent at first (no compliant bulk DM API).
   - **Phone / SMS for the hottest leads** — we have the Places phone number;
     highest conversion, least scalable; human-sent, consent-aware.
   - **Email** — only where we have a real business email; fully automatable with
     compliance footer + opt-out. Cold-email reach is limited because Places gives
     a phone, not an email, so email mostly serves inbound + enriched leads.
3. **Referrals** become the cheapest channel once the first few clients are happy
   — build a referral ask into month-2 of delivery.

## How the engine uses this

- `signalScout` reads `signals.json` (produced from a `last30days` run via
  `npm run pipeline:signals`) to find warm, intent-based leads.
- The pipeline builds each a demo and an `/offer/[id]` page, drafts a pitch, and
  the **guarded** outreach pass auto-sends where a compliant email exists; the
  rest queue on the dashboard for a founder DM/call.
- `npm run pipeline:optimize` rolls up real bookings per channel/variant and
  pauses what underperforms. Update this file from its report each week.

## Compliance (Australian Spam Act 2003)

Business-to-business only, clear sender identity + one-click opt-out on every
email, suppression list checked before each send, conservative daily cap, and a
dashboard kill switch. Warm the sending domain gradually.
