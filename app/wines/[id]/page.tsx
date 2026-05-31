import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPlaceholderWine } from "@/lib/public-wines";
import { getWineDisplayName } from "@/lib/wine-labels";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";
import WineGlassRating from "@/app/components/ui/WineGlassRating";

export const revalidate = 300;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WineDetailPage({ params }: PageProps) {
  const { id } = await params;
  const wineId = Number(id);

  if (Number.isNaN(wineId)) {
    notFound();
  }

  const wine = await prisma.wines.findUnique({
    where: { id: wineId },
    include: {
      tastings: {
        include: {
          members: true,
        },
      },
      ratings: {
        include: {
          members: true,
        },
        orderBy: {
          member_id: "asc",
        },
      },
      wine_images: {
        where: {
          is_primary: true,
        },
        take: 1,
        include: {
          members: true,
        },
      },
    },
  });

  if (!wine) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const currentMember = session?.user?.email
    ? await prisma.members.findUnique({
        where: {
          email: session.user.email,
        },
      })
    : null;

  const role = String(currentMember?.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";
  const isPlaceholder = isPlaceholderWine(wine);

  const isParticipant = currentMember
    ? wine.ratings.some((rating) => rating.member_id === currentMember.id)
    : false;

  if (isPlaceholder && !isAdmin && !isParticipant) {
    notFound();
  }

  const canUploadImage = Boolean(currentMember) && (isAdmin || isParticipant);

  const validOverallScores = wine.ratings
    .map((rating) =>
      rating.overall_score !== null ? Number(rating.overall_score) : null
    )
    .filter((value): value is number => value !== null && !Number.isNaN(value));

  const averageScore =
    validOverallScores.length > 0
      ? validOverallScores.reduce((sum, value) => sum + value, 0) /
        validOverallScores.length
      : null;

  const allWines = await prisma.wines.findMany({
    include: {
      ratings: {
        select: {
          overall_score: true,
        },
      },
    },
  });

  const rankedWines = allWines
    .filter((currentWine) => isAdmin || !isPlaceholderWine(currentWine))
    .map((currentWine) => {
      const values = currentWine.ratings
        .map((rating) =>
          rating.overall_score !== null ? Number(rating.overall_score) : null
        )
        .filter(
          (value): value is number => value !== null && !Number.isNaN(value)
        );

      const average =
        values.length > 0
          ? values.reduce((sum, value) => sum + value, 0) / values.length
          : null;

      return {
        id: currentWine.id,
        average,
      };
    })
    .filter(
      (currentWine): currentWine is { id: number; average: number } =>
        currentWine.average !== null
    )
    .sort((a, b) => b.average - a.average);

  const rankIndex = rankedWines.findIndex(
    (currentWine) => currentWine.id === wine.id
  );
  const rank = rankIndex !== -1 ? rankIndex + 1 : null;

  const primaryImage = wine.wine_images[0] ?? null;

  const wineLabel = getWineDisplayName(wine);

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt={wineLabel || "Wein-Detail"}
        badge="Weinprofil"
        title={[wineLabel, wine.vintage].filter(Boolean).join(" ")}
        description="Detailseite mit Weinprofil, Bewertungen, Gruppenstatement und Tasting-Zuordnung."
      />

      <Section>
        <SectionHeader
          kicker="Weinprofil"
          title={wineLabel || "Unbekannter Wein"}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ComicCard className="relative overflow-hidden px-6 pb-8 pt-6">
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
              Stammdaten
            </div>

            <div className="mt-5 overflow-hidden border-2 border-black bg-white">
              <div className="flex min-h-[320px] items-center justify-center bg-neutral-100 p-4">
                <img
                  src={
                    primaryImage
                      ? primaryImage.image_url
                      : "/images/wine-placeholder.png"
                  }
                  alt={wineLabel || "Flaschenfoto"}
                  className="max-h-[420px] w-full object-contain"
                />
              </div>
            </div>

            {canUploadImage ? (
              <div className="mt-6">
                <Link
                  href={`/dashboard/wines/${wine.id}/upload`}
                  className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                >
                  {primaryImage ? "Foto ersetzen" : "Flaschenfoto hochladen"}
                </Link>
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 text-sm leading-7 text-neutral-700 sm:grid-cols-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Wein
                </div>
                <div className="mt-1 text-base font-semibold text-black">
                  {wine.wine_name}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Erzeuger
                </div>
                <div className="mt-1 text-base font-semibold text-black">
                  {wine.producer}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Jahrgang
                </div>
                <div className="mt-1 text-base font-semibold text-black">
                  {wine.vintage ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Land
                </div>
                <div className="mt-1 text-base font-semibold text-black">
                  {wine.country ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Region
                </div>
                <div className="mt-1 text-base font-semibold text-black">
                  {wine.region ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Rebsorte
                </div>
                <div className="mt-1 text-base font-semibold text-black">
                  {wine.grape_variety ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Alkohol
                </div>
                <div className="mt-1 text-base font-semibold text-black">
                  {wine.alcohol_pct != null
                    ? `${Number(wine.alcohol_pct).toFixed(1)} %`
                    : "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Preis
                </div>
                <div className="mt-1 text-base font-semibold text-black">
                  {wine.price_eur != null
                    ? `${Number(wine.price_eur).toFixed(2)} €`
                    : "—"}
                </div>
              </div>

              {wine.purchase_location ? (
                <div className="sm:col-span-2">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                    Einkaufsort
                  </div>
                  <div className="mt-1 text-base font-semibold text-black">
                    {wine.purchase_location}
                  </div>
                </div>
              ) : null}

              {wine.purchase_note ? (
                <div className="sm:col-span-2">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                    Hinweis zum Einkauf
                  </div>
                  <div className="mt-1 text-base font-semibold text-black">
                    {wine.purchase_note}
                  </div>
                </div>
              ) : null}
            </div>
          </ComicCard>

          <ComicCard className="relative overflow-hidden px-6 pb-8 pt-6">
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
              Wertung
            </div>

            {rank ? (
              <div className="mt-5">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Aktuelle Platzierung
                </div>

                <div className="mt-1 text-6xl font-black text-red-700">
                  #{rank}
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                Durchschnitt
              </div>

              <div className="mt-3 flex flex-col gap-3">
                <WineGlassRating value={averageScore ?? 0} />

                <div className="text-3xl font-black text-black">
                  {averageScore !== null ? averageScore.toFixed(1) : "—"} / 10
                </div>

                <div className="text-sm font-semibold text-neutral-600">
                  {validOverallScores.length} Bewertung
                  {validOverallScores.length === 1 ? "" : "en"}
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

            <div className="mt-6 border-t-2 border-black pt-5">
              <div className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                Zugehöriges Tasting
              </div>

              <div className="grid gap-4 text-sm leading-7 text-neutral-700 sm:grid-cols-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                    Datum
                  </div>
                  <div className="mt-1 text-base font-semibold text-black">
                    {new Date(wine.tastings.tasting_date).toLocaleDateString(
                      "de-DE"
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                    Gastgeber
                  </div>
                  <div className="mt-1 text-base font-semibold text-black">
                    {wine.tastings.members?.display_name ?? "Unbekannt"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                    Reihenfolge
                  </div>
                  <div className="mt-1 text-base font-semibold text-black">
                    Wein {wine.sequence_no}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href={`/tastings/${wine.tasting_id}`}
                  className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                >
                  Zum Tasting
                </Link>
              </div>
            </div>
          </ComicCard>
        </div>

        <div className="mt-10">
          <ComicCard className="relative overflow-hidden px-6 pb-8 pt-6">
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
              Einzelbewertungen
            </div>

            {wine.ratings.length === 0 ? (
              <p className="mt-5 text-sm leading-7 text-neutral-700">
                Für diesen Wein liegen aktuell noch keine Einzelbewertungen vor.
              </p>
            ) : (
              <div className="mt-5 space-y-5">
                {wine.ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="border-t-2 border-black pt-5 first:border-t-0 first:pt-0"
                  >
                    <div className="mb-4 text-lg font-black uppercase text-black">
                      {rating.members?.display_name ?? "Unbekannt"}
                    </div>

                    <div className="grid gap-3 text-sm leading-7 text-neutral-700 sm:grid-cols-2 lg:grid-cols-5">
                      <div>
                        <span className="font-black uppercase tracking-[0.18em] text-neutral-500">
                          Farbe:
                        </span>{" "}
                        {rating.color_score != null
                          ? Number(rating.color_score).toFixed(1)
                          : "—"}
                      </div>

                      <div>
                        <span className="font-black uppercase tracking-[0.18em] text-neutral-500">
                          Nase:
                        </span>{" "}
                        {rating.smell_score != null
                          ? Number(rating.smell_score).toFixed(1)
                          : "—"}
                      </div>

                      <div>
                        <span className="font-black uppercase tracking-[0.18em] text-neutral-500">
                          Geschmack:
                        </span>{" "}
                        {rating.taste_score != null
                          ? Number(rating.taste_score).toFixed(1)
                          : "—"}
                      </div>

                      <div>
                        <span className="font-black uppercase tracking-[0.18em] text-neutral-500">
                          Abgang:
                        </span>{" "}
                        {rating.finish_score != null
                          ? Number(rating.finish_score).toFixed(1)
                          : "—"}
                      </div>

                      <div className="font-black text-red-700">
                        Gesamtnote:{" "}
                        {rating.overall_score != null
                          ? Number(rating.overall_score)
                              .toFixed(1)
                              .replace(".", ",")
                          : "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ComicCard>
        </div>
      </Section>
    </div>
  );
}
