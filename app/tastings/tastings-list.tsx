"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ComicGallerySection from "@/app/components/ui/ComicGallerySection";

type TastingListItem = {
  id: number;
  tasting_date: string;
  notes: string | null;
  hostName: string;
  avatarDescription: string;
  avatarSrc: string;
  wineCount: number;
};

type TastingsListProps = {
  initialTastings: TastingListItem[];
};

const PAGE_SIZE = 7;

export default function TastingsList({
  initialTastings,
}: TastingsListProps) {
  const [tastings, setTastings] = useState<TastingListItem[]>(initialTastings);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTastings.length === PAGE_SIZE);
  const [error, setError] = useState<string | null>(null);

  async function loadMore() {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/tastings?skip=${tastings.length}&take=${PAGE_SIZE}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const text = await response.text();

      if (!response.ok) {
        console.error("API Response Status:", response.status);
        console.error("API Response Body:", text);
        setError("Weitere Tastings konnten nicht geladen werden.");
        setHasMore(false);
        return;
      }

      const nextTastings = JSON.parse(text) as TastingListItem[];

      if (!Array.isArray(nextTastings)) {
        console.error("Ungültige API-Antwort:", nextTastings);
        setError("Weitere Tastings konnten nicht geladen werden.");
        setHasMore(false);
        return;
      }

      if (nextTastings.length === 0) {
        setHasMore(false);
        return;
      }

      setTastings((prev) => [...prev, ...nextTastings]);

      if (nextTastings.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Fehler beim Laden weiterer Tastings:", err);
      setError("Weitere Tastings konnten nicht geladen werden.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  if (tastings.length === 0) {
    return (
      <div className="comic-card comic-card-soft px-6 py-8">
        Noch keine Tastings vorhanden.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8">
        {tastings.map((tasting) => {
          const date = new Date(tasting.tasting_date);
          const day = date.toLocaleDateString("de-DE", { day: "2-digit" });
          const month = date.toLocaleDateString("de-DE", { month: "short" });
          const year = date.toLocaleDateString("de-DE", { year: "numeric" });

          return (
            <article
              key={tasting.id}
              className="comic-card comic-card-soft overflow-hidden px-0 py-0"
            >
              <div className="grid md:grid-cols-[140px_1fr]">
                <div className="border-b-2 border-black bg-red-700 p-6 text-white md:border-b-0 md:border-r-2">
                  <div className="mx-auto flex w-full max-w-[88px] flex-col overflow-hidden border-2 border-black bg-white text-black shadow-[4px_4px_0_#111]">
                    <div className="border-b-2 border-black bg-red-700 px-2 py-1 text-center text-xs font-black uppercase tracking-[0.25em] text-white">
                      {month}
                    </div>

                    <div className="px-2 pt-3 text-center text-3xl font-black leading-none">
                      {day}
                    </div>

                    <div className="px-2 pb-3 pt-2 text-center text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
                      {year}
                    </div>
                  </div>

                  <div className="mt-5 text-center text-xs font-black uppercase tracking-[0.22em] text-red-100">
                    Tasting
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                        Weinabend
                      </div>

                      <h2 className="mt-3 text-2xl font-black uppercase tracking-tight md:text-3xl">
                        Tasting vom {date.toLocaleDateString("de-DE")}
                      </h2>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-3 border-2 border-black bg-yellow-100 px-3 py-2">
                          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-black bg-white">
                            <Image
                              src={tasting.avatarSrc}
                              alt={tasting.avatarDescription}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">
                              Gastgeber
                            </div>

                            <div className="text-sm font-black uppercase text-black">
                              {tasting.hostName}
                            </div>
                          </div>
                        </div>

                        <div className="border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em]">
                          🍷 {tasting.wineCount} Wein
                          {tasting.wineCount === 1 ? "" : "e"}
                        </div>
                      </div>

                      {tasting.notes ? (
                        <p className="mt-5 max-w-3xl text-sm leading-7 text-neutral-700">
                          {tasting.notes}
                        </p>
                      ) : (
                        <p className="mt-5 max-w-3xl text-sm leading-7 text-neutral-500">
                          Zu diesem Tasting sind aktuell keine zusätzlichen
                          Notizen hinterlegt.
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Link
                        href={`/tastings/${tasting.id}`}
                        className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                      >
                        Details ansehen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
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
            className={`border-2 border-black bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? "Weitere Tastings werden geladen ..." : "Mehr Tastings anzeigen"}
          </button>
        </div>
      ) : (
        <div className="mt-12 flex justify-center">
          <div className="border-2 border-black bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
            Keine weiteren Tastings vorhanden
          </div>
        </div>
      )}

      <ComicGallerySection
        kicker="Comic Galerie"
        title="Abende, Flaschen, Legenden"
        items={[
          {
            src: "/images/comic-gallery-1.jpg",
            alt: "Comic Weinabend 1",
          },
          {
            src: "/images/comic-gallery-2.jpg",
            alt: "Comic Weinabend 2",
          },
          {
            src: "/images/comic-gallery-3.jpg",
            alt: "Comic Weinabend 3",
          },
          {
            src: "/images/comic-gallery-4.jpg",
            alt: "Comic Weinabend 4",
          },
          {
            src: "/images/comic-gallery-5.jpg",
            alt: "Comic Weinabend 5",
          },
          {
            src: "/images/comic-gallery-6.jpg",
            alt: "Comic Weinabend 6",
          },
        ]}
      />
    </>
  );
}