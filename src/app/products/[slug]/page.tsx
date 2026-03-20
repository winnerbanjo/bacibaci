import Image from "next/image";
import { notFound } from "next/navigation";

import { BookingForm } from "@/components/booking-form";
import { getSuitBySlug } from "@/lib/local-images";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const item = await getSuitBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <section className="section-space">
      <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <div className="editorial-image aspect-[4/5]">
            <Image src={item.src} alt={item.name} fill className="object-cover" sizes="50vw" />
          </div>
          <div>
            <p className="eyebrow">suits</p>
            <h1 className="display-title mt-3 text-6xl">{item.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)]">
              Select a size reference or choose custom fit, then send height, chest, waist,
              shoulder, and notes.
            </p>
          </div>
        </div>
        <BookingForm
          title="Request this suit"
          buttonLabel="Request This Suit"
          defaultService={item.name}
          defaultType="suit-request"
          productName={item.name}
          includeMeasurements
        />
      </div>
    </section>
  );
}
