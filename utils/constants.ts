export const ARCHIVE_NAME_MAP: Record<string, string> = {
  'da.zip': 'Drainage Areas',
  'drainage_subareas.zip': 'Drainage Subareas',
  'subareas.zip': 'Drainage Subareas',
  'landcover.zip': 'Land Cover',
  'lod.zip': 'LOD',
  'pipes.zip': 'Pipes',
  'cb.zip': 'Catch Basins / Manholes',
  'manholes.zip': 'Catch Basins / Manholes',
};

export const KNOWN_LAYER_NAMES = [
  'Drainage Areas',
  'Drainage Subareas',
  'Land Cover',
  'LOD',
  'Soil Layer from Web Soil Survey',
];

export const OPTIONAL_LAYER_NAMES = ['Pipes', 'Catch Basins / Manholes'];

export const OTHER_CATEGORY = 'Other';
export const ALL_LAYER_NAMES = [...KNOWN_LAYER_NAMES, ...OPTIONAL_LAYER_NAMES, OTHER_CATEGORY];
export const SUPPORTED_LAYER_NAMES = [...KNOWN_LAYER_NAMES, ...OPTIONAL_LAYER_NAMES];
