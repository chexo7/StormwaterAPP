export const ARCHIVE_NAME_MAP: Record<string, string> = {
  'da.zip': 'Drainage Areas',
  'landcover.zip': 'Land Cover',
  'lod.zip': 'LOD',
};

export const KNOWN_LAYER_NAMES = [
  'Drainage Areas',
  'Land Cover',
  'LOD',
  'Soil Layer from Web Soil Survey',
];

export const OTHER_CATEGORY = 'Other';
export const ALL_LAYER_NAMES = [...KNOWN_LAYER_NAMES, OTHER_CATEGORY];

export const DEFAULT_LAYER_STYLES: Record<string, { fillColor: string; fillOpacity: number }> = {
  'Drainage Areas': { fillColor: '#67e8f9', fillOpacity: 0.5 },
  'Land Cover': { fillColor: '#22c55e', fillOpacity: 0.5 },
  'LOD': { fillColor: '#ef4444', fillOpacity: 0.5 },
  'Soil Layer from Web Soil Survey': { fillColor: '#a52a2a', fillOpacity: 0.5 },
};
