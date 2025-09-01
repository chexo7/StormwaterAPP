import type { PCSWMMExportInput } from "../types/export-pcswmm";
const CRLF = '\r\n';

function insertAfterSection(inp: string, section: string, block: string): string {
  const re = new RegExp(`\\[${section}\\]\\s*${CRLF}?`, 'i');
  if (!re.test(inp)) throw new Error(`Sección [${section}] no existe en el template`);
  return inp.replace(re, match => match + block + (block.endsWith(CRLF) ? '' : CRLF));
}

function fmt(n: number, d = 3) { return Number.isFinite(n) ? n.toFixed(d) : '0'; }
function sanitizeId(s: string) { return s.replace(/[^\w\-]/g, '_'); }

// ---- Builders (solo drainage areas en este primer paso) ----
export function buildSUBCATCHMENTS(input: PCSWMMExportInput): string {
  const lines = [
    ';Name\tRaingage\tOutlet\tArea(ha)\t%Imperv\tWidth(m)\tSlope\tCurbLen',
    ...input.drainageAreas.map(a => {
      const id = sanitizeId(a.id);
      const outlet = sanitizeId(a.outletNodeId ?? 'OUTLET1');
      const area_ha = a.area_m2 ? (a.area_m2 / 10000) : 0; // m2 -> ha
      return [
        id,
        sanitizeId(a.raingageId || 'RG1'),
        outlet,
        fmt(area_ha, 4),
        fmt(a.pctImperv, 2),
        fmt(a.width_m, 2),
        fmt(a.slope_decimal, 4),
        '0'
      ].join('\t');
    })
  ];
  return lines.join(CRLF) + CRLF;
}

export function buildSUBAREAS(input: PCSWMMExportInput): string {
  const lines = [
    ';Name\tN-Imperv\tN-Perv\tS-Imperv(mm)\tS-Perv(mm)\tpctZero\tRouteTo'
  ];
  for (const a of input.drainageAreas) {
    const id = sanitizeId(a.id);
    const nImp = a.nImperv ?? 0.013;
    const nPerv = a.nPerv ?? 0.24;
    const sImp = a.sImperv_mm ?? 1.27;   // 0.05 in
    const sPerv = a.sPerv_mm ?? 2.54;    // 0.1 in
    const pctZero = a.pctZeroImperv ?? 25;
    lines.push([id, fmt(nImp,3), fmt(nPerv,3), fmt(sImp,2), fmt(sPerv,2), fmt(pctZero,1), 'OUTLET'].join('\t'));
  }
  return lines.join(CRLF) + CRLF;
}

export function buildINFILTRATION(input: PCSWMMExportInput): string {
  // Horton: p1=MaxRate, p2=MinRate, p3=Decay, p4=DryTime, p5=MaxInfil
  const lines = [';Name\tParam1\tParam2\tParam3\tParam4\tParam5'];
  for (const a of input.drainageAreas) {
    const id = sanitizeId(a.id);
    const p = a.infil ?? { p1: 50, p2: 5, p3: 3, p4: 7, p5: 75 }; // defaults
    lines.push([id, fmt(p.p1,2), fmt(p.p2,2), fmt(p.p3,2), fmt(p.p4??7,2), fmt(p.p5??75,1)].join('\t'));
  }
  return lines.join(CRLF) + CRLF;
}

// (mínimos para que el .inp abra si no tienes red)
export function buildOUTFALLS(input: PCSWMMExportInput): string {
  const outfalls = new Set(input.drainageAreas.map(a => sanitizeId(a.outletNodeId ?? 'OUTLET1')));
  const lines = [';Name\tElevation\tType\tStageData'];
  outfalls.forEach(id => lines.push([id, '0', 'FREE', ''].join('\t')));
  return lines.join(CRLF) + CRLF;
}

export { insertAfterSection };

export type { PCSWMMExportInput } from '../types/export-pcswmm';
