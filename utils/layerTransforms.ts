import type { FeatureCollection, Feature, LineString, Point } from 'geojson';
import type { LayerData } from '../types';
import { getDir } from './direction';

type Dir8 = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface LayerTransformContext {
  landCoverOptions: string[];
  layers: LayerData[];
  fieldMap?: Record<string, string>;
}

const cloneGeojson = (geojson: FeatureCollection, features: Feature[]): FeatureCollection => ({
  ...geojson,
  features,
});

const normalizeDrainageAreas = (geojson: FeatureCollection): FeatureCollection =>
  cloneGeojson(
    geojson,
    geojson.features.map(feature => ({
      ...feature,
      properties: { ...(feature.properties || {}), DA_NAME: feature.properties?.DA_NAME ?? '' },
    }))
  );

const normalizeLandCover = (
  geojson: FeatureCollection,
  landCoverOptions: string[]
): FeatureCollection =>
  cloneGeojson(
    geojson,
    geojson.features.map(feature => {
      const rawSource = (feature.properties as any)?.LandCover ?? (feature.properties as any)?.LAND_COVER;
      const rawValue = rawSource == null ? '' : String(rawSource);
      const match = landCoverOptions.find(opt => opt.toLowerCase() === rawValue.toLowerCase());
      return {
        ...feature,
        properties: { ...(feature.properties || {}), LAND_COVER: match ?? rawValue },
      };
    })
  );

const normalizeSoils = (geojson: FeatureCollection): FeatureCollection =>
  cloneGeojson(
    geojson,
    geojson.features.map(feature => ({
      ...feature,
      properties: { ...(feature.properties || {}), HSG: feature.properties?.HSG ?? '' },
    }))
  );

const preparePipesLayer = (
  geojson: FeatureCollection,
  fieldMap: Record<string, string>,
  layers: LayerData[]
): FeatureCollection => {
  const cbLayer = layers.find(l => l.name === 'Catch Basins / Manholes');
  const cbFeatures =
    cbLayer?.geojson.features.filter(f => f.geometry && f.geometry.type === 'Point') || [];

  const nearestCb = (pt: [number, number]) => {
    let best: Feature<Point> | null = null;
    let bestDist = Infinity;
    cbFeatures.forEach(cb => {
      const c = (cb.geometry as Point).coordinates as [number, number];
      const dx = pt[0] - c[0];
      const dy = pt[1] - c[1];
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        best = cb as Feature<Point>;
      }
    });
    return best;
  };

  const invFromCb = (cb: Feature<Point> | null, dir: Dir8) => {
    if (!cb) return null;
    const properties = cb.properties || {};
    const keyMap: Record<Dir8, string> = {
      N: 'Invert N [ft]',
      S: 'Invert S [ft]',
      E: 'Invert E [ft]',
      W: 'Invert W [ft]',
      NE: 'Invert NE [ft]',
      SE: 'Invert SE [ft]',
      SW: 'Invert SW [ft]',
      NW: 'Invert NW [ft]',
    };
    const val = Number((properties as any)[keyMap[dir]]);
    if (Number.isFinite(val)) return val;
    const outVal = Number((properties as any)['Inv Out [ft]']);
    if (Number.isFinite(outVal)) return outVal;
    const nodeVal = Number((properties as any)['Elevation Invert[ft]']);
    return Number.isFinite(nodeVal) ? nodeVal : null;
  };

  const invOutFromCb = (cb: Feature<Point> | null) => {
    if (!cb) return null;
    const properties = cb.properties || {};
    const val = Number((properties as any)['Elevation Invert[ft]']);
    if (Number.isFinite(val)) return val;
    const outVal = Number((properties as any)['Inv Out [ft]']);
    if (Number.isFinite(outVal)) return outVal;
    const dirs = [
      'Invert N [ft]',
      'Invert S [ft]',
      'Invert E [ft]',
      'Invert W [ft]',
      'Invert NE [ft]',
      'Invert SE [ft]',
      'Invert SW [ft]',
      'Invert NW [ft]',
    ];
    const nums = dirs
      .map(k => Number((properties as any)[k]))
      .filter(n => !isNaN(n));
    return nums.length ? Math.min(...nums) : null;
  };

  const features = geojson.features.map((feature, index) => {
    const properties = feature.properties || {};
    const labelSource = fieldMap.label && properties[fieldMap.label] != null ? properties[fieldMap.label] : null;
    const label = labelSource && String(labelSource).trim() !== '' ? String(labelSource) : `Pipe-${index + 1}`;
    const diameterSource =
      fieldMap.diameter && properties[fieldMap.diameter] !== undefined
        ? Number(properties[fieldMap.diameter])
        : NaN;
    const roughnessSource =
      fieldMap.roughness && properties[fieldMap.roughness] !== undefined
        ? Number(properties[fieldMap.roughness])
        : NaN;
    let invIn = fieldMap.inv_in && properties[fieldMap.inv_in] !== undefined ? Number(properties[fieldMap.inv_in]) : null;
    let invOut =
      fieldMap.inv_out && properties[fieldMap.inv_out] !== undefined ? Number(properties[fieldMap.inv_out]) : null;
    let direction: string | null = null;

    if (fieldMap.direction && properties[fieldMap.direction] != null) {
      direction = String(properties[fieldMap.direction]);
    } else if ((properties as any)['Directions']) {
      direction = String((properties as any)['Directions']);
    }

    let inletOffset: number | null = null;
    let outletOffset: number | null = null;

    if (!direction && feature.geometry && feature.geometry.type === 'LineString' && cbFeatures.length) {
      const coords = (feature.geometry as LineString).coordinates;
      const start = coords[0] as [number, number];
      const end = coords[coords.length - 1] as [number, number];
      const second = coords[1] as [number, number] | undefined;
      const prev = coords[coords.length - 2] as [number, number] | undefined;
      const cbStart = nearestCb(start);
      const cbEnd = nearestCb(end);
      const dirStart = second ? getDir(start, second) : null;
      const dirEnd = prev ? getDir(end, prev) : null;
      if (!invIn && dirStart) {
        invIn = invFromCb(cbStart, dirStart);
      }
      if (!invOut && dirEnd) {
        invOut = invFromCb(cbEnd, dirEnd);
      }
      const nodeStart = invOutFromCb(cbStart);
      const nodeEnd = invOutFromCb(cbEnd);
      let fromCb = cbStart;
      let toCb = cbEnd;
      let invInVal = invIn;
      let invOutVal = invOut;
      let fromNode = nodeStart;
      let toNode = nodeEnd;
      if (nodeStart != null && nodeEnd != null && nodeStart < nodeEnd) {
        fromCb = cbEnd;
        toCb = cbStart;
        invInVal = invOut;
        invOutVal = invIn;
        fromNode = nodeEnd;
        toNode = nodeStart;
      }
      const fromLabel = fromCb?.properties?.['Label'];
      const toLabel = toCb?.properties?.['Label'];
      direction = fromLabel && toLabel ? `${fromLabel} to ${toLabel}` : null;
      inletOffset = invInVal != null && fromNode != null ? invInVal - fromNode : null;
      outletOffset = invOutVal != null && toNode != null ? invOutVal - toNode : null;
      invIn = invInVal;
      invOut = invOutVal;
    }

    const diameter = !isNaN(diameterSource) && diameterSource > 0 ? diameterSource : 15;
    const roughness = !isNaN(roughnessSource) && roughnessSource > 0 ? roughnessSource : 0.012;

    return {
      ...feature,
      properties: {
        'Label': label,
        'Directions': direction,
        'Elevation Invert In [ft]': invIn,
        'Elevation Invert Out [ft]': invOut,
        'Inlet Offset [InOffset]': inletOffset,
        'Outlet Offset [OutOffset]': outletOffset,
        'Diameter [in]': diameter,
        'Roughness': roughness,
      },
    } as Feature<LineString>;
  });

  return cloneGeojson(geojson, features);
};

