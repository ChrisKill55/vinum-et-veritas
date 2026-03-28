"use client";

import { useMemo, useState } from "react";
import WineGlassRating from "./WineGlassRating";

type Props = {
  defaultValue?: number | string;
  name: string;
};

export default function WineGlassInput({
  defaultValue = 0,
  name,
}: Props) {
  const initialValue = useMemo(() => {
    const parsed = Number(defaultValue);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [defaultValue]);

  const [value, setValue] = useState(initialValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  function clampValue(next: number) {
    if (Number.isNaN(next)) return 0;
    return Math.max(0, Math.min(10, next));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(clampValue(Number(e.target.value)));
  }

  function handleGlassClick(next: number) {
    setValue(next);
  }

  return (
  <div className="space-y-4">

    <div className="flex items-center gap-6">

      <input
        name={name}
        type="number"
        min="0"
        max="10"
        step="0.5"
        value={value}
        onChange={handleInputChange}
        className="w-28 border-2 border-black px-3 py-3 text-lg font-bold"
      />

      <div
        className="flex items-center gap-2"
        onMouseLeave={() => setHoverValue(null)}
      >
        <WineGlassRating
          value={displayValue}
          interactive
          onHover={setHoverValue}
          onSelect={handleGlassClick}
        />
      </div>

    </div>

    <div className="text-lg font-black">
      {displayValue.toFixed(1)} / 10
    </div>

  </div>
)
}