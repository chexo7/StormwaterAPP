import { intersect as turfIntersect } from '@turf/turf';
import type { Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import type { LayerData } from '../types';

export function intersectLodWithLayers(layers: LayerData[]): FeatureCollection | null {
  const lod = layers.find(l => l.name === 'LOD');
  const da = layers.find(l => l.name === 'Drainage Areas');
  const lc = layers.find(l => l.name === 'Land Cover');
  const wss = layers.find(l => l.name === 'Soil Layer from Web Soil Survey');
  if (!lod || !da || !lc || !wss) return null;
  const targets = [da, lc, wss];
  const features: Feature<Polygon | MultiPolygon>[] = [];

  for (const lodFeature of lod.geojson.features) {
    targets.forEach(layer => {
      layer.geojson.features.forEach(f => {
        const inter = turfIntersect(lodFeature as any, f as any) as Feature<Polygon | MultiPolygon> | null;
        if (inter) {
          inter.properties = { ...(f.properties || {}), SOURCE_LAYER: layer.name };
          features.push(inter);
        }
      });
    });
  }

  return { type: 'FeatureCollection', features };
}
