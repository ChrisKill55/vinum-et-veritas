import { prisma } from "@/lib/prisma";

export async function ensureOpenRatingsForTasting(tastingId: number) {
  const [members, wines] = await Promise.all([
    prisma.members.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
      },
    }),
    prisma.wines.findMany({
      where: {
        tasting_id: tastingId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (members.length === 0 || wines.length === 0) {
    return;
  }

  await prisma.ratings.createMany({
    data: wines.flatMap((wine) =>
      members.map((member) => ({
        wine_id: wine.id,
        member_id: member.id,
      }))
    ),
    skipDuplicates: true,
  });
}
