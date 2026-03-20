"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error ?? "Unable to subscribe");
      setLoading(false);
      return;
    }

    setMessage("Subscribed.");
    setEmail("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <input
        className="field"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button type="submit" className="button-primary w-full" disabled={loading}>
        {loading ? "Joining..." : "Join the list"}
      </button>
      {message ? <p className="text-xs uppercase tracking-[0.18em]">{message}</p> : null}
      {error ? <p className="text-xs uppercase tracking-[0.18em] text-red-600">{error}</p> : null}
    </form>
  );
}
