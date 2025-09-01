import { ProjectionOption } from '../types';
import epsgIndex from 'epsg-index/all.json' assert { type: 'json' };

const additional: ProjectionOption[] = Object.values(epsgIndex)
  .filter(
    (def: any) =>
      def.kind === 'CRS-PROJCRS' &&
      typeof def.name === 'string' &&
      def.name.startsWith('NAD83 /') &&
      !def.name.includes('UTM')
  )
  .map(def => ({
    name: def.name as string,
    epsg: def.code as string,
    proj4: def.proj4 as string,
    units: def.unit && String(def.unit).toLowerCase().includes('foot') ? 'feet' : 'meters',
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const STATE_PLANE_OPTIONS: ProjectionOption[] = [
  {
    name: 'WGS 84 / Pseudo-Mercator (m)',
    epsg: '3857',
    proj4: '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
    units: 'meters',
  },
  ...additional,
];
