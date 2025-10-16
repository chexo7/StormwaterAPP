// utils/landcover.ts
export type CnRecord = {
  LandCover: string;
  A: number;
  B: number;
  C: number;
  D: number;
};

async function requestCnValues(): Promise<CnRecord[]> {
  const res = await fetch('/api/cn-values');
  if (!res.ok) {
    throw new Error(`No se pudieron cargar los valores de CN (HTTP ${res.status}).`);
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error('La respuesta del servidor para los valores de CN es inválida.');
  }
  return data as CnRecord[];
}

export async function loadLandCoverList(): Promise<string[]> {
  const records = await requestCnValues();
  return Array.from(new Set(records.map(record => record?.LandCover).filter(Boolean)));
}

export async function loadCnValues(): Promise<CnRecord[]> {
  return requestCnValues();
}

export async function saveCnValues(records: CnRecord[]): Promise<CnRecord[]> {
  const res = await fetch('/api/cn-values', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(records),
  });
  if (!res.ok) {
    throw new Error(`No se pudieron guardar los valores de CN (HTTP ${res.status}).`);
  }
  const payload = (await res.json()) as { records?: CnRecord[] };
  if (!payload.records || !Array.isArray(payload.records)) {
    throw new Error('La respuesta del servidor al guardar los valores de CN es inválida.');
  }
  return payload.records;
}
