"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import ComicInput from "@/app/components/ui/ComicInput";
import ComicCard from "@/app/components/ui/ComicCard";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Login fehlgeschlagen. Bitte prüfe E-Mail und Passwort.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Mitgliederbereich Weinclub"
        badge="Mitgliederbereich"
        title="Club Login"
        description="Anmeldung für Clubmitglieder, um Bewertungen direkt zu erfassen und Tastings intern zu verwalten."
      />

      <Section className="py-16 md:py-20">
        <div className="mx-auto max-w-xl">
          <ComicCard className="px-6 py-6 md:px-8 md:py-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="mb-2 text-sm font-black uppercase tracking-[0.3em] text-red-700">
                  Zugang
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">
                  Mitglieder Login
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
                  >
                    E-Mail
                  </label>
                  <ComicInput
                    type="email"
                    placeholder="mitglied@weinclub.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
                  >
                    Passwort
                  </label>
                  <ComicInput
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full border-2 border-black bg-black px-4 py-3 text-base font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0px_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  Einloggen
                </button>
              </div>
            </form>
          </ComicCard>
        </div>
      </Section>
    </div>
  );
}