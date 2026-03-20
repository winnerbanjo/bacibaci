import Image from "next/image";
import Link from "next/link";

import { SectionReveal } from "@/components/section-reveal";
import { WHATSAPP_NUMBER } from "@/lib/brand";
import { getDisplayItems } from "@/lib/catalog";

export default async function SuitsPage() {
  const items = await getDisplayItems("suits");

  return (
    <section className="section-space">
      <div className="shell">
        <SectionReveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">suits</p>
            <h1 className="display-title mt-3 text-6xl sm:text-7xl">
              architected tailoring
            </h1>
          </div>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-neutral-600">
            Built with precision. Every piece is measured, refined, and structured to hold its form.
          </p>
        </SectionReveal>
        <div className="grid grid-cols-2 gap-4 md:gap-10">
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
                <div className="mt-5 flex flex-col items-start gap-3">
                  <div>
                    <h2 className="display-title text-xl sm:text-4xl">{item.name}</h2>
                  </div>
                  <Link
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `I want to order ${item.name}`
                    )}`}
                    target="_blank"
                    className="button-primary w-full sm:w-auto"
                  >
                    Request This Suit
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
