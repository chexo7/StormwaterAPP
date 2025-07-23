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
