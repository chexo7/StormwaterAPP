import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadTsModule(relativePath) {
  const filePath = path.resolve(__dirname, relativePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  const module = { exports: {} };
  const fn = new Function('require', 'module', 'exports', outputText);
  fn(require, module, module.exports);
  return module.exports;
}

const { prepareForShapefile } = loadTsModule('../utils/shp.ts');

test('prepareForShapefile keeps placeholder pipe attributes', () => {
  const pipeCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
        properties: {
          ID: 'P-1',
          DIAM_IN: null,
          INV_IN: 10.5,
          INV_OUT: null,
        },
      },
    ],
  };

  const prepared = prepareForShapefile(pipeCollection, 'Pipe Network');

  assert.equal(prepared.features.length, 1);
  const [feature] = prepared.features;
  assert.equal(feature.geometry.type, 'LineString');
  assert.deepEqual(feature.geometry.coordinates, [
    [0, 0],
    [1, 1],
  ]);
  assert.equal(feature.properties?.DIAM_IN, '');
  assert.equal(feature.properties?.INV_IN, 10.5);
  assert.equal(feature.properties?.INV_OUT, '');
  assert.equal(feature.properties?.UID, 1);
});

