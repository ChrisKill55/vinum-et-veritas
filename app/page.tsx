import { prisma } from "@/lib/prisma";
import HeroSplitSection from "@/app/components/ui/HeroSplitSection";
import ComicButton from "@/app/components/ui/ComicButton";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";
import SectionAlt from "@/app/components/ui/SectionAlt";
import ComicGallerySection from "@/app/components/ui/ComicGallerySection";
import Link from "next/link";

export default async function Page() {
  const heroImage = "/images/hero-banner.webp";

  const [
    tastingsCount,
    winesCount,
    ratingsCount,
    membersCount,
    members,
    recentTastings,
    rankedWines,
    winesWithRatings,
  ] = await Promise.all([
    prisma.tastings.count(),
    prisma.wines.count(),
    prisma.ratings.count(),
    prisma.members.count({
      where: { is_active: true },
    }),
    prisma.members.findMany({
      where: { is_active: true },
      orderBy: { created_at: "asc" },
    }),
    prisma.tastings.findMany({
      orderBy: { tasting_date: "desc" },
      take: 3,
      include: {
        wines: {
          orderBy: { sequence_no: "asc" },
        },
        members: true,
      },
    }),
    prisma.wines.findMany({
      include: {
        ratings: true,
      },
    }),
    prisma.wines.findMany({
      where: {
        country: {
          not: null,
        },
      },
      include: {
        ratings: true,
      },
    }),
  ]);

  const avatarMap: Record<string, string> = {
    Christian: "/images/avatar-christian.jpg",
    Niels: "/images/avatar-niels.jpg",
    Torsten: "/images/avatar-torsten.jpg",
    Thorsten: "/images/avatar-thorsten.jpg",
    Stefan: "/images/avatar-stefan.jpg",
    Heiko: "/images/avatar-heiko.jpg",
  };

  const stats = [
    { label: "Tastings", value: String(tastingsCount) },
    { label: "Weine", value: String(winesCount) },
    { label: "Bewertungen", value: String(ratingsCount) },
    { label: "Mitglieder", value: String(membersCount) },
  ];

  const topWines = rankedWines
    .map((wine) => {
      const validScores = wine.ratings
        .map((rating) =>
          rating.calculated_score !== null
            ? Number(rating.calculated_score)
            : null
        )
        .filter(
          (score): score is number => score !== null && !Number.isNaN(score)
        );

      if (validScores.length === 0) {
        return null;
      }

      const average =
        validScores.reduce((sum, score) => sum + score, 0) /
        validScores.length;

      return {
        name: wine.wine_name,
        producer: wine.producer,
        year: wine.vintage,
        country: wine.country ?? "Unbekannt",
        score: average.toFixed(2),
        averageRaw: average,
      };
    })
    .filter((wine): wine is NonNullable<typeof wine> => wine !== null)
    .sort((a, b) => b.averageRaw - a.averageRaw)
    .slice(0, 3)
    .map((wine, index) => ({
      rank: index + 1,
      name: wine.name,
      producer: wine.producer,
      year: wine.year,
      country: wine.country,
      score: wine.score,
    }));

  const tastings = recentTastings.map((t) => ({
    date: new Date(t.tasting_date).toLocaleDateString("de-DE"),
    host: t.members?.display_name ?? "Unbekannt",
    wines: t.wines.map((w) => {
      const name =
        w.producer === w.wine_name
          ? w.wine_name
          : [w.producer, w.wine_name].filter(Boolean).join(" ");

      return [name, w.vintage].filter(Boolean).join(" ");
    }),
  }));

  const memberCards = members.map((member) => {
  const displayName = member.display_name ?? "Unbekannt";

  return {
    name: displayName,
    role: member.role_title ?? "Mitglied",
    accent: displayName.charAt(0).toUpperCase(),
    avatar: avatarMap[displayName] ?? "/images/avatar-placeholder.jpg",
  };
});

  const countryMap = new Map<string, number[]>();

  for (const wine of winesWithRatings) {
    if (!wine.country) continue;

    const scores = wine.ratings
      .map((rating) =>
        rating.calculated_score !== null
          ? Number(rating.calculated_score)
          : null
      )
      .filter(
        (score): score is number => score !== null && !Number.isNaN(score)
      );

    if (scores.length === 0) continue;

    const existing = countryMap.get(wine.country) ?? [];
    countryMap.set(wine.country, [...existing, ...scores]);
  }

  const countries = Array.from(countryMap.entries())
    .map(([name, scores]) => {
      const average =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;

      return {
        name,
        score: average.toFixed(2),
        averageRaw: average,
      };
    })
    .sort((a, b) => b.averageRaw - a.averageRaw)
    .slice(0, 4);

  return (
    <div className="bg-white text-neutral-950">
      <main>
        <HeroSplitSection
          imageSrc={heroImage}
          imageAlt="Weinclub Hero"
          badge="Comic Chronicle of Wine"
          title="Sechs Freunde. Viel Rotwein. Ehrliche Urteile."
          description="Seit 2004 sammelt der Weinclub Vinum et Veritas Verkostungen, Bewertungen und legendäre Kommentare."
          size="large"
          leftContent={
            <div className="flex flex-wrap gap-4">
              <Link href="/tastings">
                <ComicButton>Zu den Tastings</ComicButton>
              </Link>

              <Link href="/top-weine">
                <ComicButton variant="secondary">
                  Top Weine ansehen
                </ComicButton>
              </Link>
            </div>
          }
          rightContent={
            <>
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="comic-card comic-card-soft px-6 pb-8 pt-6"
                >
                  <div className="text-sm font-black uppercase tracking-widest text-neutral-500">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-5xl font-black text-red-700">
                    {stat.value}
                  </div>
                </div>
              ))}
            </>
          }
        />

        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              backgroundImage: "url('/images/background-dots-header.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right -80px top",
            }}
          />

          <Section className="relative">
            <div className="mb-10 flex items-end justify-between gap-4">
              <SectionHeader
                kicker="Ranking"
                title="Top Weine aller Zeiten"
                noMargin
              />
              <div className="hidden border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.2em] md:block">
                Live aus der Datenbank
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {topWines.map((wine) => (
                <ComicCard
                  key={wine.rank}
                  className="relative overflow-hidden px-6 pb-12 pt-6"
                >
                  <div className="comic-badge mb-5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em]">
                    Platz {wine.rank}
                  </div>

                  <h3 className="text-3xl font-black uppercase leading-tight tracking-tight">
                    {wine.name}
                  </h3>

                  <p className="mt-4 text-base font-semibold text-neutral-600">
                    {wine.producer}
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3 text-sm uppercase tracking-widest text-neutral-600">
                    <div>
                      <div>Jahrgang</div>
                      <div className="mt-2 text-lg font-black text-black">
                        {wine.year}
                      </div>
                    </div>
                    <div>
                      <div>Land</div>
                      <div className="mt-2 text-lg font-black text-black">
                        {wine.country}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t-2 border-black pt-5">
                    <div className="text-xs uppercase tracking-widest text-neutral-500">
                      Durchschnitt
                    </div>

                    <div className="mt-2 text-5xl font-black text-red-700">
                      {wine.score}
                    </div>
                  </div>
                </ComicCard>
              ))}
            </div>
          </Section>
        </div>

        <SectionAlt>
          <SectionHeader kicker="Historie" title="Letzte Tastings" />

          <div className="grid gap-6 lg:grid-cols-3">
            {tastings.map((tasting) => (
              <ComicCard
                key={`${tasting.date}-${tasting.host}`}
                className="relative overflow-hidden px-6 pb-12 pt-6"
              >
                <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                  {tasting.date}
                </div>

                <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-tight">
                  Gastgeber: {tasting.host}
                </h3>

                <ul className="mt-5 space-y-3 text-base text-neutral-700">
                  {tasting.wines.map((wine) => (
                    <li key={wine} className="border-l-4 border-red-700 pl-3">
                      {wine}
                    </li>
                  ))}
                </ul>
              </ComicCard>
            ))}
          </div>
        </SectionAlt>
        <ComicGallerySection
  kicker="Comic Galerie"
  title="Abende, Flaschen, Legenden"
  noTopMargin
  items={[
    { src: "/images/comic-gallery-1.jpg", alt: "Comic Weinabend 1" },
    { src: "/images/comic-gallery-2.jpg", alt: "Comic Weinabend 2" },
    { src: "/images/comic-gallery-3.jpg", alt: "Comic Weinabend 3" },
    { src: "/images/comic-gallery-4.jpg", alt: "Comic Weinabend 4" },
    { src: "/images/comic-gallery-5.jpg", alt: "Comic Weinabend 5" },
    { src: "/images/comic-gallery-6.jpg", alt: "Comic Weinabend 6" },
    { src: "/images/comic-gallery-7.jpg", alt: "Comic Weinabend 7" },
    { src: "/images/comic-gallery-8.jpg", alt: "Comic Weinabend 8" },
    { src: "/images/comic-gallery-9.jpg", alt: "Comic Weinabend 9" },
    { src: "/images/comic-gallery-10.jpg", alt: "Comic Weinabend 10" },
  ]}
