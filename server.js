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

const cnDataDir = path.join(__dirname, 'data');
const cnDataPath = path.join(cnDataDir, 'cn-table.json');
const defaultCnPath = path.join(
  __dirname,
  'public',
  'data',
  'SCS_CN_VALUES.json'
);

const CN_GROUPS = ['A', 'B', 'C', 'D'];

function normalizeCnRecord(raw, index) {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`Invalid CN record at index ${index}`);
  }

  const name = typeof raw.LandCover === 'string' ? raw.LandCover.trim() : '';
  if (!name) {
    throw new Error(`CN record at index ${index} is missing a LandCover name`);
  }

  const record = { LandCover: name }; // values assigned below
  CN_GROUPS.forEach(group => {
    const value = Number(raw[group]);
    if (!Number.isFinite(value)) {
      throw new Error(
        `CN record "${name}" has an invalid value for group ${group}`
      );
    }
    record[group] = value;
  });

  return record;
}

function loadCnTableFromDisk() {
  try {
    if (fs.existsSync(cnDataPath)) {
      const file = fs.readFileSync(cnDataPath, 'utf-8');
      const parsed = JSON.parse(file);
      return Array.isArray(parsed)
        ? parsed.map(normalizeCnRecord)
        : [];
    }
  } catch (err) {
    console.warn('Failed to load CN table from disk', err);
  }

  try {
    const fallback = fs.readFileSync(defaultCnPath, 'utf-8');
    const parsed = JSON.parse(fallback);
    return Array.isArray(parsed)
      ? parsed.map(normalizeCnRecord)
      : [];
  } catch (err) {
    console.warn('Failed to load default CN table', err);
  }
  return [];
}

let cnTable = loadCnTableFromDisk();

function persistCnTable(records) {
  try {
    if (!fs.existsSync(cnDataDir)) {
      fs.mkdirSync(cnDataDir, { recursive: true });
    }
    fs.writeFileSync(cnDataPath, JSON.stringify(records, null, 2));
  } catch (err) {
    console.error('Failed to persist CN table', err);
  }
}

if (!fs.existsSync(cnDataPath)) {
  persistCnTable(cnTable);
}

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

app.get('/api/cn-table', (req, res) => {
  addLog('Curve Number table served');
  res.json(cnTable);
});

app.put('/api/cn-table', (req, res) => {
  const payload = req.body && req.body.records !== undefined ? req.body.records : req.body;
  if (!Array.isArray(payload)) {
    addLog('Invalid CN table update payload', 'error');
    return res.status(400).json({ error: 'records must be an array' });
  }

  try {
    const seen = new Map();
    const orderedKeys = [];
    payload.forEach((raw, idx) => {
      const normalized = normalizeCnRecord(raw, idx);
      const key = normalized.LandCover.toLowerCase();
      if (!seen.has(key)) {
        orderedKeys.push(key);
      }
      seen.set(key, normalized);
    });
    cnTable = orderedKeys.map(key => seen.get(key));
    persistCnTable(cnTable);
    addLog(`Curve Number table updated with ${cnTable.length} records`);
    res.json({ ok: true, records: cnTable });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid CN table';
    addLog(`Failed to update CN table: ${message}`, 'error');
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
