import Link from "next/link";

export default function Footer() {
  const logo = "/images/logo-vinum-et-veritas.svg";

  return (
    <footer className="border-t-4 border-black bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-600 md:flex-row md:items-center md:justify-between">
        
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Vinum et Veritas Logo"
            className="h-8 w-auto object-contain"
          />
          <span>© Vinum et Veritas</span>
        </div>

        <div className="flex gap-6">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>

      </div>
    </footer>
  );
}