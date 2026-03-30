import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import TopWinesList from "./top-wines-list";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

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
        .map((r) => (r.overall_score !== null ? Number(r.overall_score) : null))
        .filter((v): v is number => v !== null && !Number.isNaN(v));

      const avg =
        values.length > 0
          ? values.reduce((sum, v) => sum + v, 0) / values.length
          : null;

      return {
        id: wine.id,
        producer: wine.producer,
        wine_name: wine.wine_name,
        vintage: wine.vintage,
        country: wine.country,
        comment: wine.comment,
        average: avg,
        ratingCount: values.length,
      };
    })
    .filter((wine) => wine.average !== null)
    .sort((a, b) => (b.average ?? 0) - (a.average ?? 0));

  const initialWines = winesWithAverage.slice(0, PAGE_SIZE);

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
            <TopWinesList initialWines={initialWines} />
          </div>
        </main>
      </div>
    </div>
  );
}