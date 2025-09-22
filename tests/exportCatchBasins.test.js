import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as ts from 'typescript';

const loadModule = async (relativePath) => {
  const sourceUrl = new URL(relativePath, import.meta.url);
  const sourcePath = fileURLToPath(sourceUrl);
  const tsSource = await readFile(sourcePath, 'utf8');
  let { outputText } = ts.transpileModule(tsSource, {
    compilerOptions: {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: sourcePath,
  });

  if (relativePath.endsWith('utils/shp.ts')) {
    const turfEntry = new URL(
      '../node_modules/@turf/turf/dist/esm/index.js',
      import.meta.url
    );
    outputText = outputText.replace(
      /from\s+['"]@turf\/turf['"]/g,
      `from '${turfEntry.href}'`
    );
  }
  const tmpFile = join(tmpdir(), `export-${randomUUID()}.mjs`);
  await writeFile(tmpFile, outputText);
  try {
    return await import(pathToFileURL(tmpFile).href);
  } finally {
    await unlink(tmpFile).catch(() => {});
  }
};

test('catch basin export retains features with missing invert data', async () => {
  const { buildCatchBasinExportData } = await loadModule('../utils/exportCatchBasins.ts');
  const { prepareForShapefile } = await loadModule('../utils/shp.ts');

  const features = [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: {
        Label: 'CB-1',
        'Inv Out [ft]': 10,
        'Elevation Ground [ft]': 12,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [1, 1] },
      properties: {
        Label: 'CB-2',
        'Elevation Ground [ft]': 14,
      },
    },
  ];

  const result = buildCatchBasinExportData({
    features,
    fieldMap: undefined,
    forward: (coord) => coord,
  });

  assert.equal(result.features.length, features.length);
  assert.equal(result.nodes.length, 1, 'only complete records contribute nodes');

  const missingProps = result.features[1].properties;
  assert.ok(Object.prototype.hasOwnProperty.call(missingProps, 'Inv Out [ft]'));
  assert.strictEqual(missingProps['Inv Out [ft]'], null);

  const prepared = prepareForShapefile(
    { type: 'FeatureCollection', features: result.features },
    'Catch Basins / Manholes'
  );

  assert.equal(prepared.features.length, features.length);
  const exportedProps = prepared.features[1].properties;
  const sanitizedKey = 'Inv Out [ft]'.slice(0, 10).replace(/[^A-Za-z0-9_]/g, '_');
  assert.ok(Object.prototype.hasOwnProperty.call(exportedProps, sanitizedKey));
  assert.strictEqual(exportedProps[sanitizedKey], null);
});

