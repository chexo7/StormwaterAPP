import { Feature, Geometry } from 'geojson';
import { coordEach } from '@turf/meta';
import flatten from '@turf/flatten';

/**
 * Remove any Z/M coordinates from a GeoJSON feature or geometry in-place.
 */
export function dropZ<T extends Feature | Geometry>(input: T): T {
  const obj: any = input;
  coordEach(obj, (coords: number[]) => {
    if (coords.length > 2) {
      coords.length = 2;
    }
  }, true);
  return obj;
}

/**
 * Flatten a GeoJSON feature or geometry into individual polygon features.
 */
export function flattenPolygons(input: Feature | Geometry) {
  return flatten(input as any).features as Feature[];
}
