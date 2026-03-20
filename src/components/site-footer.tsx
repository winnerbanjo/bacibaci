import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import { WHATSAPP_NUMBER } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[rgba(255,255,255,0.4)]">
      <div className="shell grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="eyebrow">Navigation</p>
          <div className="mt-5 space-y-3 text-sm">
            <Link href="/">Home</Link>
            <br />
            <Link href="/shop">Shop</Link>
            <br />
            <Link href="/custom">Custom</Link>
            <br />
            <Link href="/lookbook">Look Book</Link>
            <br />
            <Link href="/gift-card">Gift Card</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Support</p>
          <div className="mt-5 space-y-3 text-sm">
            <Link href="/contact">Contact</Link>
            <br />
            <Link href="/gift-card">Gift Card</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Legal</p>
          <div className="mt-5 space-y-3 text-sm">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <br />
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
            <br />
            <Link href="/refund-policy">Refund Policy</Link>
            <br />
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <div className="mt-5 space-y-3 text-sm leading-7">
            <p>Phone: +234 808 799 4567</p>
            <p>Email: atelier@bacibaci.co</p>
            <p>Location : Chevron , lekki , Lagos, Nigeria</p>
            <p>
              <Link href="https://instagram.com/bacibaciofficial" target="_blank">
                Instagram
              </Link>
            </p>
            <p>
              <Link href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank">
                WhatsApp
              </Link>
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] py-5 text-center text-xs uppercase tracking-[0.26em] text-[var(--color-muted)]">
        Baci Baci — refined form. controlled presence.
      </div>
    </footer>
  );
}
