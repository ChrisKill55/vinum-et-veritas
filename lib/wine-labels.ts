type WineLabelFields = {
  producer?: string | null;
  wine_name?: string | null;
  vintage?: number | null;
};

export function getWineDisplayName(wine: WineLabelFields) {
  const wineName = wine.wine_name?.trim();
  const producer = wine.producer?.trim();

  if (wineName && producer && wineName === producer) {
    return wineName;
  }

  return [wineName, producer].filter(Boolean).join(" | ");
}

export function getWineDisplayNameWithVintage(wine: WineLabelFields) {
  const wineName = wine.wine_name?.trim();
  const producer = wine.producer?.trim();
  const wineNameWithVintage = [wineName, wine.vintage]
    .filter(Boolean)
    .join(" ");

  if (wineName && producer && wineName === producer) {
    return wineNameWithVintage;
  }

  return [wineNameWithVintage, producer].filter(Boolean).join(" | ");
}
