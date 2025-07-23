export interface CurveNumberRecord {
  A: number;
  B: number;
  C: number;
  D: number;
}

export async function loadCnValues(): Promise<Record<string, CurveNumberRecord[]> | null> {
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
