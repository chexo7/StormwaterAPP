export const ARCHIVE_NAME_MAP: Record<string, string> = {
  'da.zip': 'Drainage Areas',
  'landcover.zip': 'Land Cover',
  'lod.zip': 'LOD',
  'pipes.zip': 'Pipes',
  'cb.zip': 'Catch Basins / Manholes',
  'manholes.zip': 'Catch Basins / Manholes',
};

export const KNOWN_LAYER_NAMES = [
  'Drainage Areas',
  'Land Cover',
  'LOD',
  'Soil Layer from Web Soil Survey',
  'Pipes',
  'Catch Basins / Manholes',
];

export const OTHER_CATEGORY = 'Other';
export const ALL_LAYER_NAMES = [...KNOWN_LAYER_NAMES, OTHER_CATEGORY];
