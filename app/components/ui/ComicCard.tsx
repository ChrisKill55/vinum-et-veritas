export default function ComicCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`comic-card comic-card-soft ${className}`}>
      {children}
    </div>
  );
}