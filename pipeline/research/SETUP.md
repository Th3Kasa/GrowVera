# GrowVera engine — setup runbook

Everything the autonomous lead engine + dashboard needs. Most of this is config.

## 1. Airtable schema (one base, four tables)

Your base id is already wired (`AIRTABLE_BASE_ID`). Add these tables/fields. Field
names must match exactly (case-sensitive). Single-line text unless noted.

### `Leads` (the CRM — both inbound and outbound write here)
- `LeadId` (text) — dedup key the pipeline sets
- `Business`, `Name`, `Category`, `Region`, `Address`, `Phone`, `Email`, `Website`
- `Score` (number)
- `Source` (single select: Website, google_places, signal, sample)
- `Signal` (long text) — the intent quote + link
- `Status` (single select: New, found, gathered, built, reviewing, ready, pitched, replied, booked, won, lost, lapsed, suppressed)
- `DemoUrl`, `DemoSlug`, `OfferUrl` (text)
- `Pitch` (long text)
- `Channel` (single select: email, instagram, facebook, sms, phone, linkedin)
- `Variant` (text)
- `SentAt`, `RepliedAt`, `BookedAt` (date/time, or text)
- `UpdatedAt` (text/date), `Touches` (number)

### `Outreach` (one row per message sent)
- `LeadId`, `Business`, `Channel`, `Variant`, `Email` (text)
- `SentAt` (date/time), `RepliedAt`, `BookedAt` (optional)
- `Replied` (checkbox, optional), `Booked` (checkbox, optional)

### `Experiments` (optimizer rollups — auto-maintained)
- `Key`, `Channel`, `Variant` (text)
- `Sent`, `Replied`, `Booked` (number), `ReplyRate`, `BookingRate` (number)
- `Active` (checkbox), `UpdatedAt` (text)

### `Settings` (runtime flags — the kill switch)
- `Key` (text), `Value` (text)

> Tip: `typecast` is on, so single-select options are created automatically on
> first write — you don't have to pre-enter every option.

## 2. Cal.com

1. Booking questions (so every booking is a warm, price-aware lead):
   - "Which result do you want?" — Presence / Engine / Growth Partner
   - "Our retainers start at $390/mo + a one-off setup. Does that suit your budget?" — Yes / No
   - Business name, suburb.
2. Webhook → `Settings → Developer → Webhooks`:
   - URL: `https://growvera.com.au/api/cal-webhook`
   - Trigger: `Booking Created`
   - (Optional) set a secret and put it in `CAL_WEBHOOK_SECRET`.

## 3. Env vars (local `.env` + Vercel)

Required for the dashboard/auth: `ADMIN_PASSWORD`.
Lead engine: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` (set), `OPENROUTER_API_KEY`.
Outreach safety: `OUTREACH_ENABLED` (true/false; default off), `DAILY_OUTREACH_CAP` (default 15).
Booking: `CAL_WEBHOOK_SECRET` (optional). Email: `ZOHO_SMTP_PASS`, `NOTIFY_TO`.
Live data (optional): `GOOGLE_PLACES_API_KEY`, and for last30days research a
`SCRAPECREATORS_API_KEY` / `BRAVE_API_KEY` + Python 3.12+.

## 4. Run it

```bash
# 1) Research warm signals (after a last30days run saved to research/last30days.md)
npm run pipeline:signals

# 2) Full loop: scout → build demos → offer pages → guarded outreach
npm run pipeline -- --region "Penrith NSW" --category Plumber --limit 3

# 3) Weekly: learn what converts and pause losers
npm run pipeline:optimize
```

Dashboard: `https://growvera.com.au/admin` (password = `ADMIN_PASSWORD`). The
outreach kill switch lives there.

## 5. Self-running schedule

The heavy build step uses Playwright, so run the pipeline on your machine (or a
small VM) on a schedule — daily scout/build/outreach, weekly optimize — via a
Claude Code scheduled routine or OS cron. The website pieces (offer pages, Cal
webhook, dashboard) run on Vercel and need no scheduling.

## 6. Safety

Outreach is OFF by default. It only sends to real business emails, with a
compliance footer + opt-out, never to anyone on the `Suppression` list, never
above the daily cap, and stops instantly from the dashboard kill switch
(Australian Spam Act 2003).
