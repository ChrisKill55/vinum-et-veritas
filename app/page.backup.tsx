export default function Page() {
  const logo = "/images/logo-vinum-et-veritas.svg";
  const heroImage = "/images/hero-banner.webp";

  const stats = [
    { label: "Tastings", value: "14" },
    { label: "Weine", value: "23" },
    { label: "Bewertungen", value: "107" },
    { label: "Offene Reviews", value: "1" },
  ];

  const topWines = [
    {
      rank: 1,
      name: "Zonin",
      producer: "Famiglia Zonin",
      year: 2019,
      country: "Italien",
      score: "8.90",
    },
    {
      rank: 2,
      name: "Maglieri",
      producer: "Maglieri",
      year: 2002,
      country: "Australien",
      score: "8.00",
    },
    {
      rank: 3,
      name: "Michel Mauri",
      producer: "Michel Mauri",
      year: 2020,
      country: "Frankreich",
      score: "7.90",
    },
  ];

  const tastings = [
    {
      date: "27.09.2023",
      host: "Christian",
      wines: ["Michel Mauri 2020"],
    },
    {
      date: "22.09.2023",
      host: "Christian",
      wines: ["Zonin 2019", "Marques de Caceres 2017"],
    },
    {
      date: "05.04.2008",
      host: "Stefan",
      wines: ["RAICES 2002", "YGAY 2100 2006"],
    },
  ];

  const members = [
    {
      name: "Christian",
      role: "Weinprofessor",
      accent: "K",
      avatar: "/images/avatar-christian.jpg",
    },
    {
      name: "Niels",
      role: "Analytischer Verkoster",
      accent: "N",
      avatar: "/images/avatar-niels.jpg",
    },
    {
      name: "Torsten",
      role: "El Presidente",
      accent: "T",
      avatar: "/images/avatar-torsten.jpg",
    },
    {
      name: "Thorsten",
      role: "Der Kritiker",
      accent: "D",
      avatar: "/images/avatar-thorsten.jpg",
    },
    {
      name: "Stefan",
      role: "Genießer & Schreiberling",
      accent: "S",
      avatar: "/images/avatar-stefan.jpg",
    },
    {
      name: "Heiko",
      role: "Das Clubküken",
      accent: "H",
      avatar: "/images/avatar-heiko.jpg",
    },
  ];

  const countries = [
    { name: "Italien", score: "7.35" },
    { name: "Australien", score: "6.99" },
    { name: "Frankreich", score: "6.92" },
    { name: "Spanien", score: "6.77" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <header className="sticky top-0 z-20 border-b-4 border-black bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">
          <img
            src={logo}
            alt="Vinum et Veritas Logo"
            className="h-full w-auto object-contain"
          />
          <div className="text-sm font-black uppercase tracking-[0.35em] text-neutral-700">
            WEINCLUB SEIT 2004
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b-4 border-black">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Weinclub Hero"
              className="h-full w-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="comic-badge mb-4 px-4 py-2 text-sm font-black uppercase tracking-[0.3em]">
                Comic Chronicle of Wine
              </div>

              <h1 className="text-[3rem] font-black uppercase leading-[0.9] text-white md:text-[4rem] lg:text-[5rem]">
                Sechs Freunde. Viel Rotwein. Ehrliche Urteile.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-200">
                Seit 2004 sammelt der Weinclub Vinum et Veritas Verkostungen,
                Bewertungen und legendäre Kommentare.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="comic-badge px-6 py-3 text-sm font-black uppercase tracking-[0.25em]">
                  Zu den Tastings
                </button>
                <button className="border-2 border-white bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.25em] text-black shadow-[4px_4px_0_#111] transition hover:-translate-y-0.5">
                  Top Weine ansehen
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 self-start">
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
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
                Ranking
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
                Top Weine aller Zeiten
              </h2>
            </div>
            <div className="hidden border-2 border-black px-4 py-2 text-sm font-black uppercase tracking-[0.2em] md:block">
              Live aus der Datenbank
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {topWines.map((wine) => (
              <article
                key={wine.rank}
                className="comic-card comic-card-soft px-8 pb-10 pt-8"
              >
                <div className="comic-badge mb-5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em]">
                  Platz {wine.rank}
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tight">
                  {wine.name}
                </h3>
                <p className="mt-1 text-base font-semibold text-neutral-600">
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

                <div className="mt-8 pt-4">
                  <div className="comic-divider mb-5" />
                  <div className="text-xs uppercase tracking-widest text-neutral-500">
                    Durchschnitt
                  </div>
                  <div className="mt-2 text-5xl font-black text-red-700">
                    {wine.score}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y-4 border-black bg-neutral-50">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-10">
              <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
                Historie
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
                Letzte Tastings
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {tastings.map((tasting) => (
                <article
                  key={`${tasting.date}-${tasting.host}`}
                  className="comic-card comic-card-soft px-6 pb-8 pt-6"
                >
                  <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                    {tasting.date}
                  </div>
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">
                    Gastgeber: {tasting.host}
                  </h3>
                  <ul className="mt-5 space-y-3 text-base text-neutral-700">
                    {tasting.wines.map((wine) => (
                      <li key={wine} className="border-l-4 border-red-700 pl-3">
                        {wine}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <div className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
              Crew
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
              Die Verkoster
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <article
                key={member.name}
                className="comic-card comic-card-soft group relative overflow-hidden px-6 pb-12 pt-6 transition duration-200 hover:-translate-y-1"
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
              </article>
            ))}
          </div>
        </section>

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

      <footer className="border-t-4 border-black bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-600 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Vinum et Veritas Logo"
              className="h-8 w-auto object-contain"
            />
            <span>© Vinum et Veritas</span>
          </div>

          <div className="flex gap-6">
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}