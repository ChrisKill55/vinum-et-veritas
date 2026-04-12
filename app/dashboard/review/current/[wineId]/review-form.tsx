"use client";

import { useMemo, useState } from "react";
import ScoreStepperInput from "@/app/components/ui/ScoreStepperInput";
import WineGlassInput from "@/app/components/ui/WineGlassInput";
import WineGlassRating from "@/app/components/ui/WineGlassRating";

type ReviewFormProps = {
  action: (formData: FormData) => void;
  wineId: number;
  colorDefault: string;
  smellDefault: string;
  tasteDefault: string;
  finishDefault: string;
  overallDefault: string;
  commentDefault: string;
  calculatedDefault: string | null;
};

function parseWineValue(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export default function ReviewForm({
  action,
  wineId,
  colorDefault,
  smellDefault,
  tasteDefault,
  finishDefault,
  overallDefault,
  commentDefault,
  calculatedDefault,
}: ReviewFormProps) {
  const [color, setColor] = useState(colorDefault);
  const [smell, setSmell] = useState(smellDefault);
  const [taste, setTaste] = useState(tasteDefault);
  const [finish, setFinish] = useState(finishDefault);
  const [overall, setOverall] = useState(overallDefault);
  const [comment, setComment] = useState(commentDefault);

  const overallNumericValue = useMemo(
    () => parseWineValue(overall),
    [overall]
  );

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="wineId" value={String(wineId)} />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="color"
            className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
          >
            Farbe / Optik
          </label>
          <ScoreStepperInput
            id="color"
            name="color"
            value={color}
            onChange={setColor}
            placeholder="0 bis 10 (0,5 Schritte)"
          />
        </div>

        <div>
          <label
            htmlFor="smell"
            className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
          >
            Nase
          </label>
          <ScoreStepperInput
            id="smell"
            name="smell"
            value={smell}
            onChange={setSmell}
            placeholder="0 bis 10 (0,5 Schritte)"
          />
        </div>

        <div>
          <label
            htmlFor="taste"
            className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
          >
            Geschmack
          </label>
          <ScoreStepperInput
            id="taste"
            name="taste"
            value={taste}
            onChange={setTaste}
            placeholder="0 bis 10 (0,5 Schritte)"
          />
        </div>

        <div>
          <label
            htmlFor="finish"
            className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
          >
            Abgang
          </label>
          <ScoreStepperInput
            id="finish"
            name="finish"
            value={finish}
            onChange={setFinish}
            placeholder="0 bis 10 (0,5 Schritte)"
          />
        </div>

        <div>
          <label
            htmlFor="overall"
            className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
          >
            Gesamteindruck
          </label>

          <WineGlassInput
            name="overall"
            value={overall}
            onChange={setOverall}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
            Vorschau
          </label>

          <div className="border-t-2 border-black pt-4 md:border-t-0 md:pt-[14px]">
            <div className="flex items-center gap-6">
              <WineGlassRating value={overallNumericValue ?? 0} />

              {overallNumericValue !== null && (
                <div className="text-lg font-black text-black">
                  {overallNumericValue.toFixed(1).replace(".", ",")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t-2 border-black pt-6">
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
          >
            Kommentar
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={5}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="w-full border-2 border-black bg-white px-4 py-3 text-base focus:outline-none"
            placeholder="Dein Eindruck zum Wein ..."
          />
        </div>
      </div>

      {calculatedDefault !== null && (
        <div className="border-t-2 border-black pt-4">
          <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
            Bisherige Durchschnittswertung
          </div>
          <div className="mt-2 text-2xl font-black uppercase">
            {calculatedDefault}
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          className="border-2 border-black bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
        >
          Bewertung speichern
        </button>
      </div>
    </form>
  );
}