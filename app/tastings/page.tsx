import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import TastingsList from "./tastings-list";
export const dynamic = "force-dynamic";
function getAvatarSrc(displayName?: string | null) {
  const key = displayName?.trim().toLowerCase();

  const avatarMap: Record<string, string> = {
    christian: "/images/avatar-christian.jpg",
    niels: "/images/avatar-niels.jpg",
    torsten: "/images/avatar-torsten.jpg",
    thorsten: "/images/avatar-thorsten.jpg",
    stefan: "/images/avatar-stefan.jpg",
    heiko: "/images/avatar-heiko.jpg",
  };

  return avatarMap[key ?? ""] ?? "/images/avatar-christian.jpg";
}

export default async function TastingsPage() {
  const tastingsRaw = await prisma.tastings.findMany({
    orderBy: { tasting_date: "desc" },
    take: 7,
    include: {
      members: true,
      _count: {
        select: {
          wines: true,
        },
      },
    },
  });

  const initialTastings = tastingsRaw.map((tasting) => ({
  id: tasting.id,
  tasting_date: tasting.tasting_date.toISOString(),
  hostName: tasting.members?.display_name ?? "Unbekannt",
  avatarDescription:
    tasting.members?.avatar_description ??
    `Avatar von ${tasting.members?.display_name ?? "Unbekannt"}`,
  avatarSrc: getAvatarSrc(tasting.members?.display_name),
  wineCount: tasting._count.wines,
}));

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Weinverkostung"
        badge="Archiv"
        title="Alle Tastings"
        description="Chronik der letzten Verkostungen des Weinclubs – als Erinnerungen an besondere Abende und besondere Flaschen."
      />

      <main className="px-6 pt-20">
        <div className="mx-auto max-w-7xl">
          <TastingsList initialTastings={initialTastings} />
        </div>
      </main>
    </div>
  );
}