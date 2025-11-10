import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import * as ts from 'typescript';

const loadLayerTransforms = async () => {
  const sourceUrl = new URL('../utils/layerTransforms.ts', import.meta.url);
  const sourcePath = fileURLToPath(sourceUrl);
  const tsSource = await readFile(sourcePath, 'utf8');
  let { outputText } = ts.transpileModule(tsSource, {
    compilerOptions: {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: sourcePath,
  });

  const directionUrl = new URL('../utils/direction.js', import.meta.url);
  outputText = outputText.replace(/from\s+['"]\.\/direction(?:\.js)?['"]/g, `from '${directionUrl.href}'`);

  const turfUrl = new URL('../node_modules/@turf/turf/dist/esm/index.js', import.meta.url);
  outputText = outputText.replace(/from\s+['"]@turf\/turf['"]/g, `from '${turfUrl.href}'`);

  const polygonClippingUrl = new URL('../node_modules/polygon-clipping/dist/polygon-clipping.esm.js', import.meta.url);
  outputText = outputText.replace(
    /from\s+['"]polygon-clipping['"]/g,
    `from '${polygonClippingUrl.href}'`
  );

  const tmpFile = join(tmpdir(), `layerTransforms-${randomUUID()}.mjs`);
  await writeFile(tmpFile, outputText);
  try {
    return await import(pathToFileURL(tmpFile).href);
  } finally {
    await unlink(tmpFile).catch(() => {});
  }
};

test('catch basin retains zero-valued readings after normalization', async () => {
  const { transformLayerGeojson } = await loadLayerTransforms();

  const fieldMap = {
    label: 'Name',
    inv_n: 'InvN',
    inv_out: 'InvOut',
    ground: 'Ground',
  };

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: {
          Name: 'CB-1',
          InvN: 0,
          InvOut: 0,
          Ground: 0,
        },
      },
    ],
  };

  const result = transformLayerGeojson('Catch Basins / Manholes', geojson, {
    landCoverOptions: [],
    layers: [],
    fieldMap,
  });

  const props = result.features[0].properties;
  assert.strictEqual(props['Invert N [ft]'], 0);
  assert.strictEqual(props['Inv Out [ft]'], 0);
  assert.strictEqual(props['Elevation Ground [ft]'], 0);
});

test('overall drainage area merges polygons into a single feature', async () => {
  const { createOverallDrainageArea } = await loadLayerTransforms();

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0, 1],
              [0.5, 1],
              [0.5, 0],
              [0, 0],
            ],
          ],
        },
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0.5, -0.0000001],
              [0.5, 1.0000001],
              [1, 1],
              [1, 0],
              [0.5, -0.0000001],
            ],
          ],
        },
        properties: {},
      },
    ],
  };

  const merged = createOverallDrainageArea(geojson);
  assert.strictEqual(merged.type, 'FeatureCollection');
  assert.strictEqual(merged.features.length, 1);
  const feature = merged.features[0];
  assert.strictEqual(feature.geometry.type, 'Polygon');
});

test('overall drainage area flattens multipolygon inputs before merging', async () => {
  const { createOverallDrainageArea } = await loadLayerTransforms();

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [0, 0],
                [2, 0],
                [2, 2],
                [0, 2],
                [0, 0],
              ],
            ],
            [
              [
                [4, 0],
                [6, 0],
                [6, 2],
                [4, 2],
                [4, 0],
              ],
            ],
          ],
        },
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [2, -0.5],
              [4, -0.5],
              [4, 2.5],
              [2, 2.5],
              [2, -0.5],
            ],
          ],
        },
        properties: {},
      },
    ],
  };

  const merged = createOverallDrainageArea(geojson);
  assert.strictEqual(merged.features.length, 1);
  const { geometry } = merged.features[0];
  assert.ok(geometry.type === 'Polygon' || geometry.type === 'MultiPolygon');
});
