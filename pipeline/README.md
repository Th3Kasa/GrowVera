# GrowVera Pipeline (Workstream B)

The autonomous web-agency engine. Each run finds local businesses with no
website, builds each a bespoke site, deploys it, reviews it with vision, drafts a
pitch, and records everything in a CRM.

```
Prospect ─▶ Gather ─▶ Build ─▶ Deploy ─▶ Review ─▶ Pitch ─▶ CRM
 (Places)  (photos)  (Sonnet)  (local)   (Opus)   (Sonnet)
```

## Run it

```bash
npm install            # installs tsx + deps
npm run pipeline       # offline demo: sample businesses + template builder

# real engine (set keys first):
npm run pipeline -- --region "Cronulla NSW" --category Plumber --limit 3
```

Built sites land in `pipeline/output/<slug>/index.html`; lead state in
`pipeline/.crm.json` (both gitignored).

## Engine modes (hybrid)

| Key set | Behaviour |
|---|---|
| _none_ | Fully offline: bundled sample prospects + high-quality **template** builder. Review/pitch use templates. Always produces real sites. |
| `ANTHROPIC_API_KEY` | Real **Claude** build (Sonnet 4.6) + **vision QA** (Opus 4.8) + Claude-written pitch. |
| `GOOGLE_PLACES_API_KEY` | Live **prospecting** — real businesses with no `websiteUri` in your region. |

For bulk/dev throughput you can also drive builds through a **Claude Code Max**
subscription (flat-rate); the productised path here uses the **API** with model
tiering + prompt caching.

## Cost controls (built in)

- **Model tiering** (`config.ts`): Haiku-class for cheap work, **Sonnet 4.6** for
  the build, **Opus 4.8** only for the vision review — the pass where quality is made.
- **Prompt caching**: the design-system prompt and review rubric are sent as a
  cached system prefix, so repeat builds bill that prefix at ~0.1× input.
- Every run prints a **live cost report** (USD + AUD, and AUD/site).

## Files

| File | Role |
|---|---|
| `run.ts` | Orchestrator CLI + cost report |
| `prospector.ts` | Find no-website businesses (Google Places v1 / sample) + scoring |
| `gatherer.ts` | Normalise photos/details |
| `builder.ts` | Bespoke site via Claude Sonnet (cached design system) or template |
| `deployer.ts` | Write site locally; seam for Vercel/Cloudflare live deploy |
| `reviewer.ts` | Playwright desktop+mobile screenshots → Opus vision QA |
| `pitcher.ts` | Personalised outreach email |
| `crm.ts` | Local-JSON CRM with dedupe + lapsed-lead detection |
| `llm.ts` | Anthropic wrapper: tiering, caching, usage/cost tracking |

## Next steps to productionise

- Swap `deployer.ts` for a real Vercel/Cloudflare Pages deploy (free subdomains).
- Point `crm.ts` at Supabase (reuse the REST pattern in `lib/subscriptions.ts`).
- Send pitches via the Zoho transporter (see `app/api/audit/route.ts`) or an
  outreach tool; run the 5-touch sequence on a schedule.
- Gate runs behind an active subscription (the `subscriptions` entitlement store).
