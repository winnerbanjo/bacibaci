"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export function AdminFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f3f3f1] text-black">
      <aside className="w-64 border-r border-white/10 bg-[#111111] px-6 py-8 text-white">
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">BACI BACI ADMIN</p>
        <nav className="mt-10 space-y-4">
          {adminLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm uppercase tracking-[0.18em] ${active ? "font-medium underline underline-offset-8" : "text-white/68 hover:text-white"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">BACI BACI ADMIN</p>
            <p className="mt-2 text-sm text-black/55">Products, bookings, and subscribers.</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
