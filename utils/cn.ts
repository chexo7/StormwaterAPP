export const DEFAULT_LAND_COVER_OPTIONS = [
  'Open Space Poor condition (grass cover < 50%)',
  'Open Space Fair condition (grass cover 50% to 75%)',
  'Open Space Good condition (grass cover > 75%)',
  'Impervious',
  'Gravel',
  'Dirt',
  'Pasture, grassland, or range - Poor',
  'Pasture, grassland, or range - Fair',
  'Pasture, grassland, or range - Good',
  'Meadow',
  'Brush - Poor',
  'Brush - Fair',
  'Brush - Good',
  'Woods Grass Combination - Poor',
  'Woods Grass Combination - Fair',
  'Woods Grass Combination - Good',
  'Woods - Poor',
  'Woods - Fair',
  'Woods - Good',
  'Water',
  'Water - Process',
];

export async function loadCnValues(): Promise<Record<string, any> | null> {
  const sources = ['/api/cn-values', '/data/SCS_CN_VALUES.json'];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
      console.warn(`CN values request to ${url} failed with status ${res.status}`);
    } catch (err) {
      console.warn(`CN values request to ${url} failed`, err);
    }
  }
  return null;
}
