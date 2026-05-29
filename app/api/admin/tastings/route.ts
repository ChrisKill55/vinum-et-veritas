import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureOpenRatingsForTasting } from "@/lib/tasting-ratings";

type IncomingWine = {
  sequence_no: number;
  producer: string | null;
  wine_name: string | null;
  vintage: number | null;
  country: string | null;
  region: string | null;
  grape_variety: string | null;
  alcohol_pct: number | null;
  price_eur: number | null;
  comment: string | null;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const currentMember = await prisma.members.findUnique({
      where: { email: session.user.email },
    });

    if (!currentMember) {
      return NextResponse.json(
        { error: "Mitglied nicht gefunden." },
        { status: 403 }
      );
    }

    const role = String(currentMember.role ?? "").toUpperCase();
    const isAdmin = role === "ADMIN" || role === "PRESIDENT";

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Keine Berechtigung." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const tastingDateRaw = body?.tasting_date;
    const memberId = Number(body?.member_id);
    const wines = Array.isArray(body?.wines)
      ? (body.wines as IncomingWine[])
      : [];

    if (!tastingDateRaw || typeof tastingDateRaw !== "string") {
      return NextResponse.json(
        { error: "Bitte ein gültiges Tasting-Datum angeben." },
        { status: 400 }
      );
    }

    const tastingDate = new Date(`${tastingDateRaw}T12:00:00`);

    if (Number.isNaN(tastingDate.getTime())) {
      return NextResponse.json(
        { error: "Das Tasting-Datum konnte nicht verarbeitet werden." },
        { status: 400 }
      );
    }

    if (Number.isNaN(memberId)) {
      return NextResponse.json(
        { error: "Bitte einen Gastgeber auswählen." },
        { status: 400 }
      );
    }

    const hostExists = await prisma.members.findUnique({
      where: { id: memberId },
      select: { id: true },
    });

    if (!hostExists) {
      return NextResponse.json(
        { error: "Der ausgewählte Gastgeber existiert nicht." },
        { status: 400 }
      );
    }

    if (wines.length < 1) {
      return NextResponse.json(
        { error: "Ein Tasting muss mindestens einen Wein enthalten." },
        { status: 400 }
      );
    }

    const invalidWine = wines.some(
      (wine) => !(wine.producer?.trim() || wine.wine_name?.trim())
    );

    if (invalidWine) {
      return NextResponse.json(
        {
          error:
            "Jeder Wein braucht mindestens einen Produzenten oder einen Weinnamen.",
        },
        { status: 400 }
      );
    }

    const tasting = await prisma.tastings.create({
      data: {
        tasting_date: tastingDate,
        members: {
          connect: { id: memberId },
        },
      },
    });

    await prisma.wines.createMany({
      data: wines.map((wine, index) => {
        const fallbackProducer =
          wine.producer?.trim() || wine.wine_name?.trim() || "Unbekannt";

        const fallbackWineName =
          wine.wine_name?.trim() || wine.producer?.trim() || "Unbekannt";

        return {
          tasting_id: tasting.id,
          sequence_no: index + 1,
          producer: fallbackProducer,
          wine_name: fallbackWineName,
          vintage: wine.vintage,
          country: wine.country,
          region: wine.region,
          grape_variety: wine.grape_variety,
          alcohol_pct: wine.alcohol_pct,
          price_eur: wine.price_eur,
          comment: wine.comment,
        };
      }),
    });

    await ensureOpenRatingsForTasting(tasting.id);

    return NextResponse.json({
      ok: true,
      tastingId: tasting.id,
    });
  } catch (error) {
    console.error("Fehler beim Anlegen des Tastings:", error);

    const message =
      error instanceof Error ? error.message : "Unbekannter Serverfehler";

    return NextResponse.json(
      {
        error: `Das Tasting konnte serverseitig nicht gespeichert werden: ${message}`,
      },
      { status: 500 }
    );
  }
}
