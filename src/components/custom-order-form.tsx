import Link from "next/link";

import { WHATSAPP_NUMBER } from "@/lib/brand";

export function CustomOrderForm() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "I want to order a custom piece"
  )}`;

  return (
    <div className="panel space-y-4 p-6 sm:p-8">
      <div>
        <p className="eyebrow">custom</p>
        <h2 className="display-title mt-2 text-4xl">Start custom order</h2>
      </div>
      <p className="max-w-sm text-[15px] leading-relaxed text-neutral-600">
        Send your measurements or notes directly through WhatsApp and our team will guide the order.
      </p>
      <Link href={whatsappHref} target="_blank" className="button-primary w-full">
        Start Custom Order
      </Link>
    </div>
  );
}
