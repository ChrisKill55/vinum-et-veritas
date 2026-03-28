import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import ComicCard from "@/app/components/ui/ComicCard";

export default function DatenschutzPage() {
  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Datenschutzerklärung"
        badge="Rechtliches"
        title="Datenschutzerklärung"
        description="Hinweise zur Verarbeitung personenbezogener Daten auf dieser privaten Website."
      />

      <Section>
        <div className="mx-auto max-w-4xl">
          <ComicCard className="relative overflow-hidden px-6 pb-10 pt-6 md:px-8 md:pb-12 md:pt-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  1. Verantwortlicher
                </h2>
                <div className="mt-4 space-y-2 text-base leading-8 text-neutral-700">
                  <p>Christian Kill</p>
                  <p>Quellenweg 26a</p>
                  <p>46539 Dinslaken</p>
                  <p>E-Mail: news@christian-kill.de</p>
                </div>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  2. Allgemeine Hinweise
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Der Schutz personenbezogener Daten wird ernst genommen.
                  Personenbezogene Daten werden vertraulich und entsprechend der
                  gesetzlichen Datenschutzvorschriften sowie dieser
                  Datenschutzerklärung behandelt.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  3. Hosting und Server-Logfiles
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Beim Aufruf dieser Website können durch den Hosting-Anbieter
                  technisch erforderliche Daten verarbeitet werden. Dazu können
                  insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs,
                  Browsertyp, Betriebssystem, Referrer-URL sowie aufgerufene
                  Seiten gehören. Die Verarbeitung erfolgt zum Zweck der
                  technischen Bereitstellung und Sicherheit der Website.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  4. Nutzung des internen Mitgliederbereichs
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Im internen Mitgliederbereich werden personenbezogene Daten
                  verarbeitet, soweit dies für Anmeldung, Authentifizierung,
                  Verwaltung von Mitgliedskonten sowie für die Nutzung der
                  Funktionen rund um Tastings, Bewertungen und interne
                  Clubinhalte erforderlich ist.
                </p>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Hierzu können insbesondere Name, E-Mail-Adresse,
                  Login-Informationen sowie von Mitgliedern erfasste Bewertungen
                  und clubinterne Inhalte gehören.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  5. Cookies und Sessions
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Diese Website kann technisch notwendige Cookies oder ähnliche
                  Speichertechnologien verwenden, insbesondere um Logins,
                  Sitzungen und sicherheitsrelevante Funktionen bereitzustellen.
                  Solche technisch erforderlichen Cookies dienen dem Betrieb der
                  Website.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  6. Keine Weitergabe zu Werbezwecken
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Eine Weitergabe personenbezogener Daten an Dritte zu
                  Werbezwecken erfolgt nicht. Eine Weitergabe erfolgt nur, wenn
                  dies technisch erforderlich, gesetzlich vorgeschrieben oder im
                  Rahmen des Hostings beziehungsweise des Betriebs der Website
                  notwendig ist.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  7. Speicherdauer
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Personenbezogene Daten werden nur so lange gespeichert, wie
                  dies für den jeweiligen Zweck erforderlich ist oder gesetzliche
                  Aufbewahrungspflichten bestehen.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  8. Rechte betroffener Personen
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Betroffene Personen haben im Rahmen der gesetzlichen
                  Vorschriften insbesondere das Recht auf Auskunft,
                  Berichtigung, Löschung, Einschränkung der Verarbeitung,
                  Widerspruch gegen die Verarbeitung sowie auf
                  Datenübertragbarkeit.
                </p>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Außerdem besteht das Recht, sich bei einer zuständigen
                  Datenschutzaufsichtsbehörde zu beschweren.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  9. Kontakt
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Bei Fragen zum Datenschutz kann Kontakt aufgenommen werden
                  über:
                  <br />
                  news@christian-kill.de
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  10. Stand
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Diese Datenschutzerklärung gilt für den aktuellen Stand dieser
                  Website. Bei technischen oder rechtlichen Änderungen kann eine
                  Anpassung erforderlich werden.
                </p>
              </section>
            </div>
          </ComicCard>
        </div>
      </Section>
    </div>
  );
}