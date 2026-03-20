"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { createItemSlug, formatPrice } from "@/lib/catalog-utils";

type Item = {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  type: string;
  description: string | null;
  sizes: string[];
  price: number | null;
};

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string | null;
  paymentProof: string | null;
  status: string;
};

type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

type Settings = {
  suitPricing: string;
  eveningPricing: string;
  giftCardEnabled: boolean;
  giftCardDenominations: string;
};

type FormState = {
  name: string;
  image: string;
  category: string;
  type: string;
  price: string;
};

const initialForm: FormState = {
  name: "",
  image: "",
  category: "suits",
  type: "ready",
  price: "",
};

function extractCategory(notes: string | null) {
  const match = notes?.match(/Category:\s*(.+)/i);
  return match?.[1]?.trim() ?? "Unspecified";
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file: File, category: string) {
  const fileData = await readFileAsDataUrl(file);
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: fileData,
      category,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error ?? "Upload failed");
  }

  return String(data.secure_url);
}

export function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [settings, setSettings] = useState<Settings>({
    suitPricing: "",
    eveningPricing: "",
    giftCardEnabled: true,
    giftCardDenominations: "50000,100000,200000,300000,500000,1000000",
  });
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin-auth");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  async function loadData() {
    setLoading(true);

    const responses = await Promise.all([
      fetch("/api/admin/items", { cache: "no-store" }),
      fetch("/api/admin/bookings", { cache: "no-store" }),
      fetch("/api/admin/subscribers", { cache: "no-store" }),
      fetch("/api/admin/settings", { cache: "no-store" }),
    ]);

    const [itemsResponse] = responses;
    const [itemsData, bookingsData, subscribersData, settingsData] = await Promise.all(
      responses.map((response) => response.json().catch(() => null))
    );

    if (!itemsResponse.ok) {
      setError(itemsData?.error ?? "Unable to load admin");
      setLoading(false);
      return;
    }

    setItems(itemsData?.items ?? []);
    setBookings(bookingsData?.bookings ?? []);
    setSubscribers(subscribersData?.subscribers ?? []);
    setSettings(
      settingsData?.settings ?? {
        suitPricing: "",
        eveningPricing: "",
        giftCardEnabled: true,
        giftCardDenominations: "50000,100000,200000,300000,500000,1000000",
      }
    );
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    if (!authorized) {
      return;
    }

    void loadData();
  }, [authorized]);

  const pendingBookings = useMemo(
    () => bookings.filter((booking) => booking.status.toLowerCase() === "pending"),
    [bookings]
  );

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setFile(null);
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let image = form.image;

      if (file) {
        image = await uploadImage(file, form.category);
      }

      const response = await fetch(
        editingId ? `/api/admin/items/${editingId}` : "/api/admin/items",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            image,
            slug: createItemSlug(form.name),
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to save item");
      }

      resetForm();
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save item");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    await fetch(`/api/admin/items/${id}`, { method: "DELETE" });
    await loadData();
  }

  async function updateBooking(id: string, status: string) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    await loadData();
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error ?? "Unable to save settings");
      setSaving(false);
      return;
    }

    setSaving(false);
  }

  if (!authorized || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm uppercase tracking-[0.24em] text-black/55">Loading admin...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {pathname === "/admin/dashboard" ? (
        <div className="space-y-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">Overview</p>
            <h1 className="display-title mt-2 text-4xl text-black md:text-5xl">dashboard</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="panel p-6">
              <p className="eyebrow">Products</p>
              <p className="display-title mt-3 text-5xl">{items.length}</p>
            </div>
            <div className="panel p-6">
              <p className="eyebrow">Bookings</p>
              <p className="display-title mt-3 text-5xl">{bookings.length}</p>
            </div>
            <div className="panel p-6">
              <p className="eyebrow">Subscribers</p>
              <p className="display-title mt-3 text-5xl">{subscribers.length}</p>
            </div>
            <div className="panel p-6">
              <p className="eyebrow">Pending</p>
              <p className="display-title mt-3 text-5xl">{pendingBookings.length}</p>
            </div>
          </div>
        </div>
      ) : null}

      {pathname === "/admin/products" ? (
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <form onSubmit={handleProductSubmit} className="panel space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Products</p>
                <h1 className="display-title mt-2 text-4xl">
                  {editingId ? "Edit product" : "Add product"}
                </h1>
              </div>
              {editingId ? (
                <button type="button" className="button-secondary" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
            <input
              className="field"
              value={form.name}
              placeholder="Product name"
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select
                className="field"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              >
                <option value="suits">suits</option>
                <option value="evening">evening</option>
                <option value="essentials">essentials</option>
              </select>
              <select
                className="field"
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
              >
                <option value="ready">ready</option>
                <option value="custom">custom</option>
                <option value="giftcard">giftcard</option>
              </select>
            </div>
            <input
              className="field"
              value={form.image}
              placeholder="Cloudinary URL"
              onChange={(event) => setForm({ ...form, image: event.target.value })}
            />
            <input
              type="file"
              className="field"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="field"
                  value={form.price}
                  placeholder="Price"
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                />
                <div className="field flex items-center text-sm text-[var(--color-muted)]">
                  Upload goes to Cloudinary
                </div>
            </div>
            <button className="button-primary w-full" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
          </form>

          <div className="panel p-6">
            <p className="eyebrow">Catalog</p>
            <h2 className="display-title mt-2 text-4xl">Baci Baci products</h2>
            <div className="mt-6 overflow-hidden border border-[var(--color-line)]">
              <div className="grid grid-cols-[92px_1.4fr_1fr_180px] border-b border-[var(--color-line)] bg-black px-4 py-3 text-xs uppercase tracking-[0.2em] text-white">
                <p>Image</p>
                <p>Name</p>
                <p>Category</p>
                <p>Actions</p>
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[92px_1.4fr_1fr_180px] items-center border-b border-[var(--color-line)] px-4 py-4 last:border-b-0"
                >
                  <div className="editorial-image relative aspect-square w-16">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : null}
                  </div>
                  <div className="pr-4">
                    <p className="text-sm uppercase tracking-[0.08em]">{item.name}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">{formatPrice(item.price)}</p>
                  </div>
                  <div className="text-sm uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    {item.category}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => {
                        setEditingId(item.id);
                        setForm({
                          name: item.name,
                          image: item.image,
                          category: item.category,
                          type: item.type,
                          price: item.price ? String(item.price) : "",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-primary"
                      onClick={() => void deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {pathname === "/admin/bookings" ? (
        <div className="panel p-6">
          <p className="eyebrow">Bookings</p>
          <h1 className="display-title mt-2 text-4xl">fitting requests</h1>
          <div className="mt-6 space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border-t border-[var(--color-line)] py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="display-title text-2xl">{booking.name}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {booking.email} • {booking.phone}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {extractCategory(booking.notes)} • {booking.date} • {booking.time}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">Status: {booking.status}</p>
                    {booking.paymentProof ? (
                      <Link
                        href={booking.paymentProof}
                        target="_blank"
                        className="mt-2 inline-block text-sm underline"
                      >
                        View payment proof
                      </Link>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => void updateBooking(booking.id, "confirmed")}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="button-primary"
                      onClick={() => void updateBooking(booking.id, "completed")}
                    >
                      Complete
                    </button>
                  </div>
                </div>
                {booking.notes ? (
                  <pre className="mt-3 whitespace-pre-wrap text-sm text-[var(--color-muted)]">
                    {booking.notes}
                  </pre>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {pathname === "/admin/subscribers" ? (
        <div className="panel p-6">
          <p className="eyebrow">Subscribers</p>
          <h1 className="display-title mt-2 text-4xl">newsletter list</h1>
          <div className="mt-6 overflow-hidden border border-[var(--color-line)]">
            <div className="grid grid-cols-[1.5fr_1fr] border-b border-[var(--color-line)] bg-black px-4 py-3 text-xs uppercase tracking-[0.2em] text-white">
              <p>Email</p>
              <p>Created</p>
            </div>
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="grid grid-cols-[1.5fr_1fr] border-b border-[var(--color-line)] px-4 py-4 last:border-b-0"
              >
                <p className="text-sm uppercase tracking-[0.08em]">{subscriber.email}</p>
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {new Date(subscriber.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {pathname === "/admin/settings" ? (
        <form onSubmit={saveSettings} className="panel max-w-2xl space-y-4 p-6">
          <div>
            <p className="eyebrow">Settings</p>
            <h1 className="display-title mt-2 text-4xl">pricing controls</h1>
          </div>
          <input
            className="field"
            value={settings.suitPricing}
            placeholder="Suit pricing"
            onChange={(event) =>
              setSettings({ ...settings, suitPricing: event.target.value })
            }
          />
          <input
            className="field"
            value={settings.eveningPricing}
            placeholder="Evening pricing"
            onChange={(event) =>
              setSettings({ ...settings, eveningPricing: event.target.value })
            }
          />
          <label className="flex items-center gap-3 text-sm uppercase tracking-[0.16em]">
            <input
              type="checkbox"
              checked={settings.giftCardEnabled}
              onChange={(event) =>
                setSettings({ ...settings, giftCardEnabled: event.target.checked })
              }
            />
            Enable gift card
          </label>
          <input
            className="field"
            value={settings.giftCardDenominations}
            placeholder="Gift card denominations"
            onChange={(event) =>
              setSettings({ ...settings, giftCardDenominations: event.target.value })
            }
          />
          <button className="button-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
