import Image from "next/image";
import Link from "next/link";

import { HeroSlider } from "@/components/HeroSlider";
import { SectionReveal } from "@/components/section-reveal";
import { getDisplayItems } from "@/lib/catalog";
import { getFrontpageImages } from "@/lib/local-images";

export default async function HomePage() {
  const [frontImages, suits, evening, essentials] = await Promise.all([
    getFrontpageImages(4),
    getDisplayItems("suits"),
    getDisplayItems("evening"),
    getDisplayItems("essentials"),
  ]);

  const heroImages = frontImages.map((item) => item.src);

  const sections = [
    {
      key: "suits",
      title: "suits",
      copy: "Built with precision. Every piece is measured, refined, and structured to hold its form.",
      href: "/suits",
      cta: "Request",
      items: suits.slice(0, 2),
    },
    {
      key: "evening",
      title: "evening",
      copy: "Designed for presence. Clean lines, balanced proportions, and a quiet finish.",
      href: "/evening",
      cta: "View",
      items: evening.slice(0, 2),
    },
    {
      key: "essentials",
      title: "essentials",
      copy: "Daily structure. Refined basics made to sit right, wear well, and last.",
      href: "/essentials",
      cta: "Shop",
      items: essentials.slice(0, 2),
    },
  ];

  return (
    <>
      <HeroSlider images={heroImages} />

      {sections.map((section) => (
        <section key={section.key} className="section-space">
          <div className="shell px-6 md:px-16">
            <SectionReveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">{section.title}</p>
                <h2 className="display-title mt-3 text-5xl lowercase sm:text-6xl">
                  {section.title}
                </h2>
              </div>
              <div className="max-w-sm">
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                  {section.copy}
                </p>
                <Link href={section.href} className="button-secondary mt-6">
                  {section.cta}
                </Link>
              </div>
            </SectionReveal>

            <div className="grid gap-6 md:grid-cols-2">
              {section.items.map((item) => (
                <SectionReveal key={item.slug}>
                  <article className="group">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        quality={100}
                        className="object-cover object-[center_top] transition-all duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="mb-4 mt-12">
                      <h3 className="display-title text-3xl">{item.name}</h3>
                    </div>
                  </article>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
