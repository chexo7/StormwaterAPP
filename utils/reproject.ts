import type { FeatureCollection, Geometry } from 'geojson';
import proj4 from 'proj4';

export function reprojectFeatureCollection(fc: FeatureCollection, proj4Def: string): FeatureCollection {
  const project = proj4('EPSG:4326', proj4Def);
  const reprojectCoords = (coords: any): any => {
    if (typeof coords[0] === 'number') {
      const [x, y] = project.forward(coords as [number, number]);
      return [x, y];
    }
    return coords.map(reprojectCoords);
  };
  return {
    type: 'FeatureCollection',
    features: fc.features.map((f) =>
      f.geometry
        ? {
            ...f,
            geometry: {
              ...(f.geometry as Geometry),
              coordinates: reprojectCoords((f.geometry as any).coordinates),
            },
          }
        : f
    ),
  };
}
