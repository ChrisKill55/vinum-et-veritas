import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";

export default async function AdminDashboardPage() {
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

  const role = String(member.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Adminbereich"
        badge="Admin"
        title="Adminbereich"
        description="Verwaltung von Tastings, Weinen und später auch Reviews und Mitgliedern."
      />

      <Section>
        <SectionHeader kicker="Verwaltung" title="Admin-Funktionen" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <ComicCard className="relative overflow-hidden px-6 pb-12 pt-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Tasting
            </div>

            <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
              Neues Tasting anlegen
            </h3>

            <p className="mt-5 text-sm leading-7 text-neutral-700">
              Lege ein neues Tasting an und füge direkt die Weine des Abends hinzu.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard/admin/tastings/new"
                prefetch={false}
                className="relative z-10 inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
              >
                Neues Tasting
              </Link>
            </div>
          </ComicCard>

          <ComicCard className="relative overflow-hidden px-6 pb-12 pt-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Übersicht
            </div>

            <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
              Tastings verwalten
            </h3>

            <p className="mt-5 text-sm leading-7 text-neutral-700">
              Öffne alle bestehenden Tastings, bearbeite Einträge und springe in
              die Review-Übersichten.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard/admin/tastings"
                prefetch={false}
                className="relative z-10 inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
              >
                Zur Übersicht
              </Link>
            </div>
          </ComicCard>
        </div>
      </Section>
    </div>
  );
}