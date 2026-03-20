"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type BookingFormProps = {
  title: string;
  buttonLabel: string;
  defaultService: string;
  defaultType: string;
  productName?: string;
  includeMeasurements?: boolean;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  height: string;
  chest: string;
  waist: string;
  shoulder: string;
  fitChoice: string;
  size: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  notes: "",
  height: "",
  chest: "",
  waist: "",
  shoulder: "",
  fitChoice: "size",
  size: "",
};

export function BookingForm({
  title,
  buttonLabel,
  defaultService,
  defaultType,
  productName,
  includeMeasurements = false,
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
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
      includeMeasurements ? `Fit choice: ${form.fitChoice}` : "",
      includeMeasurements && form.size ? `Selected size: ${form.size}` : "",
      includeMeasurements && form.height ? `Height: ${form.height}` : "",
      includeMeasurements && form.chest ? `Chest: ${form.chest}` : "",
      includeMeasurements && form.waist ? `Waist: ${form.waist}` : "",
      includeMeasurements && form.shoulder ? `Shoulder: ${form.shoulder}` : "",
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
        name: form.name,
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

    setMessage("Your request has been sent.");
    setForm(initialState);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 p-6 sm:p-8">
      <div>
        <p className="eyebrow">Appointment</p>
        <h2 className="display-title mt-2 text-4xl">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="field"
          placeholder="Full name"
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          className="field"
          placeholder="Email address"
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          className="field"
          placeholder="Phone number"
          required
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
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
        {includeMeasurements ? (
          <select
            className="field"
            value={form.fitChoice}
            onChange={(event) => setForm({ ...form, fitChoice: event.target.value })}
          >
            <option value="size">Select size</option>
            <option value="custom">Custom fit</option>
          </select>
        ) : null}
      </div>
      {includeMeasurements ? (
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="field"
            placeholder="Preferred size"
            value={form.size}
            onChange={(event) => setForm({ ...form, size: event.target.value })}
          />
          <input
            className="field"
            placeholder="Height"
            value={form.height}
            onChange={(event) => setForm({ ...form, height: event.target.value })}
          />
          <input
            className="field"
            placeholder="Chest"
            value={form.chest}
            onChange={(event) => setForm({ ...form, chest: event.target.value })}
          />
          <input
            className="field"
            placeholder="Waist"
            value={form.waist}
            onChange={(event) => setForm({ ...form, waist: event.target.value })}
          />
          <input
            className="field md:col-span-2"
            placeholder="Shoulder"
            value={form.shoulder}
            onChange={(event) => setForm({ ...form, shoulder: event.target.value })}
          />
        </div>
      ) : null}
      <textarea
        className="field min-h-32"
        placeholder="Notes"
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
