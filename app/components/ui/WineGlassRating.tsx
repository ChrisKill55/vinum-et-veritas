import WineGlassIcon from "./WineGlassIcon";

type Props = {
  value: number;
  max?: number;
  interactive?: boolean;
  onHover?: (value: number | null) => void;
  onSelect?: (value: number) => void;
};

export default function WineGlassRating({
  value,
  max = 10,
  interactive = false,
  onHover,
  onSelect,
}: Props) {
  const full = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: max }).map((_, i) => {
        const index = i + 1;

        let content = <WineGlassIcon fill="white" size={26} />;

        if (index <= full) {
          content = <WineGlassIcon fill="#8B0000" size={26} />;
        } else if (index === full + 1 && hasHalf) {
          content = (
            <div className="relative h-[26px] w-[26px]">
              {/* Grundglas weiß */}
              <div className="absolute inset-0">
                <WineGlassIcon fill="white" stroke="transparent" size={26} />
              </div>

              {/* linke Hälfte rot */}
              <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <WineGlassIcon fill="#8B0000" stroke="transparent" size={26} />
              </div>

              {/* eine saubere Outline oben drüber */}
              <div className="absolute inset-0">
                <WineGlassIcon outlineOnly size={26} />
              </div>
            </div>
          );
        }

        if (!interactive) {
          return <div key={i}>{content}</div>;
        }

        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => onHover?.(index)}
            onFocus={() => onHover?.(index)}
            onClick={() => onSelect?.(index)}
            className="transition hover:-translate-y-0.5"
            aria-label={`${index} von ${max}`}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}