/>    
        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/background-dots-footer.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left bottom",
          }}
        >
          <Section>
            <SectionHeader kicker="Crew" title="Die Verkoster" />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {memberCards.map((member) => (
                <ComicCard
                  key={member.name}
                  className="group relative overflow-hidden px-6 pb-12 pt-6 transition duration-200 hover:-translate-y-1"
                >
                  <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center border-2 border-black bg-red-700 text-xl font-black text-white">
                    {member.accent}
                  </div>

                  <div className="mb-5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-32 w-32 rounded-full border-[3px] border-black bg-white object-cover transition duration-200 group-hover:scale-[1.03]"
                    />
                  </div>

                  <h3 className="text-3xl font-black uppercase tracking-tight">
                    {member.name}
                  </h3>

                  <p className="comic-badge mt-3 px-3 py-2 text-xs font-black uppercase tracking-[0.22em]">
                    {member.role}
                  </p>

                  <p className="mt-5 max-w-[28ch] text-sm leading-7 text-neutral-700">
                    Teil des Clubs, Teil der Urteile und garantiert nicht still,
                    wenn ein Wein zu viel verspricht und zu wenig liefert.
                  </p>
                </ComicCard>
              ))}
            </div>
          </Section>
        </div>

        <section className="border-t-4 border-black bg-black text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
                Über den Club
              </div>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-5xl">
                Vinum et Veritas
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                Der Club ist keine sterile Datenbank mit Flaschenbildern. Er ist
                ein Archiv aus Abenden, Meinungen, Kommentaren und kleinen
                Legenden. Im Vordergrund steht der Wein. Direkt dahinter kommen
                Geselligkeit, Humor und die Frage, ob der Wein wirklich
                geliefert hat.
              </p>
            </div>

            <div className="comic-card bg-white px-6 pb-8 pt-6 text-black">
              <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                Länder-Ranking
              </div>
              <div className="mt-5 space-y-4">
                {countries.map((country, index) => (
                  <div key={country.name}>
                    <div className="flex items-center justify-between text-sm font-black uppercase tracking-[0.2em]">
                      <span>
                        {index + 1}. {country.name}
                      </span>
                      <span>{country.score}</span>
                    </div>
                    <div className="mt-2 h-4 border-2 border-black bg-neutral-100">
                      <div
                        className="h-full bg-red-700"
                        style={{
                          width: `${Math.min(
                            (Number(country.score) / 10) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}