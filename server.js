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
    addLog('Invalid SWMM export payload', 'error');
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const templatePath = path.join(
      __dirname,
      'export_templates',
      'swmm',
      'SWMM_TEMPLATE.inp'
    );
    const template = fs.readFileSync(templatePath, 'utf8');
    const start = template.indexOf('[SUBCATCHMENTS]');
    const end = template.indexOf('[PROFILES]');
    const prefix = template.slice(0, start);
    const suffix = template.slice(end);

    const d = defaults;
    let sections = '[SUBCATCHMENTS]\n;;Name           Rain Gage        Outlet           Area     %Imperv  Width    %Slope   CurbLen  SnowPack\n;;-------------- ---------------- ---------------- -------- -------- -------- -------- -------- ----------------\n';
    subcatchments.forEach((sc, i) => {
      const name = sc.name || `S${i + 1}`;
      const area = turfArea(sc.geometry || {});
      const areaA = (area * 0.000247105).toFixed(4);
      sections += `${name.padEnd(15)}${(d.rainGage || '*').padEnd(17)}${
        (d.outlet || '*').padEnd(17)
      }${areaA.padEnd(9)}${String(d.pctImperv || 0).padEnd(9)}${
        String(d.width || 0).padEnd(9)
      }${String(d.slope || 0).padEnd(9)}${
        String(d.curbLen || 0).padEnd(9)
      }${d.snowPack || ''}\n`;
    });

    sections += '\n[SUBAREAS]\n;;Subcatchment   N-Imperv   N-Perv     S-Imperv   S-Perv     PctZero    RouteTo    PctRouted\n;;-------------- ---------- ---------- ---------- ---------- ---------- ---------- ----------\n';
    subcatchments.forEach((sc, i) => {
      const name = sc.name || `S${i + 1}`;
      sections += `${name.padEnd(15)}${String(d.nImperv || 0).padEnd(11)}${
        String(d.nPerv || 0).padEnd(11)
      }${String(d.sImperv || 0).padEnd(11)}${String(d.sPerv || 0).padEnd(11)}${
        String(d.pctZero || 0).padEnd(11)
      }${(d.routeTo || 'OUTLET').padEnd(11)}${String(d.pctRouted || 0)}\n`;
    });

    sections += '\n[INFILTRATION]\n;;Subcatchment   Param1     Param2     Param3     Param4     Param5\n;;-------------- ---------- ---------- ---------- ---------- ----------\n';
    subcatchments.forEach((sc, i) => {
      const name = sc.name || `S${i + 1}`;
      const inf = d.infil || {};
      sections += `${name.padEnd(15)}${String(inf.param1 || 0).padEnd(11)}${
        String(inf.param2 || 0).padEnd(11)
      }${String(inf.param3 || 0).padEnd(11)}${String(inf.param4 || 0).padEnd(11)}${
        String(inf.param5 || 0)
      }\n`;
    });

    sections += '\n[POLYGONS]\n;;Subcatchment   X-Coord            Y-Coord\n;;-------------- ------------------ ------------------\n';
    subcatchments.forEach((sc, i) => {
      const name = sc.name || `S${i + 1}`;
      let coords = [];
      if (sc.geometry && sc.geometry.type === 'Polygon') {
        coords = sc.geometry.coordinates[0];
      } else if (sc.geometry && sc.geometry.type === 'MultiPolygon') {
        coords = sc.geometry.coordinates[0][0];
      }
      coords.forEach(c => {
        sections += `${name.padEnd(15)}${String(c[0]).padEnd(19)}${String(c[1])}\n`;
      });
      sections += '\n';
    });

    const content = prefix + sections + suffix;
    res.type('text/plain').send(content);
  } catch (err) {
    addLog('Failed to export SWMM', 'error');
    res.status(500).json({ error: 'Failed to export SWMM' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  addLog(`Backend listening on port ${port}`);
});
