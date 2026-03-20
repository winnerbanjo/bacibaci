import Image from "next/image";

import { CustomOrderForm } from "@/components/custom-order-form";
import { getLocalCategoryItems } from "@/lib/local-images";

export default async function CustomPage() {
  const suits = await getLocalCategoryItems("suits");
  const lead = suits[0];

  return (
    <section className="section-space">
      <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <p className="eyebrow">custom</p>
          <h1 className="display-title text-6xl sm:text-7xl">built for a precise fit</h1>
          {lead ? (
            <div className="editorial-image aspect-[4/5]">
              <Image src={lead.src} alt={lead.name} fill className="object-cover transition-all duration-300 hover:scale-[1.02]" sizes="50vw" />
            </div>
          ) : null}
        </div>
        <CustomOrderForm />
      </div>
    </section>
  );
}
