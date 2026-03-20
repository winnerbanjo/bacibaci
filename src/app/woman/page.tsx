import Image from "next/image";
import Link from "next/link";

import { getWomanItems } from "@/lib/local-images";

export default async function WomanPage() {
  const items = await getWomanItems();

  return (
    <section className="section-space">
      <div className="shell">
        <p className="eyebrow">baci baci woman</p>
        <h1 className="display-title mt-3 text-6xl sm:text-7xl">evening and womenswear</h1>
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="group">
              <div className="editorial-image aspect-[4/5]">
                <Image src={item.src} alt={item.name} fill className="object-cover transition-all duration-300 group-hover:scale-[1.02]" sizes="33vw" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">woman</p>
                  <h2 className="display-title mt-2 text-3xl">{item.name}</h2>
                </div>
                <Link href="/evening" className="button-secondary">
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
