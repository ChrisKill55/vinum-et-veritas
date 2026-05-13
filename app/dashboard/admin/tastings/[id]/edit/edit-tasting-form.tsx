"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComicCard from "@/app/components/ui/ComicCard";

type WineFormItem = {
  id?: number | null;
  sequence_no: number;
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

type HostOption = {
  id: number;
  display_name: string | null;
};

type EditTastingFormProps = {
  tastingId: number;
  initialDate: string;
  initialMemberId: number;
  hosts?: HostOption[];
  winesInitial?: WineFormItem[];
};

function createEmptyWine(sequenceNo: number): WineFormItem {
  return {
    sequence_no: sequenceNo,
    producer: "",
    wine_name: "",
    vintage: "",
    country: "",
    region: "",
    grape_variety: "",
    alcohol_pct: "",
    price_eur: "",
    comment: "",
  };
}

export default function EditTastingForm({
  tastingId,
  initialDate,
  initialMemberId,
  hosts = [],
  winesInitial = [],
}: EditTastingFormProps) {
  const router = useRouter();

  const normalizedInitialWines =
    winesInitial.length > 0 ? winesInitial : [createEmptyWine(1)];

  const [tastingDate, setTastingDate] = useState(initialDate);
  const [memberId, setMemberId] = useState(String(initialMemberId));
  const [wines, setWines] = useState<WineFormItem[]>(normalizedInitialWines);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function addWine() {
    setWines((prev) => [...prev, createEmptyWine(prev.length + 1)]);
  }

  function removeWine(index: number) {
    setWines((prev) => {
      if (prev.length <= 1) return prev;

      const next = prev.filter((_, i) => i !== index);

      return next.map((wine, i) => ({
        ...wine,
        sequence_no: i + 1,
      }));
    });
  }

  function updateWine(
    index: number,
    field: keyof WineFormItem,
    value: string
  ) {
    setWines((prev) =>
      prev.map((wine, i) =>
        i === index
          ? {
              ...wine,
              [field]: value,
            }
          : wine
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/tastings/${tastingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasting_date: tastingDate,
          member_id: Number(memberId),
          wines: wines.map((wine, index) => ({
            id: wine.id ?? null,
            sequence_no: index + 1,
            producer: wine.producer.trim() || null,
            wine_name: wine.wine_name.trim() || null,
            vintage: wine.vintage ? Number(wine.vintage) : null,
            country: wine.country.trim() || null,
            region: wine.region.trim() || null,
            grape_variety: wine.grape_variety.trim() || null,
            alcohol_pct: wine.alcohol_pct ? Number(wine.alcohol_pct) : null,
            price_eur: wine.price_eur ? Number(wine.price_eur) : null,
            comment: wine.comment.trim() || null,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ??
            "Das Tasting konnte serverseitig nicht gespeichert werden."
        );
        setIsSaving(false);
        return;
      }

      router.push(`/dashboard/admin/tastings`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Fehler beim Speichern des Tastings.");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <ComicCard className="px-6 pb-8 pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Datum
            </label>

            <input
              type="date"
              value={tastingDate}
              onChange={(e) => setTastingDate(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
              Gastgeber
            </label>

            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full border-2 border-black px-4 py-3"
            >
              {hosts.map((host) => (
                <option key={host.id} value={host.id}>
                  {host.display_name ?? "Unbekannt"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ComicCard>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Weine
        </h2>

        <button
          type="button"
          onClick={addWine}
          className="flex items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black text-xl font-black">
            +
          </span>
          <span className="text-sm font-black uppercase tracking-[0.2em]">
            Wein hinzufügen
          </span>
        </button>
      </div>

      <div className="space-y-8">
        {wines.map((wine, index) => (
          <ComicCard key={wine.id ?? index} className="px-6 pb-8 pt-6">
            <div className="mb-6 flex items-start justify-between">
              <h3 className="text-2xl font-black uppercase">
                Wein {index + 1}
              </h3>

              <button
                type="button"
                onClick={() => removeWine(index)}
                disabled={wines.length <= 1}
                className="border-2 border-black px-4 py-2 text-xs font-black uppercase"
              >
                Entfernen
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <input
                placeholder="Produzent"
                value={wine.producer}
                onChange={(e) => updateWine(index, "producer", e.target.value)}
                className="border-2 border-black px-4 py-3"
              />

              <input
                placeholder="Weinname"
                value={wine.wine_name}
                onChange={(e) => updateWine(index, "wine_name", e.target.value)}
                className="border-2 border-black px-4 py-3"
              />

              <input
                placeholder="Jahrgang"
                value={wine.vintage}
                onChange={(e) => updateWine(index, "vintage", e.target.value)}
                className="border-2 border-black px-4 py-3"
              />

              <input
                placeholder="Land"
                value={wine.country}
                onChange={(e) => updateWine(index, "country", e.target.value)}
                className="border-2 border-black px-4 py-3"
              />

              <input
                placeholder="Region"
                value={wine.region}
                onChange={(e) => updateWine(index, "region", e.target.value)}
                className="border-2 border-black px-4 py-3"
              />

              <input
                placeholder="Rebsorte"
                value={wine.grape_variety}
                onChange={(e) =>
                  updateWine(index, "grape_variety", e.target.value)
                }
                className="border-2 border-black px-4 py-3"
              />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                Abschließendes Gruppenstatement
              </label>

              <textarea
                rows={4}
                value={wine.comment}
                onChange={(e) => updateWine(index, "comment", e.target.value)}
                className="w-full border-2 border-black px-4 py-3"
                placeholder="Gemeinsames Fazit des Weinabends zu diesem Wein..."
              />
            </div>
          </ComicCard>
        ))}
      </div>

      {error && (
        <div className="border-2 border-red-700 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="border-2 border-black bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white"
      >
        {isSaving ? "Speichern..." : "Tasting speichern"}
      </button>
    </form>
  );
}
