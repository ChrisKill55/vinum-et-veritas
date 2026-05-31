"use client";

import { useState } from "react";
import ComicCard from "@/app/components/ui/ComicCard";
import WineGlassRating from "@/app/components/ui/WineGlassRating";
import Link from "next/link";

type TopWineItem = {
  id: number;
  producer: string | null;
  wine_name: string | null;
  vintage: number | null;
  country: string | null;
  comment: string | null;
  average: number | null;
  ratingCount: number;
};

type TopWinesListProps = {
  initialWines: TopWineItem[];
  initialQuery?: string;
  isAdmin?: boolean;
};

const PAGE_SIZE = 12;

function getTopWineDisplayName(wine: TopWineItem) {
  const wineName = wine.wine_name?.trim();
  const producer = wine.producer?.trim();
  const wineNameWithVintage = [wineName, wine.vintage]
    .filter(Boolean)
    .join(" ");

  if (wineName && producer && wineName === producer) {
    return wineNameWithVintage;
  }

  return [wineNameWithVintage, producer].filter(Boolean).join(" | ");
}

export default function TopWinesList({
  initialWines,
  initialQuery = "",
  isAdmin = false,
}: TopWinesListProps) {
  const [wines, setWines] = useState<TopWineItem[]>(initialWines);
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialWines.length === PAGE_SIZE);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(formData: FormData) {
    const nextQuery = String(formData.get("q") ?? "").trim();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/top-wines?skip=0&take=${PAGE_SIZE}&q=${encodeURIComponent(
          nextQuery
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const text = await response.text();

      if (!response.ok) {
        console.error("API Response Status:", response.status);
        console.error("API Response Body:", text);
        setError("Die Suche konnte nicht ausgeführt werden.");
        setLoading(false);
        return;
      }

      const nextWines = JSON.parse(text) as TopWineItem[];

      if (!Array.isArray(nextWines)) {
        setError("Die Suche konnte nicht ausgeführt werden.");
        setLoading(false);
        return;
      }

      setQuery(nextQuery);
      setWines(nextWines);
      setHasMore(nextWines.length === PAGE_SIZE);
    } catch (err) {
      console.error("Fehler bei der Weinsuche:", err);
      setError("Die Suche konnte nicht ausgeführt werden.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/top-wines?skip=${wines.length}&take=${PAGE_SIZE}&q=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const text = await response.text();

      if (!response.ok) {
        console.error("API Response Status:", response.status);
        console.error("API Response Body:", text);
        setError("Weitere Weine konnten nicht geladen werden.");
        setHasMore(false);
        return;
      }

      const nextWines = JSON.parse(text) as TopWineItem[];

      if (!Array.isArray(nextWines)) {
        setError("Weitere Weine konnten nicht geladen werden.");
        setHasMore(false);
        return;
      }

      if (nextWines.length === 0) {
        setHasMore(false);
        return;
      }

      setWines((prev) => [...prev, ...nextWines]);

      if (nextWines.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Fehler beim Laden weiterer Weine:", err);
      setError("Weitere Weine konnten nicht geladen werden.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ComicCard className="relative mb-10 overflow-hidden px-6 pb-8 pt-6">
        <div className="mb-2 text-sm font-black uppercase tracking-[0.3em] text-red-700">
          Weinsuche
        </div>

        <h2 className="text-3xl font-black uppercase tracking-tight">
          Finde Weine im Ranking
        </h2>

        <form
  action={handleSearch}
  className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]"
>
  <input
    type="text"
    name="q"
    defaultValue={query}
    placeholder="z. B. Barolo, Cusumano, Italien, Riesling ..."
    className="w-full min-w-0 border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
  />

  <div className="grid gap-3 sm:grid-cols-2 md:flex">
    <button
      type="submit"
      disabled={loading}
      className="w-full border-2 border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-red-700 md:w-auto"
    >
      {loading ? "Suche läuft..." : "Suchen"}
    </button>

    <button
      type="button"
      onClick={() => {
        window.location.href = "/top-weine";
      }}
      className="w-full border-2 border-black bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5 md:w-auto"
    >
      Zurücksetzen
    </button>
  </div>
</form>
      </ComicCard>

      <div className="mb-14 max-w-3xl">
        <div className="lg:hidden">
          <ComicCard className="relative overflow-hidden px-6 pb-8 pt-6">
            <div className="text-[0.7rem] font-black uppercase tracking-[0.32em] text-red-700">
              Hinweis des Weinclubs
            </div>

            <div className="mt-5">
              <p className="text-sm leading-7 text-neutral-700">
                Die hier dargestellten Bewertungen spiegeln ausschließlich die
                persönlichen Eindrücke der Mitglieder unseres Weinclubs wider.
                Geschmack ist subjektiv und hängt stark von Situation,
                Umgebung, Stimmung sowie der Kombination mit Speisen ab.
              </p>

              <p className="mt-4 text-sm leading-7 text-neutral-700">
                Ein Wein kann unter anderen Bedingungen, in einer anderen Runde
                oder in Kombination mit anderen Speisen durchaus völlig anders
                wahrgenommen werden. Die Bewertungen verstehen sich daher
                ausdrücklich als persönliche Geschmackseindrücke und nicht als
                objektive Qualitätsurteile.
              </p>
            </div>
          </ComicCard>
        </div>

        <div className="hidden lg:block">
          <div className="text-[0.7rem] font-black uppercase tracking-[0.32em] text-red-700">
            Hinweis des Weinclubs
          </div>

          <div className="mt-4 max-w-2xl border-l-4 border-black pl-5">
            <p className="text-base leading-8 text-neutral-700">
              Die hier dargestellten Bewertungen spiegeln ausschließlich die
              persönlichen Eindrücke der Mitglieder unseres Weinclubs wider.
              Geschmack ist subjektiv und hängt stark von Situation, Umgebung,
              Stimmung sowie der Kombination mit Speisen ab.
            </p>

            <p className="mt-4 text-base leading-8 text-neutral-700">
              Ein Wein kann unter anderen Bedingungen, in einer anderen Runde
              oder in Kombination mit anderen Speisen durchaus völlig anders
              wahrgenommen werden. Die Bewertungen verstehen sich daher
              ausdrücklich als persönliche Geschmackseindrücke und nicht als
              objektive Qualitätsurteile.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
        {query
          ? `${wines.length} Treffer für „${query}“`
          : `${wines.length} Wein${wines.length === 1 ? "" : "e"} angezeigt`}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {wines.map((wine, index) => {
          const wineLabel = getTopWineDisplayName(wine);

          return (
            <ComicCard
              key={wine.id}
              className="relative flex h-full flex-col overflow-hidden px-6 pb-12 pt-6 transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
                  Platz #{index + 1}
                </div>

                <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  {wine.ratingCount} Bewertung
                  {wine.ratingCount === 1 ? "" : "en"}
                </div>
              </div>

              <h3 className="mt-3 break-words text-2xl font-black uppercase leading-tight">
                {wineLabel}
              </h3>

              <div className="mt-4 text-sm text-neutral-600">
                {wine.country || "Unbekannt"}
              </div>

              <div className="mt-6 border-t-2 border-black pt-5">
                <div className="mb-3 flex flex-col gap-3">
                  <WineGlassRating value={wine.average ?? 0} />

                  <div className="text-lg font-black">
                    {wine.average?.toFixed(1)} / 10
                  </div>
                </div>
              </div>

              <div className="mt-6 flex-1 border-t-2 border-black pt-5">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                  Gruppenstatement
                </div>

                {wine.comment ? (
                  <p className="line-clamp-4 text-sm leading-7 text-neutral-700">
                    {wine.comment}
                  </p>
                ) : (
                  <p className="text-sm leading-7 text-neutral-400">
                    Kein Gruppenstatement vorhanden.
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/wines/${wine.id}`}
                  className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:bg-red-700"
                >
                  Wein-Details
                </Link>

                {isAdmin && (
                  <Link
                    href={`/dashboard/wines/${wine.id}/edit`}
                    className="inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
                  >
                    Bearbeiten
                  </Link>
                )}
              </div>
            </ComicCard>
          );
        })}
      </div>

      {error ? (
        <div className="mt-12 flex justify-center">
          <div className="border-2 border-red-700 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-700">
            {error}
          </div>
        </div>
      ) : hasMore ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className={`border-2 border-black px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition ${
              loading
                ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                : "bg-white text-black hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Weitere Weine werden geladen ..." : "Mehr Weine laden"}
          </button>
        </div>
      ) : null}
    </>
  );
}
