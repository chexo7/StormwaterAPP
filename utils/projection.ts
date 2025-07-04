import proj4 from 'proj4';
import type { FeatureCollection, Geometry } from 'geojson';

const SRC = 'EPSG:4326';
const DEST = 'EPSG:3857';

function transformCoords(coords: any): any {
  if (typeof coords[0] === 'number') {
    return proj4(SRC, DEST, coords as [number, number]);
  }
  return coords.map((c: any) => transformCoords(c));
}

export function reprojectTo3857(geojson: FeatureCollection): FeatureCollection {
  const clone: FeatureCollection = JSON.parse(JSON.stringify(geojson));
  clone.features = clone.features.map(f => {
    if (f.geometry && f.geometry.coordinates) {
      const geom: Geometry = {
        ...f.geometry,
        coordinates: transformCoords(f.geometry.coordinates)
      } as Geometry;
      return { ...f, geometry: geom };
    }
    return f;
  });
  return clone;
}
