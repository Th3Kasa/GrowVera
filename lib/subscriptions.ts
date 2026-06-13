/**
 * Entitlement persistence. Upserts subscription state into a Supabase
 * `subscriptions` table via the REST API (no extra dependency). If Supabase env
 * vars are absent, it logs instead — so the webhook works end-to-end in dev
 * before Supabase is wired up.
 *
 * Suggested table (SQL):
 *   create table subscriptions (
 *     stripe_subscription_id text primary key,
 *     stripe_customer_id     text,
 *     customer_email         text,
 *     tier                   text,
 *     status                 text,          -- active | trialing | past_due | canceled | ...
 *     current_period_end     timestamptz,
 *     updated_at             timestamptz default now()
 *   );
 */

export interface SubscriptionRecord {
  stripe_subscription_id: string;
  stripe_customer_id?: string | null;
  customer_email?: string | null;
  tier?: string | null;
  status: string;
  current_period_end?: string | null;
}

export async function upsertSubscription(record: SubscriptionRecord): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.log("[subscriptions] (no Supabase configured) would upsert:", record);
    return;
  }

  const res = await fetch(`${url}/rest/v1/subscriptions?on_conflict=stripe_subscription_id`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ ...record, updated_at: new Date().toISOString() }),
  });

  if (!res.ok) {
    console.error("[subscriptions] upsert failed:", res.status, await res.text());
  }
}

/** True when the subscription status grants product access. */
export function isEntitled(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}
