import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";

type PageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminWinesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const member = await prisma.members.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  const role = String(member?.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = (resolvedSearchParams.q ?? "").trim();

  const wines = await prisma.wines.findMany({
    where: query
      ? {
          OR: [
            {
              producer: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              wine_name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              country: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              region: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              grape_variety: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        }
      : {},
    include: {
      tastings: {
        include: {
          members: {
            select: {
              display_name: true,
              first_name: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        tastings: {
          tasting_date: "desc",
        },
      },
      {
        sequence_no: "asc",
      },
    ],
    take: 100,
  });

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Admin Weinsuche"
        badge="Admin"
        title="Wein suchen & bearbeiten"
        description="Finde Weine über Suchbegriffe und springe direkt in die Bearbeitung."
      />

      <Section>
        <SectionHeader
          kicker="Verwaltung"
          title="Zentrale Weinpflege"
        />

        <ComicCard className="relative mb-10 overflow-hidden px-6 pb-8 pt-6">
        <form
  action="/dashboard/admin/wines"
  className="grid gap-4 md:grid-cols-[1fr_auto]"
>
  <div>
    <label
      htmlFor="q"
      className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
    >
      Suche
    </label>

    <input
      id="q"
      name="q"
      type="text"
      defaultValue={query}
      placeholder="z. B. Barolo, Cusumano, Italien, 2018 ..."
      className="w-full min-w-0 border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
    />
  </div>

  <div className="grid gap-3 sm:grid-cols-2 md:flex md:items-end">
    <button
      type="submit"
      className="w-full border-2 border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 md:w-auto"
    >
      Suchen
    </button>

    <Link
      href="/dashboard/admin/wines"
      className="w-full border-2 border-black bg-white px-5 py-3 text-center text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5 md:w-auto"
    >
      Zurücksetzen
    </Link>
  </div>
</form>  
        </ComicCard>

        <div className="mb-8 text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
          {query
            ? `${wines.length} Treffer für „${query}“`
            : `${wines.length} Weine angezeigt`}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wines.map((wine) => {
            const wineLabel =
              wine.producer &&
              wine.wine_name &&
              wine.producer === wine.wine_name
                ? wine.wine_name
                : [wine.producer, wine.wine_name].filter(Boolean).join(" ");

            const hostName =
              wine.tastings.members?.display_name ??
              wine.tastings.members?.first_name ??
              "Unbekannt";

            return (
              <ComicCard
                key={wine.id}
                className="relative flex h-full flex-col overflow-hidden px-6 pb-12 pt-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
                    Tasting vom{" "}
                    {new Date(wine.tastings.tasting_date).toLocaleDateString("de-DE")}
                  </div>

                  <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                    Flight #{wine.sequence_no}
                  </div>
                </div>

                <h3 className="mt-3 break-words text-2xl font-black uppercase leading-tight">
                  {[wineLabel, wine.vintage].filter(Boolean).join(" ")}
                </h3>

                <div className="mt-4 space-y-2 text-sm leading-6 text-neutral-700">
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

                  <p>
                    <span className="font-black uppercase text-black">
                      Region:
                    </span>{" "}
                    {wine.region || "Unbekannt"}
                  </p>

                  <p>
                    <span className="font-black uppercase text-black">
                      Rebsorte:
                    </span>{" "}
                    {wine.grape_variety || "Unbekannt"}
                  </p>
                </div>

                {wine.comment ? (
                  <div className="mt-6 flex-1 border-t-2 border-black pt-5">
                    <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                      Gruppenstatement
                    </div>

                    <p className="line-clamp-4 text-sm leading-7 text-neutral-700">
                      {wine.comment}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 flex-1 border-t-2 border-black pt-5">
                    <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                      Gruppenstatement
                    </div>

                    <p className="text-sm leading-7 text-neutral-400">
                      Kein Gruppenstatement vorhanden.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/wines/${wine.id}`}
                    className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-red-700"
                  >
                    Wein-Details
                  </Link>

                  <Link
                    href={`/dashboard/wines/${wine.id}/edit`}
                    className="inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
                  >
                    Bearbeiten
                  </Link>
                </div>
              </ComicCard>
            );
          })}
        </div>

        {wines.length === 0 ? (
          <ComicCard className="mt-10 overflow-hidden px-6 py-8">
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
              Keine Treffer
            </div>

            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
              Zu deiner Suche wurden keine Weine gefunden
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-700">
              Versuche einen anderen Suchbegriff, zum Beispiel Produzent,
              Weinname, Land oder Region.
            </p>
          </ComicCard>
        ) : null}
      </Section>
    </div>
  );
}