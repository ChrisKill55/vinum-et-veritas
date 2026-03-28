export default function SectionHeader({
  kicker,
  title,
  className = "",
  noMargin = false,
}: {
  kicker?: string;
  title: string;
  className?: string;
  noMargin?: boolean;
}) {
  return (
    <div className={`${noMargin ? "" : "mb-10"} ${className}`}>
      {kicker && (
        <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
          {kicker}
        </div>
      )}

      <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
        {title}
      </h2>
    </div>
  );
}