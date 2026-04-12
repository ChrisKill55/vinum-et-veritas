"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const logo = "/images/logo-vinum-et-veritas-long.svg";
  const isLoggedIn = status === "authenticated";
  const userInitial =
  session?.user?.name?.charAt(0).toUpperCase() ?? "M";
  const navItems = [
  { href: "/", label: "Start" },
  { href: "/tastings", label: "Tastings" },
  { href: "/top-weine", label: "Top Weine" },
  ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
];

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    closeMenu();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-8" onClick={closeMenu}>
          <img
            src={logo}
            alt="Vinum et Veritas Logo"
            className="h-14 w-auto object-contain"
          />

          <div className="hidden text-sm font-black uppercase tracking-[0.35em] text-neutral-700 lg:block">
            Weinclub seit 2004
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-black uppercase tracking-[0.18em] transition ${
                  isActive
                    ? "text-red-700"
                    : "text-neutral-700 hover:text-red-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-red-700 text-sm font-black text-black">
              {userInitial}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[3px_3px_0_#111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[3px_3px_0_#111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              Login
            </Link>
          )}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className="relative flex h-12 w-12 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5 lg:hidden"
        >
          <span className="relative h-6 w-6">
            <span
              className={`absolute left-0 top-1/2 h-[3px] w-6 origin-center bg-black transition-all duration-300 ${
                menuOpen ? "translate-y-0 rotate-45" : "-translate-y-2.5"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[3px] w-6 origin-center bg-black transition-all duration-300 ${
                menuOpen ? "scale-x-0 opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[3px] w-6 origin-center bg-black transition-all duration-300 ${
                menuOpen ? "translate-y-0 -rotate-45" : "translate-y-2.5"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t-2 border-black bg-white transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`border-2 border-black px-4 py-3 text-sm font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-red-700 text-white"
                      : "bg-white text-neutral-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 border-2 border-black bg-neutral-100 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-red-700 text-xs font-black text-black">
                  {userInitial}
                  </div>

                  <div className="text-sm font-black uppercase tracking-[0.18em] text-neutral-700">
                  {session?.user?.name ?? "Mitglied"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}