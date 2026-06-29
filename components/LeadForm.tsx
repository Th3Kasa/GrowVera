"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

const CAL_URL = "https://cal.com/growvera";

type Status = "idle" | "submitting" | "done" | "error";

/**
 * Lead-capture form for GrowVera's own client acquisition. Posts to /api/lead
 * (which creates an Airtable record), then sends the prospect to the Cal.com
 * booking. Degrades gracefully: if the API isn't configured yet, it still routes
 * the lead to the booking page so no enquiry is lost.
 */
export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // Even if storage isn't configured, we still want to book the call.
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status >= 500) throw new Error(body.error || "Something went wrong.");
      }
      setStatus("done");
      setTimeout(() => { window.location.href = CAL_URL; }, 1400);
    } catch {
      // Don't lose the lead — send them to booking anyway.
      setStatus("done");
      setTimeout(() => { window.location.href = CAL_URL; }, 1400);
    }
  }

  const field: React.CSSProperties = {
    width: "100%",
    background: "#0E0E11",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "0.75rem",
    padding: "0.8rem 1rem",
    color: "#F4F4F1",
    fontSize: "0.95rem",
    outline: "none",
  };
  const label: React.CSSProperties = { fontSize: "0.78rem", color: "#A2A2A0", marginBottom: "0.35rem", display: "block" };

  if (status === "done") {
    return (
      <div style={{ background: "#131318", border: "1px solid rgba(52,211,153,0.35)", borderRadius: "1.25rem", padding: "2.5rem", textAlign: "center" }}>
        <CheckCircle size={40} weight="fill" style={{ color: "#34D399", marginBottom: "1rem" }} />
        <h3 style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#F4F4F1", marginBottom: "0.5rem" }}>You&apos;re in. 🎉</h3>
        <p style={{ color: "#A2A2A0", fontSize: "0.95rem", lineHeight: 1.6 }}>
          Taking you to the calendar to book your free call…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.25rem", padding: "clamp(1.5rem, 4vw, 2.25rem)" }}>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))" }}>
        <div>
          <label style={label} htmlFor="name">Your name *</label>
          <input style={field} id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label style={label} htmlFor="business">Business name *</label>
          <input style={field} id="business" name="business" required autoComplete="organization" />
        </div>
        <div>
          <label style={label} htmlFor="suburb">Suburb</label>
          <input style={field} id="suburb" name="suburb" placeholder="e.g. Cronulla" />
        </div>
        <div>
          <label style={label} htmlFor="trade">What do you do?</label>
          <input style={field} id="trade" name="trade" placeholder="e.g. Plumber, Real estate" />
        </div>
        <div>
          <label style={label} htmlFor="email">Email *</label>
          <input style={field} id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label style={label} htmlFor="phone">Phone</label>
          <input style={field} id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label style={label} htmlFor="website">Current website (if any)</label>
        <input style={field} id="website" name="website" placeholder="https://" />
      </div>

      {error && <p style={{ color: "#FCA5A5", fontSize: "0.85rem", marginTop: "1rem" }}>{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2"
        style={{ width: "100%", marginTop: "1.5rem", padding: "0.95rem 1.25rem", borderRadius: 999, fontSize: "0.9rem", fontWeight: 700, border: "none", background: "#34D399", color: "#06180F", cursor: status === "submitting" ? "wait" : "pointer" }}
      >
        {status === "submitting" ? "Sending…" : <>Get my free sample site <ArrowRight size={15} weight="bold" /></>}
      </button>
      <p style={{ fontSize: "0.72rem", color: "#6E6E72", textAlign: "center", marginTop: "0.85rem" }}>
        No obligation. We comply with the Australian Spam Act 2003.
      </p>
    </form>
  );
}
