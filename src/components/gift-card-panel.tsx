"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

import { WHATSAPP_NUMBER } from "@/lib/brand";

type GiftCardPanelProps = {
  denominations: number[];
};

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function GiftCardPanel({ denominations }: GiftCardPanelProps) {
  const [selected, setSelected] = useState(denominations[0] ?? 50000);
  const [sendAsGift, setSendAsGift] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");

  const whatsappHref = useMemo(() => {
    const extra = sendAsGift
      ? ` for ${recipientName || "recipient"} (${recipientEmail || "no email supplied"})${message ? `. Message: ${message}` : ""}`
      : "";

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `I want to buy a gift card of ₦${selected}${extra}`
    )}`;
  }, [message, recipientEmail, recipientName, selected, sendAsGift]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div className="panel overflow-hidden">
        <div className="relative aspect-[4/5]">
          <Image src="/images/logo.png" alt="BACI BACI gift card" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <p className="eyebrow">gift card</p>
          <h1 className="display-title mt-2 text-5xl sm:text-6xl">Baci Baci Gift Card</h1>
          <p className="mt-4 text-2xl">{formatNaira(selected)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {denominations.map((amount) => {
            const active = amount === selected;

            return (
              <button
                key={amount}
                type="button"
                onClick={() => setSelected(amount)}
                className={`border px-4 py-4 text-sm transition-all duration-300 hover:scale-[1.02] ${
                  active ? "border-black bg-black text-white" : "border-[var(--color-line)] bg-white"
                }`}
              >
                {formatNaira(amount)}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-3 text-sm uppercase tracking-[0.16em]">
          <input
            type="checkbox"
            checked={sendAsGift}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSendAsGift(event.target.checked)}
          />
          I want to send this as a gift
        </label>
        {sendAsGift ? (
          <div className="space-y-3">
            <input className="field" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient name" />
            <input className="field" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Recipient email" type="email" />
            <textarea className="field min-h-28" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href={whatsappHref} target="_blank" className="button-primary w-full">
            Add to Cart
          </Link>
          <Link href={whatsappHref} target="_blank" className="button-secondary w-full">
            Buy It Now
          </Link>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[rgba(245,243,239,0.98)] p-4 backdrop-blur md:hidden">
        <Link href={whatsappHref} target="_blank" className="button-primary w-full">
          Buy Gift Card {formatNaira(selected)}
        </Link>
      </div>
    </div>
  );
}
