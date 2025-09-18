import type { Feature, LineString, Point } from 'geojson';
import type { Converter } from 'proj4';
import type { LayerData, ProjectionOption } from '../../types';
import { ExportError, type ExportResult, type ExportLogEntry } from './types';

interface SwmmExportParams {
  layers: LayerData[];
  projectName?: string;
  projectVersion: string;
  projection: ProjectionOption;
  project: Converter;
}

export const exportSWMM = async ({
  layers,
  projectName,
  projectVersion,
  projection,
  project,
}: SwmmExportParams): Promise<ExportResult> => {
  const logs: ExportLogEntry[] = [];
  const log = (message: string, level: ExportLogEntry['level'] = 'info') => {
    logs.push({ message, level });
  };

  const template = (
    await import('../../export_templates/swmm/SWMM_TEMPLATE.inp?raw')
  ).default as string;
  const {
    area: turfArea,
    rewind,
    cleanCoords,
    centroid,
    bbox,
    kinks,
  } = await import('@turf/turf');

  const sanitizeId = (s: string, i: number) =>
    (s || `S${i + 1}`)
      .trim()
      .replace(/[^\w\-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 31);

  const isFinitePair = (p: number[]) =>
    Number.isFinite(p[0]) && Number.isFinite(p[1]);

  const reorderByAngle = (ring: number[][]) => {
    const c = centroid({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [ring] },
      properties: {},
    } as any).geometry.coordinates as number[];
    return ring
      .map(([x, y]) => ({ x, y, ang: Math.atan2(y - c[1], x - c[0]) }))
      .sort((a, b) => a.ang - b.ang)
      .map((p) => [p.x, p.y]);
  };

  const uniq = (ring: number[][]) => {
    const seen = new Set<string>();
    const out: number[][] = [];
    for (const p of ring) {
      const k = `${p[0].toFixed(6)}|${p[1].toFixed(6)}`;
      if (!seen.has(k)) {
        seen.add(k);
        out.push(p);
      }
    }
    return out;
  };

  const subcatchLines: string[] = [];
  const subareaLines: string[] = [];
  const infilLines: string[] = [];
  const polygonLines: string[] = [];
  const junctionLines: string[] = [];
  const outfallLines: string[] = [];
  const conduitLines: string[] = [];
  const xsectionLines: string[] = [];
  const coordLines: string[] = [];

  const daLayer = layers.find((l) => l.name === 'Drainage Areas');
  if (daLayer) {
    const grouped = new Map<
      string,
      { area: number; polygons: number[][][] }
    >();

    daLayer.geojson.features.forEach((f, i) => {
      const raw = String((f.properties as any)?.DA_NAME ?? '');
      const id = sanitizeId(raw, i);
      const geom = f.geometry;
      const rings: number[][][] =
        geom.type === 'Polygon'
          ? [geom.coordinates[0] as number[][]]
          : (geom as any).coordinates.map((p: any) => p[0] as number[][]);
      let outerArea = 0;
      for (const ring of rings) {
        outerArea += Math.abs(
          turfArea({
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [ring] },
            properties: {},
          } as any)
        );
      }
      const a = outerArea * 0.000247105; // acres
      const entry = grouped.get(id) || { area: 0, polygons: [] };
      entry.area += a;
      entry.polygons.push(...rings);
      grouped.set(id, entry);
    });

    const closeRing = (ring: number[][]) => {
      if (ring.length < 3) return ring;
      const [fx, fy] = ring[0];
      const [lx, ly] = ring[ring.length - 1];
      const isClosed = fx === lx && fy === ly;
      return isClosed ? ring : [...ring, ring[0]];
    };

    Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([id, { area: a, polygons }]) => {
        polygons.sort(
          (aRing, bRing) =>
            Math.abs(
              turfArea({
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [bRing] },
                properties: {},
              } as any)
            ) -
            Math.abs(
              turfArea({
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [aRing] },
                properties: {},
              } as any)
            )
        );
        let hasRing = false;
        polygons.forEach((ring) => {
          const gj = {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [ring] },
            properties: {},
          } as any;
          const cleanedGj = cleanCoords(gj);
          const rewound = rewind(cleanedGj, { reverse: false });
          const ringCoords = rewound.geometry.coordinates[0] as number[][];
          const cleaned = ringCoords.filter(
            (p, i, arr) =>
              i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1]
          );
          const dedup = uniq(cleaned);
          if (dedup.length < 3) {
            log(`[POLYGONS] anillo degenerado en ${id}`, 'warn');
            return;
          }
          let ringToWrite = dedup;
          try {
            if (
              kinks({
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [dedup] },
                properties: {},
              } as any).features.length
            ) {
              ringToWrite = reorderByAngle(dedup);
            }
          } catch (err) {
            console.error(err);
          }
          const closed = closeRing(ringToWrite);
          const safeClosed = closed.filter(isFinitePair);
          const projectedRing = safeClosed.map((p) =>
            project.forward(p as [number, number])
          );
          if (projectedRing.length < 4) {
            log(`[POLYGONS] Se descartó un anillo degenerado de ${id}`, 'warn');
            return;
          }
          projectedRing.forEach(([x, y]) => {
            polygonLines.push(`${id}\t${x}\t${y}`);
          });
          hasRing = true;
        });
        if (hasRing) {
          const width = a * 100; // simple width approximation
          subcatchLines.push(
            `${id}\t*\t*\t${a.toFixed(4)}\t25\t${width.toFixed(2)}\t0.5\t0`
          );
          subareaLines.push(`${id}\t0.01\t0.1\t0.05\t0.05\t25\tOUTLET`);
          infilLines.push(`${id}\t3\t0.5\t4\t7\t0`);
        }
      });
  }

  const bad = polygonLines.find((l) => l.trim().split(/\s+/).length !== 3);
  if (bad) throw new ExportError(`[POLYGONS] mal formado: "${bad}"`);
  const bad2 = polygonLines.find((l) =>
    !/^\S+\s+-?\d+(\.\d+)?(e[+-]?\d+)?\s+-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(
      l.trim()
    )
  );
  if (bad2) throw new ExportError(`[POLYGONS] token numérico inválido: "${bad2}"`);

  const validIds = new Set(subcatchLines.map((l) => l.split(/\s+/)[0]));
  const filteredPolygonLines = polygonLines.filter((l) =>
    validIds.has(l.split(/\s+/)[0])
  );

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

  const jLayer = layers.find((l) => l.name === 'Catch Basins / Manholes');
  const pLayer = layers.find((l) => l.name === 'Pipes');

  type NodeRec = {
    origId: string;
    id: string;
    coord: [number, number];
    invert: number;
    ground: number;
    isOutfall: boolean;
  };

  const rawNodes: NodeRec[] = [];
  let nodes: NodeRec[] = [];

  if (jLayer) {
    const jMap = jLayer.fieldMap;
    jLayer.geojson.features.forEach((f, i) => {
      if (!f.geometry || f.geometry.type !== 'Point') return;
      const raw = String(getMapped(f.properties, jMap, 'label', ['Label']) ?? '');
      const id = sanitizeId(raw, i);
      const ground = Number(
        getMapped(f.properties, jMap, 'ground', [
          'Elevation Ground [ft]',
          'Elevation Ground [ft]:',
        ]) ?? 0
      );
      const invert = Number(
        getMapped(f.properties, jMap, 'inv_out', [
          'Inv Out [ft]',
          'Inv Out [ft]:',
          'Elevation Invert[ft]',
        ]) ?? 0
      );
      const coord = project.forward(
        (f.geometry as any).coordinates as [number, number]
      );
      const isOutfall = raw.toUpperCase().startsWith('OF');
      rawNodes.push({
        origId: id,
        id,
        coord,
        invert,
        ground,
        isOutfall,
      });
    });

    const feetTol = 0.3;
    const byId = new Map<string, NodeRec[]>();
    for (const n of rawNodes) {
      const arr = byId.get(n.origId);
      if (!arr) {
        byId.set(n.origId, [n]);
      } else {
        arr.push(n);
      }
    }
    nodes = [];
    for (const [, arr] of byId.entries()) {
      arr.sort((a, b) => a.coord[0] - b.coord[0] || a.coord[1] - b.coord[1]);
      const merged: NodeRec[] = [];
      arr.forEach((n) => {
        const last = merged[merged.length - 1];
        if (
          last &&
          Math.abs(last.coord[0] - n.coord[0]) < feetTol &&
          Math.abs(last.coord[1] - n.coord[1]) < feetTol
        ) {
          last.invert = Math.min(last.invert, n.invert);
          last.ground = Math.max(last.ground, n.ground);
          last.isOutfall = last.isOutfall || n.isOutfall;
        } else {
          merged.push({ ...n });
        }
      });
      merged.forEach((n, idx) => {
        if (merged.length > 1) {
          n.id = `${n.id}_${idx + 1}`;
        }
        nodes.push(n);
      });
    }

    nodes.sort((a, b) => a.id.localeCompare(b.id));

    nodes.forEach((n) => {
      const type = n.isOutfall ? 'OUTFALL' : 'JUNCTION';
      if (type === 'OUTFALL') {
        outfallLines.push(`${n.id}\t${n.invert}\tFREE\t\tNO\t`);
      } else {
        junctionLines.push(
          `${n.id}\t${n.ground}\t${Math.max(0, n.ground - n.invert)}\t0\t0\t0`
        );
      }
      coordLines.push(`${n.id}\t${n.coord[0]}\t${n.coord[1]}`);
    });
  }

  if (pLayer) {
    const pMap = pLayer.fieldMap;
    const pipeFeatures: Feature<LineString>[] = [];
    pLayer.geojson.features.forEach((f) => {
      if (!f.geometry) return;
      if (f.geometry.type === 'LineString') {
        pipeFeatures.push(f as Feature<LineString>);
      } else if (f.geometry.type === 'MultiLineString') {
        (f.geometry.coordinates as number[][][]).forEach((coords) => {
          pipeFeatures.push({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords },
            properties: f.properties || {},
          });
        });
      }
    });

    const getNode = (pt: [number, number]) => {
      let best: NodeRec | undefined;
      let bestDist = Infinity;
      nodes.forEach((n) => {
        const dx = pt[0] - n.coord[0];
        const dy = pt[1] - n.coord[1];
        const dist = Math.hypot(dx, dy);
        if (dist < bestDist) {
          best = n;
          bestDist = dist;
        }
      });
      return best;
    };

    pipeFeatures.forEach((f, i) => {
      if (!f.geometry || f.geometry.type !== 'LineString') return;
      const coords = (f.geometry as LineString).coordinates;
      if (coords.length < 2) return;
      const projected = coords.map((c) => project.forward(c as [number, number]));
      const from = getNode(projected[0]);
      const to = getNode(projected[projected.length - 1]);
      const len = projected.reduce((sum, curr, idx) => {
        if (idx === 0) return 0;
        const prev = projected[idx - 1];
        return sum + Math.hypot(curr[0] - prev[0], curr[1] - prev[1]);
      }, 0);
      const id = sanitizeId(String((f.properties as any)?.NAME ?? ''), i);
      const rough = Number(
        getMapped(f.properties, pMap, 'rough', ['Roughness']) ?? 0.01
      );
      const diamIn = Number(
        getMapped(f.properties, pMap, 'diameter', ['Diameter [in]']) ?? 12
      );
      const invIn = Number(
        getMapped(f.properties, pMap, 'inv_in', ['Elevation Invert In [ft]']) ??
          (from?.invert ?? 0)
      );
      const invOut = Number(
        getMapped(f.properties, pMap, 'inv_out', ['Elevation Invert Out [ft]']) ??
          (to?.invert ?? 0)
      );
      const diamFt = diamIn / 12;
      const inOffset =
        from && Number.isFinite(invIn) ? invIn - from.invert : 0;
      const outOffset =
        to && Number.isFinite(invOut) ? invOut - to.invert : 0;
      conduitLines.push(
        `${id}\t${from?.id ?? ''}\t${to?.id ?? ''}\t${len.toFixed(3)}\t${rough}\t${inOffset.toFixed(3)}\t${outOffset.toFixed(3)}\t0\t0`
      );
      xsectionLines.push(`${id}\tCIRCULAR\t${diamFt}\t0\t0\t0\t1`);
    });
  }

  const replaceSection = (content: string, section: string, lines: string) => {
    const regex = new RegExp(String.raw`\[${section}\][\s\S]*?(?=\r?\n\[|$)`);
    return content.replace(regex, `[${section}]\n${lines}\n`);
  };

  const subcatchHeader =
    ';;Name\tRain Gage\tOutlet\tArea\t%Imperv\tWidth\t%Slope\tCurbLen\tSnowPack\n';
  const subareaHeader =
    ';;Subcatchment\tN-Imperv\tN-Perv\tS-Imperv\tS-Perv\tPctZero\tRouteTo\tPctRouted\n';
  const infilHeader =
    ';;Subcatchment\tParam1\tParam2\tParam3\tParam4\tParam5\n';
  const polygonHeader = ';;Subcatchment\tX-Coord\tY-Coord\n';
  const junctionHeader =
    ';;Name\tElevation  MaxDepth   InitDepth  SurDepth   Aponded\n';
  const outfallHeader =
    ';;Name\tElevation  Type       Stage Data       Gated    Route To\n';
  const conduitHeader =
    ';;Name\tFrom Node        To Node          Length     Roughness  InOffset   OutOffset  InitFlow   MaxFlow\n';
  const xsectionHeader =
    ';;Link           Shape        Geom1            Geom2      Geom3      Geom4      Barrels    Culvert\n';
  const coordHeader = ';;Node           X-Coord            Y-Coord\n';

  let content = template;
  content = replaceSection(
    content,
    'SUBCATCHMENTS',
    subcatchHeader + subcatchLines.join('\n')
  );
  content = replaceSection(
    content,
    'SUBAREAS',
    subareaHeader + subareaLines.join('\n')
  );
  content = replaceSection(
    content,
    'INFILTRATION',
    infilHeader + infilLines.join('\n')
  );
  content = replaceSection(
    content,
    'POLYGONS',
    polygonHeader + filteredPolygonLines.join('\n')
  );
  content = replaceSection(
    content,
    'JUNCTIONS',
    junctionHeader + junctionLines.join('\n')
  );
  content = replaceSection(
    content,
    'OUTFALLS',
    outfallHeader + outfallLines.join('\n')
  );
  content = replaceSection(
    content,
    'CONDUITS',
    conduitHeader + conduitLines.join('\n')
  );
  content = replaceSection(
    content,
    'XSECTIONS',
    xsectionHeader + xsectionLines.join('\n')
  );
  content = replaceSection(
    content,
    'COORDINATES',
    coordHeader + coordLines.join('\n')
  );

  if (filteredPolygonLines.length) {
    const allRings = filteredPolygonLines
      .map((l) => l.split(/\s+/))
      .map(([_, x, y]) => [Number(x), Number(y)]);
    const [minX, minY, maxX, maxY] = bbox({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'MultiPoint', coordinates: allRings },
          properties: {},
        },
      ],
    } as any);
    const dx = (maxX - minX) * 0.01;
    const dy = (maxY - minY) * 0.01;
    const mapBlock = `[MAP]\nDIMENSIONS       ${minX - dx} ${minY - dy}  ${
      maxX + dx
    } ${maxY + dy}\nUNITS            ${
      projection.units === 'feet' ? 'Feet' : 'Meters'
    }\n`;
    content = content.replace(
      /\[MAP\][\s\S]*?(?=\r?\n\[|$)/,
      mapBlock
    );
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const filename = `${(projectName || 'project')}_${projectVersion}.inp`;
  log('SWMM file exported');

  return { blob, filename, logs };
};
