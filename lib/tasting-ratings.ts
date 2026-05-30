import { prisma } from "@/lib/prisma";

export type TastingParticipantInput = {
  memberIds: number[];
  guestNames: string[];
};

function uniqueNumbers(values: number[]) {
  return Array.from(
    new Set(values.filter((value) => Number.isInteger(value) && value > 0))
  );
}

function uniqueGuestNames(values: string[]) {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLocaleLowerCase("de-DE");

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

export async function syncTastingParticipants(
  tastingId: number,
  input: TastingParticipantInput
) {
  const memberIds = uniqueNumbers(input.memberIds);
  const guestNames = uniqueGuestNames(input.guestNames);

  await prisma.tasting_participants.deleteMany({
    where: {
      tasting_id: tastingId,
      member_id: {
        notIn: memberIds.length > 0 ? memberIds : [-1],
      },
    },
  });

  await prisma.tasting_participants.deleteMany({
    where: {
      tasting_id: tastingId,
      member_id: null,
      guest_name: {
        notIn: guestNames.length > 0 ? guestNames : ["__none__"],
      },
    },
  });

  for (const memberId of memberIds) {
    await prisma.tasting_participants.upsert({
      where: {
        tasting_id_member_id: {
          tasting_id: tastingId,
          member_id: memberId,
        },
      },
      update: {
        guest_name: null,
      },
      create: {
        tasting_id: tastingId,
        member_id: memberId,
      },
    });
  }

  for (const guestName of guestNames) {
    await prisma.tasting_participants.upsert({
      where: {
        tasting_id_guest_name: {
          tasting_id: tastingId,
          guest_name: guestName,
        },
      },
      update: {
        member_id: null,
      },
      create: {
        tasting_id: tastingId,
        guest_name: guestName,
      },
    });
  }

  await ensureOpenRatingsForTasting(tastingId);
}

export async function ensureOpenRatingsForTasting(tastingId: number) {
  const [participants, wines] = await Promise.all([
    prisma.tasting_participants.findMany({
      where: {
        tasting_id: tastingId,
      },
      select: {
        id: true,
        member_id: true,
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

  if (participants.length === 0 || wines.length === 0) {
    return;
  }

  await prisma.ratings.createMany({
    data: wines.flatMap((wine) =>
      participants.map((participant) => ({
        wine_id: wine.id,
        member_id: participant.member_id,
        participant_id: participant.id,
      }))
    ),
    skipDuplicates: true,
  });
}
