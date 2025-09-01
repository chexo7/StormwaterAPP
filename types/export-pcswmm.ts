export type DrainageArea = {
  id: string;              // sin espacios
  area_m2: number;         // o acres -> conviertele antes
  pctImperv: number;       // 0–100
  width_m: number;         // "Width" SWMM
  slope_decimal: number;   // 0.01 = 1 %
  raingageId: string;      // si no tienes, usa "RG1"
  outletNodeId?: string;   // si no tienes red, usa "OUTLET1"
  // Parámetros de subárea (defaults sensatos)
  nImperv?: number;  nPerv?: number;
  sImperv_mm?: number; sPerv_mm?: number;
  pctZeroImperv?: number;
  // Infiltración (Horton por defecto aquí; ajusta a tu gusto)
  infil?: { p1: number; p2: number; p3: number; p4?: number; p5?: number };
}
export type PCSWMMExportInput = {
  projectName: string;
  flowUnits: 'LPS' | 'CMS' | 'CFS';
  infiltration: 'HORTON' | 'GREEN_AMPT' | 'CURVE_NUMBER';
  routing: 'KINWAVE' | 'DW' | 'SW';
  startDate: string; endDate: string; // YYYY-MM-DD
  drainageAreas: DrainageArea[];
};
