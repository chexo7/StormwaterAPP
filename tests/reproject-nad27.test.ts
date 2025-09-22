import test from 'node:test';
import assert from 'node:assert/strict';
import type { FeatureCollection, Point } from 'geojson';
import { reprojectFeatureCollection } from '../utils/reproject';
import { STATE_PLANE_OPTIONS } from '../utils/statePlaneOptions';

test('NAD27 Alabama East projection yields finite coordinates', () => {
  const option = STATE_PLANE_OPTIONS.find((opt) => opt.epsg === '26729');
  assert.ok(option, 'Expected to find NAD27 Alabama East option');

  const sample: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-86.75, 32.75],
        },
        properties: {},
      },
    ],
  };

  const projected = reprojectFeatureCollection(sample, option.proj4);
  assert.equal(projected.features.length, 1);
  const coords = (projected.features[0].geometry as Point).coordinates as [number, number];
  assert.ok(Number.isFinite(coords[0]) && Number.isFinite(coords[1]), 'Projected coordinate should be finite');
});
