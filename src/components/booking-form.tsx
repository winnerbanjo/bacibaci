"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type BookingFormProps = {
  title: string;
  buttonLabel: string;
  defaultService: string;
  defaultType: string;
  productName?: string;
  defaultCategory?: string;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  date: string;
  time: string;
  consultationType: string;
  notes: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  category: "Suits",
  date: "",
  time: "",
  consultationType: "Virtual",
  notes: "",
};

export function BookingForm({
  title,
  buttonLabel,
  defaultService,
  defaultType,
  productName,
  defaultCategory = "Suits",
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>({ ...initialState, category: defaultCategory });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const notes = [
      productName ? `Product: ${productName}` : "",
      `Category: ${form.category}`,
      `Consultation Type: ${form.consultationType}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        date: form.date,
        time: form.time,
        service: defaultService,
        type: defaultType,
        notes,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error ?? "Unable to send request");
      setLoading(false);
      return;
    }

    setMessage("Your request has been received. Our team will contact you shortly.");
    setForm({ ...initialState, category: defaultCategory });
    setLoading(false);
  }

  return (
    <form id="request-form" onSubmit={handleSubmit} className="panel space-y-5 p-6 sm:p-8">
      <div>
        <p className="eyebrow">Appointment</p>
        <h2 className="display-title mt-2 text-4xl">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="field"
          placeholder="Full Name"
          required
          value={form.fullName}
          onChange={(event) => setForm({ ...form, fullName: event.target.value })}
        />
        <input
          className="field"
          placeholder="Email"
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          className="field"
          placeholder="Phone Number"
          required
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <select
          className="field"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        >
          <option value="Suits">Suits</option>
          <option value="Evening">Evening</option>
          <option value="Essentials">Essentials</option>
          <option value="Custom">Custom</option>
        </select>
        <input
          className="field"
          required
          type="date"
          value={form.date}
          onChange={(event) => setForm({ ...form, date: event.target.value })}
        />
        <input
          className="field"
          required
          type="time"
          value={form.time}
          onChange={(event) => setForm({ ...form, time: event.target.value })}
        />
        <select
          className="field"
          value={form.consultationType}
          onChange={(event) => setForm({ ...form, consultationType: event.target.value })}
        >
          <option value="Virtual">Virtual</option>
          <option value="Physical">Physical</option>
        </select>
      </div>
      <textarea
        className="field min-h-32"
        placeholder="Additional Notes"
        value={form.notes}
        onChange={(event) => setForm({ ...form, notes: event.target.value })}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm">{message}</p> : null}
      <button type="submit" className="button-primary w-full" disabled={loading}>
        {loading ? "Sending..." : buttonLabel}
      </button>
    </form>
  );
}
