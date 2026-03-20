import Image from "next/image";

import { getLookbookItems } from "@/lib/local-images";

export default async function LookbookPage() {
  const items = await getLookbookItems();

  return (
    <section className="section-space">
      <div className="shell">
        <p className="eyebrow">lookbook</p>
        <h1 className="display-title mt-3 text-6xl sm:text-7xl">the Baci Baci line</h1>
        <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6">
          {items.map((item) => (
            <div key={item.src}>
              <div className="editorial-image relative aspect-[4/5]">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 50vw"
                />
              </div>
              <div className="mt-3">
                <h2 className="display-title text-xl sm:text-3xl">{item.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
