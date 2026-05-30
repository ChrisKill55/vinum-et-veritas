"use client";

import Link from "next/link";
import ComicCard from "@/app/components/ui/ComicCard";

type WineReviewItem = {
  id: number;
  sequence_no: number;
  title: string;
  country: string;
  color: string;
  smell: string;
  taste: string;
  finish: string;
  overall: string;
  comment: string;
};

export default function AdminMemberReviewForm({
  action,
  tastingId,
  participantId,
  tastingDate,
  hostName,
  wines,
}: {
  action: (formData: FormData) => void;
  tastingId: number;
  participantId: number;
  tastingDate: string;
  hostName: string;
  wines: WineReviewItem[];
}) {
  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="tastingId" value={String(tastingId)} />
      <input
        type="hidden"
        name="participantId"
        value={String(participantId)}
      />

      <ComicCard className="relative overflow-hidden px-6 pb-8 pt-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              Tasting-Datum
            </div>
            <div className="mt-2 text-2xl font-black uppercase">{tastingDate}</div>
          </div>

          <div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              Gastgeber
            </div>
            <div className="mt-2 text-2xl font-black uppercase">{hostName}</div>
          </div>

          <div className="flex items-end">
            <Link
              href={`/dashboard/admin/tastings/${tastingId}/reviews`}
              className="inline-flex border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
            >
              Zurück zu Reviews
            </Link>
          </div>
        </div>
      </ComicCard>

      <div className="space-y-6">
        {wines.map((wine) => (
          <ComicCard
            key={wine.id}
            className="relative overflow-hidden px-6 pb-8 pt-6"
          >
            <div className="mb-6">
              <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
                Flight {wine.sequence_no}
              </div>
              <h3 className="mt-1 text-3xl font-black uppercase tracking-tight">
                {wine.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {wine.country}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`color_${wine.id}`}
                  className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
                >
                  Farbe / Optik
                </label>
                <input
                  id={`color_${wine.id}`}
                  name={`color_${wine.id}`}
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  defaultValue={wine.color}
                  className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor={`smell_${wine.id}`}
                  className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
                >
                  Nase
                </label>
                <input
                  id={`smell_${wine.id}`}
                  name={`smell_${wine.id}`}
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  defaultValue={wine.smell}
                  className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor={`taste_${wine.id}`}
                  className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
                >
                  Geschmack
                </label>
                <input
                  id={`taste_${wine.id}`}
                  name={`taste_${wine.id}`}
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  defaultValue={wine.taste}
                  className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor={`finish_${wine.id}`}
                  className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
                >
                  Abgang
                </label>
                <input
                  id={`finish_${wine.id}`}
                  name={`finish_${wine.id}`}
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  defaultValue={wine.finish}
                  className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor={`overall_${wine.id}`}
                  className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
                >
                  Gesamteindruck
                </label>
                <input
                  id={`overall_${wine.id}`}
                  name={`overall_${wine.id}`}
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  defaultValue={wine.overall}
                  className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor={`comment_${wine.id}`}
                className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
              >
                Kommentar
              </label>
              <textarea
                id={`comment_${wine.id}`}
                name={`comment_${wine.id}`}
                rows={4}
                defaultValue={wine.comment}
                className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
                placeholder="Optionaler Kommentar ..."
              />
            </div>
          </ComicCard>
        ))}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="border-2 border-black bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
        >
          Bewertungen speichern
        </button>
      </div>
    </form>
  );
}
