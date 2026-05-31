import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";

export const dynamic = "force-dynamic";
export default async function DashboardPage() {
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

  const memberName = currentMember.display_name ?? session.user.name ?? "Clubmitglied";

  const openRatingsCount = await prisma.ratings.count({
    where: {
      member_id: currentMember.id,
      overall_score: null,
    },
  });

  const role = String(currentMember.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Mitgliederbereich"
        badge="Mitgliederbereich"
        title="Dashboard"
        description="Der interne Bereich des Weinclubs für Bewertungen, Tastings und persönliche Einträge."
      />

      <Section>
        <SectionHeader
          kicker="Willkommen"
          title={`Hallo ${memberName}`}
        />

        <div className="mb-12 max-w-3xl">
          <p className="text-base leading-7 text-neutral-700 md:text-lg">
            Hier findest du die wichtigsten Bereiche für den internen Ablauf des
            Weinclubs. Du kannst aktuelle Weine bewerten, deine bisherigen
            Einträge prüfen und im Tasting-Archiv stöbern.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <ComicCard className="relative overflow-hidden px-6 pb-12 pt-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Bewertung
            </div>

            <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
              Aktuelles Tasting bewerten
            </h3>

            <p className="mt-5 text-sm leading-7 text-neutral-700">
              Öffne die aktuelle Verkostung und vergebe deine Bewertungen für
              die Weine des Abends.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard/review/current"
                className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
              >
                Jetzt bewerten
              </Link>
            </div>
          </ComicCard>

          <ComicCard className="relative overflow-hidden px-6 pb-12 pt-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Offene Punkte
            </div>

            <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
              Meine offenen Bewertungen
            </h3>

            <div className="mt-5 text-5xl font-black text-black">
              {openRatingsCount}
            </div>

            <p className="mt-5 text-sm leading-7 text-neutral-700">
              Hier findest du alle Weine, bei denen deine Bewertung noch nicht
              vollständig abgeschlossen ist.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard/offene-bewertungen"
                className="inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
              >
                Offene Bewertungen öffnen
              </Link>
            </div>
          </ComicCard>

          <ComicCard className="relative overflow-hidden px-6 pb-12 pt-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Überblick
            </div>

            <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
              Meine Bewertungen
            </h3>

            <p className="mt-5 text-sm leading-7 text-neutral-700">
              Sieh dir an, welche Weine du bereits bewertet hast und bearbeite
              bestehende Einträge später erneut.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard/ratings"
                className="inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
              >
                Bewertungen ansehen
              </Link>
            </div>
          </ComicCard>

          <ComicCard className="relative overflow-hidden px-6 pb-12 pt-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Archiv
            </div>

            <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
              Tasting-Archiv
            </h3>

            <p className="mt-5 text-sm leading-7 text-neutral-700">
              Springe direkt ins Archiv und gehe durch vergangene Abende,
              Weine und Ergebnisse.
            </p>

            <div className="mt-8">
              <Link
                href="/tastings"
                className="inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
              >
                Archiv öffnen
              </Link>
            </div>
          </ComicCard>

          <ComicCard className="relative overflow-hidden px-6 pb-12 pt-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Konto
            </div>

            <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
              Zugangsdaten
            </h3>

            <p className="mt-5 text-sm leading-7 text-neutral-700">
              Ändere dein persönliches Passwort für den internen
              Mitgliederbereich.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard/account"
                className="inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
              >
                Passwort ändern
              </Link>
            </div>
          </ComicCard>

          {isAdmin ? (
            <ComicCard className="relative overflow-hidden px-6 pb-12 pt-6">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
                Admin
              </div>

              <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
                Adminbereich
              </h3>

              <p className="mt-5 text-sm leading-7 text-neutral-700">
                Öffne den Verwaltungsbereich für Tastings, Reviews und weitere
                interne Funktionen des Weinclubs.
              </p>

              <div className="mt-8">
                <Link
                  href="/dashboard/admin"
                  className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                >
                  Zum Adminbereich
                </Link>
              </div>
            </ComicCard>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
