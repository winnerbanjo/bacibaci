import { LegalPage } from "@/components/legal-page";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="privacy policy"
      title="Client privacy"
      intro="Baci Baci collects only the information needed to manage consultations, orders, delivery, and client communication."
      sections={[
        {
          title: "Information we collect",
          paragraphs: [
            "We collect contact details, delivery information, appointment preferences, order details, and files you choose to upload, including payment receipts for essentials orders.",
            "We do not request more data than is necessary to complete your request or maintain client support.",
          ],
        },
        {
          title: "How information is used",
          paragraphs: [
            "Your information is used to confirm orders, coordinate fittings, arrange delivery, and respond to client service requests.",
            "We may also use your details to send operational updates related to a live order, booking, or subscription request.",
          ],
        },
        {
          title: "Storage and handling",
          paragraphs: [
            "Order, booking, and subscriber records are stored through our managed platform providers and are limited to internal brand operations.",
            "Uploaded receipts and product media are processed through secure third-party infrastructure used to operate the brand.",
          ],
        },
      ]}
    />
  );
}
