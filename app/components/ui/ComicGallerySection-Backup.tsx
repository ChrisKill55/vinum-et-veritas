type ComicGalleryItem = {
  src: string;
  alt: string;
};

type ComicGallerySectionProps = {
  items: ComicGalleryItem[];
  title?: string;
  kicker?: string;
};

export default function ComicGallerySection({
  items,
  title = "Abende, Flaschen, Legenden",
  kicker = "Comic Galerie",
}: ComicGallerySectionProps) {
  const duplicated = [...items, ...items];

  return (
    <section className="relative mt-20">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-black pt-14 pb-14 text-white">
        <div className="mx-auto mb-8 max-w-7xl px-6">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
            {kicker}
          </div>

          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight md:text-5xl">
            {title}
          </h2>
        </div>

        <div className="relative w-screen overflow-hidden">
          <div className="comic-gallery-track flex w-max gap-6 px-6">
            {duplicated.map((item, index) => (
              <article
                key={`${item.src}-${index}`}
                className="comic-card comic-card-soft shrink-0 overflow-hidden bg-white"
                style={{ width: "calc((100vw - 48px - 24px * 4) / 5)" }}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}