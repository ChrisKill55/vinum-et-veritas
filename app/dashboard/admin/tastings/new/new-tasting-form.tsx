"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComicCard from "@/app/components/ui/ComicCard";

type Host = {
  id: number;
  display_name: string | null;
};

type WineFormItem = {
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

export default function NewTastingForm({ hosts }: { hosts: Host[] }) {
  const router = useRouter();

  const [tastingDate, setTastingDate] = useState("");
  const [memberId, setMemberId] = useState(
    hosts[0]?.id ? String(hosts[0].id) : ""
  );
  const [notes, setNotes] = useState("");
  const [wines, setWines] = useState<WineFormItem[]>([createEmptyWine(1)]);
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

    if (!tastingDate) {
      setError("Bitte ein Tasting-Datum angeben.");
      return;
    }

    if (!memberId) {
      setError("Bitte einen Gastgeber auswählen.");
      return;
    }

    if (wines.length < 1) {
      setError("Ein Tasting muss mindestens einen Wein enthalten.");
      return;
    }

    const hasInvalidWine = wines.some(
      (wine) => !wine.producer.trim() && !wine.wine_name.trim()
    );

    if (hasInvalidWine) {
      setError(
        "Jeder Wein braucht mindestens einen Produzenten oder einen Weinnamen."
      );
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/tastings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasting_date: tastingDate,
          member_id: Number(memberId),
          notes: notes.trim() || null,
          wines: wines.map((wine, index) => ({
            sequence_no: index + 1,
            producer: wine.producer.trim() || null,
            wine_name: wine.wine_name.trim() || null,
            vintage: wine.vintage.trim() ? Number(wine.vintage) : null,
            country: wine.country.trim() || null,
            region: wine.region.trim() || null,
            grape_variety: wine.grape_variety.trim() || null,
            alcohol_pct: wine.alcohol_pct.trim()
              ? Number(wine.alcohol_pct)
              : null,
            price_eur: wine.price_eur.trim() ? Number(wine.price_eur) : null,
            comment: wine.comment.trim() || null,
          })),
        }),
      });

      let data: { error?: string; tastingId?: number } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(
          data?.error ?? "Das Tasting konnte nicht gespeichert werden."
        );
        setIsSaving(false);
        return;
      }

      if (!data?.tastingId) {
        setError(
          "Das Tasting wurde gespeichert, aber ohne gültige ID zurückgegeben."
        );
        setIsSaving(false);
        return;
      }

      router.push(`/tastings/${data.tastingId}`);
      router.refresh();
    } catch (submitError) {
      console.error("Fehler beim Absenden des Tastings:", submitError);
      setError("Das Tasting konnte nicht gespeichert werden.");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ComicCard className="relative overflow-hidden px-6 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8">
        <div className="mb-6">
          <div className="mb-2 text-sm font-black uppercase tracking-[0.3em] text-red-700">
            Tasting
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Basisdaten
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="tasting_date"
              className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
            >
              Datum
            </label>
            <input
              id="tasting_date"
              type="date"
              value={tastingDate}
              onChange={(e) => setTastingDate(e.target.value)}
              className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="member_id"
              className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
            >
              Gastgeber
            </label>
            <select
              id="member_id"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
              required
            >
              {hosts.map((host) => (
                <option key={host.id} value={host.id}>
                  {host.display_name ?? `Mitglied ${host.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
          >
            Notizen
          </label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
            placeholder="z. B. Spanien-Abend, Blindverkostung, Motto ..."
          />
        </div>
      </ComicCard>

      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
            Weine
          </div>
          <h2 className="mt-1 text-3xl font-black uppercase tracking-tight">
            Weine des Tastings
          </h2>
        </div>

        <button
          type="button"
          onClick={addWine}
          className="inline-flex items-center gap-3 border-0 bg-transparent p-0"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-white text-3xl font-black leading-none">
            +
          </span>
          <span className="text-sm font-black uppercase tracking-[0.2em]">
            Wein hinzufügen
          </span>
        </button>
      </div>

      <div className="space-y-6">
        {wines.map((wine, index) => {
          const disableRemove = wines.length <= 1;

          return (
            <ComicCard
              key={`wine-${index}`}
              className="relative overflow-hidden px-6 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
                    Flight {index + 1}
                  </div>
                  <h3 className="mt-1 text-3xl font-black uppercase tracking-tight">
                    Wein {index + 1}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => removeWine(index)}
                  disabled={disableRemove}
                  className={`border-2 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] ${
                    disableRemove
                      ? "cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-400"
                      : "border-black bg-white text-black transition hover:-translate-y-0.5"
                  }`}
                >
                  Entfernen
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                    Produzent
                  </label>
                  <input
                    type="text"
                    value={wine.producer}
                    onChange={(e) =>
                      updateWine(index, "producer", e.target.value)
                    }
                    className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                    placeholder="z. B. Marques de Cáceres"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                    Weinname
                  </label>
                  <input
                    type="text"
                    value={wine.wine_name}
                    onChange={(e) =>
                      updateWine(index, "wine_name", e.target.value)
                    }
                    className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                    placeholder="z. B. Reserva"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                    Jahrgang
                  </label>
                  <input
                    type="number"
                    value={wine.vintage}
                    onChange={(e) =>
                      updateWine(index, "vintage", e.target.value)
                    }
                    className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                    placeholder="z. B. 2019"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                    Land
                  </label>
                  <input
                    type="text"
                    value={wine.country}
                    onChange={(e) =>
                      updateWine(index, "country", e.target.value)
                    }
                    className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                    placeholder="z. B. Spanien"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                    Region
                  </label>
                  <input
                    type="text"
                    value={wine.region}
                    onChange={(e) =>
                      updateWine(index, "region", e.target.value)
                    }
                    className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                    placeholder="z. B. Rioja"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                    Rebsorte
                  </label>
                  <input
                    type="text"
                    value={wine.grape_variety}
                    onChange={(e) =>
                      updateWine(index, "grape_variety", e.target.value)
                    }
                    className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                    placeholder="z. B. Tempranillo"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                    Alkohol %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={wine.alcohol_pct}
                    onChange={(e) =>
                      updateWine(index, "alcohol_pct", e.target.value)
                    }
                    className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                    placeholder="z. B. 13.5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                    Preis in €
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={wine.price_eur}
                    onChange={(e) =>
                      updateWine(index, "price_eur", e.target.value)
                    }
                    className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                    placeholder="z. B. 24.90"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                  Kommentar zum Wein
                </label>
                <textarea
                  rows={4}
                  value={wine.comment}
                  onChange={(e) => updateWine(index, "comment", e.target.value)}
                  className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                  placeholder="Optionaler Hinweis zum Wein ..."
                />
              </div>
            </ComicCard>
          );
        })}
      </div>

      {error ? (
        <div className="border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className={`border-2 border-black bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 ${
            isSaving ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {isSaving ? "Tasting wird gespeichert ..." : "Tasting anlegen"}
        </button>
      </div>
    </form>
  );
}
