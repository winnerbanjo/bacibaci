"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export function CustomOrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email: "custom@bacibaci.co",
        phone,
        date: new Date().toISOString().slice(0, 10),
        time: "00:00",
        service: "custom order",
        type: "custom",
        notes: `Measurement: ${measurement}\nNotes: ${notes}`.trim(),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error ?? "Unable to start custom order");
      setLoading(false);
      return;
    }

    setMessage("Your custom order request has been sent.");
    setName("");
    setPhone("");
    setMeasurement("");
    setNotes("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-4 p-6 sm:p-8">
      <div>
        <p className="eyebrow">custom</p>
        <h2 className="display-title mt-2 text-4xl">Start custom order</h2>
      </div>
      <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
      <textarea
        className="field min-h-28"
        value={measurement}
        onChange={(e) => setMeasurement(e.target.value)}
        placeholder="Measurement"
      />
      <textarea
        className="field min-h-32"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm">{message}</p> : null}
      <button className="button-primary w-full" disabled={loading}>
        {loading ? "Sending..." : "Start Custom Order"}
      </button>
    </form>
  );
}
