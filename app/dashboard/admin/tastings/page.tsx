import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";
import DeleteTastingButton from "./delete-tasting-button";

export default async function AdminTastingsPage() {
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

  const tastings = await prisma.tastings.findMany({
    orderBy: {
      tasting_date: "desc",
    },
    include: {
      members: true,
      _count: {
        select: {
          wines: true,
        },
      },
    },
  });

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Tastings verwalten"
        badge="Admin"
        title="Tastings verwalten"
        description="Übersicht aller Tastings. Von hier aus kannst du Tastings ansehen, bearbeiten, Reviews prüfen oder löschen."
      />

      <Section>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            kicker="Übersicht"
            title="Alle Tastings"
            noMargin
          />

          <Link
            href="/dashboard/admin/tastings/new"
            className="inline-flex border-2 border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
          >
            Neues Tasting
          </Link>
        </div>

        {tastings.length === 0 ? (
          <ComicCard className="px-6 py-8">
            <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
              Hinweis
            </div>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">
              Noch keine Tastings vorhanden
            </h2>

            <p className="mt-4 text-neutral-700">
              Es wurden bisher noch keine Tastings angelegt.
            </p>
          </ComicCard>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {tastings.map((tasting) => {
              const tastingDate = new Date(tasting.tasting_date);

              return (
                <ComicCard
                  key={tasting.id}
                  className="relative overflow-hidden px-6 pb-8 pt-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                      Tasting
                    </div>

                    <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                      {tasting._count.wines} Wein
                      {tasting._count.wines === 1 ? "" : "e"}
                    </div>
                  </div>

                  <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
                    {tastingDate.toLocaleDateString("de-DE")}
                  </h2>

                  <div className="mt-5 space-y-2">
                    <div className="text-sm uppercase tracking-widest text-neutral-500">
                      Gastgeber
                    </div>

                    <div className="text-lg font-black text-black">
                      {tasting.members?.display_name ?? "Unbekannt"}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/tastings/${tasting.id}`}
                      className="inline-flex border-2 border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
                    >
                      Ansehen
                    </Link>

                    <Link
                      href={`/dashboard/admin/tastings/${tasting.id}/edit`}
                      className="inline-flex border-2 border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                    >
                      Bearbeiten
                    </Link>

                    <Link
                      href={`/dashboard/admin/tastings/${tasting.id}/reviews`}
                      className="inline-flex border-2 border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
                    >
                      Reviews
                    </Link>

                    <DeleteTastingButton tastingId={tasting.id} />
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