import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const skip = Number(searchParams.get("skip") ?? 0);
    const take = Number(searchParams.get("take") ?? 12);

    const wines = await prisma.wines.findMany({
      include: {
        ratings: {
          select: {
            overall_score: true,
          },
        },
      },
    });

    const winesWithAverage = wines
      .map((wine) => {
        const values = wine.ratings
          .map((r) =>
            r.overall_score !== null ? Number(r.overall_score) : null
          )
          .filter((v): v is number => v !== null && !Number.isNaN(v));

        const avg =
          values.length > 0
            ? values.reduce((sum, v) => sum + v, 0) / values.length
            : null;

        return {
          id: wine.id,
          producer: wine.producer,
          wine_name: wine.wine_name,
          vintage: wine.vintage,
          country: wine.country,
          comment: wine.comment,
          average: avg,
          ratingCount: values.length,
        };
      })
      .filter((wine) => wine.average !== null)
      .sort((a, b) => (b.average ?? 0) - (a.average ?? 0))
      .slice(skip, skip + take);

    return NextResponse.json(winesWithAverage);
  } catch (error) {
    console.error("API /api/top-wines Fehler:", error);

    return NextResponse.json(
      { error: "Fehler beim Laden weiterer Top-Weine." },
      { status: 500 }
    );
  }
}