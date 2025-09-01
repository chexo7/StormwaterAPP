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
  const { defaults = {}, subcatchments = [] } = req.body || {};
  if (!Array.isArray(subcatchments) || subcatchments.length === 0) {
    addLog('No subcatchments provided for SWMM export', 'error');
    return res.status(400).send('No subcatchments provided');
  }
  const templatePath = path.join(
    __dirname,
    'export_templates',
    'swmm',
    'SWMM_TEMPLATE.inp'
  );
  const template = fs.readFileSync(templatePath, 'utf8');
  const top = template.slice(0, template.indexOf('[SUBCATCHMENTS]'));
  const middle = template.slice(
    template.indexOf('[JUNCTIONS]'),
    template.indexOf('[POLYGONS]')
  );
  const bottom = template.slice(template.indexOf('[PROFILES]'));

  const pctImperv = defaults.percentImperv || 25;

  const subcatchLines = subcatchments
    .map(
      sc =>
        `${sc.name}               *                *                ${sc.area.toFixed(4)}   ${pctImperv}       ${(sc.area * 100).toFixed(2)}    0.5      0`
    )
    .join('\n');
  const subcatchSection =
    `[SUBCATCHMENTS]\n;;Name           Rain Gage        Outlet           Area     %Imperv  Width    %Slope   CurbLen  SnowPack\n;;-------------- ---------------- ---------------- -------- -------- -------- -------- -------- ----------------\n${subcatchLines}\n\n`;

  const subareaLines = subcatchments
    .map(
      sc =>
        `${sc.name}               0.01       0.1        0.05       0.05       25         OUTLET`
    )
    .join('\n');
  const subareaSection =
    `[SUBAREAS]\n;;Subcatchment   N-Imperv   N-Perv     S-Imperv   S-Perv     PctZero    RouteTo    PctRouted\n;;-------------- ---------- ---------- ---------- ---------- ---------- ---------- ----------\n${subareaLines}\n\n`;

  const infLines = subcatchments
    .map(sc => `${sc.name}               3          0.5        4          7          0`)
    .join('\n');
  const infSection =
    `[INFILTRATION]\n;;Subcatchment   Param1     Param2     Param3     Param4     Param5\n;;-------------- ---------- ---------- ---------- ---------- ----------\n${infLines}\n\n`;

  const polyLines = subcatchments
    .map(sc => sc.polygon.map(pt => `${sc.name}               ${pt[0]}       ${pt[1]}`).join('\n'))
    .join('\n');
  const polySection =
    `[POLYGONS]\n;;Subcatchment   X-Coord            Y-Coord\n;;-------------- ------------------ ------------------\n${polyLines}\n\n`;

  const content = top + subcatchSection + subareaSection + infSection + middle + polySection + bottom;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="swmm.inp"');
  addLog('SWMM file generated');
  res.send(content);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  addLog(`Backend listening on port ${port}`);
});
