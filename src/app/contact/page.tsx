export default function ContactPage() {
  return (
    <section className="section-space">
      <div className="shell grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">contact</p>
          <h1 className="display-title mt-3 text-6xl sm:text-7xl">reach bacibaci</h1>
        </div>
        <div className="panel space-y-6 p-8">
          <div>
            <p className="eyebrow">phone</p>
            <p className="mt-2 text-lg">+234 703 394 7449</p>
          </div>
          <div>
            <p className="eyebrow">email</p>
            <p className="mt-2 text-lg">atelier@bacibaci.co</p>
          </div>
          <div>
            <p className="eyebrow">address</p>
            <p className="mt-2 text-lg">Lekki Phase 1, Lagos, Nigeria</p>
          </div>
        </div>
      </div>
    </section>
  );
}
