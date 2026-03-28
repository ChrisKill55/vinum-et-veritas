export default function ComicButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  if (variant === "secondary") {
    return (
      <button className="border-2 border-black bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.25em] text-black shadow-[4px_4px_0_#111] transition hover:-translate-y-0.5">
        {children}
      </button>
    );
  }

  return (
    <button className="comic-badge px-6 py-3 text-sm font-black uppercase tracking-[0.25em]">
      {children}
    </button>
  );
}
