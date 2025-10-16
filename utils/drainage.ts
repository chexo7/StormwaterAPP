export const SUBAREA_LAYER_NAME = 'Drainage Subareas';
export const PROCESSED_SUBAREA_LAYER_NAME = 'Drainage Subareas (Computed)';

export const DA_NAME_ATTR = 'DA_NAME';
export const SUBAREA_NAME_ATTR = 'SUBAREA_NAME';
export const SUBAREA_PARENT_ATTR = 'PARENT_DA';
export const COMPLEMENT_FLAG_ATTR = 'IS_COMPLEMENT';
export const SUBAREA_AREA_ATTR = 'SUBAREA_AC';

export const MAX_DISCHARGE_POINTS = 20;

export const formatDischargePointId = (index: number) =>
  `DP-${Math.min(Math.max(index, 1), MAX_DISCHARGE_POINTS).toString().padStart(2, '0')}`;

export const parseDischargePointId = (value: unknown): string | null => {
  if (value === undefined || value === null) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const normalized = raw.toUpperCase();
  let match = normalized.match(/^DP[-_\s]?(\d{1,2})$/);
  if (!match) {
    match = normalized.match(/^(\d{1,2})$/);
  }
  if (!match) return null;
  const numeric = Number(match[1]);
  if (!Number.isFinite(numeric) || numeric < 1 || numeric > MAX_DISCHARGE_POINTS) return null;
  return formatDischargePointId(numeric);
};

const stripZipExtension = (fileName: string) => fileName.replace(/\.zip$/i, '');

const DRAINAGE_AREA_REGEX = /^da[-_\s]*to[-_\s]*dp(?:[-_\s]*(\d{1,2}))?$/i;
const DRAINAGE_SUBAREA_REGEX = /^sub[-_\s]*da(?:[-_\s]*(\d{1,2}))?$/i;

export interface DetectionResult {
  layerName: 'Drainage Areas' | typeof SUBAREA_LAYER_NAME;
  dischargePointId?: string;
}

export const detectDrainageAreaFromFilename = (fileName: string): DetectionResult | null => {
  const base = stripZipExtension(fileName);
  const match = base.match(DRAINAGE_AREA_REGEX);
  if (!match) return null;
  const dischargePointId = match[1] ? parseDischargePointId(match[1]) ?? undefined : undefined;
  return { layerName: 'Drainage Areas', dischargePointId };
};

export const detectDrainageSubareaFromFilename = (fileName: string): DetectionResult | null => {
  const base = stripZipExtension(fileName);
  const match = base.match(DRAINAGE_SUBAREA_REGEX);
  if (!match) return null;
  const dischargePointId = match[1] ? parseDischargePointId(match[1]) ?? undefined : undefined;
  return { layerName: SUBAREA_LAYER_NAME, dischargePointId };
};

export const DISCHARGE_POINT_OPTIONS = Array.from({ length: MAX_DISCHARGE_POINTS }, (_, idx) => ({
  label: `${idx + 1}`,
  value: formatDischargePointId(idx + 1),
}));
