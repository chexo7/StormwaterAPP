import type {
  Feature,
  FeatureCollection,
  Polygon,
  GeoJsonProperties,
  Geometry,
} from 'geojson';
import { flattenEach, rewind, area as turfArea } from '@turf/turf';

/**
 * Normaliza un FeatureCollection para exportar a Shapefile:
 * - Aplana MultiPolygon -> Polygon individuales
 * - Reorienta anillos a convención de Shapefile (reverse: true -> exterior CW)
 * - Limpia propiedades a DBF (≤10 chars, sin objetos/arrays, strings ≤254)
 * - Agrega ID incremental (UID) y área en acres (AREA_AC)
 */
export function prepareForShapefile(fc: FeatureCollection, layerName: string): FeatureCollection {
  const out: Feature<Geometry, GeoJsonProperties>[] = [];
  let uid = 1;

  flattenEach(fc as any, (feat) => {
    if (!feat || !feat.geometry) return;
    const geomType = feat.geometry.type;

    if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
      // Reorienta anillos para Shapefile (exterior CW, agujeros CCW)
      const rew = rewind(feat as any, { reverse: true });

      // Área en acres (útil para QA y evita “features invisibles” por agujeros mal interpretados)
      const m2 = turfArea(rew as any);
      const acres = Number((m2 * 0.000247105381).toFixed(6));

      // Sanitiza propiedades para DBF
      const props = sanitizeProps(
        { ...(feat.properties || {}), UID: uid, AREA_AC: acres },
        layerName
      );

      out.push({
        type: 'Feature',
        geometry: rew.geometry as Polygon,
        properties: props,
      });
    } else {
      const props = sanitizeProps({ ...(feat.properties || {}), UID: uid }, layerName);
      out.push({
        type: 'Feature',
        geometry: feat.geometry as Geometry,
        properties: props,
      });
    }

    uid++;
  });

  return { type: 'FeatureCollection', features: out };
}

/** Mantiene sólo claves “seguras” y compatibles con DBF, renombra a ≤10 chars, sin colisiones */
function sanitizeProps(props: GeoJsonProperties, layerName: string): GeoJsonProperties {
  // Ajusta esta whitelist si quieres controlar qué va a DBF por capa
  const wlMap: Record<string, string[]> = {
    'Completed Drainage Subareas': ['DA_NAME', 'SUBDA_NAME', 'IS_COMPLEMENT'],
    'Overlay': ['DA_NAME', 'SUBDA_NAME', 'LAND_COVER', 'HSG', 'CN']
  };

  const wl = wlMap[layerName] || Object.keys(props || {});
  const out: Record<string, number | string> = {};
  const used = new Set<string>();

  for (const key of wl) {
    if (!(key in (props || {}))) continue;
    let v = (props as any)[key];

    if (v === null || typeof v === 'undefined') v = '';

    // DBF no admite objetos/arrays -> a string
    if (typeof v === 'object' && v !== null) v = JSON.stringify(v);
    if (typeof v === 'number' && !Number.isFinite(v)) v = '';
    if (typeof v === 'string') v = v.slice(0, 254); // límite típico DBF

    // Renombra a ≤10 chars, solo [A-Za-z0-9_]
    let k = key.slice(0, 10).replace(/[^A-Za-z0-9_]/g, '_');
    if (k.length === 0) k = 'F_' + Math.random().toString(36).slice(2, 6).toUpperCase();

    // Evita colisiones tras truncado
    while (used.has(k)) {
      k = (k.slice(0, 8) + '_' + Math.floor(Math.random() * 90 + 10)).slice(0, 10);
    }
    used.add(k);

    // A DBF sólo number|string; nulls y undefined los saltamos
    if (typeof v === 'number' || typeof v === 'string') out[k] = v;
  }

  return out;
}

