import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";
import { getWineDisplayName } from "@/lib/wine-labels";

export const dynamic = "force-dynamic";

export default async function OffeneBewertungenPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentMember = await prisma.members.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentMember) {
    redirect("/login");
  }

  const openRatings = await prisma.ratings.findMany({
    where: {
      member_id: currentMember.id,
      overall_score: null,
    },
    include: {
      wines: {
        include: {
          tastings: true,
        },
      },
    },
    orderBy: [
      {
        wines: {
          tasting_id: "desc",
        },
      },
      {
        wines: {
          sequence_no: "asc",
        },
      },
    ],
  });

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Meine offenen Bewertungen"
        badge="Mitgliederbereich"
        title="Meine offenen Bewertungen"
        description="Hier findest du alle Weine, bei denen deine Bewertung noch nicht abgeschlossen ist."
      />

      <Section>
        <SectionHeader
          kicker="Übersicht"
          title={`Offene Bewertungen: ${openRatings.length}`}
        />

        {openRatings.length === 0 ? (
          <ComicCard className="relative overflow-hidden px-6 py-8">
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
              Alles erledigt
            </div>

            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
              Keine offenen Bewertungen
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-700">
              Aktuell hast du keine offenen Weinbewertungen mehr.
            </p>
          </ComicCard>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {openRatings.map((rating) => {
              const wine = rating.wines;

              const wineLabel = getWineDisplayName(wine);

              return (
                <ComicCard
                  key={rating.id}
                  className="relative overflow-hidden px-6 pb-8 pt-6"
                >
                  <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                    {wine.tastings?.tasting_date
                      ? new Date(wine.tastings.tasting_date).toLocaleDateString(
                          "de-DE"
                        )
                      : "Tasting"}
                  </div>

                  <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
                    {[wineLabel, wine.vintage].filter(Boolean).join(" ")}
                  </h2>

                  <div className="mt-4 text-sm leading-7 text-neutral-700">
                    <div>
                      <span className="font-black uppercase tracking-[0.18em] text-neutral-500">
                        Land:
                      </span>{" "}
                      {wine.country ?? "Unbekannt"}
                    </div>

                    <div className="mt-2">
                      <span className="font-black uppercase tracking-[0.18em] text-neutral-500">
                        Region:
                      </span>{" "}
                      {wine.region ?? "Unbekannt"}
                    </div>
                  </div>

                  <div className="mt-6 border-t-2 border-black pt-5">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                      Status
                    </div>

                    <p className="mt-2 text-sm leading-7 text-neutral-700">
                      Deine Gesamtbewertung für diesen Wein ist noch nicht
                      abgeschlossen.
                    </p>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/dashboard/review/current/${wine.id}`}
                      className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                    >
                      Bewertung fortsetzen
                    </Link>
                  </div>
                </ComicCard>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
