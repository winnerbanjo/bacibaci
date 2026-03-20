import { LegalPage } from "@/components/legal-page";

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      eyebrow="shipping policy"
      title="Delivery and dispatch"
      intro="Delivery timelines depend on stock position, confirmation timing, and the destination provided with your order."
      sections={[
        {
          title: "Dispatch timing",
          paragraphs: [
            "Essentials orders move into confirmation once payment evidence is reviewed and stock position is verified by the team.",
            "Dispatch timing may vary during collection launches, public holidays, or periods of elevated order volume.",
          ],
        },
        {
          title: "Delivery details",
          paragraphs: [
            "Clients are responsible for supplying a complete and accurate delivery address, contact number, and recipient availability details.",
            "A failed delivery attempt caused by incorrect information may require additional coordination before re-dispatch.",
          ],
        },
        {
          title: "Coverage and updates",
          paragraphs: [
            "Domestic and international delivery support may differ by product category and destination.",
            "Where needed, the team will provide updated delivery guidance directly through the contact details attached to the order.",
          ],
        },
      ]}
    />
  );
}
