import type { FeatureCollection } from 'geojson';
import { coordEach } from '@turf/meta';
import proj4 from 'proj4';

export interface ProjectionOption {
  label: string;
  epsg: string;
  proj4: string;
  wkt: string;
  units: 'm' | 'ft';
}

export const PROJECTIONS: ProjectionOption[] = [
  {
    label: 'WGS84 (EPSG:4326)',
    epsg: 'EPSG:4326',
    proj4: '+proj=longlat +datum=WGS84 +no_defs +type=crs',
    wkt: 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433]]',
    units: 'm'
  },
  {
    label: 'NAD83 / Florida East (ftUS) (EPSG:2236)',
    epsg: 'EPSG:2236',
    proj4: '+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=656166.6666666665 +y_0=0 +datum=NAD83 +units=us-ft +no_defs +type=crs',
    wkt: 'PROJCS["NAD_1983_StatePlane_Florida_East_FIPS_0901_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",656166.6666666665],PARAMETER["False_Northing",0],PARAMETER["Central_Meridian",-81],PARAMETER["Scale_Factor",0.999941177],PARAMETER["Latitude_Of_Origin",24.33333333333333],UNIT["Foot_US",0.3048006096012192]]',
    units: 'ft'
  }
];

export function reprojectGeoJson(fc: FeatureCollection, target: ProjectionOption): FeatureCollection {
  if (target.epsg === 'EPSG:4326') return fc;
  if (!proj4.defs(target.epsg)) {
    proj4.defs(target.epsg, target.proj4);
  }
  const transformer = proj4('EPSG:4326', target.epsg);
  const cloned: FeatureCollection = JSON.parse(JSON.stringify(fc));
  coordEach(cloned as any, (coord) => {
    const [x, y] = transformer.forward(coord as [number, number]);
    coord[0] = x;
    coord[1] = y;
  });
  return cloned;
}
