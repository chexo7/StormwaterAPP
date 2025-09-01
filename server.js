import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';
import { intersect as turfIntersect, area as turfArea } from '@turf/turf';
import {
  buildSUBCATCHMENTS,
  buildSUBAREAS,
  buildINFILTRATION,
  buildOUTFALLS,
  insertAfterSection,
} from './lib/pcswwm-writer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;
const logLimit = parseInt(process.env.LOG_LIMIT || '100', 10);

const logs = [];
const featureCollectionLocal = (features) => ({ type: 'FeatureCollection', features });
const toFeature = (poly) =>
  poly.type === 'Feature' ? poly : { type: 'Feature', properties: {}, geometry: poly };
function addLog(message, type = 'info') {
  const entry = { message, type, source: 'backend', timestamp: Date.now() };
  logs.push(entry);
  if (logs.length > logLimit) {
    logs.splice(0, logs.length - logLimit);
  }
  console.log(`[${entry.type.toUpperCase()}] ${entry.message}`);
}

app.use((req, res, next) => {
  addLog(`${req.method} ${req.path}`);
  next();
});

app.get('/api/soil-hsg-map', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'soil-hsg-map.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      addLog('Error reading soil HSG map', 'error');
      res.status(500).send('Unable to read soil HSG map');
    } else {
      addLog('Soil HSG map served');
      res.type('application/json').send(data);
    }
  });
});

app.get('/api/cn-values', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'SCS_CN_VALUES.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      addLog('Error reading CN values', 'error');
      res.status(500).send('Unable to read CN values');
    } else {
      addLog('Curve Number values served');
      res.type('application/json').send(data);
    }
  });
});

app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.post('/api/intersect', (req, res) => {
  const { poly1, poly2 } = req.body || {};

  const isPolygon = (poly) =>
    poly &&
    (poly.type === 'Polygon' ||
      poly.type === 'MultiPolygon' ||
      (poly.type === 'Feature' &&
        poly.geometry &&
        (poly.geometry.type === 'Polygon' ||
          poly.geometry.type === 'MultiPolygon')));

  if (!isPolygon(poly1) || !isPolygon(poly2)) {
    addLog('Invalid polygons for intersection', 'error');
    return res.status(400).json({ error: 'Invalid polygons' });
  }

  try {
    const result = turfIntersect(
      featureCollectionLocal([toFeature(poly1), toFeature(poly2)])
    );
    addLog('Intersection calculated');
    res.json(result || null);
  } catch (err) {
    addLog('Invalid polygons for intersection', 'error');
    res.status(400).json({ error: 'Invalid polygons' });
  }
});

app.post('/api/area', (req, res) => {
  const { polygon } = req.body || {};
  try {
    const result = turfArea(polygon);
    addLog('Area calculated');
    res.json({ area: result });
  } catch (err) {
    addLog('Invalid polygon for area', 'error');
    res.status(400).json({ error: 'Invalid polygon' });
  }
});

app.post('/api/export/pcswwm.zip', async (req, res) => {
  try {
    const input = req.body;
    const tplDir = path.join(__dirname, 'export_templates', 'swmm');
    const inpTpl = await fs.promises.readFile(path.join(tplDir, 'SWMM_TEMPLATE.inp'), 'utf8');

    let inp = inpTpl;
    inp = insertAfterSection(inp, 'SUBCATCHMENTS', buildSUBCATCHMENTS(input));
    inp = insertAfterSection(inp, 'SUBAREAS', buildSUBAREAS(input));
    inp = insertAfterSection(inp, 'INFILTRATION', buildINFILTRATION(input));
    inp = insertAfterSection(inp, 'OUTFALLS', buildOUTFALLS(input));

    const zip = new JSZip();
    zip.file(`${input.projectName || 'project'}.inp`, inp.replace(/\n/g, '\r\n'));
    for (const fname of ['SWMM_TEMPLATE.ini','SWMM_TEMPLATE.thm','SWMM_TEMPLATE.chi','README.md']) {
      try {
        const buf = await fs.promises.readFile(path.join(tplDir, fname));
        zip.file(fname.replace('SWMM_TEMPLATE', input.projectName || 'project'), buf);
      } catch {}
    }

    const content = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${(input.projectName || 'pcswmm_export')}.zip"`);
    res.status(200).send(content);
    addLog('PCSWMM export generated');
  } catch (e) {
    addLog(`PCSWMM export failed: ${e.message}`, 'error');
    res.status(400).json({ error: e.message });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  addLog(`Backend listening on port ${port}`);
});
