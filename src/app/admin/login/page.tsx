"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      localStorage.setItem("admin-auth", "true");
      router.push("/admin");
      return;
    }

    setError(data?.error ?? "Wrong passcode");
    setLoading(false);
  }

  return (
    <section className="section-space">
      <div className="shell flex min-h-[70vh] items-center justify-center">
        <div className="panel w-full max-w-md space-y-5 p-8">
          <p className="eyebrow">admin</p>
          <h1 className="display-title text-5xl">Baci Baci</h1>
          <input
            className="field"
            type="password"
            placeholder="Enter admin passcode"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="button" className="button-primary w-full" onClick={() => void handleLogin()} disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </button>
        </div>
      </div>
    </section>
  );
}
