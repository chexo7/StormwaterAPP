import type { VercelRequest, VercelResponse } from '@vercel/node';
import { XMLParser } from 'fast-xml-parser';

export const config = {
  runtime: 'nodejs',
};

const SDA_ENDPOINT =
  'https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest?format=JSON';

const SDA_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const MAX_SYMBOLS_PER_QUERY = 50;

const letterPattern = /[ABCD]/i;

const xmlParser = new XMLParser({ ignoreAttributes: false, trimValues: true });

const chunkSymbols = (symbols: string[], size: number = MAX_SYMBOLS_PER_QUERY) => {
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += size) {
    chunks.push(symbols.slice(i, i + size));
  }
  return chunks;
};

const sanitizeText = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '';
    return String(value);
  }
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim();
};

const simplifyHsgValue = (value: unknown): string => {
  const raw = sanitizeText(value);
  if (!raw) return '';
  const match = raw.toUpperCase().match(letterPattern);
  return match ? match[0] : '';
};

const escapeSqlLiteral = (value: string = ''): string => value.replace(/'/g, "''");

const extractTablesFromXml = (node: unknown): any[] => {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) {
    return node.flatMap(child => extractTablesFromXml(child));
  }

  const tables: any[] = [];
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key.toLowerCase() === 'table') {
      if (Array.isArray(value)) {
        tables.push(...value);
      } else if (value && typeof value === 'object') {
        tables.push(value);
      }
    } else if (value && typeof value === 'object') {
      tables.push(...extractTablesFromXml(value));
    }
  }
  return tables;
};

const runSdaSql = async (sql: string): Promise<any[]> => {
  const response = await fetch(SDA_ENDPOINT, {
    method: 'POST',
    headers: SDA_HEADERS,
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SDA request failed with status ${response.status}: ${text}`);
  }

  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json') || text.trim().startsWith('{')) {
    const data = JSON.parse(text);
    return Array.isArray(data?.Table) ? data.Table : [];
  }

  const parsed = xmlParser.parse(text || '<root />');
  return extractTablesFromXml(parsed);
};

const parseBody = (req: VercelRequest) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (err) {
      throw new Error('Invalid JSON payload.');
    }
  }
  if (Buffer.isBuffer(req.body)) {
    try {
      return JSON.parse(req.body.toString('utf8'));
    } catch (err) {
      throw new Error('Invalid JSON payload.');
    }
  }
  return req.body;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = parseBody(req);

    const areaSymbolRaw =
      typeof body?.areaSymbol === 'string' ? body.areaSymbol.trim() : '';
    const symbolsRaw = Array.isArray(body?.symbols) ? body.symbols : [];

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

    if (!areaSymbol || symbols.length === 0) {
      return res.status(200).json({ areaSymbol, results: [] });
    }

    const chunks = chunkSymbols(symbols);
    const fetchedRecords = new Map<string, { musym: string; muname: string; hsg: string }>();

    for (const chunk of chunks) {
      const quotedSymbols = chunk.map(sym => `'${escapeSqlLiteral(sym)}'`).join(',');
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
        FROM legend l
        JOIN mapunit m ON l.lkey = m.lkey
        WHERE l.areasymbol = '${escapeSqlLiteral(areaSymbol)}'
          AND m.musym IN (${quotedSymbols});
      `;

      const table = await runSdaSql(sql);
      table.forEach(row => {
        const musym = sanitizeText(row?.musym ?? row?.MUSYM).toUpperCase();
        if (!musym || fetchedRecords.has(musym)) return;
        const muname = sanitizeText(row?.muname ?? row?.MUNAME);
        const hsg = simplifyHsgValue(row?.hsg ?? row?.HSG ?? row?.hydgrp ?? row?.HYDGRP);
        fetchedRecords.set(musym, { musym, muname, hsg });
      });
    }

    const orderedResults = symbols.map(sym => {
      const record = fetchedRecords.get(sym);
      return {
        musym: sym,
        muname: record?.muname ?? '',
        hsg: record?.hsg ?? '',
      };
    });

    return res.status(200).json({ areaSymbol, results: orderedResults });
  } catch (error: any) {
    const message = error?.message || 'Unknown error during SDA lookup';
    return res.status(502).json({ error: message });
  }
}
