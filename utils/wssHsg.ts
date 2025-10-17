import type { FeatureCollection, Feature, GeoJsonProperties } from 'geojson';

type RecordValue = string | number | null | undefined;

export interface WssHsgRecord {
  musym: string;
  muname?: string;
  hsg?: string;
}

const WSS_HSG_ENDPOINT = '/api/wss-hsg';

const TARGET_SYMBOL_KEY = 'musym';

const letterPattern = /[ABCD]/i;

const getPropCaseInsensitive = (
  props: GeoJsonProperties | null | undefined,
  target: string
): RecordValue => {
  if (!props) return undefined;
  const lowerTarget = target.toLowerCase();
  for (const key of Object.keys(props)) {
    if (key.toLowerCase() === lowerTarget) {
      return (props as any)[key];
    }
  }
  return undefined;
};

const sanitizeText = (value: RecordValue): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '';
    return String(value);
  }
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim();
};

export const simplifyHsgValue = (value: RecordValue): string => {
  const raw = sanitizeText(value);
  if (!raw) return '';
  const match = raw.toUpperCase().match(letterPattern);
  return match ? match[0] : '';
};

export const extractUniqueSymbols = (
  featureCollection: FeatureCollection
): string[] => {
  const symbols = new Set<string>();
  featureCollection.features.forEach(feature => {
    const raw = sanitizeText(getPropCaseInsensitive(feature.properties, TARGET_SYMBOL_KEY));
    if (raw) {
      symbols.add(raw.toUpperCase());
    }
  });
  return Array.from(symbols);
};

export const fetchWssHsgRecords = async (symbols: string[]): Promise<WssHsgRecord[]> => {
  if (symbols.length === 0) return [];
  const payload = { symbols };
  const res = await fetch(WSS_HSG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed with status ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  const table: any[] = Array.isArray(data?.results) ? data.results : [];
  return table.map(row => ({
    musym: sanitizeText((row.musym ?? row.MUSYM) as RecordValue).toUpperCase(),
    muname: sanitizeText((row.muname ?? row.MUNAME) as RecordValue) || undefined,
    hsg: sanitizeText((row.hsg ?? row.HSG ?? row.hydgrp ?? row.HYDGRP) as RecordValue) || undefined,
  }));
};

export const applyHsgToFeatures = (
  geojson: FeatureCollection,
  hsgMap: Map<string, string>
): FeatureCollection => {
  const updatedFeatures: Feature[] = geojson.features.map(feature => {
    const musym = sanitizeText(
      getPropCaseInsensitive(feature.properties, TARGET_SYMBOL_KEY)
    ).toUpperCase();
    const hsg = musym ? hsgMap.get(musym) ?? '' : '';
    return {
      ...feature,
      properties: { ...(feature.properties || {}), HSG: hsg },
    };
  });
  return { ...geojson, features: updatedFeatures };
};
