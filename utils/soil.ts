export async function loadHsgMap(): Promise<Record<string, string> | null> {
  const sources = ['/api/soil-hsg-map', '/data/soil-hsg-map.json'];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
      console.warn(`HSG map request to ${url} failed with status ${res.status}`);
    } catch (err) {
      console.warn(`HSG map request to ${url} failed`, err);
    }
  }
  return null;
}
