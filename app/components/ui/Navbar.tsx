import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b-4 border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/logo-vinum-et-veritas.svg"
            alt="Vinum et Veritas"
            className="h-10 w-auto"
          />
          <span className="hidden text-sm font-black uppercase tracking-[0.2em] md:block">
            Vinum et Veritas
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-black uppercase tracking-[0.2em]">
          <Link
            href="/"
            className="transition hover:text-red-700"
          >
            Start
          </Link>

          <Link
            href="/tastings"
            className="transition hover:text-red-700"
          >
            Tastings
          </Link>

          <Link
            href="/ranking"
            className="transition hover:text-red-700"
          >
            Top Weine
          </Link>

          <Link
            href="/login"
            className="border-2 border-black bg-black px-4 py-2 text-white shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}