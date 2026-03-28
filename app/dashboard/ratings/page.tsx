import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";
import WineGlassRating from "@/app/components/ui/WineGlassRating";

export default async function MyRatingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const member = await prisma.members.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!member) {
    redirect("/login");
  }

  const ratings = await prisma.ratings.findMany({
    where: {
      member_id: member.id,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      wines: {
        include: {
          tastings: {
            include: {
              members: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Meine Bewertungen"
        badge="Mitgliederbereich"
        title="Meine Bewertungen"
        description="Hier findest du alle Weine, die du bereits bewertet hast, und kannst deine Einträge erneut öffnen."
      />

      <Section>
        <SectionHeader
          kicker="Überblick"
          title={`Bewertungen von ${member.display_name ?? session.user.name ?? "Mitglied"}`}
        />

        {ratings.length === 0 ? (
          <ComicCard className="px-6 py-8">
            <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
              Hinweis
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">
              Noch keine Bewertungen vorhanden
            </h2>
            <p className="mt-4 text-neutral-700">
              Du hast aktuell noch keinen Wein bewertet.
            </p>

            <div className="mt-6">
              <Link
                href="/dashboard/review/current"
                className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
              >
                Zum aktuellen Tasting
              </Link>
            </div>
          </ComicCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ratings.map((rating) => {
              const wine = rating.wines;

              const wineTitle =
                wine.producer === wine.wine_name
                  ? wine.wine_name
                  : [wine.producer, wine.wine_name].filter(Boolean).join(" ");

              const tastingDate = wine.tastings?.tasting_date
                ? new Date(wine.tastings.tasting_date).toLocaleDateString("de-DE")
                : "Unbekannt";

              const hostName =
                wine.tastings?.members?.display_name ?? "Unbekannt";

              const overall =
                rating.overall_score !== null
                  ? Number(rating.overall_score)
                  : null;

              return (
                <ComicCard
                  key={rating.id}
                  className="relative overflow-hidden px-6 pb-12 pt-6"
                >
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
                    Bewertung
                  </div>

                  <h3 className="mt-3 break-words text-2xl font-black uppercase leading-tight">
                    {[wineTitle, wine.vintage].filter(Boolean).join(" ")}
                  </h3>

                  <div className="mt-5 space-y-2 text-sm leading-6 text-neutral-700">
                    <p>
                      <span className="font-black uppercase text-black">
                        Tasting:
                      </span>{" "}
                      {tastingDate}
                    </p>

                    <p>
                      <span className="font-black uppercase text-black">
                        Gastgeber:
                      </span>{" "}
                      {hostName}
                    </p>

                    <p>
                      <span className="font-black uppercase text-black">
                        Land:
                      </span>{" "}
                      {wine.country || "Unbekannt"}
                    </p>
                  </div>

                  {overall !== null ? (
                    <div className="mt-6 border-t-2 border-black pt-4">
                      <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                        Dein Gesamteindruck
                      </div>

                      <div className="flex flex-col gap-3">
                        <WineGlassRating value={overall} />
                        <div className="text-lg font-black">
                          {overall.toFixed(1)} / 10
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <Link
                      href={`/dashboard/review/current/${wine.id}`}
                      className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                    >
                      Bewertung öffnen
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