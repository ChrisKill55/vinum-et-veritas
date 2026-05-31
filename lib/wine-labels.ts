type WineLabelFields = {
  producer?: string | null;
  wine_name?: string | null;
};

export function getWineDisplayName(wine: WineLabelFields) {
  const wineName = wine.wine_name?.trim();
  const producer = wine.producer?.trim();

  if (wineName && producer && wineName === producer) {
    return wineName;
  }

  return [wineName, producer].filter(Boolean).join(" | ");
}
