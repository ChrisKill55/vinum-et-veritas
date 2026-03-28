import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminTastingReviewsPage({
  params,
}: PageProps) {
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

  const role = String(currentMember.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const tastingId = Number(id);

  if (Number.isNaN(tastingId)) {
    notFound();
  }

  const tasting = await prisma.tastings.findUnique({
    where: {
      id: tastingId,
    },
    include: {
      members: true,
      wines: {
        orderBy: {
          sequence_no: "asc",
        },
        include: {
          ratings: {
            select: {
              member_id: true,
            },
          },
        },
      },
    },
  });

  if (!tasting) {
    notFound();
  }

  const activeMembers = await prisma.members.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      display_name: "asc",
    },
    select: {
      id: true,
      display_name: true,
      role: true,
      email: true,
    },
  });

  const totalWines = tasting.wines.length;

  const reviewRows = activeMembers.map((member) => {
    const ratedWineIds = new Set<number>();

    tasting.wines.forEach((wine) => {
      const hasRating = wine.ratings.some(
        (rating) => rating.member_id === member.id
      );

      if (hasRating) {
        ratedWineIds.add(wine.id);
      }
    });

    const completedCount = ratedWineIds.size;

    let status = "Offen";
    if (totalWines > 0 && completedCount === totalWines) {
      status = "Vollständig";
    } else if (completedCount > 0) {
      status = "Teilweise";
    }

    const subject = encodeURIComponent(
      `Bitte Bewertung nachholen: Tasting vom ${new Date(
        tasting.tasting_date
      ).toLocaleDateString("de-DE")}`
    );

    const body = encodeURIComponent(
      `Hallo ${member.display_name ?? ""},

bitte trage deine Bewertung für das Tasting vom ${new Date(
        tasting.tasting_date
      ).toLocaleDateString("de-DE")} nach.

Viele Grüße
Vinum et Veritas`
    );

    return {
      memberId: member.id,
      displayName: member.display_name ?? "Unbekannt",
      role: member.role ?? null,
      email: member.email ?? null,
      completedCount,
      totalWines,
      status,
      mailto:
        member.email != null
          ? `mailto:${member.email}?subject=${subject}&body=${body}`
          : null,
    };
  });

  const fullyCompletedMembers = reviewRows.filter(
    (row) => row.status === "Vollständig"
  ).length;

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Reviews prüfen"
        badge="Admin"
        title="Reviews prüfen"
        description="Hier siehst du den Bewertungsfortschritt der Mitglieder für dieses Tasting."
      />

      <Section>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            kicker="Verwaltung"
            title={`Tasting vom ${new Date(tasting.tasting_date).toLocaleDateString("de-DE")}`}
            noMargin
          />

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/dashboard/admin/tastings/${tasting.id}/edit`}
              className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
            >
              Tasting bearbeiten
            </Link>

            <Link
              href="/dashboard/admin/tastings"
              className="inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
            >
              Zur Übersicht
            </Link>
          </div>
        </div>

        <ComicCard className="mb-10 relative overflow-hidden px-6 pb-8 pt-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                Tasting-Datum
              </div>
              <div className="mt-2 text-2xl font-black uppercase">
                {new Date(tasting.tasting_date).toLocaleDateString("de-DE")}
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                Gastgeber
              </div>
              <div className="mt-2 text-2xl font-black uppercase">
                {tasting.members?.display_name ?? "Unbekannt"}
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                Weine
              </div>
              <div className="mt-2 text-2xl font-black uppercase">
                {totalWines}
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                Vollständig
              </div>
              <div className="mt-2 text-2xl font-black uppercase">
                {fullyCompletedMembers} / {reviewRows.length}
              </div>
            </div>
          </div>
        </ComicCard>

        {reviewRows.length === 0 ? (
          <ComicCard className="px-6 py-8">
            <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
              Hinweis
            </div>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">
              Keine Mitglieder gefunden
            </h2>

            <p className="mt-4 text-neutral-700">
              Es sind aktuell keine aktiven Mitglieder hinterlegt.
            </p>
          </ComicCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviewRows.map((row) => {
              const isComplete = row.status === "Vollständig";
              const isPartial = row.status === "Teilweise";

              return (
                <ComicCard
                  key={row.memberId}
                  className="relative overflow-hidden px-6 pb-10 pt-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
                      Mitglied
                    </div>

                    <div
                      className={`text-xs font-black uppercase tracking-[0.2em] ${
                        isComplete
                          ? "text-green-700"
                          : isPartial
                            ? "text-amber-700"
                            : "text-neutral-500"
                      }`}
                    >
                      {row.status}
                    </div>
                  </div>

                  <h2 className="mt-3 text-2xl font-black uppercase leading-tight">
                    {row.displayName}
                  </h2>

                  <div className="mt-5 space-y-2 text-sm leading-6 text-neutral-700">
                    <p>
                      <span className="font-black uppercase text-black">
                        Fortschritt:
                      </span>{" "}
                      {row.completedCount} / {row.totalWines} Weine bewertet
                    </p>

                    {row.role ? (
                      <p>
                        <span className="font-black uppercase text-black">
                          Rolle:
                        </span>{" "}
                        {row.role}
                      </p>
                    ) : null}

                    {row.email ? (
                      <p className="break-all">
                        <span className="font-black uppercase text-black">
                          E-Mail:
                        </span>{" "}
                        {row.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 border-t-2 border-black pt-4">
                    <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                      Status
                    </div>

                    <div className="text-lg font-black">
                      {row.completedCount === 0
                        ? "Noch keine Bewertung"
                        : row.completedCount === row.totalWines
                          ? "Alle Weine bewertet"
                          : "Bewertung unvollständig"}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/admin/tastings/${tasting.id}/reviews/${row.memberId}`}
                      className="inline-flex border-2 border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                    >
                      Bewertung nachpflegen
                    </Link>

                    {row.mailto && row.status !== "Vollständig" ? (
                      <a
                        href={row.mailto}
                        className="inline-flex border-2 border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
                      >
                        Erinnern
                      </a>
                    ) : null}
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