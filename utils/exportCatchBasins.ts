import type { Feature, Point } from 'geojson';

export type ProjectionAdapter = {
  forward: (coords: [number, number]) => [number, number];
};

export type CatchBasinNode = { id: string; coord: [number, number]; invert: number };

const normalizeFieldKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export const getPropStrict = (props: any, candidates: string[]) => {
  if (!props) return undefined;
  const map = new Map(Object.keys(props).map(k => [normalizeFieldKey(k), k]));
  for (const cand of candidates) {
    const hit = map.get(normalizeFieldKey(cand));
    if (hit !== undefined) return (props as any)[hit];
  }
  return undefined;
};

export const getMapped = (
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

export const sanitizeId = (s: string, i: number) =>
  (s || `S${i + 1}`)
    .trim()
    .replace(/[^\w\-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 31);

export const toNumericOrNull = (value: unknown): number | null => {
  if (value == null || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

type CatchBasinSanitizationOptions = {
  fieldMap?: Record<string, string>;
  project: ProjectionAdapter;
};

export type CatchBasinSanitizationResult = {
  nodes: CatchBasinNode[];
  sanitizedFeatures: Feature<Point>[];
};

export const sanitizeCatchBasinsForExport = (
  nodeFeatures: Feature<Point>[],
  { fieldMap, project }: CatchBasinSanitizationOptions
): CatchBasinSanitizationResult => {
  const nodes: CatchBasinNode[] = [];
  const sanitizedFeatures: Feature<Point>[] = [];

  nodeFeatures.forEach((feature, index) => {
    if (!feature.geometry || feature.geometry.type !== 'Point') return;
    const props = feature.properties || {};
    const labelSource = getMapped(props, fieldMap, 'label', ['Label']);
    const labelValue =
      labelSource != null && String(labelSource).trim() !== ''
        ? String(labelSource).trim()
        : '';
    const id = sanitizeId(labelValue, index);

    const invertRaw = getMapped(props, fieldMap, 'inv_out', [
      'Inv Out [ft]',
      'Inv Out [ft]:',
      'Elevation Invert[ft]',
    ]);
    const groundRaw = getMapped(props, fieldMap, 'ground', ['Elevation Ground [ft]']);
    const elevationInvertRaw =
      (props as any)?.['Elevation Invert[ft]'] !== undefined
        ? (props as any)['Elevation Invert[ft]']
        : invertRaw;

    const invert = toNumericOrNull(invertRaw);
    const elevationInvert = toNumericOrNull(elevationInvertRaw);
    const ground = toNumericOrNull(groundRaw);

    const sanitizedProps: Record<string, unknown> = { ...props };
    const fallbackLabel =
      sanitizedProps['Label'] != null ? String(sanitizedProps['Label']) : id;
    sanitizedProps['Label'] = labelValue || fallbackLabel;
    sanitizedProps['Inv Out [ft]'] = invert;
    sanitizedProps['Elevation Invert[ft]'] =
      elevationInvert != null ? elevationInvert : invert;
    sanitizedProps['Elevation Ground [ft]'] = ground;

    sanitizedFeatures.push({
      ...feature,
      properties: sanitizedProps,
    });

    const coord = project.forward(
      (feature.geometry as Point).coordinates as [number, number]
    );
    const nodeInvert = elevationInvert != null ? elevationInvert : invert;
    if (nodeInvert != null) {
      nodes.push({ id, coord, invert: nodeInvert });
    }
  });

  return { nodes, sanitizedFeatures };
};
