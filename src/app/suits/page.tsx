import Image from "next/image";
import Link from "next/link";

import { getLocalCategoryItems } from "@/lib/local-images";

export default async function SuitsPage() {
  const items = await getLocalCategoryItems("suits");

  return (
    <section className="section-space">
      <div className="shell">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">suits</p>
            <h1 className="display-title mt-3 text-6xl sm:text-7xl">
              architected tailoring
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Local bacibaci suit imagery loaded directly from /public/images/suits.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.slug} className="group">
              <div className="editorial-image aspect-[4/5]">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">suits</p>
                  <h2 className="display-title mt-2 text-4xl">{item.name}</h2>
                </div>
                <Link href={`/products/${item.slug}`} className="button-primary">
                  Request This Suit
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
