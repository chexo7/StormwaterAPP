import { XMLParser } from 'fast-xml-parser';

export const SDA_ENDPOINT =
  'https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest?format=JSON';
export const SDA_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
export const MAX_SYMBOLS_PER_QUERY = 50;

const xmlParser = new XMLParser({ ignoreAttributes: false, trimValues: true });
const letterPattern = /[ABCD]/i;

export const chunkSymbols = (symbols, size = MAX_SYMBOLS_PER_QUERY) => {
  const chunks = [];
  for (let i = 0; i < symbols.length; i += size) {
    chunks.push(symbols.slice(i, i + size));
  }
  return chunks;
};

export const escapeSqlLiteral = (value = '') => value.replace(/'/g, "''");

export const sanitizeText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '';
    return String(value);
  }
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim();
};

export const simplifyHsgValue = value => {
  const raw = sanitizeText(value);
  if (!raw) return '';
  const match = raw.toUpperCase().match(letterPattern);
  return match ? match[0] : '';
};

const extractTablesFromXml = node => {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) {
    return node.flatMap(child => extractTablesFromXml(child));
  }

  const tables = [];
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

export const runSdaSql = async sql => {
  const response = await fetch(SDA_ENDPOINT, {
    method: 'POST',
    headers: SDA_HEADERS,
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    throw new Error(`SDA request failed with status ${response.status}`);
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
