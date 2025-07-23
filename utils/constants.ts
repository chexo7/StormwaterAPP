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

export const DRAINAGE_AREA_NAME_OPTIONS = Array.from({ length: 26 }, (_, i) =>
  `DA-${String.fromCharCode(65 + i)}`
);
