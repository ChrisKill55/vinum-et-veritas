import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import TopWinesList from "./top-wines-list";

export const revalidate = 300;

const PAGE_SIZE = 12;

type PageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function TopWinesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  let isAdmin = false;

  if (session?.user?.email) {
    const member = await prisma.members.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    const role = String(member?.role ?? "").toUpperCase();
    isAdmin = role === "ADMIN" || role === "PRESIDENT";
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = (resolvedSearchParams.q ?? "").trim().toLowerCase();

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

      if (values.length === 0) {
        return null;
      }

      const average =
        values.reduce((sum, v) => sum + v, 0) / values.length;

      const searchableText = [
        wine.producer,
        wine.wine_name,
        wine.country,
        wine.region,
        wine.grape_variety,
        wine.vintage != null ? String(wine.vintage) : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return {
        id: wine.id,
        producer: wine.producer,
        wine_name: wine.wine_name,
        vintage: wine.vintage,
        country: wine.country,
        comment: wine.comment,
        average,
        ratingCount: values.length,
        searchableText,
      };
    })
    .filter((wine): wine is NonNullable<typeof wine> => wine !== null)
    .filter((wine) => {
      if (!query) return true;
      return wine.searchableText.includes(query);
    })
    .sort((a, b) => b.average - a.average);

  const initialWines = winesWithAverage
    .slice(0, PAGE_SIZE)
    .map((wine) => ({
      id: wine.id,
      producer: wine.producer,
      wine_name: wine.wine_name,
      vintage: wine.vintage,
      country: wine.country,
      comment: wine.comment,
      average: wine.average,
      ratingCount: wine.ratingCount,
    }));

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
            <TopWinesList
              initialWines={initialWines}
              initialQuery={query}
              isAdmin={isAdmin}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
