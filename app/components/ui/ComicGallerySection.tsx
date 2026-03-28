"use client";

import { useEffect, useRef, useState } from "react";

type ComicGalleryItem = {
  src: string;
  alt: string;
};

type ComicGallerySectionProps = {
  items: ComicGalleryItem[];
  title?: string;
  kicker?: string;
  noTopMargin?: boolean;
};

export default function ComicGallerySection({
  items,
  title = "Abende, Flaschen, Legenden",
  kicker = "Comic Galerie",
  noTopMargin = false,
}: ComicGallerySectionProps) {
  const duplicated = [...items, ...items];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  function openLightbox(index: number) {
    setActiveIndex(index % items.length);
  }

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + items.length) % items.length);
  }

  function showNext() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % items.length);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
    touchEndXRef.current = null;
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    touchEndXRef.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd() {
    const startX = touchStartXRef.current;
    const endX = touchEndXRef.current;

    if (startX === null || endX === null) return;

    const deltaX = startX - endX;
    const swipeThreshold = 50;

    if (deltaX > swipeThreshold) {
      showNext();
    } else if (deltaX < -swipeThreshold) {
      showPrevious();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  }

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const activeDisplayIndex = activeIndex ?? 0;
  const isLightboxOpen = activeIndex !== null;

  return (
    <>
      <section className={noTopMargin ? "relative" : "relative mt-20"}>
        <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-black py-14 text-white">
          <div className="mx-auto mb-8 max-w-7xl px-6">
            <div className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
              {kicker}
            </div>

            <h2 className="mt-2 text-4xl font-black uppercase tracking-tight md:text-5xl">
              {title}
            </h2>
          </div>

          <div className="relative w-screen overflow-hidden">
            <div
              className={`comic-gallery-track flex w-max gap-6 px-6 ${
                isLightboxOpen ? "comic-gallery-track-paused" : ""
              }`}
            >
              {duplicated.map((item, index) => (
                <button
                  key={`${item.src}-${index}`}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="comic-gallery-item comic-card comic-card-soft shrink-0 snap-start overflow-hidden bg-white text-left transition hover:-translate-y-1"
                  aria-label={`${item.alt} vergrößern`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 px-4 py-6"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-0 top-[-3.5rem] border-2 border-white bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
            >
              Schließen
            </button>

            <div
              className="comic-card comic-card-soft overflow-hidden bg-white"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="aspect-[4/3] w-full bg-neutral-200">
                <img
                  src={activeItem.src}
                  alt={activeItem.alt}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={showPrevious}
                className="border-2 border-white bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
              >
                ← Vorheriges
              </button>

              <div className="text-center text-sm font-black uppercase tracking-[0.2em] text-white">
                {activeDisplayIndex + 1} / {items.length}
              </div>

              <button
                type="button"
                onClick={showNext}
                className="border-2 border-white bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
              >
                Nächstes →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}