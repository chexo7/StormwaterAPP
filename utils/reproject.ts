import type { FeatureCollection, Geometry } from 'geojson';
import proj4 from 'proj4';

export function reprojectFeatureCollection(fc: FeatureCollection, proj4Def: string): FeatureCollection {
  const project = proj4('EPSG:4326', proj4Def);
  const forward = (coord: [number, number]): [number, number] => {
    const [x, y] = project.forward(coord);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(
        `Projection produced invalid coordinates for ${JSON.stringify(coord)} using definition: ${proj4Def}`
      );
    }
    return [x, y] as [number, number];
  };
  const reprojectCoords = (coords: any): any => {
    if (typeof coords[0] === 'number') {
      return forward(coords as [number, number]);
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
