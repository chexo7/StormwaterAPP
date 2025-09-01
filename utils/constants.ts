export const ARCHIVE_NAME_MAP: Record<string, string> = {
  'da.zip': 'Drainage Areas',
  'landcover.zip': 'Land Cover',
  'lod.zip': 'LOD',
  'pipes.zip': 'Pipes',
  'cb.zip': 'Junctions',
  'manholes.zip': 'Junctions',
};

export const KNOWN_LAYER_NAMES = [
  'Drainage Areas',
  'Land Cover',
  'LOD',
  'Soil Layer from Web Soil Survey',
];

export const OTHER_CATEGORY = 'Other';
export const ALL_LAYER_NAMES = [...KNOWN_LAYER_NAMES, OTHER_CATEGORY];
