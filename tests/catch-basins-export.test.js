import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function loadTsxModule(relativePath) {
  const filePath = path.resolve(__dirname, relativePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
    },
    fileName: filePath,
  });
  const module = { exports: {} };
  const fn = new Function('require', 'module', 'exports', outputText);
  fn(require, module, module.exports);
  return module.exports;
}

const { sanitizeCatchBasinsForExport } = loadTsxModule('../utils/exportCatchBasins.ts');

test('catch basins with missing numeric attributes are retained', () => {
  const catchBasinFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [1, 2],
    },
    properties: {
      Label: 'MH-1',
      'Inv Out [ft]': 10,
    },
  };

  const { sanitizedFeatures, nodes } = sanitizeCatchBasinsForExport(
    [catchBasinFeature],
    {
      fieldMap: undefined,
      project: {
        forward: (coords) => coords,
      },
    }
  );

  assert.equal(sanitizedFeatures.length, 1);
  const [sanitized] = sanitizedFeatures;
  assert.equal(sanitized.properties?.['Label'], 'MH-1');
  assert.equal(sanitized.properties?.['Inv Out [ft]'], 10);
  assert.equal(sanitized.properties?.['Elevation Invert[ft]'], 10);
  assert.equal(sanitized.properties?.['Elevation Ground [ft]'], null);
  assert.equal(nodes.length, 1);
  assert.equal(nodes[0]?.invert, 10);
});
