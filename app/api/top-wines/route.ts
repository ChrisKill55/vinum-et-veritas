import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const skip = Number(searchParams.get("skip") ?? "0");
    const take = Number(searchParams.get("take") ?? "12");
    const query = (searchParams.get("q") ?? "").trim().toLowerCase();

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

        if (values.length === 0) {
          return null;
        }

        const average =
          values.reduce((sum, v) => sum + v, 0) / values.length;

        const searchableText = [
          wine.producer,
          wine.wine_name,
          wine.country,
          wine.region,
          wine.grape_variety,
          wine.vintage != null ? String(wine.vintage) : "",
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return {
          id: wine.id,
          producer: wine.producer,
          wine_name: wine.wine_name,
          vintage: wine.vintage,
          country: wine.country,
          comment: wine.comment,
          average,
          ratingCount: values.length,
          searchableText,
        };
      })
      .filter((wine): wine is NonNullable<typeof wine> => wine !== null)
      .filter((wine) => {
        if (!query) return true;
        return wine.searchableText.includes(query);
      })
      .sort((a, b) => b.average - a.average)
      .slice(skip, skip + take)
      .map((wine) => ({
        id: wine.id,
        producer: wine.producer,
        wine_name: wine.wine_name,
        vintage: wine.vintage,
        country: wine.country,
        comment: wine.comment,
        average: wine.average,
        ratingCount: wine.ratingCount,
      }));

    return NextResponse.json(winesWithAverage);
  } catch (error) {
    console.error("GET /api/top-wines Fehler:", error);
    return NextResponse.json(
      { error: "Top-Weine konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}
