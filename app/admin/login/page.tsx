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
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: "22rem", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "1.25rem", padding: "2rem" }}>
        <p style={{ fontFamily: "var(--font-cabinet)", fontSize: "1.4rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.4rem" }}>GrowVera Admin</p>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>Enter your password to continue.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", background: "var(--color-bg-section)", border: "1px solid var(--color-white-12)", color: "var(--color-text)", fontSize: "0.9rem", marginBottom: "0.85rem" }}
        />
        {error && <p style={{ fontSize: "0.8rem", color: "var(--color-danger)", marginBottom: "0.85rem" }}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          style={{ width: "100%", padding: "0.8rem", borderRadius: "999px", background: "var(--color-accent)", color: "var(--color-on-accent)", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
