"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { formatPrice } from "@/lib/catalog-utils";
import { SizeGuide } from "@/components/size-guide";

const sizes = ["S", "M", "L", "XL"];

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

async function uploadReceipt(file: File) {
  const fileData = await readFileAsDataUrl(file);
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: fileData,
      category: "orders",
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error ?? "Unable to upload receipt");
  }

  return String(data.secure_url);
}

export function EssentialsOrderPanel({
  product,
  bankDetails,
}: {
  product: {
    name: string;
    slug: string;
    price: number | null;
  };
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      let receiptImage = "";

      if (file) {
        receiptImage = await uploadReceipt(file);
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          product: product.name,
          productSlug: product.slug,
          size: selectedSize,
          quantity,
          receiptImage,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to place order");
      }

      setMessage("Your order has been received. We will confirm shortly.");
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
      setFile(null);
      setQuantity(1);
      setSelectedSize("M");
      setShowPayment(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel space-y-6 p-6 sm:p-8">
      <div>
        <p className="eyebrow">essentials</p>
        <h1 className="display-title mt-3 text-4xl sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
          {formatPrice(product.price)}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-black/55">Select size</p>
          <div className="grid grid-cols-4 gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`border px-4 py-3 text-sm uppercase tracking-[0.18em] ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-[var(--color-line)] bg-white text-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <SizeGuide
          title="Find your size"
          description="Use the bacibaci size guide before selecting your essentials size."
        />

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-black/55">Quantity</p>
          <div className="flex items-center border border-[var(--color-line)] bg-white">
            <button
              type="button"
              className="w-14 py-3 text-lg"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              -
            </button>
            <div className="flex-1 border-x border-[var(--color-line)] py-3 text-center text-sm uppercase tracking-[0.18em]">
              {quantity}
            </div>
            <button
              type="button"
              className="w-14 py-3 text-lg"
              onClick={() => setQuantity((current) => current + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button type="button" className="button-primary w-full" onClick={() => setShowPayment(true)}>
        Order Now
      </button>

      {showPayment ? (
        <form onSubmit={handleSubmit} className="space-y-5 border-t border-[var(--color-line)] pt-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-black/55">Payment option</p>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                Bank transfer with receipt upload.
              </p>
            </div>
            <div className="grid gap-3 border border-[var(--color-line)] bg-white p-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-black/55">Account Name</span>
                <span className="font-medium">{bankDetails.accountName}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-black/55">Account Number</span>
                <span className="font-medium">{bankDetails.accountNumber}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-black/55">Bank Name</span>
                <span className="font-medium">{bankDetails.bankName}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="field"
              placeholder="Name"
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
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
              placeholder="Phone"
              required
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
            <input className="field" value={selectedSize} readOnly aria-label="Selected size" />
          </div>

          <textarea
            className="field min-h-28"
            placeholder="Address"
            required
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
          />

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.22em] text-black/55">Upload receipt</label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="field"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm">{message}</p> : null}

          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? "Submitting..." : "Order Now"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
