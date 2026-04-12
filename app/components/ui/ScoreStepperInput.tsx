"use client";

type ScoreStepperInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function parseScore(value: string): number | null {
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

function formatScore(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

export default function ScoreStepperInput({
  id,
  name,
  value,
  onChange,
  placeholder = "0–10",
}: ScoreStepperInputProps) {
  function stepDown() {
    const current = parseScore(value) ?? 0;
    const next = Math.max(0, current - 0.5);
    onChange(formatScore(next));
  }

  function stepUp() {
    const current = parseScore(value) ?? 0;
    const next = Math.min(10, current + 0.5);
    onChange(formatScore(next));
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={stepDown}
        className="border-2 border-black bg-white px-4 py-3 text-lg font-black leading-none text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
        aria-label={`${name} verringern`}
      >
        −
      </button>

      <input
        id={id}
        name={name}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-2 border-black bg-white px-4 py-3 text-center text-base font-black focus:outline-none"
        placeholder={placeholder}
        required
      />

      <button
        type="button"
        onClick={stepUp}
        className="border-2 border-black bg-black px-4 py-3 text-lg font-black leading-none text-white transition hover:-translate-y-0.5 hover:bg-red-700"
        aria-label={`${name} erhöhen`}
      >
        +
      </button>
    </div>
  );
}