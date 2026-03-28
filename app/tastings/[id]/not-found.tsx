import Link from "next/link";

export default function TastingNotFound() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <div className="comic-card comic-card-soft px-8 py-10">
        <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
          404
        </div>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-tight">
          Tasting nicht gefunden
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
          Die angeforderte Tasting-Seite existiert nicht oder die ID ist ungültig.
        </p>

        <Link
          href="/tastings"
          className="mt-6 inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white"
        >
          Zurück zum Tasting-Archiv
        </Link>
      </div>
    </main>
  );
}