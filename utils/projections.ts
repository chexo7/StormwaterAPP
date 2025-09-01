import { ProjectionOption } from '../types';

export const STATE_PLANE_OPTIONS: ProjectionOption[] = [
  {
    name: 'WGS 84 / Pseudo-Mercator (m)',
    epsg: '3857',
    proj4: '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
    units: 'meters',
  },
  {
    name: 'NAD83 / California zone 3 (ftUS)',
    epsg: '2227',
    proj4: '+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=656166.6666666665 +y_0=1640416.666666667 +datum=NAD83 +units=us-ft +no_defs +type=crs',
    units: 'feet',
  },
  {
    name: 'NAD83 / Texas North Central (ftUS)',
    epsg: '2276',
    proj4: '+proj=lcc +lat_1=32.13333333333333 +lat_2=33.96666666666667 +lat_0=31.66666666666667 +lon_0=-98.5 +x_0=600000.0000000001 +y_0=2000000 +datum=NAD83 +units=us-ft +no_defs +type=crs',
    units: 'feet',
  },
];
