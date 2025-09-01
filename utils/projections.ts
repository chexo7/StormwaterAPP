import epsgIndex from 'epsg-index/all.json' assert { type: 'json' };
import { ProjectionOption } from '../types';

const index: Record<string, any> = epsgIndex as any;

const NAD83_STATE_PLANE = Object.values(index)
  .filter(
    (def: any) =>
      def.name?.includes('NAD83') &&
      def.name.toLowerCase().includes('zone') &&
      !def.name.toLowerCase().includes('utm') &&
      def.kind === 'CRS-PROJCRS'
  )
  .map((def: any) => ({
    name: def.name,
    epsg: def.code,
    proj4: def.proj4,
    units: def.unit?.toLowerCase().includes('foot') ? 'feet' : 'meters',
  }))
  .sort((a: ProjectionOption, b: ProjectionOption) => a.name.localeCompare(b.name));

export const STATE_PLANE_OPTIONS: ProjectionOption[] = [
  {
    name: 'WGS 84 / Pseudo-Mercator (m)',
    epsg: '3857',
    proj4: index['3857'].proj4,
    units: 'meters',
  },
  ...NAD83_STATE_PLANE,
];

