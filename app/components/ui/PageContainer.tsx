export default function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-6 ${className}`}>
      {children}
    </div>
  );
}