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
