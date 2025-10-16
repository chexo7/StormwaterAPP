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

const { readFile, writeFile } = fs.promises;

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

const cnValuesPath = path.join(__dirname, 'public', 'data', 'SCS_CN_VALUES.json');

const normalizeCnRecord = (raw, index) => {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`Registro CN ${index + 1} inválido.`);
  }
  const cover = raw.LandCover != null ? String(raw.LandCover).trim() : '';
  if (!cover) {
    throw new Error(`Registro CN ${index + 1}: LandCover es requerido.`);
  }
  const toNumber = (value, label) => {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      throw new Error(`Registro CN ${index + 1}: ${label} debe ser numérico.`);
    }
    return num;
  };
  return {
    LandCover: cover,
    A: toNumber(raw.A, 'HSG A'),
    B: toNumber(raw.B, 'HSG B'),
    C: toNumber(raw.C, 'HSG C'),
    D: toNumber(raw.D, 'HSG D'),
  };
};

const loadCnTable = async () => {
  try {
    const raw = await readFile(cnValuesPath, 'utf-8');
    if (!raw.trim()) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      throw new Error('La tabla de Curve Numbers debe ser un arreglo.');
    }
    return data.map((entry, index) => normalizeCnRecord(entry, index));
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      await writeFile(cnValuesPath, '[]', 'utf-8');
      return [];
    }
    if (err instanceof SyntaxError) {
      throw new Error('La tabla de Curve Numbers contiene JSON inválido.');
    }
    throw err;
  }
};

const saveCnTable = async (records) => {
  await writeFile(cnValuesPath, `${JSON.stringify(records, null, 2)}\n`, 'utf-8');
};

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

app.get('/api/cn-table', async (req, res) => {
  try {
    const records = await loadCnTable();
    addLog('Curve Number table served');
    res.json(records);
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Unable to read Curve Numbers';
    addLog(`Error reading CN table: ${reason}`, 'error');
    res.status(500).json({ error: reason });
  }
});

app.put('/api/cn-table', async (req, res) => {
  const payload = req.body;
  if (!Array.isArray(payload)) {
    return res
      .status(400)
      .json({ error: 'El cuerpo de la solicitud debe ser un arreglo de registros CN.' });
  }

  let normalized;
  try {
    normalized = payload.map((entry, index) => normalizeCnRecord(entry, index));
    const seen = new Set();
    normalized.forEach((record) => {
      const key = record.LandCover.toLowerCase();
      if (seen.has(key)) {
        throw new Error(`Land Cover duplicado: ${record.LandCover}`);
      }
      seen.add(key);
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Datos de Curve Number inválidos.';
    addLog(`Error validando tabla de CN: ${reason}`, 'error');
    return res.status(400).json({ error: reason });
  }

  try {
    await saveCnTable(normalized);
    addLog('Curve Number table updated');
    res.json(normalized);
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'No se pudo guardar la tabla de Curve Numbers.';
    addLog(`Error saving CN table: ${reason}`, 'error');
    res.status(500).json({ error: reason });
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
