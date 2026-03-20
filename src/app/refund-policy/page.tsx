import { LegalPage } from "@/components/legal-page";

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="refund policy"
      title="Returns and refunds"
      intro="Baci Baci maintains a selective returns policy in line with the made-to-order nature of the brand."
      sections={[
        {
          title: "Essentials orders",
          paragraphs: [
            "Ready-to-wear essentials may be reviewed for exchange or refund only if the item arrives damaged, incorrect, or materially different from the confirmed order.",
            "Requests should be made promptly after delivery and must include order details and supporting images where relevant.",
          ],
        },
        {
          title: "Custom and evening pieces",
          paragraphs: [
            "Custom, altered, or consultation-led pieces are not eligible for standard refunds once work has commenced.",
            "Where adjustment is appropriate, the brand may offer refinement or revision instead of a refund.",
          ],
        },
        {
          title: "Approval and processing",
          paragraphs: [
            "Any approved refund is processed only after item review and confirmation by the brand team.",
            "Original proof of payment may be required before a refund or exchange is finalized.",
          ],
        },
      ]}
    />
  );
}
