import Image from "next/image";
import Link from "next/link";

import { getLocalCategoryItems } from "@/lib/local-images";

export default async function EveningPage() {
  const items = await getLocalCategoryItems("evening");

  return (
    <section className="section-space">
      <div className="shell">
        <div className="mb-10">
          <p className="eyebrow">evening</p>
          <h1 className="display-title mt-3 text-6xl sm:text-7xl">
            controlled after dark
          </h1>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="group">
              <div className="editorial-image aspect-[4/5]">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
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
          ))}
        </div>
      </div>
    </section>
  );
}
