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

const SDA_ENDPOINT =
  'https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest?format=JSON';
const SDA_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
const MAX_SYMBOLS_PER_QUERY = 50;

const chunkSymbols = (symbols, size = MAX_SYMBOLS_PER_QUERY) => {
  const chunks = [];
  for (let i = 0; i < symbols.length; i += size) {
    chunks.push(symbols.slice(i, i + size));
  }
  return chunks;
};

const escapeSqlLiteral = (value = '') => value.replace(/'/g, "''");

const decodeXmlEntities = value =>
  String(value)
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));

const parseXmlTable = text => {
  const rows = [];
  const tableRegex = /<Table>([\s\S]*?)<\/Table>/gi;
  let tableMatch;
  while ((tableMatch = tableRegex.exec(text))) {
    const rowText = tableMatch[1];
    const row = {};
    const colRegex = /<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g;
    let colMatch;
    while ((colMatch = colRegex.exec(rowText))) {
      const [, key, rawValue] = colMatch;
      row[key] = decodeXmlEntities(rawValue.trim());
    }
    rows.push(row);
  }
  return rows;
};

const parseSdaTable = async response => {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!text) return [];

  const attemptJsonParse = payload => {
    try {
      const json = JSON.parse(payload);
      return Array.isArray(json?.Table) ? json.Table : [];
    } catch (err) {
      return null;
    }
  };

  if (contentType.includes('application/json')) {
    const table = attemptJsonParse(text);
    if (table) return table;
  }

  const jsonFallback = attemptJsonParse(text);
  if (jsonFallback) return jsonFallback;

  if (contentType.includes('xml') || /<Table>/i.test(text)) {
    return parseXmlTable(text);
  }

  throw new Error('Unexpected SDA response format');
};

const sanitizeText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : '';
  }
  return String(value).trim();
};

const sanitizeSymbol = value => sanitizeText(value).toUpperCase();

const cleanHsgToken = raw => {
  const text = sanitizeText(raw).toUpperCase();
  if (!text) return '';
  const match = text.match(/[ABCD]/);
  return match ? match[0] : '';
};

const selectDominantHsg = counts => {
  let dominant = '';
  let dominantCount = 0;
  counts.forEach((count, token) => {
    if (count > dominantCount || (count === dominantCount && token < dominant)) {
      dominant = token;
      dominantCount = count;
    }
  });
  return dominant;
};
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

app.post('/api/wss-hsg', async (req, res) => {
  const areaSymbolRaw =
    typeof req.body?.areaSymbol === 'string' ? req.body.areaSymbol.trim() : '';
  const symbolsRaw = Array.isArray(req.body?.symbols) ? req.body.symbols : [];

  const areaSymbol = areaSymbolRaw.toUpperCase();
  const symbolSet = new Set(
    symbolsRaw
      .map(value => {
        if (value === null || value === undefined) return '';
        return String(value).trim().toUpperCase();
      })
      .filter(Boolean)
  );

  const symbols = Array.from(symbolSet);

  if (symbols.length === 0) {
    addLog('WSS HSG lookup skipped due to missing MUSYM symbols', 'warn');
    return res.json({ areaSymbol, results: [] });
  }

  try {
    const aggregated = new Map();
    for (const chunk of chunkSymbols(symbols)) {
      const quotedSymbols = chunk
        .map(sym => `'${escapeSqlLiteral(sym)}'`)
        .join(',');
      const sql = `
        SELECT
          m.musym,
          m.muname,
          (
            SELECT TOP 1 c.hydgrp
            FROM component c
            WHERE c.mukey = m.mukey
            ORDER BY c.comppct_r DESC
          ) AS hsg
        FROM mapunit m
        WHERE m.musym IN (${quotedSymbols});
      `;

      const response = await fetch(SDA_ENDPOINT, {
        method: 'POST',
        headers: SDA_HEADERS,
        body: JSON.stringify({ query: sql }),
      });

      if (!response.ok) {
        throw new Error(`SDA request failed with status ${response.status}`);
      }

      const table = await parseSdaTable(response);
      table.forEach(row => {
        const musym = sanitizeSymbol(row?.musym ?? row?.MUSYM ?? '');
        if (!musym) return;
        const muname = sanitizeText(row?.muname ?? row?.MUNAME ?? '');
        const token = cleanHsgToken(row?.hsg ?? row?.HSG ?? row?.hydgrp ?? row?.HYDGRP ?? '');
        if (!aggregated.has(musym)) {
          aggregated.set(musym, {
            musym,
            muname,
            counts: new Map(),
          });
        }
        const entry = aggregated.get(musym);
        if (muname && !entry.muname) {
          entry.muname = muname;
        }
        if (token) {
          entry.counts.set(token, (entry.counts.get(token) ?? 0) + 1);
        }
      });
    }

    const results = symbols.map(symbol => {
      const musym = sanitizeSymbol(symbol);
      const entry = aggregated.get(musym);
      if (!entry) {
        return { musym, muname: '', hsg: '' };
      }
      const hsg = selectDominantHsg(entry.counts);
      return { musym, muname: entry.muname || '', hsg };
    });

    const matchedCount = results.filter(record => record.hsg).length;
    const areaInfo = areaSymbol ? ` for area symbol ${areaSymbol}` : '';
    addLog(
      `Fetched HSG data for ${matchedCount}/${symbols.length} MUSYM records${areaInfo}.`
    );
    res.json({ areaSymbol, results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error during SDA lookup';
    addLog(`Failed SDA lookup for ${areaSymbol}: ${message}`, 'error');
    res.status(502).json({ error: message });
  }
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
