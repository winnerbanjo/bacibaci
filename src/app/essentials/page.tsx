import Image from "next/image";
import Link from "next/link";

import { SectionReveal } from "@/components/section-reveal";
import { SizeGuide } from "@/components/size-guide";
import { formatPrice } from "@/lib/catalog-utils";
import { getDisplayItems } from "@/lib/catalog";

export default async function EssentialsPage() {
  const items = await getDisplayItems("essentials");

  return (
    <section className="section-space">
      <div className="shell">
        <SectionReveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">essentials</p>
            <h1 className="display-title mt-3 text-6xl sm:text-7xl">
              everyday precision
            </h1>
          </div>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-neutral-600">
            Daily structure. Refined basics made to sit right, wear well, and last.
          </p>
        </SectionReveal>
        <SectionReveal className="mb-10">
          <SizeGuide description="Use the bacibaci chart before opening any essentials product page." />
        </SectionReveal>
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {items.map((item) => (
            <SectionReveal key={item.slug}>
              <article className="group">
                <div className="editorial-image aspect-[4/5]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-[center_top] transition-all duration-300"
                    sizes="(max-width: 768px) 50vw, 50vw"
                  />
                </div>
                <div className="mt-4 flex flex-col items-start gap-3">
                  <div>
                    <h2 className="display-title text-xl sm:text-3xl">{item.name}</h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{formatPrice(item.price)}</p>
                  </div>
                  <Link href={`/essentials/${item.slug}`} className="button-primary w-full sm:w-auto">
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
