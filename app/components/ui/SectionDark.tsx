export default function SectionDark({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t-4 border-black bg-black px-6 py-20 text-white ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
