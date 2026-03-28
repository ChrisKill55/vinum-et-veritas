import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const skip = Number(searchParams.get("skip") ?? 0);
    const take = Number(searchParams.get("take") ?? 12);

    const tastings = await prisma.tastings.findMany({
      orderBy: { tasting_date: "desc" },
      skip,
      take,
      include: {
        members: true,
        _count: {
          select: {
            wines: true,
          },
        },
      },
    });

    const items = tastings.map((tasting) => ({
      id: tasting.id,
      tasting_date: tasting.tasting_date.toISOString(),
      notes: tasting.notes,
      hostName: tasting.members?.display_name ?? "Unbekannt",
      avatarDescription:
        tasting.members?.avatar_description ??
        `Avatar von ${tasting.members?.display_name ?? "Unbekannt"}`,
      avatarSrc: getAvatarSrc(tasting.members?.display_name),
      wineCount: tasting._count.wines,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("API /api/tastings Fehler:", error);

    return NextResponse.json(
      { error: "Fehler beim Laden der Tastings." },
      { status: 500 }
    );
  }
}