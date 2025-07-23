export interface CnEntry {
  Description: string;
  [key: string]: any;
}

export async function loadCnValues(): Promise<CnEntry[] | null> {
  const sources = ['/api/cn-values', '/data/SCS_CN_VALUES.json'];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}
