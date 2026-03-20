import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/suits", label: "Suits" },
  { href: "/evening", label: "Evening" },
  { href: "/essentials", label: "Essentials" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/book-fitting", label: "Book Fitting" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[rgba(245,243,239,0.82)] backdrop-blur-md">
      <div className="shell flex items-center justify-between gap-6 py-4">
        <Link href="/" className="display-title text-3xl lowercase tracking-[0.18em]">
          bacibaci
        </Link>
        <nav className="hidden flex-wrap items-center gap-6 text-xs uppercase tracking-[0.24em] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-60">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/book-fitting" className="button-primary hidden md:inline-flex">
          Start Your Fit
        </Link>
      </div>
    </header>
  );
}
