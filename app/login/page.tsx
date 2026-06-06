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
  const [code, setCode] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCodeStep = Boolean(challengeToken);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!isCodeStep) {
      const response = await fetch("/api/auth/login-start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);
      setIsSubmitting(false);

      if (!response.ok || !data?.ok) {
        setError(
          data?.message ?? "Login fehlgeschlagen. Bitte prüfe E-Mail und Passwort."
        );
        return;
      }

      setChallengeToken(data.challengeToken);
      setMaskedEmail(data.maskedEmail);
      setPassword("");
      return;
    }

    const result = await signIn("credentials", {
      challengeToken,
      code,
      redirect: false,
    });
    setIsSubmitting(false);

    if (result?.error) {
      setError("Der Login-Code ist nicht korrekt oder abgelaufen.");
      return;
    }

    router.push("/dashboard");
  }

  function resetLogin() {
    setChallengeToken("");
    setMaskedEmail("");
    setCode("");
    setPassword("");
    setError("");
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
                  {isCodeStep ? "Code bestätigen" : "Mitglieder Login"}
                </h2>
              </div>

              {!isCodeStep ? (
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
                      required
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
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-black bg-yellow-50 px-4 py-3 text-sm font-bold">
                    Wir haben einen Login-Code an {maskedEmail} gesendet.
                  </div>

                  <div>
                    <label
                      htmlFor="code"
                      className="mb-2 block text-sm font-black uppercase tracking-[0.2em]"
                    >
                      Login-Code
                    </label>
                    <ComicInput
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="123456"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full border-2 border-black bg-black px-4 py-3 text-base font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0px_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  {isSubmitting
                    ? "Bitte warten..."
                    : isCodeStep
                      ? "Login bestätigen"
                      : "Code per E-Mail senden"}
                </button>
              </div>

              {isCodeStep && (
                <button
                  type="button"
                  onClick={resetLogin}
                  className="mt-4 w-full text-sm font-black uppercase tracking-[0.2em] text-neutral-700 underline"
                >
                  Zurück zum Login
                </button>
              )}
            </form>
          </ComicCard>
        </div>
      </Section>
    </div>
  );
}
