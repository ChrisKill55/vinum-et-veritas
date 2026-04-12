"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isStandalone =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isIOS && !isStandalone) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 border-2 border-black bg-white p-4 shadow-[4px_4px_0_#111]">
      <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-800">
        Tipp
      </div>

      <p className="mt-2 text-sm leading-6 text-neutral-700">
        Füge diese Seite zu deinem Home-Bildschirm hinzu.
      </p>

      <p className="mt-2 text-sm font-semibold text-neutral-800">
        Safari → Teilen → „Zum Home-Bildschirm“
      </p>

      <button
        onClick={() => setVisible(false)}
        className="mt-3 border-2 border-black px-3 py-1 text-xs font-black uppercase"
      >
        OK
      </button>
    </div>
  );
}