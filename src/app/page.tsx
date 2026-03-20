import Image from "next/image";
import Link from "next/link";

import { getHeroImage, getLocalCategoryItems } from "@/lib/local-images";

export default async function HomePage() {
  const [heroImage, suits, evening, essentials] = await Promise.all([
    getHeroImage(),
    getLocalCategoryItems("suits"),
    getLocalCategoryItems("evening"),
    getLocalCategoryItems("essentials"),
  ]);

  const featured = [
    { href: "/suits", label: "suits", item: suits[0] },
    { href: "/evening", label: "evening", item: evening[0] },
    { href: "/essentials", label: "essentials", item: essentials[0] },
  ];

  return (
    <>
      <section className="relative min-h-[calc(100vh-81px)] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="bacibaci hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" />
        <div className="shell relative flex min-h-[calc(100vh-81px)] items-end py-16 text-white">
          <div className="max-w-3xl">
            <p className="eyebrow text-white/70">editorial tailoring</p>
            <h1 className="display-title mt-4 text-7xl lowercase sm:text-8xl md:text-9xl">
              bacibaci
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/82 sm:text-xl">
              refined form. controlled presence.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/custom" className="button-primary">
                Start Your Fit
              </Link>
              <Link href="/gift-card" className="button-secondary border-white/30 bg-white/10 text-white">
                Gift Card
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Editorial grid</p>
              <h2 className="display-title mt-3 text-5xl sm:text-6xl">
                built around silhouette
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
              bacibaci is focused only on suits, evening wear, and essentials.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((entry) => (
              <article key={entry.label} className="group space-y-4">
                <div className="editorial-image aspect-[4/5]">
                  {entry.item ? (
                    <Image
                      src={entry.item.src}
                      alt={entry.item.name}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">{entry.label}</p>
                    <h3 className="display-title mt-2 text-4xl lowercase">{entry.label}</h3>
                  </div>
                  <Link href={entry.href} className="button-secondary">
                    Explore
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
