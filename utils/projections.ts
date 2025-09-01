import proj4 from 'proj4';
import type { FeatureCollection } from 'geojson';

export interface ProjectionOption {
  label: string;
  epsg: string;
  units: 'meters' | 'feet';
}

export const PROJECTION_OPTIONS: ProjectionOption[] = [
  { label: 'WGS84 (EPSG:4326)', epsg: '4326', units: 'meters' },
  { label: 'NAD83 / California zone 3 (ftUS) (EPSG:2227)', epsg: '2227', units: 'feet' },
];

export async function loadProjection(epsg: string): Promise<string> {
  if (!proj4.defs[`EPSG:${epsg}`]) {
    const projRes = await fetch(`https://epsg.io/${epsg}.proj4`);
    const projText = await projRes.text();
    proj4.defs(`EPSG:${epsg}`, projText);
  }
  const wktRes = await fetch(`https://epsg.io/${epsg}.wkt`);
  return await wktRes.text();
}

export function reprojectFeatureCollection(
  fc: FeatureCollection,
  fromEpsg: string,
  toEpsg: string
): FeatureCollection {
  const transformer = proj4(`EPSG:${fromEpsg}`, `EPSG:${toEpsg}`);
  const projectCoords = (coords: any): any => {
    if (typeof coords[0] === 'number') {
      const [x, y] = transformer.forward(coords as [number, number]);
      return [x, y];
    }
    return coords.map(projectCoords);
  };
  return {
    type: 'FeatureCollection',
    features: fc.features.map(f => ({
      ...f,
      geometry: {
        ...f.geometry,
        coordinates: projectCoords((f.geometry as any).coordinates),
      },
    })),
  };
}

