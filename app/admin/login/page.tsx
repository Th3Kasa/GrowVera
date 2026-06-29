"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: "#08080A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: "22rem", background: "#131318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.25rem", padding: "2rem" }}>
        <p style={{ fontFamily: "var(--font-cabinet)", fontSize: "1.4rem", fontWeight: 800, color: "#F4F4F1", marginBottom: "0.4rem" }}>GrowVera Admin</p>
        <p style={{ fontSize: "0.85rem", color: "#A2A2A0", marginBottom: "1.5rem" }}>Enter your password to continue.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "#0E0E11", border: "1px solid rgba(255,255,255,0.12)", color: "#F4F4F1", fontSize: "0.9rem", marginBottom: "0.85rem" }}
        />
        {error && <p style={{ fontSize: "0.8rem", color: "#F87171", marginBottom: "0.85rem" }}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          style={{ width: "100%", padding: "0.8rem", borderRadius: "999px", background: "#34D399", color: "#06180F", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
