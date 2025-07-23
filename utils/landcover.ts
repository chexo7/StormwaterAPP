export async function loadLandCoverDescriptions(): Promise<string[]> {
  const url = '/data/SCS_CN_VALUES.json';
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const descs = Array.from(new Set((data as any[]).map(d => d.Description)));
      return descs;
    }
    console.warn(`Land cover request to ${url} failed with status ${res.status}`);
  } catch (err) {
    console.warn(`Land cover request to ${url} failed`, err);
  }
  return [];
}
