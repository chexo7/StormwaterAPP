import type { FeatureCollection, Feature, LineString, Point } from 'geojson';
import proj4 from 'proj4';
import type { LayerData } from '../types';

type NodeRec = {
  id: string;
  coord: [number, number];
  invert: number;
  ground: number;
};

const sanitizeId = (s: string, i: number) =>
  (s || `S${i + 1}`)
    .trim()
    .replace(/[^\w\-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 31);

const getPropStrict = (props: any, candidates: string[]) => {
  if (!props) return undefined;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const map = new Map(Object.keys(props).map((k) => [norm(k), k]));
  for (const cand of candidates) {
    const hit = map.get(norm(cand));
    if (hit !== undefined) return (props as any)[hit];
  }
  return undefined;
};

const getMapped = (
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

const splitPipesAtNodes = (
  pipes: Feature<LineString>[],
  nodes: Feature<Point>[]
): Feature<LineString>[] => {
  const nodeSet = new Set(
    nodes
      .filter((n) => n.geometry && n.geometry.type === 'Point')
      .map((n) => (n.geometry as Point).coordinates.join(','))
  );
  const out: Feature<LineString>[] = [];
  pipes.forEach((p) => {
    if (!p.geometry || p.geometry.type !== 'LineString') return;
    const coords = (p.geometry as LineString).coordinates;
    const splitIdxs: number[] = [];
    for (let i = 1; i < coords.length - 1; i++) {
      if (nodeSet.has(coords[i].join(','))) splitIdxs.push(i);
    }
    if (splitIdxs.length === 0) {
      out.push(p);
      return;
    }
    let prev = 0;
    const idxs = [...splitIdxs, coords.length - 1];
    idxs.forEach((idx, seg) => {
      const segCoords = coords.slice(prev, idx + 1);
      out.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: segCoords },
        properties: { ...(p.properties || {}), _segment: seg + 1 },
      });
      prev = idx;
    });
  });
  return out;
};

export function buildPipeNetwork(
  jLayer: LayerData,
  pLayer: LayerData,
  proj4Def: string
): FeatureCollection<LineString> {
  const project = proj4('EPSG:4326', proj4Def);
  const jMap = jLayer.fieldMap;
  const pMap = pLayer.fieldMap;

  const nodes: NodeRec[] = [];
  jLayer.geojson.features.forEach((f, i) => {
    if (!f.geometry || f.geometry.type !== 'Point') return;
    const raw = String(getMapped(f.properties, jMap, 'label', ['Label']) ?? '');
    const id = sanitizeId(raw, i);
    const ground = Number(
      getMapped(f.properties, jMap, 'ground', [
        'Elevation Ground [ft]',
        'Elevation Ground [ft]:'
      ]) ?? 0
    );
    const invert = Number(
      getMapped(f.properties, jMap, 'inv_out', [
        'Inv Out [ft]',
        'Inv Out [ft]:',
        'Elevation Invert[ft]'
      ]) ?? 0
    );
    const coord = project.forward(
      (f.geometry as any).coordinates as [number, number]
    );
    nodes.push({ id, coord, invert, ground });
  });

  const findNearestNode = (pt: [number, number]) => {
    let best = nodes[0];
    let bestDist = Infinity;
    for (const n of nodes) {
      const dx = pt[0] - n.coord[0];
      const dy = pt[1] - n.coord[1];
      const d = Math.hypot(dx, dy);
      if (d < bestDist) {
        bestDist = d;
        best = n;
      }
    }
    return best;
  };

  const lineLength = (coords: number[][]) => {
    let len = 0;
    for (let i = 1; i < coords.length; i++) {
      const [x1, y1] = project.forward(coords[i - 1] as [number, number]);
      const [x2, y2] = project.forward(coords[i] as [number, number]);
      len += Math.hypot(x2 - x1, y2 - y1);
    }
    return len;
  };

  const nodeFeatures = jLayer.geojson.features.filter(
    (f) => f.geometry && f.geometry.type === 'Point'
  ) as Feature<Point>[];
  const rawPipeFeatures = pLayer.geojson.features.filter(
    (f) => f.geometry && f.geometry.type === 'LineString'
  ) as Feature<LineString>[];
  const pipeFeatures = splitPipesAtNodes(rawPipeFeatures, nodeFeatures);

  const features: Feature<LineString>[] = [];
  pipeFeatures.forEach((f, i) => {
    const seg = (f.properties as any)?._segment;
    let raw = String(getMapped(f.properties, pMap, 'label', ['Label']) ?? '');
    if (seg) raw = `${raw}-${seg}`;
    const id = sanitizeId(raw, i);
    const coords = (f.geometry as LineString).coordinates;
    let dirStr = String(
      getMapped(f.properties, pMap, 'direction', ['Directions']) ?? ''
    );
    if (seg) dirStr = '';
    let from: NodeRec | undefined;
    let to: NodeRec | undefined;
    if (dirStr.includes(' to ')) {
      const [a, b] = dirStr.split(/\s+to\s+/);
      const fromId = sanitizeId(a, 0);
      const toId = sanitizeId(b, 0);
      from = nodes.find((n) => n.id === fromId);
      to = nodes.find((n) => n.id === toId);
    }
    if (!from || !to) {
      const start = project.forward(coords[0] as [number, number]);
      const end = project.forward(coords[coords.length - 1] as [number, number]);
      from = findNearestNode(start);
      to = findNearestNode(end);
    }
    const len = lineLength(coords);
    const rough = Number(
      getMapped(f.properties, pMap, 'roughness', ['Rougness', 'Roughness']) ?? 0
    );
    const diamIn = Number(
      getMapped(f.properties, pMap, 'diameter', ['Diameter [in]']) ?? 0
    );
    const invIn = Number(
      getMapped(f.properties, pMap, 'inv_in', ['Elevation Invert In [ft]'])
    );
    const invOut = Number(
      getMapped(f.properties, pMap, 'inv_out', ['Elevation Invert Out [ft]'])
    );
    const diamFt = diamIn / 12;
    const inOffset =
      from && Number.isFinite(invIn) ? invIn - from.invert : 0;
    const outOffset =
      to && Number.isFinite(invOut) ? invOut - to.invert : 0;
    features.push({
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        ID: id,
        FROM: from?.id ?? '',
        TO: to?.id ?? '',
        LEN_FT: Number(len.toFixed(3)),
        ROUGH: rough,
        DIAM_FT: Number(diamFt.toFixed(3)),
        INV_IN: invIn,
        INV_OUT: invOut,
        IN_OFF: Number(inOffset.toFixed(3)),
        OUT_OFF: Number(outOffset.toFixed(3)),
      },
    });
  });

  return { type: 'FeatureCollection', features };
}

