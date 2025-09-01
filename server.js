import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { intersect as turfIntersect, area as turfArea } from '@turf/turf';

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

app.post('/api/export-swmm', (req, res) => {
  const { defaults, subcatchments } = req.body || {};
  if (!defaults || !Array.isArray(subcatchments)) {
    addLog('Invalid payload for SWMM export', 'error');
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const templatePath = path.join(
    __dirname,
    'export_templates',
    'swmm',
    'SWMM_TEMPLATE.inp'
  );

  fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
      addLog('Error reading SWMM template', 'error');
      return res.status(500).send('Unable to read SWMM template');
    }

    try {
      const subcatchLines = [];
      const subareaLines = [];
      const infiltrationLines = [];
      const polygonLines = [];

      subcatchments.forEach((sc, idx) => {
        const name = sc.name || `S${idx + 1}`;
        const coords = sc.polygon;
        if (!Array.isArray(coords)) return;

        const polyFeature = {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: [coords] }
        };
        const areaAcres = turfArea(polyFeature) * 0.000247105;

        subcatchLines.push(
          `${name}               ${defaults.rainGage}                ${defaults.outlet}                ${areaAcres.toFixed(4)}   ${defaults.percentImperv}       ${defaults.width}    ${defaults.percentSlope}      ${defaults.curbLen}`
        );
        subareaLines.push(
          `${name}               ${defaults.nImperv}       ${defaults.nPerv}        ${defaults.sImperv}       ${defaults.sPerv}       ${defaults.pctZero}         ${defaults.routeTo}    ${defaults.pctRouted || 0}`
        );
        infiltrationLines.push(
          `${name}               ${defaults.infParam1}          ${defaults.infParam2}        ${defaults.infParam3}          ${defaults.infParam4}          ${defaults.infParam5}`
        );
        coords.forEach(pt => {
          polygonLines.push(`${name}               ${pt[0]}       ${pt[1]}`);
        });
      });

      const replaceSection = (content, section, lines) => {
        const parts = content.split(/\r?\n/);
        const start = parts.findIndex(l => l === `[${section}]`);
        if (start === -1) return content;
        let end = start + 1;
        while (end < parts.length && !parts[end].startsWith('[')) end++;
        let headerEnd = start + 1;
        while (headerEnd < end && parts[headerEnd].startsWith(';;')) headerEnd++;
        const result = [
          ...parts.slice(0, headerEnd),
          ...lines,
          '',
          ...parts.slice(end)
        ];
        return result.join('\n');
      };

      let content = template;
      content = replaceSection(content, 'SUBCATCHMENTS', subcatchLines);
      content = replaceSection(content, 'SUBAREAS', subareaLines);
      content = replaceSection(content, 'INFILTRATION', infiltrationLines);
      content = replaceSection(content, 'POLYGONS', polygonLines);

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="swmm.inp"');
      addLog('SWMM file generated');
      res.send(content);
    } catch (e) {
      addLog('Error generating SWMM file', 'error');
      res.status(500).send('Error generating SWMM file');
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  addLog(`Backend listening on port ${port}`);
});
