type PublicWineFields = {
  producer?: string | null;
  wine_name?: string | null;
  comment?: string | null;
};

const PLACEHOLDER_COMMENT =
  "Automatisch angelegter Platzhalter wegen Bewertungen ohne Wein-Stammsatz";

export function isPlaceholderWine(wine: PublicWineFields) {
  const producer = wine.producer?.trim().toLowerCase();
  const wineName = wine.wine_name?.trim().toLowerCase();
  const comment = wine.comment?.trim();

  return (
    producer === "unbekannt" &&
    wineName === "unbekannt" &&
    comment === PLACEHOLDER_COMMENT
  );
}
