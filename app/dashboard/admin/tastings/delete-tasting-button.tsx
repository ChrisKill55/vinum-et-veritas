"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTastingButton({
  tastingId,
}: {
  tastingId: number;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Willst du dieses Tasting wirklich löschen? Alle Weine und Bewertungen dieses Tastings werden ebenfalls gelöscht."
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/tastings/${tastingId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(
          data?.error ?? "Das Tasting konnte nicht gelöscht werden."
        );
        setIsDeleting(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Das Tasting konnte nicht gelöscht werden.");
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className={`inline-flex border-2 border-black px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:-translate-y-0.5 ${
        isDeleting
          ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
          : "bg-white text-black"
      }`}
    >
      {isDeleting ? "Löschen ..." : "Löschen"}
    </button>
  );
}