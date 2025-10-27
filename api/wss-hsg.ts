/// <reference types="node" />

import { XMLParser } from 'fast-xml-parser';

const SDA_ENDPOINT =
  'https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest?format=JSON';
const SDA_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
const MAX_SYMBOLS_PER_QUERY = 50;

const letterPattern = /[ABCD]/i;

const xmlParser = new XMLParser({ ignoreAttributes: false, trimValues: true });

const chunkSymbols = (symbols: string[], size = MAX_SYMBOLS_PER_QUERY): string[][] => {
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

const escapeSqlLiteral = (value = ''): string => value.replace(/'/g, "''");

const extractTablesFromXml = (node: any): any[] => {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) {
    return node.flatMap(child => extractTablesFromXml(child));
  }

  const tables: any[] = [];
  for (const [key, value] of Object.entries(node)) {
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

const parseJsonBody = async (req: any): Promise<any> => {
  if (typeof req.body === 'string') {
    if (!req.body.trim()) return {};
    return JSON.parse(req.body);
  }

  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req as AsyncIterable<any>) {
    if (chunk === undefined || chunk === null) continue;
    if (typeof chunk === 'string') {
      chunks.push(Buffer.from(chunk));
    } else if (chunk instanceof ArrayBuffer) {
      chunks.push(Buffer.from(chunk));
    } else if (ArrayBuffer.isView(chunk)) {
      chunks.push(
        Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
      );
    } else if (Buffer.isBuffer(chunk)) {
      chunks.push(chunk);
    } else {
      chunks.push(Buffer.from(String(chunk)));
    }
  }

  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  return JSON.parse(raw);
};

const runSdaSql = async (sql: string): Promise<any[]> => {
  const response = await fetch(SDA_ENDPOINT, {
    method: 'POST',
    headers: SDA_HEADERS,
    body: JSON.stringify({ query: sql }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`SDA request failed with status ${response.status}: ${text}`);
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json') || text.trim().startsWith('{')) {
    const data = JSON.parse(text);
    return Array.isArray((data as any)?.Table) ? (data as any).Table : [];
  }

  const parsed = xmlParser.parse(text || '<root />');
  return extractTablesFromXml(parsed);
};

export const config = { runtime: 'nodejs18.x' };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let payload: any = {};
  try {
    payload = await parseJsonBody(req);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const areaSymbolRaw = typeof payload?.areaSymbol === 'string' ? payload.areaSymbol.trim() : '';
  const areaSymbol = areaSymbolRaw.toUpperCase();
  const symbolValues = Array.isArray(payload?.symbols) ? payload.symbols : [];

  const symbolSet = new Set<string>();
  symbolValues.forEach((value: unknown) => {
    const sanitized = sanitizeText(value).toUpperCase();
    if (sanitized) {
      symbolSet.add(sanitized);
    }
  });

  const symbols = Array.from(symbolSet);

  if (!areaSymbol || symbols.length === 0) {
    return res.status(200).json({ areaSymbol, results: [] });
  }

  try {
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
        const musym = sanitizeText((row as any)?.musym ?? (row as any)?.MUSYM).toUpperCase();
        if (!musym || fetchedRecords.has(musym)) return;
        const muname = sanitizeText((row as any)?.muname ?? (row as any)?.MUNAME);
        const hsg = simplifyHsgValue(
          (row as any)?.hsg ?? (row as any)?.HSG ?? (row as any)?.hydgrp ?? (row as any)?.HYDGRP
        );
        fetchedRecords.set(musym, { musym, muname, hsg });
      });
    }

    const orderedResults = symbols.map(sym => {
      const record = fetchedRecords.get(sym) || null;
      return {
        musym: sym,
        muname: record?.muname ?? '',
        hsg: record?.hsg ?? '',
      };
    });

    return res.status(200).json({ areaSymbol, results: orderedResults });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during SDA lookup';
    return res.status(502).json({ error: message });
  }
}
