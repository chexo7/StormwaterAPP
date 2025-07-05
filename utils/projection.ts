import proj4 from 'proj4';
import type { FeatureCollection, Geometry } from 'geojson';

const transform = proj4('EPSG:4326', 'EPSG:3857');

function projectCoords(coords: any): any {
  if (typeof coords[0] === 'number') {
    const [x, y] = transform.forward(coords as [number, number]);
    return [x, y];
  }
  return coords.map(projectCoords);
}

export function reprojectTo3857(fc: FeatureCollection): FeatureCollection {
  return {
    ...fc,
    features: fc.features.map(f => ({
      ...f,
      geometry: {
        ...f.geometry,
        coordinates: projectCoords((f.geometry as Geometry).coordinates as any)
      }
    }))
  };
}
