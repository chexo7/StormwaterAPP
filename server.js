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

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;
const logLimit = parseInt(process.env.LOG_LIMIT || '100', 10);

const { promises: fsPromises } = fs;

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

app.put('/api/cn-values', async (req, res) => {
  const payload = req.body;
  if (!Array.isArray(payload)) {
    addLog('Invalid payload for CN values update', 'error');
    return res.status(400).json({ error: 'Formato inválido para actualizar valores de CN.' });
  }

  const normalizeRecord = (record, index) => {
    const landCoverRaw = record?.LandCover;
    const landCover = typeof landCoverRaw === 'string' ? landCoverRaw.trim() : '';
    if (!landCover) {
      throw new Error(`Registro ${index + 1}: LandCover es requerido.`);
    }
    const parseNumber = (value, field) => {
      const num = Number(value);
      if (!Number.isFinite(num)) {
        throw new Error(`Registro ${index + 1}: el campo ${field} debe ser numérico.`);
      }
      return num;
    };
    return {
      LandCover: landCover,
      A: parseNumber(record?.A, 'A'),
      B: parseNumber(record?.B, 'B'),
      C: parseNumber(record?.C, 'C'),
      D: parseNumber(record?.D, 'D'),
    };
  };

  let normalized;
  try {
    normalized = payload.map(normalizeRecord);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error de validación desconocido.';
    addLog(`CN values update validation failed: ${message}`, 'error');
    return res.status(400).json({ error: message });
  }

  const filePath = path.join(__dirname, 'public', 'data', 'SCS_CN_VALUES.json');
  try {
    await fsPromises.writeFile(filePath, JSON.stringify(normalized, null, 2));
    addLog('Curve Number values updated');
    res.json({ records: normalized });
  } catch (error) {
    console.error('Failed to persist CN values', error);
    addLog('Failed to persist CN values', 'error');
    res.status(500).json({ error: 'No se pudieron guardar los valores de CN.' });
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
