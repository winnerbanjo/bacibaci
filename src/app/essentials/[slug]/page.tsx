import Image from "next/image";
import { notFound } from "next/navigation";

import { EssentialsOrderPanel } from "@/components/essentials-order-panel";
import { SizeGuide } from "@/components/size-guide";
import { getDisplayItemBySlug } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/site-settings";

type EssentialsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EssentialsDetailPage({ params }: EssentialsDetailPageProps) {
  const { slug } = await params;
  const item = await getDisplayItemBySlug(slug);

  if (!item || item.category !== "essentials") {
    notFound();
  }

  const settings = await getSiteSettings();

  return (
    <section className="section-space">
      <div className="shell space-y-10 px-6 md:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
          <div className="space-y-6">
            <div className="editorial-image aspect-[4/5]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                quality={100}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </div>
          <EssentialsOrderPanel
            product={{
              name: item.name,
              slug: item.slug,
              price: item.price,
            }}
            bankDetails={{
              accountName: settings.bankAccountName,
              accountNumber: settings.bankAccountNumber,
              bankName: settings.bankName,
            }}
          />
        </div>

        <div className="max-w-5xl">
          <SizeGuide
            compact
            title="Baci Baci size guide"
            description="Use the chart as a clean reference before selecting your essentials size."
          />
        </div>
      </div>
    </section>
  );
}
