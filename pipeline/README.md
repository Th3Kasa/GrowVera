# GrowVera Pipeline (Workstream B)

The autonomous web-agency engine. Each run finds local businesses with no
website, builds each a bespoke site, deploys it, reviews it with vision, drafts a
pitch, and records everything in a CRM.

```
Prospect ─▶ Gather ─▶ Build ─▶ Deploy ─▶ Review ─▶ Pitch ─▶ CRM
 (Places)  (photos)   (GLM)   (local)  (vision)   (cheap)
```

Cheapest-first: all model work defaults to **open models via OpenRouter**
(~35× cheaper than frontier Claude and off the metered Claude pool). Frontier
Claude is opt-in.

## Run it

```bash
npm install            # installs tsx + deps
npm run pipeline       # offline demo: sample businesses + template builder

# real engine (set keys first):
npm run pipeline -- --region "Cronulla NSW" --category Plumber --limit 3
```

Built sites land in `pipeline/output/<slug>/index.html`; lead state in
`pipeline/.crm.json` (both gitignored).

## Engine modes (cheapest-first)

| Key set | Behaviour |
|---|---|
| _none_ | Fully offline: bundled sample prospects + high-quality **template** builder. Review/pitch use templates. Always produces real sites. |
| `OPENROUTER_API_KEY` | **Default.** Open-model build (GLM-4.6) + **vision QA** (Qwen-VL) + cheap-model pitch (DeepSeek). One key, ~35× cheaper, off the metered Claude pool. Model ids overridable via `OPENROUTER_MODEL_*`. |
| `ANTHROPIC_API_KEY` (no OpenRouter, or `USE_FRONTIER=1`) | **Frontier opt-in.** Claude build (Sonnet 4.6) + vision QA (Opus 4.8). For the rare high-stakes run. |
| `GOOGLE_PLACES_API_KEY` | Live **prospecting** — real businesses with no `websiteUri` in your region. |

Provider selection lives in `config.ts` (`PROVIDER`): OpenRouter wins by default
when its key is present; Anthropic is used only as the frontier fallback/opt-in.

## Cost controls (built in)

- **Cheapest-first routing** (`config.ts`): open models via OpenRouter by default;
  frontier Claude never fires unless you opt in. Per-task tiering within a run —
  cheap model for extraction/pitch, design model for the build, vision model only
  for QA.
- **Prompt caching** (frontier path): the design-system prompt and review rubric
  are sent as a cached system prefix, billing repeat builds at ~0.1× input.
- Every run prints a **live cost report** (USD + AUD), with an unknown-model
  `FALLBACK_RATE` so env overrides still report indicative cost.

## Files

| File | Role |
|---|---|
| `run.ts` | Orchestrator CLI + cost report |
| `prospector.ts` | Find no-website businesses (Google Places v1 / sample) + scoring |
| `gatherer.ts` | Normalise photos/details |
| `builder.ts` | Bespoke site via the build model (cached design system) or template |
| `deployer.ts` | Write site locally; seam for Vercel/Cloudflare live deploy |
| `reviewer.ts` | Playwright desktop+mobile screenshots → vision-model QA |
| `pitcher.ts` | Personalised outreach email |
| `crm.ts` | Local-JSON CRM with dedupe + lapsed-lead detection |
| `config.ts` | Provider routing (OpenRouter-first), model ids, rates |
| `llm.ts` | OpenRouter + Anthropic wrapper: routing, caching, usage/cost tracking |

## Next steps to productionise

- Swap `deployer.ts` for a real Vercel/Cloudflare Pages deploy (free subdomains).
- Point `crm.ts` at Supabase (reuse the REST pattern in `lib/subscriptions.ts`).
- Send pitches via the Zoho transporter (see `app/api/audit/route.ts`) or an
  outreach tool; run the 5-touch sequence on a schedule.
- Gate runs behind an active subscription (the `subscriptions` entitlement store).
