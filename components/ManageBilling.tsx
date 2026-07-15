"use client";

import { useState } from "react";

export default function ManageBilling({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);

  async function open() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={open}
      disabled={loading}
      style={{ background: "transparent", color: "var(--color-accent)", border: "1px solid var(--color-accent-border-strong)", padding: "0.75rem 1.5rem", borderRadius: 999, fontSize: "0.85rem", fontWeight: 600, cursor: loading ? "wait" : "pointer" }}
    >
      {loading ? "Opening…" : "Manage billing"}
    </button>
  );
}
