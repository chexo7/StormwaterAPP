export async function loadLandCoverValues(): Promise<string[]> {
  const sources = ['/api/cn-values', '/data/SCS_CN_VALUES.json'];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data
            .map((item: any) => item?.LandCover)
            .filter((v: any) => typeof v === 'string');
        }
      } else {
        console.warn(`Land cover request to ${url} failed with status ${res.status}`);
      }
    } catch (err) {
      console.warn(`Land cover request to ${url} failed`, err);
    }
  }
  return [];
}
