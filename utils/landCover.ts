export async function loadLandCoverDescriptions(): Promise<string[] | null> {
  const sources = ['/api/cn-values', '/data/SCS_CN_VALUES.json'];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map((d: any) => String(d.Description));
        }
      } else {
        console.warn(`CN values request to ${url} failed with status ${res.status}`);
      }
    } catch (err) {
      console.warn(`CN values request to ${url} failed`, err);
    }
  }
  return null;
}
