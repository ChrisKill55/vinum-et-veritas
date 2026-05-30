import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import ComicCard from "@/app/components/ui/ComicCard";

export default function ImpressumPage() {
  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Impressum"
        badge="Rechtliches"
        title="Impressum"
        description="Angaben gemäß den geltenden Informationspflichten für diese private Website."
      />

      <Section>
        <div className="mx-auto max-w-4xl">
          <ComicCard className="relative overflow-hidden px-6 pb-10 pt-6 md:px-8 md:pb-12 md:pt-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Angaben zum Verantwortlichen
                </h2>
                <div className="mt-4 space-y-2 text-base leading-8 text-neutral-700">
                  <p>Christian Kill</p>
                  <p>Heiko Heller</p>
                  <p>Stefan Nonnenmacher</p>
                  <p>Torsten Yanez</p>
                  <p>Quellenweg 26a</p>
                  <p>46539 Dinslaken</p>
                  <p>E-Mail: news@christian-kill.de</p>
                  <p>E-Mail: Helleroberhausen@gmail.com</p>
                </div>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Charakter der Website
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Diese Website wird privat betrieben. Der dargestellte Weinclub
                  sowie die Inhalte der Seite dienen ausschließlich privaten und
                  nicht gewerblichen Zwecken.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Hinweis zu Weinbewertungen
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Die auf dieser Website dargestellten Weinbewertungen spiegeln
                  ausschließlich die persönlichen Eindrücke der Mitglieder des
                  Weinclubs wider. Sie dienen nicht der Auf- oder Abwertung von
                  Unternehmen, Weingütern, Herstellern, Händlern oder deren
                  Produkten. Geschmack ist subjektiv und kann je nach Situation,
                  Umgebung, Stimmung und Speisenbegleitung unterschiedlich
                  wahrgenommen werden.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Haftung für Inhalte
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt
                  erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
                  der Inhalte wird jedoch keine Gewähr übernommen.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Haftung für Links
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Sofern diese Website Links zu externen Websites Dritter
                  enthält, wird auf deren Inhalte kein Einfluss genommen.
                  Deshalb kann für diese fremden Inhalte keine Gewähr
                  übernommen werden. Für die Inhalte der verlinkten Seiten ist
                  stets der jeweilige Anbieter oder Betreiber verantwortlich.
                </p>
              </section>

              <section className="border-t-2 border-black pt-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Urheberrecht
                </h2>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  Die auf dieser Website veröffentlichten Inhalte, Bilder und
                  sonstigen Werke unterliegen dem deutschen Urheberrecht,
                  soweit nicht anders gekennzeichnet. Eine Vervielfältigung,
                  Bearbeitung oder Verbreitung außerhalb der Grenzen des
                  Urheberrechts bedarf der vorherigen Zustimmung des jeweiligen
                  Rechteinhabers.
                </p>
              </section>
            </div>
          </ComicCard>
        </div>
      </Section>
    </div>
  );
}
