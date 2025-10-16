// utils/landcover.ts
export type CnRecord = {
  LandCover: string;
  A: number;
  B: number;
  C: number;
  D: number;
};

export const createCnLookup = (records: CnRecord[]): Map<string, CnRecord> => {
  const map = new Map<string, CnRecord>();
  records.forEach(record => {
    const key = record?.LandCover?.trim().toLowerCase();
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, record);
    }
  });
  return map;
};

export const extractLandCoverOptions = (records: CnRecord[]): string[] => {
  const normalized = new Map<string, string>();
  records.forEach(record => {
    const raw = record?.LandCover?.trim();
    if (!raw) return;
    const key = raw.toLowerCase();
    if (!normalized.has(key)) {
      normalized.set(key, raw);
    }
  });
  return Array.from(normalized.values()).sort((a, b) => a.localeCompare(b));
};
