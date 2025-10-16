import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { intersect as turfIntersectRaw, area as turfArea } from '@turf/turf';
import processFileMap from './process-file-map.json' assert { type: 'json' };

// processFileMap maps backend processes (e.g., exportHydroCAD, exportSWMM,
// exportShapefiles) to the spatial data layers they require. Update
// process-file-map.json whenever process requirements change so future
// automation can determine which files are needed for each operation.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cnValuesPath = path.join(__dirname, 'public', 'data', 'SCS_CN_VALUES.json');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;
const logLimit = parseInt(process.env.LOG_LIMIT || '100', 10);

const logs = [];
const toFeature = (poly) =>
  poly.type === 'Feature' ? poly : { type: 'Feature', properties: {}, geometry: poly };
const turfIntersect = (a, b) =>
  turfIntersectRaw({ type: 'FeatureCollection', features: [a, b] });
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
  fs.readFile(cnValuesPath, (err, data) => {
    if (err) {
      addLog('Error reading CN values', 'error');
      res.status(500).send('Unable to read CN values');
    } else {
      addLog('Curve Number values served');
      res.type('application/json').send(data);
    }
  });
});

app.put('/api/cn-values', async (req, res) => {
  const payload = req.body;
  if (!Array.isArray(payload)) {
    addLog('Invalid CN values payload', 'error');
    return res.status(400).json({ error: 'Formato inválido para los valores de CN.' });
  }

  try {
    const sanitizeNumber = (value, label) => {
      const num = Number(value);
      if (!Number.isFinite(num)) {
        throw new Error(`El valor de ${label} debe ser numérico.`);
      }
      if (num < 0 || num > 100) {
        throw new Error(`El valor de ${label} debe estar entre 0 y 100.`);
      }
      return Math.round(num * 100) / 100;
    };

    const sanitized = payload.map((item, index) => {
      const rawName = item && typeof item.LandCover === 'string' ? item.LandCover : '';
      const landCover = rawName.trim();
      if (!landCover) {
        throw new Error(`La fila ${index + 1} no tiene Land Cover.`);
      }
      return {
        LandCover: landCover,
        A: sanitizeNumber(item?.A, `CN-A (fila ${index + 1})`),
        B: sanitizeNumber(item?.B, `CN-B (fila ${index + 1})`),
        C: sanitizeNumber(item?.C, `CN-C (fila ${index + 1})`),
        D: sanitizeNumber(item?.D, `CN-D (fila ${index + 1})`),
      };
    });

    const seen = new Set();
    sanitized.forEach(record => {
      const key = record.LandCover.toLowerCase();
      if (seen.has(key)) {
        throw new Error(`Land Cover duplicado: ${record.LandCover}`);
      }
      seen.add(key);
    });

    await fs.promises.writeFile(cnValuesPath, JSON.stringify(sanitized, null, 2), 'utf8');
    addLog('Curve Number values updated');
    res.status(204).send();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudieron guardar los valores de CN.';
    addLog(`Error updating CN values: ${message}`, 'error');
    res.status(400).json({ error: message });
  }
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
    const result = turfIntersect(toFeature(poly1), toFeature(poly2));
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

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  addLog(`Backend listening on port ${port}`);
});
