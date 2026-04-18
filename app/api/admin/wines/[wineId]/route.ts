import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    wineId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    const member = await prisma.members.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    const role = String(member?.role ?? "").toUpperCase();
    const isAdmin = role === "ADMIN" || role === "PRESIDENT";

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Keine Berechtigung." },
        { status: 403 }
      );
    }

    const { wineId } = await context.params;
    const id = Number(wineId);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Ungültige Wein-ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedWine = await prisma.wines.update({
      where: { id },
      data: {
        producer: body.producer,
        wine_name: body.wine_name,
        vintage: body.vintage,
        country: body.country,
        region: body.region,
        grape_variety: body.grape_variety,
        alcohol_pct: body.alcohol_pct,
        price_eur: body.price_eur,
        comment: body.comment,
      },
    });

    return NextResponse.json(updatedWine);
  } catch (error) {
    console.error("PATCH /api/admin/wines/[wineId] Fehler:", error);
    return NextResponse.json(
      { error: "Der Wein konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}