import Image from "next/image";
import Link from "next/link";

import { getManItems } from "@/lib/local-images";

export default async function ManPage() {
  const items = await getManItems();

  return (
    <section className="section-space">
      <div className="shell">
        <p className="eyebrow">baci baci man</p>
        <h1 className="display-title mt-3 text-6xl sm:text-7xl">suits and mens essentials</h1>
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="group">
              <div className="editorial-image aspect-[4/5]">
                <Image src={item.src} alt={item.name} fill className="object-cover transition-all duration-300 group-hover:scale-[1.02]" sizes="33vw" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{item.category}</p>
                  <h2 className="display-title mt-2 text-3xl">{item.name}</h2>
                </div>
                <Link href={item.category === "suits" ? `/products/${item.slug}` : "/shop"} className="button-secondary">
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
