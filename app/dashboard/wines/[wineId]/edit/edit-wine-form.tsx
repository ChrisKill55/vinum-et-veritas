"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComicCard from "@/app/components/ui/ComicCard";

type EditWineFormProps = {
  wineId: number;
  initialWine: {
    producer: string;
    wine_name: string;
    vintage: string;
    country: string;
    region: string;
    grape_variety: string;
    alcohol_pct: string;
    price_eur: string;
    comment: string;
  };
};

export default function EditWineForm({
  wineId,
  initialWine,
}: EditWineFormProps) {
  const router = useRouter();

  const [producer, setProducer] = useState(initialWine.producer);
  const [wineName, setWineName] = useState(initialWine.wine_name);
  const [vintage, setVintage] = useState(initialWine.vintage);
  const [country, setCountry] = useState(initialWine.country);
  const [region, setRegion] = useState(initialWine.region);
  const [grapeVariety, setGrapeVariety] = useState(initialWine.grape_variety);
  const [alcoholPct, setAlcoholPct] = useState(initialWine.alcohol_pct);
  const [priceEur, setPriceEur] = useState(initialWine.price_eur);
  const [comment, setComment] = useState(initialWine.comment);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/wines/${wineId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producer: producer.trim() || null,
          wine_name: wineName.trim() || null,
          vintage: vintage ? Number(vintage) : null,
          country: country.trim() || null,
          region: region.trim() || null,
          grape_variety: grapeVariety.trim() || null,
          alcohol_pct: alcoholPct ? Number(alcoholPct) : null,
          price_eur: priceEur ? Number(priceEur) : null,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ?? "Der Wein konnte serverseitig nicht gespeichert werden."
        );
        setIsSaving(false);
        return;
      }

      router.push(`/wines/${wineId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Fehler beim Speichern des Weins.");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ComicCard className="px-6 pb-8 pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Produzent
            </label>
            <input
              value={producer}
              onChange={(e) => setProducer(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              placeholder="Produzent"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Weinname
            </label>
            <input
              value={wineName}
              onChange={(e) => setWineName(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              placeholder="Weinname"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Jahrgang
            </label>
            <input
              value={vintage}
              onChange={(e) => setVintage(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              placeholder="Jahrgang"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Land
            </label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              placeholder="Land"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Region
            </label>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              placeholder="Region"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Rebsorte
            </label>
            <input
              value={grapeVariety}
              onChange={(e) => setGrapeVariety(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              placeholder="Rebsorte"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Alkohol %
            </label>
            <input
              value={alcoholPct}
              onChange={(e) => setAlcoholPct(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              placeholder="z. B. 13.5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Preis €
            </label>
            <input
              value={priceEur}
              onChange={(e) => setPriceEur(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              placeholder="z. B. 19.90"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
            Abschließendes Gruppenstatement
          </label>
          <textarea
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border-2 border-black px-4 py-3"
            placeholder="Gemeinsames Fazit des Weinabends zu diesem Wein..."
          />
        </div>
      </ComicCard>

      {error && (
        <div className="border-2 border-red-700 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="border-2 border-black bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white"
        >
          {isSaving ? "Speichern..." : "Wein speichern"}
        </button>
      </div>
    </form>
  );
}