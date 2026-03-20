import Link from "next/link";

import { WHATSAPP_NUMBER } from "@/lib/brand";

export function FloatingWhatsApp() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello Baci Baci, I would like to make an enquiry."
  )}`;

  return (
    <Link
      href={href}
      target="_blank"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-black bg-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:text-black active:scale-95 md:bottom-8 md:right-8"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.59 2 2.16 6.42 2.16 11.87c0 1.75.46 3.46 1.34 4.97L2 22l5.31-1.39a9.84 9.84 0 0 0 4.71 1.2h.01c5.44 0 9.87-4.43 9.87-9.88a9.8 9.8 0 0 0-2.85-7.02ZM12.03 20.14h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.15.83.84-3.08-.2-.32a8.14 8.14 0 0 1-1.26-4.37c0-4.5 3.66-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.17 8.16Zm4.48-6.1c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.21-.74-.66-1.25-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.41-.41-.56-.41h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.06 0 1.21.89 2.39 1.02 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.06.42 1.42.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29Z" />
      </svg>
    </Link>
  );
}
