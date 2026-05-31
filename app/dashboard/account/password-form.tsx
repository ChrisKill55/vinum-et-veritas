"use client";

import { useState } from "react";
import ComicInput from "@/app/components/ui/ComicInput";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/account/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const result = await response.json().catch(() => null);
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result?.error ?? "Das Passwort konnte nicht geändert werden.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Passwort wurde geändert.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="currentPassword"
          className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
        >
          Aktuelles Passwort
        </label>
        <ComicInput
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
        >
          Neues Passwort
        </label>
        <ComicInput
          id="newPassword"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          autoComplete="new-password"
          disabled={isSubmitting}
          minLength={10}
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
        >
          Neues Passwort wiederholen
        </label>
        <ComicInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          disabled={isSubmitting}
          minLength={10}
        />
      </div>

      {error ? (
        <div className="border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="border-2 border-green-700 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border-2 border-black bg-black px-4 py-3 text-base font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0px_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:shadow-none"
      >
        {isSubmitting ? "Speichern..." : "Passwort ändern"}
      </button>
    </form>
  );
}
