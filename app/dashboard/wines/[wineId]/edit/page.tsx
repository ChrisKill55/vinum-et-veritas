import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import EditWineForm from "./edit-wine-form";

export const dynamic = "force-dynamic";
type PageProps = {
  params: Promise<{
    wineId: string;
  }>;
};

export default async function EditWinePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const member = await prisma.members.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!member) {
    redirect("/login");
  }

  const role = String(member.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const { wineId } = await params;
  const id = Number(wineId);

  if (Number.isNaN(id)) {
    notFound();
  }

  const wine = await prisma.wines.findUnique({
    where: { id },
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
  });

  if (!wine) {
    notFound();
  }

  const wineTitle =
    wine.producer && wine.wine_name && wine.producer === wine.wine_name
      ? wine.wine_name
      : [wine.producer, wine.wine_name].filter(Boolean).join(" ");

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Wein bearbeiten"
        badge="Admin"
        title="Wein bearbeiten"
        description="Pflege Stammdaten, Herkunft, Preis und Gruppenstatement des ausgewählten Weins."
      />

      <Section>
        <SectionHeader
          kicker="Verwaltung"
          title={wineTitle || `Wein #${wine.id}`}
        />

        <div className="mb-10 grid gap-6 md:grid-cols-4">
          <div className="border-2 border-black bg-white px-5 py-5">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              Tasting
            </div>
            <div className="mt-2 text-2xl font-black uppercase">
              {new Date(wine.tastings.tasting_date).toLocaleDateString("de-DE")}
            </div>
          </div>

          <div className="border-2 border-black bg-white px-5 py-5">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              Gastgeber
            </div>
            <div className="mt-2 text-2xl font-black uppercase">
              {wine.tastings.members?.display_name ??
                wine.tastings.members?.first_name ??
                "Unbekannt"}
            </div>
          </div>

          <div className="border-2 border-black bg-white px-5 py-5">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              Flight
            </div>
            <div className="mt-2 text-2xl font-black uppercase">
              #{wine.sequence_no}
            </div>
          </div>

          <div className="border-2 border-black bg-white px-5 py-5">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              Datenbank-ID
            </div>
            <div className="mt-2 text-2xl font-black uppercase">
              {wine.id}
            </div>
          </div>
        </div>

        <EditWineForm
          wineId={wine.id}
          initialWine={{
            producer: wine.producer ?? "",
            wine_name: wine.wine_name ?? "",
            vintage: wine.vintage != null ? String(wine.vintage) : "",
            country: wine.country ?? "",
            region: wine.region ?? "",
            grape_variety: wine.grape_variety ?? "",
            alcohol_pct:
              wine.alcohol_pct != null ? String(wine.alcohol_pct) : "",
            price_eur: wine.price_eur != null ? String(wine.price_eur) : "",
            comment: wine.comment ?? "",
          }}
        />
      </Section>
    </div>
  );
}