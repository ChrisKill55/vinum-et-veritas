import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureOpenRatingsForTasting } from "@/lib/tasting-ratings";

type IncomingWine = {
  id?: number | null;
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
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

    const { id } = await params;
    const tastingId = Number(id);

    if (Number.isNaN(tastingId)) {
      return NextResponse.json(
        { error: "Ungültige Tasting-ID." },
        { status: 400 }
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

    await prisma.tastings.update({
      where: { id: tastingId },
      data: {
        tasting_date: tastingDate,
        members: {
          connect: { id: memberId },
        },
      },
    });

    const existingWines = await prisma.wines.findMany({
      where: { tasting_id: tastingId },
      select: { id: true },
    });

    const incomingWineIds = wines
      .map((wine) => wine.id)
      .filter((wineId): wineId is number => typeof wineId === "number");

    const idsToDelete = existingWines
      .map((wine) => wine.id)
      .filter((existingId) => !incomingWineIds.includes(existingId));

    if (idsToDelete.length > 0) {
      await prisma.wines.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });
    }

    for (let i = 0; i < wines.length; i += 1) {
      const wine = wines[i];

      const fallbackProducer =
        wine.producer?.trim() || wine.wine_name?.trim() || "Unbekannt";

      const fallbackWineName =
        wine.wine_name?.trim() || wine.producer?.trim() || "Unbekannt";

      if (wine.id) {
        await prisma.wines.update({
          where: { id: wine.id },
          data: {
            sequence_no: i + 1,
            producer: fallbackProducer,
            wine_name: fallbackWineName,
            vintage: wine.vintage,
            country: wine.country,
            region: wine.region,
            grape_variety: wine.grape_variety,
            alcohol_pct: wine.alcohol_pct,
            price_eur: wine.price_eur,
            comment: wine.comment,
          },
        });
      } else {
        await prisma.wines.create({
          data: {
            tasting_id: tastingId,
            sequence_no: i + 1,
            producer: fallbackProducer,
            wine_name: fallbackWineName,
            vintage: wine.vintage,
            country: wine.country,
            region: wine.region,
            grape_variety: wine.grape_variety,
            alcohol_pct: wine.alcohol_pct,
            price_eur: wine.price_eur,
            comment: wine.comment,
          },
        });
      }
    }

    await ensureOpenRatingsForTasting(tastingId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tastings:", error);

    const message =
      error instanceof Error ? error.message : "Unbekannter Serverfehler";

    return NextResponse.json(
      {
        error: `Das Tasting konnte serverseitig nicht aktualisiert werden: ${message}`,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
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

    const { id } = await params;
    const tastingId = Number(id);

    if (Number.isNaN(tastingId)) {
      return NextResponse.json(
        { error: "Ungültige Tasting-ID." },
        { status: 400 }
      );
    }

    await prisma.ratings.deleteMany({
      where: {
        wines: {
          tasting_id: tastingId,
        },
      },
    });

    await prisma.wines.deleteMany({
      where: {
        tasting_id: tastingId,
      },
    });

    await prisma.tastings.delete({
      where: {
        id: tastingId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Fehler beim Löschen des Tastings:", error);

    const message =
      error instanceof Error ? error.message : "Unbekannter Serverfehler";

    return NextResponse.json(
      {
        error: `Das Tasting konnte serverseitig nicht gelöscht werden: ${message}`,
      },
      { status: 500 }
    );
  }
}
