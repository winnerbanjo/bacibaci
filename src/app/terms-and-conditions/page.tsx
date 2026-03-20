import { LegalPage } from "@/components/legal-page";

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="terms and conditions"
      title="Terms of service"
      intro="All Baci Baci orders, fittings, and custom requests are handled subject to availability, confirmation, and brand approval."
      sections={[
        {
          title: "Orders and acceptance",
          paragraphs: [
            "Submitting a request does not complete acceptance until the brand confirms availability, payment review, and fulfillment details.",
            "Essentials orders are processed after receipt review. Custom and evening requests proceed through direct consultation and WhatsApp coordination.",
          ],
        },
        {
          title: "Product representation",
          paragraphs: [
            "We present garments with high attention to accuracy, but minor variation may occur due to fabric batches, display calibration, and hand-finishing.",
            "Measurements, silhouettes, and fit outcomes for custom work depend on the details supplied during consultation.",
          ],
        },
        {
          title: "Client responsibility",
          paragraphs: [
            "Clients are responsible for providing accurate contact information, delivery details, sizing selections, and payment evidence where required.",
            "Incorrect or incomplete information may delay confirmation, production, or dispatch.",
          ],
        },
      ]}
    />
  );
}
