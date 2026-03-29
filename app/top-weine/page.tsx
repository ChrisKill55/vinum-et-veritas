import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import WineGlassRating from "@/app/components/ui/WineGlassRating";
import ComicCard from "@/app/components/ui/ComicCard";
export const dynamic = "force-dynamic";
export default async function TopWinesPage() {
  const wines = await prisma.wines.findMany({
    include: {
      ratings: {
        select: {
          overall_score: true,
        },
      },
    },
  });

  const winesWithAverage = wines
    .map((wine) => {
      const values = wine.ratings
        .map((r) =>
          r.overall_score !== null ? Number(r.overall_score) : null
        )
        .filter((v): v is number => v !== null && !Number.isNaN(v));

      const avg =
        values.length > 0
          ? values.reduce((sum, v) => sum + v, 0) / values.length
          : null;

      return {
        ...wine,
        average: avg,
        ratingCount: values.length,
      };
    })
    .filter((wine) => wine.average !== null)
    .sort((a, b) => (b.average ?? 0) - (a.average ?? 0))
    .slice(0, 20);

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Top Weine"
        badge="Ranking"
        title="Top Weine aller Zeiten"
        description="Die bestbewerteten Weine aus allen Verkostungen des Weinclubs. Basierend auf dem Durchschnitt der Gesamtbewertungen."
      />

      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "url('/images/background-dots-header.png'), url('/images/background-dots-footer.png')",
          backgroundPosition: "right -80px top, left bottom",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <main className="px-6 py-20 pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 max-w-3xl">
              <div className="text-[0.7rem] font-black uppercase tracking-[0.32em] text-red-700">
                Hinweis des Weinclubs
              </div>

              <div className="mt-4 max-w-2xl border-l-4 border-black pl-5">
                <p className="text-base leading-8 text-neutral-700">
                  Die hier dargestellten Bewertungen spiegeln ausschließlich die
                  persönlichen Eindrücke der Mitglieder unseres Weinclubs wider.
                  Geschmack ist subjektiv und hängt stark von Situation,
                  Umgebung, Stimmung sowie der Kombination mit Speisen ab.
                </p>

                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Ein Wein kann unter anderen Bedingungen, in einer anderen
                  Runde oder in Kombination mit anderen Speisen durchaus völlig
                  anders wahrgenommen werden. Die Bewertungen verstehen sich
                  daher ausdrücklich als persönliche Geschmackseindrücke und
                  nicht als objektive Qualitätsurteile.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {winesWithAverage.map((wine, index) => {
                const wineLabel =
                  wine.producer &&
                  wine.wine_name &&
                  wine.producer === wine.wine_name
                    ? wine.wine_name
                    : [wine.producer, wine.wine_name].filter(Boolean).join(" ");

                return (
                  <ComicCard
                    key={wine.id}
                    className="relative overflow-hidden px-6 pb-12 pt-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
                        Platz #{index + 1}
                      </div>

                      <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                        {wine.ratingCount} Bewertung
                        {wine.ratingCount === 1 ? "" : "en"}
                      </div>
                    </div>

                    <h3 className="mt-3 break-words text-2xl font-black uppercase leading-tight">
                      {[wineLabel, wine.vintage].filter(Boolean).join(" ")}
                    </h3>

                    <div className="mt-4 text-sm text-neutral-600">
                      {wine.country || "Unbekannt"}
                    </div>

                    <div className="mt-6 border-t-2 border-black pt-5">
                      <div className="mb-3 flex flex-col gap-3">
                        <WineGlassRating value={wine.average ?? 0} />

                        <div className="text-lg font-black">
                          {wine.average?.toFixed(1)} / 10
                        </div>
                      </div>
                    </div>

                    {wine.comment ? (
                      <div className="mt-6 border-t-2 border-black pt-5">
                        <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                          Gruppenstatement
                        </div>

                        <p className="text-sm leading-7 text-neutral-700">
                          {wine.comment}
                        </p>
                      </div>
                    ) : null}
                  </ComicCard>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}