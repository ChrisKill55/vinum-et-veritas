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

export default async function CurrentReviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentMember = await prisma.members.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!currentMember) {
    redirect("/login");
  }

  const currentTasting = await prisma.tastings.findFirst({
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    include: {
      members: true,
      wines: {
        orderBy: {
          sequence_no: "asc",
        },
        include: {
          ratings: {
            where: {
              member_id: currentMember.id,
            },
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const winesForMember =
    currentTasting?.wines.filter((wine) => wine.ratings.length > 0) ?? [];

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Aktuelles Tasting bewerten"
        badge="Mitgliederbereich"
        title="Aktuelles Tasting bewerten"
        description="Hier bewerten Clubmitglieder die Weine des zuletzt angelegten Tastings."
      />

      <Section>
        {!currentTasting ? (
          <ComicCard className="relative overflow-hidden px-6 py-8">
            <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
              Hinweis
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">
              Kein Tasting gefunden
            </h2>
            <p className="mt-4 text-neutral-700">
              Es ist aktuell kein Tasting in der Datenbank vorhanden.
            </p>
          </ComicCard>
        ) : (
          <>
            <SectionHeader
              kicker="Aktuelles Tasting"
              title={`Gastgeber: ${currentTasting.members?.display_name ?? "Unbekannt"}`}
            />

            <ComicCard className="relative mb-10 overflow-hidden px-6 py-6">
              <div className="grid gap-6 md:grid-cols-1">
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                    Tasting-Datum
                  </div>
                  <div className="mt-2 text-2xl font-black uppercase">
                    {new Date(currentTasting.tasting_date).toLocaleDateString(
                      "de-DE"
                    )}
                  </div>
                </div>
              </div>
            </ComicCard>

            {winesForMember.length === 0 ? (
              <ComicCard className="relative overflow-hidden px-6 py-8">
                <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                  Kein Zugriff
                </div>
                <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
                  Du bist für dieses Tasting nicht als Teilnehmer eingetragen
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-700">
                  Bewertungen sind nur für Mitglieder möglich, die beim Tasting
                  als Teilnehmer hinterlegt wurden.
                </p>
              </ComicCard>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {winesForMember.map((wine) => {
                const wineTitle = getWineDisplayName(wine);

                return (
                  <ComicCard
                    key={wine.id}
                    className="relative overflow-hidden px-6 pb-8 pt-6"
                  >
                    <div className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-red-700">
                      Wein {wine.sequence_no}
                    </div>

                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      {wineTitle}
                    </h3>

                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm uppercase tracking-widest text-neutral-600">
                      <div>
                        <div>Jahrgang</div>
                        <div className="mt-2 text-lg font-black text-black">
                          {wine.vintage ?? "—"}
                        </div>
                      </div>
                      <div>
                        <div>Land</div>
                        <div className="mt-2 text-lg font-black text-black">
                          {wine.country ?? "—"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <a
                        href={`/dashboard/review/current/${wine.id}`}
                        className="inline-block border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                      >
                        Diesen Wein bewerten
                      </a>
                    </div>
                  </ComicCard>
                );
                })}
              </div>
            )}
          </>
        )}
      </Section>
    </div>
  );
}
