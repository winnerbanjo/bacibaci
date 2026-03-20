"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const swipeThreshold = 60;

const slideContent = [
  {
    title: "Baci Baci",
    text: "Refined tailoring for modern presence. Built with control. Worn with intention.",
  },
  {
    title: "Suits",
    text: "Built with precision. Every piece is measured, refined, and structured to hold its form.",
  },
  {
    title: "Evening",
    text: "Designed for presence. Clean lines, balanced proportions, and a quiet finish.",
  },
  {
    title: "Essentials",
    text: "Daily structure. Refined basics made to sit right, wear well, and last.",
  },
] as const;

function wrapIndex(value: number) {
  return (value + slideContent.length) % slideContent.length;
}

export function HeroSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const slide = {
    ...slideContent[index % slideContent.length],
    image: images[index % images.length],
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => wrapIndex(current + 1));
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  function nextSlide() {
    setIndex((current) => wrapIndex(current + 1));
  }

  function previousSlide() {
    setIndex((current) => wrapIndex(current - 1));
  }

  if (!images.length) {
    return null;
  }

  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-[var(--color-line)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x <= -swipeThreshold) {
              nextSlide();
            } else if (info.offset.x >= swipeThreshold) {
              previousSlide();
            }
          }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid min-h-[100svh] grid-cols-1 md:grid-cols-2"
        >
          <div className="order-2 flex items-center px-8 py-14 md:order-1 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-xl"
            >
              <p className="eyebrow">
                {slide.title === "Baci Baci" ? "editorial tailoring" : slide.title.toLowerCase()}
              </p>
              <h1 className="display-title text-4xl tracking-wide md:text-6xl">{slide.title}</h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-gray-600 md:text-base">
                {slide.text}
              </p>
              <Link
                href="/custom"
                className="mt-6 inline-flex border border-black px-6 py-3 text-xs uppercase tracking-[0.22em] transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:text-white"
              >
                Start Your Fit
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 min-h-[46svh] md:order-2 md:min-h-[100svh]"
          >
            <div className="relative h-full w-full">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={slide.image}
                  alt="bacibaci look"
                  fill
                  priority
                  quality={100}
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {images.map((_, itemIndex) => (
          <button
            key={itemIndex}
            type="button"
            aria-label={`Go to slide ${itemIndex + 1}`}
            onClick={() => setIndex(itemIndex)}
            className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
              itemIndex === index
                ? "border-black bg-black"
                : "border-black/30 bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
