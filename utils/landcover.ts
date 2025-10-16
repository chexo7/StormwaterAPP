export type CnRecord = {
  LandCover: string;
  A: number;
  B: number;
  C: number;
  D: number;
};

export const CN_HYDRO_GROUPS = ['A', 'B', 'C', 'D'] as const;
export type CnHydrologicGroup = (typeof CN_HYDRO_GROUPS)[number];

export function normalizeCnTable(input: unknown): CnRecord[] {
  if (!Array.isArray(input)) return [];

  const order: string[] = [];
  const map = new Map<string, CnRecord>();

  input.forEach(item => {
    if (!item || typeof item !== 'object') return;
    const landCoverRaw = (item as any).LandCover;
    if (typeof landCoverRaw !== 'string') return;
    const landCover = landCoverRaw.trim();
    if (!landCover) return;

    const record: CnRecord = {
      LandCover: landCover,
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    let valid = true;
    for (const group of CN_HYDRO_GROUPS) {
      const value = Number((item as any)[group]);
      if (!Number.isFinite(value)) {
        valid = false;
        break;
      }
      record[group] = value;
    }
    if (!valid) return;

    const key = landCover.toLowerCase();
    if (!map.has(key)) {
      order.push(key);
    }
    map.set(key, record);
  });

  return order
    .map(key => map.get(key))
    .filter((record): record is CnRecord => Boolean(record));
}

export function buildCnLookup(records: CnRecord[]): Map<string, CnRecord> {
  const map = new Map<string, CnRecord>();
  records.forEach(record => {
    map.set(record.LandCover.toLowerCase(), record);
  });
  return map;
}
