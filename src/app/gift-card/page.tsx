import { notFound } from "next/navigation";

import { GiftCardPanel } from "@/components/gift-card-panel";
import { getSiteSettings } from "@/lib/site-settings";

export default async function GiftCardPage() {
  const settings = await getSiteSettings();

  if (!settings.giftCardEnabled) {
    notFound();
  }

  return (
    <section className="section-space pb-28 md:pb-16">
      <div className="shell">
        <GiftCardPanel denominations={settings.giftCardDenominations} />
      </div>
    </section>
  );
}
