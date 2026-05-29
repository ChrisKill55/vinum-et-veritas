import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasAllowedImageSignature(buffer: Buffer, contentType: string) {
  if (contentType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (contentType === "image/png") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );
  }

  if (contentType === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

function getFileExtension(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

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

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Nur JPG-, PNG- und WebP-Bilder sind erlaubt." },
        { status: 400 }
      );
    }

    if (file.size < 1 || file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Das Bild darf maximal 5 MB groß sein." },
        { status: 400 }
      );
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

    if (!hasAllowedImageSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "Die Bilddatei konnte nicht validiert werden." },
        { status: 400 }
      );
    }

    const extension = getFileExtension(file.type);
    const blob = await put(`wine-images/${wineId}/${Date.now()}.${extension}`, buffer, {
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
