import { BookingForm } from "@/components/booking-form";

export default function BookFittingPage() {
  return (
    <section className="section-space">
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="space-y-5">
          <p className="eyebrow">book fitting</p>
          <h1 className="display-title text-6xl sm:text-7xl">private fitting request</h1>
          <p className="copy-muted max-w-xl text-sm leading-8">
            Use the shared bacibaci booking flow to reserve a fitting, request a suit,
            or begin an eveningwear conversation.
          </p>
        </div>
        <BookingForm
          title="Start your fit"
          buttonLabel="Book Fitting"
          defaultService="bacibaci fitting"
          defaultType="fitting"
        />
      </div>
    </section>
  );
}
