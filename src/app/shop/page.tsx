import Image from "next/image";
import Link from "next/link";

import { WHATSAPP_NUMBER } from "@/lib/brand";
import { getShopItems } from "@/lib/local-images";

export default async function ShopPage() {
  const items = await getShopItems();

  return (
    <section className="section-space">
      <div className="shell">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">shop</p>
            <h1 className="display-title mt-3 text-6xl sm:text-7xl">essential wardrobe</h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            A clean essentials listing with direct WhatsApp ordering.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="group">
              <div className="editorial-image aspect-[4/5]">
                <Image src={item.src} alt={item.name} fill className="object-cover transition-all duration-300 group-hover:scale-[1.02]" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">shop</p>
                  <h2 className="display-title mt-2 text-3xl">{item.name}</h2>
                </div>
                <Link
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`I want to order ${item.name}`)}`}
                  target="_blank"
                  className="button-primary"
                >
                  Order Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
