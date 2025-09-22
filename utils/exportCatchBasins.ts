import type { Feature, Point } from 'geojson';

export type CatchBasinNode = {
  id: string;
  coord: [number, number];
  invert: number;
};

interface CatchBasinExportArgs {
  features: Feature<Point>[];
  fieldMap?: Record<string, string>;
  forward: (coord: [number, number]) => [number, number];
}

const normalizeKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const getPropStrict = (props: any, candidates: string[]) => {
  if (!props) return undefined;
  const map = new Map(
    Object.keys(props).map(key => [normalizeKey(key), key])
  );
  for (const cand of candidates) {
    const hit = map.get(normalizeKey(cand));
    if (hit !== undefined) return (props as any)[hit];
  }
  return undefined;
};

const getMappedValue = (
  props: any,
  map: Record<string, string> | undefined,
  key: string,
  candidates: string[]
) => {
  if (map && map[key] && props?.[map[key]] !== undefined) {
    return (props as any)[map[key]];
  }
  return getPropStrict(props, candidates);
};

const sanitizeId = (value: string, index: number) =>
  (value || `S${index + 1}`)
    .trim()
    .replace(/[^\w\-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 31);

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const ensureLabel = (value: unknown, fallback: string) => {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  return str === '' ? fallback : str;
};

export const buildCatchBasinExportData = ({
  features,
  fieldMap,
  forward,
}: CatchBasinExportArgs) => {
  const nodes: CatchBasinNode[] = [];
  const exportFeatures: Feature<Point>[] = [];

  features.forEach((feature, index) => {
    if (!feature.geometry || feature.geometry.type !== 'Point') return;

    const props = feature.properties || {};
    const rawId = getMappedValue(props, fieldMap, 'label', ['Label']);
    const id = sanitizeId(rawId != null ? String(rawId) : '', index);

    const invertRaw = getMappedValue(props, fieldMap, 'inv_out', [
      'Inv Out [ft]',
      'Inv Out [ft]:',
      'Elevation Invert[ft]',
    ]);
    const groundRaw = getMappedValue(props, fieldMap, 'ground', [
      'Elevation Ground [ft]',
    ]);

    const invertVal = toNumberOrNull(invertRaw);
    const groundVal = toNumberOrNull(groundRaw);

    if (invertVal !== null && groundVal !== null) {
      const coord = forward(
        (feature.geometry as Point).coordinates as [number, number]
      );
      nodes.push({ id, coord, invert: invertVal });
    }

    const label = ensureLabel(rawId, id);
    const roundedInvert = invertVal !== null ? Number(invertVal.toFixed(3)) : null;
    const roundedGround = groundVal !== null ? Number(groundVal.toFixed(3)) : null;

    const safeProps: Record<string, any> = {
      ...props,
      Label: label,
      'Inv Out [ft]': roundedInvert,
      'Elevation Ground [ft]': roundedGround,
    };

    const existingNodeInv = toNumberOrNull(safeProps['Elevation Invert[ft]']);
    if (existingNodeInv === null) {
      safeProps['Elevation Invert[ft]'] = roundedInvert;
    } else {
      safeProps['Elevation Invert[ft]'] = Number(existingNodeInv.toFixed(3));
    }

    exportFeatures.push({
      type: 'Feature',
      geometry: feature.geometry as Point,
      properties: safeProps,
    });
  });

  return { nodes, features: exportFeatures };
};

