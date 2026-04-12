"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isStandalone =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const dismissed = window.sessionStorage.getItem("install-prompt-dismissed");

    if (isIOS && !isStandalone && !dismissed) {
      setVisible(true);
    }
  }, []);

  function handleClose() {
    window.sessionStorage.setItem("install-prompt-dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md border-2 border-black bg-white p-4 shadow-[4px_4px_0_#111] md:inset-x-auto md:left-6 md:bottom-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
            Tipp
          </div>

          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Füge diese Seite zu deinem Home-Bildschirm hinzu.
          </p>

          <p className="mt-2 text-sm font-black text-neutral-900">
            Safari → Teilen → „Zum Home-Bildschirm“
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Hinweis schließen"
          className="shrink-0 border-2 border-black bg-white px-2 py-1 text-sm font-black leading-none text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
        >
          ×
        </button>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-red-700"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}