"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  src: string;
  alt: string;
};

type Props = {
  items: GalleryItem[];
  kicker?: string;
  title?: string;
  noTopMargin?: boolean;
};

export default function ComicGallerySection({
  items,
  kicker = "Galerie",
  title = "Abende, Flaschen, Legenden",
  noTopMargin = false,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isLightboxOpen = activeIndex !== null;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const activeDisplayIndex = activeIndex ?? 0;

  function open(index: number) {
    setActiveIndex(index);
  }

  function close() {
    setActiveIndex(null);
  }

  function next() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % items.length);
  }

  function prev() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + items.length) % items.length);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!isLightboxOpen) return;

      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, isLightboxOpen]);

  return (
    <section
      className={`relative overflow-hidden ${
        noTopMargin ? "" : "mt-24"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="mb-10 text-center">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
            {kicker}
          </div>

          <h2 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-5xl">
            {title}
          </h2>
        </div>

        {/* Slider */}

        <div className="relative overflow-hidden">

          <div
            className={`comic-gallery-track flex gap-6 ${
              isLightboxOpen ? "comic-gallery-track-paused" : ""
            }`}
          >
            {[...items, ...items].map((item, index) => (
              <article
                key={index}
                className="comic-gallery-item shrink-0 cursor-pointer"
                onClick={() => open(index % items.length)}
              >
                <div className="comic-card overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-6">

          <button
            onClick={close}
            className="absolute right-6 top-6 text-white text-3xl font-black"
          >
            ×
          </button>

          <button
            onClick={prev}
            className="absolute left-6 text-white text-3xl font-black"
          >
            ‹
          </button>

          <img
            src={activeItem.src}
            alt={activeItem.alt}
            className="max-h-[85vh] max-w-full object-contain"
          />

          <button
            onClick={next}
            className="absolute right-6 text-white text-3xl font-black"
          >
            ›
          </button>

          <div className="absolute bottom-8 text-center text-sm font-black uppercase tracking-[0.2em] text-white">
            {activeDisplayIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </section>
  );
}