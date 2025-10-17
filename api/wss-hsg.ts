import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  chunkSymbols,
  escapeSqlLiteral,
  runSdaSql,
  sanitizeText,
  simplifyHsgValue,
} from '../utils/server/sda.js';

export const config = {
  runtime: 'nodejs18.x',
};

type RecordValue = string | number | null | undefined;

type RawRecord = {
  [key: string]: RecordValue;
};

type RequestBody = {
  areaSymbol?: RecordValue;
  symbols?: RecordValue[];
};

const normalizeSymbolList = (symbols: unknown): string[] => {
  if (!Array.isArray(symbols)) return [];
  const set = new Set<string>();
  symbols.forEach(value => {
    if (value === null || value === undefined) return;
    const normalized = String(value).trim().toUpperCase();
    if (normalized) set.add(normalized);
  });
  return Array.from(set);
};

const ensureJsonBody = (req: VercelRequest): RequestBody => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as RequestBody;
    } catch {
      return {};
    }
  }
  return req.body as RequestBody;
};

const mapRow = (row: RawRecord): { musym: string; muname: string; hsg: string } => {
  const musym = sanitizeText(row?.musym ?? row?.MUSYM).toUpperCase();
  const muname = sanitizeText(row?.muname ?? row?.MUNAME);
  const hsg = simplifyHsgValue(row?.hsg ?? row?.HSG ?? row?.hydgrp ?? row?.HYDGRP);
  return {
    musym,
    muname,
    hsg,
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = ensureJsonBody(req);
  const areaSymbolRaw =
    typeof body.areaSymbol === 'string' ? body.areaSymbol.trim() : sanitizeText(body.areaSymbol);
  const areaSymbol = areaSymbolRaw.toUpperCase();
  const symbols = normalizeSymbolList(body.symbols);

  if (!areaSymbol || symbols.length === 0) {
    return res.status(200).json({ areaSymbol, results: [] });
  }

  try {
    const chunks = chunkSymbols(symbols);
    const fetchedRecords = new Map<string, ReturnType<typeof mapRow>>();

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
        const record = mapRow(row as RawRecord);
        if (!record.musym) return;
        if (!fetchedRecords.has(record.musym)) {
          fetchedRecords.set(record.musym, record);
        }
      });
    }

    const results = symbols.map(sym => {
      const record = fetchedRecords.get(sym);
      if (!record) {
        return { musym: sym, muname: '', hsg: '' };
      }
      return { musym: sym, muname: record.muname, hsg: record.hsg };
    });

    return res.status(200).json({ areaSymbol, results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown SDA error';
    return res.status(502).json({ error: message });
  }
}
