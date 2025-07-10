import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { intersect, area } from '@turf/turf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

const logs = [];
function addLog(message, type = 'info') {
  const entry = { message, type, source: 'backend', timestamp: Date.now() };
  logs.push(entry);
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

app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.post('/api/intersect', (req, res) => {
  const { polygonA, polygonB } = req.body;
  if (!polygonA || !polygonB) {
    addLog('Intersection request missing polygons', 'error');
    return res.status(400).send('PolygonA and polygonB are required');
  }
  try {
    const geom = intersect(polygonA, polygonB);
    const intersectArea = geom ? area(geom) : 0;
    addLog('Intersection computed');
    res.json({ geometry: geom, area: intersectArea });
  } catch (err) {
    addLog('Intersection computation failed', 'error');
    res.status(500).send('Intersection failed');
  }
});

app.post('/api/area', (req, res) => {
  const { polygon } = req.body;
  if (!polygon) {
    addLog('Area request missing polygon', 'error');
    return res.status(400).send('Polygon is required');
  }
  try {
    const polygonArea = area(polygon);
    addLog('Area computed');
    res.json({ area: polygonArea });
  } catch (err) {
    addLog('Area computation failed', 'error');
    res.status(500).send('Area computation failed');
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  addLog(`Backend listening on port ${port}`);
});
