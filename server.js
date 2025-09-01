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
  const { defaults = {}, subcatchments } = req.body || {};
  if (!Array.isArray(subcatchments) || subcatchments.length === 0) {
    addLog('Invalid payload for export-swmm', 'error');
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

    const subIdx = template.indexOf('[SUBCATCHMENTS]');
    const juncIdx = template.indexOf('[JUNCTIONS]');
    const polyIdx = template.indexOf('[POLYGONS]');
    const profIdx = template.indexOf('[PROFILES]');

    const before = template.slice(0, subIdx);
    const middle = template.slice(juncIdx, polyIdx);
    const after = template.slice(profIdx);

    const pctImperv = defaults.pctImperv ?? 25;
    const slope = defaults.slope ?? 0.5;
    const curbLen = defaults.curbLen ?? 0;
    const rainGage = defaults.rainGage ?? '*';
    const outlet = defaults.outlet ?? '*';
    const nImperv = defaults.nImperv ?? 0.01;
    const nPerv = defaults.nPerv ?? 0.1;
    const sImperv = defaults.sImperv ?? 0.05;
    const sPerv = defaults.sPerv ?? 0.05;
    const pctZero = defaults.pctZero ?? 25;
    const routeTo = defaults.routeTo ?? 'OUTLET';
    const pctRouted = defaults.pctRouted ?? 0;
    const p1 = defaults.infilParam1 ?? 3;
    const p2 = defaults.infilParam2 ?? 0.5;
    const p3 = defaults.infilParam3 ?? 4;
    const p4 = defaults.infilParam4 ?? 7;
    const p5 = defaults.infilParam5 ?? 0;

    const subcatchLines = [];
    const subareaLines = [];
    const infilLines = [];
    const polygonLines = [];

    subcatchments.forEach((sc) => {
      const geom = sc.geometry;
      const areaHa = turfArea(geom) / 10000;
      const width = (defaults.widthFactor ? areaHa * defaults.widthFactor : areaHa * 100);
      subcatchLines.push(
        `${sc.name} ${rainGage} ${outlet} ${areaHa.toFixed(4)} ${pctImperv} ${width.toFixed(2)} ${slope} ${curbLen}`
      );
      subareaLines.push(
        `${sc.name} ${nImperv} ${nPerv} ${sImperv} ${sPerv} ${pctZero} ${routeTo} ${pctRouted}`
      );
      infilLines.push(`${sc.name} ${p1} ${p2} ${p3} ${p4} ${p5}`);

      if (geom.type === 'Polygon') {
        geom.coordinates[0].forEach((c) => {
          polygonLines.push(`${sc.name} ${c[0]} ${c[1]}`);
        });
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((poly) => {
          poly[0].forEach((c) => {
            polygonLines.push(`${sc.name} ${c[0]} ${c[1]}`);
          });
        });
      }
    });

    const subs = `[SUBCATCHMENTS]\n;;Name           Rain Gage        Outlet           Area     %Imperv  Width    %Slope   CurbLen  SnowPack\n;;-------------- ---------------- ---------------- -------- -------- -------- -------- -------- ----------------\n${subcatchLines.join('\n')}\n\n[SUBAREAS]\n;;Subcatchment   N-Imperv   N-Perv     S-Imperv   S-Perv     PctZero    RouteTo    PctRouted\n;;-------------- ---------- ---------- ---------- ---------- ---------- ---------- ----------\n${subareaLines.join('\n')}\n\n[INFILTRATION]\n;;Subcatchment   Param1     Param2     Param3     Param4     Param5\n;;-------------- ---------- ---------- ---------- ---------- ----------\n${infilLines.join('\n')}\n\n`;

    const polys = `[POLYGONS]\n;;Subcatchment   X-Coord            Y-Coord\n;;-------------- ------------------ ------------------\n${polygonLines.join('\n')}\n\n`;

    const content = before + subs + middle + polys + after;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="swmm.inp"');
    res.send(content);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  addLog(`Backend listening on port ${port}`);
});
