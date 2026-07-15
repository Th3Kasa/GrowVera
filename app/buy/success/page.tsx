import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { getStripe } from "@/lib/stripe";
import ManageBilling from "@/components/ManageBilling";

export const metadata: Metadata = {
  title: "You're in — GrowVera",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let email: string | null = null;
  let customerId: string | null = null;

  const stripe = getStripe();
  if (stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? null;
      customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    } catch {
      // Invalid/expired session id — still show a generic confirmation.
    }
  }

  return (
    <main style={{ background: "#08080A", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "34rem", width: "100%", textAlign: "center", background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.5rem", padding: "clamp(2rem, 5vw, 3.5rem)" }}>
        <div style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
          <CheckCircle size={48} weight="fill" style={{ color: "#34D399" }} />
        </div>
        <h1 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, color: "#F4F4F1", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
          You&apos;re in. Welcome aboard.
        </h1>
        <p style={{ fontSize: "1rem", color: "#A2A2A0", lineHeight: 1.7, marginBottom: "2rem" }}>
          {email ? <>We&apos;ve sent your onboarding details to <strong style={{ color: "#F4F4F1" }}>{email}</strong>. </> : null}
          We&apos;re getting your setup ready. We&apos;ll be in touch shortly to walk through how it works and get your approval before anything goes live.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{ background: "#34D399", color: "#06180F", padding: "0.75rem 1.5rem", borderRadius: 999, fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}
          >
            Back to home
          </Link>
          {customerId && <ManageBilling customerId={customerId} />}
        </div>
      </div>
    </main>
  );
}
