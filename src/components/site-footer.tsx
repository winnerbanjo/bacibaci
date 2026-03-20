import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[rgba(255,255,255,0.4)]">
      <div className="shell grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="eyebrow">Navigation</p>
          <div className="mt-5 space-y-3 text-sm">
            <Link href="/">Home</Link>
            <br />
            <Link href="/suits">Suits</Link>
            <br />
            <Link href="/evening">Evening</Link>
            <br />
            <Link href="/essentials">Essentials</Link>
            <br />
            <Link href="/book-fitting">Book Fitting</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Support</p>
          <div className="mt-5 space-y-3 text-sm">
            <Link href="/contact">Contact</Link>
            <br />
            <Link href="/privacy-policy">Privacy Policy</Link>
            <br />
            <Link href="/terms">Terms</Link>
            <br />
            <Link href="/return-policy">Return Policy</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <div className="mt-5 space-y-3 text-sm leading-7">
            <p>Phone: +234 703 394 7449</p>
            <p>Email: atelier@bacibaci.co</p>
            <p>Address: Lekki Phase 1, Lagos, Nigeria</p>
            <p>
              <Link href="https://instagram.com/bacibaciofficial" target="_blank">
                Instagram
              </Link>
            </p>
            <p>
              <Link href="https://wa.me/2347033947449" target="_blank">
                WhatsApp
              </Link>
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] py-5 text-center text-xs uppercase tracking-[0.26em] text-[var(--color-muted)]">
        bacibaci — refined form. controlled presence.
      </div>
    </footer>
  );
}
