import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { isPlaceholderWine } from "@/lib/public-wines";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinum-et-veritas.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tastings, wines] = await Promise.all([
    prisma.tastings.findMany({
      select: {
        id: true,
        created_at: true,
        tasting_date: true,
      },
      orderBy: {
        tasting_date: "desc",
      },
    }),
    prisma.wines.findMany({
      select: {
        id: true,
        producer: true,
        wine_name: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    }),
  ]);

  const publicWines = wines.filter((wine) => !isPlaceholderWine(wine));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/top-weine`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tastings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteUrl}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...tastings.map((tasting) => ({
      url: `${siteUrl}/tastings/${tasting.id}`,
      lastModified: tasting.created_at ?? tasting.tasting_date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...publicWines.map((wine) => ({
      url: `${siteUrl}/wines/${wine.id}`,
      lastModified: wine.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
