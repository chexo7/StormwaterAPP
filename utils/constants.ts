export const ARCHIVE_NAME_MAP: Record<string, string> = {
  'da.zip': 'Drainage Areas',
  'da-to-dp.zip': 'Drainage Areas',
  'da_to_dp.zip': 'Drainage Areas',
  'subareas.zip': 'Drainage Subareas',
  'sub-da.zip': 'Drainage Subareas',
  'sub_da.zip': 'Drainage Subareas',
  'landcover.zip': 'Land Cover',
  'land cover pre.zip': 'Land Cover',
  'land cover post.zip': 'Land Cover',
  'land_cover_pre.zip': 'Land Cover',
  'land_cover_post.zip': 'Land Cover',
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

export const MAX_DISCHARGE_POINTS = 10;
export const MAX_DRAINAGE_AREAS = 10;
export const DEFAULT_DRAINAGE_AREA_NAMES = Array.from(
  { length: MAX_DRAINAGE_AREAS },
  (_, index) => `DRAINAGE AREA - ${index + 1}`
);
