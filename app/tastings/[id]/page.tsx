import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isPlaceholderWine } from "@/lib/public-wines";
import WineGlassRating from "@/app/components/ui/WineGlassRating";
import ComicCard from "@/app/components/ui/ComicCard";
export const revalidate = 300;
export default async function TastingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  const tastingId = Number(rawId);

  if (Number.isNaN(tastingId)) {
    notFound();
  }

  const tasting = await prisma.tastings.findFirst({
    where: { id: tastingId },
    include: {
      members: true,
      wines: {
        orderBy: {
          sequence_no: "asc",
        },
        include: {
          ratings: {
            select: {
              overall_score: true,
            },
          },
        },
      },
    },
  });

  if (!tasting) {
    notFound();
  }

  const visibleWines = tasting.wines.filter((wine) => !isPlaceholderWine(wine));

  const winesWithAverage = visibleWines.map((wine) => {
    const overallValues = wine.ratings
      .map((rating) =>
        rating.overall_score !== null ? Number(rating.overall_score) : null
      )
      .filter(
        (score): score is number => score !== null && !Number.isNaN(score)
      );

    const averageOverall =
      overallValues.length > 0
        ? overallValues.reduce((sum, score) => sum + score, 0) /
          overallValues.length
        : null;

    return {
      ...wine,
      averageOverall,
    };
  });

  const highestAverage = winesWithAverage.reduce((max, wine) => {
    if (wine.averageOverall === null) return max;
    return wine.averageOverall > max ? wine.averageOverall : max;
  }, -1);

  return (
    <div className="bg-white text-neutral-950">
      <section className="relative overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0">
          <img
            src="/images/Header_Tasting.webp"
            alt="Weinverkostung"
            className="h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <div className="max-w-3xl">
            <Link
              href="/tastings"
              className="mb-6 inline-flex border-2 border-white bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-sm"
            >
              ← Zurück zum Archiv
            </Link>

            <div className="comic-badge mb-4 px-4 py-2 text-sm font-black uppercase tracking-[0.3em]">
              Tasting Detail
            </div>

            <div
              className="text-sm font-black uppercase tracking-[0.25em]"
              style={{ color: "#c1121f" }}
            >
              {new Date(tasting.tasting_date).toLocaleDateString("de-DE")}
            </div>

            <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
              Tasting vom{" "}
              {new Date(tasting.tasting_date).toLocaleDateString("de-DE")}
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="comic-badge px-3 py-2 text-xs font-black uppercase tracking-[0.22em]">
                Gastgeber: {tasting.members?.display_name ?? "Unbekannt"}
              </span>

              <span className="border-2 border-white bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-black">
                {visibleWines.length} Wein
                {visibleWines.length === 1 ? "" : "e"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              Verkostung
            </div>

            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
              Alle Weine des Abends
            </h2>
          </div>

          {winesWithAverage.length === 0 ? (
            <ComicCard className="px-6 py-8">
              Für dieses Tasting sind noch keine Weine hinterlegt.
            </ComicCard>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {winesWithAverage.map((wine) => {
                const isWinner =
                  wine.averageOverall !== null &&
                  wine.averageOverall === highestAverage;

                const wineLabel =
                  wine.producer &&
                  wine.wine_name &&
                  wine.producer === wine.wine_name
                    ? wine.wine_name
                    : [wine.producer, wine.wine_name].filter(Boolean).join(" ");

                return (
                <Link
  key={wine.id}
  href={`/wines/${wine.id}`}
  className="block h-full cursor-pointer outline-none transition hover:-translate-y-1 focus-visible:-translate-y-1"
>
  <ComicCard className="relative flex h-full flex-col overflow-hidden px-6 pb-12 pt-6">

    <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
      Flight #{wine.sequence_no}
    </div>

    <h3 className="mt-3 break-words text-2xl font-black uppercase leading-tight">
      {[wineLabel, wine.vintage].filter(Boolean).join(" ")}
    </h3>

    <div className="mt-4 grid grid-cols-[1fr_auto] gap-6">
      <div className="space-y-2 text-sm leading-6 text-neutral-700">
        <p>
          <span className="font-black uppercase text-black">Land:</span>{" "}
          {wine.country || "Unbekannt"}
        </p>

        <p>
          <span className="font-black uppercase text-black">Region:</span>{" "}
          {wine.region || "Unbekannt"}
        </p>

        <p>
          <span className="font-black uppercase text-black">Rebsorte:</span>{" "}
          {wine.grape_variety || "Unbekannt"}
        </p>

        <p>
          <span className="font-black uppercase text-black">Alkohol:</span>{" "}
          {wine.alcohol_pct ? `${wine.alcohol_pct}%` : "Unbekannt"}
        </p>

        <p>
          <span className="font-black uppercase text-black">Preis:</span>{" "}
          {wine.price_eur ? `${wine.price_eur} €` : "Unbekannt"}
        </p>
      </div>

      {isWinner && (
        <div className="flex justify-end">
          <img
            src="/images/wein-des-abends.svg"
            alt="Wein des Abends"
            className="mt-10 w-32 opacity-95"
          />
        </div>
      )}
    </div>

    {wine.averageOverall !== null && (
      <div className="mt-5 border-t-2 border-black pt-4">
        <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
          Durchschnitt
        </div>

        <div className="flex flex-col gap-3">
          <WineGlassRating value={wine.averageOverall} />
          <div className="text-lg font-black">
            {wine.averageOverall.toFixed(1)} / 10
          </div>
        </div>
      </div>
    )}

    {wine.comment && (
      <div className="mt-5 flex-1 border-t-2 border-black pt-4">
        <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
          Kommentar
        </div>
        <p className="text-sm leading-7 text-neutral-700">
          {wine.comment}
        </p>
      </div>
    )}

    {/* BUTTON */}
    <div className="mt-8">
      <span className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:bg-red-700">
  Wein-Details
</span>
    </div>

  </ComicCard>
</Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
