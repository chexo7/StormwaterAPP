import proj4 from 'proj4';
import type { FeatureCollection, Geometry } from 'geojson';

export function reprojectTo3857(fc: FeatureCollection): FeatureCollection {
  const transform = proj4('EPSG:4326', 'EPSG:3857');

  const projectCoords = (coords: any): any => {
    if (typeof coords[0] === 'number') {
      const [x, y] = transform.forward([coords[0], coords[1]]);
      return [x, y];
    }
    return coords.map(projectCoords);
  };

  const projectGeometry = (geometry: Geometry): Geometry => {
    return {
      ...geometry,
      coordinates: projectCoords((geometry as any).coordinates),
    } as Geometry;
  };

  return {
    ...fc,
    features: fc.features.map(f => ({
      ...f,
      geometry: projectGeometry(f.geometry),
    })),
  };
}
