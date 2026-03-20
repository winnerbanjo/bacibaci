import Image from "next/image";

import { getLookbookItems } from "@/lib/local-images";

export default async function LookbookPage() {
  const items = await getLookbookItems();

  return (
    <section className="section-space">
      <div className="shell">
        <p className="eyebrow">lookbook</p>
        <h1 className="display-title mt-3 text-6xl sm:text-7xl">the bacibaci line</h1>
        <div className="mt-10 columns-1 gap-6 md:columns-2 xl:columns-3">
          {items.map((item) => (
            <div key={item.src} className="mb-6 break-inside-avoid">
              <div className="editorial-image relative aspect-[4/5]">
                <Image src={item.src} alt={item.name} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="mt-3">
                <h2 className="display-title text-3xl">{item.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
