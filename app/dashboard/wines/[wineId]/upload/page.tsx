import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";
import WineImageUploadForm from "./wine-image-upload-form";
import { getWineDisplayName } from "@/lib/wine-labels";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    wineId: string;
  }>;
};

export default async function WineImageUploadPage({ params }: PageProps) {
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

  const { wineId } = await params;
  const parsedWineId = Number(wineId);

  if (Number.isNaN(parsedWineId)) {
    notFound();
  }

  const wine = await prisma.wines.findUnique({
    where: {
      id: parsedWineId,
    },
    include: {
      tastings: true,
      ratings: {
        where: {
          member_id: member.id,
        },
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!wine) {
    notFound();
  }

  const role = String(member.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";
  const isParticipant = wine.ratings.length > 0;

  if (!isAdmin && !isParticipant) {
    redirect(`/wines/${wine.id}`);
  }

  const wineLabel = getWineDisplayName(wine);

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Flaschenfoto hochladen"
        badge="Mitgliederbereich"
        title="Flaschenfoto hochladen"
        description="Lade ein Foto hoch und wähle den passenden Bildausschnitt für die Weinseite."
      />

      <Section>
        <SectionHeader
          kicker="Upload"
          title={[wineLabel, wine.vintage].filter(Boolean).join(" ")}
        />

        <ComicCard className="mb-8 relative overflow-hidden px-6 pb-8 pt-6">
          <div className="grid gap-4 text-sm leading-7 text-neutral-700 sm:grid-cols-2">
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
          </div>
        </ComicCard>

        <WineImageUploadForm wineId={wine.id} />
      </Section>
    </div>
  );
}
