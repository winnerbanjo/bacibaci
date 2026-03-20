import Image from "next/image";
import Link from "next/link";

import { SectionReveal } from "@/components/section-reveal";
import { WHATSAPP_NUMBER } from "@/lib/brand";
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
                  <h2 className="display-title text-xl sm:text-4xl">{item.name}</h2>
                  <Link
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `I want to order ${item.name}`
                    )}`}
                    target="_blank"
                    className="button-primary w-full sm:w-auto"
                  >
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
