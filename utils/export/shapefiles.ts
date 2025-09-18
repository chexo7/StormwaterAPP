import type {
  Feature,
  FeatureCollection,
  LineString,
  Point,
} from 'geojson';
import type { Converter } from 'proj4';
import type { LayerData, ProjectionOption } from '../../types';
import { prepareForShapefile } from '../shp';
import { reprojectFeatureCollection } from '../reproject';
import { resolvePrj } from '../prj';
import { ExportError, type ExportResult, type ExportLogEntry } from './types';

interface ShapefileExportParams {
  layers: LayerData[];
  projectName?: string;
  projectVersion: string;
  projection: ProjectionOption;
  project: Converter;
}

interface ProcessedLayer {
  name: string;
  geojson: FeatureCollection;
}

export const exportShapefiles = async ({
  layers,
  projectName,
  projectVersion,
  projection,
  project,
}: ShapefileExportParams): Promise<ExportResult> => {
  const logs: ExportLogEntry[] = [];
  const log = (message: string, level: ExportLogEntry['level'] = 'info') => {
    logs.push({ message, level });
  };

  const baseProcessed = layers.filter(
    (l) => l.category === 'Process' || l.name === 'Catch Basins / Manholes'
  );

  const processedLayers: ProcessedLayer[] = baseProcessed.map((l) => ({
    name: l.name,
    geojson: l.geojson,
  }));

  const jLayer = layers.find((l) => l.name === 'Catch Basins / Manholes');
  const pLayer = layers.find((l) => l.name === 'Pipes');

  if (jLayer && pLayer) {
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

    const sanitizeId = (s: string, i: number) =>
      (s || `S${i + 1}`)
        .trim()
        .replace(/[^\w\-]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 31);

    type NodeRec = { id: string; coord: [number, number]; invert: number };
    const jMap = jLayer.fieldMap;
    const nodeFeatures = jLayer.geojson.features.filter(
      (f) => f.geometry && f.geometry.type === 'Point'
    ) as Feature<Point>[];
    const nodes: NodeRec[] = [];
    const goodNodeFeatures: Feature<Point>[] = [];
    nodeFeatures.forEach((f, i) => {
      const props = f.properties;
      const id = sanitizeId(
        String(getMapped(props, jMap, 'label', ['Label']) ?? ''),
        i
      );
      const invert = Number(
        getMapped(props, jMap, 'inv_out', [
          'Inv Out [ft]',
          'Inv Out [ft]:',
          'Elevation Invert[ft]',
        ])
      );
      const ground = Number(
        getMapped(props, jMap, 'ground', ['Elevation Ground [ft]'])
      );
      if (!Number.isFinite(invert) || !Number.isFinite(ground)) return;
      const coord = project.forward(
        (f.geometry as any).coordinates as [number, number]
      );
      nodes.push({ id, coord, invert });
      goodNodeFeatures.push(f);
    });

    const cbIdx = processedLayers.findIndex(
      (l) => l.name === 'Catch Basins / Manholes'
    );
    if (cbIdx >= 0) {
      processedLayers[cbIdx] = {
        name: processedLayers[cbIdx].name,
        geojson: {
          type: 'FeatureCollection',
          features: goodNodeFeatures,
        },
      };
    }

    const findNearestNode = (pt: [number, number]) => {
      let best: NodeRec | undefined;
      let bestDist = Infinity;
      for (const n of nodes) {
        const dx = pt[0] - n.coord[0];
        const dy = pt[1] - n.coord[1];
        const d = Math.hypot(dx, dy);
        if (d < bestDist) {
          best = n;
          bestDist = d;
        }
      }
      return best;
    };

    const pMap = pLayer.fieldMap;
    const rawPipeFeatures: Feature<LineString>[] = [];
    pLayer.geojson.features.forEach((f) => {
      if (!f.geometry) return;
      if (f.geometry.type === 'LineString') {
        rawPipeFeatures.push(f as Feature<LineString>);
      } else if (f.geometry.type === 'MultiLineString') {
        (f.geometry.coordinates as number[][][]).forEach((coords) => {
          rawPipeFeatures.push({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords },
            properties: f.properties || {},
          });
        });
      }
    });

    const pipeOut: Feature<LineString>[] = [];
    rawPipeFeatures.forEach((f, i) => {
      if (!f.geometry || f.geometry.type !== 'LineString') return;
      const coords = (f.geometry as LineString).coordinates;
      if (coords.length < 2) return;
      const projected = coords.map((c) => project.forward(c as [number, number]));
      const from = findNearestNode(projected[0]);
      const to = findNearestNode(projected[projected.length - 1]);
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
      const slope = len > 0 ? (invIn - invOut) / len : 0;
      const inOffset = from ? invIn - from.invert : 0;
      const outOffset = to ? invOut - to.invert : 0;
      pipeOut.push({
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          ID: id,
          FROM_ID: from?.id ?? '',
          TO_ID: to?.id ?? '',
          LEN_FT: Number(len.toFixed(3)),
          DIAM_IN: Number(diamIn.toFixed(3)),
          INV_IN: Number(invIn.toFixed(3)),
          INV_OUT: Number(invOut.toFixed(3)),
          ROUGH: rough,
          SLOPE: Number(slope.toFixed(6)),
          IN_OFF: Number(inOffset.toFixed(3)),
          OUT_OFF: Number(outOffset.toFixed(3)),
        },
      });
    });
    if (pipeOut.length > 0) {
      processedLayers.push({
        name: 'Pipe Network',
        geojson: {
          type: 'FeatureCollection',
          features: pipeOut,
        } as FeatureCollection,
      });
    }
  }

  if (processedLayers.length === 0) {
    throw new ExportError('No processed layers to export');
  }

  const JSZip = (await import('jszip')).default;
  const shpwrite = (await import('@mapbox/shp-write')).default as any;
  const zip = new JSZip();

  let prj: string;
  try {
    prj = await resolvePrj(projection.epsg);
  } catch (e) {
    throw new ExportError(
      `Export canceled: missing PRJ for EPSG:${projection.epsg}`
    );
  }

  for (const layer of processedLayers) {
    const prepared = prepareForShapefile(layer.geojson, layer.name);
    const projected = reprojectFeatureCollection(prepared, projection.proj4);
    log(`Exporting "${layer.name}": ${projected.features.length} features`);
    const layerZipBuffer = await shpwrite.zip(projected, {
      outputType: 'arraybuffer',
      prj,
    });
    const layerZip = await JSZip.loadAsync(layerZipBuffer);
    const folderName = layer.name.replace(/[^a-z0-9_\-]/gi, '_');
    const folder = zip.folder(folderName);
    if (!folder) continue;
    await Promise.all(
      Object.keys(layerZip.files).map(async (filename) => {
        const content = await layerZip.files[filename].async('arraybuffer');
        folder.file(filename, content);
      })
    );
    const dbf = Object.keys(layerZip.files).find((f) =>
      f.toLowerCase().endsWith('.dbf')
    );
    if (dbf) {
      const base = dbf.replace(/\.dbf$/i, '');
      folder.file(`${base}.cpg`, 'UTF-8');
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = `${(projectName || 'project')}_${projectVersion}_shapefiles.zip`;
  log('Processed shapefiles exported');

  return { blob, filename, logs };
};
