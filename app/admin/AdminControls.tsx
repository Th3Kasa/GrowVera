"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminControls({ initialEnabled }: { initialEnabled: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !enabled;
    try {
      const res = await fetch("/api/admin/outreach-toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      const data = await res.json().catch(() => ({}));
      setEnabled(!!data.enabled);
    } catch {
      /* keep previous state on error */
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
      <button
        onClick={toggle}
        disabled={busy}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.55rem 1rem", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 700,
          border: "1px solid " + (enabled ? "rgba(52,211,153,0.5)" : "rgba(248,113,113,0.5)"),
          background: enabled ? "rgba(52,211,153,0.12)" : "var(--color-danger-soft)",
          color: enabled ? "var(--color-accent)" : "var(--color-danger)", cursor: busy ? "default" : "pointer",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 999, background: enabled ? "var(--color-accent)" : "var(--color-danger)" }} />
        Outreach {enabled ? "ON" : "OFF"} — {enabled ? "click to pause" : "click to enable"}
      </button>
      <button onClick={signOut} style={{ padding: "0.55rem 1rem", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600, border: "1px solid var(--color-border-strong)", background: "transparent", color: "var(--color-text-muted)", cursor: "pointer" }}>
        Sign out
      </button>
    </div>
  );
}
