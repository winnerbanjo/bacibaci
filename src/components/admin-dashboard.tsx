"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { createItemSlug, formatPrice } from "@/lib/catalog";

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
};

type FormState = {
  name: string;
  slug: string;
  image: string;
  category: string;
  type: string;
  description: string;
  price: string;
  sizes: string;
};

const initialForm: FormState = {
  name: "",
  slug: "",
  image: "",
  category: "suits",
  type: "custom",
  description: "",
  price: "",
  sizes: "",
};

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Settings" },
];

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
            slug: form.slug || createItemSlug(form.name),
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
    return <div className="shell section-space">Loading admin...</div>;
  }

  return (
    <section className="section-space">
      <div className="shell grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="panel h-fit p-6">
          <p className="eyebrow">bacibaci admin</p>
          <nav className="mt-6 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block border px-4 py-3 text-sm uppercase tracking-[0.22em] ${
                  pathname === link.href
                    ? "border-black bg-black text-white"
                    : "border-[var(--color-line)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {pathname === "/admin/dashboard" ? (
            <div className="grid gap-4 md:grid-cols-4">
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
          ) : null}

          {pathname === "/admin/products" ? (
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
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
                      slug: createItemSlug(event.target.value),
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
                    <option value="custom">custom</option>
                    <option value="ready">ready</option>
                  </select>
                </div>
                <input
                  className="field"
                  value={form.slug}
                  placeholder="Slug"
                  onChange={(event) => setForm({ ...form, slug: event.target.value })}
                />
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
                  <input
                    className="field"
                    value={form.sizes}
                    placeholder="Sizes (S, M, L)"
                    onChange={(event) => setForm({ ...form, sizes: event.target.value })}
                  />
                </div>
                <textarea
                  className="field min-h-32"
                  value={form.description}
                  placeholder="Description"
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
                <button className="button-primary w-full" type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                </button>
              </form>

              <div className="panel p-6">
                <p className="eyebrow">Catalog</p>
                <h2 className="display-title mt-2 text-4xl">bacibaci products</h2>
                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-4 border-t border-[var(--color-line)] py-4 md:grid-cols-[96px_1fr_auto]"
                    >
                      <div className="editorial-image relative aspect-square">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="eyebrow">
                          {item.category} • {item.type}
                        </p>
                        <p className="display-title mt-1 text-3xl">{item.name}</p>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          className="button-secondary"
                          onClick={() => {
                            setEditingId(item.id);
                            setForm({
                              name: item.name,
                              slug: item.slug,
                              image: item.image,
                              category: item.category,
                              type: item.type,
                              description: item.description ?? "",
                              price: item.price ? String(item.price) : "",
                              sizes: item.sizes.join(", "),
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
                          {booking.service} • {booking.date} • {booking.time}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          Status: {booking.status}
                        </p>
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
              <div className="mt-6 space-y-4">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="border-t border-[var(--color-line)] py-4">
                    <p className="text-sm uppercase tracking-[0.18em]">{subscriber.email}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
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
              <button className="button-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
}
