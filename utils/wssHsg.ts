import type { FeatureCollection, Feature } from 'geojson';

const ENDPOINT = 'https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest?format=JSON';
const HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export interface PopulateHsgResult {
  geojson: FeatureCollection;
  filled: number;
  total: number;
}

const sanitizeHsgValue = (value: unknown): string => {
  if (value == null) return '';
  const raw = String(value).trim().toUpperCase();
  if (!raw) return '';
  const primary = raw.split(/[\s/]+/, 1)[0];
  if (primary === 'A' || primary === 'B' || primary === 'C' || primary === 'D') {
    return primary;
  }
  return '';
};

const findPropertyKey = (feature: Feature, candidates: string[]): string | null => {
  const props = feature.properties || {};
  const keys = Object.keys(props);
  for (const key of keys) {
    const normalized = key.toLowerCase();
    if (candidates.includes(normalized)) {
      return key;
    }
  }
  return null;
};

const dedupeStrings = (values: (string | null | undefined)[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  values.forEach(value => {
    if (!value) return;
    const normalized = value.trim();
    if (!normalized) return;
    if (seen.has(normalized.toUpperCase())) return;
    seen.add(normalized.toUpperCase());
    out.push(normalized);
  });
  return out;
};

const chunk = <T,>(arr: T[], size: number): T[][] => {
  if (size <= 0) return [arr];
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

async function runSdaQuery(sql: string): Promise<any[]> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    throw new Error(`SDA request failed with status ${res.status}`);
  }
  const contentType = res.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    const json = await res.json();
    return Array.isArray(json?.Table) ? json.Table : [];
  }
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return Array.isArray(json?.Table) ? json.Table : [];
  } catch (err) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');
    return Array.from(doc.getElementsByTagName('Table')).map(node => ({
      musym: node.getElementsByTagName('musym')[0]?.textContent ?? '',
      muname: node.getElementsByTagName('muname')[0]?.textContent ?? '',
      hsg: node.getElementsByTagName('hsg')[0]?.textContent ?? '',
    }));
  }
}

const escapeSqlLiteral = (value: string): string => value.replace(/'/g, "''");

async function fetchHsgMap(areaSymbol: string, musyms: string[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (!areaSymbol || !musyms.length) {
    return result;
  }

  const escapedArea = escapeSqlLiteral(areaSymbol);
  const symbolChunks = chunk(musyms, 200);

  for (const symbolChunk of symbolChunks) {
    const escapedSymbols = symbolChunk
      .map(sym => sym.trim())
      .filter(sym => sym.length > 0)
      .map(sym => `'${escapeSqlLiteral(sym)}'`);
    if (!escapedSymbols.length) continue;
    const symbolList = escapedSymbols.join(',');
    const sql = `
      SELECT
        m.musym,
        (
          SELECT TOP 1 c.hydgrp
          FROM component c
          WHERE c.mukey = m.mukey
          ORDER BY c.comppct_r DESC
        ) AS hsg
      FROM legend l
      JOIN mapunit m ON l.lkey = m.lkey
      WHERE l.areasymbol = '${escapedArea}'
        AND m.musym IN (${symbolList});
    `;
    const rows = await runSdaQuery(sql);
    rows.forEach(row => {
      const sym = typeof row?.musym === 'string' ? row.musym.trim() : '';
      if (!sym) return;
      const hsg = sanitizeHsgValue(row?.hsg);
      if (!hsg) return;
      if (!result.has(sym)) {
        result.set(sym, hsg);
      }
    });
  }

  return result;
}

const cloneFeatureCollection = (geojson: FeatureCollection): FeatureCollection => ({
  type: 'FeatureCollection',
  features: geojson.features.map(feature => ({
    ...feature,
    properties: { ...(feature.properties || {}) },
  })),
});

export const ensureHsgField = (geojson: FeatureCollection): FeatureCollection => {
  const cloned = cloneFeatureCollection(geojson);
  cloned.features.forEach(feature => {
    if (!feature.properties) feature.properties = {};
    const props = feature.properties as Record<string, unknown>;
    props['HSG'] = sanitizeHsgValue(props['HSG']);
  });
  return cloned;
};

export async function populateWssHsg(
  geojson: FeatureCollection
): Promise<PopulateHsgResult> {
  if (!geojson.features.length) {
    return { geojson, filled: 0, total: 0 };
  }

  const sampleFeature = geojson.features.find(f => f.properties) ?? geojson.features[0];
  const areaSymbolKey = sampleFeature
    ? findPropertyKey(sampleFeature, ['areasymbol', 'area_symbol'])
    : null;
  const musymKey = sampleFeature
    ? findPropertyKey(sampleFeature, ['musym', 'mu_sym'])
    : null;

  if (!musymKey) {
    const sanitized = ensureHsgField(geojson);
    return { geojson: sanitized, filled: 0, total: sanitized.features.length };
  }

  const areaSymbolValues = geojson.features
    .map(feature => (feature.properties as any)?.[areaSymbolKey ?? ''])
    .filter(value => value != null)
    .map(value => String(value));
  const areaSymbol = areaSymbolValues.length
    ? areaSymbolValues[0].trim()
    : '';
  const musyms = dedupeStrings(
    geojson.features.map(feature => {
      const value = (feature.properties as any)?.[musymKey];
      return value == null ? '' : String(value);
    })
  );

  let hsgMap: Map<string, string> = new Map();
  try {
    hsgMap = await fetchHsgMap(areaSymbol, musyms);
  } catch (err) {
    console.warn('Failed to fetch HSG map from SDA', err);
  }

  const cloned = cloneFeatureCollection(geojson);
  let filled = 0;

  cloned.features.forEach(feature => {
    if (!feature.properties) feature.properties = {};
    const props = feature.properties as Record<string, unknown>;
    const existing = sanitizeHsgValue(props['HSG']);
    if (existing) {
      props['HSG'] = existing;
      return;
    }
    const musymValue = props[musymKey];
    const musym = musymValue == null ? '' : String(musymValue).trim();
    const fetched = musym ? hsgMap.get(musym) : undefined;
    if (fetched) {
      props['HSG'] = fetched;
      filled += 1;
    } else {
      props['HSG'] = '';
    }
  });

  return { geojson: cloned, filled, total: cloned.features.length };
}
