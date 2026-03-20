import Image from "next/image";
import Link from "next/link";

import { SectionReveal } from "@/components/section-reveal";
import { getDisplayItems } from "@/lib/catalog";

export default async function EveningPage() {
  const items = await getDisplayItems("evening");

  return (
    <section className="section-space">
      <div className="shell">
        <SectionReveal className="mb-10">
          <p className="eyebrow">evening</p>
          <h1 className="display-title mt-3 text-6xl sm:text-7xl">
            controlled after dark
          </h1>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-neutral-600">
            Designed for presence. Clean lines, balanced proportions, and a quiet finish.
          </p>
        </SectionReveal>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <SectionReveal key={item.slug}>
            <article className="group">
              <div className="editorial-image aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-[center_top] transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="mt-4">
                <p className="eyebrow">evening</p>
                <h2 className="display-title mt-2 text-4xl">{item.name}</h2>
                <Link href={`/book-fitting?look=${item.slug}`} className="button-primary mt-5">
                  Request This Look
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
