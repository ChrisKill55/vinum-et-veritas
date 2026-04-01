import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    const member = await prisma.members.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Mitglied nicht gefunden." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const wineId = Number(formData.get("wineId"));

    if (!(file instanceof File) || Number.isNaN(wineId)) {
      return NextResponse.json({ error: "Ungültige Upload-Daten." }, { status: 400 });
    }

    const wine = await prisma.wines.findUnique({
      where: {
        id: wineId,
      },
      include: {
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
      return NextResponse.json({ error: "Wein nicht gefunden." }, { status: 404 });
    }

    const role = String(member.role ?? "").toUpperCase();
    const isAdmin = role === "ADMIN" || role === "PRESIDENT";
    const isParticipant = wine.ratings.length > 0;

    if (!isAdmin && !isParticipant) {
      return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const blob = await put(`wine-images/${wineId}/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });

    await prisma.$transaction([
      prisma.wine_images.updateMany({
        where: {
          wine_id: wineId,
          is_primary: true,
        },
        data: {
          is_primary: false,
        },
      }),
      prisma.wine_images.create({
        data: {
          wine_id: wineId,
          member_id: member.id,
          image_url: blob.url,
          is_primary: true,
        },
      }),
    ]);

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error("API /api/wine-images/upload Fehler:", error);

    return NextResponse.json(
      { error: "Bild konnte nicht hochgeladen werden." },
      { status: 500 }
    );
  }
}
