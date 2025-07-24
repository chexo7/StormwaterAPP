export async function loadLandCoverList(): Promise<string[]> {
  const sources = ['/api/cn-values', '/data/SCS_CN_VALUES.json'];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list = Array.from(new Set((data as any[]).map(d => d.LandCover).filter(Boolean)));
        return list;
      }
      console.warn(`CN values request to ${url} failed with status ${res.status}`);
    } catch (err) {
      console.warn(`CN values request to ${url} failed`, err);
    }
  }
  return [];
}

export async function loadCnTable(): Promise<Record<string, Record<string, number>> | null> {
  const sources = ['/api/cn-values', '/data/SCS_CN_VALUES.json'];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const table: Record<string, Record<string, number>> = {};
        (data as any[]).forEach(row => {
          const lc = row.LandCover;
          if (!table[lc]) table[lc] = {} as Record<string, number>;
          table[lc]['A'] = row.A;
          table[lc]['B'] = row.B;
          table[lc]['C'] = row.C;
          table[lc]['D'] = row.D;
        });
        return table;
      }
      console.warn(`CN values request to ${url} failed with status ${res.status}`);
    } catch (err) {
      console.warn(`CN values request to ${url} failed`, err);
    }
  }
  return null;
}

export function lookupCurveNumber(table: Record<string, Record<string, number>> | null, landCover: string, hsg: string): number | null {
  if (!table) return null;
  const row = table[landCover];
  if (!row) return null;
  const value = row[hsg];
  return typeof value === 'number' ? value : null;
}
