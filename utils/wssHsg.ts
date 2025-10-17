import type { FeatureCollection, Feature, GeoJsonProperties } from 'geojson';

type RecordValue = string | number | null | undefined;

export interface WssHsgFeatureRequest {
  index: number;
  musym: string;
}

export interface WssHsgRecord {
  index: number;
  musym: string;
  hsg: string;
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

export const extractFeatureMusyms = (
  featureCollection: FeatureCollection
): WssHsgFeatureRequest[] => {
  const items: WssHsgFeatureRequest[] = [];
  featureCollection.features.forEach((feature, index) => {
    const raw = sanitizeText(getPropCaseInsensitive(feature.properties, TARGET_SYMBOL_KEY));
    if (!raw) return;
    items.push({ index, musym: raw.toUpperCase() });
  });
  return items;
};

export const fetchWssHsgRecords = async (
  features: WssHsgFeatureRequest[]
): Promise<WssHsgRecord[]> => {
  if (features.length === 0) return [];
  const payload = {
    features: features.map(item => ({ index: item.index, musym: item.musym })),
  };
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
    index: Number(row?.index),
    musym: sanitizeText((row.musym ?? row.MUSYM) as RecordValue).toUpperCase(),
    hsg: sanitizeText((row.hsg ?? row.HSG ?? row.hydgrp ?? row.HYDGRP) as RecordValue),
  }));
};

export const applyHsgToFeatures = (
  geojson: FeatureCollection,
  records: WssHsgRecord[]
): FeatureCollection => {
  const assignments = new Map<number, string>();
  records.forEach(record => {
    const idx = Number(record.index);
    if (!Number.isInteger(idx)) return;
    assignments.set(idx, simplifyHsgValue(record.hsg));
  });

  const updatedFeatures: Feature[] = geojson.features.map((feature, index) => {
    if (!assignments.has(index)) return feature;
    const value = assignments.get(index) ?? '';
    return {
      ...feature,
      properties: { ...(feature.properties || {}), HSG: value },
    };
  });
  return { ...geojson, features: updatedFeatures };
};
