import Image from "next/image";
import Link from "next/link";

import { SectionReveal } from "@/components/section-reveal";
import { SizeGuide } from "@/components/size-guide";
import { formatPrice } from "@/lib/catalog-utils";
import { getDisplayItems } from "@/lib/catalog";

export default async function ShopPage() {
  const items = await getDisplayItems("essentials");

  return (
    <section className="section-space">
      <div className="shell">
        <SectionReveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">shop</p>
            <h1 className="display-title mt-3 text-6xl sm:text-7xl">essential wardrobe</h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            A clean essentials listing with a dedicated checkout flow.
          </p>
        </SectionReveal>
        <SectionReveal className="mb-10">
          <SizeGuide description="Review the bacibaci size chart before choosing a ready-to-order essentials piece." />
        </SectionReveal>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <SectionReveal key={item.slug}>
            <article className="group">
              <div className="editorial-image aspect-[4/5]">
                <Image src={item.image} alt={item.name} fill className="object-cover object-[center_top] transition-all duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="display-title text-3xl">{item.name}</h2>
                  <p className="mt-3 text-sm text-[var(--color-muted)]">{formatPrice(item.price)}</p>
                </div>
                <Link href={`/essentials/${item.slug}`} className="button-primary">
                  Order Now
                </Link>
              </div>
            </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
