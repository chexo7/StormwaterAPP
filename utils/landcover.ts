// utils/landcover.ts
export type CnRecord = {
  LandCover: string;
  A: number;
  B: number;
  C: number;
  D: number;
};

export function normalizeLandCover(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export function createLandCoverKey(value: unknown): string {
  const normalized = normalizeLandCover(value);
  if (!normalized) return '';
  const withoutAccents = normalized
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
  return withoutAccents
    .replace(/[-\u2010-\u2015]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export async function loadCnValues(): Promise<CnRecord[]> {
  const sources = ['/api/cn-values', '/data/SCS_CN_VALUES.json'];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return (await res.json()) as CnRecord[];
      }
      console.warn(`CN values request to ${url} failed with status ${res.status}`);
    } catch (err) {
      console.warn(`CN values request to ${url} failed`, err);
    }
  }
  return [];
}

export async function saveCnValues(records: CnRecord[]): Promise<void> {
  const res = await fetch('/api/cn-values', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(records),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => '');
    throw new Error(message || 'Failed to save CN values');
  }
}