const prepareCatchBasinsLayer = (
  geojson: FeatureCollection,
  fieldMap: Record<string, string>
): FeatureCollection => {
  const getInv = (props: any, columnKey: string) => {
    const column = fieldMap[columnKey];
    if (!column) return null;
    const value = Number(props[column]);
    return Number.isFinite(value) ? value : null;
  };

  const features = geojson.features.map(feature => {
    const props = feature.properties || {};
    const labelSource = fieldMap.label && props[fieldMap.label] != null ? props[fieldMap.label] : null;
    const label = labelSource && String(labelSource).trim() !== '' ? String(labelSource) : `CB-MH-${Math.floor(Math.random() * 200) + 1}`;

    const invN = getInv(props, 'inv_n');
    const invS = getInv(props, 'inv_s');
    const invE = getInv(props, 'inv_e');
    const invW = getInv(props, 'inv_w');
    const invNE = getInv(props, 'inv_ne');
    const invSE = getInv(props, 'inv_se');
    const invSW = getInv(props, 'inv_sw');
    const invNW = getInv(props, 'inv_nw');

    let invOut = fieldMap.inv_out && props[fieldMap.inv_out] !== undefined ? Number(props[fieldMap.inv_out]) : null;
    const invCandidates = [invN, invS, invE, invW, invNE, invSE, invSW, invNW].filter(
      (v): v is number => v !== null
    );
    if (invOut === null || isNaN(invOut)) {
      invOut = invCandidates.length ? Math.min(...invCandidates) : null;
    }
    const nodeInv = invOut !== null && !isNaN(invOut)
      ? invOut
      : invCandidates.length
        ? Math.min(...invCandidates)
        : null;
    let ground: number | null = null;
    if (fieldMap.ground && props[fieldMap.ground] !== undefined) {
      const parsed = Number(props[fieldMap.ground]);
      ground = Number.isFinite(parsed) ? parsed : null;
    }

    return {
      ...feature,
      properties: {
        'Label': label,
        'Elevation Ground [ft]': ground,
        'Invert N [ft]': invN,
        'Invert S [ft]': invS,
        'Invert E [ft]': invE,
        'Invert W [ft]': invW,
        'Invert NE [ft]': invNE,
        'Invert SE [ft]': invSE,
        'Invert SW [ft]': invSW,
        'Invert NW [ft]': invNW,
        'Inv Out [ft]': invOut,
        'Elevation Invert[ft]': nodeInv,
      },
    };
  });

  return cloneGeojson(geojson, features);
};

export const transformLayerGeojson = (
  name: string,
  geojson: FeatureCollection,
  { landCoverOptions, layers, fieldMap }: LayerTransformContext
): FeatureCollection => {
  if (name === 'Drainage Areas') {
    return normalizeDrainageAreas(geojson);
  }

  if (name === 'Land Cover') {
    return normalizeLandCover(geojson, landCoverOptions);
  }

  if (name === 'Soil Layer from Web Soil Survey') {
    return normalizeSoils(geojson);
  }

  if (name === 'Pipes' && fieldMap) {
    return preparePipesLayer(geojson, fieldMap, layers);
  }

  if (name === 'Catch Basins / Manholes' && fieldMap) {
    return prepareCatchBasinsLayer(geojson, fieldMap);
  }

  return geojson;
};
