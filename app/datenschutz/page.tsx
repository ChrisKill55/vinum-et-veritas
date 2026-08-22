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
                  <p>Heiko Heller</p>
                  <p>Niels Jeß</p>
                  <p>Stefan Nonnenmacher</p>
                  <p>Thorsten Drewes</p>
                  <p>Torsten Yanez</p>
                  <p>Quellenweg 26a</p>
                  <p>46539 Dinslaken</p>
                  <p>
                    E-Mail:{" "}
                    <a
                      className="font-black text-red-700 underline decoration-2 underline-offset-4"
                      href="mailto:news@christian-kill.de"
                    >
                      news@christian-kill.de
                    </a>
                  </p>
                  <p>
                    Die genannten Personen betreiben diese private Website
                    gemeinsam. Als zentrale Kontaktanschrift wird die oben
                    genannte Adresse verwendet.
                  </p>
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
                  Diese Website wird über Vercel bereitgestellt. Anbieter ist
                  Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
                  Beim Aufruf der Website verarbeitet Vercel technisch
                  erforderliche Zugriffsdaten. Dazu können insbesondere
                  IP-Adresse, Datum und Uhrzeit des Zugriffs, Browsertyp,
                  Betriebssystem, Referrer-URL sowie aufgerufene Seiten
                  gehören. Die Verarbeitung erfolgt zum Zweck der technischen
                  Bereitstellung, Auslieferung und Sicherheit der Website auf
                  Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte
                  Interesse liegt in einem sicheren und zuverlässigen Betrieb
                  der Website.
                </p>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Die Domain, DNS-Verwaltung und E-Mail-Dienste werden über
                  IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland,
                  bereitgestellt. IONOS ist nicht der technische Hoster der
                  Website-Inhalte, kann jedoch im Rahmen von Domain-, DNS- und
                  E-Mail-Diensten technische Daten verarbeiten. Die Verarbeitung
                  erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Das
                  berechtigte Interesse liegt in der Erreichbarkeit der Domain
                  und der Kommunikationsadressen.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  4. Datenbank und Bildspeicherung
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Zur Speicherung der Website-Daten wird eine PostgreSQL-
                  Datenbank bei Neon verwendet. Anbieter ist Neon, Inc.,
                  548 Market St PMB 98174, San Francisco, CA 94104-5401, USA.
                  In der Datenbank werden insbesondere Inhalte zu Tastings,
                  Weinen, Bewertungen, Mitgliedskonten und Login-Daten
                  gespeichert, soweit dies für den Betrieb der Website und des
                  internen Mitgliederbereichs erforderlich ist. Die Verarbeitung
                  erfolgt je nach Nutzung auf Grundlage von Art. 6 Abs. 1
                  lit. b DSGVO, soweit sie für die Bereitstellung des
                  Mitgliederbereichs erforderlich ist, sowie ergänzend auf
                  Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                </p>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Von Mitgliedern hochgeladene Bilder können über Vercel Blob
                  gespeichert und öffentlich ausgeliefert werden, soweit sie als
                  Bildinhalt der Website vorgesehen sind. Die Verarbeitung
                  erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO oder
                  Art. 6 Abs. 1 lit. f DSGVO.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  5. Nutzung des internen Mitgliederbereichs
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
                  und clubinterne Inhalte gehören. Die Verarbeitung erfolgt auf
                  Grundlage von Art. 6 Abs. 1 lit. b DSGVO, soweit sie für die
                  Nutzung des Mitgliederbereichs erforderlich ist, sowie auf
                  Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur Verwaltung und
                  Absicherung der internen Clubfunktionen.
                </p>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Für die Absicherung des Logins können einmalige Login-Codes
                  per E-Mail versendet werden. Hierfür wird der
                  Transaktionsmail-Dienst Resend genutzt. Anbieter ist Plus Five
                  Five, Inc., 2261 Market Street #5039, San Francisco, CA 94114,
                  USA. Zur Zustellung des Login-Codes werden insbesondere die
                  E-Mail-Adresse, der Inhalt der Login-Mail, technische
                  Versanddaten und Zustellinformationen verarbeitet. Die
                  Verarbeitung erfolgt, soweit sie für Anmeldung und
                  Authentifizierung erforderlich ist, auf Grundlage von Art. 6
                  Abs. 1 lit. b DSGVO sowie ergänzend auf Grundlage von Art. 6
                  Abs. 1 lit. f DSGVO zur Absicherung des Logins.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  6. Cookies und Sessions
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Diese Website verwendet technisch notwendige Cookies oder
                  ähnliche Speichertechnologien, insbesondere um Logins,
                  Sitzungen, CSRF-Schutz und sicherheitsrelevante Funktionen
                  bereitzustellen. Solche technisch erforderlichen Cookies
                  dienen dem Betrieb der Website und werden nicht zu
                  Werbe- oder Trackingzwecken eingesetzt. Die Verarbeitung
                  erfolgt auf Grundlage von § 25 Abs. 2 TDDDG sowie Art. 6
                  Abs. 1 lit. f DSGVO.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  7. Schriften und externe Inhalte
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Auf dieser Website verwendete Schriften werden lokal über die
                  Website ausgeliefert. Beim Aufruf der Seiten wird keine
                  Verbindung zu Google Fonts hergestellt. Externe Karten,
                  Videos, Social-Media-Plugins oder Werbenetzwerke sind nicht
                  eingebunden.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  8. Keine Analyse- oder Marketingdienste
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Es werden keine Analyse- oder Marketingdienste wie Google
                  Analytics, Meta Pixel oder vergleichbare Trackingdienste
                  eingesetzt.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  9. Rechtsgrundlagen der Verarbeitung
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Soweit personenbezogene Daten zur technischen Bereitstellung,
                  Sicherheit, Fehleranalyse und Stabilität der Website
                  verarbeitet werden, erfolgt dies auf Grundlage von Art. 6
                  Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt im
                  sicheren, stabilen und nutzbaren Betrieb der Website.
                </p>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Soweit personenbezogene Daten für den internen
                  Mitgliederbereich, Login, Bewertungen, Bilduploads oder
                  clubinterne Funktionen erforderlich sind, erfolgt die
                  Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
                  beziehungsweise Art. 6 Abs. 1 lit. f DSGVO. Soweit gesetzliche
                  Pflichten bestehen, erfolgt die Verarbeitung auf Grundlage von
                  Art. 6 Abs. 1 lit. c DSGVO.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  10. Drittlandübermittlung
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Bei der Nutzung von Vercel, Neon und Resend kann eine
                  Verarbeitung personenbezogener Daten in den USA oder durch
                  Anbieter mit Sitz in den USA erfolgen. Eine solche Verarbeitung
                  erfolgt, soweit erforderlich, auf Grundlage geeigneter
                  Garantien im Sinne der Art. 44 ff. DSGVO, insbesondere auf
                  Grundlage von Standardvertragsklauseln der Europäischen
                  Kommission und/oder auf Grundlage einer Zertifizierung nach dem
                  EU-US Data Privacy Framework, soweit der jeweilige Anbieter
                  entsprechend zertifiziert ist.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  11. Keine Weitergabe zu Werbezwecken
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
                  12. Speicherdauer
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Personenbezogene Daten werden nur so lange gespeichert, wie
                  dies für den jeweiligen Zweck erforderlich ist oder gesetzliche
                  Aufbewahrungspflichten bestehen. Login-Codes sind nur
                  kurzfristig gültig und werden nach Ablauf beziehungsweise nach
                  erfolgreicher Nutzung nicht weiter für den Login verwendet.
                  Sitzungsdaten werden für die Dauer der jeweiligen Anmeldung
                  verarbeitet. Mitgliedskonten, Bewertungen, Tastingdaten und
                  hochgeladene Bilder werden gespeichert, solange sie für den
                  Betrieb des privaten Weinclubs erforderlich sind oder bis eine
                  Löschung veranlasst wird, soweit keine entgegenstehenden
                  Gründe bestehen.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  13. Rechte betroffener Personen
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
                  14. Kontakt
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
                  15. Stand
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Stand: 22. August 2026. Diese Datenschutzerklärung gilt für
                  den aktuellen Stand dieser Website. Bei technischen oder
                  rechtlichen Änderungen kann eine Anpassung erforderlich
                  werden.
                </p>
              </section>
            </div>
          </ComicCard>
        </div>
      </Section>
    </div>
  );
}
