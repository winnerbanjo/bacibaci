"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/custom", label: "CUSTOM" },
  { href: "/lookbook", label: "LOOK BOOK" },
  { href: "/essentials", label: "BACI BACI ESSENTIALS" },
  { href: "/man", label: "BACI BACI MAN" },
  { href: "/woman", label: "BACI BACI WOMAN" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(245,243,239,0.9)] backdrop-blur-md">
        <div className="shell flex items-center justify-between gap-6 py-4">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center border border-[var(--color-line)] md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-px bg-black" />
              <span className="h-px bg-black" />
              <span className="h-px bg-black" />
            </span>
          </button>

          <Link href="/" className="mx-auto md:mx-0">
            <Image src="/images/logo.png" alt="BACI BACI" width={250} height={99} priority className="h-10 w-auto sm:h-12" />
          </Link>

          <nav className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.2em] xl:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/gift-card" className="button-secondary hidden md:inline-flex">
            Gift Card
          </Link>
        </div>
      </header>

      <div className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 md:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <button type="button" className="absolute inset-0" aria-label="Close menu overlay" onClick={() => setOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-[86vw] max-w-sm border-r border-[var(--color-line)] bg-[var(--color-paper)] px-6 py-6 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <Image src="/images/logo.png" alt="BACI BACI" width={210} height={83} className="h-9 w-auto" />
            <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center border border-[var(--color-line)]">
              X
            </button>
          </div>
          <nav className="mt-8 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-[var(--color-line)] py-4 text-base uppercase tracking-[0.18em]"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/gift-card" onClick={() => setOpen(false)} className="block border-b border-[var(--color-line)] py-4 text-base uppercase tracking-[0.18em]">
              GIFT CARD
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
